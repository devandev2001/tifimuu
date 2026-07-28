"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSiteContent } from "@/components/content/ContentProvider";
import { Magnetic } from "@/components/motion/Magnetic";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { useFloatingSite } from "@/components/floating-site/FloatingSiteProvider";
import { motionSprings } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const PLAN_IMAGES = [
  "/menu/meals/monday-jeera-rice.jpg",
  "/menu/meals/tuesday-pulao.jpg",
  "/menu/meals/saturday-ghee-rice.jpg",
] as const;

/**
 * Visual plan picker — tap a tier, then order on WhatsApp.
 */
export function FloatingPlansPanel({ isActive }: { isActive: boolean }) {
  const { content } = useSiteContent();
  const { goToId } = useFloatingSite();
  const reducedMotion = useReducedMotion();
  const featured =
    content.plans.find((plan) => plan.featured)?.id ?? content.plans[0]?.id;
  const [selectedId, setSelectedId] = useState(featured ?? "");

  const selected =
    content.plans.find((plan) => plan.id === selectedId) ?? content.plans[0];

  if (!selected) {
    return (
      <article
        aria-hidden={!isActive}
        className="flex h-full items-center justify-center"
      >
        <p className="text-olive">No plans yet.</p>
      </article>
    );
  }

  const message = [
    `Hello Tiffimu! I'd like the ${selected.title} plan.`,
    "",
    "Schedule: — (5-day or 6-day)",
    "Preference: — (veg / non-veg)",
    `Area: — (${content.settings.deliveryAreas.join(" / ")})`,
    "",
    "Please help me get started. Thank you!",
  ].join("\n");

  return (
    <article
      aria-hidden={!isActive}
      aria-labelledby="floating-plans-heading"
      className="relative flex h-full min-h-0 w-full flex-col pb-14"
    >
      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col gap-4 px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="flex items-end justify-between gap-3">
          <h2
            id="floating-plans-heading"
            className="font-display text-2xl font-extrabold text-forest sm:text-3xl lg:text-4xl"
          >
            Plans
          </h2>
          <p className="text-sm font-semibold text-olive">
            Tap a plan · prices on WhatsApp
          </p>
        </div>

        <div
          role="listbox"
          aria-label="Choose a plan"
          className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
        >
          {content.plans.map((plan, index) => {
            const active = plan.id === selected.id;
            const image = PLAN_IMAGES[index % PLAN_IMAGES.length];
            return (
              <motion.button
                key={plan.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => setSelectedId(plan.id)}
                initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...motionSprings.soft, delay: index * 0.08 }}
                whileHover={reducedMotion ? undefined : { y: -6 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                className={`relative min-h-[28svh] overflow-hidden rounded-[1.75rem] text-left transition-[box-shadow,ring] sm:min-h-0 ${
                  active
                    ? "ring-3 ring-forest shadow-xl shadow-forest/20"
                    : "ring-1 ring-forest/10 hover:ring-forest/30"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-forest-deep/85 via-forest-deep/25 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  {plan.featured ? (
                    <span className="mb-2 inline-block rounded-full bg-lime px-2.5 py-0.5 text-[0.65rem] font-extrabold tracking-wide text-forest-deep uppercase">
                      Popular
                    </span>
                  ) : null}
                  <p className="font-display text-2xl font-extrabold text-cream sm:text-3xl">
                    {plan.title}
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-lime">
                    {plan.price}{" "}
                    <span className="text-sm font-semibold text-cream/80">
                      KWD / week
                    </span>
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Magnetic strength={12}>
            <WhatsAppCta message={message} className="!min-h-12 !px-5 !text-base">
              Order {selected.title}
            </WhatsAppCta>
          </Magnetic>
          <button
            type="button"
            onClick={() => goToId("menu")}
            className="inline-flex min-h-12 items-center rounded-full border border-forest/20 bg-cream/80 px-4 font-display text-base font-bold text-forest hover:bg-white"
          >
            Back to menu
          </button>
          <button
            type="button"
            onClick={() => goToId("order")}
            className="inline-flex min-h-12 items-center rounded-full px-4 font-semibold text-olive hover:text-forest"
          >
            Contact
          </button>
        </div>
      </div>
    </article>
  );
}
