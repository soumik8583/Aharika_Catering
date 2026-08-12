"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import Spinner from "@/components/ui/Spinner";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";
import { CUSTOM_DISH_STATUSES, type CustomDishRequest } from "@/lib/types";

export default function AdminCustomDishPage() {
  const toast = useToast();
  const [items, setItems] = useState<CustomDishRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [confirm, setConfirm] = useState<CustomDishRequest | null>(null);

  function load() {
    setLoading(true);
    apiFetch<CustomDishRequest[]>(`/api/admin/custom-dish?status=${encodeURIComponent(status)}`).then((res) => {
      if (res.success) setItems(res.data);
      setLoading(false);
    });
  }
  useEffect(load, [status]);

  async function setReqStatus(r: CustomDishRequest, newStatus: string) {
    const res = await apiFetch(`/api/admin/custom-dish/${r.RequestID}`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.success) {
      toast("Request updated.", "success");
      load();
    } else toast(res.error, "error");
  }

  async function remove(r: CustomDishRequest) {
    const res = await apiFetch(`/api/admin/custom-dish/${r.RequestID}`, { method: "DELETE" });
    if (res.success) {
      toast("Request removed.", "success");
      load();
    } else toast(res.error, "error");
    setConfirm(null);
  }

  return (
    <AdminShell title="Custom Dish Requests">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["All", ...CUSTOM_DISH_STATUSES].map((s) => (
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
        ) : items.length === 0 ? (
          <p className="py-16 text-center text-charcoal/50">No custom dish requests.</p>
        ) : (
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-charcoal/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Dish Details</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.RequestID} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-charcoal">{r.Name}</td>
                  <td className="px-4 py-3 text-charcoal/70">{r.ContactNumber}</td>
                  <td className="px-4 py-3 text-charcoal/70">{r.Email}</td>
                  <td className="max-w-[260px] truncate px-4 py-3 text-charcoal/70">{r.DishDetails}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.Status}
                      onChange={(e) => setReqStatus(r, e.target.value)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                    >
                      {CUSTOM_DISH_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal/50">{fmt(r.CreatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <a href={`mailto:${r.Email}`} className="text-brand hover:underline">Email</a>
                      <button onClick={() => setConfirm(r)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={!!confirm}
        message={`Delete request from "${confirm?.Name}"?`}
        confirmLabel="Delete"
        onConfirm={() => confirm && remove(confirm)}
        onCancel={() => setConfirm(null)}
      />
    </AdminShell>
  );
}
function fmt(s: string) {
  return new Date(s).toLocaleDateString("en-IN", { dateStyle: "medium" });
}
