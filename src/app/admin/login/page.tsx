"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/client";
import Spinner from "@/components/ui/Spinner";
import Footer from "@/components/public/Footer";
import { useToast } from "@/components/ui/Toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const res = await apiFetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.success) {
      toast("Welcome back!", "success");
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError(res.error);
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
            <h1 className="font-serif text-2xl font-bold text-charcoal">Admin Login</h1>
            <p className="mt-1 text-sm text-charcoal/60">Sign in to manage Aaharika.</p>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <div>
                <label className="label req">Email</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="label req">Password</label>
                <input
                  type="password"
                  className="input"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading && <Spinner />} Login
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-charcoal/60">
              Don&apos;t have an account?{" "}
              <Link href="/admin/signup" className="font-semibold text-brand hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
