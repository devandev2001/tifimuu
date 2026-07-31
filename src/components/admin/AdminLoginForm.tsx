"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950">
        <p className="font-bold">Supabase is not connected yet.</p>
        <p className="mt-2">
          Add your project URL and publishable key to{" "}
          <code className="rounded bg-white/80 px-1.5 py-0.5">.env.local</code>,
          then restart the site. Until then,{" "}
          <a href="/admin" className="font-bold underline">
            open the control panel
          </a>{" "}
          in local-only mode.
        </p>
      </div>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.replace(nextPath.startsWith("/admin") ? nextPath : "/admin");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not sign in.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-forest/10 bg-white p-5 sm:p-6"
    >
      <div>
        <label
          htmlFor="admin-email"
          className="block text-sm font-extrabold text-forest"
        >
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-forest/15 bg-cream/50 px-3 py-2.5 text-ink outline-none focus:border-forest"
        />
      </div>
      <div>
        <label
          htmlFor="admin-password"
          className="block text-sm font-extrabold text-forest"
        >
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-forest/15 bg-cream/50 px-3 py-2.5 text-ink outline-none focus:border-forest"
        />
      </div>
      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-900"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-forest px-4 font-bold text-pistachio hover:bg-forest-deep disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
