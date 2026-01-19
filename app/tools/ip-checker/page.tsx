import IpChecker from "@/components/tools/IpChecker";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek IP Address Saya & Lokasi | SayMaven",
  description: "Cek IP Address publik, lokasi, ISP, dan info perangkat Anda secara akurat.",
};

export default function Page() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          My IP & Location
        </h1>
        <p className="text-slate-400">
          Deteksi otomatis alamat IP, provider internet, dan lokasimu saat ini.
        </p>
      </div>

      <IpChecker />
    </div>
  );
}