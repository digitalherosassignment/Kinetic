"use client";

import { useState } from "react";
import Navbar from "@/src/frontend/components/layout/Navbar";
import Footer from "@/src/frontend/components/layout/Footer";
import MobileNav from "@/src/frontend/components/layout/MobileNav";

export default function ScoresPage() {
  const [scoreValue, setScoreValue] = useState(36);

  const scores = [
    { score: 41, course: "Royal St. Georges", date: "May 14, 2024", badge: "Eagle Plus", badgeColor: "bg-secondary-fixed text-secondary" },
    { score: 38, course: "Sunningdale Old Course", date: "May 08, 2024", badge: "Par Level", badgeColor: "bg-surface-container-high text-on-surface-variant" },
    { score: 34, course: "Wentworth Club", date: "May 02, 2024", badge: "Impact Met", badgeColor: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
    { score: 40, course: "The Berkshire", date: "April 26, 2024", badge: "Eagle Plus", badgeColor: "bg-secondary-fixed text-secondary" },
    { score: 32, course: "Walton Heath", date: "April 19, 2024", badge: "Consistent", badgeColor: "bg-surface-container-high text-on-surface-variant" },
  ];

  return (
    <>
      <Navbar user={true} />
      <main className="pt-20 pb-32 px-6 max-w-screen-md mx-auto">
        {/* Header */}
        <section className="mb-12 animate-fade-in-up">
          <h2 className="font-headline font-black text-4xl tracking-tight text-primary mb-2">SCORES</h2>
          <p className="font-body text-on-surface-variant text-sm tracking-wide uppercase">
            Performance Tracking &amp; History
          </p>
        </section>

        {/* Visual Trend */}
        <section className="mb-10 bg-surface-container-low rounded-xl p-6 relative overflow-hidden group animate-fade-in-up-delay">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <span className="material-symbols-outlined text-9xl" style={{ fontVariationSettings: "'wght' 700" }}>
              golf_course
            </span>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs font-bold tracking-widest text-secondary uppercase">Current Trend</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline font-bold text-5xl">38.4</span>
                  <span className="text-secondary text-sm font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span> +2.1
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">Stableford Avg</span>
              </div>
            </div>
            <div className="h-32 w-full flex items-end gap-2 px-1">
              {[60, 45, 85, 70, 95].map((h, i) => (
                <div
                  key={i}
                  className={`w-full rounded-sm transition-all duration-500 ${
                    i === 2 ? "bg-secondary" : i === 4 ? "bg-secondary-fixed-dim" : "bg-surface-container-highest group-hover:bg-secondary/40"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold tracking-widest text-outline uppercase">
              <span>Last 30 Days</span>
              <span>Today</span>
            </div>
          </div>
        </section>

        {/* Add Score */}
        <section className="mb-12 animate-fade-in-up-delay-2">
          <div className="bg-primary text-white p-8 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-headline font-bold text-2xl mb-6">Record New Round</h3>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-body text-sm font-semibold tracking-wider text-on-primary-container">
                    STABLEFORD POINTS
                  </span>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setScoreValue(Math.max(1, scoreValue - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10 active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="font-headline font-bold text-4xl w-12 text-center">{scoreValue}</span>
                    <button
                      onClick={() => setScoreValue(Math.min(45, scoreValue + 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10 active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
                <button className="bg-secondary-fixed-dim text-on-secondary-fixed font-bold py-4 rounded-lg tracking-widest uppercase text-sm hover:bg-secondary transition-colors duration-200 active:scale-[0.98]">
                  Submit Score
                </button>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Score History */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline font-bold text-xl tracking-tight">LATEST ROUNDS</h3>
            <span className="text-[10px] font-bold tracking-widest text-secondary uppercase border-b-2 border-secondary pb-1 cursor-pointer">
              View All
            </span>
          </div>
          <div className="space-y-4">
            {scores.map((s, i) => (
              <div
                key={i}
                className="bg-surface-container-lowest p-5 rounded-lg flex justify-between items-center group hover:bg-surface-bright transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container-low rounded flex items-center justify-center font-headline font-black text-xl text-primary">
                    {s.score}
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">{s.course}</p>
                    <p className="text-xs text-on-surface-variant font-medium">{s.date} • 18 Holes</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-1 rounded ${s.badgeColor}`}>
                    {s.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-secondary text-white rounded-full shadow-xl flex items-center justify-center z-50 transition-transform active:scale-90 active:opacity-80">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      <Footer />
      <MobileNav />
    </>
  );
}
