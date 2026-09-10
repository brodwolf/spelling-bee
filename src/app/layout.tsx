import type { Metadata } from "next";
import { Patrick_Hand, Nunito } from "next/font/google";
import { theme } from "@/config/theme";
import "./globals.css";

const patrickHand = Patrick_Hand({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spelling Bee",
  description: "Concurso de soletrar para a sala de aula",
};

const themeStyleVars = `:root {
  --bg: ${theme.background};
  --surface: ${theme.surface};
  --surface-muted: ${theme.surfaceMuted};
  --border: ${theme.border};
  --text-primary: ${theme.textPrimary};
  --text-muted: ${theme.textMuted};
  --text-on-accent: ${theme.textOnAccent};
  --accent: ${theme.accent};
  --accent-soft: ${theme.accentSoft};
  --highlight: ${theme.highlight};
  --correct: ${theme.correct};
  --correct-soft: ${theme.correctSoft};
  --wrong: ${theme.wrong};
  --wrong-soft: ${theme.wrongSoft};
}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${patrickHand.variable} ${nunito.variable} h-full antialiased`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyleVars }} />
      </head>
      <body
        className="min-h-full flex flex-col font-[family-name:var(--font-body)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {children}
      </body>
    </html>
  );
}
