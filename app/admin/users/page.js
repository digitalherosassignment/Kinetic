import { requireAdmin } from "@/src/backend/lib/auth";

function getLatestSubscriptionByUser(subscriptions = []) {
  const map = new Map();

  for (const subscription of subscriptions) {
    if (!map.has(subscription.user_id)) {
      map.set(subscription.user_id, subscription);
    }
  }

  return map;
}

function getScoreCounts(scores = []) {
  return scores.reduce((map, score) => {
    map.set(score.user_id, (map.get(score.user_id) || 0) + 1);
    return map;
  }, new Map());
}

export default async function AdminUsersPage() {
  const { admin } = await requireAdmin();

  const [profilesResult, subscriptionsResult, scoresResult] = await Promise.all([
    admin.from("profiles").select("*").order("created_at", { ascending: false }),
    admin
      .from("subscriptions")
      .select("user_id, plan, status, renewal_date, created_at")
      .order("created_at", { ascending: false }),
    admin.from("scores").select("user_id"),
  ]);

  const subscriptionsByUser = getLatestSubscriptionByUser(
    subscriptionsResult.data || []
  );
  const scoreCounts = getScoreCounts(scoresResult.data || []);
  const users = (profilesResult.data || []).map((profile) => {
    const subscription = subscriptionsByUser.get(profile.id);
    return {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      plan: subscription?.plan || "none",
      status:
        subscription?.status === "active" &&
        new Date(subscription.renewal_date).getTime() >= Date.now()
          ? "Active"
          : "Inactive",
      scores: Math.min(scoreCounts.get(profile.id) || 0, 5),
    };
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-headline font-black text-4xl tracking-tighter text-primary mb-2">
            USER MANAGEMENT
          </h1>
          <p className="text-on-surface-variant">
            Live view of all user profiles and subscription status
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                User
              </th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                Plan
              </th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                Status
              </th>
              <th className="text-left p-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                Scores
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-sm text-on-surface-variant"
                >
                  No users found yet.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors"
                >
                  <td className="p-4">
                    <div className="font-bold text-sm">{user.name}</div>
                    <div className="text-xs text-outline">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                        user.plan === "elite"
                          ? "bg-primary text-white"
                          : user.plan === "essential"
                            ? "bg-surface-container-high text-on-surface-variant"
                            : "bg-surface-container text-outline"
                      }`}
                    >
                      {user.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`flex items-center gap-1 text-xs font-bold ${
                        user.status === "Active" ? "text-secondary" : "text-outline"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "Active" ? "bg-secondary" : "bg-outline"
                        }`}
                      ></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-sm">{user.scores}/5</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
