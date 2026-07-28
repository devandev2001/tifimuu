import Image from "next/image";
import { GENERAL_INQUIRY_MESSAGE, SITE } from "@/lib/config";
import { InteractiveMascot } from "@/components/InteractiveMascot";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { FloatingHeroStage } from "./FloatingHeroStage";
import { TiffinSceneShell } from "./TiffinSceneShell";

const FLOATING_DISHES = [
  {
    src: "/menu/meals/monday-jeera-rice.jpg",
    label: "Monday comfort",
    detail: "Jeera rice",
    className:
      "left-[3vw] top-[15%] w-36 -rotate-7 sm:w-44 lg:left-[38%] lg:top-[10%] lg:w-48",
    x: -36,
    y: -58,
    rotate: -15,
    scale: 1.08,
  },
  {
    src: "/menu/meals/tuesday-pulao.jpg",
    label: "Tuesday favourite",
    detail: "Home-style pulao",
    className:
      "right-[3vw] top-[18%] hidden w-36 rotate-8 sm:block sm:w-44 lg:right-[2vw] lg:top-[12%] lg:w-52",
    x: 30,
    y: -74,
    rotate: 14,
    scale: 1.12,
  },
  {
    src: "/menu/desserts/gulab-jamun.jpg",
    label: "A sweet finish",
    detail: "Gulab jamun",
    className:
      "right-[5vw] bottom-[7%] w-36 -rotate-5 sm:w-44 lg:right-[8vw] lg:bottom-[5%] lg:w-48",
    x: 42,
    y: 54,
    rotate: 7,
    scale: 1.08,
  },
] as const;

function FloatingDish({
  dish,
}: {
  dish: (typeof FLOATING_DISHES)[number];
}) {
  return (
    <figure
      aria-hidden="true"
      data-hero-card
      data-hero-x={dish.x}
      data-hero-y={dish.y}
      data-hero-rotate={dish.rotate}
      data-hero-scale={dish.scale}
      className={`absolute rounded-3xl border border-white/65 bg-cream/92 p-2 shadow-xl shadow-forest-deep/15 backdrop-blur-sm ${dish.className}`}
    >
      <Image
        src={dish.src}
        alt=""
        width={720}
        height={720}
        sizes="(max-width: 640px) 144px, 208px"
        className="aspect-square rounded-2xl object-cover"
      />
      <figcaption className="px-2 pt-2 pb-1">
        <span className="block text-[0.65rem] font-extrabold tracking-[0.12em] text-forest uppercase">
          {dish.label}
        </span>
        <span className="mt-0.5 block font-display text-sm font-extrabold text-forest sm:text-base">
          {dish.detail}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Sticky cinematic hero inspired by Poly's canvas depth, built with the
 * project's existing GSAP and R3F stack instead of a 40+ MiB image sequence.
 */
export function PolyHero() {
  return (
    <FloatingHeroStage>
      <div className="sticky top-18 h-[calc(100svh-4.5rem)] overflow-hidden bg-pistachio motion-reduce:relative motion-reduce:top-0">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(250,246,234,0.96)_0,rgba(223,240,184,0.68)_34%,rgba(203,232,151,0.2)_62%,transparent_78%)]"
        />
        <div
          data-hero-glow
          aria-hidden="true"
          className="absolute top-1/2 left-[72%] h-[min(78vw,56rem)] w-[min(78vw,56rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/60 bg-cream/35 shadow-[inset_0_0_0_5rem_rgba(250,246,234,0.08)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-cream/80 to-transparent"
        />

        <div
          data-hero-pointer
          className="absolute inset-0 [perspective:1200px] [transform-style:preserve-3d]"
        >
          {FLOATING_DISHES.map((dish) => (
            <FloatingDish key={dish.src} dish={dish} />
          ))}

          <div className="absolute top-[20%] right-1/2 w-[min(80vw,31rem)] translate-x-1/2 sm:top-[17%] lg:top-1/2 lg:right-[4vw] lg:w-[min(48vw,39rem)] lg:-translate-y-1/2 lg:translate-x-0">
            <div data-enter="visual">
              <div data-hero-object>
                <div className="relative">
                  <div className="absolute inset-[12%] rounded-full bg-cream/70 blur-3xl" />
                  <TiffinSceneShell
                    className="relative max-w-none"
                    controlsClassName="top-[18%] bottom-auto z-30"
                  />
                  <div className="absolute right-[1%] bottom-[3%] h-[38%] w-[24%] min-w-20">
                    <InteractiveMascot
                      variant="wave"
                      initialEvent="IDLE"
                      interactEvent="WELCOME"
                      className="h-full w-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 mx-auto flex h-full max-w-6xl items-end px-4 pt-20 pb-16 sm:px-6 sm:pt-24 lg:items-center lg:py-12">
          <div
            data-hero-copy
            className="w-full rounded-4xl border border-white/55 bg-cream/88 p-6 shadow-2xl shadow-forest-deep/10 backdrop-blur-xl sm:max-w-xl sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none"
          >
            <p
              data-enter="brand"
              className="font-display text-sm font-extrabold tracking-[0.2em] text-forest uppercase"
            >
              {SITE.name}
            </p>
            <h1
              data-enter="brand"
              className="mt-3 max-w-[11ch] font-display text-5xl leading-[0.95] font-extrabold tracking-tight text-forest sm:text-6xl lg:text-7xl"
            >
              Home food,
              <span className="block text-olive">in motion.</span>
            </h1>
            <p
              data-enter="copy"
              className="mt-5 max-w-md text-base leading-relaxed font-semibold text-forest/78 sm:text-lg"
            >
              Fresh home-style tiffin from our Mangaf kitchen, delivered across
              Mina Abdulla, Fahaheel, and Ahmadi.
            </p>
            <div
              data-enter="copy"
              className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <WhatsAppCta message={GENERAL_INQUIRY_MESSAGE}>
                Order on WhatsApp
              </WhatsAppCta>
              <a
                href="#why"
                className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-forest px-6 py-3 font-display text-lg font-bold text-forest transition-colors duration-(--motion-duration-fast) ease-(--motion-ease-standard) hover:bg-forest hover:text-pistachio"
              >
                Build your week
              </a>
            </div>
          </div>
        </div>

        <div
          data-hero-arrival
          className="pointer-events-none absolute right-4 bottom-5 z-30 max-w-[15rem] rounded-3xl bg-forest px-5 py-4 text-cream opacity-0 shadow-xl shadow-forest-deep/25 sm:right-8 sm:bottom-8 sm:max-w-xs"
        >
          <p className="text-xs font-extrabold tracking-[0.16em] text-lime uppercase">
            Scroll story
          </p>
          <p className="mt-1 font-display text-xl leading-tight font-extrabold">
            From our kitchen to your door.
          </p>
        </div>

        <div
          data-hero-scroll-cue
          aria-hidden="true"
          className="absolute bottom-5 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-forest/70 lg:flex"
        >
          <span className="text-[0.65rem] font-extrabold tracking-[0.18em] uppercase">
            Scroll to explore
          </span>
          <span className="flex h-9 w-6 justify-center rounded-full border-2 border-forest/45 pt-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-forest" />
          </span>
        </div>
      </div>
    </FloatingHeroStage>
  );
}
