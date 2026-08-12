"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/client";
import { SkeletonCard } from "@/components/ui/Spinner";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import StarRating from "@/components/ui/StarRating";
import { useToast } from "@/components/ui/Toast";

type PublicTestimonial = {
  TestimonialID: number;
  Name: string;
  Rating: number;
  Feedback: string;
  CreatedAt: string;
};

export default function TestimonialsSection() {
  const [items, setItems] = useState<PublicTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  function load() {
    apiFetch<PublicTestimonial[]>("/api/testimonials").then((res) => {
      if (res.success) setItems(res.data);
      setLoading(false);
    });
  }
  useEffect(load, []);

  return (
    <section id="testimonials" className="section bg-white">
      <div className="container-x">
        <div className="text-center">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real experiences from celebrations we&apos;ve been part of.</p>
        </div>

        <div className="mt-12">
          {loading ? (
            <div className="scroll-row">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-charcoal/60">No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div className="scroll-row">
              {items.map((t) => (
                <article key={t.TestimonialID} className="card w-80 shrink-0 snap-start p-6">
                  <StarRating value={t.Rating} readOnly size={18} />
                  <p className="mt-4 text-sm italic text-charcoal/80">&ldquo;{t.Feedback}&rdquo;</p>
                  <div className="mt-5 flex items-center justify-between border-t border-charcoal/10 pt-4">
                    <span className="font-semibold text-charcoal">{t.Name}</span>
                    <span className="text-xs text-charcoal/50">
                      {new Date(t.CreatedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => setOpen(true)} className="btn-gold">Share Your Experience</button>
        </div>
      </div>

      <ReviewModal open={open} onClose={() => setOpen(false)} onSubmitted={load} />
    </section>
  );
}

const initial = { name: "", email: "", rating: 5, feedback: "" };

function ReviewModal({ open, onClose, onSubmitted }: { open: boolean; onClose: () => void; onSubmitted: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email.";
    if (form.feedback.trim().length < 5) e.feedback = "Feedback must be at least 5 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const res = await apiFetch<{ message: string }>("/api/testimonials", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.success) {
      setDone(true);
      onSubmitted();
      toast("Review submitted!", "success");
    } else toast(res.error, "error");
  }
  function close() {
    setForm(initial);
    setErrors({});
    setDone(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={close} title="Share Your Experience">
      {done ? (
        <div className="py-6 text-center">
          <p className="font-medium text-charcoal">
            Thank you for your review! It will appear once approved by our team.
          </p>
          <button onClick={close} className="btn-primary mt-6">Close</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label className="label req">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="label req">Star Rating</label>
            <StarRating value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
          </div>
          <div>
            <label className="label req">Feedback</label>
            <textarea rows={3} className="input" value={form.feedback} onChange={(e) => setForm((f) => ({ ...f, feedback: e.target.value }))} />
            {errors.feedback && <p className="mt-1 text-xs text-red-600">{errors.feedback}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Spinner />} Submit Review
          </button>
        </form>
      )}
    </Modal>
  );
}
