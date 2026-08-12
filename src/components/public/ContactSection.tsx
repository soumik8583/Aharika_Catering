"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/client";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";

const initial = { fullName: "", contactNumber: "", email: "", message: "" };

export default function ContactSection() {
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
    if (form.fullName.trim().length < 2) e.fullName = "Please enter your name.";
    if (!/^[+]?[\d\s-]{7,15}$/.test(form.contactNumber.trim())) e.contactNumber = "Enter a valid contact number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email.";
    if (form.message.trim().length < 5) e.message = "Message must be at least 5 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const res = await apiFetch<{ message: string }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.success) {
      setDone(true);
      setForm(initial);
      toast("Message sent successfully!", "success");
    } else toast(res.error, "error");
  }

  return (
    <section id="contact" className="section bg-cream">
      <div className="container-x">
        <div className="text-center">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">
            Planning a celebration? Send us a message and our team will get back to you shortly.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <div className="card p-6 sm:p-8">
            {done ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <p className="mt-4 font-medium text-charcoal">
                  Thank you for reaching out! We&apos;ve received your enquiry and will contact you shortly.
                </p>
                <button onClick={() => setDone(false)} className="btn-outline mt-6">Send another message</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4" noValidate>
                <div>
                  <label className="label req">Full Name</label>
                  <input className="input" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
                  {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label req">Contact Number</label>
                    <input className="input" value={form.contactNumber} onChange={(e) => set("contactNumber", e.target.value)} />
                    {errors.contactNumber && <p className="mt-1 text-xs text-red-600">{errors.contactNumber}</p>}
                  </div>
                  <div>
                    <label className="label req">Email ID</label>
                    <input type="email" className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="label req">Message</label>
                  <textarea rows={5} className="input" value={form.message} onChange={(e) => set("message", e.target.value)} />
                  {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading && <Spinner />} Send Message
                </button>
              </form>
            )}
          </div>

          {/* Location */}
          <div className="card overflow-hidden">
            <div className="p-6 sm:p-8">
              <h3 className="font-serif text-xl font-bold text-brand">Visit / Reach Us</h3>
              <p className="mt-2 text-sm text-charcoal/70">Kolkata &amp; surrounding areas, West Bengal, India</p>
              <p className="mt-1 text-sm text-charcoal/70">
                <a className="text-brand hover:underline" href="mailto:soumikmondal723@gmail.com">
                  soumikmondal723@gmail.com
                </a>
              </p>
              <a
                href="https://maps.app.goo.gl/C3Zh5fEdCxueeBsL7"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-4"
              >
                View Location
              </a>
            </div>
            <iframe
              title="Aaharika location map"
              src="https://www.google.com/maps?q=22.6359597,88.4053198&z=16&output=embed"
              className="h-72 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
