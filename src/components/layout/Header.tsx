"use client";

import React from "react";
import Link from "next/link";
import { Search, X, Disc3, Settings2, Sparkles } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  const { setIs3DModalOpen } = usePlayer();

  return (
    <header className="h-16 px-6 md:px-8 border-b border-white/5 bg-zinc-950/40 backdrop-blur-md flex items-center justify-between gap-4 select-none">
      {/* Search Bar */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search songs, artists, albums..."
          className="w-full pl-10 pr-9 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIs3DModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold tracking-wide transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Launch 3D Vinyl</span>
        </button>

        <Link
          href="/admin"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
        >
          <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Admin</span>
        </Link>

        {/* User avatar mockup */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white/10">
          SW
        </div>
      </div>
    </header>
  );
}
