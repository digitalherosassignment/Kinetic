import { requireAdmin } from "@/src/backend/lib/auth";
import { formatCurrency } from "@/src/backend/lib/utils";

export default async function AdminCharitiesPage() {
  const { admin } = await requireAdmin();
  const { data: charities } = await admin
    .from("charities")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-headline font-black text-4xl tracking-tighter text-primary mb-2">
            CHARITIES
          </h1>
          <p className="text-on-surface-variant">
            Live directory of charities currently available in the platform
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(charities || []).map((charity) => (
          <div
            key={charity.id}
            className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 hover:border-secondary transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                {charity.category}
              </span>
              {charity.is_featured ? (
                <span className="text-[9px] bg-tertiary-fixed-dim text-black px-2 py-0.5 rounded font-bold uppercase">
                  Featured
                </span>
              ) : null}
            </div>
            <h3 className="font-headline font-bold text-xl mb-2">
              {charity.name}
            </h3>
            <p className="text-on-surface-variant text-sm mb-6">
              {charity.description}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-outline">Raised</span>
                <span className="font-bold">
                  {formatCurrency(charity.total_raised)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Impact Metric</span>
                <span className="font-bold">
                  {charity.impact_metric || "Not set"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
