'use client';

import { useMemo } from 'react';
import { getTopExactScores, getAllOverUnderLines } from '@/lib/poisson';

interface BettingInsightsProps {
  homeLambda: number;
  awayLambda: number;
  homeName: string;
  awayName: string;
}

export function BettingInsights({ homeLambda, awayLambda, homeName, awayName }: BettingInsightsProps) {
  const { topScores, overUnder } = useMemo(() => {
    return {
      topScores: getTopExactScores(homeLambda, awayLambda, 3),
      overUnder: getAllOverUnderLines(homeLambda, awayLambda),
    };
  }, [homeLambda, awayLambda]);

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Exact Scores Section */}
      <div className="p-6 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Top Exact Scores
        </h3>

        <div className="space-y-3">
          {topScores.map((score, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
              <div className="font-mono text-lg font-bold text-slate-700 dark:text-slate-200">
                {score.homeGoals} <span className="text-slate-400 font-normal mx-1">-</span> {score.awayGoals}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{score.probability.toFixed(1)}%</span>
                {/* Simulated Decimal Odds (100 / probability) */}
                <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">@{(100 / score.probability).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Over/Under Section */}
      <div className="p-6 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Goals Over / Under
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2 px-2">
            <span>Line</span>
            <div className="flex gap-8 w-1/2 justify-end">
              <span className="w-12 text-center">Under</span>
              <span className="w-12 text-center">Over</span>
            </div>
          </div>

          {overUnder.map((lineObj) => (
            <div key={lineObj.line} className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-md transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0">
              <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{lineObj.line}</span>
              <div className="flex gap-8 w-1/2 justify-end">
                <span className={`w-12 text-center font-medium ${lineObj.under > 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>{lineObj.under}%</span>
                <span className={`w-12 text-center font-medium ${lineObj.over > 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>{lineObj.over}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
