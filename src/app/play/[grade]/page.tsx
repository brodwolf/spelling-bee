import { notFound } from "next/navigation";
import { GRADES, getGrade } from "@/data/words";
import GameBoard from "@/components/GameBoard";

export function generateStaticParams() {
  return GRADES.map((grade) => ({ grade: grade.key }));
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade: gradeKey } = await params;
  const grade = getGrade(gradeKey);

  if (!grade) {
    notFound();
  }

  return <GameBoard gradeLabel={grade.label} initialWords={grade.words} />;
}
