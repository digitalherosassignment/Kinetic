import Link from "next/link";

export default function AdminLayout({ children }) {
  const navItems = [
    { href: "/admin", icon: "dashboard", label: "Overview" },
    { href: "/admin/users", icon: "group", label: "Users" },
    { href: "/admin/draws", icon: "casino", label: "Draws" },
    { href: "/admin/charities", icon: "volunteer_activism", label: "Charities" },
    { href: "/admin/winners", icon: "emoji_events", label: "Winners" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 admin-sidebar text-white flex-col p-6">
        <Link href="/" className="font-headline font-black text-2xl tracking-tighter mb-12">KINETIC</Link>
        <span className="text-[10px] text-white/40 uppercase tracking-widest mb-4">Admin Panel</span>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back to App
        </Link>
      </aside>
      {/* Main Content */}
      <main className="flex-1 bg-surface p-6 md:p-12 overflow-auto">{children}</main>
    </div>
  );
}
