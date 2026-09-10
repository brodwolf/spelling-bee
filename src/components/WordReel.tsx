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
// peso por distância ao índice em foco: [distância 0, 1, 2]
const FOCUS_FLEX_WEIGHTS = [SELECTED_FLEX_WEIGHT, 10, 5];
const BASE_FLEX_WEIGHT = 1;
const FOCUS_TEXT_RADIUS = FOCUS_FLEX_WEIGHTS.length - 1;

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

  const focusIndex =
    phase === "spinning"
      ? highlightIndex
      : phase === "revealing" || phase === "answering"
        ? targetIndex
        : null;

  return (
    <div className="flex h-72 w-56 flex-col gap-px sm:h-[26rem] sm:w-64">
      {words.map((word, i) => {
        const isSelected =
          (phase === "revealing" || phase === "answering") && i === targetIndex;
        const distance =
          focusIndex === null ? Infinity : Math.abs(i - focusIndex);
        const showText = isSelected || distance <= FOCUS_TEXT_RADIUS;

        const flexWeight = isSelected
          ? SELECTED_FLEX_WEIGHT
          : distance <= FOCUS_TEXT_RADIUS
            ? FOCUS_FLEX_WEIGHTS[distance]
            : BASE_FLEX_WEIGHT;

        const fontSizeClass = isSelected
          ? "text-sm sm:text-base"
          : distance === 0
            ? "text-xs sm:text-sm"
            : distance === 1
              ? "text-[11px]"
              : "text-[9px]";

        const background = isSelected
          ? theme.wrongSoft
          : distance === 0
            ? theme.accent
            : segmentColors[i];

        return (
          <div
            key={`${word}-${i}`}
            className={`flex items-center justify-center overflow-hidden rounded-sm text-center transition-[flex-grow] duration-150 ${fontSizeClass} ${
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
              color: isSelected ? theme.highlight : showText ? theme.textOnAccent : undefined,
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
