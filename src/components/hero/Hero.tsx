"use client";

import { GENERAL_INQUIRY_MESSAGE, SITE } from "@/lib/config";
import { AnimatedFoodHero } from "@/components/hero/AnimatedFoodHero";
import { Magnetic } from "@/components/motion/Magnetic";
import { TextEffect } from "@/components/motion/TextEffect";
import { WhatsAppCta } from "@/components/WhatsAppCta";

/**
 * Brand-first full-bleed hero: name, tagline, one line, CTAs, dominant food.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-5.5rem)] flex-col overflow-hidden bg-lime"
    >
      <div aria-hidden className="hero-atmosphere pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="splash-grain pointer-events-none absolute inset-0 opacity-25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-32 size-[min(70vw,28rem)] rounded-full bg-cream/40 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:py-8">
        <div className="relative z-10 max-w-xl">
          <TextEffect
            as="p"
            per="char"
            delay={0.05}
            className="font-display text-sm font-extrabold tracking-[0.28em] text-olive uppercase sm:text-base"
          >
            {SITE.name}
          </TextEffect>
          <TextEffect
            as="h1"
            per="word"
            delay={0.18}
            className="mt-3 font-display text-[clamp(2.75rem,7vw,4.5rem)] leading-[0.92] font-extrabold tracking-tight text-forest"
          >
            {SITE.tagline}
          </TextEffect>
          <TextEffect
            as="p"
            per="word"
            delay={0.42}
            className="mt-5 max-w-[36ch] text-base leading-relaxed font-semibold text-forest/78 sm:text-lg"
          >
            Fresh home-style meals from our Mangaf kitchen — delivered across Mina Abdulla, Fahaheel, and Ahmadi.
          </TextEffect>
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Magnetic>
              <WhatsAppCta message={GENERAL_INQUIRY_MESSAGE}>
                Order on WhatsApp
              </WhatsAppCta>
            </Magnetic>
            <a
              href="#why"
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-forest px-6 py-3 font-display text-lg font-bold text-forest transition-[background-color,color,transform] duration-(--motion-duration-fast) ease-(--motion-ease-standard) hover:bg-forest hover:text-lime active:scale-95"
            >
              Why Tiffimu
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[min(100%,26rem)] lg:max-w-none lg:justify-self-end">
          <AnimatedFoodHero priority />
        </div>
      </div>
    </section>
  );
}
