import AdminWinnersTable from "@/src/frontend/components/admin/AdminWinnersTable";
import { requireAdmin } from "@/src/backend/lib/auth";

export default async function AdminWinnersPage() {
  const { admin } = await requireAdmin();
  const { data: winners } = await admin
    .from("winners")
    .select("*, profiles(full_name, email), draws(draw_id, draw_date)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-12">
        <h1 className="font-headline font-black text-4xl tracking-tighter text-primary mb-2">
          WINNERS
        </h1>
        <p className="text-on-surface-variant">
          Review real winner records and manage payouts
        </p>
      </div>

      <AdminWinnersTable winners={winners || []} />
    </div>
  );
}
