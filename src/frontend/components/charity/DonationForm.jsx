"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DonationForm({ charityId, isAuthenticated }) {
  const router = useRouter();
  const [amount, setAmount] = useState(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleDonate(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/donations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        charity_id: charityId,
        amount: Number(amount),
        source: "independent",
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to submit donation.");
      setLoading(false);
      return;
    }

    setSuccess("Donation recorded successfully.");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleDonate} className="space-y-4">
      {error ? (
        <div className="bg-error-container text-on-error-container px-4 py-3 text-sm rounded-lg">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="bg-secondary-fixed text-on-secondary-fixed px-4 py-3 text-sm rounded-lg">
          {success}
        </div>
      ) : null}

      <div>
        <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">
          Independent Donation
        </label>
        <input
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-secondary"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
      >
        {loading
          ? "Submitting..."
          : isAuthenticated
            ? "Donate Now"
            : "Sign In To Donate"}
      </button>
    </form>
  );
}
