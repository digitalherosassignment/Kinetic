import Footer from "@/src/frontend/components/layout/Footer";
import MobileNav from "@/src/frontend/components/layout/MobileNav";
import Navbar from "@/src/frontend/components/layout/Navbar";
import CharityDirectory from "@/src/frontend/components/charity/CharityDirectory";
import { createAdminClient } from "@/src/backend/lib/supabase/admin";
import { getAuthenticatedContext } from "@/src/backend/lib/auth";

export default async function CharityPage() {
  const { user } = await getAuthenticatedContext();
  const admin = createAdminClient();
  const { data: charities } = await admin
    .from("charities")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("total_raised", { ascending: false });

  return (
    <>
      <Navbar user={!!user} />
      <main className="pt-24 pb-32">
        <CharityDirectory charities={charities || []} />
      </main>
      <Footer />
      {user ? <MobileNav /> : null}
    </>
  );
}
