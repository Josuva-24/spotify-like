export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover_url: string;
  audio_url: string;
  created_at: string;
  duration?: number;
}

export type NewSongInput = Omit<Song, "id" | "created_at">;
