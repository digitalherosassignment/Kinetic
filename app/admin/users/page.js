export default function AdminUsersPage() {
  const users = [
    { name: "Marcus Chen", email: "marcus@kinetic.app", plan: "Elite", status: "Active", scores: 5 },
    { name: "Elena Rodriguez", email: "elena@email.com", plan: "Elite", status: "Active", scores: 5 },
    { name: "Sarah Jenkins", email: "sarah@email.com", plan: "Essential", status: "Active", scores: 3 },
    { name: "David Okafor", email: "david@email.com", plan: "Elite", status: "Active", scores: 5 },
    { name: "Alice Wang", email: "alice@email.com", plan: "Essential", status: "Inactive", scores: 2 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-headline font-black text-4xl tracking-tighter text-primary mb-2">USER MANAGEMENT</h1>
          <p className="text-on-surface-variant">View and manage all platform users</p>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
          <input className="bg-surface-container-low rounded-lg pl-10 pr-4 py-2 text-sm border-0 focus:ring-2 focus:ring-secondary" placeholder="Search users..." />
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">User</th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">Plan</th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">Status</th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">Scores</th>
              <th className="text-right p-4 text-[10px] font-bold text-outline uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors">
                <td className="p-4">
                  <div className="font-bold text-sm">{u.name}</div>
                  <div className="text-xs text-outline">{u.email}</div>
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${u.plan === "Elite" ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"}`}>
                    {u.plan}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`flex items-center gap-1 text-xs font-bold ${u.status === "Active" ? "text-secondary" : "text-outline"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-secondary" : "bg-outline"}`}></span>
                    {u.status}
                  </span>
                </td>
                <td className="p-4 font-bold text-sm">{u.scores}/5</td>
                <td className="p-4 text-right">
                  <button className="text-secondary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
