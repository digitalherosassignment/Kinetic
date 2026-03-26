import { formatCurrency } from "@/src/backend/lib/utils";

function getTierMeta(tier, latestDraw, winners) {
  const tierWinners = winners.filter((winner) => winner.match_tier === tier);
  const averagePrize =
    tierWinners.length > 0
      ? tierWinners.reduce(
          (sum, winner) => sum + Number(winner.prize_amount || 0),
          0
        ) / tierWinners.length
      : 0;

  const numberMask =
    tier === 5
      ? latestDraw.winning_numbers
      : tier === 4
        ? [...latestDraw.winning_numbers.slice(0, 4), null]
        : [...latestDraw.winning_numbers.slice(0, 3), null, null];

  return {
    5: {
      label: "5-Number Match",
      icon: "stars",
      numbers: numberMask,
      winners: tierWinners.length,
      prize:
        tierWinners.length > 0
          ? formatCurrency(averagePrize)
          : latestDraw.jackpot_rollover > 0
            ? "Rolled Over"
            : formatCurrency(latestDraw.tier1_pool),
      caption: tierWinners.length > 0 ? "Prize Each" : "Prize Pool",
    },
    4: {
      label: "4-Number Match",
      icon: "auto_awesome",
      numbers: numberMask,
      winners: tierWinners.length,
      prize: tierWinners.length > 0 ? formatCurrency(averagePrize) : "No Winners",
      caption: "Prize Each",
    },
    3: {
      label: "3-Number Match",
      icon: "bolt",
      numbers: numberMask,
      winners: tierWinners.length,
      prize: tierWinners.length > 0 ? formatCurrency(averagePrize) : "No Winners",
      caption: "Prize Each",
    },
  }[tier];
}

export default function DrawTiers({ latestDraw, winners = [] }) {
  if (!latestDraw) {
    return null;
  }

  const tiers = [5, 4, 3].map((tier) => getTierMeta(tier, latestDraw, winners));

  return (
    <section className="px-6 mb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-headline text-4xl font-bold tracking-tight">
              Latest Results
            </h2>
            <p className="text-outline mt-2">
              Drawn {new Date(latestDraw.draw_date).toLocaleDateString("en-US")} •
              Draw ID: #{latestDraw.draw_id}
            </p>
          </div>
          <div className="px-4 py-2 bg-surface-container-low rounded-lg text-sm font-bold">
            {latestDraw.draw_type === "algorithmic"
              ? "Algorithmic Draw"
              : "Random Draw"}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.label}
              className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 group hover:border-secondary transition-all"
            >
              <div className="flex justify-between items-start mb-12">
                <span className="font-label text-xs font-bold tracking-widest text-secondary uppercase">
                  {tier.label}
                </span>
                <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors">
                  {tier.icon}
                </span>
              </div>
              <div className="flex gap-3 mb-12 justify-center">
                {tier.numbers.map((number, index) => (
                  <div
                    key={`${tier.label}-${index}`}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-headline font-bold text-xl ${
                      number
                        ? "border-primary"
                        : "border-outline-variant/30 text-outline-variant"
                    }`}
                  >
                    {number || "?"}
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-outline-variant/20 flex justify-between items-center">
                <div>
                  <span className="block text-xs text-outline uppercase tracking-widest">
                    Winners
                  </span>
                  <span className="text-2xl font-headline font-bold">
                    {tier.winners}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-outline uppercase tracking-widest">
                    {tier.caption}
                  </span>
                  <span className="text-2xl font-headline font-bold text-secondary">
                    {tier.prize}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
