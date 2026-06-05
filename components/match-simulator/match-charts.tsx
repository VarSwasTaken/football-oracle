'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { calculatePoissonProbability } from '@/lib/poisson';

interface MatchChartsProps {
  homeXG: number;
  awayXG: number;
  homeName: string;
  awayName: string;
}

export function MatchCharts({ homeXG, awayXG, homeName, awayName }: MatchChartsProps) {
  // Generate distribution data for goals scored from 0 to 5
  const chartData = useMemo(() => {
    const data = [];
    for (let goals = 0; goals <= 5; goals++) {
      data.push({
        goals: `${goals} G`,
        [homeName]: Number((calculatePoissonProbability(homeXG, goals) * 100).toFixed(1)),
        [awayName]: Number((calculatePoissonProbability(awayXG, goals) * 100).toFixed(1)),
      });
    }
    return data;
  }, [homeXG, awayXG, homeName, awayName]);

  return (
    <div className="mt-8 p-6 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
      <h3 className="text-center font-semibold text-slate-500 mb-6 uppercase tracking-wider text-sm">Goal Distribution Probability</h3>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="goals" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} unit="%" />
            <Tooltip contentStyle={{ background: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff' }} itemStyle={{ fontSize: '13px' }} />
            <Bar dataKey={homeName} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey={awayName} fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
