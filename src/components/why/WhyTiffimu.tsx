"use client";

import { WHY_TIFFIMU } from "@/lib/config";
import { InteractiveMascot } from "@/components/InteractiveMascot";
import {
  AnimatedGroup,
  AnimatedGroupItem,
  InView,
} from "@/components/motion/InView";
import { TextEffect } from "@/components/motion/TextEffect";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";

export function WhyTiffimu() {
  return (
    <section
      id="why"
      className="relative overflow-hidden bg-lime py-20 sm:py-28"
      aria-labelledby="why-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-lime-bright)_0%,transparent_55%),radial-gradient(ellipse_at_bottom_left,var(--color-mint)_0%,transparent_50%)]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
        <div>
          <Badge
            variant="secondary"
            className="h-auto rounded-full border-forest/10 bg-forest px-3.5 py-1.5 text-[0.7rem] font-extrabold tracking-[0.18em] text-lime uppercase"
          >
            {WHY_TIFFIMU.eyebrow}
          </Badge>
          <TextEffect
            as="h2"
            id="why-heading"
            per="word"
            className="mt-4 font-display text-4xl leading-tight font-extrabold text-forest sm:text-5xl"
          >
            {WHY_TIFFIMU.title}
          </TextEffect>

          <AnimatedGroup className="mt-10 space-y-3" stagger={0.1}>
            {WHY_TIFFIMU.reasons.map((reason, index) => (
              <AnimatedGroupItem key={reason.title}>
                <div className="hover-lift group grid grid-cols-[auto_1fr] items-start gap-4 rounded-3xl border border-forest/10 bg-cream/70 p-5 sm:gap-5 sm:p-6">
                  <span
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-forest font-display text-sm font-extrabold text-lime transition-transform duration-(--motion-duration-fast) group-hover:scale-110 sm:size-12"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-forest sm:text-2xl">
                      {reason.title}
                    </h3>
                    <p className="mt-1.5 max-w-[42ch] text-sm leading-relaxed font-semibold text-ink/75 sm:text-base">
                      {reason.body}
                    </p>
                  </div>
                </div>
              </AnimatedGroupItem>
            ))}
          </AnimatedGroup>
        </div>

        <InView className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <Card className="relative min-h-[22rem] overflow-hidden border-forest/15 bg-forest-deep shadow-xl shadow-forest-deep/20 sm:min-h-[26rem]">
            <Spotlight
              className="-top-24 left-8 from-lime via-mint to-cream"
              size={260}
            />
            <div className="relative z-10 flex h-full min-h-[22rem] flex-col items-center justify-end px-4 pt-8 pb-2 sm:min-h-[26rem]">
              <p className="mb-2 text-center text-xs font-extrabold tracking-[0.16em] text-lime uppercase">
                Tap to say hello
              </p>
              <InteractiveMascot
                variant="tiffin"
                initialEvent="IDLE"
                interactEvent="WELCOME"
                className="h-72 w-44 cursor-pointer sm:h-80 sm:w-52"
              />
            </div>
          </Card>
        </InView>
      </div>
    </section>
  );
}
