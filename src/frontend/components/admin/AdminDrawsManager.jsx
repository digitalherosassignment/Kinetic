"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

export default function AdminDrawsManager({ latestDraw }) {
  const router = useRouter();
  const [drawType, setDrawType] = useState("random");
  const [simulating, setSimulating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function runSimulation() {
    setSimulating(true);
    setError("");
    setNotice("");

    const response = await fetch("/api/draws/simulate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draw_type: drawType }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to simulate draw.");
      setSimulating(false);
      return;
    }

    setSimulation(payload);
    setSimulating(false);
  }

  async function publishResults() {
    setPublishing(true);
    setError("");
    setNotice("");

    const response = await fetch("/api/draws/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draw_type: drawType }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to publish draw.");
      setPublishing(false);
      return;
    }

    setSimulation(payload.simulation);
    setNotice(`Published ${payload.draw.draw_id} successfully.`);
    setPublishing(false);
    router.refresh();
  }

  const preview = simulation || latestDraw;

  return (
    <>
      {error ? (
        <div className="bg-error-container text-on-error-container px-4 py-3 text-sm rounded-lg mb-6">
          {error}
        </div>
      ) : null}

      {notice ? (
        <div className="bg-secondary-fixed text-on-secondary-fixed px-4 py-3 text-sm rounded-lg mb-6">
          {notice}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl">
          <h3 className="font-headline font-bold text-xl mb-6">
            Draw Configuration
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2">
                Draw Type
              </label>
              <div className="flex gap-4">
                {["random", "algorithmic"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setDrawType(type)}
                    className={`px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                      drawType === type
                        ? "bg-primary text-white"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-secondary hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2">
                Latest Published Draw
              </label>
              <div className="bg-surface-container-low rounded-lg px-4 py-3 text-sm border-0 w-full font-mono">
                {latestDraw?.draw_id || "No draw published yet"}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={runSimulation}
                disabled={simulating}
                className="bg-surface-container-highest text-primary px-8 py-3 font-bold text-sm uppercase tracking-widest rounded-md hover:bg-secondary hover:text-white transition-all disabled:opacity-50"
              >
                {simulating ? "Running..." : "Run Simulation"}
              </button>
              <button
                onClick={publishResults}
                disabled={publishing}
                className="bg-secondary text-white px-8 py-3 font-bold text-sm uppercase tracking-widest rounded-md hover:bg-secondary-container hover:text-on-secondary-container transition-all disabled:opacity-50"
              >
                {publishing ? "Publishing..." : "Publish Results"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-primary text-white p-8 rounded-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary/20 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="font-headline font-bold text-xl mb-6">
              Pool Distribution
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                <span className="text-white/60">5-Match (40%)</span>
                <span className="font-bold">
                  {formatCurrency(preview?.prizeDistribution?.tier5?.pool || preview?.tier1_pool)}
                </span>
              </div>
              <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                <span className="text-white/60">4-Match (35%)</span>
                <span className="font-bold">
                  {formatCurrency(preview?.prizeDistribution?.tier4?.pool || preview?.tier2_pool)}
                </span>
              </div>
              <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                <span className="text-white/60">3-Match (25%)</span>
                <span className="font-bold">
                  {formatCurrency(preview?.prizeDistribution?.tier3?.pool || preview?.tier3_pool)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="text-secondary-fixed-dim font-bold">Total</span>
                <span className="font-black text-xl">
                  {formatCurrency(preview?.totalPool || preview?.total_pool)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low p-8 rounded-xl animate-fade-in-up">
        <h3 className="font-headline font-bold text-xl mb-6">
          {simulation ? "Simulation Results" : "Latest Draw Snapshot"}
        </h3>
        <div className="flex gap-3 mb-8 flex-wrap">
          {(preview?.winningNumbers || preview?.winning_numbers || []).map((number) => (
            <div
              key={number}
              className="w-14 h-14 rounded-full border-2 border-secondary flex items-center justify-center font-headline font-bold text-xl"
            >
              {number}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest p-4 rounded-lg">
            <span className="text-[10px] text-outline uppercase tracking-widest block">
              5-Match
            </span>
            <span className="font-headline font-black text-2xl">
              {preview?.tierBreakdown?.tier5?.count || 0}
            </span>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-lg">
            <span className="text-[10px] text-outline uppercase tracking-widest block">
              4-Match
            </span>
            <span className="font-headline font-black text-2xl">
              {preview?.tierBreakdown?.tier4?.count || 0}
            </span>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-lg">
            <span className="text-[10px] text-outline uppercase tracking-widest block">
              3-Match
            </span>
            <span className="font-headline font-black text-2xl">
              {preview?.tierBreakdown?.tier3?.count || 0}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
