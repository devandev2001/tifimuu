"use client";

import Link from "next/link";
import { useSiteContent } from "@/components/content/ContentProvider";

const LINKS = [
  {
    href: "/admin/settings",
    title: "Settings",
    body: "Brand name, WhatsApp number, contact details, delivery areas, and story text.",
  },
  {
    href: "/admin/panels",
    title: "Landing panels",
    body: "The floating homepage slides — titles, images, buttons, and short notes.",
  },
  {
    href: "/admin/menu",
    title: "Weekly menu",
    body: "Each day’s dishes, dessert, and meal photos.",
  },
  {
    href: "/admin/plans",
    title: "Plans",
    body: "Budget, Executive, and Premium prices and descriptions.",
  },
] as const;

export default function AdminOverviewPage() {
  const { content, ready } = useSiteContent();

  if (!ready) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-forest/10 bg-white p-5 sm:p-6">
        <h2 className="font-display text-2xl font-extrabold text-forest">
          Welcome to your control panel
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-olive sm:text-base">
          Change website text and details here. Saves stay on this computer for
          now. When you add a backend later, we can plug these same screens into
          your real database — no redesign needed.
        </p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-mint/40 px-4 py-3">
            <dt className="text-xs font-extrabold tracking-wide text-olive uppercase">
              Brand
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-forest">
              {content.settings.site.name}
            </dd>
          </div>
          <div className="rounded-xl bg-mint/40 px-4 py-3">
            <dt className="text-xs font-extrabold tracking-wide text-olive uppercase">
              Panels
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-forest">
              {content.panels.length}
            </dd>
          </div>
          <div className="rounded-xl bg-mint/40 px-4 py-3">
            <dt className="text-xs font-extrabold tracking-wide text-olive uppercase">
              Last saved
            </dt>
            <dd className="mt-1 text-sm font-semibold text-forest">
              {new Date(content.updatedAt).toLocaleString()}
            </dd>
          </div>
        </dl>
        <p className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong className="font-bold">Note:</strong> there is no password yet.
          Add login when you connect the backend so only you can edit.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl border border-forest/10 bg-white p-5 transition-colors hover:border-forest/25 hover:bg-mint/20"
          >
            <h3 className="font-display text-xl font-extrabold text-forest">
              {link.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-olive">{link.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
