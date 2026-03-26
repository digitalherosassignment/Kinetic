import Footer from "@/src/frontend/components/layout/Footer";
import MobileNav from "@/src/frontend/components/layout/MobileNav";
import Navbar from "@/src/frontend/components/layout/Navbar";
import DrawHero from "@/src/frontend/components/draws/DrawHero";
import DrawTiers from "@/src/frontend/components/draws/DrawTiers";
import WinnersSection from "@/src/frontend/components/draws/WinnersSection";
import { createAdminClient } from "@/src/backend/lib/supabase/admin";
import { getAuthenticatedContext } from "@/src/backend/lib/auth";

export default async function DrawsPage() {
  const { user } = await getAuthenticatedContext();
  const admin = createAdminClient();

  const { data: latestDraw } = await admin
    .from("draws")
    .select("*")
    .eq("status", "published")
    .order("draw_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const [latestDrawWinnersResult, recentWinnersResult] = await Promise.all([
    latestDraw
      ? admin
          .from("winners")
          .select("*, profiles(full_name), draws(draw_id)")
          .eq("draw_id", latestDraw.id)
      : Promise.resolve({ data: [] }),
    admin
      .from("winners")
      .select("id, prize_amount, verification_status, profiles(full_name), draws(draw_id)")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return (
    <>
      <Navbar user={!!user} />
      <main className="pt-24 pb-32">
        <DrawHero latestDraw={latestDraw || null} />
        <DrawTiers
          latestDraw={latestDraw || null}
          winners={latestDrawWinnersResult.data || []}
        />
        <WinnersSection winners={recentWinnersResult.data || []} />
      </main>
      <Footer />
      {user ? <MobileNav /> : null}
    </>
  );
}
