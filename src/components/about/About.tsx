import { STORY_PARAGRAPHS, DELIVERY_AREAS, KITCHEN_AREA } from "@/lib/config";
import { CookRevealMascot } from "@/components/about/CookRevealMascot";
import {
  AnimatedGroup,
  AnimatedGroupItem,
  InView,
} from "@/components/motion/InView";
import { TextEffect } from "@/components/motion/TextEffect";

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-mint/60 py-20 sm:py-28"
      aria-labelledby="about-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 size-80 translate-x-1/4 translate-y-1/4 rounded-full bg-pistachio/50 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <InView className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div
            aria-hidden
            className="absolute inset-8 rounded-[45%] bg-pistachio blur-2xl"
          />
          <CookRevealMascot
            className="relative aspect-[864/1024] w-full"
            sizes="(max-width: 1024px) 80vw, 420px"
          />
        </InView>

        <div>
          <p className="text-sm font-extrabold tracking-[0.18em] text-olive uppercase">
            Our story
          </p>
          <TextEffect
            as="h2"
            id="about-heading"
            per="word"
            className="mt-3 font-display text-4xl leading-tight font-extrabold text-forest sm:text-5xl"
          >
            Food that shows up, so cooking doesn't have to.
          </TextEffect>
          <AnimatedGroup className="mt-6 space-y-4" stagger={0.09}>
            {STORY_PARAGRAPHS.map((paragraph) => (
              <AnimatedGroupItem key={paragraph.slice(0, 24)}>
                <p className="text-base leading-relaxed text-ink/85 sm:text-lg">
                  {paragraph}
                </p>
              </AnimatedGroupItem>
            ))}
          </AnimatedGroup>
          <InView delay={0.15}>
            <p className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-2xl bg-cream/80 px-4 py-3 text-sm font-bold text-forest">
              <span>Cooked in {KITCHEN_AREA} · Delivered to</span>
              {DELIVERY_AREAS.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-pistachio px-3 py-1 text-forest-deep"
                >
                  {area}
                </span>
              ))}
            </p>
          </InView>
        </div>
      </div>
    </section>
  );
}
