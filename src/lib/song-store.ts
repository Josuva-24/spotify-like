import { Song, NewSongInput } from "@/types/song";
import { INITIAL_SONGS } from "./mock-data";

// In-memory fallback store used when Supabase credentials are not yet configured
let memorySongs: Song[] = [...INITIAL_SONGS];

export function getMemorySongs(): Song[] {
  return memorySongs;
}

export function addMemorySong(input: NewSongInput): Song {
  const newSong: Song = {
    ...input,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    duration: input.duration || 180,
  };
  memorySongs = [newSong, ...memorySongs];
  return newSong;
}

export function updateMemorySong(id: string, updates: Partial<NewSongInput>): Song | null {
  const index = memorySongs.findIndex((s) => s.id === id);
  if (index === -1) return null;
  memorySongs[index] = {
    ...memorySongs[index],
    ...updates,
  };
  return memorySongs[index];
}

export function deleteMemorySong(id: string): boolean {
  const initialLength = memorySongs.length;
  memorySongs = memorySongs.filter((s) => s.id !== id);
  return memorySongs.length < initialLength;
}
