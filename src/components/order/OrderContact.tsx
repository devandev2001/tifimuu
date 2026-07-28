"use client";

import { useMemo, useState } from "react";
import {
  CONTACT,
  DELIVERY_AREAS,
  KITCHEN_AREA,
  PLAN_TIERS,
  type PlanTierId,
} from "@/lib/config";
import type { MealPreference } from "@/lib/menu";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppCta";
import { InView } from "@/components/motion/InView";
import { Magnetic } from "@/components/motion/Magnetic";
import { TextEffect } from "@/components/motion/TextEffect";

const optionClasses = (selected: boolean) =>
  `min-h-11 rounded-full px-4 text-sm font-extrabold transition-colors duration-(--motion-duration-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime ${
    selected
      ? "bg-lime text-forest-deep"
      : "bg-white/10 text-cream hover:bg-white/15"
  }`;

export function OrderContact() {
  const [name, setName] = useState("");
  const [tier, setTier] = useState<PlanTierId | "">("");
  const [schedule, setSchedule] = useState<"5-day" | "6-day" | "">("");
  const [preference, setPreference] = useState<MealPreference | "either" | "">(
    "",
  );
  const [notes, setNotes] = useState("");

  const draft = useMemo(
    () => ({
      name: name.trim() || undefined,
      tier: tier || undefined,
      schedule: schedule || undefined,
      preference: preference || undefined,
      notes: notes.trim() || undefined,
    }),
    [name, tier, schedule, preference, notes],
  );

  const composedUrl = getWhatsAppOrderUrl(draft);

  return (
    <section
      id="order"
      className="bg-forest-deep py-20 text-cream sm:py-28"
      aria-labelledby="order-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr]">
        <InView>
          <p className="text-sm font-extrabold tracking-[0.18em] text-lime uppercase">
            Order / contact
          </p>
          <TextEffect
            as="h2"
            id="order-heading"
            per="word"
            className="mt-3 font-display text-4xl leading-tight font-extrabold sm:text-5xl"
          >
            Ready when you are.
          </TextEffect>
          <p className="mt-4 max-w-[40ch] text-lg font-semibold text-cream/75">
            The fields here only help write your WhatsApp message — nothing is
            stored on this website.
          </p>
          <dl className="mt-8 space-y-5 text-sm sm:text-base">
            <div>
              <dt className="font-extrabold text-lime">Delivery areas</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {DELIVERY_AREAS.map((area) => (
                  <span
                    key={area}
                    className="rounded-full bg-white/10 px-3.5 py-1.5 font-bold"
                  >
                    {area}
                  </span>
                ))}
              </dd>
              <dd className="mt-2 font-semibold text-cream/70">
                Cooked fresh in our {KITCHEN_AREA} kitchen.
              </dd>
            </div>
            <div>
              <dt className="font-extrabold text-lime">Phone</dt>
              <dd className="mt-1 font-semibold text-cream/80">
                {CONTACT.phone}
              </dd>
            </div>
            <div>
              <dt className="font-extrabold text-lime">Instagram</dt>
              <dd className="mt-1">
                <a
                  href={CONTACT.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-cream/80 underline-offset-4 hover:underline"
                >
                  {CONTACT.instagramHandle}
                </a>
              </dd>
            </div>
          </dl>
        </InView>

        <InView delay={0.1}>
          <form
            className="rounded-4xl border border-lime/20 bg-forest/50 p-6 shadow-xl shadow-black/20 sm:p-8"
            onSubmit={(event) => {
              event.preventDefault();
              window.open(composedUrl, "_blank", "noopener,noreferrer");
            }}
          >
            <div className="grid gap-5">
              <label className="grid gap-2 text-sm font-bold">
                Your name
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="min-h-11 rounded-2xl border border-white/15 bg-forest-deep/60 px-4 text-base font-semibold text-cream outline-none placeholder:text-cream/40 focus-visible:ring-2 focus-visible:ring-lime"
                  placeholder="Optional"
                />
              </label>

              <fieldset className="grid gap-2">
                <legend className="text-sm font-bold">Tier</legend>
                <div className="flex flex-wrap gap-2">
                  {PLAN_TIERS.map((planTier) => (
                    <button
                      key={planTier.id}
                      type="button"
                      aria-pressed={tier === planTier.id}
                      onClick={() => setTier(planTier.id)}
                      className={optionClasses(tier === planTier.id)}
                    >
                      {planTier.title}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="grid gap-2">
                <legend className="text-sm font-bold">Week</legend>
                <div className="flex flex-wrap gap-2">
                  {(["5-day", "6-day"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={schedule === option}
                      onClick={() => setSchedule(option)}
                      className={optionClasses(schedule === option)}
                    >
                      {option === "5-day"
                        ? "5-day (Sun–Thu)"
                        : "6-day (adds Sat)"}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="grid gap-2">
                <legend className="text-sm font-bold">Preference</legend>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["veg", "Veg"],
                      ["non-veg", "Non-veg"],
                      ["either", "Either"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={preference === value}
                      onClick={() => setPreference(value)}
                      className={optionClasses(preference === value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="grid gap-2 text-sm font-bold">
                Notes
                <textarea
                  name="notes"
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="rounded-2xl border border-white/15 bg-forest-deep/60 px-4 py-3 text-base font-semibold text-cream outline-none placeholder:text-cream/40 focus-visible:ring-2 focus-visible:ring-lime"
                  placeholder="Your area, spice level, start date…"
                />
              </label>
            </div>

            <Magnetic className="mt-6 w-full sm:w-auto">
              <button
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-lime px-6 py-3 font-display text-lg font-bold text-forest-deep transition-[background-color,transform] duration-(--motion-duration-fast) ease-(--motion-ease-standard) hover:bg-lime-bright active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime sm:w-auto"
              >
                <WhatsAppIcon />
                Compose &amp; open WhatsApp
              </button>
            </Magnetic>
            <p className="mt-3 text-xs font-semibold text-cream/55">
              Opens WhatsApp with your selections filled in. No account or
              payment on this website.
            </p>
          </form>
        </InView>
      </div>
    </section>
  );
}
