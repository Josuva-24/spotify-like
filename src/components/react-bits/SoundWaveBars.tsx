"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SoundWaveBarsProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
  color?: string;
}

export function SoundWaveBars({
  isPlaying,
  barCount = 4,
  className,
  color = "bg-emerald-400",
}: SoundWaveBarsProps) {
  const [heights, setHeights] = useState<number[]>(Array(barCount).fill(25));

  useEffect(() => {
    if (!isPlaying) {
      setHeights(Array(barCount).fill(15));
      return;
    }

    const interval = setInterval(() => {
      setHeights(
        Array(barCount)
          .fill(0)
          .map(() => Math.floor(Math.random() * 80) + 20)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, barCount]);

  return (
    <div className={cn("flex items-end justify-center gap-[3px] h-5", className)}>
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn("w-1 rounded-full transition-all duration-150 ease-out", color)}
          style={{
            height: `${isPlaying ? h : 20}%`,
            opacity: isPlaying ? 0.9 : 0.4,
          }}
        />
      ))}
    </div>
  );
}
