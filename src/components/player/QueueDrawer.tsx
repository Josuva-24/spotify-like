"use client";

import React from "react";
import { X, Trash2, Play, Music, ListMusic } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";

export function QueueDrawer() {
  const {
    currentSong,
    queue,
    isPlaying,
    isQueueOpen,
    setIsQueueOpen,
    playSong,
    removeFromQueue,
    clearQueue,
  } = usePlayer();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-45 w-full max-w-sm bg-zinc-950/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div className="flex items-center gap-2 text-white">
          <ListMusic className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold tracking-tight">Play Queue</h2>
          <span className="text-xs text-zinc-500 font-medium">({queue.length})</span>
        </div>
        <div className="flex items-center gap-1">
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Clear Queue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsQueueOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Now Playing section */}
        {currentSong && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider px-1">
              Now Playing
            </h3>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-emerald-500/20">
              <img
                src={currentSong.cover_url}
                alt={currentSong.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{currentSong.title}</p>
                <p className="text-xs text-zinc-400 truncate">{currentSong.artist}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next in Queue */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
            Next Up
          </h3>

          {queue.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-zinc-500 gap-2">
              <Music className="w-8 h-8 opacity-40" />
              <p className="text-sm">Queue is empty</p>
              <p className="text-xs text-zinc-600">Add songs from the library to queue them next.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {queue.map((song, idx) => (
                <div
                  key={`${song.id}-${idx}`}
                  className="group flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div
                    onClick={() => playSong(song)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={song.cover_url}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                        {song.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromQueue(song.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-rose-400 rounded transition-all cursor-pointer"
                    title="Remove from queue"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
