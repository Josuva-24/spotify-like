"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { Song } from "@/types/song";

export type RepeatMode = "off" | "all" | "one";

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Song[];
  history: Song[];
  isShuffle: boolean;
  repeatMode: RepeatMode;
  likedSongIds: string[];
  is3DModalOpen: boolean;
  isQueueOpen: boolean;

  playSong: (song: Song, customQueue?: Song[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleLike: (songId: string) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  setIs3DModalOpen: (open: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  getFrequencyData: () => Uint8Array;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [history, setHistory] = useState<Song[]>([]);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [likedSongIds, setLikedSongIds] = useState<string[]>([]);
  const [is3DModalOpen, setIs3DModalOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const freqArrayRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(64) as Uint8Array<ArrayBuffer>);

  // Load liked songs from localStorage on mount
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem("soundwave_liked_songs");
      if (storedLikes) {
        setLikedSongIds(JSON.parse(storedLikes));
      }
      const storedVolume = localStorage.getItem("soundwave_volume");
      if (storedVolume) {
        setVolumeState(parseFloat(storedVolume));
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  // Initialize Audio element and Web Audio API
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audioRef.current = audio;

    const setupWebAudio = () => {
      if (audioContextRef.current || !audioRef.current) return;
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.8;

        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(ctx.destination);

        audioContextRef.current = ctx;
        analyserRef.current = analyser;
        sourceNodeRef.current = source;
        freqArrayRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
      } catch (e) {
        console.warn("Web Audio API CORS/Autoplay notice (simulated audio fallback active):", e);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        playNext();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    // Initial user gesture listener for AudioContext
    const handleUserInteraction = () => {
      setupWebAudio();
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    };
    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("keydown", handleUserInteraction, { once: true });

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, [repeatMode]);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playSong = useCallback(
    (song: Song, customQueue?: Song[]) => {
      if (!audioRef.current) return;

      if (currentSong && currentSong.id !== song.id) {
        setHistory((prev) => [currentSong, ...prev.slice(0, 20)]);
      }

      if (customQueue) {
        const remainingQueue = customQueue.filter((s) => s.id !== song.id);
        setQueue(remainingQueue);
      }

      setCurrentSong(song);
      audioRef.current.src = song.audio_url;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay was prevented or audio load failed:", err);
          setIsPlaying(false);
        });
    },
    [currentSong]
  );

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
      audioRef.current.play().catch(console.error);
    }
  }, [isPlaying, currentSong]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && currentSong) {
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
      audioRef.current.play().catch(console.error);
    }
  }, [currentSong]);

  const playNext = useCallback(() => {
    if (queue.length === 0) {
      if (repeatMode === "all" && currentSong) {
        // Restart current or loop
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }
      }
      return;
    }

    let nextIndex = 0;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    const nextSong = queue[nextIndex];
    const newQueue = queue.filter((_, idx) => idx !== nextIndex);
    setQueue(newQueue);
    playSong(nextSong);
  }, [queue, isShuffle, repeatMode, currentSong, playSong]);

  const playPrevious = useCallback(() => {
    if (!audioRef.current) return;
    // If more than 3 seconds in, restart track
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (history.length > 0) {
      const prevSong = history[0];
      setHistory((prev) => prev.slice(1));
      if (currentSong) {
        setQueue((prev) => [currentSong, ...prev]);
      }
      playSong(prevSong);
    } else {
      audioRef.current.currentTime = 0;
    }
  }, [history, currentSong, playSong]);

  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    setIsMuted(clamped === 0);
    try {
      localStorage.setItem("soundwave_volume", clamped.toString());
    } catch {
      // ignore
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  const toggleLike = useCallback((songId: string) => {
    setLikedSongIds((prev) => {
      const next = prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId];
      try {
        localStorage.setItem("soundwave_liked_songs", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setQueue((prev) => [...prev, song]);
  }, []);

  const removeFromQueue = useCallback((songId: string) => {
    setQueue((prev) => prev.filter((s) => s.id !== songId));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Return live frequency data or animated simulation
  const getFrequencyData = useCallback((): Uint8Array => {
    if (analyserRef.current && isPlaying) {
      analyserRef.current.getByteFrequencyData(freqArrayRef.current);
      // Check if data is populated (non-zero)
      let sum = 0;
      for (let i = 0; i < 16; i++) sum += freqArrayRef.current[i];
      if (sum > 0) return freqArrayRef.current;
    }

    // Simulated waveform fallback when playing (or if CORS blocked Web Audio analyser)
    if (isPlaying) {
      const time = performance.now() * 0.003;
      const count = freqArrayRef.current.length || 64;
      for (let i = 0; i < count; i++) {
        const wave = Math.sin(time + i * 0.2) * 0.5 + 0.5;
        const bass = Math.sin(time * 2) * 0.5 + 0.5;
        const val = Math.floor((wave * 0.7 + bass * 0.3) * 200 + 40);
        freqArrayRef.current[i] = val;
      }
      return freqArrayRef.current;
    }

    freqArrayRef.current.fill(0);
    return freqArrayRef.current;
  }, [isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        queue,
        history,
        isShuffle,
        repeatMode,
        likedSongIds,
        is3DModalOpen,
        isQueueOpen,
        playSong,
        togglePlay,
        pause,
        resume,
        playNext,
        playPrevious,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeat,
        toggleLike,
        addToQueue,
        removeFromQueue,
        clearQueue,
        setIs3DModalOpen,
        setIsQueueOpen,
        getFrequencyData,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
