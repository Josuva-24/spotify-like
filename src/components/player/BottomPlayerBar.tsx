"use client";

import React from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  Disc3,
  ListMusic,
  Maximize2,
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";
import { SoundWaveBars } from "../react-bits/SoundWaveBars";
import { MarqueeText } from "../react-bits/MarqueeText";

export function BottomPlayerBar() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    likedSongIds,
    isQueueOpen,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleLike,
    setIs3DModalOpen,
    setIsQueueOpen,
  } = usePlayer();

  if (!currentSong) return null;

  const isLiked = likedSongIds.includes(currentSong.id);
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-24 bg-zinc-950/90 backdrop-blur-2xl border-t border-white/10 px-4 md:px-8 flex items-center justify-between text-white select-none">
      {/* 1. Left: Track Info & Cover */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[200px]">
        <div
          onClick={() => setIs3DModalOpen(true)}
          className="relative group w-14 h-14 rounded-xl overflow-hidden shadow-md flex-shrink-0 cursor-pointer border border-white/10"
        >
          <img
            src={currentSong.cover_url}
            alt={currentSong.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Disc3 className="w-6 h-6 text-emerald-400 animate-spin" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <MarqueeText
              text={currentSong.title}
              className="text-sm md:text-base font-semibold text-white tracking-tight hover:underline cursor-pointer"
            />
            {isPlaying && <SoundWaveBars isPlaying={true} barCount={3} color="bg-emerald-400" />}
          </div>
          <p className="text-xs text-zinc-400 truncate mt-0.5">{currentSong.artist}</p>
        </div>

        <button
          onClick={() => toggleLike(currentSong.id)}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
          title={isLiked ? "Unlike" : "Like"}
        >
          <Heart
            className={`w-5 h-5 transition-transform active:scale-125 ${
              isLiked ? "fill-rose-500 text-rose-500" : "text-zinc-400 hover:text-white"
            }`}
          />
        </button>
      </div>

      {/* 2. Center: Controls & Progress Scrubber */}
      <div className="flex flex-col items-center justify-center gap-1.5 max-w-xl w-2/4 px-4">
        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isShuffle ? "text-emerald-400" : "text-zinc-400 hover:text-white"
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={playPrevious}
            className="p-1.5 text-zinc-300 hover:text-white active:scale-95 transition-all cursor-pointer"
            title="Previous track"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={playNext}
            className="p-1.5 text-zinc-300 hover:text-white active:scale-95 transition-all cursor-pointer"
            title="Next track"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={cycleRepeat}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              repeatMode !== "off" ? "text-emerald-400" : "text-zinc-400 hover:text-white"
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrubber */}
        <div className="w-full flex items-center gap-2.5">
          <span className="text-[11px] font-mono text-zinc-400 w-8 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1 group cursor-pointer h-2.5 flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 group-hover:h-1.5 transition-all"
              style={{
                background: `linear-gradient(to right, #10b981 ${progressPercent}%, #27272a ${progressPercent}%)`,
              }}
            />
          </div>
          <span className="text-[11px] font-mono text-zinc-400 w-8">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 3. Right: Studio 3D, Queue & Volume */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[200px]">
        {/* 3D Visualizer Trigger Button */}
        <button
          onClick={() => setIs3DModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold tracking-wide transition-all cursor-pointer"
          title="Open 3D Vinyl Studio"
        >
          <Disc3 className={`w-4 h-4 ${isPlaying ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">3D Vinyl</span>
        </button>

        {/* Queue Drawer Trigger */}
        <button
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            isQueueOpen ? "text-emerald-400 bg-white/10" : "text-zinc-400 hover:text-white"
          }`}
          title="Play Queue"
        >
          <ListMusic className="w-5 h-5" />
        </button>

        {/* Volume Slider */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>
      </div>
    </div>
  );
}
