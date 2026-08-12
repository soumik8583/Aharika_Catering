"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/client";

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  menuId?: number | null;
  menuName?: string;
  customDishIds?: number[];
};

const initial = {
  name: "",
  contactNumber: "",
  email: "",
  areaOfService: "",
  guestCount: "",
  additionalRequest: "",
};

export default function BookingModal({ open, onClose, menuId, menuName, customDishIds }: BookingModalProps) {
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const isCustom = Array.isArray(customDishIds) && customDishIds.length > 0;

  function set(k: keyof typeof initial, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[+]?[\d\s-]{7,15}$/.test(form.contactNumber.trim())) e.contactNumber = "Enter a valid contact number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const res = await apiFetch<{ message: string }>("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        contactNumber: form.contactNumber,
        email: form.email,
        areaOfService: form.areaOfService,
        guestCount: form.guestCount || null,
        additionalRequest: form.additionalRequest,
        menuId: isCustom ? null : menuId,
        dishIds: isCustom ? customDishIds : undefined,
      }),
    });
    setLoading(false);
    if (res.success) {
      setDone(true);
      toast("Booking request received!", "success");
    } else {
      toast(res.error, "error");
    }
  }

  function close() {
    setForm(initial);
    setErrors({});
    setDone(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={close} title={isCustom ? "Book Custom Menu" : `Book: ${menuName ?? "Menu"}`}>
      {done ? (
        <div className="py-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <p className="mt-4 font-medium text-charcoal">
            Thank you! Your booking request has been received. Our team will contact you shortly.
          </p>
          <button onClick={close} className="btn-primary mt-6">Close</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          {isCustom && (
            <p className="rounded-lg bg-gold/10 px-3 py-2 text-sm text-charcoal/80">
              You are booking a custom menu with {customDishIds!.length} selected dish
              {customDishIds!.length > 1 ? "es" : ""}.
            </p>
          )}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Area of Service</label>
              <input className="input" value={form.areaOfService} onChange={(e) => set("areaOfService", e.target.value)} placeholder="e.g. Salt Lake, Kolkata" />
            </div>
            <div>
              <label className="label">Number of Guests</label>
              <input type="number" min={1} className="input" value={form.guestCount} onChange={(e) => set("guestCount", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Any Additional Request</label>
            <textarea rows={3} className="input" value={form.additionalRequest} onChange={(e) => set("additionalRequest", e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Spinner />} Submit Booking Request
          </button>
        </form>
      )}
    </Modal>
  );
}
