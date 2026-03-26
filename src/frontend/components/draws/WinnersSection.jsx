export default function WinnersSection({ winners = [] }) {
  return (
    <section className="bg-surface-container-low py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="font-label text-xs tracking-[0.3em] uppercase text-secondary mb-2 block">
            The Impact Circle
          </span>
          <h2 className="font-headline text-4xl font-black tracking-tighter">
            OUR RECENT WINNERS
          </h2>
        </div>

        {winners.length === 0 ? (
          <div className="bg-white p-8 text-sm text-on-surface-variant rounded-xl">
            No winners have been published yet. Once a draw is published, the
            latest approved and pending winners will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {winners.map((winner) => (
              <div
                key={winner.id}
                className="bg-white p-6 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-outline">
                    person
                  </span>
                </div>
                <h3 className="font-headline font-bold text-lg">
                  {winner.profiles?.full_name || "Unknown Winner"}
                </h3>
                <p className="text-xs text-outline uppercase tracking-widest mb-4">
                  {winner.draws?.draw_id || "Published Draw"}
                </p>
                <div className="bg-surface-container py-2 px-4 mb-6 rounded-sm">
                  <span className="font-headline font-black text-secondary">
                    ${Number(winner.prize_amount || 0).toFixed(2)} WINNER
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    winner.verification_status === "approved"
                      ? "text-secondary border border-secondary/20"
                      : "text-outline border border-outline-variant/40"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    style={
                      winner.verification_status === "approved"
                        ? { fontVariationSettings: "'FILL' 1" }
                        : {}
                    }
                  >
                    {winner.verification_status === "approved"
                      ? "verified"
                      : "pending"}
                  </span>
                  {winner.verification_status === "approved" ? "Verified" : "Pending"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
