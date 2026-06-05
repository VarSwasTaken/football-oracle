'use client';

import { useState, useMemo } from 'react';
import teamsData from '@/lib/mocks/teams.json';
import { simulateMatch } from '@/lib/poisson';
import { useMatchStore } from '@/store/useMatchStore';
import { MatchCharts } from './MatchCharts';
import { BettingInsights } from './BettingInsights';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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

  const store = useMatchStore();

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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Team Selection & Modifiers Section */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-start">
        {/* Home Team Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Home Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select value={homeTeamId} onValueChange={setHomeTeamId}>
              <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teamsData.map((team) => (
                  <SelectItem key={`home-${team.id}`} value={team.id} disabled={team.id === awayTeamId}>
                    {team.name} ({team.league})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <h4 className="text-xs font-medium text-slate-400 mb-4">MATCH MODIFIERS</h4>

              <div className="flex items-center justify-between">
                <Label htmlFor="home-red-card" className="cursor-pointer">
                  Red Card (-20% Stats)
                </Label>
                <Switch id="home-red-card" checked={store.homeRedCard} onCheckedChange={() => store.toggleModifier('home', 'RedCard')} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="home-inj-atk" className="cursor-pointer">
                  Key Attacker Out
                </Label>
                <Switch id="home-inj-atk" checked={store.homeKeyAttackerInjured} onCheckedChange={() => store.toggleModifier('home', 'KeyAttackerInjured')} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="home-inj-def" className="cursor-pointer">
                  Key Defender Out
                </Label>
                <Switch id="home-inj-def" checked={store.homeKeyDefenderInjured} onCheckedChange={() => store.toggleModifier('home', 'KeyDefenderInjured')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VS Badge */}
        <div className="hidden md:flex h-full items-center justify-center pt-8">
          <div className="bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono font-bold text-xl p-4 rounded-full">VS</div>
        </div>

        {/* Away Team Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-right">Away Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select value={awayTeamId} onValueChange={setAwayTeamId}>
              <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teamsData.map((team) => (
                  <SelectItem key={`away-${team.id}`} value={team.id} disabled={team.id === homeTeamId}>
                    {team.name} ({team.league})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <h4 className="text-xs font-medium text-slate-400 mb-4">MATCH MODIFIERS</h4>

              <div className="flex items-center justify-between">
                <Label htmlFor="away-red-card" className="cursor-pointer">
                  Red Card (-20% Stats)
                </Label>
                <Switch id="away-red-card" checked={store.awayRedCard} onCheckedChange={() => store.toggleModifier('away', 'RedCard')} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="away-inj-atk" className="cursor-pointer">
                  Key Attacker Out
                </Label>
                <Switch id="away-inj-atk" checked={store.awayKeyAttackerInjured} onCheckedChange={() => store.toggleModifier('away', 'KeyAttackerInjured')} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="away-inj-def" className="cursor-pointer">
                  Key Defender Out
                </Label>
                <Switch id="away-inj-def" checked={store.awayKeyDefenderInjured} onCheckedChange={() => store.toggleModifier('away', 'KeyDefenderInjured')} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Probabilities Output & Charts */}
      {matchCalculation && (
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
            <CardContent className="pt-6">
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
            </CardContent>
          </Card>

          <MatchCharts homeXG={matchCalculation.homeExpectedGoals} awayXG={matchCalculation.awayExpectedGoals} homeName={homeTeam?.name || 'Home'} awayName={awayTeam?.name || 'Away'} />

          <BettingInsights homeLambda={matchCalculation.homeExpectedGoals} awayLambda={matchCalculation.awayExpectedGoals} homeName={homeTeam?.name || 'Home'} awayName={awayTeam?.name || 'Away'} />
        </div>
      )}
    </div>
  );
}
