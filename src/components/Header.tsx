"use client";

import Image from "next/image";
import { GENERAL_INQUIRY_MESSAGE, SITE } from "@/lib/config";
import type { LandingPanelId } from "@/lib/landing-panels";
import { Magnetic } from "@/components/motion/Magnetic";
import { WhatsAppCta } from "./WhatsAppCta";
import { useOptionalSiteContent } from "@/components/content/ContentProvider";
import { useOptionalFloatingSite } from "@/components/floating-site/FloatingSiteProvider";

const FLOATING_NAV: { id: LandingPanelId; label: string }[] = [
  { id: "why", label: "Why Tiffimu" },
  { id: "menu", label: "Menu" },
  { id: "plans", label: "Plans" },
  { id: "story", label: "Our story" },
  { id: "order", label: "Order" },
  { id: "how", label: "How it works" },
];

const SCROLL_NAV = [
  { href: "#why", label: "Why Tiffimu" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#menu", label: "Menu" },
  { href: "#plans", label: "Plans" },
  { href: "#about", label: "Our story" },
  { href: "#order", label: "Order" },
] as const;

export function Header() {
  const floating = useOptionalFloatingSite();
  const siteContent = useOptionalSiteContent();
  const brandName = siteContent?.content.settings.site.name ?? SITE.name;
  const inquiryMessage =
    siteContent?.content.settings.generalInquiryMessage ??
    GENERAL_INQUIRY_MESSAGE;

  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-18 sm:px-6">
        {floating ? (
          <button
            type="button"
            onClick={() => floating.goTo(0)}
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            <BrandMark name={brandName} />
          </button>
        ) : (
          <a href="#top" className="flex items-center gap-2.5">
            <BrandMark name={brandName} />
          </a>
        )}

        <nav
          aria-label={floating ? "Panels" : "Sections"}
          className="hidden items-center gap-5 lg:flex"
        >
          {floating
            ? FLOATING_NAV.map((link) => {
                const active = floating.panelId === link.id;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => floating.goToId(link.id)}
                    aria-current={active ? "true" : undefined}
                    className={`nav-link-draw rounded-md py-2 font-semibold transition-colors duration-(--motion-duration-fast) ${
                      active ? "text-forest" : "text-olive hover:text-forest"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })
            : SCROLL_NAV.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-link-draw rounded-md py-2 font-semibold text-olive transition-colors duration-(--motion-duration-fast) hover:text-forest"
                >
                  {link.label}
                </a>
              ))}
        </nav>

        <Magnetic strength={16}>
          <WhatsAppCta
            message={inquiryMessage}
            className="!min-h-11 !px-5 !text-base"
          >
            Order Now
          </WhatsAppCta>
        </Magnetic>
      </div>

      {floating ? (
        <p className="sr-only" aria-live="polite">
          {
            floating.panels.find((panel) => panel.id === floating.panelId)
              ?.title
          }
        </p>
      ) : null}
    </header>
  );
}

function BrandMark({ name }: { name: string }) {
  return (
    <>
      <Image
        src="/characters/mascot-head-v2.png"
        alt=""
        width={40}
        height={40}
        className="h-10 w-10"
      />
      <span className="font-display text-2xl font-extrabold tracking-tight text-forest">
        {name}
      </span>
    </>
  );
}
