"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminWinnersTable({ winners = [] }) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState("");
  const [error, setError] = useState("");

  async function handleAction(winnerId, action) {
    setLoadingAction(`${winnerId}:${action}`);
    setError("");

    const response = await fetch("/api/winners/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        winner_id: winnerId,
        action,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to update winner.");
      setLoadingAction("");
      return;
    }

    setLoadingAction("");
    router.refresh();
  }

  if (winners.length === 0) {
    return (
      <div className="bg-surface-container-lowest p-6 rounded-xl text-sm text-on-surface-variant">
        No winners yet. Publish a draw to generate winner records here.
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="bg-error-container text-on-error-container px-4 py-3 text-sm rounded-lg mb-6">
          {error}
        </div>
      ) : null}

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                Winner
              </th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                Draw
              </th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                Tier
              </th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                Prize
              </th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                Verification
              </th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                Proof
              </th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                Payment
              </th>
              <th className="text-right p-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {winners.map((winner) => (
              <tr
                key={winner.id}
                className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors"
              >
                <td className="p-4">
                  <div className="font-bold text-sm">
                    {winner.profiles?.full_name || "Unknown User"}
                  </div>
                  <div className="text-xs text-outline">
                    {winner.profiles?.email || "No email"}
                  </div>
                </td>
                <td className="p-4 text-sm font-mono text-outline">
                  {winner.draws?.draw_id || "Pending"}
                </td>
                <td className="p-4">
                  <span className="text-[10px] font-bold bg-surface-container-high px-2 py-1 rounded uppercase">
                    Tier {winner.match_tier}
                  </span>
                </td>
                <td className="p-4 font-bold text-sm">
                  ${Number(winner.prize_amount || 0).toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${
                      winner.verification_status === "approved"
                        ? "text-secondary"
                        : winner.verification_status === "rejected"
                          ? "text-error"
                          : "text-outline"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {winner.verification_status === "approved"
                        ? "verified"
                        : winner.verification_status === "rejected"
                          ? "block"
                          : "pending"}
                    </span>
                    {winner.verification_status}
                  </span>
                </td>
                <td className="p-4">
                  {winner.proof_url ? (
                    <a
                      href={winner.proof_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-bold uppercase tracking-widest text-secondary"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-outline">
                      Missing
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      winner.payment_status === "paid"
                        ? "text-secondary"
                        : "text-outline"
                    }`}
                  >
                    {winner.payment_status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex gap-2 justify-end">
                    {winner.verification_status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleAction(winner.id, "approve")}
                          disabled={loadingAction === `${winner.id}:approve`}
                          className="bg-secondary text-white px-3 py-1 text-[10px] font-bold uppercase rounded hover:bg-secondary-container transition-all disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(winner.id, "reject")}
                          disabled={loadingAction === `${winner.id}:reject`}
                          className="bg-surface-container-high text-primary px-3 py-1 text-[10px] font-bold uppercase rounded hover:bg-error hover:text-white transition-all disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : null}

                    {winner.verification_status === "approved" &&
                    winner.payment_status !== "paid" ? (
                      <button
                        onClick={() => handleAction(winner.id, "mark_paid")}
                        disabled={loadingAction === `${winner.id}:mark_paid`}
                        className="bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase rounded hover:bg-secondary transition-all disabled:opacity-50"
                      >
                        Mark Paid
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
