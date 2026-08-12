"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import Spinner from "@/components/ui/Spinner";
import StarRating from "@/components/ui/StarRating";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";
import { TESTIMONIAL_STATUSES, type Testimonial } from "@/lib/types";

export default function AdminTestimonialsPage() {
  const toast = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Pending");
  const [confirm, setConfirm] = useState<Testimonial | null>(null);

  function load() {
    setLoading(true);
    apiFetch<Testimonial[]>(`/api/admin/testimonials?status=${encodeURIComponent(status)}`).then((res) => {
      if (res.success) setItems(res.data);
      setLoading(false);
    });
  }
  useEffect(load, [status]);

  async function setReviewStatus(t: Testimonial, newStatus: string) {
    const res = await apiFetch(`/api/admin/testimonials/${t.TestimonialID}`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.success) {
      toast(`Review ${newStatus.toLowerCase()}.`, "success");
      load();
    } else toast(res.error, "error");
  }

  async function remove(t: Testimonial) {
    const res = await apiFetch(`/api/admin/testimonials/${t.TestimonialID}`, { method: "DELETE" });
    if (res.success) {
      toast("Review removed.", "success");
      load();
    } else toast(res.error, "error");
    setConfirm(null);
  }

  return (
    <AdminShell title="Testimonial Management">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["All", ...TESTIMONIAL_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${status === s ? "bg-brand text-white" : "bg-white text-charcoal/70 ring-1 ring-slate-200"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-brand"><Spinner /></div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-charcoal/50">No reviews found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <div key={t.TestimonialID} className="rounded-2xl bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <StarRating value={t.Rating} readOnly size={16} />
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{t.Status}</span>
              </div>
              <p className="mt-3 text-sm italic text-charcoal/80">&ldquo;{t.Feedback}&rdquo;</p>
              <p className="mt-3 text-sm font-semibold text-charcoal">{t.Name}</p>
              {t.Email && <p className="text-xs text-charcoal/50">{t.Email}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {t.Status !== "Approved" && (
                  <button onClick={() => setReviewStatus(t, "Approved")} className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">Approve</button>
                )}
                {t.Status !== "Rejected" && (
                  <button onClick={() => setReviewStatus(t, "Rejected")} className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700">Reject</button>
                )}
                <button onClick={() => setConfirm(t)} className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        message={`Delete review from "${confirm?.Name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => confirm && remove(confirm)}
        onCancel={() => setConfirm(null)}
      />
    </AdminShell>
  );
}
