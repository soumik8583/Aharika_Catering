"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";
import { CONTACT_STATUSES, type ContactEnquiry } from "@/lib/types";

export default function AdminEnquiriesPage() {
  const toast = useToast();
  const [items, setItems] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [detail, setDetail] = useState<ContactEnquiry | null>(null);
  const [confirm, setConfirm] = useState<ContactEnquiry | null>(null);
  const [notes, setNotes] = useState("");

  function load() {
    setLoading(true);
    apiFetch<ContactEnquiry[]>(`/api/admin/contact?status=${encodeURIComponent(status)}`).then((res) => {
      if (res.success) setItems(res.data);
      setLoading(false);
    });
  }
  useEffect(load, [status]);

  async function update(newStatus?: string, newNotes?: string) {
    if (!detail) return;
    const res = await apiFetch(`/api/admin/contact/${detail.ContactID}`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus, notes: newNotes }),
    });
    if (res.success) {
      toast("Enquiry updated.", "success");
      load();
      if (newStatus) setDetail({ ...detail, Status: newStatus });
    } else toast(res.error, "error");
  }

  async function remove(c: ContactEnquiry) {
    const res = await apiFetch(`/api/admin/contact/${c.ContactID}`, { method: "DELETE" });
    if (res.success) {
      toast("Enquiry removed.", "success");
      load();
    } else toast(res.error, "error");
    setConfirm(null);
  }

  return (
    <AdminShell title="Contact Enquiries">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["All", ...CONTACT_STATUSES].map((s) => (
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
          <p className="py-16 text-center text-charcoal/50">No enquiries found.</p>
        ) : (
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-charcoal/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.ContactID} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-charcoal">{c.FullName}</td>
                  <td className="px-4 py-3 text-charcoal/70">{c.ContactNumber}</td>
                  <td className="px-4 py-3 text-charcoal/70">{c.Email}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-charcoal/70">{c.Message}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{c.Status}</span></td>
                  <td className="px-4 py-3 text-xs text-charcoal/50">{fmt(c.CreatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setDetail(c); setNotes(c.Notes || ""); }} className="text-brand hover:underline">View</button>
                      <button onClick={() => setConfirm(c)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Enquiry Details">
        {detail && (
          <div className="space-y-3 text-sm">
            <p><b>Name:</b> {detail.FullName}</p>
            <p><b>Contact:</b> {detail.ContactNumber}</p>
            <p><b>Email:</b> {detail.Email}</p>
            <p><b>Message:</b> {detail.Message}</p>
            <div>
              <label className="label">Status</label>
              <div className="flex flex-wrap gap-2">
                {CONTACT_STATUSES.map((s) => (
                  <button key={s} onClick={() => update(s)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${detail.Status === s ? "bg-brand text-white" : "bg-slate-100 text-charcoal/70 hover:bg-slate-200"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Internal Notes</label>
              <textarea rows={2} className="input" value={notes} onChange={(e) => setNotes(e.target.value)} />
              <button onClick={() => update(undefined, notes)} className="btn-outline mt-2 py-1.5 text-xs">Save Notes</button>
            </div>
            <a href={`mailto:${detail.Email}`} className="btn-primary w-full py-2 text-xs">Reply via Email</a>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        message={`Delete enquiry from "${confirm?.FullName}"? This cannot be undone.`}
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
