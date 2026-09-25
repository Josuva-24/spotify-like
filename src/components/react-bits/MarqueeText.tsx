"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MarqueeTextProps {
  text: string;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
}

export function MarqueeText({
  text,
  className,
  speed = 25,
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      setShouldAnimate(textRef.current.offsetWidth > containerRef.current.offsetWidth);
    }
  }, [text]);

  if (!shouldAnimate) {
    return (
      <div ref={containerRef} className={cn("overflow-hidden whitespace-nowrap text-ellipsis", className)}>
        <span ref={textRef}>{text}</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <div
        className="inline-flex gap-8 hover:[animation-play-state:paused]"
        style={{
          animation: `marquee-scroll ${speed}s linear infinite`,
        }}
      >
        <span ref={textRef}>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
