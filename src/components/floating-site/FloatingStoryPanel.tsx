"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useSiteContent } from "@/components/content/ContentProvider";
import { Magnetic } from "@/components/motion/Magnetic";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { useFloatingSite } from "@/components/floating-site/FloatingSiteProvider";
import { KITCHEN_AREA, DELIVERY_AREAS } from "@/lib/config";
import { motionSprings } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const STORY_IMAGES = [
  "/menu/meals/sunday-lemon-rice.jpg",
  "/menu/meals/monday-jeera-rice.jpg",
  "/menu/meals/wednesday-sambar-rice.jpg",
  "/menu/meals/saturday-ghee-rice.jpg",
] as const;

/**
 * Our story — full Swati paragraphs with photo cards (nothing missing).
 */
export function FloatingStoryPanel({ isActive }: { isActive: boolean }) {
  const { content } = useSiteContent();
  const { goToId } = useFloatingSite();
  const reducedMotion = useReducedMotion();
  const paragraphs = content.settings.storyParagraphs;
  const kitchen = content.settings.kitchenArea || KITCHEN_AREA;
  const areas =
    content.settings.deliveryAreas.length > 0
      ? content.settings.deliveryAreas
      : [...DELIVERY_AREAS];

  return (
    <article
      aria-hidden={!isActive}
      aria-labelledby="story-heading"
      className="relative flex h-full min-h-0 w-full flex-col overflow-y-auto pb-14"
    >
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionSprings.soft}
          className="mb-5 flex flex-wrap items-end justify-between gap-3"
        >
          <div>
            <p className="text-[0.7rem] font-extrabold tracking-[0.2em] text-olive uppercase">
              Our story
            </p>
            <h2
              id="story-heading"
              className="mt-1 font-display text-[clamp(1.85rem,5vw,3.25rem)] leading-[1.05] font-extrabold text-forest"
            >
              From our kitchen in {kitchen}
            </h2>
          </div>
          <p className="max-w-xs text-sm font-semibold text-olive">
            Delivering to {areas.join(" · ")}
          </p>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:gap-6">
          <div className="grid grid-cols-2 gap-3 self-start">
            {STORY_IMAGES.map((src, index) => (
              <motion.div
                key={src}
                initial={reducedMotion ? false : { opacity: 0, y: 24, rotate: index % 2 ? 3 : -3 }}
                animate={{ opacity: 1, y: 0, rotate: index % 2 ? 2 : -2 }}
                transition={{ ...motionSprings.soft, delay: index * 0.07 }}
                whileHover={reducedMotion ? undefined : { y: -8, rotate: 0 }}
                className={`relative overflow-hidden rounded-[1.35rem] border border-white/70 shadow-lg ${
                  index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 20rem"
                  className="object-cover"
                  priority={isActive && index < 2}
                />
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            {paragraphs.map((paragraph, index) => (
              <motion.section
                key={`story-p-${index}`}
                initial={reducedMotion ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...motionSprings.soft, delay: 0.08 + index * 0.08 }}
                className="rounded-[1.35rem] border border-forest/10 bg-cream/85 p-4 shadow-sm sm:p-5"
              >
                <p className="text-[0.95rem] leading-relaxed font-semibold text-ink/80 sm:text-base">
                  {paragraph}
                </p>
              </motion.section>
            ))}

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...motionSprings.soft, delay: 0.45 }}
              className="flex flex-wrap gap-2.5 pt-1"
            >
              <Magnetic strength={12}>
                <WhatsAppCta
                  message={content.settings.generalInquiryMessage}
                  className="!min-h-12 !px-5 !text-base"
                >
                  Order on WhatsApp
                </WhatsAppCta>
              </Magnetic>
              <button
                type="button"
                onClick={() => goToId("why")}
                className="inline-flex min-h-12 items-center rounded-full border border-forest/20 bg-white/80 px-4 font-display text-base font-bold text-forest"
              >
                Why Tiffimu
              </button>
              <button
                type="button"
                onClick={() => goToId("menu")}
                className="inline-flex min-h-12 items-center rounded-full px-4 font-semibold text-olive hover:text-forest"
              >
                Menu
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </article>
  );
}
