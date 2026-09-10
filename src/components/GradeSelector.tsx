import Link from "next/link";
import { GRADES } from "@/data/words";

export default function GradeSelector() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
      {GRADES.map((grade) => (
        <Link
          key={grade.key}
          href={`/play/${grade.key}`}
          className="group rounded-2xl border-2 border-border bg-surface px-6 py-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-accent"
        >
          <span className="block font-[family-name:var(--font-hand)] text-3xl text-text-primary group-hover:text-accent">
            {grade.label}
          </span>
          <span className="mt-2 block text-sm text-text-muted">
            {grade.words.length} words
          </span>
        </Link>
      ))}
    </div>
  );
}
