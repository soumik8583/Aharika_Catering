"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";
import { ORDER_STATUSES, type Order } from "@/lib/types";

type OrderDetail = Order & { items?: { DishID: number; DishName: string; Category: string }[] };

export default function AdminOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    apiFetch<Order[]>(`/api/admin/orders?status=${encodeURIComponent(status)}`).then((res) => {
      if (res.success) setOrders(res.data);
      setLoading(false);
    });
  }
  useEffect(load, [status]);

  async function open(o: Order) {
    const res = await apiFetch<OrderDetail>(`/api/admin/orders/${o.OrderID}`);
    if (res.success) setDetail(res.data);
  }

  async function updateStatus(newStatus: string) {
    if (!detail) return;
    setSaving(true);
    const res = await apiFetch(`/api/admin/orders/${detail.OrderID}`, {
      method: "PUT",
      body: JSON.stringify({ orderStatus: newStatus }),
    });
    setSaving(false);
    if (res.success) {
      toast("Order updated.", "success");
      setDetail({ ...detail, OrderStatus: newStatus });
      load();
    } else toast(res.error, "error");
  }

  return (
    <AdminShell title="Order Management">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["All", ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${status === s ? "bg-brand text-white" : "bg-white text-charcoal/70 ring-1 ring-slate-200"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-soft">
        {loading ? (
          <div className="flex justify-center py-16 text-brand"><Spinner /></div>
        ) : orders.length === 0 ? (
          <p className="py-16 text-center text-charcoal/50">No orders found.</p>
        ) : (
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-charcoal/60">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Menu</th>
                <th className="px-4 py-3">Guests</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.OrderID} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-mono text-xs">#{o.OrderID}</td>
                  <td className="px-4 py-3 font-medium text-charcoal">{o.Name}</td>
                  <td className="px-4 py-3 text-charcoal/70">{o.ContactNumber}</td>
                  <td className="px-4 py-3">{o.MenuName || (o.IsCustom ? "Custom Menu" : "—")}</td>
                  <td className="px-4 py-3">{o.GuestCount ?? "—"}</td>
                  <td className="px-4 py-3"><StatusPill status={o.OrderStatus} /></td>
                  <td className="px-4 py-3 text-xs text-charcoal/50">{fmt(o.CreatedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => open(o)} className="text-brand hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Order #${detail?.OrderID}`} maxWidth="max-w-lg">
        {detail && (
          <div className="space-y-3 text-sm">
            <Row label="Customer" value={detail.Name} />
            <Row label="Contact" value={detail.ContactNumber} />
            <Row label="Email" value={detail.Email} />
            <Row label="Menu" value={detail.MenuName || (detail.IsCustom ? "Custom Menu" : "—")} />
            <Row label="Area of Service" value={detail.AreaOfService || "—"} />
            <Row label="Guests" value={detail.GuestCount != null ? String(detail.GuestCount) : "—"} />
            <Row label="Additional Request" value={detail.AdditionalRequest || "—"} />
            {detail.items && detail.items.length > 0 && (
              <div>
                <p className="font-semibold text-charcoal">Selected Dishes:</p>
                <ul className="mt-1 list-disc pl-5 text-charcoal/70">
                  {detail.items.map((it) => <li key={it.DishID}>{it.DishName} <span className="text-xs text-charcoal/40">({it.Category})</span></li>)}
                </ul>
              </div>
            )}
            <a href={`mailto:${detail.Email}`} className="btn-outline w-full py-2 text-xs">Contact Customer</a>
            <div>
              <label className="label">Update Status</label>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    disabled={saving || detail.OrderStatus === s}
                    onClick={() => updateStatus(s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${detail.OrderStatus === s ? "bg-brand text-white" : "bg-slate-100 text-charcoal/70 hover:bg-slate-200"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p><span className="font-semibold text-charcoal">{label}:</span> <span className="text-charcoal/70">{value}</span></p>
  );
}
function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    New: "bg-blue-100 text-blue-700",
    Contacted: "bg-indigo-100 text-indigo-700",
    Confirmed: "bg-emerald-100 text-emerald-700",
    "In Progress": "bg-amber-100 text-amber-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs ${map[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
}
function fmt(s: string) {
  return new Date(s).toLocaleDateString("en-IN", { dateStyle: "medium" });
}
