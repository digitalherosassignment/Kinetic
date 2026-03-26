"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/src/frontend/components/layout/Footer";
import Navbar from "@/src/frontend/components/layout/Navbar";
import { createClient } from "@/src/backend/lib/supabase/client";

const plans = {
  essential: {
    name: "Essential",
    label: "The Catalyst",
    monthly: 29,
    yearly: 278,
    features: [
      "Standard Shot Tracking",
      "1 Active Charity Selection",
      "Monthly Impact Report",
    ],
  },
  elite: {
    name: "Elite",
    label: "The Pro",
    monthly: 59,
    yearly: 566,
    popular: true,
    features: [
      "Priority Draw Access",
      "Flexible Charity Contribution",
      "VIP Impact Updates",
      "Premium Member Experience",
    ],
  },
};

function getStep(value) {
  const parsed = Number(value);
  return parsed >= 1 && parsed <= 3 ? parsed : 1;
}

function JoinFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [billingCycle, setBillingCycle] = useState(
    searchParams.get("billing") || "monthly"
  );
  const [selectedPlan, setSelectedPlan] = useState(
    searchParams.get("plan") || "elite"
  );
  const [selectedCharityId, setSelectedCharityId] = useState(
    searchParams.get("charityId") || ""
  );
  const [charityPercentage, setCharityPercentage] = useState(
    Number(searchParams.get("charityPercentage") || 15)
  );
  const [step, setStep] = useState(getStep(searchParams.get("step")));
  const [charities, setCharities] = useState([]);
  const [loadingCharities, setLoadingCharities] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const price = plans[selectedPlan][billingCycle];
  const selectedCharity = charities.find(
    (charity) => charity.id === selectedCharityId
  );

  useEffect(() => {
    async function loadCharities() {
      const response = await fetch("/api/charities");
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || "Unable to load charities.");
        setLoadingCharities(false);
        return;
      }

      setCharities(payload.charities || []);
      setLoadingCharities(false);

      if (payload.charities?.length) {
        setSelectedCharityId((current) => current || payload.charities[0].id);
      }
    }

    loadCharities();
  }, []);

  function buildReturnPath(targetStep = step) {
    const params = new URLSearchParams();
    params.set("plan", selectedPlan);
    params.set("billing", billingCycle);
    params.set("charityPercentage", String(charityPercentage));
    params.set("step", String(targetStep));
    if (selectedCharityId) params.set("charityId", selectedCharityId);
    if (searchParams.get("redirect")) {
      params.set("redirect", searchParams.get("redirect"));
    }
    return `/join?${params.toString()}`;
  }

  function handleContinue() {
    setStep((current) => Math.min(current + 1, 3));
  }

  async function handleActivate() {
    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSubmitting(false);
      router.push(
        `/login?redirect=${encodeURIComponent(buildReturnPath(3))}`
      );
      return;
    }

    if (!selectedCharityId) {
      setError("Please select a charity to continue.");
      setSubmitting(false);
      return;
    }

    const response = await fetch("/api/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan: selectedPlan,
        billing_cycle: billingCycle,
        charity_id: selectedCharityId,
        charity_percentage: charityPercentage,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to activate membership.");
      setSubmitting(false);
      return;
    }

    router.push(searchParams.get("redirect") || "/dashboard");
    router.refresh();
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen flex flex-col items-center">
        <div className="w-full max-w-md px-6 mb-12 flex justify-center items-center gap-2">
          {[1, 2, 3].map((indicator) => (
            <div
              key={indicator}
              className={`h-1 transition-all duration-500 rounded-full ${
                indicator === step
                  ? "step-active"
                  : indicator < step
                    ? "w-12 bg-secondary"
                    : "step-inactive"
              }`}
            />
          ))}
        </div>

        {error ? (
          <div className="w-full max-w-3xl px-6 mb-8">
            <div className="bg-error-container text-on-error-container px-4 py-3 text-sm rounded-lg">
              {error}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <section className="w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in-up">
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h1 className="font-headline font-extrabold text-5xl md:text-6xl tracking-tight text-primary mb-6 leading-none">
                Define Your <br />
                <span className="text-secondary">Impact.</span>
              </h1>
              <p className="text-body text-lg text-on-surface-variant max-w-sm mb-8">
                Choose a membership, lock in a live charity contribution, and
                unlock subscriber-only score and draw features.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">
                      auto_graph
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">
                      Performance Tracking
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      Record real Stableford rounds and stay draw-eligible with
                      your latest 5 scores.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">
                      volunteer_activism
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">Live Giving</h3>
                    <p className="text-sm text-on-surface-variant">
                      Your selected charity and contribution percentage are
                      stored with the subscription.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-surface-container-low rounded-xl p-1 md:p-8">
                <div className="flex justify-center mb-10">
                  <div className="bg-surface-container-highest p-1 rounded-lg flex items-center">
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={`px-6 py-2 text-xs font-bold uppercase tracking-widest z-10 rounded-md transition-all ${
                        billingCycle === "monthly"
                          ? "bg-surface-container-lowest shadow-sm text-primary"
                          : "text-outline hover:text-primary"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle("yearly")}
                      className={`px-6 py-2 text-xs font-bold uppercase tracking-widest z-10 rounded-md transition-all ${
                        billingCycle === "yearly"
                          ? "bg-surface-container-lowest shadow-sm text-primary"
                          : "text-outline hover:text-primary"
                      }`}
                    >
                      Yearly <span className="text-[10px] text-secondary ml-1">-20%</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(plans).map(([planKey, plan]) => {
                    const isSelected = selectedPlan === planKey;
                    return (
                      <div
                        key={planKey}
                        onClick={() => setSelectedPlan(planKey)}
                        className={`border transition-all p-8 rounded-xl flex flex-col group cursor-pointer ${
                          planKey === "elite"
                            ? "bg-primary text-white shadow-2xl"
                            : "bg-surface-container-lowest"
                        } ${
                          isSelected
                            ? "border-secondary"
                            : "border-transparent hover:border-secondary/30"
                        }`}
                      >
                        <div className="mb-6">
                          <div className="flex justify-between items-start gap-4">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                                planKey === "elite"
                                  ? "text-secondary-fixed-dim"
                                  : "text-outline"
                              }`}
                            >
                              {plan.label}
                            </span>
                            {plan.popular ? (
                              <span className="bg-secondary text-[9px] px-2 py-1 rounded-full font-bold uppercase tracking-widest text-white">
                                Most Popular
                              </span>
                            ) : null}
                          </div>
                          <h2 className="font-headline font-bold text-3xl mt-1">
                            {plan.name}
                          </h2>
                        </div>
                        <div className="mb-8">
                          <span className="text-4xl font-black">
                            ${plan[billingCycle]}
                          </span>
                          <span
                            className={`text-sm ${
                              planKey === "elite"
                                ? "text-on-primary-container"
                                : "text-outline"
                            }`}
                          >
                            /{billingCycle === "monthly" ? "mo" : "yr"}
                          </span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-grow">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-3 text-sm">
                              <span className="material-symbols-outlined text-secondary text-lg">
                                check_circle
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlan(planKey);
                            handleContinue();
                          }}
                          className={`w-full py-4 font-bold text-sm uppercase tracking-widest rounded-md transition-all ${
                            planKey === "elite"
                              ? "bg-secondary text-white hover:bg-secondary-container hover:text-on-secondary-container"
                              : "bg-surface-container-highest text-primary hover:bg-primary hover:text-white"
                          }`}
                        >
                          {planKey === "elite" ? "Continue" : "Select Plan"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="w-full max-w-6xl px-6 animate-fade-in-up">
            <div className="flex flex-col items-center mb-12">
              <span className="text-xs font-bold text-secondary uppercase tracking-[0.3em] mb-4">
                Step 02
              </span>
              <h2 className="font-headline font-bold text-4xl text-primary text-center">
                Fuel a Cause
              </h2>
              <p className="text-on-surface-variant mt-4 text-center max-w-md">
                Select the charity you want to support and choose the percentage
                that should be tied to this membership.
              </p>
            </div>

            {loadingCharities ? (
              <div className="bg-surface-container-lowest p-6 rounded-lg text-sm text-on-surface-variant">
                Loading charities...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {charities.map((charity) => {
                  const isSelected = charity.id === selectedCharityId;
                  return (
                    <button
                      key={charity.id}
                      type="button"
                      className={`h-56 rounded-lg p-6 flex flex-col justify-between text-left transition-all border ${
                        isSelected
                          ? "border-secondary bg-surface-container-high"
                          : "border-transparent bg-surface-container-low hover:border-secondary/30"
                      }`}
                      onClick={() => setSelectedCharityId(charity.id)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">
                          {charity.category}
                        </span>
                        {charity.is_featured ? (
                          <span className="text-[9px] bg-tertiary-fixed-dim text-black px-2 py-1 rounded-full font-bold uppercase tracking-widest">
                            Featured
                          </span>
                        ) : null}
                      </div>
                      <div>
                        <h3 className="font-headline font-bold text-xl mb-2">
                          {charity.name}
                        </h3>
                        <p className="text-sm text-on-surface-variant line-clamp-4">
                          {charity.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mb-8">
              <label className="block text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-4">
                Charity Contribution: {charityPercentage}%
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={charityPercentage}
                onChange={(event) => setCharityPercentage(Number(event.target.value))}
                className="w-full accent-secondary"
              />
              <div className="flex justify-between text-[10px] text-outline uppercase tracking-widest mt-2">
                <span>10% minimum</span>
                <span>50%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!selectedCharityId || loadingCharities}
              className="w-full md:w-auto bg-primary text-on-primary px-12 py-4 font-bold tracking-widest uppercase text-sm hover:bg-secondary transition-all rounded-md disabled:opacity-50"
            >
              Continue to Payment
            </button>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="w-full max-w-lg px-6 animate-fade-in-up">
            <div className="flex flex-col items-center mb-12">
              <span className="text-xs font-bold text-secondary uppercase tracking-[0.3em] mb-4">
                Step 03
              </span>
              <h2 className="font-headline font-bold text-4xl text-primary text-center">
                Confirm &amp; Go
              </h2>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-xl mb-8">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-4">
                <span className="text-sm text-on-surface-variant">Plan</span>
                <span className="font-bold">
                  {plans[selectedPlan].name} ({billingCycle})
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-4">
                <span className="text-sm text-on-surface-variant">Amount</span>
                <span className="font-headline font-black text-2xl">${price}</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-4">
                <span className="text-sm text-on-surface-variant">Charity</span>
                <span className="font-bold">{selectedCharity?.name || "Choose one"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-4">
                <span className="text-sm text-on-surface-variant">
                  Charity Contribution
                </span>
                <span className="font-bold text-secondary">
                  {charityPercentage}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Donation</span>
                <span className="font-bold text-secondary">
                  ${((price * charityPercentage) / 100).toFixed(2)}
                  /{billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleActivate}
              disabled={submitting}
              className="w-full bg-secondary text-white py-4 font-bold tracking-widest uppercase text-sm hover:bg-secondary-container hover:text-on-secondary-container transition-all rounded-md disabled:opacity-50"
            >
              {submitting ? "Activating..." : "Activate Membership"}
            </button>
            <p className="text-center text-[10px] text-outline tracking-widest uppercase mt-4">
              You&apos;ll be asked to sign in first if you haven&apos;t already.
            </p>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <span className="font-headline font-black text-xl">KINETIC</span>
        </div>
      }
    >
      <JoinFlow />
    </Suspense>
  );
}
