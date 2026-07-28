"use client";

import { InteractiveMascot } from "@/components/InteractiveMascot";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";

/**
 * Branded interactive-character panel (Card + Spotlight + Tiffimu Rive).
 * Uses the site mascot — not a third-party demo robot scene.
 */
export function SplineSceneBasic() {
  return (
    <Card className="relative h-[min(32rem,70svh)] w-full overflow-hidden border-forest/20 bg-forest-deep">
      <Spotlight
        className="-top-40 left-0 from-lime via-mint to-cream md:-top-20 md:left-60"
        size={280}
      />

      <div className="relative z-10 flex h-full flex-col md:flex-row">
        <div className="flex flex-1 flex-col justify-center p-8 md:p-10">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-cream md:text-5xl">
            Meet Tiffimu
          </h2>
          <p className="mt-4 max-w-lg text-base font-semibold text-cream/75 md:text-lg">
            Tap or click the character — she waves, walks, and settles into an
            idle loop. Home-food energy, built for the screen.
          </p>
        </div>

        <div className="relative flex min-h-56 flex-1 items-end justify-center md:min-h-0 md:items-center">
          <InteractiveMascot
            variant="wave"
            initialEvent="WELCOME"
            interactEvent="WELCOME"
            className="h-64 w-40 cursor-pointer sm:h-72 sm:w-48 md:h-80 md:w-52"
          />
        </div>
      </div>
    </Card>
  );
}
