"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard", icon: "dashboard", label: "Home" },
  { href: "/scores", icon: "golf_course", label: "Scores" },
  { href: "/charity", icon: "volunteer_activism", label: "Charity" },
  { href: "/draws", icon: "confirmation_number", label: "Draws" },
  { href: "/profile", icon: "person", label: "Profile" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-surface shadow-lg border-t border-surface-container">
      <div className="flex justify-around items-center py-3 w-full max-w-screen-md mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center transition-all active:scale-90 duration-150 ${
                isActive ? "text-secondary" : "text-slate-400 hover:text-secondary"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {tab.icon}
              </span>
              <span className="font-body text-[10px] font-semibold uppercase tracking-widest mt-1">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
