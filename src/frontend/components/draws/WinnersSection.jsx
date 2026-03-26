export default function WinnersSection() {
  const winners = [
    { name: "Marcus Chen", loc: "Vancouver, BC", prize: "$2,450", verified: true, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAP-sEELLkR1Vhz9YiQ7cSpQlZxffSVRdCWQoNklCVHjI-mhE8nOy6bQoyJLIImna5irNg88hKyP0mett21VIy6lQ5MBzWYfSdY-JmaccKa73aJ1PHKHCA-O4dqzjUfeB-Wv5ycN1XJLzWG-KXIKquq4XcqXf-jOzuvSyGWta8B5wnFTqSkqqR879oNK31V8QUJLL93dgKprohK28Ce5JoASVv66Pa-xHoVE6aD-Fa6Y8YU0zQI05yhMeWYpTPsWgIHmAIkwpgySjw" },
    { name: "Elena Rodriguez", loc: "Madrid, ES", prize: "$2,450", verified: true, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1-3-_aaiq_MM8IUJsDNQlijc5gZiO7rjrrCwaG_ocyG71GazFjwigcSG1KJS3eLYxi1HPkGFu3akNlQVV3NIif2yUgy1fOIuRuWLt6HyEhasTgvz4lMV0Y8vEf-4cRS0eCTGyoo5SzH3ld0OLPSK9IrfI2L9tvbMn0pgJFAHwyJIBbyrKD-yP8N1cSI2Pc6-XLuCTe19wlhsdyQh3ODSQRBpo4vB_SvZF9YgipY8Ox9iRu26V-3_F4mKzC8hR_PwXOmHtJF9oQTQ" },
    { name: "Sarah Jenkins", loc: "Austin, TX", prize: "$120", verified: true, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEdX3NZ5-1gcWR7o6ADrTazk0chMiRVH9PlJjAZv6FfFK592gXgVmsuKAy5agAUDYJfB9NgMKFa18uzz-VabdhZ66QP1e8vKByUzM95yhfolyV4dKRxRBc3suNFFoT4oBl10asPkIykCrPmtvxbTKskkDQUeA_9Jos5668f62KN3ljPRsHoiutqGrH-wWwbKjB8HxT-89ZSZXLjzjABcxqYEEyXLbgGjXzAt80AVVUUcUEK_C21SXrtanaL9PGAvS9yiN_EiHAK4w" },
    { name: "David Okafor", loc: "Lagos, NG", prize: "$120", verified: false, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaLVVVuwD9hiUYG5BV5bpD7wCfnAhLbOVcq5wBqvceyvaSUyO2cITMCIVytw2JfZ31mk6mj9f6E-P8tZMUiSUVTjzISvrsFqDiZSXD_BObTCzieXPbh9QJmZx8Qyj13BnTaMWuSf5R9eMtv14YfLO-eNoYBZnwpeYfXkNIauJnJv_jaQLX9WemQhvHxnh_D1mz4_E6Ouu2xYL5PKRcJH56dlIW01t2Wgvy-4Xb4wm_UFWEk1PXah1S9MDFDITBqKWetpEQEuhJsyM" },
  ];

  return (
    <section className="bg-surface-container-low py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="font-label text-xs tracking-[0.3em] uppercase text-secondary mb-2 block">The Impact Circle</span>
          <h2 className="font-headline text-4xl font-black tracking-tighter">OUR RECENT WINNERS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {winners.map((w) => (
            <div key={w.name} className="bg-white p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 grayscale hover:grayscale-0 transition-all">
                <img alt={w.name} src={w.img} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-headline font-bold text-lg">{w.name}</h3>
              <p className="text-xs text-outline uppercase tracking-widest mb-4">{w.loc}</p>
              <div className="bg-surface-container py-2 px-4 mb-6 rounded-sm">
                <span className="font-headline font-black text-secondary">{w.prize} WINNER</span>
              </div>
              <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                w.verified ? "text-secondary border border-secondary/20" : "text-outline border border-outline-variant/40"
              }`}>
                <span className="material-symbols-outlined text-sm" style={w.verified ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {w.verified ? "verified" : "pending"}
                </span>
                {w.verified ? "Verified" : "Pending"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
