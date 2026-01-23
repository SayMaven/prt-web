import PdfTools from "@/components/tools/PdfTools";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Merger | SayMaven Tools",
  description: "Gabungkan file PDF secara online, gratis, dan aman (Client-side).",
};

export default function PDFMergerPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <PdfTools />
    </div>
  );
}