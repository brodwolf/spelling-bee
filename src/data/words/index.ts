import { sextoAnoWords } from "./sexto";
import { setimoAnoWords } from "./setimo";
import { oitavoAnoWords } from "./oitavo";
import { nonoAnoWords } from "./nono";

export type GradeKey = "sexto" | "setimo" | "oitavo" | "nono";

export interface GradeInfo {
  key: GradeKey;
  label: string;
  words: string[];
}

export const GRADES: GradeInfo[] = [
  { key: "sexto", label: "6th Grade", words: sextoAnoWords },
  { key: "setimo", label: "7th Grade", words: setimoAnoWords },
  { key: "oitavo", label: "8th Grade", words: oitavoAnoWords },
  { key: "nono", label: "9th Grade", words: nonoAnoWords },
];

export function getGrade(key: string): GradeInfo | undefined {
  return GRADES.find((grade) => grade.key === key);
}

export function isGradeKey(key: string): key is GradeKey {
  return GRADES.some((grade) => grade.key === key);
}
