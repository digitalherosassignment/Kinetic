"use client";

import { useState } from "react";
import Navbar from "@/src/frontend/components/layout/Navbar";
import Footer from "@/src/frontend/components/layout/Footer";
import MobileNav from "@/src/frontend/components/layout/MobileNav";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/backend/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const [charityPercent, setCharityPercent] = useState(15);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <Navbar user={true} />
      <main className="pt-24 pb-32 px-6 max-w-screen-md mx-auto">
        <h1 className="font-headline font-black text-4xl tracking-tight text-primary mb-2 animate-fade-in-up">PROFILE</h1>
        <p className="text-on-surface-variant text-sm uppercase tracking-widest mb-12">Account & Preferences</p>

        {/* Profile Card */}
        <div className="bg-surface-container-lowest p-8 mb-6 animate-fade-in-up">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-outline">person</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-2xl">Marcus Chen</h2>
              <p className="text-on-surface-variant text-sm">marcus@kinetic.app</p>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Elite Member</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4">
              <span className="text-[10px] text-outline uppercase tracking-widest block">Location</span>
              <span className="font-bold">Vancouver, BC</span>
            </div>
            <div className="bg-surface-container-low p-4">
              <span className="text-[10px] text-outline uppercase tracking-widest block">Member Since</span>
              <span className="font-bold">Jan 2024</span>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-primary text-white p-8 mb-6 relative overflow-hidden animate-fade-in-up-delay">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-secondary/20 blur-3xl"></div>
          <div className="relative z-10">
            <span className="text-[10px] font-bold text-secondary-fixed-dim uppercase tracking-widest block mb-2">Subscription</span>
            <h3 className="font-headline font-bold text-2xl mb-4">Elite Plan — $59/mo</h3>
            <div className="flex justify-between text-sm border-t border-white/10 pt-4 mt-4">
              <span className="text-white/60">Next Renewal</span>
              <span className="font-bold">Dec 14, 2024</span>
            </div>
            <div className="flex justify-between text-sm border-t border-white/10 pt-4 mt-4">
              <span className="text-white/60">Status</span>
              <span className="text-secondary-fixed-dim font-bold">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Charity Settings */}
        <div className="bg-surface-container-lowest p-8 mb-6 animate-fade-in-up-delay-2">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-4">Charity Contribution</span>
          <h3 className="font-headline font-bold text-xl mb-6">Ocean Kinetic Foundation</h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-on-surface-variant">Contribution Rate</span>
              <span className="font-bold text-secondary">{charityPercent}%</span>
            </div>
            <input type="range" min="10" max="50" value={charityPercent} onChange={(e) => setCharityPercent(e.target.value)} className="w-full accent-secondary" />
          </div>
          <p className="text-[10px] text-outline uppercase tracking-widest">Monthly donation: ${(59 * charityPercent / 100).toFixed(2)}</p>
        </div>

        {/* Winnings */}
        <div className="bg-surface-container-low p-8 mb-8">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-4">Winnings Overview</span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-headline font-black text-3xl">$4,900</span>
              <span className="block text-[10px] text-outline uppercase tracking-widest">Total Won</span>
            </div>
            <div>
              <span className="font-headline font-black text-3xl text-secondary">$4,900</span>
              <span className="block text-[10px] text-outline uppercase tracking-widest">Paid Out</span>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="w-full py-4 bg-surface-container-highest text-primary font-bold text-sm uppercase tracking-widest hover:bg-error hover:text-on-error transition-all rounded-md">
          Sign Out
        </button>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
