"use client";

import { useEffect, useRef, useState } from "react";
import { SPIN_DURATION_MS, REEL_EXTRA_LAPS } from "@/config/animation";
import { theme } from "@/config/theme";
import { getWheelSegmentColors } from "@/lib/wheelColors";

interface WordReelProps {
  words: string[];
  spinToken: number;
  targetIndex: number;
  phase: "idle" | "spinning" | "revealing" | "answering" | "finished";
}

const SELECTED_FLEX_WEIGHT = 24;
// Flex weight by distance from the settled focus index: [distance 0, 1, 2].
const FOCUS_FLEX_WEIGHTS = [SELECTED_FLEX_WEIGHT, 10, 5];
const BASE_FLEX_WEIGHT = 1;
const FOCUS_TEXT_RADIUS = FOCUS_FLEX_WEIGHTS.length - 1;
// Below this word count every bar has enough room to always show its
// text (container min-height 288px / ~16px per row ≈ 18 rows).
const MAX_ALWAYS_TEXT_WORDS = 18;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function WordReel({ words, spinToken, targetIndex, phase }: WordReelProps) {
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const hasMounted = useRef(false);
  const frameRef = useRef<number | null>(null);

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

  const segmentColors = getWheelSegmentColors(words.length, theme.wheel);
  const alwaysShowText = words.length > 0 && words.length <= MAX_ALWAYS_TEXT_WORDS;

  // The settled focus only drives layout (flex-grow). It's static once the
  // wheel stops, so growing into place is a single transition rather than
  // a per-tick reflow.
  const settledFocusIndex =
    phase === "revealing" || phase === "answering" ? targetIndex : null;
  // The live sweep index only drives a background-color highlight while
  // spinning — a cheap, compositor-only repaint with no layout thrash.
  const sweepIndex = phase === "spinning" ? highlightIndex : null;

  return (
    <div className="flex h-72 w-56 flex-col gap-px sm:h-[26rem] sm:w-64">
      {words.map((word, i) => {
        const isSelected =
          (phase === "revealing" || phase === "answering") && i === targetIndex;
        const settledDistance =
          settledFocusIndex === null ? Infinity : Math.abs(i - settledFocusIndex);
        const isSweeping = sweepIndex !== null && i === sweepIndex;

        const showText =
          isSelected || alwaysShowText || settledDistance <= FOCUS_TEXT_RADIUS;

        const flexWeight = isSelected
          ? SELECTED_FLEX_WEIGHT
          : settledDistance <= FOCUS_TEXT_RADIUS
            ? FOCUS_FLEX_WEIGHTS[settledDistance]
            : BASE_FLEX_WEIGHT;

        const fontSizeClass = isSelected
          ? "text-sm sm:text-base"
          : settledDistance === 0
            ? "text-xs sm:text-sm"
            : settledDistance === 1
              ? "text-[11px]"
              : alwaysShowText
                ? "text-[10px]"
                : "text-[9px]";

        const background = isSelected
          ? theme.wrongSoft
          : isSweeping || settledDistance === 0
            ? theme.accent
            : segmentColors[i];

        const textColor = isSelected
          ? theme.highlight
          : showText || isSweeping
            ? theme.textOnAccent
            : undefined;

        return (
          <div
            key={`${word}-${i}`}
            className={`flex items-center justify-center overflow-hidden rounded-sm text-center transition-[flex-grow,background-color,color] duration-150 ${fontSizeClass} ${
              isSelected
                ? "border-2 border-highlight px-2 py-1 font-[family-name:var(--font-hand)]"
                : showText
                  ? "px-1 font-[family-name:var(--font-hand)]"
                  : ""
            }`}
            style={{
              flexGrow: flexWeight,
              flexBasis: 0,
              minHeight: isSelected ? 32 : showText ? 10 : 1,
              background,
              color: textColor,
            }}
          >
            {showText ? (
              <span className={isSelected ? "break-words" : "w-full truncate"}>
                {word}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
