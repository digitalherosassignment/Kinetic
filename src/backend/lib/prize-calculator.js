/**
 * KINETIC Prize Pool Calculator
 * Handles pool distribution across tiers and jackpot rollover
 */

const TIER_PERCENTAGES = {
  5: 0.4, // 40% for 5-number match
  4: 0.35, // 35% for 4-number match
  3: 0.25, // 25% for 3-number match
};

/**
 * Calculate total prize pool from active subscriptions
 * @param {number} activeSubscribers - Count of active subscribers
 * @param {number} avgSubscriptionAmount - Average subscription fee
 * @param {number} prizePoolPercentage - Portion going to prize pool (e.g., 0.5 = 50%)
 * @returns {number} Total prize pool amount
 */
export function calculateTotalPool(
  activeSubscribers,
  avgSubscriptionAmount,
  prizePoolPercentage = 0.5
) {
  return activeSubscribers * avgSubscriptionAmount * prizePoolPercentage;
}

/**
 * Distribute prize pool across tiers
 * @param {number} totalPool
 * @param {number} jackpotRollover - Previous unclaimed jackpot
 * @returns {Object} Pool distribution
 */
export function distributePrizePool(totalPool, jackpotRollover = 0) {
  return {
    tier5: totalPool * TIER_PERCENTAGES[5] + jackpotRollover,
    tier4: totalPool * TIER_PERCENTAGES[4],
    tier3: totalPool * TIER_PERCENTAGES[3],
    total: totalPool + jackpotRollover,
  };
}

/**
 * Calculate individual prizes
 * @param {Object} poolDistribution - From distributePrizePool
 * @param {Object} winnerCounts - { tier5: n, tier4: n, tier3: n }
 * @returns {Object} Prize per winner per tier + rollover info
 */
export function calculatePrizes(poolDistribution, winnerCounts) {
  const result = {
    tier5: {
      pool: poolDistribution.tier5,
      winners: winnerCounts.tier5 || 0,
      prizePerWinner:
        winnerCounts.tier5 > 0
          ? poolDistribution.tier5 / winnerCounts.tier5
          : 0,
      rolledOver: winnerCounts.tier5 === 0,
    },
    tier4: {
      pool: poolDistribution.tier4,
      winners: winnerCounts.tier4 || 0,
      prizePerWinner:
        winnerCounts.tier4 > 0
          ? poolDistribution.tier4 / winnerCounts.tier4
          : 0,
      rolledOver: false,
    },
    tier3: {
      pool: poolDistribution.tier3,
      winners: winnerCounts.tier3 || 0,
      prizePerWinner:
        winnerCounts.tier3 > 0
          ? poolDistribution.tier3 / winnerCounts.tier3
          : 0,
      rolledOver: false,
    },
    jackpotRollover: winnerCounts.tier5 === 0 ? poolDistribution.tier5 : 0,
    totalDistributed: poolDistribution.total,
  };

  return result;
}
