"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteContent } from "@/components/content/ContentProvider";
import { Magnetic } from "@/components/motion/Magnetic";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { useFloatingSite } from "@/components/floating-site/FloatingSiteProvider";
import type { DayMenu, MealPreference } from "@/lib/menu";
import { getKuwaitMenuDayId } from "@/lib/menu";
import { motionSprings } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type MenuPreference = MealPreference | "both";

function dishesForDay(day: DayMenu, preference: MenuPreference): string[] {
  const items = [...day.staples];
  if (day.vegOption && day.nonVegOption) {
    if (preference === "both") {
      items.splice(1, 0, day.vegOption, day.nonVegOption);
    } else if (preference === "veg") {
      items.splice(1, 0, day.vegOption);
    } else {
      items.splice(1, 0, day.nonVegOption);
    }
  } else if (day.vegOption) {
    items.splice(1, 0, day.vegOption);
  } else if (day.nonVegOption) {
    items.splice(1, 0, day.nonVegOption);
  }
  return items;
}

const PREFERENCE_OPTIONS = [
  { id: "veg" as const, label: "Veg" },
  { id: "non-veg" as const, label: "Non-veg" },
  { id: "both" as const, label: "Both" },
];

/**
 * Visual menu — pick a day by its plate photo, then order.
 * Photo-first stage with a filmstrip day picker and typographic dish list.
 */
