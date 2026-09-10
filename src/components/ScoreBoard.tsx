interface ScoreBoardProps {
  right: number;
  wrong: number;
}

export default function ScoreBoard({ right, wrong }: ScoreBoardProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-surface px-6 py-4">
      <span className="font-[family-name:var(--font-hand)] text-xl text-text-primary">
        Acertos / Erros
      </span>
      <div className="flex items-center gap-6">
        <span className="text-3xl font-bold text-correct">{right}</span>
        <span className="text-3xl font-bold text-wrong">{wrong}</span>
      </div>
    </div>
  );
}
