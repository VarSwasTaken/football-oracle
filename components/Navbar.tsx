'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Activity } from 'lucide-react';

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg tracking-tight">
          <div className="p-1.5 bg-blue-600 rounded-md">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span>xG Simulator</span>
        </div>

        {/* Actions Section */}
        <div>
          <button suppressHydrationWarning onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
