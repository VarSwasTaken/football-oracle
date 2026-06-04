'use client';

import { useState, useMemo } from 'react';
import teamsData from '@/lib/mocks/teams.json';
import { simulateMatch } from '@/lib/poisson';
import { useMatchStore } from '@/store/useMatchStore';
import { MatchCharts } from './MatchCharts';

// Constants defining the impact of modifiers (e.g., 0.20 = 20% impact)
const MODIFIERS = {
  RED_CARD_ATK_PENALTY: 0.2,
  RED_CARD_DEF_PENALTY: 0.2,
  INJURY_ATK_PENALTY: 0.1,
  INJURY_DEF_PENALTY: 0.1,
};

export function MatchSimulator() {
  const [homeTeamId, setHomeTeamId] = useState(teamsData[0].id);
  const [awayTeamId, setAwayTeamId] = useState(teamsData[1].id);

  const homeTeam = useMemo(() => teamsData.find((t) => t.id === homeTeamId), [homeTeamId]);
  const awayTeam = useMemo(() => teamsData.find((t) => t.id === awayTeamId), [awayTeamId]);

  // Pull global state and actions from Zustand store
  const store = useMatchStore();

  // Recalculate everything in one clean pass
  const matchCalculation = useMemo(() => {
    if (!homeTeam || !awayTeam) return null;

    let homeAtkMult = 1;
    let homeDefMult = 1;
    if (store.homeRedCard) {
      homeAtkMult -= MODIFIERS.RED_CARD_ATK_PENALTY;
      homeDefMult += MODIFIERS.RED_CARD_DEF_PENALTY;
    }
    if (store.homeKeyAttackerInjured) homeAtkMult -= MODIFIERS.INJURY_ATK_PENALTY;
    if (store.homeKeyDefenderInjured) homeDefMult += MODIFIERS.INJURY_DEF_PENALTY;

    let awayAtkMult = 1;
    let awayDefMult = 1;
    if (store.awayRedCard) {
      awayAtkMult -= MODIFIERS.RED_CARD_ATK_PENALTY;
      awayDefMult += MODIFIERS.RED_CARD_DEF_PENALTY;
    }
    if (store.awayKeyAttackerInjured) awayAtkMult -= MODIFIERS.INJURY_ATK_PENALTY;
    if (store.awayKeyDefenderInjured) awayDefMult += MODIFIERS.INJURY_DEF_PENALTY;

    const homeExpectedGoals = homeTeam.stats.attack_strength_home * homeAtkMult * (awayTeam.stats.defense_strength_away * awayDefMult) * homeTeam.stats.average_goals_scored;

    const awayExpectedGoals = awayTeam.stats.attack_strength_away * awayAtkMult * (homeTeam.stats.defense_strength_home * homeDefMult) * awayTeam.stats.average_goals_scored;

    const odds = simulateMatch(homeExpectedGoals, awayExpectedGoals);

    return { odds, homeExpectedGoals, awayExpectedGoals };
  }, [homeTeam, awayTeam, store]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-center">Match Simulator</h2>

      <div className="flex flex-col md:flex-row gap-8 justify-between items-start mb-8">
        {/* Home Team Section */}
        <div className="flex-1 w-full space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-500">Home Team</label>
            <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
              {teamsData.map((team) => (
                <option key={`home-${team.id}`} value={team.id} disabled={team.id === awayTeamId}>
                  {team.name} ({team.league})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Modifiers</h4>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={store.homeRedCard} onChange={() => store.toggleModifier('home', 'RedCard')} className="rounded border-slate-300" />
              Red Card (-20% Atk/Def)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={store.homeKeyAttackerInjured} onChange={() => store.toggleModifier('home', 'KeyAttackerInjured')} className="rounded border-slate-300" />
              Key Attacker Injured
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={store.homeKeyDefenderInjured} onChange={() => store.toggleModifier('home', 'KeyDefenderInjured')} className="rounded border-slate-300" />
              Key Defender Injured
            </label>
          </div>
        </div>

        <div className="text-xl font-black text-slate-400 font-mono mt-8">VS</div>

        {/* Away Team Section */}
        <div className="flex-1 w-full space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-500">Away Team</label>
            <select value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
              {teamsData.map((team) => (
                <option key={`away-${team.id}`} value={team.id} disabled={team.id === homeTeamId}>
                  {team.name} ({team.league})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Modifiers</h4>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={store.awayRedCard} onChange={() => store.toggleModifier('away', 'RedCard')} className="rounded border-slate-300" />
              Red Card (-20% Atk/Def)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={store.awayKeyAttackerInjured} onChange={() => store.toggleModifier('away', 'KeyAttackerInjured')} className="rounded border-slate-300" />
              Key Attacker Injured
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={store.awayKeyDefenderInjured} onChange={() => store.toggleModifier('away', 'KeyDefenderInjured')} className="rounded border-slate-300" />
              Key Defender Injured
            </label>
          </div>
        </div>
      </div>

      {/* Probabilities Output & Charts */}
      {matchCalculation && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
            <h3 className="text-center font-semibold text-slate-500 mb-4 uppercase tracking-wider text-sm">Predicted Probabilities</h3>

            <div className="flex justify-between items-end gap-2 text-center">
              <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{matchCalculation.odds.homeWin}%</div>
                <div className="text-xs text-slate-500 mt-1">Home Win</div>
              </div>

              <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">{matchCalculation.odds.draw}%</div>
                <div className="text-xs text-slate-500 mt-1">Draw</div>
              </div>

              <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{matchCalculation.odds.awayWin}%</div>
                <div className="text-xs text-slate-500 mt-1">Away Win</div>
              </div>
            </div>
          </div>

          <MatchCharts homeXG={matchCalculation.homeExpectedGoals} awayXG={matchCalculation.awayExpectedGoals} homeName={homeTeam?.name || 'Home'} awayName={awayTeam?.name || 'Away'} />
        </div>
      )}
    </div>
  );
}
