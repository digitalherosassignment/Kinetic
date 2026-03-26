import Navbar from "@/src/frontend/components/layout/Navbar";
import Footer from "@/src/frontend/components/layout/Footer";
import MobileNav from "@/src/frontend/components/layout/MobileNav";
import DrawHero from "@/src/frontend/components/draws/DrawHero";
import DrawTiers from "@/src/frontend/components/draws/DrawTiers";
import WinnersSection from "@/src/frontend/components/draws/WinnersSection";
import { getAuthenticatedContext } from "@/src/backend/lib/auth";

export default async function DrawsPage() {
  const { user } = await getAuthenticatedContext();

  return (
    <>
      <Navbar user={!!user} />
      <main className="pt-24 pb-32">
        <DrawHero />
        <DrawTiers />
        <WinnersSection />
      </main>
      <Footer />
      {user ? <MobileNav /> : null}
    </>
  );
}
