"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MapPin, Users, BookOpen, Star, Github, ExternalLink, Activity, FolderGit2, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [searchedUser, setSearchedUser] = useState("");
  const [profile, setProfile] = useState<GithubProfile | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [repoLoading, setRepoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const perPage = 6;

  const fetchProfile = async (user: string) => {
    setLoading(true);
    setError(null);
    setProfile(null);
    setRepos([]);
    setPage(1);

    try {
      const profileRes = await fetch(`https://api.github.com/users/${user}`);
      if (!profileRes.ok) throw new Error("User tidak ditemukan 😭");
      const profileData = await profileRes.json();
      setProfile(profileData);
      
      await fetchRepos(user, 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepos = async (user: string, pageNum: number) => {
    setRepoLoading(true);
    try {
      const repoRes = await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=${perPage}&page=${pageNum}`);
      const repoData = await repoRes.json();
      setRepos(repoData);
    } catch (err) {
      console.error(err);
    } finally {
      setRepoLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setSearchedUser(username.trim());
    fetchProfile(username.trim());
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRepos(searchedUser, nextPage);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      fetchRepos(searchedUser, prevPage);
    }
  };

  const hasMoreRepos = repos.length === perPage && profile && (page * perPage) < profile.public_repos;

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* --- FORM PENCARIAN --- */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto">
        <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[color:var(--accent)] transition-colors">
                <Github size={20} />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username (e.g. vercel)"
              className="w-full bg-transparent border-2 rounded-2xl pl-12 pr-6 py-4 outline-none text-lg transition-all shadow-sm"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--card-border)"}
            />
        </div>
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="px-8 py-4 font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
          style={{ background: "var(--accent)", color: "var(--page-bg)" }}
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--page-bg)", borderTopColor: "transparent" }}></div>
          ) : (
             <><Search size={20} strokeWidth={3} /> Search</>
          )}
        </button>
      </form>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 font-bold mb-8 max-w-2xl mx-auto animate-in shake">
          {error}
        </div>
      )}

      {/* --- HASIL PENCARIAN --- */}
      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-500">
          
          {/* KOLOM KIRI: PROFILE CARD */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl p-8 text-center sticky top-24 border shadow-xl" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              <div className="relative w-40 h-40 mx-auto mb-6 group">
                <div className="absolute inset-0 rounded-full animate-pulse blur-xl opacity-50" style={{ background: "var(--accent)" }}></div>
                <Image
                  src={profile.avatar_url}
                  alt={profile.login}
                  fill
                  className="rounded-full border-4 object-cover relative z-10 transition-transform group-hover:scale-105"
                  style={{ borderColor: "var(--card-bg)" }}
                />
              </div>
              <h2 className="text-3xl font-extrabold mb-1" style={{ color: "var(--text-primary)" }}>{profile.name || profile.login}</h2>
              <a href={profile.html_url} target="_blank" className="font-mono text-sm hover:underline mb-6 inline-flex items-center gap-1 transition-colors" style={{ color: "var(--accent)" }}>
                @{profile.login} <ExternalLink size={14} />
              </a>
              <p className="text-sm mb-8 leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
                {profile.bio || "No bio available."}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 rounded-2xl p-4 mb-8 border" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)" }}>
                <div className="flex flex-col items-center">
                  <BookOpen size={18} className="mb-2" style={{ color: "var(--accent)" }} />
                  <div className="font-extrabold text-lg" style={{ color: "var(--text-primary)" }}>{profile.public_repos}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Repos</div>
                </div>
                <div className="flex flex-col items-center">
                  <Users size={18} className="mb-2" style={{ color: "var(--accent)" }} />
                  <div className="font-extrabold text-lg" style={{ color: "var(--text-primary)" }}>{profile.followers}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Followers</div>
                </div>
                <div className="flex flex-col items-center">
                  <Activity size={18} className="mb-2" style={{ color: "var(--accent)" }} />
                  <div className="font-extrabold text-lg" style={{ color: "var(--text-primary)" }}>{profile.following}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Following</div>
                </div>
              </div>

              {profile.location && (
                <div className="flex items-center justify-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <MapPin size={16} style={{ color: "var(--accent)" }} />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: REPOSITORY LIST */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-end mb-6">
                <h3 className="text-2xl font-extrabold flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
                <FolderGit2 size={28} style={{ color: "var(--accent)" }} /> Repositories
                </h3>
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg border" style={{ background: "var(--card-bg)", color: "var(--text-muted)", borderColor: "var(--card-border)" }}>
                    Page {page}
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative min-h-[300px]">
              {repoLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.1)" }}>
                      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}></div>
                  </div>
              )}
                
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  className="block p-6 rounded-2xl border transition-all hover:scale-[1.02] shadow-sm hover:shadow-xl group flex flex-col h-full relative overflow-hidden"
                  style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--card-border)"}
                >
                  <div className="absolute top-0 left-0 w-1 h-full scale-y-0 group-hover:scale-y-100 transition-transform origin-top" style={{ background: "var(--accent)" }}></div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg pr-4 line-clamp-1 group-hover:underline" style={{ color: "var(--accent)" }}>
                      {repo.name}
                    </h4>
                  </div>
                  <p className="text-sm mb-6 line-clamp-2 flex-grow font-medium" style={{ color: "var(--text-secondary)" }}>
                    {repo.description || "No description provided."}
                  </p>
                  <div className="flex items-center justify-between text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                    <div className="flex items-center gap-4">
                        {repo.language && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)" }}>
                                <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }}></span>
                                {repo.language}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                        <Star size={14} /> {repo.stargazers_count}
                        </span>
                    </div>
                  </div>
                </a>
              ))}
              
              {repos.length === 0 && !repoLoading && (
                <div className="col-span-1 md:col-span-2 text-center py-12 border-2 border-dashed rounded-3xl" style={{ borderColor: "var(--card-border)" }}>
                    <p className="text-lg font-bold" style={{ color: "var(--text-muted)" }}>Tidak ada repository publik ditemukan.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {repos.length > 0 && (
                <div className="flex justify-center gap-4 mt-8 pt-8 border-t" style={{ borderColor: "var(--card-border)" }}>
                    <button 
                        onClick={handlePrevPage}
                        disabled={page === 1 || repoLoading}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[color:var(--page-bg)]"
                        style={{ background: "var(--card-bg)", color: "var(--text-primary)", borderColor: "var(--card-border)" }}
                    >
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button 
                        onClick={handleNextPage}
                        disabled={!hasMoreRepos || repoLoading}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[color:var(--page-bg)]"
                        style={{ background: "var(--card-bg)", color: "var(--text-primary)", borderColor: "var(--card-border)" }}
                    >
                        Next <ChevronRight size={18} />
                    </button>
                </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}