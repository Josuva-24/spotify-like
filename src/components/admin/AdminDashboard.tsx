"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Edit2,
  Play,
  Pause,
  Upload,
  Music2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Song, NewSongInput } from "@/types/song";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";

export function AdminDashboard() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [form, setForm] = useState<NewSongInput>({
    title: "",
    artist: "",
    album: "Single",
    cover_url: "",
    audio_url: "",
    duration: 180,
  });

  // Edit Modal State
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Audio Preview State for testing the form
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);

  const fetchSongs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/songs");
      const data = await res.json();
      if (data.songs) {
        setSongs(data.songs);
      }
    } catch (err) {
      console.error("Failed to fetch songs:", err);
      setFeedback({ type: "error", message: "Failed to load songs from database." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Form Audio Preview Toggle
  const toggleAudioPreview = (url: string) => {
    if (!url) return;
    if (previewAudio) {
      if (isPreviewPlaying) {
        previewAudio.pause();
        setIsPreviewPlaying(false);
        return;
      } else {
        previewAudio.play().catch(console.error);
        setIsPreviewPlaying(true);
        return;
      }
    }

    const audio = new Audio(url);
    audio.onended = () => setIsPreviewPlaying(false);
    audio.onplay = () => setIsPreviewPlaying(true);
    audio.onpause = () => setIsPreviewPlaying(false);
    setPreviewAudio(audio);
    audio.play().catch((err) => {
      console.warn("Preview playback error:", err);
      setFeedback({ type: "error", message: "Could not play audio preview. Check URL format." });
    });
  };

  useEffect(() => {
    return () => {
      if (previewAudio) {
        previewAudio.pause();
      }
    };
  }, [previewAudio]);

  // Handle Create Song
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.artist || !form.audio_url || !form.cover_url) {
      setFeedback({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.song) {
        setSongs((prev) => [data.song, ...prev]);
        setForm({
          title: "",
          artist: "",
          album: "Single",
          cover_url: "",
          audio_url: "",
          duration: 180,
        });
        if (previewAudio) previewAudio.pause();
        setPreviewAudio(null);
        setIsPreviewPlaying(false);

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        setFeedback({
          type: "success",
          message: `Successfully added "${data.song.title}" to catalog!`,
        });
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to create song." });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error saving song.";
      setFeedback({ type: "error", message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Song
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSong) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/songs/${editingSong.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingSong.title,
          artist: editingSong.artist,
          album: editingSong.album,
          cover_url: editingSong.cover_url,
          audio_url: editingSong.audio_url,
        }),
      });

      const data = await res.json();
      if (res.ok && data.song) {
        setSongs((prev) => prev.map((s) => (s.id === data.song.id ? data.song : s)));
        setEditingSong(null);
        setFeedback({ type: "success", message: `Updated "${data.song.title}" successfully.` });
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to update song." });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error updating song.";
      setFeedback({ type: "error", message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Song
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/songs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSongs((prev) => prev.filter((s) => s.id !== id));
        setDeleteConfirmId(null);
        setFeedback({ type: "success", message: "Song removed from database." });
      } else {
        const data = await res.json();
        setFeedback({ type: "error", message: data.error || "Failed to delete song." });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error deleting song.";
      setFeedback({ type: "error", message: errorMessage });
    }
  };

  // Preset Template Helper
  const loadPreset = (presetNumber: number) => {
    if (presetNumber === 1) {
      setForm({
        title: "Synthwave Horizons",
        artist: "Neon Syndicate",
        album: "Retro Future",
        cover_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
        audio_url: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
        duration: 218,
      });
    } else {
      setForm({
        title: "Cloudinary High Tide",
        artist: "Solaris Audio",
        album: "CDN Waves",
        cover_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
        audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: 350,
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 pb-32">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 font-semibold mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Music Stream
            </Link>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
              Admin CRUD Studio
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Supabase + Cloudinary
              </span>
            </h1>
            <p className="text-sm text-zinc-400">
              Manage songs, media endpoints, and metadata stored in your Supabase PostgreSQL database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSongs}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm font-medium border ${
              feedback.type === "success"
                ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30"
                : "bg-rose-950/40 text-rose-300 border-rose-500/30"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs underline opacity-80 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Grid: Create Form + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Form (2 cols) */}
          <div className="lg:col-span-2 bg-zinc-900/50 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                  <Plus className="w-5 h-5 text-emerald-400" /> Add New Song
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Input Cloudinary CDN URLs or direct audio streams.
                </p>
              </div>

              {/* Sample Presets */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-500">Presets:</span>
                <button
                  type="button"
                  onClick={() => loadPreset(1)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-zinc-300 transition-colors cursor-pointer"
                >
                  Preset #1
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset(2)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-zinc-300 transition-colors cursor-pointer"
                >
                  Preset #2
                </button>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Track Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Neon Moonlight"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Artist Name *</label>
                  <input
                    type="text"
                    required
                    value={form.artist}
                    onChange={(e) => setForm({ ...form, artist: e.target.value })}
                    placeholder="e.g. Cyberwave Orchestra"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Album Name</label>
                  <input
                    type="text"
                    value={form.album}
                    onChange={(e) => setForm({ ...form, album: e.target.value })}
                    placeholder="Single"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Duration (seconds)</label>
                  <input
                    type="number"
                    value={form.duration || 180}
                    onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 180 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span>Cover Artwork URL (Cloudinary / Web Image) *</span>
                </label>
                <input
                  type="url"
                  required
                  value={form.cover_url}
                  onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
                  placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono text-xs"
                />
              </div>

              {/* Audio URL */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300">
                    Audio Stream URL (Cloudinary CDN MP3) *
                  </label>
                  {form.audio_url && (
                    <button
                      type="button"
                      onClick={() => toggleAudioPreview(form.audio_url)}
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {isPreviewPlaying ? (
                        <>
                          <Pause className="w-3 h-3 fill-current" /> Pause Preview
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" /> Test Audio Preview
                        </>
                      )}
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  required
                  value={form.audio_url}
                  onChange={(e) => setForm({ ...form, audio_url: e.target.value })}
                  placeholder="https://res.cloudinary.com/.../audio.mp3"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? "Saving to Supabase..." : "Publish Song"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Card (1 col) */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Live Card Preview
              </span>

              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 shadow-lg">
                {form.cover_url ? (
                  <img
                    src={form.cover_url}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-2">
                    <ImageIcon className="w-12 h-12" />
                    <span className="text-xs">Paste cover image URL</span>
                  </div>
                )}

                {form.audio_url && (
                  <button
                    onClick={() => toggleAudioPreview(form.audio_url)}
                    className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-emerald-400 text-zinc-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    {isPreviewPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white truncate">
                  {form.title || "Untitled Track"}
                </h3>
                <p className="text-xs text-zinc-400 truncate">
                  {form.artist || "Unknown Artist"}
                </p>
                <p className="text-[11px] text-zinc-500 truncate">
                  Album: {form.album || "Single"} • {formatTime(form.duration || 180)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-zinc-500">
              <p>
                <span className="font-semibold text-zinc-400">Database destination:</span>{" "}
                <code className="text-emerald-400 font-mono">public.songs</code>
              </p>
            </div>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-lg font-bold text-white">Database Catalog</h2>
              <p className="text-xs text-zinc-400">Total tracks in system: {songs.length}</p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-zinc-500 animate-pulse text-sm">
              Loading songs from Supabase...
            </div>
          ) : songs.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 text-sm">
              No songs found in catalog. Create your first song above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-zinc-500 uppercase tracking-wider">
                    <th className="py-3 px-3">Cover</th>
                    <th className="py-3 px-3">Title</th>
                    <th className="py-3 px-3">Artist</th>
                    <th className="py-3 px-3">Album</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {songs.map((song) => (
                    <tr key={song.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-3">
                        <img
                          src={song.cover_url}
                          alt={song.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">{song.title}</td>
                      <td className="py-3 px-3 text-zinc-400">{song.artist}</td>
                      <td className="py-3 px-3 text-zinc-500 text-xs">{song.album}</td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleAudioPreview(song.audio_url)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-white/10 transition-colors cursor-pointer"
                            title="Preview Audio"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingSong(song)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            title="Edit metadata"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(song.id)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                            title="Delete song"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal Dialog */}
        {editingSong && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-lg bg-zinc-950 border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-emerald-400" /> Edit Song Metadata
                </h3>
                <button
                  onClick={() => setEditingSong(null)}
                  className="text-zinc-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Title</label>
                  <input
                    type="text"
                    required
                    value={editingSong.title}
                    onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Artist</label>
                  <input
                    type="text"
                    required
                    value={editingSong.artist}
                    onChange={(e) => setEditingSong({ ...editingSong, artist: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Album</label>
                  <input
                    type="text"
                    value={editingSong.album}
                    onChange={(e) => setEditingSong({ ...editingSong, album: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Cover URL</label>
                  <input
                    type="url"
                    required
                    value={editingSong.cover_url}
                    onChange={(e) => setEditingSong({ ...editingSong, cover_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Audio URL</label>
                  <input
                    type="url"
                    required
                    value={editingSong.audio_url}
                    onChange={(e) => setEditingSong({ ...editingSong, audio_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingSong(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-zinc-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-sm shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-sm bg-zinc-950 border border-rose-500/20 rounded-3xl p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-500" /> Confirm Deletion
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Are you sure you want to permanently delete this track from your database catalog? This action cannot be undone.
              </p>
              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
