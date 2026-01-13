import GithubFinder from "@/components/tools/GithubFinder";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub User Finder",
  description: "Cari profil developer dan repository terbaru menggunakan GitHub API.",
};

export default function GithubPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">GitHub Profile Finder</h1>
        <p className="text-emerald-500">
          Intip profil developer, statistik, dan project terbaru mereka.
        </p>
      </div>
      
      <GithubFinder />
    </div>
  );
}