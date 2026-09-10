"use client";

import { useEffect, useRef, useState } from "react";
import { SPIN_DURATION_MS, REEL_EXTRA_LAPS } from "@/config/animation";

interface WordReelProps {
  words: string[];
  spinToken: number;
  targetIndex: number;
  phase: "idle" | "spinning" | "revealing" | "answering" | "finished";
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function WordReel({ words, spinToken, targetIndex, phase }: WordReelProps) {
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const hasMounted = useRef(false);
  const frameRef = useRef<number | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (words.length === 0) return;

    const startIndex = highlightIndex ?? 0;
    const forwardDistance = (targetIndex - startIndex + words.length) % words.length;
    const totalTicks = REEL_EXTRA_LAPS * words.length + forwardDistance;
    const start = performance.now();

    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    const step = (now: number) => {
      const t = Math.min((now - start) / SPIN_DURATION_MS, 1);
      const eased = easeOutCubic(t);
      const ticksDone = Math.floor(eased * totalTicks);
      const idx = (startIndex + ticksDone) % words.length;
      setHighlightIndex(idx);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setHighlightIndex(targetIndex);
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinToken]);

  useEffect(() => {
    if (highlightIndex !== null && itemRefs.current[highlightIndex]) {
      itemRefs.current[highlightIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightIndex]);

  return (
    <ul className="flex max-h-[28rem] w-56 flex-col gap-2 overflow-y-auto pr-1">
      {words.map((word, i) => {
        const isSelected =
          (phase === "revealing" || phase === "answering") && i === targetIndex;
        const isHighlighted = phase === "spinning" && i === highlightIndex;
        return (
          <li
            key={`${word}-${i}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`rounded-xl border-2 px-4 py-2 text-center font-[family-name:var(--font-hand)] text-lg transition-colors ${
              isSelected
                ? "border-highlight bg-wrong-soft text-highlight"
                : isHighlighted
                ? "border-accent bg-accent-soft text-text-on-accent"
                : "border-border bg-surface text-text-primary"
            }`}
          >
            {isSelected ? "Word selected" : word}
          </li>
        );
      })}
    </ul>
  );
}
