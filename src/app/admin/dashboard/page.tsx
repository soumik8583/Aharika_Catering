"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/client";
import Spinner from "@/components/ui/Spinner";

type Stats = {
  counts: {
    menus: number;
    dishes: number;
    newEnquiries: number;
    totalOrders: number;
    pendingOrders: number;
    pendingTestimonials: number;
  };
  recentEnquiries: { ContactID: number; FullName: string; Email: string; Message: string; Status: string; CreatedAt: string }[];
  recentOrders: { OrderID: number; Name: string; Email: string; OrderStatus: string; CreatedAt: string; MenuName: string | null }[];
  recentReviews: { TestimonialID: number; Name: string; Rating: number; Feedback: string; CreatedAt: string }[];
};

const cards = [
  { key: "menus", label: "Total Menus", color: "bg-brand" },
  { key: "dishes", label: "Total Dishes", color: "bg-gold-dark" },
  { key: "newEnquiries", label: "New Enquiries", color: "bg-emerald-600" },
  { key: "totalOrders", label: "Total Orders", color: "bg-blue-600" },
  { key: "pendingOrders", label: "Pending Orders", color: "bg-amber-600" },
  { key: "pendingTestimonials", label: "Pending Reviews", color: "bg-purple-600" },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Stats>("/api/admin/stats").then((res) => {
      if (res.success) setStats(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <AdminShell title="Dashboard">
      {loading ? (
        <div className="flex justify-center py-20 text-brand"><Spinner /></div>
      ) : !stats ? (
        <p className="text-charcoal/60">Could not load dashboard data.</p>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((c) => (
              <div key={c.key} className="rounded-2xl bg-white p-5 shadow-soft">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.color} text-white font-bold`}>
                  {stats.counts[c.key]}
                </div>
                <p className="mt-3 text-sm font-medium text-charcoal/70">{c.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="Recent Enquiries">
              {stats.recentEnquiries.length === 0 ? (
                <Empty text="No enquiries yet." />
              ) : (
                stats.recentEnquiries.map((e) => (
                  <div key={e.ContactID} className="border-b border-slate-100 py-3 last:border-0">
                    <p className="text-sm font-semibold text-charcoal">{e.FullName}</p>
                    <p className="truncate text-xs text-charcoal/60">{e.Message}</p>
                    <span className="text-[11px] text-charcoal/40">{fmt(e.CreatedAt)}</span>
                  </div>
                ))
              )}
            </Panel>

            <Panel title="Recent Orders">
              {stats.recentOrders.length === 0 ? (
                <Empty text="No orders yet." />
              ) : (
                stats.recentOrders.map((o) => (
                  <div key={o.OrderID} className="border-b border-slate-100 py-3 last:border-0">
                    <p className="text-sm font-semibold text-charcoal">{o.Name}</p>
                    <p className="text-xs text-charcoal/60">{o.MenuName || "Custom Menu"} · {o.OrderStatus}</p>
                    <span className="text-[11px] text-charcoal/40">{fmt(o.CreatedAt)}</span>
                  </div>
                ))
              )}
            </Panel>

            <Panel title="Reviews Awaiting Approval">
              {stats.recentReviews.length === 0 ? (
                <Empty text="No pending reviews." />
              ) : (
                stats.recentReviews.map((r) => (
                  <div key={r.TestimonialID} className="border-b border-slate-100 py-3 last:border-0">
                    <p className="text-sm font-semibold text-charcoal">{r.Name} · {"★".repeat(r.Rating)}</p>
                    <p className="truncate text-xs text-charcoal/60">{r.Feedback}</p>
                    <span className="text-[11px] text-charcoal/40">{fmt(r.CreatedAt)}</span>
                  </div>
                ))
              )}
            </Panel>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft">
      <h2 className="mb-2 font-serif text-lg font-bold text-charcoal">{title}</h2>
      {children}
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-charcoal/50">{text}</p>;
}
function fmt(s: string) {
  return new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}
