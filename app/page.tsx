import { MatchSimulator } from '@/components/MatchSimulator';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-12 flex justify-center mt-8">
        <h1 className="text-3xl font-bold tracking-tight">Football Oracle</h1>
      </header>

      <MatchSimulator />
    </main>
  );
}
