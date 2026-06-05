'use client';

import { useState, useMemo } from 'react';
import teamsData from '@/lib/mocks/teams.json';
import { simulateMatch, getTopExactScores, getAllOverUnderLines } from '@/lib/poisson';
import { useMatchStore } from '@/store/useMatchStore';

import { TeamSelectionCard } from '@/components/match-simulator/team-selection-card';
import { PredictedProbabilities } from '@/components/match-simulator/predicted-probabilities';
import { GoalDistributionChart } from '@/components/match-simulator/goal-distribution-chart';
import { BettingInsights } from '@/components/match-simulator/betting-insights';

const MODIFIERS = {
  RED_CARD_ATK_PENALTY: 0.2,
  RED_CARD_DEF_PENALTY: 0.2,
  INJURY_ATK_PENALTY: 0.1,
  INJURY_DEF_PENALTY: 0.1,
};

export default function MatchSimulatorPage() {
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
    const exactScores = getTopExactScores(homeExpectedGoals, awayExpectedGoals, 3);
    const overUnder = getAllOverUnderLines(homeExpectedGoals, awayExpectedGoals);

    return { odds, homeExpectedGoals, awayExpectedGoals, exactScores, overUnder };
  }, [homeTeam, awayTeam, store]);

  if (!matchCalculation) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-in fade-in duration-500">
      {/* Team Selection */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Team Selection & Conditions</h2>
          <span className="text-xs text-muted-foreground">Configure match parameters</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TeamSelectionCard
            type="home"
            selectedTeamId={homeTeamId}
            opponentTeamId={awayTeamId}
            modifiers={{
              redCard: store.homeRedCard,
              keyAttackerInjured: store.homeKeyAttackerInjured,
              keyDefenderInjured: store.homeKeyDefenderInjured,
            }}
            onTeamChange={setHomeTeamId}
            onModifierChange={(_, key) => store.toggleModifier('home', key as any)}
          />
          <TeamSelectionCard
            type="away"
            selectedTeamId={awayTeamId}
            opponentTeamId={homeTeamId}
            modifiers={{
              redCard: store.awayRedCard,
              keyAttackerInjured: store.awayKeyAttackerInjured,
              keyDefenderInjured: store.awayKeyDefenderInjured,
            }}
            onTeamChange={setAwayTeamId}
            onModifierChange={(_, key) => store.toggleModifier('away', key as any)}
          />
        </div>
      </section>

      {/* Predicted Probabilities */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Match Outcome Probability</h2>
          <span className="text-xs text-muted-foreground">Statistical prediction</span>
        </div>
        <PredictedProbabilities homeWin={matchCalculation.odds.homeWin} draw={matchCalculation.odds.draw} awayWin={matchCalculation.odds.awayWin} homeTeam={homeTeam?.name || 'Home'} awayTeam={awayTeam?.name || 'Away'} />
      </section>

      {/* Goal Distribution Chart */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Goal Probability Analysis</h2>
          <span className="text-xs text-muted-foreground">Distribution (0-5 goals)</span>
        </div>
        <GoalDistributionChart homeLambda={matchCalculation.homeExpectedGoals} awayLambda={matchCalculation.awayExpectedGoals} homeTeam={homeTeam?.name || 'Home'} awayTeam={awayTeam?.name || 'Away'} />
      </section>

      {/* Betting Insights */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Betting Insights</h2>
          <span className="text-xs text-muted-foreground">Odds & probabilities</span>
        </div>
        <BettingInsights exactScores={matchCalculation.exactScores} overUnder={matchCalculation.overUnder} />
      </section>
    </div>
  );
}
