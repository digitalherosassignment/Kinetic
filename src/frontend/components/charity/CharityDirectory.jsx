"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const ALL_CATEGORY = "All";

export default function CharityDirectory({ charities = [] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  const categories = useMemo(() => {
    return [ALL_CATEGORY, ...new Set(charities.map((charity) => charity.category))];
  }, [charities]);

  const filteredCharities = useMemo(() => {
    return charities.filter((charity) => {
      const matchesCategory =
        activeCategory === ALL_CATEGORY || charity.category === activeCategory;
      const matchesQuery =
        !query ||
        `${charity.name} ${charity.description} ${charity.category}`
          .toLowerCase()
          .includes(query.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, charities, query]);

  const featuredCharity =
    filteredCharities.find((charity) => charity.is_featured) || filteredCharities[0];
  const remainingCharities = filteredCharities.filter(
    (charity) => charity.id !== featuredCharity?.id
  );

  return (
    <>
      <header className="px-6 mb-20 max-w-7xl mx-auto animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <span className="font-label text-xs tracking-[0.3em] uppercase text-secondary font-bold mb-4 block">
              The Impact Directory
            </span>
            <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-primary mb-8">
              WHERE EVERY <br />
              SWING MATTERS.
            </h1>
            <p className="font-body text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Search, filter, and explore the live charities currently available
              on the platform. Each profile includes donation context and impact
              metrics.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-0 bottom-2 text-outline">
                search
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent border-0 border-b border-outline-variant/40 py-2 pl-8 focus:ring-0 focus:border-secondary transition-all font-body text-sm placeholder:text-outline/60"
                placeholder="Search by cause, name, or mission..."
                type="text"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${
                    activeCategory === category
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-secondary hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="px-6 mb-24 max-w-7xl mx-auto">
        {filteredCharities.length === 0 ? (
          <div className="bg-surface-container-lowest p-8 rounded-xl text-sm text-on-surface-variant">
            No charities match your current search. Try another category or a
            broader keyword.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCharity ? (
              <Link
                href={`/charity/${featuredCharity.id}`}
                className="md:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-xl bg-surface-container-low"
              >
                <div className="aspect-[4/5] md:aspect-auto md:h-full relative overflow-hidden">
                  {featuredCharity.image_url ? (
                    <img
                      alt={featuredCharity.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={featuredCharity.image_url}
                    />
                  ) : (
                    <div className="w-full h-full kinetic-gradient"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 bg-tertiary-fixed-dim text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                        Featured
                      </span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
                        {featuredCharity.category}
                      </span>
                    </div>
                    <h2 className="font-headline text-4xl text-white font-bold mb-4">
                      {featuredCharity.name}
                    </h2>
                    <p className="text-white/80 font-body text-base max-w-md mb-8 leading-relaxed">
                      {featuredCharity.description}
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-white text-[10px] font-bold tracking-widest uppercase">
                        <span>Impact Goal</span>
                        <span>{featuredCharity.impact_goal_percent || 0}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/20">
                        <div
                          className="h-full impact-meter-gradient"
                          style={{
                            width: `${Math.min(
                              featuredCharity.impact_goal_percent || 0,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null}

            {remainingCharities.map((charity) => (
              <Link
                key={charity.id}
                href={`/charity/${charity.id}`}
                className={`p-8 flex flex-col justify-between group transition-all rounded-xl ${
                  charity.is_featured
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest hover:bg-surface-container-high"
                }`}
              >
                <div>
                  <div
                    className={`w-full aspect-video mb-6 overflow-hidden rounded-lg ${
                      charity.is_featured ? "opacity-80" : ""
                    }`}
                  >
                    {charity.image_url ? (
                      <img
                        alt={charity.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={charity.image_url}
                      />
                    ) : (
                      <div className="w-full h-full kinetic-gradient"></div>
                    )}
                  </div>
                  <span
                    className={`font-bold text-[10px] tracking-widest uppercase block mb-2 ${
                      charity.is_featured
                        ? "text-secondary-fixed-dim"
                        : "text-secondary"
                    }`}
                  >
                    {charity.category}
                  </span>
                  <h3 className="font-headline text-2xl font-bold mb-3">
                    {charity.name}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      charity.is_featured ? "text-white/70" : "text-on-surface-variant"
                    }`}
                  >
                    {charity.description}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase">
                    <span>Raised</span>
                    <span>${Number(charity.total_raised || 0).toLocaleString()}</span>
                  </div>
                  <div
                    className={`w-full h-1.5 ${
                      charity.is_featured ? "bg-white/20" : "bg-surface-container-high"
                    }`}
                  >
                    <div
                      className={charity.is_featured ? "h-full bg-white" : "h-full bg-primary"}
                      style={{
                        width: `${Math.min(charity.impact_goal_percent || 0, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase group-hover:text-secondary transition-colors">
                    View Profile
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
