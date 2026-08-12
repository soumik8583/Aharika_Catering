"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import VegBadge from "@/components/ui/VegBadge";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";
import { DISH_CATEGORIES, type Dish } from "@/lib/types";

const empty = {
  dishName: "",
  mainIngredients: "",
  sourceOfDish: "",
  isVegetarian: true,
  masalasUsed: "",
  imageURL: "",
  category: "Main Course",
  description: "",
  price: "",
  isActive: true,
};

export default function AdminDishesPage() {
  const toast = useToast();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Dish | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<Dish | null>(null);

  function load() {
    setLoading(true);
    apiFetch<Dish[]>("/api/admin/dishes").then((res) => {
      if (res.success) setDishes(res.data);
      setLoading(false);
    });
  }
  useEffect(load, []);

  function openAdd() {
    setEditing(null);
    setForm(empty);
    setModal(true);
  }
  function openEdit(d: Dish) {
    setEditing(d);
    setForm({
      dishName: d.DishName,
      mainIngredients: d.MainIngredients || "",
      sourceOfDish: d.SourceOfDish || "",
      isVegetarian: d.IsVegetarian === 1,
      masalasUsed: d.MasalasUsed || "",
      imageURL: d.ImageURL || "",
      category: d.Category || "Main Course",
      description: d.Description || "",
      price: d.Price != null ? String(d.Price) : "",
      isActive: d.IsActive === 1,
    });
    setModal(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (form.dishName.trim().length < 2) {
      toast("Dish name is required.", "error");
      return;
    }
    setSaving(true);
    const url = editing ? `/api/admin/dishes/${editing.DishID}` : "/api/admin/dishes";
    const res = await apiFetch(url, {
      method: editing ? "PUT" : "POST",
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.success) {
      toast(editing ? "Dish updated." : "Dish added.", "success");
      setModal(false);
      load();
    } else toast(res.error, "error");
  }

  async function remove(d: Dish) {
    const res = await apiFetch(`/api/admin/dishes/${d.DishID}`, { method: "DELETE" });
    if (res.success) {
      toast("Dish deactivated.", "success");
      load();
    } else toast(res.error, "error");
    setConfirm(null);
  }

  const filtered = dishes.filter((d) =>
    d.DishName.toLowerCase().includes(search.toLowerCase()) ||
    d.DishCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell title="Dish Management">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          className="input max-w-xs"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={openAdd} className="btn-primary">+ Add Dish</button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-soft">
        {loading ? (
          <div className="flex justify-center py-16 text-brand"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-charcoal/50">No dishes found.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-charcoal/60">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.DishID} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-mono text-xs text-charcoal/60">{d.DishCode}</td>
                  <td className="px-4 py-3 font-medium text-charcoal">{d.DishName}</td>
                  <td className="px-4 py-3 text-charcoal/70">{d.Category}</td>
                  <td className="px-4 py-3 text-charcoal/70">{d.Price != null ? `₹${d.Price}` : "—"}</td>
                  <td className="px-4 py-3"><VegBadge veg={d.IsVegetarian === 1} /></td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${d.IsActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                      {d.IsActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(d)} className="text-brand hover:underline">Edit</button>
                      {d.IsActive === 1 && (
                        <button onClick={() => setConfirm(d)} className="text-red-600 hover:underline">Deactivate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Dish" : "Add Dish"} maxWidth="max-w-2xl">
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label req">Dish Name</label>
              <input className="input" value={form.dishName} onChange={(e) => setForm((f) => ({ ...f, dishName: e.target.value }))} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {DISH_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Main Ingredients</label>
            <input className="input" value={form.mainIngredients} onChange={(e) => setForm((f) => ({ ...f, mainIngredients: e.target.value }))} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Source / Cuisine</label>
              <input className="input" value={form.sourceOfDish} onChange={(e) => setForm((f) => ({ ...f, sourceOfDish: e.target.value }))} />
            </div>
            <div>
              <label className="label">Masalas Used</label>
              <input className="input" value={form.masalasUsed} onChange={(e) => setForm((f) => ({ ...f, masalasUsed: e.target.value }))} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Price (₹)</label>
              <input type="number" min={0} step="1" className="input" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="Optional — e.g. 250" />
            </div>
            <div>
              <label className="label">Image URL</label>
              <input className="input" value={form.imageURL} onChange={(e) => setForm((f) => ({ ...f, imageURL: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={2} className="input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isVegetarian} onChange={(e) => setForm((f) => ({ ...f, isVegetarian: e.target.checked }))} />
              Vegetarian
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
              Active
            </label>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving && <Spinner />} {editing ? "Update Dish" : "Add Dish"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        message={`Deactivate "${confirm?.DishName}"? It will no longer appear on the public site.`}
        confirmLabel="Deactivate"
        onConfirm={() => confirm && remove(confirm)}
        onCancel={() => setConfirm(null)}
      />
    </AdminShell>
  );
}
