"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SPIN_DURATION_MS } from "@/config/animation";
import BeeMascot from "./BeeMascot";

interface StudentPickerModalProps {
  open: boolean;
  students: string[];
  onConfirm: (name: string) => void;
  onClose: () => void;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function StudentPickerModal({
  open,
  students,
  onConfirm,
  onClose,
}: StudentPickerModalProps) {
  const [pick, setPick] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [cycleName, setCycleName] = useState<string | null>(null);
  const frameRef = useRef<number | null>(null);

  function handleSpin() {
    if (students.length === 0 || spinning) return;
    setSpinning(true);
    setPick(null);

    const start = performance.now();
    const finalPick = students[Math.floor(Math.random() * students.length)];
    const totalTicks = students.length * 3 + Math.floor(Math.random() * students.length);

    const step = (now: number) => {
      const t = Math.min((now - start) / SPIN_DURATION_MS, 1);
      const eased = easeOutCubic(t);
      const idx = Math.floor(eased * totalTicks) % students.length;
      setCycleName(students[idx]);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setCycleName(finalPick);
        setPick(finalPick);
        setSpinning(false);
      }
    };

    frameRef.current = requestAnimationFrame(step);
  }

  function handleClose() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="student-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full max-w-sm rounded-[1.5rem] border-2 border-border bg-surface px-6 py-8 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-4 top-4 text-2xl leading-none text-text-muted hover:text-text-primary"
            >
              ×
            </button>

            <div className="flex flex-col items-center gap-6">
              <BeeMascot className="h-14 w-14" />
              <h2 className="font-[family-name:var(--font-hand)] text-2xl text-text-primary">
                Pick a student
              </h2>

              {students.length === 0 ? (
                <p className="text-center text-text-muted">
                  No students available.
                </p>
              ) : (
                <>
                  <div className="flex min-h-16 w-full items-center justify-center rounded-xl border-2 border-border bg-surface-muted px-4 py-3">
                    {cycleName ? (
                      <motion.span
                        key={cycleName}
                        initial={{
                          scale: spinning ? 1 : 0.6,
                          opacity: spinning ? 1 : 0,
                        }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={
                          spinning
                            ? { duration: 0.08 }
                            : { type: "spring", bounce: 0.55, duration: 0.5 }
                        }
                        className="font-[family-name:var(--font-hand)] text-3xl text-accent"
                      >
                        {cycleName}
                      </motion.span>
                    ) : (
                      <span className="text-text-muted">?</span>
                    )}
                  </div>

                  <div className="flex w-full gap-3">
                    <button
                      type="button"
                      onClick={handleSpin}
                      disabled={spinning}
                      className="flex-1 rounded-xl border-2 border-accent bg-accent px-4 py-2 font-[family-name:var(--font-hand)] text-lg text-text-on-accent transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                    >
                      {pick ? "Draw again" : "Draw"}
                    </button>
                    <button
                      type="button"
                      onClick={() => pick && onConfirm(pick)}
                      disabled={!pick || spinning}
                      className="flex-1 rounded-xl border-2 border-correct bg-correct-soft px-4 py-2 font-[family-name:var(--font-hand)] text-lg text-correct transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
