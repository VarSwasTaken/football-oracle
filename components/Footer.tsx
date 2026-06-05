export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-12 bg-white dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
        <p>© {new Date().getFullYear()} Poisson Match Simulator. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Documentation</span>
          <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">GitHub</span>
        </div>
      </div>
    </footer>
  );
}
