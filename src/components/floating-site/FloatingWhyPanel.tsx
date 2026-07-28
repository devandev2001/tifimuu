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

const REASON_IMAGES = [
  "/menu/meals/monday-jeera-rice.jpg",
  "/menu/meals/tuesday-pulao.jpg",
  "/menu/meals/wednesday-sambar-rice.jpg",
  "/menu/meals/thursday-tomato-rice.jpg",
  "/menu/meals/sunday-lemon-rice.jpg",
] as const;

/**
 * Why Tiffimu — full Swati copy as selectable photo cards.
 */
export function FloatingWhyPanel({ isActive }: { isActive: boolean }) {
  const { content } = useSiteContent();
  const { goToId } = useFloatingSite();
  const reducedMotion = useReducedMotion();
  const why = content.settings.why;
  const [active, setActive] = useState(0);
  const reason = why.reasons[active] ?? why.reasons[0];
  const image = REASON_IMAGES[active % REASON_IMAGES.length];

  if (!reason) {
    return null;
  }

  return (
    <article
      aria-hidden={!isActive}
      aria-labelledby="why-heading"
      className="relative flex h-full min-h-0 w-full flex-col overflow-y-auto pb-14"
    >
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pt-4 sm:px-6 sm:pt-6 lg:gap-5">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionSprings.soft}
        >
          <p className="text-[0.7rem] font-extrabold tracking-[0.2em] text-olive uppercase">
            {why.eyebrow}
          </p>
          <h2
            id="why-heading"
            className="mt-1 max-w-2xl font-display text-[clamp(1.85rem,5vw,3.25rem)] leading-[1.05] font-extrabold text-forest"
          >
            {why.title}
          </h2>
        </motion.div>

        <div
          role="listbox"
          aria-label="Why Tiffimu reasons"
          className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden"
        >
          {why.reasons.map((entry, index) => {
            const selected = index === active;
            return (
              <motion.button
                key={entry.title}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => setActive(index)}
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...motionSprings.soft, delay: index * 0.05 }}
                whileHover={reducedMotion ? undefined : { y: -4 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                className={`relative w-[7.5rem] shrink-0 overflow-hidden rounded-2xl text-left sm:w-36 ${
                  selected
                    ? "ring-3 ring-forest shadow-lg shadow-forest/20"
                    : "ring-1 ring-white/70"
                }`}
              >
                <span className="relative block aspect-[4/5]">
                  <Image
                    src={REASON_IMAGES[index % REASON_IMAGES.length]}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 bg-linear-to-t from-forest-deep/80 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-2.5 font-display text-xs font-extrabold leading-snug text-cream sm:text-sm">
                    {entry.title}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-6">
          <motion.div
            key={reason.title}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={motionSprings.soft}
            className="relative min-h-[32svh] overflow-hidden rounded-[1.75rem] sm:min-h-[40svh]"
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={isActive}
            />
            <div className="absolute inset-0 bg-linear-to-t from-forest-deep/75 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 font-display text-2xl font-extrabold text-cream sm:text-3xl">
              {reason.title}
            </p>
          </motion.div>

          <motion.div
            key={`${reason.title}-body`}
            initial={reducedMotion ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={motionSprings.soft}
            className="flex flex-col justify-between rounded-[1.75rem] bg-cream/80 p-5 backdrop-blur-sm sm:p-6"
          >
            <p className="text-base leading-relaxed font-semibold text-ink/80 sm:text-lg">
              {reason.body}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Magnetic strength={12}>
                <motion.button
                  type="button"
                  onClick={() => goToId("menu")}
                  className="inline-flex min-h-12 items-center rounded-full bg-forest px-5 font-display text-base font-bold text-pistachio"
                  whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                >
                  See the menu
                </motion.button>
              </Magnetic>
              <WhatsAppCta
                message={content.settings.generalInquiryMessage}
                className="!min-h-12 !px-5 !text-base"
              >
                Order now
              </WhatsAppCta>
            </div>
          </motion.div>
        </div>
      </div>
    </article>
  );
}
