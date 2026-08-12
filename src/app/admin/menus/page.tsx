"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";
import type { Dish, Menu } from "@/lib/types";

type MenuRow = Menu & { DishCount: number };

const empty = {
  menuName: "",
  description: "",
  price: "",
  priceUnit: "Per Guest",
  imageURL: "",
  category: "",
  isActive: true,
  dishIds: [] as number[],
};

export default function AdminMenusPage() {
  const toast = useToast();
  const [menus, setMenus] = useState<MenuRow[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<MenuRow | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<MenuRow | null>(null);

  function load() {
    setLoading(true);
    Promise.all([
      apiFetch<MenuRow[]>("/api/admin/menus"),
      apiFetch<Dish[]>("/api/admin/dishes"),
    ]).then(([m, d]) => {
      if (m.success) setMenus(m.data);
      if (d.success) setDishes(d.data.filter((x) => x.IsActive === 1));
      setLoading(false);
    });
  }
  useEffect(load, []);

  function openAdd() {
    setEditing(null);
    setForm(empty);
    setModal(true);
  }
  async function openEdit(m: MenuRow) {
    const res = await apiFetch<Menu & { dishes: Dish[] }>(`/api/admin/menus/${m.MenuID}`);
    setEditing(m);
    setForm({
      menuName: m.MenuName,
      description: m.Description || "",
      price: m.Price != null ? String(m.Price) : "",
      priceUnit: m.PriceUnit || "Per Guest",
      imageURL: m.ImageURL || "",
      category: m.Category || "",
      isActive: m.IsActive === 1,
      dishIds: res.success ? res.data.dishes.map((d) => d.DishID) : [],
    });
    setModal(true);
  }

  function toggleDish(id: number) {
    setForm((f) => ({
      ...f,
      dishIds: f.dishIds.includes(id) ? f.dishIds.filter((x) => x !== id) : [...f.dishIds, id],
    }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (form.menuName.trim().length < 2) {
      toast("Menu name is required.", "error");
      return;
    }
    setSaving(true);
    const payload = { ...form, price: form.price ? Number(form.price) : null };
    const url = editing ? `/api/admin/menus/${editing.MenuID}` : "/api/admin/menus";
    const res = await apiFetch(url, {
      method: editing ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.success) {
      toast(editing ? "Menu updated." : "Menu created.", "success");
      setModal(false);
      load();
    } else toast(res.error, "error");
  }

  async function remove(m: MenuRow) {
    const res = await apiFetch(`/api/admin/menus/${m.MenuID}`, { method: "DELETE" });
    if (res.success) {
      toast("Menu deactivated.", "success");
      load();
    } else toast(res.error, "error");
    setConfirm(null);
  }

  return (
    <AdminShell title="Menu Management">
      <div className="mb-4 flex justify-end">
        <button onClick={openAdd} className="btn-primary">+ Add Menu</button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-soft">
        {loading ? (
          <div className="flex justify-center py-16 text-brand"><Spinner /></div>
        ) : menus.length === 0 ? (
          <p className="py-16 text-center text-charcoal/50">No menus yet.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-charcoal/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Dishes</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((m) => (
                <tr key={m.MenuID} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-charcoal">{m.MenuName}</td>
                  <td className="px-4 py-3 text-charcoal/70">{m.Category || "—"}</td>
                  <td className="px-4 py-3">₹{m.Price ?? "—"} / {m.PriceUnit}</td>
                  <td className="px-4 py-3">{m.DishCount}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${m.IsActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                      {m.IsActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(m)} className="text-brand hover:underline">Edit</button>
                      {m.IsActive === 1 && (
                        <button onClick={() => setConfirm(m)} className="text-red-600 hover:underline">Deactivate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Menu" : "Add Menu"} maxWidth="max-w-2xl">
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label req">Menu Name</label>
              <input className="input" value={form.menuName} onChange={(e) => setForm((f) => ({ ...f, menuName: e.target.value }))} />
            </div>
            <div>
              <label className="label">Category</label>
              <input className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Bengali / Mughlai / Mixed" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={2} className="input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Price (₹)</label>
              <input type="number" className="input" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            </div>
            <div>
              <label className="label">Price Unit</label>
              <input className="input" value={form.priceUnit} onChange={(e) => setForm((f) => ({ ...f, priceUnit: e.target.value }))} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                Active
              </label>
            </div>
          </div>
          <div>
            <label className="label">Image URL</label>
            <input className="input" value={form.imageURL} onChange={(e) => setForm((f) => ({ ...f, imageURL: e.target.value }))} />
          </div>

          <div>
            <label className="label">Dishes in this Menu ({form.dishIds.length})</label>
            <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200 p-3">
              {dishes.length === 0 ? (
                <p className="text-sm text-charcoal/50">No active dishes available.</p>
              ) : (
                <div className="grid gap-1 sm:grid-cols-2">
                  {dishes.map((d) => (
                    <label key={d.DishID} className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-slate-50">
                      <input type="checkbox" checked={form.dishIds.includes(d.DishID)} onChange={() => toggleDish(d.DishID)} />
                      {d.DishName} <span className="text-xs text-charcoal/40">({d.Category})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving && <Spinner />} {editing ? "Update Menu" : "Create Menu"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        message={`Deactivate "${confirm?.MenuName}"? It will no longer appear publicly.`}
        confirmLabel="Deactivate"
        onConfirm={() => confirm && remove(confirm)}
        onCancel={() => setConfirm(null)}
      />
    </AdminShell>
  );
}
