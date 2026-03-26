import Navbar from "@/src/frontend/components/layout/Navbar";
import Footer from "@/src/frontend/components/layout/Footer";
import MobileNav from "@/src/frontend/components/layout/MobileNav";
import DrawHero from "@/src/frontend/components/draws/DrawHero";
import DrawTiers from "@/src/frontend/components/draws/DrawTiers";
import WinnersSection from "@/src/frontend/components/draws/WinnersSection";

export default function DrawsPage() {
  return (
    <>
      <Navbar user={true} />
      <main className="pt-24 pb-32">
        <DrawHero />
        <DrawTiers />
        <WinnersSection />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
