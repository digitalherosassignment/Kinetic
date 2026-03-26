import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white w-full py-20 px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/">
            <span className="font-headline font-black text-3xl text-white uppercase tracking-tighter">
              KINETIC
            </span>
          </Link>
          <p className="font-body text-xs tracking-widest uppercase text-slate-400">
            © 2024 KINETIC ALTRUIST. ALL RIGHTS RESERVED.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <Link
            href="#"
            className="font-body text-xs tracking-widest uppercase text-slate-400 hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100"
          >
            Impact Report
          </Link>
          <Link
            href="#"
            className="font-body text-xs tracking-widest uppercase text-slate-400 hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100"
          >
            Partners
          </Link>
          <Link
            href="#"
            className="font-body text-xs tracking-widest uppercase text-slate-400 hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="font-body text-xs tracking-widest uppercase text-slate-400 hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100"
          >
            Terms
          </Link>
        </div>
        <div className="flex gap-6">
          <span className="material-symbols-outlined text-white/50 hover:text-white cursor-pointer transition-colors">
            public
          </span>
          <span className="material-symbols-outlined text-white/50 hover:text-white cursor-pointer transition-colors">
            mail
          </span>
          <span className="material-symbols-outlined text-white/50 hover:text-white cursor-pointer transition-colors">
            podcasts
          </span>
        </div>
      </div>
    </footer>
  );
}
