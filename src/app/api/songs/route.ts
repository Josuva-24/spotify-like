import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMemorySongs, addMemorySong } from "@/lib/song-store";
import { NewSongInput } from "@/types/song";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          songs: data,
          source: "supabase",
        });
      }
      if (error) {
        console.warn("Supabase query error, using local fallback:", error.message);
      }
    }

    const songs = getMemorySongs();
    return NextResponse.json({
      songs,
      source: "memory_fallback",
      note: supabase ? "Supabase table is empty" : "Supabase keys not configured yet in .env.local",
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NewSongInput;

    if (!body.title || !body.artist || !body.audio_url || !body.cover_url) {
      return NextResponse.json(
        { error: "Title, artist, audio_url, and cover_url are required." },
        { status: 400 }
      );
    }

    const songPayload = {
      title: body.title.trim(),
      artist: body.artist.trim(),
      album: (body.album || "Single").trim(),
      cover_url: body.cover_url.trim(),
      audio_url: body.audio_url.trim(),
      duration: body.duration || 180,
    };

    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("songs")
        .insert([songPayload])
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ song: data, source: "supabase" }, { status: 201 });
      }
      if (error) {
        console.warn("Supabase insert error, falling back to local memory:", error.message);
      }
    }

    const newSong = addMemorySong(songPayload);
    return NextResponse.json({ song: newSong, source: "memory_fallback" }, { status: 201 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
