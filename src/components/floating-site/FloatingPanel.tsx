"use client";

import { motion } from "framer-motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import type { LandingPanel } from "@/lib/landing-panels";
import { motionSprings } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useFloatingSite } from "./FloatingSiteProvider";
import { PhotoCard } from "./PhotoCard";

type FloatingPanelProps = {
  panel: LandingPanel;
  isActive: boolean;
  priorityImage?: boolean;
};

const WELCOME_CARDS = [
  {
    src: "/menu/meals/tuesday-pulao.jpg",
    caption: "Pulao",
    className: "z-20 w-[58%] max-w-72",
    tilt: -3,
  },
  {
    src: "/menu/meals/monday-jeera-rice.jpg",
    caption: "Jeera rice",
    className: "absolute top-[8%] right-0 z-10 w-[42%] max-w-44",
    tilt: 5,
  },
  {
    src: "/menu/desserts/gulab-jamun.jpg",
    caption: "Sweet finish",
    className: "absolute bottom-[4%] right-[6%] z-30 w-[38%] max-w-40",
    tilt: -6,
  },
] as const;

/**
 * Image-first panel with animated photo cards on welcome.
 */
export function FloatingPanel({
  panel,
  isActive,
  priorityImage = false,
}: FloatingPanelProps) {
  const { goToId } = useFloatingSite();
  const reducedMotion = useReducedMotion();
  const isWelcome = panel.id === "welcome";

  return (
    <article
      aria-hidden={!isActive}
      className="relative flex h-full min-h-0 w-full flex-col justify-center pb-14"
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-[10%] h-[min(60vw,26rem)] w-[min(60vw,26rem)] rounded-full bg-mint/35 blur-3xl ${
          panel.glow === "end"
            ? "right-[-10%] lg:right-[8%]"
            : "left-[-12%] lg:left-[6%]"
        }`}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div className="order-2 flex max-w-md flex-col lg:order-1">
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionSprings.soft}
            className="text-[0.7rem] font-extrabold tracking-[0.22em] text-olive uppercase"
          >
            {panel.eyebrow}
          </motion.p>
          {isWelcome ? (
            <motion.h1
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...motionSprings.soft, delay: 0.05 }}
              className="mt-2 font-display text-[clamp(2.8rem,10vw,5.5rem)] leading-[0.92] font-extrabold tracking-tight text-forest"
            >
              {panel.title}
            </motion.h1>
          ) : (
            <motion.h2
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...motionSprings.soft, delay: 0.05 }}
              className="mt-2 font-display text-[clamp(2.1rem,7vw,3.75rem)] leading-[1] font-extrabold tracking-tight text-forest"
            >
              {panel.title}
            </motion.h2>
          )}
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...motionSprings.soft, delay: 0.1 }}
            className="mt-3 text-base font-semibold text-ink/70 sm:text-lg"
          >
            {panel.body}
          </motion.p>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...motionSprings.soft, delay: 0.16 }}
            className="mt-6 flex flex-wrap items-center gap-2.5"
          >
            {isWelcome && panel.secondaryCta ? (
              <>
                <Magnetic strength={14}>
                  <motion.button
                    type="button"
                    onClick={() => goToId(panel.secondaryCta!.targetPanel)}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 font-display text-lg font-bold text-pistachio shadow-lg shadow-forest/25"
                    whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                    transition={motionSprings.snappy}
                  >
                    {panel.secondaryCta.label}
                  </motion.button>
                </Magnetic>
                <WhatsAppCta
                  message={panel.primaryCta.message}
                  className="!min-h-12 !px-5 !text-base"
                >
                  {panel.primaryCta.label}
                </WhatsAppCta>
              </>
            ) : (
              <>
                <Magnetic strength={14}>
                  <WhatsAppCta
                    message={panel.primaryCta.message}
                    className="!min-h-12 !px-5 !text-base sm:!text-lg"
                  >
                    {panel.primaryCta.label}
                  </WhatsAppCta>
                </Magnetic>
                {panel.secondaryCta ? (
                  <motion.button
                    type="button"
                    onClick={() => goToId(panel.secondaryCta!.targetPanel)}
                    className="inline-flex min-h-12 items-center rounded-full border border-forest/20 bg-cream/80 px-4 font-display text-base font-bold text-forest hover:bg-white"
                    whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                    transition={motionSprings.snappy}
                  >
                    {panel.secondaryCta.label}
                  </motion.button>
                ) : null}
              </>
            )}
          </motion.div>
        </div>

        <div className="order-1 lg:order-2">
          {isWelcome ? (
            <div className="relative mx-auto aspect-[5/5.2] w-full max-w-lg">
              {WELCOME_CARDS.map((card, index) => (
                <motion.div
                  key={card.src}
                  className={card.className}
                  initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...motionSprings.soft, delay: 0.08 + index * 0.1 }}
                >
                  <PhotoCard
                    src={card.src}
                    alt={card.caption}
                    caption={card.caption}
                    tilt={card.tilt}
                    priority={priorityImage && index === 0}
                    sizes="(max-width: 768px) 60vw, 18rem"
                    className="w-full"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={motionSprings.soft}
            >
              <PhotoCard
                src={panel.image.src}
                alt={panel.image.alt}
                caption={panel.image.caption}
                tilt={panel.imageTilt}
                priority={priorityImage}
                className="mx-auto w-full max-w-md"
                sizes="(max-width: 1024px) 80vw, 28rem"
              />
            </motion.div>
          )}
        </div>
      </div>
    </article>
  );
}
