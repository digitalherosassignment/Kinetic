export default function CampaignList() {
  const campaigns = [
    { name: "Pure Flow Initiative", cat: "Sustainability", metric: "$128K", metricLabel: "Raised to Date",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUlLU4NKkRueMI92nBJr1hQOaz9zgggkXyjGqMcBP-YC1WyAVPu39XUJa8Qzuj-WK7mhctxWN_0dEeHYyOaopLWpWbOmpSsx1h4btPeiJqnWrzoCvkMuZeNmbRNiqqrVtQtICVJ6-q-EPnfUfd49lCgrfoI95yrStWYk6nVKM0U2c2sBSVR2pKUECrEpWp-_r25mESv4oBGaTKRGu4SxULcEmRPhs4Cyb_YloQXi6ibr0x8nYpe6XgXVdk7q9egFTGzfOyofeROLo",
      desc: "Developing decentralized water filtration systems in arid regions." },
    { name: "The Scholar's Swing", cat: "Education", metric: "942", metricLabel: "Students Funded",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2pGaDLJkZKB03cVspKM5x3EWJsBHS1t0ZIafbvv_YR5Mz3TBVT2RjpWPBc9dCGSnmiPRyfJciWkxJv_inNxXcNOtr4VEQAzizcuRQSUuEFAQ5ssJdSZFmKdEUyuic1guZkloV6hDb_sHZ2eUXDXn6K3RFoYGkO_fN7r52u5CW05wYyC_h2Dlv7jp5pV7jT6BHp3uh5sr4uZ-Jw4NtMvwRLmWwnjusmxDl8MRnLQrp2MDytw4CvtakxITU9No8ynGVp6TVOi2XQg8",
      desc: "Connecting high-achieving student-athletes with academic scholarships." },
  ];

  return (
    <section className="px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h3 className="font-headline text-3xl font-bold tracking-tight">Active Campaigns</h3>
      </div>
      <div className="space-y-1">
        {campaigns.map((c) => (
          <div key={c.name} className="group flex flex-col md:flex-row items-center gap-8 py-10 border-b border-outline-variant/10 hover:bg-surface-container-low px-4 transition-colors">
            <div className="w-full md:w-48 aspect-square overflow-hidden rounded-lg flex-shrink-0">
              <img alt={c.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={c.img} />
            </div>
            <div className="flex-grow">
              <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">{c.cat}</span>
              <h4 className="font-headline text-2xl font-bold mb-2">{c.name}</h4>
              <p className="text-on-surface-variant text-sm max-w-xl leading-relaxed">{c.desc}</p>
            </div>
            <div className="w-full md:w-64 text-right">
              <span className="block text-4xl font-headline font-black text-primary mb-1">{c.metric}</span>
              <span className="block text-[10px] font-bold text-outline tracking-[0.2em] uppercase mb-4">{c.metricLabel}</span>
              <button className="text-xs font-bold tracking-widest uppercase flex items-center gap-2 ml-auto group-hover:text-secondary transition-colors">
                View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
