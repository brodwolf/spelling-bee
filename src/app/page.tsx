import BeeMascot from "@/components/BeeMascot";
import GradeSelector from "@/components/GradeSelector";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-bg px-6 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <BeeMascot className="w-24 h-24" />
        <h1 className="font-[family-name:var(--font-hand)] text-5xl text-text-primary">
          Spelling Bee
        </h1>
        <p className="max-w-md text-text-muted">
          Escolha a turma para começar o concurso de soletrar.
        </p>
      </div>

      <GradeSelector />
    </main>
  );
}
