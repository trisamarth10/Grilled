"use client";

import { useEffect, useState } from "react";

interface WaveformProps {
  bars: number;
  colors: string[];
  active: boolean;
  quiet?: boolean; // gentle low animation even when inactive (for user waveform)
  height?: number;
  maxWidth?: number;
}

export function Waveform({ bars, colors, active, quiet = false, height = 52, maxWidth }: WaveformProps) {
  // Flat constant initial heights — no Math.random() on first render so server/client match
  const [heights, setHeights] = useState(() => Array.from({ length: bars }, () => 0.1));

  useEffect(() => {
    if (!active && !quiet) {
      setHeights(Array.from({ length: bars }, () => 0.1));
      return;
    }

    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: bars }, (_, i) => {
          if (active) return 0.12 + Math.random() * 0.88;
          // quiet mode: very low gentle movement
          return 0.06 + Math.sin(Date.now() / 400 + i * 0.5) * 0.06 + Math.random() * 0.08;
        }),
      );
    }, 80);

    return () => clearInterval(interval);
  }, [active, quiet, bars]);

  return (
    <div
      style={{
        display: "flex",
        gap: "3px",
        alignItems: "center",
        height: `${height}px`,
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
      }}
    >
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width: "4px",
            height: `${h * 100}%`,
            background: colors[i % colors.length],
            borderRadius: "2px",
            opacity: active ? 1 : quiet ? 0.4 : 0.15,
            transition: "height 0.08s ease, opacity 0.3s ease",
            transitionDelay: `${(i % 6) * 8}ms`,
          }}
        />
      ))}
    </div>
  );
}
