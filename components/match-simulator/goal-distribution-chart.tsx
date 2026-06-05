'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculatePoissonProbability } from '@/lib/poisson';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface GoalDistributionChartProps {
  homeLambda: number;
  awayLambda: number;
  homeTeam: string;
  awayTeam: string;
}

const LIGHT_COLORS = { home: '#3b82f6', away: '#10b981', grid: 'rgba(0,0,0,0.06)', text: 'rgba(0,0,0,0.5)' };
const DARK_COLORS = { home: '#60a5fa', away: '#34d399', grid: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.6)' };

export function GoalDistributionChart({ homeLambda, awayLambda, homeTeam, awayTeam }: GoalDistributionChartProps) {
  const [colors, setColors] = useState(LIGHT_COLORS);

  useEffect(() => {
    const updateColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setColors(isDark ? DARK_COLORS : LIGHT_COLORS);
    };
    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const chartData = Array.from({ length: 6 }, (_, i) => ({
    goals: `${i}`,
    home: Number((calculatePoissonProbability(homeLambda, i) * 100).toFixed(1)),
    away: Number((calculatePoissonProbability(awayLambda, i) * 100).toFixed(1)),
  }));

  return (
    <Card className="border-0 bg-card/50 shadow-xl shadow-black/5 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-base font-semibold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
            </span>
            Goal Distribution
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 text-[10px] font-semibold">
              {homeTeam || 'Home'}
            </Badge>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 text-[10px] font-semibold">
              {awayTeam || 'Away'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full" style={{ minWidth: 300, minHeight: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 10 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
              <XAxis dataKey="goals" axisLine={false} tickLine={false} tick={{ fill: colors.text, fontSize: 12, fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: colors.text, fontSize: 11 }} tickFormatter={(value) => `${value}%`} width={45} />
              <Tooltip
                cursor={{ fill: 'rgba(128, 128, 128, 0.08)' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-border/50 bg-popover/95 p-3 shadow-xl backdrop-blur-xl">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label} Goals</p>
                        {payload.map((entry) => (
                          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-sm font-medium">{entry.dataKey === 'home' ? homeTeam || 'Home' : awayTeam || 'Away'}</span>
                            </div>
                            <span className="font-mono text-sm font-semibold tabular-nums">{entry.value}%</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} formatter={(value) => (value === 'home' ? homeTeam || 'Home' : awayTeam || 'Away')} wrapperStyle={{ fontSize: 12, fontWeight: 500 }} />
              <Bar dataKey="home" fill={colors.home} radius={[4, 4, 0, 0]} name="home" />
              <Bar dataKey="away" fill={colors.away} radius={[4, 4, 0, 0]} name="away" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
