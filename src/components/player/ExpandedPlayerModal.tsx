"use client";

import React from "react";
import {
  X,
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
  Music2,
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";
import { DynamicVinylVisualizer } from "./DynamicVinylVisualizer";
import { Aurora } from "../react-bits/Aurora";
import { SoundWaveBars } from "../react-bits/SoundWaveBars";
import { MarqueeText } from "../react-bits/MarqueeText";
import { MagneticButton } from "../react-bits/MagneticButton";

export function ExpandedPlayerModal() {
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
    is3DModalOpen,
    setIs3DModalOpen,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleLike,
  } = usePlayer();

  if (!is3DModalOpen || !currentSong) return null;

  const isLiked = likedSongIds.includes(currentSong.id);
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl transition-all duration-300">
      {/* Background Ambient Aurora */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <Aurora colorStops={["#10b981", "#6366f1", "#ec4899"]} />
      </div>

      <div className="relative z-10 w-full max-w-4xl h-full max-h-[92vh] mx-4 flex flex-col justify-between p-6 md:p-8 bg-zinc-950/70 border border-white/10 rounded-3xl shadow-2xl overflow-y-auto">
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              3D Vinyl Studio
            </span>
            <SoundWaveBars isPlaying={isPlaying} barCount={5} color="bg-emerald-400" />
          </div>

          <button
            onClick={() => setIs3DModalOpen(false)}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close 3D View"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Center: 3D Turntable Scene */}
        <div className="flex-1 flex flex-col items-center justify-center my-4">
          <DynamicVinylVisualizer className="w-full h-[320px] md:h-[400px] flex items-center justify-center" />
        </div>

        {/* Track Details & Marquee */}
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <MarqueeText
                text={currentSong.title}
                className="text-2xl md:text-3xl font-extrabold text-white tracking-tight"
              />
              <p className="text-zinc-400 text-sm md:text-base font-medium mt-1">
                {currentSong.artist} • <span className="text-zinc-500">{currentSong.album}</span>
              </p>
            </div>

            <button
              onClick={() => toggleLike(currentSong.id)}
              className="p-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title={isLiked ? "Unlike song" : "Like song"}
            >
              <Heart
                className={`w-6 h-6 transition-transform active:scale-125 ${
                  isLiked ? "fill-rose-500 text-rose-500" : "text-zinc-400 hover:text-white"
                }`}
              />
            </button>
          </div>

          {/* Scrubber Progress Bar */}
          <div className="space-y-1.5">
            <div className="relative group cursor-pointer h-3 flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #10b981 ${progressPercent}%, #27272a ${progressPercent}%)`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Master Transport Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleShuffle}
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                  isShuffle ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-400 hover:text-white"
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={cycleRepeat}
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                  repeatMode !== "off" ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-400 hover:text-white"
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === "one" ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
              </button>
            </div>

            {/* Playback Controls with Magnetic Center Button */}
            <div className="flex items-center gap-5">
              <button
                onClick={playPrevious}
                className="p-2 text-zinc-300 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title="Previous track"
              >
                <SkipBack className="w-7 h-7" />
              </button>

              <MagneticButton
                onClick={togglePlay}
                strength={0.3}
                className="w-16 h-16 rounded-full bg-emerald-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:bg-emerald-300 hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current translate-x-0.5" />}
              </MagneticButton>

              <button
                onClick={playNext}
                className="p-2 text-zinc-300 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title="Next track"
              >
                <SkipForward className="w-7 h-7" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 w-40">
              <button
                onClick={toggleMute}
                className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
