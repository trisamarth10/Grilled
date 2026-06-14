"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ─── Neural Canvas ──────────────────────────────────────────────────────────── */

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const nodes = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
    }));

    let rafId: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x <= 0 || node.x >= width) node.vx *= -1;
        if (node.y <= 0 || node.y >= height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= 180) continue;

          // Color interpolates violet (top) → cyan (bottom) based on edge midpoint Y
          const t = ((a.y + b.y) / 2) / height;
          const r = Math.round(139 + (6 - 139) * t);
          const g = Math.round(92 + (182 - 92) * t);
          const b2 = Math.round(246 + (212 - 246) * t);
          const opacity = (1 - dist / 180) * 0.12;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${r},${g},${b2},${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    draw();

    function onResize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Color Orbs ─────────────────────────────────────────────────────────────── */

const orbs = [
  {
    color: "#7C3AED",
    size: 700,
    style: { top: "-100px", left: "-150px" },
    opacity: 0.25,
    blur: 160,
    animate: { x: [0, 50, -30, 0], y: [0, -40, 20, 0] },
    duration: 9,
  },
  {
    color: "#06B6D4",
    size: 500,
    style: { bottom: "-80px", right: "-100px" },
    opacity: 0.2,
    blur: 150,
    animate: { x: [0, -40, 25, 0], y: [0, 30, -20, 0] },
    duration: 11,
  },
  {
    color: "#EC4899",
    size: 400,
    style: { top: "-60px", right: "-80px" },
    opacity: 0.12,
    blur: 140,
    animate: { x: [0, 30, -20, 0], y: [0, 20, -30, 0] },
    duration: 8,
  },
];

/* ─── BackgroundSystem ───────────────────────────────────────────────────────── */

export function BackgroundSystem() {
  return (
    <>
      {/* Layer 1 — Animated color orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={orb.animate}
          transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "fixed",
            zIndex: 0,
            pointerEvents: "none",
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: orb.color,
            filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity,
            ...orb.style,
          }}
        />
      ))}

      {/* Layer 2 — Neural canvas */}
      <NeuralCanvas />

      {/* Layer 3 — Scanline overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.006) 2px, rgba(255,255,255,0.006) 4px)",
        }}
      />
    </>
  );
}
