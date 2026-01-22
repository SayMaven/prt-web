// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type CloudinaryImage = {
  id: string;
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  tags: string[];
  folder?: string; // <--- UPDATE 1: Tambah tipe data folder (Opsional)
};

export async function getGalleryImages(folderInput: string | string[]): Promise<CloudinaryImage[]> {
  try {
    let folderExpression = "";

    // LOGIKA QUERY
    if (Array.isArray(folderInput)) {
      const queries = folderInput.map(folder => `folder:"${folder}/*"`);
      folderExpression = `(${queries.join(' OR ')})`; 
    } else {
      folderExpression = `folder:"${folderInput}/*"`;
    }

    const finalExpression = `${folderExpression} AND resource_type:image`;

    const results = await cloudinary.search
      .expression(finalExpression)
      .with_field('tags') 
      .with_field('context') // Opsional: ambil metadata tambahan
      .sort_by('created_at', 'desc') 
      .max_results(500)
      .execute();

    console.log(`🔍 Cloudinary: Ditemukan ${results.total_count} gambar.`);

    return results.resources.map((result: any) => ({
      id: result.asset_id,
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      tags: result.tags || [],
      // UPDATE 2: Ambil nama folder dari 'asset_folder' (struktur baru) atau 'folder' (lama)
      folder: result.asset_folder || result.folder || "", 
    }));
  } catch (error) {
    console.error(" Cloudinary Error:", error);
    return [];
  }
}