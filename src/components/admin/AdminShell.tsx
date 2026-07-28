"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useSiteContent } from "@/components/content/ContentProvider";

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/panels", label: "Landing panels" },
  { href: "/admin/menu", label: "Weekly menu" },
  { href: "/admin/plans", label: "Plans" },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { ready, saving, error, reset } = useSiteContent();

  return (
    <div className="min-h-svh bg-cream text-ink">
      <header className="border-b border-forest/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-extrabold tracking-[0.18em] text-olive uppercase">
              Tiffimu control panel
            </p>
            <h1 className="font-display text-2xl font-extrabold text-forest">
              Edit your website
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-full border border-forest/15 bg-cream px-4 font-semibold text-forest hover:bg-white"
            >
              View website
            </Link>
            <button
              type="button"
              disabled={saving || !ready}
              onClick={() => {
                if (
                  window.confirm(
                    "Reset all control-panel edits back to the built-in website content?",
                  )
                ) {
                  void reset();
                }
              }}
              className="inline-flex min-h-11 items-center rounded-full border border-forest/15 px-4 font-semibold text-olive hover:bg-mint/40 disabled:opacity-50"
            >
              Reset to defaults
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <nav
          aria-label="Control panel"
          className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
        >
          {NAV.map((item) => {
            const active =
              "exact" in item && item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                  active
                    ? "bg-forest text-pistachio"
                    : "bg-white/70 text-forest hover:bg-mint/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="min-w-0">
          {!ready ? (
            <p className="rounded-2xl border border-forest/10 bg-white px-4 py-6 text-olive">
              Loading your content…
            </p>
          ) : null}
          {error ? (
            <p
              role="alert"
              className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900"
            >
              {error}
            </p>
          ) : null}
          {ready ? children : null}
        </div>
      </div>
    </div>
  );
}
