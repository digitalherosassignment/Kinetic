import AdminCharityManager from "@/src/frontend/components/admin/AdminCharityManager";
import { requireAdmin } from "@/src/backend/lib/auth";

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
            Add, edit, feature, and remove live charity records
          </p>
        </div>
      </div>

      <AdminCharityManager charities={charities || []} />
    </div>
  );
}
