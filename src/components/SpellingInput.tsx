"use client";

interface SpellingInputProps {
  word: string | null;
  studentName: string | null;
  typedAnswer: string;
  onChangeTyped: (value: string) => void;
  onGrade: (isRight: boolean) => void;
  active: boolean;
}

export default function SpellingInput({
  word,
  studentName,
  typedAnswer,
  onChangeTyped,
  onGrade,
  active,
}: SpellingInputProps) {
  const target = (word ?? "").toLowerCase();
  const typed = typedAnswer.toLowerCase();
  const isPrefixMatch = target.startsWith(typed) && typed.length > 0;
  const isExactMatch = typed.length > 0 && typed === target;

  const feedbackClass = !active || typedAnswer.length === 0
    ? "border-border"
    : isPrefixMatch
      ? isExactMatch
        ? "border-correct ring-2 ring-correct/40"
        : "border-correct"
      : "border-wrong ring-2 ring-wrong/30";

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <span className="text-center font-[family-name:var(--font-hand)] text-2xl text-text-primary">
        {studentName ? (
          <>
            <span className="text-accent">{studentName}</span>, your word is:
          </>
        ) : (
          "Your word is:"
        )}
      </span>
      <span className="min-h-10 font-[family-name:var(--font-hand)] text-3xl tracking-wide text-accent">
        {word
          ? word.split("").map((letter, i) => (
              <span
                key={i}
                className={
                  i < typedAnswer.length &&
                  letter.toLowerCase() === typedAnswer[i]?.toLowerCase()
                    ? "text-correct"
                    : undefined
                }
              >
                {letter}
              </span>
            ))
          : "—"}
      </span>

      <input
        type="text"
        value={typedAnswer}
        onChange={(e) => onChangeTyped(e.target.value)}
        disabled={!active}
        placeholder="type"
        autoComplete="off"
        spellCheck={false}
        className={`w-full rounded-xl border-2 bg-surface px-4 py-3 text-center text-lg text-text-primary outline-none transition-colors disabled:opacity-50 ${feedbackClass}`}
      />

      <div className="flex gap-4">
        <button
          type="button"
          disabled={!active}
          onClick={() => onGrade(false)}
          className="rounded-xl border-2 border-wrong bg-wrong-soft px-6 py-2 font-[family-name:var(--font-hand)] text-xl text-wrong transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
        >
          Wrong
        </button>
        <button
          type="button"
          disabled={!active}
          onClick={() => onGrade(true)}
          className="rounded-xl border-2 border-correct bg-correct-soft px-6 py-2 font-[family-name:var(--font-hand)] text-xl text-correct transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
        >
          Right
        </button>
      </div>
    </div>
  );
}
