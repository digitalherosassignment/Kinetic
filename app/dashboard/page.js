import Navbar from "@/src/frontend/components/layout/Navbar";
import Footer from "@/src/frontend/components/layout/Footer";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <Navbar user={true} />
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        {/* Hero Header */}
        <header className="mb-12 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline font-black text-5xl md:text-6xl tracking-tighter uppercase mb-2">
                DASHBOARD
              </h1>
              <p className="font-body text-on-surface-variant max-w-md">
                Welcome back, Marcus. Your kinetic impact this month has reached
                new heights.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/scores"
                className="bg-primary text-on-primary px-6 py-3 font-body font-bold text-xs tracking-widest uppercase flex items-center gap-2 hover:bg-secondary transition-colors duration-200 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                Enter Score
              </Link>
              <Link
                href="/charity"
                className="bg-surface-container-highest text-on-surface px-6 py-3 font-body font-bold text-xs tracking-widest uppercase flex items-center gap-2 hover:text-secondary transition-colors duration-200 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">search</span>
                Browse Charities
              </Link>
            </div>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Subscription Status */}
          <div className="md:col-span-4 bg-surface-container-lowest p-8 flex flex-col justify-between group overflow-hidden relative animate-fade-in-up">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl">verified</span>
            </div>
            <div>
              <span className="font-body text-[10px] font-bold tracking-widest text-secondary uppercase mb-6 block">
                Account Status
              </span>
              <h2 className="font-headline font-bold text-3xl mb-1 uppercase">ELITE TIER</h2>
              <p className="text-on-surface-variant text-sm">
                Subscription active until Dec 2024
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse"></div>
              <span className="text-xs font-bold font-body tracking-tight uppercase">
                Priority Access Enabled
              </span>
            </div>
          </div>

          {/* Impact Meter */}
          <div className="md:col-span-8 bg-primary-container text-white p-8 relative overflow-hidden animate-fade-in-up-delay">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-black opacity-50"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <span className="font-body text-[10px] font-bold tracking-widest text-tertiary-fixed-dim uppercase mb-2 block">
                    Total Charity Contribution
                  </span>
                  <h2 className="font-headline font-black text-5xl tracking-tighter">
                    $14,250.00
                  </h2>
                </div>
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-4xl">
                  volunteer_activism
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-body font-bold tracking-widest uppercase">
                  <span>Monthly Goal: $15,000</span>
                  <span className="text-secondary-fixed-dim">95%</span>
                </div>
                <div className="h-4 bg-white/10 w-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-secondary-fixed-dim"
                    style={{ width: "95%" }}
                  ></div>
                </div>
                <p className="text-white/60 text-xs italic">
                  Only $750 more to unlock the Grand Charity Draw bonus for next month.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Scores */}
          <div className="md:col-span-7 bg-surface-container-low p-8 animate-fade-in-up-delay-2">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline font-bold text-xl uppercase tracking-tight">
                Latest Stableford Scores
              </h3>
              <span className="material-symbols-outlined text-outline">golf_course</span>
            </div>
            <div className="space-y-6">
              {[
                { score: 38, course: "Oakmont Country Club", date: "14 OCT 2024", net: "+2 Net" },
                { score: 42, course: "St Andrews (Old Course)", date: "08 OCT 2024", net: "+6 Net" },
                { score: 35, course: "Pebble Beach Links", date: "30 SEP 2024", net: "-1 Net" },
                { score: 39, course: "Royal Melbourne", date: "22 SEP 2024", net: "+3 Net" },
                { score: 41, course: "TPC Sawgrass", date: "15 SEP 2024", net: "+5 Net" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-container-highest flex items-center justify-center font-headline font-black text-lg">
                      {s.score}
                    </div>
                    <div>
                      <h4 className="font-body font-bold text-sm">{s.course}</h4>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                        {s.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold font-body text-sm ${s.net.startsWith("+") ? "text-secondary" : "text-on-surface-variant"}`}>
                      {s.net}
                    </span>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                      chevron_right
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Draw Card */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex-1 bg-surface-container-lowest p-8 relative overflow-hidden flex flex-col justify-between animate-fade-in-up-delay-2">
              <div className="relative z-10">
                <span className="font-body text-[10px] font-bold tracking-widest text-secondary uppercase mb-2 block">
                  Participating In
                </span>
                <h3 className="font-headline font-bold text-2xl uppercase mb-6 leading-none">
                  The Founders Circle
                  <br />
                  Quarterly Draw
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { val: "02", unit: "Days" },
                    { val: "14", unit: "Hrs" },
                    { val: "56", unit: "Min" },
                  ].map((t) => (
                    <div key={t.unit} className="bg-surface p-3">
                      <span className="block font-headline font-black text-2xl">{t.val}</span>
                      <span className="text-[8px] font-bold uppercase tracking-tighter">{t.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative z-10 mt-8 pt-8 border-t border-outline-variant/30 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">
                    Current Entry Value
                  </p>
                  <p className="font-headline font-bold text-lg">$2,500.00</p>
                </div>
                <button className="bg-primary text-white p-2 flex items-center justify-center active:scale-90 transition-transform">
                  <span className="material-symbols-outlined">receipt_long</span>
                </button>
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
                  View your full 2024 contribution breakdown
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
