import Link from "next/link";
import Navbar from "@/src/frontend/components/layout/Navbar";
import Footer from "@/src/frontend/components/layout/Footer";
import { createAdminClient } from "@/src/backend/lib/supabase/admin";

export default async function HomePage() {
  const admin = createAdminClient();
  const { data: charities } = await admin
    .from("charities")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("total_raised", { ascending: false })
    .limit(3);

  const featuredCharities = charities || [];
  const totalRaised = featuredCharities.reduce(
    (sum, charity) => sum + Number(charity.total_raised || 0),
    0
  );

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[795px] flex items-center overflow-hidden bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 py-24">
            <div className="lg:col-span-7 flex flex-col justify-center animate-fade-in-up">
              <span className="text-secondary font-bold tracking-[0.3em] uppercase text-xs mb-6">
                The New Standard of Play
              </span>
              <h1 className="font-headline font-black text-6xl md:text-8xl text-primary tracking-tighter leading-[0.9] mb-8">
                KINETIC
                <br />
                IMPACT.
              </h1>
              <p className="text-on-surface-variant text-xl md:text-2xl max-w-xl leading-relaxed mb-12">
                Elevate your game into a vehicle for change. Every swing fuels
                global philanthropy in a high-stakes, win-win ecosystem.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/join"
                  className="bg-primary text-on-primary px-10 py-5 font-bold tracking-widest uppercase text-sm hover:bg-secondary transition-all duration-300 rounded-md"
                >
                  Join the Impact
                </Link>
                <Link
                  href="/charity"
                  className="bg-surface-container-highest text-primary px-10 py-5 font-bold tracking-widest uppercase text-sm hover:bg-secondary-fixed transition-all duration-300 rounded-md"
                >
                  View Charities
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 relative animate-fade-in-up-delay">
              <div className="aspect-[4/5] bg-surface-container-highest overflow-hidden shadow-2xl">
                <img
                  className="w-full h-full object-cover grayscale brightness-90 contrast-125"
                  alt="Abstract artistic close-up of a high-end golf club head"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKJi0XuixOmMcyqgYhnGvI7tvlsK2_GR2AHU8jC80xUWncGSDau6eJpihBo7JXZ-JfPZFdmBTDA0N4VPZOVV7j21s_3Z9MFapYitOCqQrxOQjUVsaqqB9DpeMvI7U7ptiidxUF8gCwkb5kJpgGGTWeeM3QgKEO_Y2nlmpgskgr7AXXuBloEQaWlbsDsZOJF-GjnLIkppdRUownB12AolS-awBo9w25J15Jj2U97EhaYjG7M5_-dabgR3JgnuGcZSybRt8tRR0AYNQ"
                />
              </div>
              {/* Overlapping Stat Card */}
              <div className="absolute -bottom-10 -left-10 md:-left-20 bg-primary-container p-8 text-white max-w-[280px] shadow-2xl">
                <span className="text-secondary-fixed-dim font-black text-4xl block mb-2">
                  ${(totalRaised / 1000).toFixed(1)}K+
                </span>
                <p className="font-label text-xs tracking-widest uppercase opacity-70">
                  Raised across the current featured charities
                </p>
              </div>
            </div>
          </div>
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-highest/30 -skew-x-12 transform translate-x-20"></div>
        </section>

        {/* How It Works (Bento) */}
        <section className="py-32 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-20">
              <h2 className="font-headline font-black text-4xl text-primary tracking-tight mb-4 uppercase">
                The Momentum Loop
              </h2>
              <p className="text-on-surface-variant max-w-md">
                Our circular economy of excellence. Play for yourself, win for
                the world.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
              {/* Step 1 */}
              <div className="md:col-span-2 md:row-span-2 bg-surface-container-lowest p-12 flex flex-col justify-between group">
                <div className="space-y-6">
                  <span className="w-12 h-12 bg-primary text-white flex items-center justify-center font-bold text-xl">
                    01
                  </span>
                  <h3 className="font-headline font-bold text-3xl">
                    Subscribe
                  </h3>
                  <p className="text-on-surface-variant text-lg">
                    Access the exclusive Kinetic circuit with a premium
                    membership designed for the altruistic athlete.
                  </p>
                </div>
                <div className="mt-12 overflow-hidden aspect-video bg-surface-container-low">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="Sleek matte black luxury membership card"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsTbT6ki53tT3KGawPdGIu45CyGStZWlhG-T0qtYG5wDESbGyAZNrG0R1pgbEBg-Hz7_MP9KxUmsIfWy8TY4TRmP8p27JO8e1IYx1MO2WgKn2br7ELJR5R1JUQGK0bDI2BBEbhLCZOEsII4diOSpUqZBVv1gXUGhUa8kCBtlqD1pdo5CWxvF3Zid-m4cdF-ZEhmiEqM6U5Bl1gDxZMExbfrfVKCCZWv5vcRJJMHCzO-c56t1oDOA6VGTwUm5EC5G3VccwljTsLt08"
                  />
                </div>
              </div>
              {/* Step 2 */}
              <div className="bg-surface-container-low p-8 flex flex-col justify-between">
                <span className="font-bold text-secondary text-sm tracking-[0.2em] uppercase">
                  02 Score
                </span>
                <h4 className="font-headline font-bold text-xl mt-4">
                  Log Your Excellence
                </h4>
                <p className="text-on-surface-variant text-sm mt-2">
                  Precision tracking for every round played across the globe.
                </p>
              </div>
              {/* Step 3 */}
              <div className="bg-primary text-white p-8 flex flex-col justify-between">
                <span className="font-bold text-secondary-fixed-dim text-sm tracking-[0.2em] uppercase">
                  03 Win
                </span>
                <h4 className="font-headline font-bold text-xl mt-4 text-white">
                  Unlock Rewards
                </h4>
                <p className="text-slate-400 text-sm mt-2">
                  High-performance prizes from partners who share our kinetic
                  vision.
                </p>
              </div>
              {/* Step 4 */}
              <div className="md:col-span-2 bg-secondary p-12 flex items-center justify-between text-white">
                <div className="max-w-[60%]">
                  <span className="font-bold text-white/60 text-sm tracking-[0.2em] uppercase">
                    04 Give
                  </span>
                  <h3 className="font-headline font-bold text-3xl mt-4">
                    Automated Impact
                  </h3>
                  <p className="text-white/80 mt-4">
                    Every success triggers a donation to your selected cause. No
                    extra steps, just pure impact.
                  </p>
                </div>
                <span className="material-symbols-outlined text-7xl opacity-30">
                  volunteer_activism
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Initiatives */}
        <section className="py-32 bg-surface-container-low overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div className="max-w-2xl">
                <h2 className="font-headline font-black text-4xl md:text-5xl text-primary tracking-tight mb-6 uppercase">
                  Featured Initiatives
                </h2>
                <p className="text-on-surface-variant text-lg">
                  Where your momentum makes the most difference. We partner with
                  radical transparency.
                </p>
              </div>
              <Link
                href="/charity"
                className="text-secondary font-bold tracking-widest text-xs uppercase border-b-2 border-secondary pb-1 hover:text-primary hover:border-primary transition-all"
              >
                Explore All Charities
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {featuredCharities.map((charity) => (
                <div key={charity.name} className="flex flex-col gap-6">
                  <div className="aspect-[4/3] bg-white overflow-hidden">
                    {charity.image_url ? (
                      <img
                        className="w-full h-full object-cover"
                        alt={charity.name}
                        src={charity.image_url}
                      />
                    ) : (
                      <div className="w-full h-full kinetic-gradient"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-2xl uppercase mb-2">
                      {charity.name}
                    </h3>
                    <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                      {charity.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold tracking-widest uppercase">
                        <span>Impact Goal</span>
                        <span className="text-secondary">
                          {charity.impact_goal_percent || 0}%
                        </span>
                      </div>
                      <div className="impact-track w-full">
                        <div
                          className="impact-fill"
                          style={{ width: `${charity.impact_goal_percent || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                        {charity.impact_value
                          ? `${charity.impact_value} ${charity.impact_metric || ""}`.trim()
                          : charity.impact_metric || "Live impact updates"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              className="w-full h-full object-cover"
              alt="Abstract carbon fiber texture"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArDxJqgaYM7uRz2LZD5JGoTHmzTRnGe4ViQWT6TjhMg7pps0u8jJMRTBEo8QJzlZH9ZYPmIRb51t5afpKge30GT_GT94B5x9Gv7x1IkpynjxIu84JheDRW3MIrVhChXtCsmRhkV61wQ5rMYvsZAnr2yfw5HTgAGy_3vgQ6d-rukhCUernraAoRKsU9dwndQaT_Q_ni6VYgxt906r5iVXNxi9jnD4VKUeZhSx6XHFWQx5NG_Old7vv0517Ya_5RFnRvLiof6_KcB2U"
            />
          </div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="font-headline font-black text-5xl md:text-7xl mb-8 tracking-tighter leading-none uppercase">
              Ready to shift the needle?
            </h2>
            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Join the elite network of kinetic altruists. Start your
              subscription today and make every move matter.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <Link
                href="/join"
                className="w-full md:w-auto bg-white text-black px-12 py-6 font-black tracking-widest uppercase text-sm hover:bg-secondary-fixed transition-all rounded-md text-center"
              >
                Get Membership
              </Link>
              <Link
                href="#"
                className="text-white font-bold tracking-widest uppercase text-xs border-b border-white/30 pb-1 hover:border-white transition-all"
              >
                Talk to an Ambassador
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
