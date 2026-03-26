import { requireAdmin } from "@/src/backend/lib/auth";
import { formatCurrency } from "@/src/backend/lib/utils";

export default async function AdminDashboard() {
  const { admin } = await requireAdmin();

  const [
    usersCountResult,
    drawsResult,
    donationsResult,
    recentProfilesResult,
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin
      .from("draws")
      .select("draw_id, status, total_pool, draw_date")
      .order("draw_date", { ascending: false }),
    admin.from("donations").select("amount"),
    admin
      .from("profiles")
      .select("full_name, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const draws = drawsResult.data || [];
  const totalPrizePool = draws.reduce(
    (sum, draw) => sum + Number(draw.total_pool || 0),
    0
  );
  const totalCharityContributions = (donationsResult.data || []).reduce(
    (sum, donation) => sum + Number(donation.amount || 0),
    0
  );
  const latestDraw = draws[0] || null;

  const stats = [
    {
      label: "Total Users",
      value: String(usersCountResult.count || 0),
      icon: "group",
    },
    {
      label: "Total Prize Pool",
      value: formatCurrency(totalPrizePool),
      icon: "paid",
    },
    {
      label: "Charity Contributions",
      value: formatCurrency(totalCharityContributions),
      icon: "volunteer_activism",
    },
    {
      label: "Published Draws",
      value: String(draws.length),
      icon: "casino",
    },
  ];

  return (
    <div>
      <div className="mb-12">
        <h1 className="font-headline font-black text-4xl tracking-tighter text-primary mb-2">
          ADMIN OVERVIEW
        </h1>
        <p className="text-on-surface-variant">
          Platform analytics and quick actions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-secondary text-2xl">
                {stat.icon}
              </span>
            </div>
            <span className="font-headline font-black text-3xl block mb-1">
              {stat.value}
            </span>
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-8 rounded-xl">
          <h3 className="font-headline font-bold text-xl mb-6 tracking-tight">
            Recent Signups
          </h3>
          {(recentProfilesResult.data || []).length === 0 ? (
            <p className="text-sm text-on-surface-variant">
              No users have signed up yet.
            </p>
          ) : (
            (recentProfilesResult.data || []).map((profile) => (
              <div
                key={`${profile.full_name}-${profile.created_at}`}
                className="flex justify-between items-center py-3 border-b border-outline-variant/10 last:border-0"
              >
                <span className="text-sm">{profile.full_name}</span>
                <span className="text-[10px] text-outline uppercase tracking-widest">
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="bg-primary text-white p-8 rounded-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary/20 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="font-headline font-bold text-xl mb-6">
              Latest Draw
            </h3>
            {latestDraw ? (
              <div className="space-y-4">
                <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                  <span className="text-white/60">Draw ID</span>
                  <span className="font-bold">{latestDraw.draw_id}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                  <span className="text-white/60">Status</span>
                  <span className="text-secondary-fixed-dim font-bold">
                    {latestDraw.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                  <span className="text-white/60">Draw Date</span>
                  <span className="font-bold">
                    {new Date(latestDraw.draw_date).toLocaleDateString("en-US")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Pool</span>
                  <span className="font-bold">
                    {formatCurrency(latestDraw.total_pool)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-white/70">
                No draws published yet. Run a simulation from the Draws tab when
                members are ready.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
