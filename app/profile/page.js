import Link from "next/link";
import Footer from "@/src/frontend/components/layout/Footer";
import MobileNav from "@/src/frontend/components/layout/MobileNav";
import Navbar from "@/src/frontend/components/layout/Navbar";
import SignOutButton from "@/src/frontend/components/profile/SignOutButton";
import { isSubscriptionActive, requireUser } from "@/src/backend/lib/auth";
import { formatCurrency, formatDate } from "@/src/backend/lib/utils";

export default async function ProfilePage() {
  const { admin, profile, user } = await requireUser();

  const [subscriptionResult, charitySelectionResult, winnersResult, donationsResult] =
    await Promise.all([
      admin
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      admin
        .from("user_charities")
        .select("contribution_percentage, charities(name, category)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      admin
        .from("winners")
        .select("prize_amount, payment_status")
        .eq("user_id", user.id),
      admin
        .from("donations")
        .select("amount, source, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  const subscription = subscriptionResult.data || null;
  const charitySelection = charitySelectionResult.data || null;
  const winnings = winnersResult.data || [];
  const donations = donationsResult.data || [];

  const totalWon = winnings.reduce(
    (sum, winner) => sum + Number(winner.prize_amount || 0),
    0
  );
  const totalPaid = winnings
    .filter((winner) => winner.payment_status === "paid")
    .reduce((sum, winner) => sum + Number(winner.prize_amount || 0), 0);
  const totalDonated = donations.reduce(
    (sum, donation) => sum + Number(donation.amount || 0),
    0
  );

  return (
    <>
      <Navbar user={true} />
      <main className="pt-24 pb-32 px-6 max-w-screen-md mx-auto">
        <h1 className="font-headline font-black text-4xl tracking-tight text-primary mb-2 animate-fade-in-up">
          PROFILE
        </h1>
        <p className="text-on-surface-variant text-sm uppercase tracking-widest mb-12">
          Account &amp; Preferences
        </p>

        <div className="bg-surface-container-lowest p-8 mb-6 animate-fade-in-up">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-outline">
                person
              </span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-2xl">
                {profile.full_name}
              </h2>
              <p className="text-on-surface-variant text-sm">{profile.email}</p>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                {profile.role === "admin" ? "Administrator" : "Subscriber"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4">
              <span className="text-[10px] text-outline uppercase tracking-widest block">
                Location
              </span>
              <span className="font-bold">{profile.location || "Not set"}</span>
            </div>
            <div className="bg-surface-container-low p-4">
              <span className="text-[10px] text-outline uppercase tracking-widest block">
                Member Since
              </span>
              <span className="font-bold">
                {formatDate(profile.created_at || new Date().toISOString(), {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-primary text-white p-8 mb-6 relative overflow-hidden animate-fade-in-up-delay">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-secondary/20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-secondary-fixed-dim uppercase tracking-widest block mb-2">
                  Subscription
                </span>
                {subscription ? (
                  <>
                    <h3 className="font-headline font-bold text-2xl mb-4">
                      {subscription.plan} Plan · {subscription.billing_cycle}
                    </h3>
                    <div className="flex justify-between text-sm border-t border-white/10 pt-4 mt-4">
                      <span className="text-white/60">Next Renewal</span>
                      <span className="font-bold">
                        {formatDate(subscription.renewal_date)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-white/10 pt-4 mt-4">
                      <span className="text-white/60">Status</span>
                      <span className="text-secondary-fixed-dim font-bold">
                        {isSubscriptionActive(subscription) ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-white/70">
                    No subscription found yet. Choose a plan to unlock member
                    features.
                  </p>
                )}
              </div>

              <Link
                href="/join"
                className="shrink-0 bg-white text-black px-5 py-3 rounded-md text-xs font-bold tracking-widest uppercase hover:bg-secondary-fixed transition-colors"
              >
                Manage Plan
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 mb-6 animate-fade-in-up-delay-2">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-4">
            Charity Contribution
          </span>
          <h3 className="font-headline font-bold text-xl mb-2">
            {charitySelection?.charities?.name || "No charity selected"}
          </h3>
          <p className="text-sm text-on-surface-variant mb-6">
            {charitySelection?.charities?.category
              ? `${charitySelection.charities.category} partner`
              : "Pick a charity during your subscription flow."}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4">
              <span className="text-[10px] text-outline uppercase tracking-widest block">
                Contribution Rate
              </span>
              <span className="font-bold">
                {charitySelection?.contribution_percentage ?? subscription?.charity_percentage ?? 0}
                %
              </span>
            </div>
            <div className="bg-surface-container-low p-4">
              <span className="text-[10px] text-outline uppercase tracking-widest block">
                Total Donated
              </span>
              <span className="font-bold">{formatCurrency(totalDonated)}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low p-8 mb-8">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-4">
            Winnings Overview
          </span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-headline font-black text-3xl">
                {formatCurrency(totalWon)}
              </span>
              <span className="block text-[10px] text-outline uppercase tracking-widest">
                Total Won
              </span>
            </div>
            <div>
              <span className="font-headline font-black text-3xl text-secondary">
                {formatCurrency(totalPaid)}
              </span>
              <span className="block text-[10px] text-outline uppercase tracking-widest">
                Paid Out
              </span>
            </div>
          </div>

          {donations.length > 0 ? (
            <div className="mt-8 border-t border-outline-variant/20 pt-6 space-y-3">
              <h4 className="font-bold text-sm uppercase tracking-widest text-outline">
                Recent Donations
              </h4>
              {donations.slice(0, 5).map((donation) => (
                <div
                  key={`${donation.source}-${donation.created_at}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-on-surface-variant uppercase tracking-widest text-[10px]">
                    {donation.source}
                  </span>
                  <span className="font-bold">
                    {formatCurrency(donation.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <SignOutButton />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
