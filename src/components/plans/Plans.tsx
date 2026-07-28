"use client";

import { motion } from "framer-motion";
import { PLAN_TIERS } from "@/lib/config";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";
import { BorderTrail } from "@/components/motion/BorderTrail";
import { InView } from "@/components/motion/InView";
import { Magnetic } from "@/components/motion/Magnetic";
import { TextEffect } from "@/components/motion/TextEffect";
import { Tilt } from "@/components/motion/Tilt";
import { WhatsAppIcon } from "@/components/WhatsAppCta";
import { motionSprings } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function Plans() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="plans"
      className="relative overflow-hidden bg-mint/40 py-20 sm:py-28"
      aria-labelledby="plans-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 size-[22rem] -translate-x-1/3 translate-y-1/4 rounded-full bg-lime/50 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-extrabold tracking-[0.18em] text-olive uppercase">
            Plans
          </p>
          <TextEffect
            as="h2"
            id="plans-heading"
            per="word"
            className="mt-3 font-display text-4xl leading-tight font-extrabold text-forest sm:text-5xl"
          >
            Priced fairly — whatever fits you.
          </TextEffect>
          <InView>
            <p className="mt-4 text-lg font-semibold text-ink/75">
              Budget, Executive, or Premium — every tier gets the same fresh
              kitchen and daily dessert. Choose a 5-day week (Sunday–Thursday) or
              add Saturday for a 6-day week. Friday is always off.
            </p>
          </InView>
        </div>

        <div className="mt-14 grid items-stretch gap-5 md:grid-cols-3 md:gap-4 lg:gap-6">
          {PLAN_TIERS.map((tier, index) => {
            const featured = tier.featured;

            return (
              <InView
                key={tier.id}
                delay={index * 0.08}
                className={`h-full ${featured ? "md:-mt-4 md:mb-0" : ""}`}
              >
                <Tilt className="h-full" maxTilt={featured ? 5 : 7}>
                  <BorderTrail
                    className={`h-full rounded-[2rem] ${featured ? "md:scale-[1.03]" : ""}`}
                    trailClassName={featured ? "bg-lime-bright" : "bg-pistachio"}
                  >
                    <article
                      className={`relative flex h-full flex-col overflow-hidden rounded-[1.85rem] border-2 p-7 transition-shadow duration-(--motion-duration-fast) ${
                        featured
                          ? "border-forest bg-forest text-cream shadow-2xl shadow-forest/30"
                          : "border-forest/15 bg-white text-ink"
                      }`}
                    >
                      {featured ? (
                        <p className="mb-4 inline-flex self-start rounded-full bg-lime px-3.5 py-1 text-xs font-extrabold tracking-wide text-forest-deep uppercase">
                          Most popular
                        </p>
                      ) : (
                        <p className="mb-4 h-6" aria-hidden />
                      )}
                      <h3 className="font-display text-3xl font-extrabold">
                        {tier.title}
                      </h3>
                      <p
                        className={`mt-2 text-sm font-semibold sm:text-base ${
                          featured ? "text-cream/80" : "text-ink/70"
                        }`}
                      >
                        {tier.blurb}
                      </p>
                      <p className="mt-6 flex items-baseline gap-2">
                        <span className="font-display text-5xl font-extrabold tracking-tight">
                          {tier.price}
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            featured ? "text-lime" : "text-olive"
                          }`}
                        >
                          KWD / week
                        </span>
                      </p>
                      <ul className="mt-6 space-y-2.5 text-sm font-semibold sm:text-base">
                        {tier.points.map((point) => (
                          <li key={point} className="flex gap-2.5">
                            <span
                              aria-hidden
                              className={
                                featured ? "text-lime" : "text-olive"
                              }
                            >
                              ✓
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-8">
                        <Magnetic strength={18} className="w-full">
                          <motion.a
                            href={getWhatsAppOrderUrl({ tier: tier.id })}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Order ${tier.title} on WhatsApp`}
                            whileTap={
                              reducedMotion ? undefined : { scale: 0.96 }
                            }
                            transition={motionSprings.snappy}
                            className={`inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full px-6 py-3 font-display text-lg font-bold ${
                              featured
                                ? "bg-lime text-forest-deep hover:bg-lime-bright"
                                : "bg-forest text-pistachio hover:bg-forest-deep"
                            }`}
                          >
                            <WhatsAppIcon />
                            Order {tier.title}
                          </motion.a>
                        </Magnetic>
                      </div>
                    </article>
                  </BorderTrail>
                </Tilt>
              </InView>
            );
          })}
        </div>

        <InView className="mt-10 text-center text-sm font-semibold text-ink/60">
          <p>
            Prices shown are placeholders — final KWD prices will be confirmed
            on WhatsApp.
          </p>
          <a
            href="#order"
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-forest px-5 py-2.5 font-bold text-pistachio hover:bg-forest-deep"
          >
            Or compose your order ↓
          </a>
        </InView>
      </div>
    </section>
  );
}
