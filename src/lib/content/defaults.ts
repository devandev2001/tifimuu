import {
  CONTACT,
  DELIVERY_AREAS,
  GENERAL_INQUIRY_MESSAGE,
  KITCHEN_AREA,
  PLAN_TIERS,
  SITE,
  STORY_PARAGRAPHS,
  WHATSAPP_URL,
  WHY_TIFFIMU,
} from "@/lib/config";
import { LANDING_PANELS } from "@/lib/landing-panels";
import { WEEKLY_MENU } from "@/lib/menu";
import type { SiteContent } from "./types";

/** Built-in seed — matches the current static site files. */
export function createDefaultSiteContent(
  now: Date = new Date(),
): SiteContent {
  return {
    version: 1,
    updatedAt: now.toISOString(),
    settings: {
      site: {
        name: SITE.name,
        tagline: SITE.tagline,
        region: SITE.region,
      },
      whatsappUrl: WHATSAPP_URL,
      generalInquiryMessage: GENERAL_INQUIRY_MESSAGE,
      kitchenArea: KITCHEN_AREA,
      deliveryAreas: [...DELIVERY_AREAS],
      contact: {
        phone: CONTACT.phone,
        email: CONTACT.email,
        instagramHandle: CONTACT.instagramHandle,
        instagramUrl: CONTACT.instagramUrl,
      },
      storyParagraphs: [...STORY_PARAGRAPHS],
      why: {
        eyebrow: WHY_TIFFIMU.eyebrow,
        title: WHY_TIFFIMU.title,
        reasons: WHY_TIFFIMU.reasons.map((reason) => ({ ...reason })),
      },
    },
    panels: LANDING_PANELS.map((panel) => ({
      ...panel,
      image: { ...panel.image },
      primaryCta: { ...panel.primaryCta },
      secondaryCta: panel.secondaryCta
        ? { ...panel.secondaryCta }
        : undefined,
      notes: panel.notes ? [...panel.notes] : undefined,
    })),
    menu: WEEKLY_MENU.map((day) => ({
      ...day,
      staples: [...day.staples],
    })),
    plans: PLAN_TIERS.map((tier) => ({
      id: tier.id,
      title: tier.title,
      price: tier.price,
      blurb: tier.blurb,
      points: [...tier.points],
      featured: tier.featured,
    })),
  };
}
