import { describe, it, expect } from 'vitest';
import { calculatePoissonProbability, simulateMatch } from './poisson';

describe('Poisson Distribution Engine', () => {
  it('should calculate accurate poisson probability for exact goals', () => {
    // If a team is expected to score 1.5 goals on average, the chance of scoring exactly 2 is approx 25.1%
    const prob = calculatePoissonProbability(1.5, 2);
    expect(prob).toBeCloseTo(0.251, 3);
  });

  it('should correctly sum match outcome probabilities to roughly 100%', () => {
    // Theoretical clash of two equally matched teams
    const result = simulateMatch(1.2, 1.2);

    const totalProb = result.homeWin + result.draw + result.awayWin;

    // The sum of probabilities should be very close to 100% (capping goals slightly reduces it)
    expect(totalProb).toBeGreaterThan(99);
    expect(totalProb).toBeLessThanOrEqual(100);
  });

  it('should favor the team with higher expected goals', () => {
    // Strong home favorite (e.g., Man City vs a much weaker team)
    const result = simulateMatch(3.5, 0.5);

    expect(result.homeWin).toBeGreaterThan(result.awayWin);
    expect(result.homeWin).toBeGreaterThan(80); // They should have a massive chance of winning
  });

  it('should handle edge cases and cap goals at 18 to prevent precision loss', () => {
    // Extreme scenario pushing past our safe Look-Up Table limit (18 goals)
    const probAboveLimit = calculatePoissonProbability(5.0, 19);

    // The algorithm should safely return 0 instead of breaking or losing precision
    expect(probAboveLimit).toBe(0);
  });
});
