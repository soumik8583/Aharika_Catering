"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/client";
import { SkeletonCard } from "@/components/ui/Spinner";
import VegBadge from "@/components/ui/VegBadge";
import BookingModal from "./BookingModal";
import { DISH_CATEGORIES, type Dish } from "@/lib/types";

export default function CustomizeMenuSection() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>("All");
  const [selected, setSelected] = useState<Dish[]>([]);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!open || dishes.length > 0) return;
    apiFetch<Dish[]>("/api/dishes").then((res) => {
      if (res.success) setDishes(res.data);
      setLoading(false);
    });
  }, [open, dishes.length]);

  const categories = useMemo(() => ["All", ...DISH_CATEGORIES], []);
  const filtered = useMemo(
    () => (category === "All" ? dishes : dishes.filter((d) => d.Category === category)),
    [dishes, category]
  );
  const selectedIds = new Set(selected.map((d) => d.DishID));

  function toggle(d: Dish) {
    setSelected((s) =>
      s.some((x) => x.DishID === d.DishID) ? s.filter((x) => x.DishID !== d.DishID) : [...s, d]
    );
  }

  return (
    <section id="customize" className="section bg-white">
      <div className="container-x text-center">
        <h2 className="section-title">Customize Your Menu</h2>
        <p className="section-subtitle">
          Build a menu that&apos;s perfectly yours — pick your favourite dishes and request a quote.
        </p>

        {!open && (
          <button onClick={() => setOpen(true)} className="btn-gold mt-8">
            Create Your Own Menu
          </button>
        )}
      </div>

      {open && (
        <div className="container-x mt-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Dish picker */}
            <div>
              <div className="scroll-row mb-6 !pb-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      category === c ? "bg-brand text-white" : "bg-brand/10 text-brand hover:bg-brand/20"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-charcoal/60">No dishes in this category.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((d) => {
                    const isSel = selectedIds.has(d.DishID);
                    return (
                      <div key={d.DishID} className="card flex flex-col overflow-hidden">
                        <div className="h-32">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={d.ImageURL || ""} alt={d.DishName} loading="lazy" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col p-3">
                          <div className="flex items-center gap-2">
                            <VegBadge veg={d.IsVegetarian === 1} />
                            <h4 className="text-sm font-semibold text-charcoal">{d.DishName}</h4>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-charcoal/60">{d.Description}</p>
                          <button
                            onClick={() => toggle(d)}
                            className={`mt-3 rounded-full py-1.5 text-xs font-semibold transition ${
                              isSel ? "bg-emerald-600 text-white" : "bg-brand text-white hover:bg-brand-dark"
                            }`}
                          >
                            {isSel ? "✓ Added" : "Add"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected panel */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="card p-5">
                <h3 className="font-serif text-lg font-bold text-brand">
                  Your Menu ({selected.length})
                </h3>
                {selected.length === 0 ? (
                  <p className="mt-3 text-sm text-charcoal/60">
                    No dishes selected yet. Add dishes to build your custom menu.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {selected.map((d) => (
                      <li key={d.DishID} className="flex items-center justify-between gap-2 rounded-lg bg-cream px-3 py-2">
                        <span className="flex items-center gap-2 text-sm text-charcoal">
                          <VegBadge veg={d.IsVegetarian === 1} />
                          {d.DishName}
                        </span>
                        <button onClick={() => toggle(d)} aria-label="Remove" className="text-red-500 hover:text-red-700">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => setBooking(true)}
                  disabled={selected.length === 0}
                  className="btn-primary mt-5 w-full"
                >
                  Request Quote / Book Custom Menu
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}

      <BookingModal
        open={booking}
        onClose={() => setBooking(false)}
        customDishIds={selected.map((d) => d.DishID)}
      />
    </section>
  );
}
