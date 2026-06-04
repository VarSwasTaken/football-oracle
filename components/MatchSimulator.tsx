'use client';

import { useState, useMemo } from 'react';
import teamsData from '@/lib/mocks/teams.json';
import { simulateMatch } from '@/lib/poisson';

export function MatchSimulator() {
  const [homeTeamId, setHomeTeamId] = useState(teamsData[0].id);
  const [awayTeamId, setAwayTeamId] = useState(teamsData[1].id);

  const homeTeam = useMemo(() => teamsData.find((t) => t.id === homeTeamId), [homeTeamId]);
  const awayTeam = useMemo(() => teamsData.find((t) => t.id === awayTeamId), [awayTeamId]);

  const odds = useMemo(() => {
    if (!homeTeam || !awayTeam) return null;

    // Calculate Expected Goals (xG) using team strengths and league baselines
    const homeExpectedGoals = homeTeam.stats.attack_strength_home * awayTeam.stats.defense_strength_away * homeTeam.stats.average_goals_scored;

    const awayExpectedGoals = awayTeam.stats.attack_strength_away * homeTeam.stats.defense_strength_home * awayTeam.stats.average_goals_scored;

    return simulateMatch(homeExpectedGoals, awayExpectedGoals);
  }, [homeTeam, awayTeam]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-center">Match Simulator</h2>

      <div className="flex flex-col md:flex-row gap-8 justify-between items-center mb-8">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium mb-2 text-slate-500">Home Team</label>
          <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
            {teamsData.map((team) => (
              <option key={`home-${team.id}`} value={team.id} disabled={team.id === awayTeamId}>
                {team.name} ({team.league})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xl font-black text-slate-400 font-mono">VS</div>

        <div className="flex-1 w-full">
          <label className="block text-sm font-medium mb-2 text-slate-500">Away Team</label>
          <select value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
            {teamsData.map((team) => (
              <option key={`away-${team.id}`} value={team.id} disabled={team.id === homeTeamId}>
                {team.name} ({team.league})
              </option>
            ))}
          </select>
        </div>
      </div>

      {odds && (
        <div className="p-6 bg-white dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
          <h3 className="text-center font-semibold text-slate-500 mb-4 uppercase tracking-wider text-sm">Predicted Probabilities</h3>

          <div className="flex justify-between items-end gap-2 text-center">
            <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{odds.homeWin}%</div>
              <div className="text-xs text-slate-500 mt-1">Home Win</div>
            </div>

            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">{odds.draw}%</div>
              <div className="text-xs text-slate-500 mt-1">Draw</div>
            </div>

            <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{odds.awayWin}%</div>
              <div className="text-xs text-slate-500 mt-1">Away Win</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
