"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/client";
import Spinner from "@/components/ui/Spinner";
import Footer from "@/components/public/Footer";
import { useToast } from "@/components/ui/Toast";

export default function AdminSignupPage() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email.";
    if (form.contactNumber && !/^[+]?[\d\s-]{7,15}$/.test(form.contactNumber.trim()))
      e.contactNumber = "Enter a valid contact number.";
    if (
      form.password.length < 8 ||
      !/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password) ||
      !/[0-9]/.test(form.password)
    )
      e.password = "Min 8 chars with uppercase, lowercase and a number.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const res = await apiFetch("/api/admin/signup", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.success) {
      toast("Account created! Please log in.", "success");
      router.push("/admin/login");
    } else {
      toast(res.error, "error");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-charcoal">
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center">
            <Link href="/" className="font-serif text-3xl font-bold text-gold">Aaharika</Link>
            <p className="text-sm text-cream/60">Admin Portal</p>
          </div>

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-card">
            <h1 className="font-serif text-2xl font-bold text-charcoal">Admin Signup</h1>
            <p className="mt-1 text-sm text-charcoal/60">Create an administrator account.</p>

            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <div>
                <label className="label req">Name</label>
                <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="label req">Email</label>
                <input type="email" className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className="label">Contact Number</label>
                <input className="input" value={form.contactNumber} onChange={(e) => set("contactNumber", e.target.value)} />
                {errors.contactNumber && <p className="mt-1 text-xs text-red-600">{errors.contactNumber}</p>}
              </div>
              <div>
                <label className="label req">Password</label>
                <input type="password" className="input" value={form.password} onChange={(e) => set("password", e.target.value)} />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>
              <div>
                <label className="label req">Confirm Password</label>
                <input type="password" className="input" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading && <Spinner />} Sign Up
              </button>
              <Link href="/admin/login" className="btn-outline w-full">Back to Login</Link>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
