import Navbar from "@/src/frontend/components/layout/Navbar";
import Footer from "@/src/frontend/components/layout/Footer";
import MobileNav from "@/src/frontend/components/layout/MobileNav";
import CharityHero from "@/src/frontend/components/charity/CharityHero";
import CharityGrid from "@/src/frontend/components/charity/CharityGrid";
import CampaignList from "@/src/frontend/components/charity/CampaignList";
import { getAuthenticatedContext } from "@/src/backend/lib/auth";

export default async function CharityPage() {
  const { user } = await getAuthenticatedContext();

  return (
    <>
      <Navbar user={!!user} />
      <main className="pt-24 pb-32">
        <CharityHero />
        <CharityGrid />
        <CampaignList />
      </main>
      <Footer />
      {user ? <MobileNav /> : null}
    </>
  );
}
