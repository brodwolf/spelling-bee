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
  { key: "sexto", label: "Sexto Ano", words: sextoAnoWords },
  { key: "setimo", label: "Sétimo Ano", words: setimoAnoWords },
  { key: "oitavo", label: "Oitavo Ano", words: oitavoAnoWords },
  { key: "nono", label: "Nono Ano", words: nonoAnoWords },
];

export function getGrade(key: string): GradeInfo | undefined {
  return GRADES.find((grade) => grade.key === key);
}

export function isGradeKey(key: string): key is GradeKey {
  return GRADES.some((grade) => grade.key === key);
}
