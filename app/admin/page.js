export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "2,847", icon: "group", trend: "+12%" },
    { label: "Total Prize Pool", value: "$168,420", icon: "paid", trend: "+8%" },
    { label: "Charity Contributions", value: "$84,210", icon: "volunteer_activism", trend: "+15%" },
    { label: "Active Draws", value: "1", icon: "casino", trend: "" },
  ];

  return (
    <div>
      <div className="mb-12">
        <h1 className="font-headline font-black text-4xl tracking-tighter text-primary mb-2">ADMIN OVERVIEW</h1>
        <p className="text-on-surface-variant">Platform analytics and quick actions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-secondary text-2xl">{s.icon}</span>
              {s.trend && <span className="text-[10px] font-bold text-secondary bg-secondary-fixed px-2 py-1 rounded">{s.trend}</span>}
            </div>
            <span className="font-headline font-black text-3xl block mb-1">{s.value}</span>
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-8 rounded-xl">
          <h3 className="font-headline font-bold text-xl mb-6 tracking-tight">Recent Signups</h3>
          {["Alice Wang — Elite", "Ben Okafor — Essential", "Clara Smith — Elite", "Dan Lee — Essential"].map((u, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-outline-variant/10 last:border-0">
              <span className="text-sm">{u}</span>
              <span className="text-[10px] text-outline uppercase tracking-widest">Today</span>
            </div>
          ))}
        </div>
        <div className="bg-primary text-white p-8 rounded-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary/20 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="font-headline font-bold text-xl mb-6">Draw Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                <span className="text-white/60">Current Draw</span><span className="font-bold">#KNC-2024-08</span>
              </div>
              <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                <span className="text-white/60">Status</span><span className="text-secondary-fixed-dim font-bold">PENDING</span>
              </div>
              <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                <span className="text-white/60">Entries</span><span className="font-bold">2,124</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Pool</span><span className="font-bold">$168,420</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
