"use client";

import { AnimatePresence, motion } from "framer-motion";
import BeeMascot from "./BeeMascot";

interface RevealOverlayProps {
  visible: boolean;
  word: string | null;
  studentName: string | null;
}

export default function RevealOverlay({
  visible,
  word,
  studentName,
}: RevealOverlayProps) {
  return (
    <AnimatePresence>
      {visible && word && (
        <motion.div
          key="reveal-overlay"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-bg/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <BeeMascot className="h-20 w-20" />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="px-6 text-center font-[family-name:var(--font-hand)] text-3xl text-text-muted sm:text-4xl"
          >
            {studentName ? `${studentName}, sua palavra é:` : "Sua palavra é:"}
          </motion.span>

          <motion.span
            initial={{ opacity: 0, scale: 0.3, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              delay: 0.55,
              duration: 0.6,
              type: "spring",
              bounce: 0.55,
            }}
            className="px-6 text-center font-[family-name:var(--font-hand)] text-6xl text-accent sm:text-8xl"
          >
            {word}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
