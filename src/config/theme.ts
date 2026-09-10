/**
 * Única fonte de verdade das cores do app.
 * Troque os valores abaixo para testar outras paletas — tudo (Tailwind,
 * CSS vars e componentes) lê a partir daqui via `src/app/layout.tsx`.
 */

export const palette = {
  wineRed: "#7C0A2E",
  cocoa: "#3E2A1E",
  navy: "#1B2A4A",
  camel: "#C8956D",
  cream: "#F3ECDD",
} as const;

export const theme = {
  // superfícies
  background: palette.cream,
  surface: "#FFFFFF",
  surfaceMuted: "#EFE4D0",

  // bordas e texto
  border: palette.cocoa,
  textPrimary: palette.cocoa,
  textMuted: "#8A7562",
  textOnAccent: palette.cream,

  // acentos
  accent: palette.navy,
  accentSoft: palette.camel,
  highlight: palette.wineRed,

  // roleta (paleta cíclica de segmentos)
  wheel: [palette.wineRed, palette.navy, palette.camel, palette.cocoa],

  // feedback (nota: evitamos o nome "right" pois colide com a utilitária
  // Tailwind `text-right` de alinhamento de texto)
  correct: "#2F6B3A",
  correctSoft: "#DDEEDF",
  wrong: palette.wineRed,
  wrongSoft: "#F5DEE2",
} as const;

export type ThemeTokens = typeof theme;
