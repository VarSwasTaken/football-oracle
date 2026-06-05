'use client';

import { Card, CardContent } from '@/components/ui/card';

interface PredictedProbabilitiesProps {
  homeWin: number;
  draw: number;
  awayWin: number;
  homeTeam: string;
  awayTeam: string;
}

export function PredictedProbabilities({ homeWin, draw, awayWin, homeTeam, awayTeam }: PredictedProbabilitiesProps) {
  // Determine favorite
  const favorite = homeWin > awayWin && homeWin > draw ? 'home' : awayWin > homeWin && awayWin > draw ? 'away' : 'draw';

  return (
    <Card className="border-0 bg-card/50 shadow-xl shadow-black/5 ">
      <CardContent className="p-6">
        {/* Combined Progress Bar */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium text-blue-500">{homeTeam || 'Home'}</span>
            <span className="text-muted-foreground">vs</span>
            <span className="font-medium text-emerald-500">{awayTeam || 'Away'}</span>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/50">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${homeWin}%` }} />
            <div className="h-full bg-slate-400 transition-all duration-500" style={{ width: `${draw}%` }} />
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${awayWin}%` }} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <ProbabilityBlock label={homeTeam || 'Home'} sublabel="Win" percentage={homeWin} variant="home" isFavorite={favorite === 'home'} />
          <ProbabilityBlock label="Draw" sublabel="" percentage={draw} variant="draw" isFavorite={favorite === 'draw'} />
          <ProbabilityBlock label={awayTeam || 'Away'} sublabel="Win" percentage={awayWin} variant="away" isFavorite={favorite === 'away'} />
        </div>
      </CardContent>
    </Card>
  );
}

interface ProbabilityBlockProps {
  label: string;
  sublabel: string;
  percentage: number;
  variant: 'home' | 'draw' | 'away';
  isFavorite: boolean;
}

function ProbabilityBlock({ label, sublabel, percentage, variant, isFavorite }: ProbabilityBlockProps) {
  const colorClass = {
    home: 'text-blue-500',
    draw: 'text-slate-500',
    away: 'text-emerald-500',
  }[variant];

  const bgClass = {
    home: 'bg-blue-500/5 ring-blue-500/20',
    draw: 'bg-slate-500/5 ring-slate-500/20',
    away: 'bg-emerald-500/5 ring-emerald-500/20',
  }[variant];

  return (
    <div className={`relative rounded-xl p-4 text-center transition-all duration-300 ${bgClass} ${isFavorite ? 'ring-2' : 'ring-1 ring-border/50'}`}>
      {isFavorite && <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">Favorite</span>}
      <p className="mb-1 truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
        {sublabel && <span className="ml-1">{sublabel}</span>}
      </p>
      <p className={`font-mono text-2xl font-bold tabular-nums tracking-tighter ${colorClass}`}>
        {percentage.toFixed(1)}
        <span className="text-base">%</span>
      </p>
    </div>
  );
}
