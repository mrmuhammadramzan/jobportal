"use client";
/**
 * TypewriterText — single reusable typewriter animation component.
 * DRY Rule: one component for all typewriter effects.
 * FIX: removed duplicate "use client" directive that broke hydration.
 */
import React, { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  words: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
  className?: string;
  cursor?: boolean;
  loop?: boolean;
}

type Phase = "typing" | "pausing" | "deleting" | "waiting";

export default function TypewriterText({
  words,
  speed = 80,
  deleteSpeed = 40,
  pauseTime = 2000,
  className = "",
  cursor = true,
  loop = true,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase]         = useState<Phase>("typing");
  const [charIndex, setCharIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentWord = words[wordIndex] ?? "";

    function tick() {
      if (phase === "typing") {
        if (charIndex < currentWord.length) {
          setDisplayed(currentWord.slice(0, charIndex + 1));
          setCharIndex(i => i + 1);
          timeoutRef.current = setTimeout(tick, speed);
        } else {
          setPhase("pausing");
          timeoutRef.current = setTimeout(() => setPhase("deleting"), pauseTime);
        }
      } else if (phase === "deleting") {
        if (charIndex > 0) {
          setDisplayed(currentWord.slice(0, charIndex - 1));
          setCharIndex(i => i - 1);
          timeoutRef.current = setTimeout(tick, deleteSpeed);
        } else {
          setPhase("waiting");
          timeoutRef.current = setTimeout(() => {
            if (loop || wordIndex < words.length - 1) {
              setWordIndex(i => (i + 1) % words.length);
              setPhase("typing");
            }
          }, 400);
        }
      }
    }

    timeoutRef.current = setTimeout(tick, speed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charIndex, phase, wordIndex]);

  return (
    <span
      className={["inline", cursor ? "typewriter-cursor" : "", className]
        .filter(Boolean)
        .join(" ")}
      aria-live="polite"
      aria-atomic="true"
    >
      {displayed || "\u00A0"}{/* non-breaking space holds height before first char */}
    </span>
  );
}
