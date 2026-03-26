import Link from "next/link";
import { notFound } from "next/navigation";
import DonationForm from "@/src/frontend/components/charity/DonationForm";
import Footer from "@/src/frontend/components/layout/Footer";
import MobileNav from "@/src/frontend/components/layout/MobileNav";
import Navbar from "@/src/frontend/components/layout/Navbar";
import { getAuthenticatedContext } from "@/src/backend/lib/auth";
import { createAdminClient } from "@/src/backend/lib/supabase/admin";
import { formatCurrency } from "@/src/backend/lib/utils";

export default async function CharityDetailPage({ params }) {
  const { user } = await getAuthenticatedContext();
  const admin = createAdminClient();

  const [{ data: charity, error }, { data: donations }] = await Promise.all([
    admin.from("charities").select("*").eq("id", params.id).maybeSingle(),
    admin
      .from("donations")
      .select("amount, created_at, source")
      .eq("charity_id", params.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (error || !charity) {
    notFound();
  }

  return (
    <>
      <Navbar user={!!user} />
      <main className="pt-24 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/charity"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-secondary mb-8"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back To Directory
          </Link>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-7">
              <span className="font-label text-xs tracking-[0.3em] uppercase text-secondary font-bold mb-4 block">
                {charity.category}
              </span>
              <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-primary mb-8">
                {charity.name}
              </h1>
              <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed mb-10">
                {charity.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-container-lowest p-5 rounded-xl">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-2">
                    Total Raised
                  </span>
                  <span className="font-headline font-black text-3xl">
                    {formatCurrency(charity.total_raised)}
                  </span>
                </div>
                <div className="bg-surface-container-lowest p-5 rounded-xl">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-2">
                    Impact Goal
                  </span>
                  <span className="font-headline font-black text-3xl">
                    {charity.impact_goal_percent || 0}%
                  </span>
                </div>
                <div className="bg-surface-container-lowest p-5 rounded-xl">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-2">
                    Impact Metric
                  </span>
                  <span className="font-headline font-black text-3xl">
                    {charity.impact_value || "--"}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-surface-container-low rounded-xl overflow-hidden">
                <div className="aspect-[4/3] bg-surface-container-high">
                  {charity.image_url ? (
                    <img
                      alt={charity.name}
                      className="w-full h-full object-cover"
                      src={charity.image_url}
                    />
                  ) : (
                    <div className="w-full h-full kinetic-gradient"></div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase mb-3">
                    <span>Impact Goal</span>
                    <span className="text-secondary">
                      {charity.impact_goal_percent || 0}%
                    </span>
                  </div>
                  <div className="impact-track w-full mb-6">
                    <div
                      className="impact-fill"
                      style={{
                        width: `${Math.min(charity.impact_goal_percent || 0, 100)}%`,
                      }}
                    ></div>
                  </div>

                  <DonationForm charityId={charity.id} isAuthenticated={!!user} />
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-surface-container-lowest p-8 rounded-xl">
              <h2 className="font-headline font-bold text-2xl mb-6">
                Why This Charity Matters
              </h2>
              <div className="space-y-5 text-on-surface-variant leading-relaxed">
                <p>{charity.description}</p>
                <p>
                  This profile is now powered by live charity records from
                  Supabase, so featured status, totals, and impact metrics stay
                  aligned with the admin panel.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-primary text-white p-8 rounded-xl">
              <h2 className="font-headline font-bold text-2xl mb-6">
                Recent Donations
              </h2>
              {(donations || []).length === 0 ? (
                <p className="text-white/70 text-sm">
                  No donations have been recorded yet for this charity.
                </p>
              ) : (
                <div className="space-y-4">
                  {(donations || []).map((donation) => (
                    <div
                      key={`${donation.source}-${donation.created_at}`}
                      className="flex justify-between items-center border-b border-white/10 pb-3"
                    >
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-secondary-fixed-dim">
                          {donation.source}
                        </span>
                        <span className="text-sm text-white/70">
                          {new Date(donation.created_at).toLocaleDateString("en-US")}
                        </span>
                      </div>
                      <span className="font-bold">
                        {formatCurrency(donation.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      {user ? <MobileNav /> : null}
    </>
  );
}
