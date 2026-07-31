import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Sign in — Tiffimu control panel",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-cream px-4 py-10 text-ink">
      <div className="w-full max-w-md space-y-5">
        <div>
          <p className="text-xs font-extrabold tracking-[0.18em] text-olive uppercase">
            Tiffimu
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-forest">
            Control panel sign in
          </h1>
          <p className="mt-2 text-sm font-semibold text-olive">
            Use the admin email and password from your Supabase project.
          </p>
        </div>
        <Suspense
          fallback={
            <p className="rounded-2xl border border-forest/10 bg-white px-4 py-6 text-olive">
              Loading sign-in…
            </p>
          }
        >
          <AdminLoginForm />
        </Suspense>
      </div>
    </main>
  );
}
