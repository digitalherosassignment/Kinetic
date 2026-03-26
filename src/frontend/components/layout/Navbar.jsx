"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/scores", label: "Scores" },
  { href: "/charity", label: "Charity" },
  { href: "/draws", label: "Draws" },
];

export default function Navbar({ user }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <span 
            className="material-symbols-outlined text-black cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "close" : "menu"}
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

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-white shadow-lg border-t border-surface-container py-4 flex flex-col gap-4 px-6 animate-fade-in-up">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-label text-sm tracking-widest uppercase transition-colors duration-200 py-2 border-b border-surface-container-low ${
                pathname === link.href
                  ? "text-secondary font-bold"
                  : "text-slate-500 hover:text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
