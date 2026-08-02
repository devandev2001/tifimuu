import type { Metadata } from "next";
import { About } from "@/components/about/About";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PolyHero } from "@/components/hero/PolyHero";
import { HowItWorks } from "@/components/how-it-works/HowItWorks";
import { WeeklyMenu } from "@/components/menu/WeeklyMenu";
import { OrderContact } from "@/components/order/OrderContact";
import { Plans } from "@/components/plans/Plans";
import { SiteChrome } from "@/components/SiteChrome";
import { WhyTiffimu } from "@/components/why/WhyTiffimu";

export const metadata: Metadata = {
  title: "Floating hero preview — Tiffimu",
  description:
    "A cinematic, scroll-driven Tiffimu hero with layered food cards and a live 3D tiffin.",
};

export default function FloatingPreviewPage() {
  return (
    <SiteChrome>
      <a
        href="#main"
        className="sr-only rounded-md bg-forest px-4 py-2 text-pistachio focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to content
      </a>
      <div data-enter="header">
        <Header />
      </div>
      <main id="main">
        <PolyHero />
        <div data-enter="rest">
          <WhyTiffimu />
          <HowItWorks />
          <WeeklyMenu />
          <Plans />
          <About />
          <OrderContact />
        </div>
      </main>
      <div data-enter="rest">
        <Footer />
      </div>
    </SiteChrome>
  );
}
