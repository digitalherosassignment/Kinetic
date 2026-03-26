import AdminDrawsManager from "@/src/frontend/components/admin/AdminDrawsManager";
import { requireAdmin } from "@/src/backend/lib/auth";

export default async function AdminDrawsPage() {
  const { admin } = await requireAdmin();
  const { data: latestDraw } = await admin
    .from("draws")
    .select("*")
    .order("draw_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div>
      <div className="mb-12">
        <h1 className="font-headline font-black text-4xl tracking-tighter text-primary mb-2">
          DRAW MANAGEMENT
        </h1>
        <p className="text-on-surface-variant">
          Configure, simulate, and publish draw results
        </p>
      </div>

      <AdminDrawsManager latestDraw={latestDraw || null} />
    </div>
  );
}
