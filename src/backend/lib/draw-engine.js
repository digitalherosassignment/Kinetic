/**
 * KINETIC Draw Engine
 * Supports both random and algorithmic draw modes
 */

/**
 * Generate 5 random winning numbers (1-45)
 */
export function generateRandomDraw() {
  const numbers = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * Generate 5 weighted winning numbers based on frequency analysis
 * @param {Array<number[]>} allUserScores - Array of user score arrays
 */
export function generateAlgorithmicDraw(allUserScores = []) {
  if (!allUserScores.length) return generateRandomDraw();

  // Count frequency of each score across all users
  const frequency = {};
  for (let i = 1; i <= 45; i++) frequency[i] = 0;
  allUserScores.flat().forEach((score) => {
    if (score >= 1 && score <= 45) frequency[score]++;
  });

  // Weight: combine most frequent + least frequent for balance
  const entries = Object.entries(frequency).map(([num, count]) => ({
    num: parseInt(num),
    weight: count + 1, // +1 so zero-freq still has a chance
  }));

  const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
  const numbers = new Set();

  while (numbers.size < 5) {
    let rand = Math.random() * totalWeight;
    for (const entry of entries) {
      rand -= entry.weight;
      if (rand <= 0) {
        numbers.add(entry.num);
        break;
      }
    }
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * Count how many of a user's numbers match the winning numbers
 * @param {number[]} userNumbers - User's 5 latest scores
 * @param {number[]} winningNumbers - The drawn numbers
 * @returns {number} Number of matches (0-5)
 */
export function countMatches(userNumbers, winningNumbers) {
  const winSet = new Set(winningNumbers);
  return userNumbers.filter((n) => winSet.has(n)).length;
}

/**
 * Determine prize tier from match count
 * @returns {number|null} Tier (3, 4, or 5) or null if no prize
 */
export function getMatchTier(matchCount) {
  if (matchCount >= 5) return 5;
  if (matchCount === 4) return 4;
  if (matchCount === 3) return 3;
  return null;
}

/**
 * Run a complete draw simulation
 * @param {Array<{userId: string, numbers: number[]}>} entries
 * @param {string} drawType - 'random' or 'algorithmic'
 * @param {number[][]} allScoresForAlgo - All scores for algorithmic mode
 * @returns {Object} Draw results
 */
export function runDraw(entries, drawType = "random", allScoresForAlgo = []) {
  const winningNumbers =
    drawType === "algorithmic"
      ? generateAlgorithmicDraw(allScoresForAlgo)
      : generateRandomDraw();

  const results = entries.map((entry) => {
    const matchCount = countMatches(entry.numbers, winningNumbers);
    const tier = getMatchTier(matchCount);
    return {
      userId: entry.userId,
      numbers: entry.numbers,
      matchCount,
      tier,
    };
  });

  const winners = results.filter((r) => r.tier !== null);
  const tier5Winners = winners.filter((w) => w.tier === 5);
  const tier4Winners = winners.filter((w) => w.tier === 4);
  const tier3Winners = winners.filter((w) => w.tier === 3);

  return {
    winningNumbers,
    drawType,
    totalEntries: entries.length,
    winners,
    tierBreakdown: {
      tier5: { count: tier5Winners.length, winners: tier5Winners },
      tier4: { count: tier4Winners.length, winners: tier4Winners },
      tier3: { count: tier3Winners.length, winners: tier3Winners },
    },
  };
}
