'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { UserProfileDropdown } from '@/components/user-profile-dropdown';

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-6 ">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>

        {/* Title & Subtitle */}
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold tracking-tight leading-none">xG Simulator</h1>
          <p className="text-xs text-muted-foreground mt-1">Predictive Football Analytics</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar - Restored */}
        <button className="hidden h-9 items-center gap-2 rounded-lg border border-border/50 bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="mr-4">Search matches, teams...</span>
          <kbd className="hidden sm:inline-block rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">⌘K</kbd>
        </button>

        <div className="hidden sm:block h-6 w-px bg-border/50" />

        {/* Actions */}
        <ThemeToggle />
        <UserProfileDropdown />
      </div>
    </header>
  );
}
