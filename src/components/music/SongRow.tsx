"use client";

import React from "react";
import { Play, Pause, Heart, ListPlus, Clock } from "lucide-react";
import { Song } from "@/types/song";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";
import { SoundWaveBars } from "../react-bits/SoundWaveBars";

interface SongRowProps {
  song: Song;
  index: number;
  allSongs?: Song[];
}

export function SongRow({ song, index, allSongs }: SongRowProps) {
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

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, allSongs);
    }
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${
        isCurrent
          ? "bg-white/10 text-white"
          : "hover:bg-white/5 text-zinc-300 hover:text-white"
      }`}
    >
      {/* Index & Cover & Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-7 text-center text-xs font-mono text-zinc-500 group-hover:hidden flex items-center justify-center">
          {isCurrent && isPlaying ? (
            <SoundWaveBars isPlaying={true} barCount={3} color="bg-emerald-400" />
          ) : (
            index + 1
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick();
          }}
          className="hidden group-hover:flex w-7 items-center justify-center text-white"
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-4 h-4 fill-current text-emerald-400" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </button>

        <img
          src={song.cover_url}
          alt={song.title}
          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
        />

        <div className="min-w-0 flex-1 pr-4">
          <p
            className={`text-sm font-semibold truncate ${
              isCurrent ? "text-emerald-400" : "text-white group-hover:text-emerald-300"
            }`}
          >
            {song.title}
          </p>
          <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
        </div>
      </div>

      {/* Album name */}
      <div className="hidden md:block w-1/4 text-xs text-zinc-400 truncate pr-4">
        {song.album}
      </div>

      {/* Actions & Duration */}
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToQueue(song);
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-white hover:bg-white/10 rounded transition-all cursor-pointer"
          title="Add to queue"
        >
          <ListPlus className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(song.id);
          }}
          className="p-1.5 hover:bg-white/10 rounded transition-colors cursor-pointer"
          title={isLiked ? "Unlike" : "Like"}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isLiked ? "fill-rose-500 text-rose-500" : "text-zinc-500 group-hover:text-zinc-300 hover:text-white"
            }`}
          />
        </button>

        <span className="w-12 text-right text-xs font-mono text-zinc-500">
          {formatTime(song.duration || 210)}
        </span>
      </div>
    </div>
  );
}
