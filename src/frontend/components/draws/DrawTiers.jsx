export default function DrawTiers() {
  const tiers = [
    { label: "Tier 1 Elite", icon: "stars", numbers: [14, 22, 31, 45, 50], winners: 0, prize: "Rolled Over", allMatch: true },
    { label: "Tier 2 Premier", icon: "auto_awesome", numbers: [14, 22, 31, 45, null], winners: 12, prize: "$2,450", allMatch: false },
    { label: "Tier 3 Kinetic", icon: "bolt", numbers: [14, 22, 31, null, null], winners: 148, prize: "$120", allMatch: false },
  ];

  return (
    <section className="px-6 mb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-headline text-4xl font-bold tracking-tight">July Results</h2>
            <p className="text-outline mt-2">Drawn July 31, 2024 • Draw ID: #KNC-2024-07</p>
          </div>
          <div className="flex bg-surface-container-low p-1 rounded-lg">
            <button className="px-6 py-2 bg-white text-primary font-bold text-sm rounded shadow-sm">Monthly</button>
            <button className="px-6 py-2 text-outline font-bold text-sm">Quarterly</button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div key={tier.label} className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 group hover:border-secondary transition-all">
              <div className="flex justify-between items-start mb-12">
                <span className="font-label text-xs font-bold tracking-widest text-secondary uppercase">{tier.label}</span>
                <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors">{tier.icon}</span>
              </div>
              <div className="flex gap-3 mb-12 justify-center">
                {tier.numbers.map((n, i) => (
                  <div key={i} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-headline font-bold text-xl ${
                    n ? "border-primary" : "border-outline-variant/30 text-outline-variant"
                  }`}>
                    {n || "?"}
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-outline-variant/20 flex justify-between items-center">
                <div>
                  <span className="block text-xs text-outline uppercase tracking-widest">Winners</span>
                  <span className="text-2xl font-headline font-bold">{tier.winners}</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-outline uppercase tracking-widest">{tier.allMatch ? "Prize Pool" : "Prize Each"}</span>
                  <span className="text-2xl font-headline font-bold text-secondary">{tier.prize}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
