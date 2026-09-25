"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
  className?: string;
  children?: React.ReactNode;
}

export function Aurora({
  colorStops = ["#3A29FF", "#00FFA3", "#FF007A"],
  className,
  children,
}: AuroraProps) {
  return (
    <div className={cn("relative overflow-hidden w-full h-full", className)}>
      <div
        className="pointer-events-none absolute -inset-[10px] opacity-40 blur-[90px] transform-gpu"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 30%, ${colorStops[0]} 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 40%, ${colorStops[1]} 0%, transparent 70%),
            radial-gradient(ellipse 70% 40% at 50% 80%, ${colorStops[2]} 0%, transparent 70%)
          `,
          animation: "aurora-drift 18s ease-in-out infinite alternate",
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
