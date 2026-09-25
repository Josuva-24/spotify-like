"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Home,
  Heart,
  Settings2,
  Radio,
  Disc3,
  Layers,
  Database,
  ExternalLink,
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

interface SidebarProps {
  className?: string;
  activeFilter?: string;
  setActiveFilter?: (filter: string) => void;
}

export function Sidebar({ className, activeFilter, setActiveFilter }: SidebarProps) {
  const pathname = usePathname();
  const { likedSongIds, setIs3DModalOpen } = usePlayer();

  const isHome = pathname === "/";
  const isAdmin = pathname === "/admin";

  const handleFilterClick = (filter: string) => {
    if (setActiveFilter) {
      setActiveFilter(filter);
    }
  };

  return (
    <aside
      className={`w-64 flex-shrink-0 bg-zinc-950/70 border-r border-white/5 flex flex-col justify-between p-5 select-none ${className}`}
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-2.5 px-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-zinc-950" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              SOUNDWAVE
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/10 text-emerald-400">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-zinc-500 font-medium">Cloud Audio Streaming</p>
          </div>
        </Link>

        {/* Main Navigation */}
        <nav className="space-y-1">
          <Link
            href="/"
            onClick={() => handleFilterClick("all")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isHome && (!activeFilter || activeFilter === "all")
                ? "bg-white/10 text-white shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Home</span>
          </Link>

          <button
            onClick={() => handleFilterClick("liked")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeFilter === "liked"
                ? "bg-white/10 text-white shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Liked Tracks</span>
            </div>
            {likedSongIds.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                {likedSongIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIs3DModalOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <Disc3 className="w-4 h-4 text-cyan-400" />
            <span>3D Vinyl Studio</span>
          </button>

          <Link
            href="/admin"
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isAdmin
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings2 className="w-4 h-4 text-emerald-400" />
              <span>Admin Studio</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              CRUD
            </span>
          </Link>
        </nav>

        {/* Discovery & Vibe categories */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          <p className="px-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Moods & Genres
          </p>
          <div className="space-y-1">
            {[
              { label: "All Sounds", id: "all" },
              { label: "Synthwave / Cyber", id: "synth" },
              { label: "Ambient / Deep", id: "ambient" },
              { label: "Electronic / Dance", id: "electronic" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleFilterClick(cat.id)}
                className={`w-full text-left px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeFilter === cat.id
                    ? "text-emerald-400 font-semibold bg-emerald-500/10"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cloud & Supabase status footer */}
      <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2 text-xs">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="flex items-center gap-1.5 text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Supabase DB
          </span>
          <span className="text-[10px] font-mono text-zinc-500">PostgreSQL</span>
        </div>
        <p className="text-[11px] text-zinc-500 leading-tight">
          Cloudinary CDN audio streaming ready.
        </p>
      </div>
    </aside>
  );
}
