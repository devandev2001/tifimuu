"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BorderTrail } from "@/components/motion/BorderTrail";
import { InView } from "@/components/motion/InView";
import { TextEffect } from "@/components/motion/TextEffect";
import {
  ACTIVE_DAYS,
  getKuwaitMenuDayId,
  type MealPreference,
} from "@/lib/menu";
import { motionSprings } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type MenuPreference = MealPreference | "both";

function DayCard({
  day,
  preference,
  isToday,
}: {
  day: (typeof ACTIVE_DAYS)[number];
  preference: MenuPreference;
  isToday: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const reducedMotion = useReducedMotion();

  const dishes = useMemo(() => {
    const items = [...day.staples];
    if (day.vegOption && day.nonVegOption) {
      const preferenceOptions =
        preference === "both"
          ? [day.vegOption, day.nonVegOption]
          : [preference === "veg" ? day.vegOption : day.nonVegOption];
      items.splice(1, 0, ...preferenceOptions);
    } else if (day.vegOption) {
      items.splice(1, 0, day.vegOption);
    }
    return items;
  }, [day, preference]);

  return (
    <BorderTrail
      className={`rounded-[1.75rem] ${isToday ? "today-special-pulse" : ""}`}
      trailClassName="bg-lime"
    >
      <motion.div
        className="[perspective:1200px]"
        whileHover={reducedMotion ? undefined : { y: -6 }}
        transition={motionSprings.snappy}
      >
        <button
          type="button"
          aria-pressed={flipped}
          aria-label={`${day.label} menu${isToday ? ", today's special" : ""}. ${flipped ? "Showing dessert" : "Showing meal"}. Activate to flip.`}
          onClick={() => setFlipped((value) => !value)}
          className="group relative block h-[22rem] w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
        >
          <div
            className={`relative h-full w-full transition-transform duration-(--motion-duration-slow) ease-(--motion-ease-emphasized) [transform-style:preserve-3d] motion-reduce:transition-none ${
              flipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            <div
              className={`absolute inset-0 flex flex-col overflow-hidden rounded-[1.6rem] border-2 bg-white [backface-visibility:hidden] ${
                isToday ? "border-forest" : "border-forest/10"
              }`}
            >
              <div className="relative h-40 w-full shrink-0 overflow-hidden bg-mint">
                <Image
                  src={day.mealImage}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-(--motion-duration-slow) group-hover:scale-105 motion-reduce:transition-none"
                />
                {isToday ? (
                  <span className="absolute top-3 left-3 rounded-full bg-forest px-2.5 py-1 text-xs font-extrabold text-pistachio">
                    Today&apos;s special
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-2xl font-extrabold text-forest">
                      {day.label}
                    </p>
                    {day.sixDayOnly ? (
                      <p className="mt-0.5 text-xs font-extrabold tracking-wide text-olive uppercase">
                        6-day week only
                      </p>
                    ) : null}
                  </div>
                  <span className="rounded-full bg-pistachio px-2.5 py-1 text-xs font-extrabold text-forest-deep">
                    {day.short}
                  </span>
                </div>
                <ul className="mt-3 space-y-1 text-sm font-semibold text-ink/80">
                  {dishes.map((dish) => (
                    <li key={dish}>{dish}</li>
                  ))}
                </ul>
                <p className="mt-auto pt-2 text-xs font-bold text-olive">
                  Tap to flip for dessert →
                </p>
              </div>
            </div>

            <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[1.6rem] border-2 border-forest/10 bg-linear-160 from-mint to-pistachio [backface-visibility:hidden] [transform:rotateY(180deg)]">
              {day.dessertImage ? (
                <div className="relative h-44 w-full shrink-0 overflow-hidden">
                  <Image
                    src={day.dessertImage}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col items-center justify-center p-5 text-center">
                <p className="text-xs font-extrabold tracking-[0.16em] text-forest/70 uppercase">
                  Dessert of the day
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold text-forest">
                  {day.dessert}
                </p>
                <p className="mt-4 text-xs font-bold text-forest/70">
                  ← Tap to flip back
                </p>
              </div>
            </div>
          </div>
        </button>
      </motion.div>
    </BorderTrail>
  );
}

export function WeeklyMenu() {
  const [showSixDay, setShowSixDay] = useState(true);
  const [preference, setPreference] = useState<MenuPreference>("both");
  const todayId = getKuwaitMenuDayId();
  const days = ACTIVE_DAYS.filter((day) => showSixDay || !day.sixDayOnly);

  return (
    <section
      id="menu"
      className="relative overflow-hidden bg-cream py-20 sm:py-28"
      aria-labelledby="menu-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 size-[28rem] translate-x-1/3 -translate-y-1/4 rounded-full bg-mint/50 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-sm font-extrabold tracking-[0.18em] text-olive uppercase">
              Weekly menu
            </p>
            <TextEffect
              as="h2"
              id="menu-heading"
              per="word"
              className="mt-3 font-display text-4xl leading-tight font-extrabold text-forest sm:text-5xl"
            >
              Collect the week's flavours.
            </TextEffect>
          </div>
          <InView>
            <p className="max-w-md text-lg font-semibold text-ink/75 lg:justify-self-end">
              Flip each day&apos;s card for its dessert. Switch veg / non-veg
              where the kitchen offers both.
            </p>
          </InView>
        </div>

        <div className="sticky top-16 z-20 mt-8 -mx-4 border-y border-forest/10 bg-cream/90 px-4 py-3 backdrop-blur-md sm:top-[4.5rem] sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Meal preference"
              className="inline-flex rounded-full bg-white p-1 shadow-sm"
            >
              {(["veg", "non-veg", "both"] as const).map((option) => (
                <motion.button
                  key={option}
                  type="button"
                  aria-pressed={preference === option}
                  onClick={() => setPreference(option)}
                  whileTap={{ scale: 0.96 }}
                  className={`min-h-11 rounded-full px-5 text-sm font-extrabold capitalize transition-colors duration-(--motion-duration-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                    preference === option
                      ? "bg-forest text-pistachio"
                      : "text-forest hover:bg-mint/60"
                  }`}
                >
                  {option === "both" ? "Both" : option}
                </motion.button>
              ))}
            </div>

            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full bg-white px-5 text-sm font-extrabold text-forest shadow-sm">
              <input
                type="checkbox"
                checked={showSixDay}
                onChange={(event) => setShowSixDay(event.target.checked)}
                className="size-4 accent-forest"
              />
              Show Saturday (6-day week)
            </label>
          </div>
        </div>

        <InView className="mt-6">
          <div className="rounded-[1.75rem] border-2 border-dashed border-tan bg-tan/20 px-6 py-4 text-forest">
            <p className="font-display text-xl font-extrabold">Friday is OFF</p>
            <p className="mt-1 text-sm font-semibold sm:text-base">
              No deliveries on Friday — enjoy the weekend. We&apos;re back
              Saturday for 6-day weeks, and Sunday for everyone.
            </p>
          </div>
        </InView>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {days.map((day, index) => (
            <InView key={day.id} delay={index * 0.05}>
              <DayCard
                day={day}
                preference={preference}
                isToday={todayId === day.id}
              />
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}
