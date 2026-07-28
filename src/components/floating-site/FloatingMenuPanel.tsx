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

/**
 * Visual menu — pick a day by its plate photo, then order.
 */
export function FloatingMenuPanel({ isActive }: { isActive: boolean }) {
  const { content } = useSiteContent();
  const { goToId } = useFloatingSite();
  const reducedMotion = useReducedMotion();
  const todayId = getKuwaitMenuDayId();
  const [preference, setPreference] = useState<MenuPreference>("both");
  const [showSaturday, setShowSaturday] = useState(true);

  const days = useMemo(
    () =>
      content.menu.filter(
        (day) => !day.isOff && (showSaturday || !day.sixDayOnly),
      ),
    [content.menu, showSaturday],
  );

  const initialDayId =
    (todayId && days.some((day) => day.id === todayId) && todayId) ||
    days[0]?.id ||
    "monday";

  const [selectedId, setSelectedId] = useState(initialDayId);

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
      className="relative flex h-full min-h-0 w-full flex-col pb-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(250,246,234,0.9),transparent_55%)]"
      />

      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col gap-3 px-4 pt-3 sm:gap-4 sm:px-6 sm:pt-5 lg:gap-5">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="floating-menu-heading"
            className="font-display text-2xl font-extrabold tracking-tight text-forest sm:text-3xl lg:text-4xl"
          >
            Menu
          </h2>
          <div
            role="group"
            aria-label="Meal preference"
            className="inline-flex rounded-full bg-cream/90 p-1 shadow-sm"
          >
            {(["veg", "non-veg", "both"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={preference === option}
                onClick={() => setPreference(option)}
                className={`min-h-9 rounded-full px-3 text-xs font-extrabold capitalize sm:min-h-10 sm:px-3.5 sm:text-sm ${
                  preference === option
                    ? "bg-forest text-pistachio"
                    : "text-forest hover:bg-white"
                }`}
              >
                {option === "both" ? "Both" : option === "non-veg" ? "Non-veg" : "Veg"}
              </button>
            ))}
          </div>
        </div>

        {/* Photo day picker — selection by image */}
        <div
          role="listbox"
          aria-label="Choose a day"
          className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden"
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
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...motionSprings.soft, delay: index * 0.04 }}
                whileHover={reducedMotion ? undefined : { y: -5 }}
                whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                className={`group relative w-[4.75rem] shrink-0 text-left sm:w-24 ${
                  active ? "z-10" : ""
                }`}
              >
                <span
                  className={`relative block aspect-square overflow-hidden rounded-2xl border-2 transition-[border-color,transform,box-shadow] duration-(--motion-duration-fast) ${
                    active
                      ? "border-forest shadow-lg shadow-forest/25 ring-2 ring-forest/20"
                      : "border-white/80 hover:border-forest/30"
                  }`}
                >
                  {day.mealImage ? (
                    <Image
                      src={day.mealImage}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-(--motion-duration-slow) group-hover:scale-105"
                    />
                  ) : (
                    <span className="absolute inset-0 bg-mint" />
                  )}
                  {isToday ? (
                    <span className="absolute top-1.5 left-1.5 size-2 rounded-full bg-lime ring-2 ring-forest" />
                  ) : null}
                </span>
                <span
                  className={`mt-1.5 block text-center font-display text-sm font-extrabold ${
                    active ? "text-forest" : "text-olive"
                  }`}
                >
                  {day.short}
                </span>
              </motion.button>
            );
          })}
          <label className="ml-1 flex w-16 shrink-0 flex-col items-center justify-center gap-1 self-start pt-1 text-center sm:w-20">
            <span className="flex size-[4.75rem] items-center justify-center rounded-2xl border border-dashed border-forest/25 bg-cream/60 sm:size-24">
              <input
                type="checkbox"
                checked={showSaturday}
                onChange={(event) => setShowSaturday(event.target.checked)}
                className="size-4 accent-forest"
                aria-label="Include Saturday"
              />
            </span>
            <span className="font-display text-xs font-bold text-olive">Sat</span>
          </label>
        </div>

        {/* Selected plate — visual stage */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, scale: 0.98 }}
              transition={motionSprings.soft}
              className="relative min-h-[34svh] overflow-hidden rounded-[1.75rem] sm:min-h-[42svh] lg:min-h-0"
            >
              {selected.mealImage ? (
                <Image
                  src={selected.mealImage}
                  alt={`${selected.label} meal`}
                  fill
                  priority={isActive}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-mint" />
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-forest-deep/80 via-forest-deep/15 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                <div>
                  <p className="font-display text-3xl font-extrabold text-cream sm:text-4xl">
                    {selected.label}
                  </p>
                  {selected.id === todayId ? (
                    <p className="mt-1 text-xs font-extrabold tracking-[0.14em] text-lime uppercase">
                      Today&apos;s plate
                    </p>
                  ) : null}
                </div>
                {selected.dessert && selected.dessertImage ? (
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border-2 border-cream/80 shadow-lg sm:size-20">
                    <Image
                      src={selected.dessertImage}
                      alt={selected.dessert}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col justify-between gap-3 rounded-[1.75rem] bg-cream/75 p-4 backdrop-blur-sm sm:p-5">
            <div>
              <p className="text-[0.65rem] font-extrabold tracking-[0.18em] text-olive uppercase">
                On the plate
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {dishes.map((dish) => (
                  <li
                    key={dish}
                    className="rounded-full bg-white px-3 py-2 text-sm font-bold text-forest shadow-sm"
                  >
                    {dish}
                  </li>
                ))}
              </ul>
              {selected.dessert ? (
                <p className="mt-4 flex flex-col gap-0.5">
                  <span className="text-xs font-extrabold tracking-[0.14em] text-olive uppercase">
                    Sweet
                  </span>
                  <span className="font-display text-lg font-extrabold text-forest">
                    {selected.dessert}
                  </span>
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
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
                className="inline-flex min-h-12 items-center rounded-full border border-forest/20 bg-white/80 px-4 font-display text-base font-bold text-forest hover:bg-white"
              >
                Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
