import { runDraw } from "@/src/backend/lib/draw-engine";
import {
  calculatePrizes,
  distributePrizePool,
} from "@/src/backend/lib/prize-calculator";
import { generateDrawId } from "@/src/backend/lib/utils";

const PRIZE_POOL_SHARE = 0.5;

function toDateValue(value) {
  return new Date(value).getTime();
}

function getLatestActiveSubscriptions(subscriptions = []) {
  const latestByUser = new Map();

  for (const subscription of subscriptions) {
    if (toDateValue(subscription.renewal_date) < Date.now()) continue;
    if (!latestByUser.has(subscription.user_id)) {
      latestByUser.set(subscription.user_id, subscription);
    }
  }

  return latestByUser;
}

function groupLatestScores(scores = []) {
  const scoresByUser = new Map();

  for (const score of scores) {
    if (!scoresByUser.has(score.user_id)) {
      scoresByUser.set(score.user_id, []);
    }

    const currentScores = scoresByUser.get(score.user_id);
    if (currentScores.length < 5) {
      currentScores.push(score);
    }
  }

  return scoresByUser;
}

export async function getDrawDataset(adminClient) {
  const [subscriptionsResult, scoresResult, latestDrawResult] = await Promise.all([
    adminClient
      .from("subscriptions")
      .select("id, user_id, amount, status, renewal_date, created_at")
      .eq("status", "active")
      .order("created_at", { ascending: false }),
    adminClient
      .from("scores")
      .select("id, user_id, score, played_at, created_at")
      .order("played_at", { ascending: false })
      .order("created_at", { ascending: false }),
    adminClient
      .from("draws")
      .select("jackpot_rollover, draw_date, draw_id")
      .eq("status", "published")
      .order("draw_date", { ascending: false })
      .limit(1),
  ]);

  if (subscriptionsResult.error) throw new Error(subscriptionsResult.error.message);
  if (scoresResult.error) throw new Error(scoresResult.error.message);
  if (latestDrawResult.error) throw new Error(latestDrawResult.error.message);

  const activeSubscriptions = getLatestActiveSubscriptions(
    subscriptionsResult.data || []
  );
  const scoresByUser = groupLatestScores(scoresResult.data || []);
  const allScoreArrays = Array.from(scoresByUser.values()).map((userScores) =>
    userScores.map((score) => score.score)
  );

  const entries = Array.from(scoresByUser.entries())
    .filter(([userId, userScores]) => {
      return userScores.length === 5 && activeSubscriptions.has(userId);
    })
    .map(([userId, userScores]) => ({
      userId,
      numbers: userScores.map((score) => score.score),
    }));

  const totalPool = Array.from(activeSubscriptions.values()).reduce(
    (sum, subscription) => {
      return sum + Number(subscription.amount || 0) * PRIZE_POOL_SHARE;
    },
    0
  );

  return {
    activeSubscriptions: Array.from(activeSubscriptions.values()),
    allScoreArrays,
    entries,
    latestPublishedDraw: latestDrawResult.data?.[0] || null,
    totalPool: Number(totalPool.toFixed(2)),
  };
}

export async function buildDrawResult(adminClient, options = {}) {
  const { drawType = "random", jackpotRollover } = options;
  const dataset = await getDrawDataset(adminClient);

  const appliedRollover =
    jackpotRollover ?? dataset.latestPublishedDraw?.jackpot_rollover ?? 0;
  const drawResult = runDraw(dataset.entries, drawType, dataset.allScoreArrays);
  const prizePools = distributePrizePool(dataset.totalPool, appliedRollover);
  const prizeDistribution = calculatePrizes(prizePools, {
    tier5: drawResult.tierBreakdown.tier5.count,
    tier4: drawResult.tierBreakdown.tier4.count,
    tier3: drawResult.tierBreakdown.tier3.count,
  });

  return {
    drawType,
    entries: dataset.entries,
    jackpotRollover: appliedRollover,
    latestPublishedDraw: dataset.latestPublishedDraw,
    prizeDistribution,
    totalPool: dataset.totalPool,
    ...drawResult,
  };
}

export async function publishDraw(adminClient, options = {}) {
  const { drawDate } = options;
  const effectiveDrawDate = drawDate || new Date().toISOString().split("T")[0];
  const simulation = await buildDrawResult(adminClient, options);
  const drawId = generateDrawId(new Date(effectiveDrawDate));

  const { data: existingDraw, error: existingError } = await adminClient
    .from("draws")
    .select("id, status")
    .eq("draw_id", drawId)
    .maybeSingle();

  if (existingError) throw new Error(existingError.message);
  if (existingDraw) {
    throw new Error(`Draw ${drawId} already exists.`);
  }

  const { data: draw, error: drawError } = await adminClient
    .from("draws")
    .insert({
      draw_date: effectiveDrawDate,
      draw_id: drawId,
      status: "published",
      draw_type: simulation.drawType,
      winning_numbers: simulation.winningNumbers,
      total_pool: simulation.totalPool,
      tier1_pool: Number(simulation.prizeDistribution.tier5.pool.toFixed(2)),
      tier2_pool: Number(simulation.prizeDistribution.tier4.pool.toFixed(2)),
      tier3_pool: Number(simulation.prizeDistribution.tier3.pool.toFixed(2)),
      jackpot_rollover: Number(
        simulation.prizeDistribution.jackpotRollover.toFixed(2)
      ),
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (drawError) throw new Error(drawError.message);

  if (simulation.entries.length > 0) {
    const drawEntries = simulation.entries.map((entry) => {
      const winnerRecord = simulation.winners.find(
        (winner) => winner.userId === entry.userId
      );

      return {
        draw_id: draw.id,
        user_id: entry.userId,
        numbers: entry.numbers,
        match_count: winnerRecord?.matchCount || 0,
      };
    });

    const { error: entriesError } = await adminClient
      .from("draw_entries")
      .insert(drawEntries);

    if (entriesError) throw new Error(entriesError.message);
  }

  if (simulation.winners.length > 0) {
    const winnerRows = simulation.winners.map((winner) => ({
      draw_id: draw.id,
      user_id: winner.userId,
      match_tier: winner.tier,
      prize_amount: Number(
        simulation.prizeDistribution[`tier${winner.tier}`].prizePerWinner.toFixed(
          2
        )
      ),
    }));

    const { error: winnersError } = await adminClient
      .from("winners")
      .insert(winnerRows);

    if (winnersError) throw new Error(winnersError.message);
  }

  return {
    draw,
    simulation,
  };
}
