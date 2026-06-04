import { describe, it, expect } from 'vitest';
import { calculatePoissonProbability, simulateMatch, getTopExactScores, getAllOverUnderLines } from './poisson';

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

describe('getTopExactScores', () => {
  it('should return the requested number of exact scores sorted by probability', () => {
    const scores = getTopExactScores(1.5, 1.2, 3);

    expect(scores).toHaveLength(3);
    // Ensure it's sorted descending
    expect(scores[0].probability).toBeGreaterThanOrEqual(scores[1].probability);
    expect(scores[1].probability).toBeGreaterThanOrEqual(scores[2].probability);
  });

  it('should correctly identify the most likely score for given lambdas', () => {
    const scores = getTopExactScores(1.0, 1.0, 1);

    expect(scores[0].homeGoals).toBe(1);
    expect(scores[0].awayGoals).toBe(1);
  });
});

describe('getAllOverUnderLines', () => {
  it('should return 5 standard betting lines', () => {
    const lines = getAllOverUnderLines(1.5, 1.5);
    expect(lines).toHaveLength(5);
    expect(lines.map((l) => l.line)).toEqual([0.5, 1.5, 2.5, 3.5, 4.5]);
  });

  it('should calculate under and over probabilities that sum to approximately 100', () => {
    const lines = getAllOverUnderLines(2.0, 1.0);

    lines.forEach((lineObj) => {
      const sum = lineObj.under + lineObj.over;
      expect(sum).toBeGreaterThanOrEqual(99.9);
      expect(sum).toBeLessThanOrEqual(100.1);
    });
  });

  it('should have 100% under for 0 expected goals', () => {
    const lines = getAllOverUnderLines(0, 0);
    expect(lines[0].under).toBe(100);
    expect(lines[0].over).toBe(0);
  });
});
