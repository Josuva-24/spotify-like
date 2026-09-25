"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Play,
  Pause,
  Sparkles,
  Compass,
  Radio,
  Disc3,
  Heart,
  Flame,
  Music,
  TrendingUp,
  Clock,
  ListMusic,
} from "lucide-react";
import { Song } from "@/types/song";
import { usePlayer } from "@/context/PlayerContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SongCard } from "@/components/music/SongCard";
import { SongRow } from "@/components/music/SongRow";
import { Aurora } from "@/components/react-bits/Aurora";
import { SoundWaveBars } from "@/components/react-bits/SoundWaveBars";
import { MagneticButton } from "@/components/react-bits/MagneticButton";

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    likedSongIds,
    setIs3DModalOpen,
  } = usePlayer();

  useEffect(() => {
    async function loadSongs() {
      try {
        const res = await fetch("/api/songs");
        const data = await res.json();
        if (data.songs) {
          setSongs(data.songs);
        }
      } catch (err) {
        console.error("Failed to load tracks:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSongs();
  }, []);

  // Filtered Songs based on Search and Filter Pills
  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = song.title.toLowerCase().includes(q);
        const matchesArtist = song.artist.toLowerCase().includes(q);
        const matchesAlbum = song.album.toLowerCase().includes(q);
        if (!matchesTitle && !matchesArtist && !matchesAlbum) return false;
      }

      // 2. Category Filter
      if (activeFilter === "liked") {
        return likedSongIds.includes(song.id);
      }
      if (activeFilter === "synth") {
        return (
          song.title.toLowerCase().includes("synth") ||
          song.title.toLowerCase().includes("horizon") ||
          song.album.toLowerCase().includes("neon") ||
          song.album.toLowerCase().includes("synth")
        );
      }
      if (activeFilter === "ambient") {
        return (
          song.title.toLowerCase().includes("aura") ||
          song.title.toLowerCase().includes("echo") ||
          song.album.toLowerCase().includes("acoustic")
        );
      }
      if (activeFilter === "electronic") {
        return (
          song.title.toLowerCase().includes("cyber") ||
          song.title.toLowerCase().includes("drift") ||
          song.album.toLowerCase().includes("odyssey")
        );
      }

      return true;
    });
  }, [songs, searchQuery, activeFilter, likedSongIds]);

  const featuredSong = songs[0];
  const isFeaturedPlaying = currentSong?.id === featuredSong?.id && isPlaying;

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        className="hidden md:flex"
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Scrollable Feed */}
        <main className="flex-1 overflow-y-auto px-6 md:px-10 py-6 pb-36 space-y-8">
          {/* Hero Banner with React Bits Aurora Background */}
          {featuredSong && !searchQuery && (
            <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/60 p-6 md:p-10">
              <Aurora
                colorStops={["#00FFA3", "#3A29FF", "#FF007A"]}
                className="absolute inset-0 opacity-40 pointer-events-none"
              />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="max-w-xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>Featured Premiere</span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    {featuredSong.title}
                  </h2>
                  <p className="text-sm md:text-base text-zinc-300 font-medium">
                    By <span className="text-white font-bold">{featuredSong.artist}</span> • Album:{" "}
                    <span className="text-emerald-300">{featuredSong.album}</span>
                  </p>
                  <p className="text-xs md:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                    Streaming lossless audio in real-time. Features ambient audio-reactive 3D vinyl visualization and interactive spatial sound.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <MagneticButton
                      onClick={() => {
                        if (isFeaturedPlaying) {
                          togglePlay();
                        } else {
                          playSong(featuredSong, songs);
                        }
                      }}
                      className="px-6 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2.5 transition-all"
                    >
                      {isFeaturedPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current translate-x-0.5" /> Listen Now
                        </>
                      )}
                    </MagneticButton>

                    <button
                      onClick={() => {
                        if (!currentSong) playSong(featuredSong, songs);
                        setIs3DModalOpen(true);
                      }}
                      className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/15 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Disc3 className="w-4 h-4 text-cyan-400" />
                      <span>Experience in 3D Vinyl</span>
                    </button>
                  </div>
                </div>

                {/* Hero Artwork with subtle floating depth */}
                <div
                  onClick={() => setIs3DModalOpen(true)}
                  className="relative group w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/20 cursor-pointer flex-shrink-0"
                >
                  <img
                    src={featuredSong.cover_url}
                    alt={featuredSong.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
                    <Disc3 className="w-10 h-10 text-emerald-400 animate-spin" />
                    <span className="text-xs font-bold tracking-wider uppercase text-white">
                      3D Turntable
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Catalog Filter Tabs & View Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "All Releases" },
                { id: "liked", label: `Liked (${likedSongIds.length})` },
                { id: "synth", label: "Synthwave" },
                { id: "ambient", label: "Ambient" },
                { id: "electronic", label: "Electronic" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setActiveFilter(pill.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    activeFilter === pill.id
                      ? "bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20"
                      : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-zinc-400">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === "grid" ? "bg-white/15 text-white" : "hover:text-white"
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === "list" ? "bg-white/15 text-white" : "hover:text-white"
                }`}
              >
                Catalog List
              </button>
            </div>
          </div>

          {/* Track Catalog Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : activeFilter === "liked"
                  ? "Liked Tracks"
                  : "Trending Now"}
              </h3>
              <span className="text-xs text-zinc-500 font-mono">
                {filteredSongs.length} track{filteredSongs.length === 1 ? "" : "s"}
              </span>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-3">
                <Disc3 className="w-8 h-8 animate-spin text-emerald-400" />
                <span className="text-sm font-medium">Connecting to Supabase audio catalog...</span>
              </div>
            ) : filteredSongs.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 space-y-2 bg-white/5 rounded-3xl border border-white/5 p-8">
                <Music className="w-10 h-10 mx-auto opacity-30" />
                <p className="text-base font-semibold text-zinc-400">No tracks found</p>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  {searchQuery
                    ? "Try adjusting your search keywords."
                    : activeFilter === "liked"
                    ? "You haven't liked any songs yet. Click the heart icon on any song to save it here."
                    : "No songs match this category."}
                </p>
                {(searchQuery || activeFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter("all");
                    }}
                    className="mt-3 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              /* Grid Layout with TiltedCards */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredSongs.map((song) => (
                  <SongCard key={song.id} song={song} allSongs={filteredSongs} />
                ))}
              </div>
            ) : (
              /* List Table Layout */
              <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-3 divide-y divide-white/5">
                {filteredSongs.map((song, idx) => (
                  <SongRow
                    key={song.id}
                    song={song}
                    index={idx}
                    allSongs={filteredSongs}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
