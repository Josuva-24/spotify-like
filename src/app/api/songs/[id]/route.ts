import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { updateMemorySong, deleteMemorySong, getMemorySongs } from "@/lib/song-store";
import { NewSongInput } from "@/types/song";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return NextResponse.json({ song: data });
      }
    }

    const song = getMemorySongs().find((s) => s.id === id);
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }
    return NextResponse.json({ song });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = (await req.json()) as Partial<NewSongInput>;
    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("songs")
        .update(body)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ song: data });
      }
      if (error) {
        console.warn("Supabase update error:", error.message);
      }
    }

    const updated = updateMemorySong(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }
    return NextResponse.json({ song: updated });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { error } = await supabase.from("songs").delete().eq("id", id);
      if (!error) {
        return NextResponse.json({ success: true, id });
      }
      console.warn("Supabase delete error:", error.message);
    }

    const deleted = deleteMemorySong(id);
    if (!deleted) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
