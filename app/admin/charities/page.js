export default function AdminCharitiesPage() {
  const charities = [
    { name: "Ocean Kinetic", category: "Environment", raised: "$42,000", featured: true },
    { name: "Root Momentum", category: "Environment", raised: "$28,500", featured: false },
    { name: "Alpha Scholar", category: "Education", raised: "$35,200", featured: true },
    { name: "Kinetic Health Fund", category: "Health", raised: "$19,800", featured: false },
    { name: "Global Youth Initiative", category: "Youth", raised: "$51,000", featured: true },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-headline font-black text-4xl tracking-tighter text-primary mb-2">CHARITIES</h1>
          <p className="text-on-surface-variant">Manage charitable organizations and campaigns</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 font-bold text-xs uppercase tracking-widest rounded-md hover:bg-secondary transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span> Add Charity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charities.map((c) => (
          <div key={c.name} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 hover:border-secondary transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{c.category}</span>
              {c.featured && <span className="text-[9px] bg-tertiary-fixed-dim text-black px-2 py-0.5 rounded font-bold uppercase">Featured</span>}
            </div>
            <h3 className="font-headline font-bold text-xl mb-2">{c.name}</h3>
            <p className="text-on-surface-variant text-sm mb-6">Total Raised: <span className="font-bold text-primary">{c.raised}</span></p>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-surface-container-high text-primary font-bold text-[10px] uppercase tracking-widest rounded hover:bg-secondary hover:text-white transition-all">Edit</button>
              <button className="py-2 px-3 bg-surface-container-high text-error font-bold text-[10px] uppercase tracking-widest rounded hover:bg-error hover:text-white transition-all">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
