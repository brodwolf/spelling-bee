/**
 * Single source of truth for the app's colors.
 * Change the values below to try other palettes — everything (Tailwind,
 * CSS vars and components) reads from here via `src/app/layout.tsx`.
 */

export const palette = {
  wineRed: "#7C0A2E",
  cocoa: "#3E2A1E",
  navy: "#1B2A4A",
  camel: "#C8956D",
  cream: "#F3ECDD",
} as const;

export const theme = {
  // surfaces
  background: palette.cream,
  surface: "#FFFFFF",
  surfaceMuted: "#EFE4D0",

  // borders and text
  border: palette.cocoa,
  textPrimary: palette.cocoa,
  textMuted: "#8A7562",
  textOnAccent: palette.cream,

  // accents
  accent: palette.navy,
  accentSoft: palette.camel,
  highlight: palette.wineRed,

  // wheel (cyclical segment palette)
  wheel: [palette.wineRed, palette.navy, palette.camel, palette.cocoa],

  // feedback (note: we avoid the name "right" since it collides with the
  // Tailwind `text-right` text-alignment utility)
  correct: "#2F6B3A",
  correctSoft: "#DDEEDF",
  wrong: palette.wineRed,
  wrongSoft: "#F5DEE2",
} as const;

export type ThemeTokens = typeof theme;
