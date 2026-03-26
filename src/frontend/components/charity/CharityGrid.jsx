export default function CharityGrid() {
  return (
    <section className="px-6 mb-24 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Large Featured */}
        <div className="md:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-xl bg-surface-container-low">
          <div className="aspect-[4/5] md:aspect-auto md:h-full relative overflow-hidden">
            <img alt="Youth empowerment" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSWz5QIAYiIIAqMSUHFIMKzcEOeJbN5FDwuv0nZ770ctqDi7vOAnnAPSZ4PkCasXp5I982XgJbzdRcx33PIfQyIl82DRJ2HdpDLsDNEdnIrmF1C_uJDI9lBn5AhMooYVyuPRNhHixv9k4o7kugzB5Cm9Eyn6gUihPwUhBfWIZmPsHC825xJ45IibvRm0ZEtqM9pUzEMyYeEH5iAEBPBm7EpG83pOzPir1SKwR9_99UDr0-AE84FtyRAEin4dM4qe2HrTHfeRiEIxM" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-tertiary-fixed-dim text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">Featured</span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">Youth</span>
              </div>
              <h2 className="font-headline text-4xl text-white font-bold mb-4">The Global Youth Initiative</h2>
              <p className="text-white/80 font-body text-base max-w-md mb-8 leading-relaxed">
                Empowering the next generation through structured mentorship and sports programs.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-white text-[10px] font-bold tracking-widest uppercase"><span>Impact Goal</span><span>84%</span></div>
                <div className="w-full h-1.5 bg-white/20"><div className="h-full impact-meter-gradient w-[84%]"></div></div>
              </div>
            </div>
          </div>
        </div>
        {/* Environment Card */}
        <div className="bg-surface-container-lowest p-8 flex flex-col justify-between group transition-all hover:bg-surface-container-high">
          <div>
            <div className="w-full aspect-video mb-6 overflow-hidden rounded-lg">
              <img alt="Green Fairways" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhpavtmo_NKfAWroOsGrZtCRsZjfpKb4F0hYbVoWslB0SI8MOy_Lzfhbm6k-NOXp-nS6lQAZ94JdvzSMXqIacphB1y7JiPmN5YglFPKxh7IxjTAHxTjK2z-ipT66q03qacuqm7XDv0ueccLR12WiRoajorvNgxOY8Sz-geNPSO6LHC8R1wMoOBnUrlyGfKshc9WcOX2Wv54LJ0-xgvdduHl1nJL5wL-a1oXMLZVjenxO1Jt8AgcRpzcniPGmJ2AAOxGwkDO79iF7E" />
            </div>
            <span className="text-secondary font-bold text-[10px] tracking-widest uppercase block mb-2">Environment</span>
            <h3 className="font-headline text-2xl text-primary font-bold mb-3">Green Fairways Project</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Restoring biodiversity in coastal regions through sustainable land management.</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-on-surface text-[10px] font-bold tracking-widest uppercase"><span>Contribution</span><span>$42,000</span></div>
            <div className="w-full h-1.5 bg-surface-container-high"><div className="h-full bg-primary w-[65%]"></div></div>
          </div>
        </div>
        {/* Health Card */}
        <div className="bg-primary text-on-primary p-8 flex flex-col justify-between">
          <div>
            <div className="w-full aspect-video mb-6 overflow-hidden rounded-lg opacity-80">
              <img alt="Healthcare" className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLRbmB_tVGHZQm9L5vIID--8BjvQmNYxo7P0AKRTF-0-yF9A3_DXLgH6TKXoG3co_sNuQksNLQmiE3YF4GFeO5c8SPGjXUeWWZrUS10aV3meuaEsuj8vcZgL2a5qO6rnJukIXCBkMBNtDyb9dBvzuoy4yDG9xYFobnFLAuo2lTezz3Yyun-W3sXZmdCQ3AxlpwS3nKJbeXleGhgga_0gyJnusCTYKZxwbX4XP7J2qy1H4q4q2prZlPMHTiv6YyXih-ZVd3asAbbJk" />
            </div>
            <span className="text-secondary-fixed-dim font-bold text-[10px] tracking-widest uppercase block mb-2">Health</span>
            <h3 className="font-headline text-2xl text-white font-bold mb-3">Kinetic Health Fund</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">Providing critical orthopedic care for athletes in underserved communities.</p>
          </div>
          <button className="w-full py-4 bg-white text-black font-bold text-xs tracking-widest uppercase transition-transform hover:scale-[1.02] active:scale-95">Support Cause</button>
        </div>
      </div>
    </section>
  );
}
