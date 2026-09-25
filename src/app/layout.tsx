import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";
import { BottomPlayerBar } from "@/components/player/BottomPlayerBar";
import { ExpandedPlayerModal } from "@/components/player/ExpandedPlayerModal";
import { QueueDrawer } from "@/components/player/QueueDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SoundWave | Next-Gen Audio Streaming & 3D Vinyl Studio",
  description: "Dynamic cloud music streaming with Supabase database, Cloudinary media delivery, React Bits animations, and 3D audio-reactive vinyl visualizer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 text-white selection:bg-emerald-500 selection:text-black">
        <PlayerProvider>
          {children}
          <BottomPlayerBar />
          <ExpandedPlayerModal />
          <QueueDrawer />
        </PlayerProvider>
      </body>
    </html>
  );
}
