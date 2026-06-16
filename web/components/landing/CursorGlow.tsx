"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      if (!el) return;
      el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(124,58,237,0.10), rgba(6,182,212,0.04) 40%, transparent 70%)`;
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={glowRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        transition: "background 0.05s ease",
      }}
    />
  );
}
