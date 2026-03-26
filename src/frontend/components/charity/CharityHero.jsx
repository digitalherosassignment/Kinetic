export default function CharityHero() {
  return (
    <header className="px-6 mb-20 max-w-7xl mx-auto animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8">
          <span className="font-label text-xs tracking-[0.3em] uppercase text-secondary font-bold mb-4 block">
            The Impact Directory
          </span>
          <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-primary mb-8">
            WHERE EVERY <br />SWING MATTERS.
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-xl leading-relaxed">
            Precision meets purpose. Explore our curated directory of global
            initiatives transforming kinetic energy into tangible change.
          </p>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-0 bottom-2 text-outline">search</span>
            <input
              className="w-full bg-transparent border-0 border-b border-outline-variant/40 py-2 pl-8 focus:ring-0 focus:border-secondary transition-all font-body text-sm placeholder:text-outline/60"
              placeholder="Search by cause..."
              type="text"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Youth", "Environment", "Health"].map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${
                  i === 0 ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-secondary hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
