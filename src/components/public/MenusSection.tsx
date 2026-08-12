"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/client";
import { SkeletonCard } from "@/components/ui/Spinner";
import VegBadge from "@/components/ui/VegBadge";
import BookingModal from "./BookingModal";
import type { Menu } from "@/lib/types";

export default function MenusSection() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    apiFetch<Menu[]>("/api/menus").then((res) => {
      if (res.success) setMenus(res.data);
      else setError(res.error);
      setLoading(false);
    });
  }, []);

  return (
    <section id="menus" className="section bg-cream">
      <div className="container-x">
        <div className="text-center">
          <h2 className="section-title">Our Signature Menus</h2>
          <p className="section-subtitle">
            Curated menus for every celebration — book one directly or customize it your way.
          </p>
        </div>

        <div className="mt-12">
          {loading ? (
            <div className="scroll-row">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : menus.length === 0 ? (
            <p className="text-center text-charcoal/60">No menus available yet. Please check back soon.</p>
          ) : (
            <div className="scroll-row">
              {menus.map((m) => (
                <article
                  key={m.MenuID}
                  className="card flex w-80 shrink-0 snap-start flex-col overflow-hidden"
                >
                  <div className="relative h-44">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.ImageURL || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=70"}
                      alt={m.MenuName}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    {m.Category && (
                      <span className="absolute left-3 top-3 rounded-full bg-brand/90 px-3 py-1 text-xs font-medium text-white">
                        {m.Category}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-xl font-bold text-charcoal">{m.MenuName}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-charcoal/70">{m.Description}</p>

                    {m.dishes && m.dishes.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {m.dishes.slice(0, 4).map((d) => (
                          <li key={d.DishID} className="flex items-center gap-2 text-xs text-charcoal/70">
                            <VegBadge veg={d.IsVegetarian === 1} />
                            {d.DishName}
                          </li>
                        ))}
                        {m.dishes.length > 4 && (
                          <li className="text-xs font-medium text-brand">+ {m.dishes.length - 4} more dishes</li>
                        )}
                      </ul>
                    )}

                    <div className="mt-4 border-t border-charcoal/10 pt-3">
                      <p className="font-serif text-2xl font-bold text-brand">
                        ₹{m.Price ?? "—"}
                        <span className="ml-1 text-sm font-normal text-charcoal/60">/ {m.PriceUnit || "Guest"}</span>
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setBooking({ id: m.MenuID, name: m.MenuName })}
                        className="btn-primary flex-1 py-2 text-xs"
                      >
                        Book This Menu
                      </button>
                      <a href="#customize" className="btn-outline flex-1 py-2 text-xs">
                        Customize Menu
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <BookingModal
        open={!!booking}
        onClose={() => setBooking(null)}
        menuId={booking?.id}
        menuName={booking?.name}
      />
    </section>
  );
}
