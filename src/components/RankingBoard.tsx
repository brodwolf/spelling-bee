interface RankingEntry {
  name: string;
  correct: number;
}

interface RankingBoardProps {
  ranking: RankingEntry[];
}

export default function RankingBoard({ ranking }: RankingBoardProps) {
  return (
    <div className="flex w-56 flex-col items-center gap-3 rounded-2xl border-2 border-border bg-surface px-6 py-4">
      <span className="font-[family-name:var(--font-hand)] text-xl text-text-primary">
        Ranking
      </span>

      {ranking.length === 0 ? (
        <p className="text-center text-sm text-text-muted">
          Ninguém pontuou ainda
        </p>
      ) : (
        <ol className="flex w-full flex-col gap-2">
          {ranking.map((entry, i) => (
            <li
              key={entry.name}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-1.5"
            >
              <span className="flex items-center gap-2 truncate text-text-primary">
                <span className="text-text-muted">{i + 1}.</span>
                <span className="truncate">{entry.name}</span>
              </span>
              <span className="font-bold text-correct">{entry.correct}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
