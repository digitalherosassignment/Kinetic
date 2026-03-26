"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/scores", label: "Scores" },
  { href: "/charity", label: "Charity" },
  { href: "/draws", label: "Draws" },
];

export default function Navbar({ user }) {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-black cursor-pointer hover:opacity-70 transition-opacity">
            menu
          </span>
          <Link href="/">
            <span className="font-headline font-black tracking-tighter text-xl text-black uppercase">
              KINETIC
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-label text-xs tracking-widest uppercase transition-colors duration-200 ${
                pathname === link.href
                  ? "text-secondary font-bold"
                  : "text-slate-500 hover:text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden scale-95 active:opacity-80 transition-transform cursor-pointer flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant">
                  person
                </span>
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-primary text-on-primary px-6 py-2.5 font-bold tracking-widest uppercase text-xs hover:bg-secondary transition-all duration-300 rounded-md"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
