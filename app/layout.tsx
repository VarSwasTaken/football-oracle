import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { DashboardSidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'xG Simulator | Analytics Platform',
  description: 'Premium football match simulation and odds.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider delayDuration={100}>
            <div className="flex min-h-screen">
              {/* Lewy Sidebar od v0 */}
              <DashboardSidebar />

              {/* Główna sekcja - dodajemy pl-16 (padding-left: 4rem) na sm, żeby zrobić miejsce dla ukrytego sidebaru */}
              <div className="flex-1 flex flex-col sm:pl-16">
                {/* Górny Navbar */}
                <Header />

                {/* Kontent danej podstrony */}
                <main className="flex-grow p-4 md:p-8">{children}</main>

                {/* Footer na dole */}
                <footer className="border-t border-border/50 py-6 text-center bg-background/50 backdrop-blur-sm mt-auto">
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">Predictions are based on statistical models using the Poisson distribution. For entertainment purposes only.</p>
                </footer>
              </div>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
