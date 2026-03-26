export default function DrawHero() {
  return (
    <section className="px-6 mb-20">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-xl bg-primary text-on-primary p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="relative z-10 max-w-2xl">
            <span className="font-label text-xs tracking-[0.3em] uppercase text-secondary-fixed-dim mb-4 block">
              Jackpot Rollover Announcement
            </span>
            <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
              STILL UP <br />FOR GRABS.
            </h1>
            <p className="text-on-primary-container text-lg max-w-md mb-8">
              No 5-number match in the July cycle. The altruism pool has rolled
              over, increasing the kinetic impact for our partners.
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-secondary text-white px-8 py-4 rounded-md font-bold tracking-tight hover:bg-secondary-container transition-colors duration-200">
                ENTER NEXT DRAW
              </button>
              <span className="text-sm font-label tracking-widest text-outline-variant">
                EST. $420,000 NEXT DRAW
              </span>
            </div>
          </div>
          <div className="relative w-full md:w-1/3 aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-secondary/20 blur-[100px] rounded-full"></div>
            <div className="relative bg-surface-container-lowest/5 backdrop-blur-xl border border-white/10 p-10 rounded-full w-full h-full flex flex-col items-center justify-center text-center">
              <span className="font-headline text-6xl font-black text-white">$42k</span>
              <span className="font-label text-[10px] tracking-[0.4em] text-secondary-fixed-dim mt-2 uppercase">
                Charity Bonus Added
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
