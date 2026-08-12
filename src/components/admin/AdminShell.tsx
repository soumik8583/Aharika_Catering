"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/client";
import Footer from "@/components/public/Footer";

const nav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { label: "Menus", href: "/admin/menus", icon: "M4 6h16M4 12h16M4 18h16" },
  { label: "Dishes", href: "/admin/dishes", icon: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20" },
  { label: "Orders", href: "/admin/orders", icon: "M6 2l1 7h10l1-7M5 9h14l-1 12H6z" },
  { label: "Enquiries", href: "/admin/enquiries", icon: "M4 4h16v12H5.2L4 17.2z" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" },
  { label: "Custom Dish Requests", href: "/admin/custom-dish", icon: "M12 5v14M5 12h14" },
];

export default function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop collapse

  // Restore collapsed preference.
  useEffect(() => {
    const saved = localStorage.getItem("aaharika_admin_sidebar_collapsed");
    if (saved === "1") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("aaharika_admin_sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  }

  async function logout() {
    await apiFetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const asideWidth = collapsed ? "lg:w-20" : "lg:w-64";
  const mainPad = collapsed ? "lg:pl-20" : "lg:pl-64";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 ${asideWidth} transform bg-charcoal text-cream transition-all duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className={`flex h-16 items-center border-b border-white/10 ${collapsed ? "justify-center px-2" : "gap-2 px-6"}`}>
          {collapsed ? (
            <span className="font-serif text-2xl font-bold text-gold">A</span>
          ) : (
            <>
              <span className="font-serif text-xl font-bold text-gold">Aaharika</span>
              <span className="text-[10px] text-cream/60">Admin</span>
            </>
          )}
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                title={collapsed ? n.label : undefined}
                className={`flex items-center rounded-lg py-2.5 text-sm font-medium transition ${
                  collapsed ? "justify-center px-2" : "gap-3 px-3"
                } ${active ? "bg-brand text-white" : "text-cream/75 hover:bg-white/10"}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d={n.icon} />
                </svg>
                {!collapsed && <span className="truncate">{n.label}</span>}
              </Link>
            );
          })}
          <button
            onClick={logout}
            title={collapsed ? "Logout" : undefined}
            className={`mt-4 flex items-center rounded-lg py-2.5 text-sm font-medium text-cream/75 transition hover:bg-red-600 hover:text-white ${
              collapsed ? "justify-center px-2" : "gap-3 px-3"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            {!collapsed && "Logout"}
          </button>
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className={`transition-all duration-300 ${mainPad}`}>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile: open drawer */}
            <button className="rounded-lg p-2 text-charcoal lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Desktop: collapse toggle */}
            <button
              className="hidden rounded-lg p-2 text-charcoal transition hover:bg-slate-100 lg:block"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M9 4v16" />
                {collapsed ? <path d="M13 9l3 3-3 3" /> : <path d="M16 9l-3 3 3 3" />}
              </svg>
            </button>
            <h1 className="font-serif text-xl font-bold text-charcoal">{title}</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-brand hover:underline">
            View Site ↗
          </Link>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
