"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Disc3 } from "lucide-react";

const VinylVisualizer = dynamic(
  () => import("./VinylVisualizer3D").then((mod) => mod.VinylVisualizer3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] md:h-[440px] flex flex-col items-center justify-center gap-3 text-zinc-500 animate-pulse">
        <Disc3 className="w-12 h-12 animate-spin text-emerald-400" />
        <span className="text-sm font-medium">Initializing 3D Turntable...</span>
      </div>
    ),
  }
);

export function DynamicVinylVisualizer({ className }: { className?: string }) {
  return <VinylVisualizer className={className} />;
}
