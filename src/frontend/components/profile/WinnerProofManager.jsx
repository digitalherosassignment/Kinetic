"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WinnerProofManager({ winners = [] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");
  const [error, setError] = useState("");

  async function handleUpload(event, winnerId) {
    event.preventDefault();
    const file = event.currentTarget.proof.files?.[0];

    if (!file) {
      setError("Please choose a screenshot before uploading.");
      return;
    }

    setLoadingId(winnerId);
    setError("");

    const formData = new FormData();
    formData.append("winner_id", winnerId);
    formData.append("proof", file);

    const response = await fetch("/api/winners/proof", {
      method: "POST",
      body: formData,
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to upload proof.");
      setLoadingId("");
      return;
    }

    setLoadingId("");
    router.refresh();
  }

  if (winners.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface-container-lowest p-8 mb-8 rounded-xl">
      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-4">
        Winner Verification
      </span>
      <p className="text-sm text-on-surface-variant mb-6">
        Upload score proof for any pending or rejected winnings so the admin
        team can review them.
      </p>

      {error ? (
        <div className="bg-error-container text-on-error-container px-4 py-3 text-sm rounded-lg mb-4">
          {error}
        </div>
      ) : null}

      <div className="space-y-6">
        {winners.map((winner) => (
          <div
            key={winner.id}
            className="border border-outline-variant/20 rounded-lg p-5"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="font-headline font-bold text-xl">
                  {winner.draws?.draw_id || "Draw Result"}
                </h4>
                <p className="text-sm text-on-surface-variant">
                  Tier {winner.match_tier} · ${Number(winner.prize_amount || 0).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-outline uppercase tracking-widest">
                  Verification
                </span>
                <span className="font-bold capitalize">
                  {winner.verification_status}
                </span>
              </div>
            </div>

            {winner.proof_url ? (
              <a
                href={winner.proof_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-secondary mb-4"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                View Uploaded Proof
              </a>
            ) : null}

            {winner.payment_status === "paid" ? (
              <p className="text-sm text-on-surface-variant">
                This winner has already been paid.
              </p>
            ) : winner.verification_status === "approved" ? (
              <p className="text-sm text-on-surface-variant">
                Proof has been approved. You do not need to upload again unless
                support asks for a replacement.
              </p>
            ) : (
              <form
                onSubmit={(event) => handleUpload(event, winner.id)}
                className="flex flex-col md:flex-row gap-3 md:items-center"
              >
                <input
                  name="proof"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="flex-1 text-sm"
                />
                <button
                  type="submit"
                  disabled={loadingId === winner.id}
                  className="bg-primary text-white px-5 py-3 text-xs font-bold uppercase tracking-widest rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {loadingId === winner.id ? "Uploading..." : "Upload Screenshot"}
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
