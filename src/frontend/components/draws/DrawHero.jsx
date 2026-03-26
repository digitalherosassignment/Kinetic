import Link from "next/link";
import { formatCurrency } from "@/src/backend/lib/utils";

export default function DrawHero({ latestDraw }) {
  if (!latestDraw) {
    return (
      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-xl bg-primary text-on-primary p-8 md:p-16">
            <span className="font-label text-xs tracking-[0.3em] uppercase text-secondary-fixed-dim mb-4 block">
              Draw Center
            </span>
            <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
              FIRST RESULTS
              <br />
              COMING SOON.
            </h1>
            <p className="text-on-primary-container text-lg max-w-xl">
              No draw has been published yet. As soon as the admin team runs the
              first live draw, the winning numbers and prize tiers will appear
              here automatically.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const isRollover = Number(latestDraw.jackpot_rollover || 0) > 0;

  return (
    <section className="px-6 mb-20">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-xl bg-primary text-on-primary p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="relative z-10 max-w-2xl">
            <span className="font-label text-xs tracking-[0.3em] uppercase text-secondary-fixed-dim mb-4 block">
              {isRollover ? "Jackpot Rollover Announcement" : "Latest Published Draw"}
            </span>
            <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9] whitespace-pre-line">
              {isRollover ? "STILL UP\nFOR GRABS." : "DRAW RESULTS\nARE LIVE."}
            </h1>
            <p className="text-on-primary-container text-lg max-w-md mb-8 whitespace-pre-line">
              {isRollover
                ? `No 5-number match was recorded in ${latestDraw.draw_id}. The jackpot has rolled over to the next cycle.`
                : `Published ${new Date(latestDraw.draw_date).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )} under ${latestDraw.draw_id}. Review the live winning numbers and tier payouts below.`}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/join"
                className="bg-secondary text-white px-8 py-4 rounded-md font-bold tracking-tight hover:bg-secondary-container transition-colors duration-200"
              >
                Enter Next Draw
              </Link>
              <span className="text-sm font-label tracking-widest text-outline-variant">
                TOTAL POOL {formatCurrency(latestDraw.total_pool)}
              </span>
            </div>
          </div>
          <div className="relative w-full md:w-1/3 aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-secondary/20 blur-[100px] rounded-full"></div>
            <div className="relative bg-surface-container-lowest/5 backdrop-blur-xl border border-white/10 p-10 rounded-full w-full h-full flex flex-col items-center justify-center text-center">
              <span className="font-headline text-6xl font-black text-white">
                {formatCurrency(
                  isRollover ? latestDraw.jackpot_rollover : latestDraw.tier1_pool
                )}
              </span>
              <span className="font-label text-[10px] tracking-[0.4em] text-secondary-fixed-dim mt-2 uppercase">
                {isRollover ? "Jackpot Rollover" : "5-Match Pool"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
