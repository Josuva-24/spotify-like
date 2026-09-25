"use client";

import React from "react";
import { Play, Pause, Heart, ListPlus } from "lucide-react";
import { Song } from "@/types/song";
import { usePlayer } from "@/context/PlayerContext";
import { TiltedCard } from "../react-bits/TiltedCard";
import { SoundWaveBars } from "../react-bits/SoundWaveBars";

interface SongCardProps {
  song: Song;
  allSongs?: Song[];
}

export function SongCard({ song, allSongs }: SongCardProps) {
  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    likedSongIds,
    toggleLike,
    addToQueue,
  } = usePlayer();

  const isCurrent = currentSong?.id === song.id;
  const isLiked = likedSongIds.includes(song.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, allSongs);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(song.id);
  };

  const handleQueueClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
  };

  return (
    <TiltedCard
      maxTilt={8}
      scale={1.02}
      className="group bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/5 hover:border-white/15 p-4 rounded-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div onClick={handlePlayClick}>
        {/* Cover Artwork Container */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-lg bg-zinc-950 mb-3.5">
          <img
            src={song.cover_url}
            alt={song.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Play Button */}
          <button
            onClick={handlePlayClick}
            className={`absolute bottom-3 right-3 w-11 h-11 rounded-full bg-emerald-400 text-zinc-950 flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-all duration-300 cursor-pointer ${
              isCurrent
                ? "opacity-100 scale-100 ring-2 ring-emerald-300"
                : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110 active:scale-95"
            }`}
            title={isCurrent && isPlaying ? "Pause" : "Play"}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Playing indicator badge */}
          {isCurrent && isPlaying && (
            <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-emerald-500/30">
              <SoundWaveBars isPlaying={true} barCount={3} color="bg-emerald-400" />
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-1">
          <h3
            className={`text-sm font-bold tracking-tight truncate transition-colors ${
              isCurrent ? "text-emerald-400" : "text-white group-hover:text-emerald-300"
            }`}
          >
            {song.title}
          </h3>
          <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 mt-1 border-t border-white/5 text-zinc-400">
        <span className="text-[11px] text-zinc-500 font-medium truncate max-w-[120px]">
          {song.album}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={handleQueueClick}
            className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Add to Queue"
          >
            <ListPlus className="w-4 h-4" />
          </button>

          <button
            onClick={handleLikeClick}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isLiked ? "fill-rose-500 text-rose-500" : "hover:text-white"
              }`}
            />
          </button>
        </div>
      </div>
    </TiltedCard>
  );
}
