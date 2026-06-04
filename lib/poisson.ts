const FACTORIALS = [
  1, // 0!
  1, // 1!
  2, // 2!
  6, // 3!
  24, // 4!
  120, // 5!
  720, // 6!
  5040, // 7!
  40320, // 8!
  362880, // 9!
  3628800, // 10!
  39916800, // 11!
  479001600, // 12!
  6227020800, // 13!
  87178291200, // 14!
  1307674368000, // 15!
  20922789888000, // 16!
  355687428096000, // 17!
  6402373705728000, // 18!
];

/**
 * Calculates the probability of scoring EXACTLY `actualGoals` goals,
 * given the team is expected to score `expectedGoals` (lambda parameter).
 */
export function calculatePoissonProbability(expectedGoals: number, actualGoals: number): number {
  // Guard clause: if modifiers push the score above 18, we cap the probability at 0
  // to prevent V8 engine precision loss with floating-point numbers.
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
