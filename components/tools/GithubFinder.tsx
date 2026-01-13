"use client";

import { useState } from "react";
import Image from "next/image"; // Kita pakai Image Next.js untuk optimasi avatar

// Definisikan Tipe Data untuk Response API GitHub (Supaya TypeScript senang)
type GithubProfile = {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location: string;
  created_at: string;
};

type GithubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
};

export default function GithubFinder() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<GithubProfile | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setProfile(null);
    setRepos([]);

    try {
      // 1. Fetch Profile Data
      const profileRes = await fetch(`https://api.github.com/users/${username}`);
      if (!profileRes.ok) throw new Error("User tidak ditemukan 😭");
      const profileData = await profileRes.json();

      // 2. Fetch Repository Data (Ambil 6 repo terbaru)
      const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=6`);
      const repoData = await repoRes.json();

      setProfile(profileData);
      setRepos(repoData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* --- FORM PENCARIAN --- */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-10 max-w-2xl mx-auto">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Masukkan username GitHub (contoh: vercel)"
          className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? "Mencari..." : "Cari 🔍"}
        </button>
      </form>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="text-center p-8 bg-red-900/20 border border-red-800 rounded-xl text-red-400 mb-8">
          {error}
        </div>
      )}

      {/* --- HASIL PENCARIAN --- */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* KOLOM KIRI: PROFILE CARD */}
          <div className="md:col-span-1">
            <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 text-center sticky top-24">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={profile.avatar_url}
                  alt={profile.login}
                  fill
                  className="rounded-full border-4 border-slate-700 object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
              <a href={profile.html_url} target="_blank" className="text-blue-400 hover:underline mb-4 block">
                @{profile.login}
              </a>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                {profile.bio || "Tidak ada bio."}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/50 rounded-lg p-4 mb-6">
                <div>
                  <div className="font-bold text-white">{profile.public_repos}</div>
                  <div className="text-xs text-slate-500">Repos</div>
                </div>
                <div>
                  <div className="font-bold text-white">{profile.followers}</div>
                  <div className="text-xs text-slate-500">Followers</div>
                </div>
                <div>
                  <div className="font-bold text-white">{profile.following}</div>
                  <div className="text-xs text-slate-500">Following</div>
                </div>
              </div>

              {profile.location && (
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <span>📍 {profile.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: REPOSITORY LIST */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              📂 Repository Terbaru
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  className="block p-5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-blue-400 group-hover:underline text-lg">
                      {repo.name}
                    </h4>
                    <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400 border border-slate-700">
                      {repo.language || "N/A"}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {repo.description || "Tidak ada deskripsi."}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      ⭐ {repo.stargazers_count}
                    </span>
                    <span>Updated Recently</span>
                  </div>
                </a>
              ))}
              
              {repos.length === 0 && (
                <p className="text-slate-500 italic">User ini belum punya repository publik.</p>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}