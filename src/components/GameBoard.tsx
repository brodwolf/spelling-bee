"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RouletteWheel from "./RouletteWheel";
import WordReel from "./WordReel";
import RankingBoard from "./RankingBoard";
import SpellingInput from "./SpellingInput";
import RevealOverlay from "./RevealOverlay";
import StudentPickerModal from "./StudentPickerModal";
import BeeMascot from "./BeeMascot";
import { REVEAL_DURATION_MS, SPIN_DURATION_MS } from "@/config/animation";

type Phase = "idle" | "spinning" | "revealing" | "answering" | "finished";

interface GameBoardProps {
  gradeLabel: string;
  initialWords: string[];
  initialStudents: string[];
}

export default function GameBoard({
  gradeLabel,
  initialWords,
  initialStudents,
}: GameBoardProps) {
  const [remainingWords, setRemainingWords] = useState(initialWords);
  const [studentsPool, setStudentsPool] = useState(initialStudents);
  const [ranking, setRanking] = useState<Record<string, number>>({});
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [modalSession, setModalSession] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [spinToken, setSpinToken] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");

  const selectedWord =
    selectedIndex !== null ? remainingWords[selectedIndex] ?? null : null;

  const rankingList = Object.entries(ranking)
    .map(([name, correct]) => ({ name, correct }))
    .sort((a, b) => b.correct - a.correct || a.name.localeCompare(b.name));

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
    if (phase !== "idle" || remainingWords.length === 0 || !selectedStudent) return;
    const index = Math.floor(Math.random() * remainingWords.length);
    setSelectedIndex(index);
    setTypedAnswer("");
    setSpinToken((t) => t + 1);
    setPhase("spinning");
  }

  function handleGrade(isRight: boolean) {
    if (phase !== "answering" || selectedIndex === null || !selectedStudent) return;

    const nextWords = remainingWords.filter((_, i) => i !== selectedIndex);
    const nextStudentsPool = isRight
      ? studentsPool
      : studentsPool.filter((name) => name !== selectedStudent);

    if (isRight) {
      setRanking((r) => ({
        ...r,
        [selectedStudent]: (r[selectedStudent] ?? 0) + 1,
      }));
    } else {
      setStudentsPool(nextStudentsPool);
    }

    setRemainingWords(nextWords);
    setSelectedIndex(null);
    setSelectedStudent(null);
    setTypedAnswer("");
    setPhase(
      nextWords.length === 0 || nextStudentsPool.length === 0 ? "finished" : "idle"
    );
  }

  function handleRestart() {
    setRemainingWords(initialWords);
    setStudentsPool(initialStudents);
    setRanking({});
    setSelectedStudent(null);
    setSelectedIndex(null);
    setTypedAnswer("");
    setPhase("idle");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg px-4 py-8 sm:px-8">
      <div className="w-full max-w-[92rem] rounded-[2rem] border-2 border-dashed border-border bg-surface/60 px-6 py-10 sm:px-14 sm:py-12">
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-text-muted underline-offset-2 hover:underline"
          >
            ← Trocar turma
          </Link>
          <h1 className="font-[family-name:var(--font-hand)] text-4xl text-text-primary sm:text-5xl">
            Spelling Bee — {gradeLabel}
          </h1>
          <span className="w-20" />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[auto_1fr_auto] lg:items-start lg:justify-center">
          <div className="flex justify-center lg:justify-start">
            <RankingBoard ranking={rankingList} />
          </div>

          <div className="flex flex-col items-center gap-6">
            {phase !== "finished" && (
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="font-[family-name:var(--font-hand)] text-xl text-text-primary">
                  {selectedStudent ? (
                    <>
                      Aluno da vez:{" "}
                      <span className="text-accent">{selectedStudent}</span>
                    </>
                  ) : (
                    "Nenhum aluno selecionado"
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setModalSession((s) => s + 1);
                    setIsStudentModalOpen(true);
                  }}
                  disabled={phase !== "idle" || studentsPool.length === 0}
                  className="rounded-full border-2 border-accent px-5 py-1.5 font-[family-name:var(--font-hand)] text-base text-accent transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                >
                  {selectedStudent ? "Trocar aluno" : "Sortear aluno"}
                </button>
              </div>
            )}

            <RouletteWheel
              words={remainingWords}
              spinToken={spinToken}
              targetIndex={selectedIndex ?? 0}
              remainingLabel={`${remainingWords.length}`}
            />

            {phase === "finished" ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="font-[family-name:var(--font-hand)] text-3xl text-accent">
                  Concluído! 🎉
                </p>
                <p className="text-text-muted">Confira o ranking final ao lado.</p>
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
                disabled={
                  phase !== "idle" || remainingWords.length === 0 || !selectedStudent
                }
                className="rounded-full border-2 border-accent bg-accent px-8 py-3 font-[family-name:var(--font-hand)] text-2xl text-text-on-accent shadow-md transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                Girar
              </button>
            )}

            <SpellingInput
              word={selectedWord}
              studentName={selectedStudent}
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

      <RevealOverlay
        visible={phase === "revealing"}
        word={selectedWord}
        studentName={selectedStudent}
      />

      <StudentPickerModal
        key={modalSession}
        open={isStudentModalOpen}
        students={studentsPool}
        onConfirm={(name) => {
          setSelectedStudent(name);
          setIsStudentModalOpen(false);
        }}
        onClose={() => setIsStudentModalOpen(false)}
      />
    </div>
  );
}
