"use client";

import { useState } from "react";

export default function AdminDrawsPage() {
  const [drawType, setDrawType] = useState("random");
  const [simulated, setSimulated] = useState(false);

  return (
    <div>
      <div className="mb-12">
        <h1 className="font-headline font-black text-4xl tracking-tighter text-primary mb-2">DRAW MANAGEMENT</h1>
        <p className="text-on-surface-variant">Configure, simulate, and publish draw results</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Draw Config */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl">
          <h3 className="font-headline font-bold text-xl mb-6">Draw Configuration</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Draw Type</label>
              <div className="flex gap-4">
                {["random", "algorithmic"].map((t) => (
                  <button key={t} onClick={() => setDrawType(t)}
                    className={`px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${drawType === t ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant hover:bg-secondary hover:text-white"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Draw ID</label>
              <input value="#KNC-2024-08" readOnly className="bg-surface-container-low rounded-lg px-4 py-3 text-sm border-0 w-full font-mono" />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setSimulated(true)}
                className="bg-surface-container-highest text-primary px-8 py-3 font-bold text-sm uppercase tracking-widest rounded-md hover:bg-secondary hover:text-white transition-all">
                Run Simulation
              </button>
              <button className="bg-secondary text-white px-8 py-3 font-bold text-sm uppercase tracking-widest rounded-md hover:bg-secondary-container hover:text-on-secondary-container transition-all">
                Publish Results
              </button>
            </div>
          </div>
        </div>

        {/* Pool Stats */}
        <div className="bg-primary text-white p-8 rounded-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary/20 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="font-headline font-bold text-xl mb-6">Pool Distribution</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                <span className="text-white/60">Tier 1 (40%)</span><span className="font-bold">$67,368</span>
              </div>
              <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                <span className="text-white/60">Tier 2 (35%)</span><span className="font-bold">$58,947</span>
              </div>
              <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                <span className="text-white/60">Tier 3 (25%)</span><span className="font-bold">$42,105</span>
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="text-secondary-fixed-dim font-bold">Total</span><span className="font-black text-xl">$168,420</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Results */}
      {simulated && (
        <div className="bg-surface-container-low p-8 rounded-xl animate-fade-in-up">
          <h3 className="font-headline font-bold text-xl mb-6">Simulation Results</h3>
          <div className="flex gap-3 mb-8">
            {[14, 22, 31, 38, 42].map((n) => (
              <div key={n} className="w-14 h-14 rounded-full border-2 border-secondary flex items-center justify-center font-headline font-bold text-xl">{n}</div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-lg"><span className="text-[10px] text-outline uppercase tracking-widest block">5-Match</span><span className="font-headline font-black text-2xl">0</span></div>
            <div className="bg-surface-container-lowest p-4 rounded-lg"><span className="text-[10px] text-outline uppercase tracking-widest block">4-Match</span><span className="font-headline font-black text-2xl">8</span></div>
            <div className="bg-surface-container-lowest p-4 rounded-lg"><span className="text-[10px] text-outline uppercase tracking-widest block">3-Match</span><span className="font-headline font-black text-2xl">127</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