export function FloatingMenuPanel({ isActive }: { isActive: boolean }) {
  const { content } = useSiteContent();
  const { goToId } = useFloatingSite();
  const reducedMotion = useReducedMotion();
  const [todayId, setTodayId] = useState<string | null>(null);
  const [preference, setPreference] = useState<MenuPreference>("both");
  const [showSaturday, setShowSaturday] = useState(true);

  const days = useMemo(
    () =>
      content.menu.filter(
        (day) => !day.isOff && (showSaturday || !day.sixDayOnly),
      ),
    [content.menu, showSaturday],
  );

  const [selectedId, setSelectedId] = useState(days[0]?.id ?? "monday");

  useEffect(() => {
    const id = getKuwaitMenuDayId();
    setTodayId(id);
    if (id) setSelectedId(id);
  }, []);

  useEffect(() => {
    if (!days.some((day) => day.id === selectedId) && days[0]) {
      setSelectedId(days[0].id);
    }
  }, [days, selectedId]);

  const selected =
    days.find((day) => day.id === selectedId) ?? days[0] ?? null;
  const dishes = selected ? dishesForDay(selected, preference) : [];
  const orderMessage = [
    `Hello Tiffimu! I'd like to order for ${selected?.label ?? "this week"}.`,
    "",
    `Preference: ${preference}`,
    "Plan: — (Budget / Executive / Premium)",
    "Schedule: — (5-day or 6-day)",
    `Area: — (${content.settings.deliveryAreas.join(" / ")})`,
    "",
    "Please help me get started. Thank you!",
  ].join("\n");

  if (!selected) {
    return (
      <article
        aria-hidden={!isActive}
        className="flex h-full items-center justify-center px-4"
      >
        <p className="text-olive">No menu days available yet.</p>
      </article>
    );
  }

  return (
    <article
      aria-hidden={!isActive}
      aria-labelledby="floating-menu-heading"
      data-panel-scroll
      className="relative flex h-full min-h-0 w-full flex-col overflow-y-auto overscroll-y-contain pb-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_42%_18%,rgba(250,246,234,0.92)_0%,transparent_52%),radial-gradient(ellipse_at_88%_72%,rgba(204,234,148,0.35)_0%,transparent_45%)]"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pt-3 sm:gap-5 sm:px-6 sm:pt-5">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-extrabold tracking-[0.2em] text-olive uppercase">
              This week
            </p>
            <h2
              id="floating-menu-heading"
              className="font-display text-[clamp(2rem,6vw,3.5rem)] leading-none font-extrabold tracking-tight text-forest"
            >
              Menu
            </h2>
          </div>
          <div
            role="group"
            aria-label="Meal preference"
            className="inline-flex gap-1 rounded-2xl bg-forest/8 p-1"
          >
            {PREFERENCE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={preference === option.id}
                onClick={() => setPreference(option.id)}
                className={`min-h-10 rounded-xl px-3.5 text-sm font-extrabold transition-colors ${
                  preference === option.id
                    ? "bg-forest text-pistachio"
                    : "text-forest hover:bg-cream/80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </header>

        <div className="grid min-h-0 gap-4 lg:grid-cols-[1.35fr_0.9fr] lg:items-start lg:gap-7">
          {/* Plate stage */}
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
                transition={motionSprings.soft}
                className="relative isolate min-h-[38svh] overflow-hidden rounded-[2rem] sm:min-h-[46svh] lg:min-h-[min(58svh,32rem)]"
              >
                {selected.mealImage ? (
                  <Image
                    src={selected.mealImage}
                    alt={`${selected.label} meal`}
                    fill
                    priority={isActive}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-mint" />
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,52,25,0.12)_0%,transparent_28%,transparent_48%,rgba(30,52,25,0.78)_100%)]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
                  <div>
                    <p className="font-display text-4xl font-extrabold tracking-tight text-cream sm:text-5xl">
                      {selected.label}
                    </p>
                    {selected.id === todayId ? (
                      <p className="mt-1.5 inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.16em] text-lime uppercase">
                        <span
                          aria-hidden="true"
                          className="size-1.5 rounded-full bg-lime"
                        />
                        Today&apos;s plate
                      </p>
                    ) : (
                      <p className="mt-1.5 text-sm font-semibold text-cream/75">
                        Tap a day below to switch
                      </p>
                    )}
                  </div>
                  {selected.dessert && selected.dessertImage ? (
                    <div className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-[1.25rem] border-[3px] border-cream/90 shadow-[0_12px_28px_rgba(30,52,25,0.35)] sm:size-24">
                      <Image
                        src={selected.dessertImage}
                        alt={selected.dessert}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Day filmstrip — selection by photo */}
            <div
              role="listbox"
              aria-label="Choose a day"
              className="flex gap-2.5 overflow-x-auto pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden"
            >
              {days.map((day, index) => {
                const active = day.id === selected.id;
                const isToday = day.id === todayId;
                return (
                  <motion.button
                    key={day.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    aria-label={`${day.label}${isToday ? ", today" : ""}`}
                    onClick={() => setSelectedId(day.id)}
                    initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...motionSprings.soft, delay: index * 0.035 }}
                    whileHover={reducedMotion ? undefined : { y: -6 }}
                    whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                    className="group relative w-[4.6rem] shrink-0 text-left sm:w-[5.25rem]"
                  >
                    <span
                      className={`relative block aspect-[4/5] overflow-hidden rounded-[1.15rem] transition-[box-shadow,transform] duration-(--motion-duration-fast) ${
                        active
                          ? "shadow-[0_10px_24px_rgba(44,74,39,0.35)] ring-2 ring-forest ring-offset-2 ring-offset-pistachio"
                          : "ring-1 ring-forest/15 hover:ring-forest/35"
                      }`}
                      style={{
                        transform: active
                          ? "rotate(0deg)"
                          : `rotate(${index % 2 === 0 ? -2.5 : 2.5}deg)`,
                      }}
                    >
                      {day.mealImage ? (
                        <Image
                          src={day.mealImage}
                          alt=""
                          fill
                          sizes="84px"
                          className="object-cover transition-transform duration-(--motion-duration-slow) group-hover:scale-105"
                        />
                      ) : (
                        <span className="absolute inset-0 bg-mint" />
                      )}
                      <span className="absolute inset-0 bg-linear-to-t from-forest-deep/70 via-transparent to-transparent" />
                      {isToday ? (
                        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-lime ring-2 ring-forest-deep" />
                      ) : null}
                      <span className="absolute inset-x-0 bottom-0 p-1.5 text-center font-display text-xs font-extrabold text-cream sm:text-sm">
                        {day.short}
                      </span>
                    </span>
                  </motion.button>
                );
              })}
              <label className="ml-0.5 flex w-[4.6rem] shrink-0 flex-col items-center justify-center gap-1 self-center text-center sm:w-[5.25rem]">
                <span className="flex aspect-[4/5] w-full items-center justify-center rounded-[1.15rem] border border-dashed border-forest/30 bg-cream/55">
                  <input
                    type="checkbox"
                    checked={showSaturday}
                    onChange={(event) => setShowSaturday(event.target.checked)}
                    className="size-4 accent-forest"
                    aria-label="Include Saturday"
                  />
                </span>
                <span className="font-display text-xs font-bold text-olive">
                  Sat
                </span>
              </label>
            </div>
          </div>

          {/* Dish details + order */}
          <motion.div
            key={`${selected.id}-${preference}`}
            initial={reducedMotion ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={motionSprings.soft}
            className="flex flex-col justify-between gap-5 border-t border-forest/15 pt-4 lg:min-h-[min(58svh,32rem)] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7"
          >
            <div>
              <p className="text-[0.65rem] font-extrabold tracking-[0.18em] text-olive uppercase">
                On the plate
              </p>
              <ul className="mt-3 space-y-2.5">
                {dishes.map((dish, index) => (
                  <li
                    key={dish}
                    className="flex items-baseline gap-3 border-b border-forest/10 pb-2.5 last:border-b-0"
                  >
                    <span
                      aria-hidden="true"
                      className="font-display text-sm font-extrabold text-olive/55"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-lg font-extrabold text-forest sm:text-xl">
                      {dish}
                    </span>
                  </li>
                ))}
              </ul>

              {selected.dessert ? (
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-cream/70 px-3 py-3">
                  {selected.dessertImage ? (
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={selected.dessertImage}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                  ) : null}
                  <p className="flex flex-col">
                    <span className="text-[0.65rem] font-extrabold tracking-[0.14em] text-olive uppercase">
                      Sweet finish
                    </span>
                    <span className="font-display text-lg font-extrabold text-forest">
                      {selected.dessert}
                    </span>
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Magnetic strength={12}>
                <WhatsAppCta
                  message={orderMessage}
                  className="!min-h-12 !px-5 !text-base"
                >
                  Order {selected.short}
                </WhatsAppCta>
              </Magnetic>
              <button
                type="button"
                onClick={() => goToId("plans")}
                className="inline-flex min-h-12 items-center rounded-full border border-forest/20 bg-cream/80 px-4 font-display text-base font-bold text-forest hover:bg-white"
              >
                See plans
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </article>
  );
}
