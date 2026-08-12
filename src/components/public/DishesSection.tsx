"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/client";
import { SkeletonCard } from "@/components/ui/Spinner";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import VegBadge from "@/components/ui/VegBadge";
import { useToast } from "@/components/ui/Toast";
import { DISH_CATEGORIES, type Dish } from "@/lib/types";

export default function DishesSection() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [detail, setDetail] = useState<Dish | null>(null);
  const [customOpen, setCustomOpen] = useState(false);

  useEffect(() => {
    apiFetch<Dish[]>("/api/dishes").then((res) => {
      if (res.success) setDishes(res.data);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => ["All", ...DISH_CATEGORIES], []);
  const filtered = useMemo(
    () => (category === "All" ? dishes : dishes.filter((d) => d.Category === category)),
    [dishes, category]
  );

  return (
    <section id="dishes" className="section bg-cream">
      <div className="container-x">
        <div className="text-center">
          <h2 className="section-title">Dishes We Serve</h2>
          <p className="section-subtitle">
            Explore our authentic dishes across Bengali, Indo-Chinese and Mughlai cuisines.
          </p>
        </div>

        {!loading && dishes.length > 0 && (
          <div className="scroll-row mt-8 justify-start sm:justify-center">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  category === c ? "bg-brand text-white" : "bg-white text-brand ring-1 ring-brand/20 hover:bg-brand/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-charcoal/60">No dishes found in this category.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((d) => (
                <article key={d.DishID} className="card group flex flex-col overflow-hidden">
                  <div className="h-44 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.ImageURL || ""}
                      alt={d.DishName}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold text-charcoal">{d.DishName}</h3>
                      <VegBadge veg={d.IsVegetarian === 1} />
                    </div>
                    {d.SourceOfDish && (
                      <span className="mt-1 w-fit rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-medium text-gold-dark">
                        {d.SourceOfDish}
                      </span>
                    )}
                    <p className="mt-2 line-clamp-2 text-xs text-charcoal/60">
                      {d.MainIngredients}
                    </p>
                    <button
                      onClick={() => setDetail(d)}
                      className="btn-ghost mt-3 w-full justify-center py-1.5 text-xs"
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => setCustomOpen(true)} className="btn-gold">
            Customize Your Dish
          </button>
        </div>
      </div>

      {/* Dish detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.DishName}>
        {detail && (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={detail.ImageURL || ""} alt={detail.DishName} className="h-48 w-full rounded-xl object-cover" />
            <div className="flex items-center gap-2 text-sm">
              <VegBadge veg={detail.IsVegetarian === 1} />
              <span className="font-medium">{detail.IsVegetarian === 1 ? "Vegetarian" : "Non-Vegetarian"}</span>
              <span className="ml-auto rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">{detail.Category}</span>
            </div>
            {detail.Description && <p className="text-sm text-charcoal/75">{detail.Description}</p>}
            <Detail label="Cuisine / Source" value={detail.SourceOfDish} />
            <Detail label="Main Ingredients" value={detail.MainIngredients} />
            <Detail label="Masalas Used" value={detail.MasalasUsed} />
            <p className="text-xs text-charcoal/40">Dish ID: {detail.DishCode}</p>
          </div>
        )}
      </Modal>

      <CustomDishModal open={customOpen} onClose={() => setCustomOpen(false)} />
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <p className="text-sm">
      <span className="font-semibold text-charcoal">{label}:</span>{" "}
      <span className="text-charcoal/70">{value}</span>
    </p>
  );
}

const initial = { name: "", contactNumber: "", email: "", dishDetails: "" };

function CustomDishModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function set(k: keyof typeof initial, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[+]?[\d\s-]{7,15}$/.test(form.contactNumber.trim())) e.contactNumber = "Enter a valid contact number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email.";
    if (form.dishDetails.trim().length < 10) e.dishDetails = "Please describe the dish (min 10 characters).";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const res = await apiFetch<{ message: string }>("/api/custom-dish", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.success) {
      setDone(true);
      toast("Request submitted!", "success");
    } else toast(res.error, "error");
  }
  function close() {
    setForm(initial);
    setErrors({});
    setDone(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={close} title="Customize Your Dish">
      {done ? (
        <div className="py-6 text-center">
          <p className="font-medium text-charcoal">
            Your custom dish request has been received! Our team will contact you soon.
          </p>
          <button onClick={close} className="btn-primary mt-6">Close</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label className="label req">Name</label>
            <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label req">Contact Number</label>
              <input className="input" value={form.contactNumber} onChange={(e) => set("contactNumber", e.target.value)} />
              {errors.contactNumber && <p className="mt-1 text-xs text-red-600">{errors.contactNumber}</p>}
            </div>
            <div>
              <label className="label req">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
          </div>
          <div>
            <label className="label req">Details of the Dish</label>
            <textarea rows={4} className="input" value={form.dishDetails} onChange={(e) => set("dishDetails", e.target.value)} placeholder="Describe the dish you'd like us to prepare..." />
            {errors.dishDetails && <p className="mt-1 text-xs text-red-600">{errors.dishDetails}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Spinner />} Submit Request
          </button>
        </form>
      )}
    </Modal>
  );
}
