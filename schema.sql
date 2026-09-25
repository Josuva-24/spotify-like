-- ============================================================================
-- SOUNDWAVE AUDIO STREAMING - SUPABASE DATABASE SCHEMA
-- Project: https://shkfcqbtxhjiiiuxrsrz.supabase.co
-- Run this entire script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/shkfcqbtxhjiiiuxrsrz/sql
-- ============================================================================

-- 1. Create songs table
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255) DEFAULT 'Single',
    cover_url TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    duration INTEGER DEFAULT 180,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure duration column exists if table was already created
ALTER TABLE public.songs ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 180;

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Allow public read access" ON public.songs;
DROP POLICY IF EXISTS "Allow public insert access" ON public.songs;
DROP POLICY IF EXISTS "Allow public update access" ON public.songs;
DROP POLICY IF EXISTS "Allow public delete access" ON public.songs;
DROP POLICY IF EXISTS "Allow full access for authenticated/service roles" ON public.songs;

-- Policy: Allow anyone to view songs (Public Read)
CREATE POLICY "Allow public read access"
ON public.songs
FOR SELECT
USING (true);

-- Policy: Allow public / API routes to insert new songs
CREATE POLICY "Allow public insert access"
ON public.songs
FOR INSERT
WITH CHECK (true);

-- Policy: Allow public / API routes to update songs
CREATE POLICY "Allow public update access"
ON public.songs
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy: Allow public / API routes to delete songs
CREATE POLICY "Allow public delete access"
ON public.songs
FOR DELETE
USING (true);

-- 4. Initial Seed Data (Curated Lossless Tracks & High-Res Cover Artwork)
INSERT INTO public.songs (id, title, artist, album, cover_url, audio_url, duration)
VALUES 
    (
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        'Midnight Horizon',
        'Kangaroo MusiQue',
        'Neon Dreams',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
        'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        218
    ),
    (
        '7c9e6679-7425-40de-944b-e07fc1f90ae7',
        'Cybernetic Echoes',
        'Sevish',
        'Microtonal Odyssey',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
        184
    ),
    (
        'b3b1e7c2-12ab-4ef4-913a-7a5d1297d024',
        'Aura Resonance',
        'SoundHelix Collective',
        'Acoustic Synthetics',
        'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        372
    ),
    (
        'a1c5d9e8-43bb-4011-8a9d-192837465abc',
        'Cosmic Drift',
        'Epoq',
        'Lepidoptera',
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
        'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
        245
    ),
    (
        'c8e2b914-5f43-4a11-b0e2-639a01f782c5',
        'Electric Skyline',
        'SoundHelix Project',
        'Synth Genesis',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        420
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    artist = EXCLUDED.artist,
    album = EXCLUDED.album,
    cover_url = EXCLUDED.cover_url,
    audio_url = EXCLUDED.audio_url,
    duration = EXCLUDED.duration;
