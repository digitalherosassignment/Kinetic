"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/src/frontend/components/layout/Navbar";
import Footer from "@/src/frontend/components/layout/Footer";

export default function JoinPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState("elite");
  const [step, setStep] = useState(1);
  const router = useRouter();

  const plans = {
    essential: {
      name: "Essential",
      label: "The Catalyst",
      monthly: 29,
      yearly: 278,
      features: [
        "Standard Shot Tracking",
        "2 Charity Partner Slots",
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
        "Real-time Biomechanics",
        "Unlimited Charity Partners",
        "VIP Event Invitations",
        "Premium Gear Access",
      ],
    },
  };

  const charities = [
    { name: "Global Education", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCHNy5vNbgRDdCRHd6nNrVqgAcNnmgSHPk-Rlx3GuSzTsc2GQ-uO6p_AG7x0IRvcg4AzUy86o1O5Qqv_RYEBl2CQkdAQZ-DB3l8Mkj3lapEIX3gN5GTGnpftqPUzgj9awIWWnKw3baa_e9f7MKOggSRRF02YGBGMDIQhbJ9kkAQ8_6cwC93srkW3CpsNz0l2hwPYRU0IlDawi8cRD6fQV9zz85GR3lT2dTiB604ZSgaOAJjgJZztE6wZl75BOd-za-nx7gkpU7eC8" },
    { name: "Climate Action", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiZYUlTf_lxwG6hJjPBqghf4f26HH4b0rsAB1ZUL7nKQmBUVVRm4w7qN1IUYkRxpg3pFEcuCaf2d_8NuNKFSO1P2NmeroiBz47DKe6DpLs-3QRHvxMx2H_oowDhfRhANIaf7SQOYP7smU3g7JStR2duveQs1Adzo_O17DTsl9fFdlGLwtU1P0MgI3FOlHmOJ6N7T8QW5n_-1JpGptno1iau1na7cfOrNy7vwL9klNY7mp-x9lLkPvTxUWi5JdXKpANdFhsLUZun1M" },
    { name: "Clean Water Access", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKpfDxdhBPWf5Ic-0S5qhcf72y8V49mR5HiCUewizEJuYx5XXQ4Q-MzZsPBlhbU1109sSbrfnWW75C2r10yZJQtY5Q515nXyv0GxV7nrYB5Bkdf7OG75Wr4Om9YrTTNf91-04X2C4POCTVLzsxiAqQZSuSF3PnBrngqd71JNvXpIZQCYix-yzRlczzFtk9Ewrsi7geqBcMe2BgsDjHVRCpJ-6mdJP0REBhaoX42GluoIvH3A4NSgGc5m8mvdPHMzgkVBJ_ilxBP7g" },
  ];

  const price = plans[selectedPlan][billingCycle];

  function handleContinue() {
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen flex flex-col items-center">
        {/* Progress Indicator */}
        <div className="w-full max-w-md px-6 mb-12 flex justify-center items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 transition-all duration-500 rounded-full ${
                s === step ? "step-active" : s < step ? "w-12 bg-secondary" : "step-inactive"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <section className="w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in-up">
            {/* Left side */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h1 className="font-headline font-extrabold text-5xl md:text-6xl tracking-tight text-primary mb-6 leading-none">
                Define Your <br />
                <span className="text-secondary">Impact.</span>
              </h1>
              <p className="text-body text-lg text-on-surface-variant max-w-sm mb-8">
                Choose a membership that fuels your kinetic performance while
                driving global altruism. Every swing counts toward change.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">auto_graph</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">Performance Analytics</h3>
                    <p className="text-sm text-on-surface-variant">
                      Track every drive, putt, and charity point in high fidelity.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">verified</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">Certified Giving</h3>
                    <p className="text-sm text-on-surface-variant">
                      100% of charity points directed to your selected partners.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Plan Selection */}
            <div className="lg:col-span-7">
              <div className="bg-surface-container-low rounded-xl p-1 md:p-8">
                {/* Toggle */}
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
                  {/* Essential Plan */}
                  <div
                    onClick={() => setSelectedPlan("essential")}
                    className={`bg-surface-container-lowest border transition-all p-8 rounded-xl flex flex-col group cursor-pointer ${
                      selectedPlan === "essential" ? "border-secondary" : "border-transparent hover:border-secondary/30"
                    }`}
                  >
                    <div className="mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
                        {plans.essential.label}
                      </span>
                      <h2 className="font-headline font-bold text-3xl text-primary mt-1">
                        Essential
                      </h2>
                    </div>
                    <div className="mb-8">
                      <span className="text-4xl font-black text-primary">${plans.essential[billingCycle]}</span>
                      <span className="text-outline text-sm">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                    </div>
                    <ul className="space-y-4 mb-10 flex-grow">
                      {plans.essential.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm">
                          <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => { setSelectedPlan("essential"); handleContinue(); }}
                      className="w-full py-4 bg-surface-container-highest text-primary font-bold text-sm uppercase tracking-widest rounded-md hover:bg-primary hover:text-white transition-all"
                    >
                      Select Plan
                    </button>
                  </div>

                  {/* Elite Plan */}
                  <div
                    onClick={() => setSelectedPlan("elite")}
                    className="bg-primary text-white p-8 rounded-xl flex flex-col relative overflow-hidden shadow-2xl cursor-pointer"
                  >
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary opacity-20 blur-3xl"></div>
                    <div className="mb-6 relative z-10">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim">
                          {plans.elite.label}
                        </span>
                        <span className="bg-secondary text-[9px] px-2 py-1 rounded-full font-bold uppercase tracking-widest">
                          Most Popular
                        </span>
                      </div>
                      <h2 className="font-headline font-bold text-3xl mt-1">Elite</h2>
                    </div>
                    <div className="mb-8 relative z-10">
                      <span className="text-4xl font-black">${plans.elite[billingCycle]}</span>
                      <span className="text-on-primary-container text-sm">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                    </div>
                    <ul className="space-y-4 mb-10 flex-grow relative z-10">
                      {plans.elite.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm">
                          <span className="material-symbols-outlined text-secondary-fixed-dim text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => { setSelectedPlan("elite"); handleContinue(); }}
                      className="w-full py-4 bg-secondary text-white font-bold text-sm uppercase tracking-widest rounded-md hover:bg-secondary-container hover:text-on-secondary-container transition-all relative z-10"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="w-full max-w-6xl px-6 animate-fade-in-up">
            <div className="flex flex-col items-center mb-12">
              <span className="text-xs font-bold text-secondary uppercase tracking-[0.3em] mb-4">
                Step 02
              </span>
              <h2 className="font-headline font-bold text-4xl text-primary text-center">
                Fuel a Cause
              </h2>
              <p className="text-on-surface-variant mt-4 text-center max-w-md">
                Select a charity to support with your subscription. A minimum of 10% of your fee goes directly to your chosen cause.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {charities.map((c) => (
                <div
                  key={c.name}
                  className="h-48 bg-surface-container-high rounded-lg p-6 flex flex-col justify-end relative overflow-hidden group cursor-pointer hover:ring-2 hover:ring-secondary transition-all"
                  onClick={() => {}}
                >
                  <img
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"
                    src={c.img}
                  />
                  <div className="relative z-10">
                    <p className="font-headline font-bold text-lg leading-tight">{c.name}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-4">
                Charity Contribution: 15%
              </label>
              <input
                type="range"
                min="10"
                max="50"
                defaultValue="15"
                className="w-full accent-secondary"
              />
              <div className="flex justify-between text-[10px] text-outline uppercase tracking-widest mt-2">
                <span>10% minimum</span>
                <span>50%</span>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full md:w-auto bg-primary text-on-primary px-12 py-4 font-bold tracking-widest uppercase text-sm hover:bg-secondary transition-all rounded-md"
            >
              Continue to Payment
            </button>
          </section>
        )}

        {step === 3 && (
          <section className="w-full max-w-lg px-6 animate-fade-in-up">
            <div className="flex flex-col items-center mb-12">
              <span className="text-xs font-bold text-secondary uppercase tracking-[0.3em] mb-4">
                Step 03
              </span>
              <h2 className="font-headline font-bold text-4xl text-primary text-center">
                Confirm & Go
              </h2>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-xl mb-8">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-4">
                <span className="text-sm text-on-surface-variant">Plan</span>
                <span className="font-bold">{plans[selectedPlan].name} ({billingCycle})</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-4">
                <span className="text-sm text-on-surface-variant">Amount</span>
                <span className="font-headline font-black text-2xl">${price}</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-4">
                <span className="text-sm text-on-surface-variant">Charity Contribution</span>
                <span className="font-bold text-secondary">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Charity Donation</span>
                <span className="font-bold text-secondary">${(price * 0.15).toFixed(2)}/mo</span>
              </div>
            </div>
            <button
              onClick={handleContinue}
              className="w-full bg-secondary text-white py-4 font-bold tracking-widest uppercase text-sm hover:bg-secondary-container hover:text-on-secondary-container transition-all rounded-md"
            >
              Activate Membership
            </button>
            <p className="text-center text-[10px] text-outline tracking-widest uppercase mt-4">
              This is a simulated payment for demo purposes
            </p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
