import { createClient } from "@/src/backend/lib/supabase/server";
import { NextResponse } from "next/server";
import { runDraw } from "@/src/backend/lib/draw-engine";
import { distributePrizePool, calculatePrizes } from "@/src/backend/lib/prize-calculator";

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const drawType = body.draw_type || "random";

  // Get all users' latest 5 scores
  const { data: allScores } = await supabase.from("scores").select("user_id, score").order("played_at", { ascending: false });

  // Group by user, take latest 5
  const userScores = {};
  (allScores || []).forEach((s) => {
    if (!userScores[s.user_id]) userScores[s.user_id] = [];
    if (userScores[s.user_id].length < 5) userScores[s.user_id].push(s.score);
  });

  // Build entries (only users with exactly 5 scores)
  const entries = Object.entries(userScores)
    .filter(([_, scores]) => scores.length === 5)
    .map(([userId, numbers]) => ({ userId, numbers }));

  const allScoreArrays = Object.values(userScores);
  const drawResult = runDraw(entries, drawType, allScoreArrays);

  // Calculate prizes
  const pool = distributePrizePool(entries.length * 25, body.jackpot_rollover || 0);
  const prizes = calculatePrizes(pool, {
    tier5: drawResult.tierBreakdown.tier5.count,
    tier4: drawResult.tierBreakdown.tier4.count,
    tier3: drawResult.tierBreakdown.tier3.count,
  });

  return NextResponse.json({
    simulation: true,
    drawType,
    winningNumbers: drawResult.winningNumbers,
    totalEntries: drawResult.totalEntries,
    tierBreakdown: drawResult.tierBreakdown,
    prizeDistribution: prizes,
  });
}
