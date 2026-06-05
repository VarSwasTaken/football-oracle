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
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider delayDuration={100}>
            <div className="flex min-h-screen">
              {/* Lewy Sidebar od v0 */}
              <DashboardSidebar />

              {/* Główna sekcja */}
              <div className="flex-1 flex flex-col sm:pl-16">
                <Header />
                <main className="flex-grow p-4 md:p-8">{children}</main>

                <footer className="border-t border-border/50 py-6 text-center bg-background/50  mt-auto">
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
