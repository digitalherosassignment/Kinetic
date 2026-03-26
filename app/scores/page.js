import Footer from "@/src/frontend/components/layout/Footer";
import MobileNav from "@/src/frontend/components/layout/MobileNav";
import Navbar from "@/src/frontend/components/layout/Navbar";
import ScoresClient from "@/src/frontend/components/scores/ScoresClient";
import { requireUser } from "@/src/backend/lib/auth";

export default async function ScoresPage() {
  const { admin, user } = await requireUser();
  const { data: scores } = await admin
    .from("scores")
    .select("*")
    .eq("user_id", user.id)
    .order("played_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <>
      <Navbar user={true} />
      <main className="pt-20 pb-32 px-6 max-w-screen-md mx-auto">
        <section className="mb-12 animate-fade-in-up">
          <h2 className="font-headline font-black text-4xl tracking-tight text-primary mb-2">
            SCORES
          </h2>
          <p className="font-body text-on-surface-variant text-sm tracking-wide uppercase">
            Performance Tracking &amp; History
          </p>
        </section>

        <ScoresClient initialScores={scores || []} />
      </main>

      <Footer />
      <MobileNav />
    </>
  );
}
