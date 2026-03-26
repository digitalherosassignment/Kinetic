import Link from "next/link";
import Footer from "@/src/frontend/components/layout/Footer";
import Navbar from "@/src/frontend/components/layout/Navbar";
import { isSubscriptionActive, requireUser } from "@/src/backend/lib/auth";
import { formatCurrency, formatDate } from "@/src/backend/lib/utils";

export default async function DashboardPage() {
  const { admin, profile, user } = await requireUser();

  const [subscriptionResult, scoresResult, charitySelectionResult, winnersResult, drawsCountResult, donationsResult] =
    await Promise.all([
      admin
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      admin
        .from("scores")
        .select("*")
        .eq("user_id", user.id)
        .order("played_at", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(5),
      admin
        .from("user_charities")
        .select("contribution_percentage, charities(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      admin
        .from("winners")
        .select("prize_amount, payment_status")
        .eq("user_id", user.id),
      admin
        .from("draws")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
      admin
        .from("donations")
        .select("amount")
        .eq("user_id", user.id),
    ]);

  const subscription = subscriptionResult.data || null;
  const scores = scoresResult.data || [];
  const charitySelection = charitySelectionResult.data || null;
  const winners = winnersResult.data || [];
  const totalDonated = (donationsResult.data || []).reduce(
    (sum, donation) => sum + Number(donation.amount || 0),
    0
  );
  const totalWon = winners.reduce(
    (sum, winner) => sum + Number(winner.prize_amount || 0),
    0
  );
  const pendingPayouts = winners.filter(
    (winner) => winner.payment_status !== "paid"
  ).length;
  const isEligibleForDraws = isSubscriptionActive(subscription) && scores.length === 5;

  return (
    <>
      <Navbar user={true} />
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        <header className="mb-12 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline font-black text-5xl md:text-6xl tracking-tighter uppercase mb-2">
                DASHBOARD
              </h1>
              <p className="font-body text-on-surface-variant max-w-md">
                Welcome back, {profile.full_name}. Your member area is now
                connected to live subscription, score, draw, and winnings data.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/scores"
                className="bg-primary text-on-primary px-6 py-3 font-body font-bold text-xs tracking-widest uppercase flex items-center gap-2 hover:bg-secondary transition-colors duration-200 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">
                  add_circle
                </span>
                Enter Score
              </Link>
              <Link
                href="/join"
                className="bg-surface-container-highest text-on-surface px-6 py-3 font-body font-bold text-xs tracking-widest uppercase flex items-center gap-2 hover:text-secondary transition-colors duration-200 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">credit_card</span>
                Manage Membership
              </Link>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 bg-surface-container-lowest p-8 flex flex-col justify-between group overflow-hidden relative animate-fade-in-up">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl">
                verified
              </span>
            </div>
            <div>
              <span className="font-body text-[10px] font-bold tracking-widest text-secondary uppercase mb-6 block">
                Account Status
              </span>
              <h2 className="font-headline font-bold text-3xl mb-1 uppercase">
                {subscription ? subscription.plan : "NO PLAN"}
              </h2>
              <p className="text-on-surface-variant text-sm">
                {subscription
                  ? `Renews ${formatDate(subscription.renewal_date)}`
                  : "Pick a plan to unlock score tracking and draw access."}
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isSubscriptionActive(subscription)
                    ? "bg-secondary-fixed-dim animate-pulse"
                    : "bg-outline"
                }`}
              ></div>
              <span className="text-xs font-bold font-body tracking-tight uppercase">
                {isSubscriptionActive(subscription) ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="md:col-span-8 bg-primary-container text-white p-8 relative overflow-hidden animate-fade-in-up-delay">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-black opacity-50"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <span className="font-body text-[10px] font-bold tracking-widest text-tertiary-fixed-dim uppercase mb-2 block">
                    Total Charity Contribution
                  </span>
                  <h2 className="font-headline font-black text-5xl tracking-tighter">
                    {formatCurrency(totalDonated)}
                  </h2>
                </div>
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-4xl">
                  volunteer_activism
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-body font-bold tracking-widest uppercase">
                  <span>
                    Selected Charity:{" "}
                    {charitySelection?.charities?.name || "Not selected"}
                  </span>
                  <span className="text-secondary-fixed-dim">
                    {charitySelection?.contribution_percentage ?? 0}%
                  </span>
                </div>
                <div className="h-4 bg-white/10 w-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-secondary-fixed-dim"
                    style={{
                      width: `${Math.min(
                        charitySelection?.contribution_percentage ?? 0,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-white/60 text-xs italic">
                  Subscription donations are recorded each time a membership is
                  activated or updated.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-surface-container-low p-8 animate-fade-in-up-delay-2">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline font-bold text-xl uppercase tracking-tight">
                Latest Stableford Scores
              </h3>
              <span className="material-symbols-outlined text-outline">
                golf_course
              </span>
            </div>

            {scores.length === 0 ? (
              <div className="bg-surface-container-lowest p-6 rounded-lg text-sm text-on-surface-variant">
                No rounds recorded yet. Add 5 scores to qualify for live draw
                participation.
              </div>
            ) : (
              <div className="space-y-6">
                {scores.map((score) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-container-highest flex items-center justify-center font-headline font-black text-lg">
                        {score.score}
                      </div>
                      <div>
                        <h4 className="font-body font-bold text-sm">
                          {score.course_name || "Unnamed Course"}
                        </h4>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                          {formatDate(score.played_at)}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/scores"
                      className="text-outline group-hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex-1 bg-surface-container-lowest p-8 relative overflow-hidden flex flex-col justify-between animate-fade-in-up-delay-2">
              <div className="relative z-10">
                <span className="font-body text-[10px] font-bold tracking-widest text-secondary uppercase mb-2 block">
                  Participation Summary
                </span>
                <h3 className="font-headline font-bold text-2xl uppercase mb-6 leading-none">
                  {isEligibleForDraws ? "Eligible For Live Draws" : "Draw Entry Locked"}
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    {
                      label: "Scores",
                      value: `${scores.length}/5`,
                    },
                    {
                      label: "Draws",
                      value: String(drawsCountResult.count || 0),
                    },
                    {
                      label: "Pending",
                      value: String(pendingPayouts),
                    },
                  ].map((item) => (
                    <div key={item.label} className="bg-surface p-3">
                      <span className="block font-headline font-black text-2xl">
                        {item.value}
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-tighter">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative z-10 mt-8 pt-8 border-t border-outline-variant/30 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">
                    Total Winnings
                  </p>
                  <p className="font-headline font-bold text-lg">
                    {formatCurrency(totalWon)}
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="bg-primary text-white p-2 flex items-center justify-center active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined">
                    receipt_long
                  </span>
                </Link>
              </div>
            </div>

            <Link
              href="/profile"
              className="bg-tertiary-fixed p-6 flex items-center justify-between group cursor-pointer overflow-hidden"
            >
              <div className="relative z-10">
                <h4 className="font-body font-bold text-xs uppercase tracking-widest mb-1">
                  Impact Report
                </h4>
                <p className="text-[10px] text-on-tertiary-fixed-variant uppercase tracking-tighter">
                  View your live charity and winnings breakdown
                </p>
              </div>
              <span className="material-symbols-outlined text-on-tertiary-fixed text-2xl group-hover:translate-x-2 transition-transform">
                trending_up
              </span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
