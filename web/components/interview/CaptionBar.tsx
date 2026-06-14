"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CaptionBarProps {
  text: string;
  visible: boolean;
}

export function CaptionBar({ text, visible }: CaptionBarProps) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible || !text) {
      setDisplayed("");
      indexRef.current = 0;
      return;
    }

    // Reset and start typewriter for new text
    indexRef.current = 0;
    setDisplayed("");

    const tick = () => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current < text.length) {
        timerRef.current = setTimeout(tick, 22);
      }
    };
    timerRef.current = setTimeout(tick, 22);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            bottom: "28px",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "700px",
            width: "calc(100% - 64px)",
            padding: "14px 20px",
            background: "rgba(4,0,16,0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(139,92,246,0.15)",
            borderRadius: "10px",
            zIndex: 40,
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#CBD5E1",
              fontFamily: "var(--font-inter)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {displayed}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              style={{ color: "#7C3AED", fontWeight: 700 }}
            >
              |
            </motion.span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
