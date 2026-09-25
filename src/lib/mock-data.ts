import { Song } from "@/types/song";

export const INITIAL_SONGS: Song[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    title: "Midnight Horizon",
    artist: "Kangaroo MusiQue",
    album: "Neon Dreams",
    cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    audio_url: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    duration: 218,
  },
  {
    id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    title: "Cybernetic Echoes",
    artist: "Sevish",
    album: "Microtonal Odyssey",
    cover_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    audio_url: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    duration: 184,
  },
  {
    id: "b3b1e7c2-12ab-4ef4-913a-7a5d1297d024",
    title: "Aura Resonance",
    artist: "SoundHelix Collective",
    album: "Acoustic Synthetics",
    cover_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    duration: 372,
  },
  {
    id: "a1c5d9e8-43bb-4011-8a9d-192837465abc",
    title: "Cosmic Drift",
    artist: "Epoq",
    album: "Lepidoptera",
    cover_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    audio_url: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    duration: 245,
  },
  {
    id: "c8e2b914-5f43-4a11-b0e2-639a01f782c5",
    title: "Electric Skyline",
    artist: "SoundHelix Project",
    album: "Synth Genesis",
    cover_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    duration: 420,
  }
];
