const FACTORIALS = [
  1, // 0!
  1, // 1!
  2,
  6,
  24,
  120,
  720,
  5040,
  40320,
  362880,
  3628800,
  39916800,
  479001600,
  6227020800,
  87178291200,
  1307674368000,
  20922789888000,
  355687428096000, // 17!
  6402373705728000, // 18!
];

/**
 * Calculates the probability of scoring EXACTLY `actualGoals` goals,
 * given the team is expected to score `expectedGoals` (lambda parameter).
 */
export function calculatePoissonProbability(expectedGoals: number, actualGoals: number): number {
  if (actualGoals > 18) return 0;

  const factorial = FACTORIALS[actualGoals];
  return (Math.pow(expectedGoals, actualGoals) * Math.exp(-expectedGoals)) / factorial;
}

/**
 * Simulates a match by iterating through all possible goal combinations.
 * Returns the percentage probabilities for home win, draw, and away win.
 */
export function simulateMatch(homeExpectedGoals: number, awayExpectedGoals: number, maxGoals = 15) {
  let homeWinProb = 0;
  let drawProb = 0;
  let awayWinProb = 0;

  const homeExp = Math.exp(-homeExpectedGoals);
  const awayExp = Math.exp(-awayExpectedGoals);

  for (let homeGoals = 0; homeGoals <= maxGoals; homeGoals++) {
    const probHome = homeGoals > 18 ? 0 : (Math.pow(homeExpectedGoals, homeGoals) * homeExp) / FACTORIALS[homeGoals];

    if (probHome < 0.000001) continue;

    for (let awayGoals = 0; awayGoals <= maxGoals; awayGoals++) {
      const probAway = awayGoals > 18 ? 0 : (Math.pow(awayExpectedGoals, awayGoals) * awayExp) / FACTORIALS[awayGoals];

      if (probAway < 0.000001) continue;

      const matchOutcomeProb = probHome * probAway;

      if (homeGoals > awayGoals) {
        homeWinProb += matchOutcomeProb;
      } else if (homeGoals === awayGoals) {
        drawProb += matchOutcomeProb;
      } else {
        awayWinProb += matchOutcomeProb;
      }
    }
  }

  return {
    homeWin: Number((homeWinProb * 100).toFixed(2)),
    draw: Number((drawProb * 100).toFixed(2)),
    awayWin: Number((awayWinProb * 100).toFixed(2)),
  };
}

export interface ExactScore {
  homeGoals: number;
  awayGoals: number;
  probability: number;
}

/**
 * Calculates the top most likely exact scores for a match.
 */
export function getTopExactScores(homeLambda: number, awayLambda: number, limit: number = 3): ExactScore[] {
  const scores: ExactScore[] = [];

  for (let h = 0; h <= 5; h++) {
    for (let a = 0; a <= 5; a++) {
      const prob = calculatePoissonProbability(homeLambda, h) * calculatePoissonProbability(awayLambda, a);
      scores.push({ homeGoals: h, awayGoals: a, probability: prob * 100 });
    }
  }

  return scores
    .sort((a, b) => {
      const diff = b.probability - a.probability;
      if (Math.abs(diff) < 0.00001) {
        return b.homeGoals + b.awayGoals - (a.homeGoals + a.awayGoals);
      }
      return diff;
    })
    .slice(0, limit);
}

export interface OverUnderLine {
  line: number;
  under: number;
  over: number;
}

/**
 * Dynamically calculates Over/Under probabilities for lines 0.5 through 4.5
 */
export function getAllOverUnderLines(homeLambda: number, awayLambda: number): OverUnderLine[] {
  const lines = [0.5, 1.5, 2.5, 3.5, 4.5];

  const matrix: { totalGoals: number; prob: number }[] = [];
  for (let h = 0; h <= 5; h++) {
    for (let a = 0; a <= 5; a++) {
      const prob = calculatePoissonProbability(homeLambda, h) * calculatePoissonProbability(awayLambda, a);
      matrix.push({ totalGoals: h + a, prob });
    }
  }

  return lines.map((line) => {
    const underProb = matrix.filter((cell) => cell.totalGoals < line).reduce((sum, cell) => sum + cell.prob, 0);

    return {
      line,
      under: Number((underProb * 100).toFixed(1)),
      over: Number(((1 - underProb) * 100).toFixed(1)),
    };
  });
}
