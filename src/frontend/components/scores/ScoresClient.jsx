"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function ScoresClient({ initialScores = [] }) {
  const router = useRouter();
  const [scoreValue, setScoreValue] = useState(36);
  const [playedAt, setPlayedAt] = useState(getToday());
  const [courseName, setCourseName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const averageScore = initialScores.length
    ? (
        initialScores.reduce(
          (sum, score) => sum + Number(score.score || 0),
          0
        ) / initialScores.length
      ).toFixed(1)
    : null;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: scoreValue,
        played_at: playedAt,
        course_name: courseName.trim() || undefined,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to save score.");
      setSubmitting(false);
      return;
    }

    setCourseName("");
    setPlayedAt(getToday());
    setSuccess("Score saved. Only your latest 5 rounds are retained.");
    setSubmitting(false);
    router.refresh();
  }

  return (
    <>
      <section className="mb-10 bg-surface-container-low rounded-xl p-6 relative overflow-hidden group animate-fade-in-up-delay">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <span
            className="material-symbols-outlined text-9xl"
            style={{ fontVariationSettings: "'wght' 700" }}
          >
            golf_course
          </span>
        </div>
        <div className="relative z-10">
          <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
            <div>
              <span className="text-xs font-bold tracking-widest text-secondary uppercase">
                Current Snapshot
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline font-bold text-5xl">
                  {averageScore ?? "--"}
                </span>
                <span className="text-on-surface-variant text-sm font-bold">
                  Stableford Avg
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase block">
                Stored Scores
              </span>
              <span className="font-headline font-bold text-2xl">
                {initialScores.length}/5
              </span>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant">
            Each round now requires a date, and the oldest score is replaced
            automatically once you reach 5 entries.
          </p>
        </div>
      </section>

      <section className="mb-12 animate-fade-in-up-delay-2">
        <form
          onSubmit={handleSubmit}
          className="bg-primary text-white p-8 rounded-xl shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div>
                <h3 className="font-headline font-bold text-2xl mb-2">
                  Record New Round
                </h3>
                <p className="text-sm text-white/70">
                  Save a dated Stableford score to stay eligible for draws.
                </p>
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-secondary-fixed-dim">
                Latest 5 Only
              </span>
            </div>

            {error ? (
              <div className="bg-error-container text-on-error-container px-4 py-3 text-sm rounded mb-4">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="bg-white/10 px-4 py-3 text-sm rounded mb-4">
                {success}
              </div>
            ) : null}

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-body text-sm font-semibold tracking-wider text-on-primary-container">
                  STABLEFORD POINTS
                </span>
                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setScoreValue(Math.max(1, scoreValue - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10 active:scale-90 transition-all"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="font-headline font-bold text-4xl w-12 text-center">
                    {scoreValue}
                  </span>
                  <button
                    type="button"
                    onClick={() => setScoreValue(Math.min(45, scoreValue + 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10 active:scale-90 transition-all"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="block text-xs font-bold tracking-widest uppercase text-on-primary-container mb-2">
                    Played On
                  </span>
                  <input
                    type="date"
                    value={playedAt}
                    onChange={(event) => setPlayedAt(event.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </label>

                <label className="block">
                  <span className="block text-xs font-bold tracking-widest uppercase text-on-primary-container mb-2">
                    Course Name
                  </span>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(event) => setCourseName(event.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="Optional"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-secondary-fixed-dim text-on-secondary-fixed font-bold py-4 rounded-lg tracking-widest uppercase text-sm hover:bg-secondary transition-colors duration-200 active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Submit Score"}
              </button>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
        </form>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-xl tracking-tight">
            Latest Rounds
          </h3>
          <span className="text-[10px] font-bold tracking-widest text-secondary uppercase border-b-2 border-secondary pb-1">
            Reverse Chronological
          </span>
        </div>

        {initialScores.length === 0 ? (
          <div className="bg-surface-container-lowest p-6 rounded-lg text-sm text-on-surface-variant">
            No scores yet. Add your first dated Stableford round above.
          </div>
        ) : (
          <div className="space-y-4">
            {initialScores.map((score) => (
              <div
                key={score.id}
                className="bg-surface-container-lowest p-5 rounded-lg flex justify-between items-center group hover:bg-surface-bright transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container-low rounded flex items-center justify-center font-headline font-black text-xl text-primary">
                    {score.score}
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">
                      {score.course_name || "Unnamed Course"}
                    </p>
                    <p className="text-xs text-on-surface-variant font-medium">
                      {new Date(score.played_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-tighter px-2 py-1 rounded bg-surface-container-high text-on-surface-variant">
                    Eligible Entry
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
