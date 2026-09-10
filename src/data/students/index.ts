import type { GradeKey } from "@/data/words";
import { sextoAnoStudents } from "./sexto";
import { setimoAnoStudents } from "./setimo";
import { oitavoAnoStudents } from "./oitavo";
import { nonoAnoStudents } from "./nono";

export interface StudentGradeInfo {
  key: GradeKey;
  students: string[];
}

export const STUDENTS: StudentGradeInfo[] = [
  { key: "sexto", students: sextoAnoStudents },
  { key: "setimo", students: setimoAnoStudents },
  { key: "oitavo", students: oitavoAnoStudents },
  { key: "nono", students: nonoAnoStudents },
];

export function getStudents(key: string): string[] {
  return STUDENTS.find((grade) => grade.key === key)?.students ?? [];
}
