"use client";

import { useEffect, useRef, useState } from "react";
import { theme } from "@/config/theme";
import { SPIN_DURATION_MS, SPIN_TURNS } from "@/config/animation";
import { getWheelSegmentColors } from "@/lib/wheelColors";

interface RouletteWheelProps {
  words: string[];
  spinToken: number;
  targetIndex: number;
  onSpinComplete?: () => void;
  remainingLabel?: string;
}

const TEXT_RADIUS = 40;

function truncateForArc(word: string, segAngle: number, fontSize: number) {
  const arcLength = (segAngle * Math.PI) / 180 * TEXT_RADIUS;
  const avgCharWidth = fontSize * 0.62;
  const maxChars = Math.max(2, Math.floor(arcLength / avgCharWidth));
  if (word.length <= maxChars) return word;
  if (maxChars <= 2) return word.slice(0, 1) + "…";
  return word.slice(0, maxChars - 1) + "…";
}

export default function RouletteWheel({
  words,
  spinToken,
  targetIndex,
  onSpinComplete,
  remainingLabel,
}: RouletteWheelProps) {
  const segmentCount = words.length;
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (segmentCount <= 0) return;

    const segAngle = 360 / segmentCount;
    const centerAngle = targetIndex * segAngle + segAngle / 2;
    const currentMod = ((rotationRef.current % 360) + 360) % 360;
    const wanted = (360 - centerAngle + 360) % 360;
    const delta = ((wanted - currentMod) % 360 + 360) % 360;
    const nextRotation = rotationRef.current + SPIN_TURNS * 360 + delta;

    rotationRef.current = nextRotation;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicks off the CSS transition in response to an external "spin" command (spinToken)
    setSpinning(true);
    setRotation(nextRotation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinToken]);

  const segAngle = segmentCount > 0 ? 360 / segmentCount : 360;
  const segmentColors = getWheelSegmentColors(segmentCount, theme.wheel, true);
  const gradientStops = Array.from({ length: Math.max(segmentCount, 1) }, (_, i) => {
    const color = segmentColors[i] ?? theme.surfaceMuted;
    const from = i * segAngle;
    const to = (i + 1) * segAngle;
    return `${color} ${from}deg ${to}deg`;
  }).join(", ");

  const dividers = Array.from({ length: segmentCount }, (_, i) => i * segAngle);
  const fontSize = Math.min(4.2, Math.max(1.6, segAngle * 0.3));

  return (
    <div className="relative flex flex-col items-center">
      {/* pointer */}
      <div
        className="absolute -top-3 left-1/2 z-10 h-0 w-0 -translate-x-1/2"
        style={{
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: `18px solid ${theme.highlight}`,
        }}
      />

      <div className="relative h-72 w-72 sm:h-[26rem] sm:w-[26rem] rounded-full border-4 border-border shadow-lg overflow-hidden">
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              segmentCount > 0
                ? `conic-gradient(${gradientStops})`
                : theme.surfaceMuted,
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.2, 1)`
              : "none",
          }}
          onTransitionEnd={() => {
            if (spinning) {
              setSpinning(false);
              onSpinComplete?.();
            }
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full pointer-events-none"
          >
            {dividers.map((deg) => (
              <line
                key={deg}
                x1="50"
                y1="50"
                x2="50"
                y2="2"
                stroke={theme.border}
                strokeWidth="0.6"
                opacity="0.5"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}

            {words.map((word, i) => {
              const mid = i * segAngle + segAngle / 2;
              return (
                <text
                  key={`${word}-${i}`}
                  x="50"
                  y={50 - TEXT_RADIUS}
                  textAnchor="middle"
                  fontSize={fontSize}
                  fill={theme.textOnAccent}
                  className="select-none font-[family-name:var(--font-hand)]"
                  transform={`rotate(${mid} 50 50)`}
                >
                  {truncateForArc(word, segAngle, fontSize)}
                </text>
              );
            })}
          </svg>
        </div>

        <div
          className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-border flex items-center justify-center text-sm font-bold"
          style={{ background: theme.surface, color: theme.textPrimary }}
        >
          {remainingLabel}
        </div>
      </div>
    </div>
  );
}
