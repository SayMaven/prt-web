import KeyMaster from "@/components/tools/KeyMaster";
import { Metadata } from "next";
import { Keyboard } from "lucide-react"; 

export const metadata: Metadata = {
  title: "KeyMaster | Keyboard & NKRO Tester",
  description: "Test mechanical keyboard switches, N-Key Rollover, and input latency.",
};

export default function KeyMasterPage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      
      {/* HEADER PINDAHAN DARI COMPONENT */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
           <Keyboard className="text-emerald-400" size={32}/> KeyMaster
        </h1>
        <p className="text-slate-400">
          Uji switch keyboard, cek ghosting (NKRO), dan latensi input.
        </p>
      </div>

      {/* COMPONENT LOGIC */}
      <KeyMaster />
      
    </div>
  );
}