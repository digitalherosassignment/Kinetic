export default function AdminWinnersPage() {
  const winners = [
    { name: "Marcus Chen", draw: "#KNC-2024-07", tier: 4, prize: "$2,450", proof: true, status: "approved", paid: true },
    { name: "Elena Rodriguez", draw: "#KNC-2024-07", tier: 4, prize: "$2,450", proof: true, status: "approved", paid: true },
    { name: "Sarah Jenkins", draw: "#KNC-2024-07", tier: 3, prize: "$120", proof: true, status: "approved", paid: false },
    { name: "David Okafor", draw: "#KNC-2024-07", tier: 3, prize: "$120", proof: false, status: "pending", paid: false },
  ];

  return (
    <div>
      <div className="mb-12">
        <h1 className="font-headline font-black text-4xl tracking-tighter text-primary mb-2">WINNERS</h1>
        <p className="text-on-surface-variant">Verify submissions and manage payouts</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">Winner</th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">Draw</th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">Tier</th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">Prize</th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">Verification</th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">Payment</th>
              <th className="text-right p-4 text-[10px] font-bold text-outline uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((w, i) => (
              <tr key={i} className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors">
                <td className="p-4 font-bold text-sm">{w.name}</td>
                <td className="p-4 text-sm font-mono text-outline">{w.draw}</td>
                <td className="p-4"><span className="text-[10px] font-bold bg-surface-container-high px-2 py-1 rounded uppercase">Tier {w.tier}</span></td>
                <td className="p-4 font-bold text-sm">{w.prize}</td>
                <td className="p-4">
                  <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${
                    w.status === "approved" ? "text-secondary" : "text-outline"
                  }`}>
                    <span className="material-symbols-outlined text-sm" style={w.status === "approved" ? { fontVariationSettings: "'FILL' 1" } : {}}>
                      {w.status === "approved" ? "verified" : "pending"}
                    </span>
                    {w.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${w.paid ? "text-secondary" : "text-outline"}`}>
                    {w.paid ? "Paid" : "Pending"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex gap-2 justify-end">
                    {w.status === "pending" && (
                      <button className="bg-secondary text-white px-3 py-1 text-[10px] font-bold uppercase rounded hover:bg-secondary-container transition-all">Verify</button>
                    )}
                    {!w.paid && w.status === "approved" && (
                      <button className="bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase rounded hover:bg-secondary transition-all">Mark Paid</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
