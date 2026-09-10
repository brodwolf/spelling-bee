"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RouletteWheel from "./RouletteWheel";
import WordReel from "./WordReel";
import ScoreBoard from "./ScoreBoard";
import SpellingInput from "./SpellingInput";
import RevealOverlay from "./RevealOverlay";
import BeeMascot from "./BeeMascot";
import { REVEAL_DURATION_MS, SPIN_DURATION_MS } from "@/config/animation";

type Phase = "idle" | "spinning" | "revealing" | "answering" | "finished";

interface GameBoardProps {
  gradeLabel: string;
  initialWords: string[];
}

export default function GameBoard({ gradeLabel, initialWords }: GameBoardProps) {
  const [remainingWords, setRemainingWords] = useState(initialWords);
  const [phase, setPhase] = useState<Phase>("idle");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [spinToken, setSpinToken] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [score, setScore] = useState({ right: 0, wrong: 0 });

  const selectedWord =
    selectedIndex !== null ? remainingWords[selectedIndex] ?? null : null;

  useEffect(() => {
    if (phase !== "spinning") return;
    const timer = setTimeout(() => setPhase("revealing"), SPIN_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase, spinToken]);

  useEffect(() => {
    if (phase !== "revealing") return;
    const timer = setTimeout(() => setPhase("answering"), REVEAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  function handleSpin() {
    if (phase !== "idle" || remainingWords.length === 0) return;
    const index = Math.floor(Math.random() * remainingWords.length);
    setSelectedIndex(index);
    setTypedAnswer("");
    setSpinToken((t) => t + 1);
    setPhase("spinning");
  }

  function handleGrade(isRight: boolean) {
    if (phase !== "answering" || selectedIndex === null) return;
    setScore((s) =>
      isRight ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 }
    );
    const nextWords = remainingWords.filter((_, i) => i !== selectedIndex);
    setRemainingWords(nextWords);
    setSelectedIndex(null);
    setTypedAnswer("");
    setPhase(nextWords.length === 0 ? "finished" : "idle");
  }

  function handleRestart() {
    setRemainingWords(initialWords);
    setSelectedIndex(null);
    setTypedAnswer("");
    setScore({ right: 0, wrong: 0 });
    setPhase("idle");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-bg px-4 py-8 sm:px-8">
      <div className="w-full max-w-6xl rounded-[2rem] border-2 border-dashed border-border bg-surface/60 px-4 py-8 sm:px-10">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-text-muted underline-offset-2 hover:underline"
          >
            ← Trocar turma
          </Link>
          <h1 className="font-[family-name:var(--font-hand)] text-3xl text-text-primary sm:text-4xl">
            Spelling Bee — {gradeLabel}
          </h1>
          <span className="w-20" />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[auto_1fr_auto] lg:items-start">
          <div className="flex justify-center lg:justify-start">
            <ScoreBoard right={score.right} wrong={score.wrong} />
          </div>

          <div className="flex flex-col items-center gap-8">
            <RouletteWheel
              segmentCount={remainingWords.length}
              spinToken={spinToken}
              targetIndex={selectedIndex ?? 0}
              remainingLabel={`${remainingWords.length}`}
            />

            {phase === "finished" ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="font-[family-name:var(--font-hand)] text-3xl text-accent">
                  Concluído! 🎉
                </p>
                <p className="text-text-muted">
                  {score.right} acertos / {score.wrong} erros
                </p>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="rounded-xl border-2 border-accent bg-accent px-6 py-2 font-[family-name:var(--font-hand)] text-xl text-text-on-accent transition-transform hover:scale-105"
                >
                  Jogar novamente
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSpin}
                disabled={phase !== "idle" || remainingWords.length === 0}
                className="rounded-full border-2 border-accent bg-accent px-8 py-3 font-[family-name:var(--font-hand)] text-2xl text-text-on-accent shadow-md transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                Girar
              </button>
            )}

            <SpellingInput
              word={selectedWord}
              typedAnswer={typedAnswer}
              onChangeTyped={setTypedAnswer}
              onGrade={handleGrade}
              active={phase === "answering"}
            />
          </div>

          <div className="flex flex-col items-center gap-6 lg:items-end">
            <WordReel
              words={remainingWords}
              spinToken={spinToken}
              targetIndex={selectedIndex ?? 0}
              phase={phase}
            />
            <BeeMascot className="h-24 w-24" />
          </div>
        </div>
      </div>

      <RevealOverlay visible={phase === "revealing"} word={selectedWord} />
    </div>
  );
}
