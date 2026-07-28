/**
 * Site content contract — what the control panel edits.
 * Backend later: persist this shape via REST/DB; keep field names stable.
 */

import type { DayMenu } from "@/lib/menu";
import type { LandingPanel } from "@/lib/landing-panels";

export type SiteIdentity = {
  name: string;
  tagline: string;
  region: string;
};

export type SiteContact = {
  phone: string;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
};

export type PlanTierDraft = {
  id: string;
  title: string;
  price: string;
  blurb: string;
  points: string[];
  featured: boolean;
};

export type WhyReason = {
  title: string;
  body: string;
};

export type WhyContent = {
  eyebrow: string;
  title: string;
  reasons: WhyReason[];
};

export type SiteSettings = {
  site: SiteIdentity;
  whatsappUrl: string;
  generalInquiryMessage: string;
  kitchenArea: string;
  deliveryAreas: string[];
  contact: SiteContact;
  storyParagraphs: string[];
  why: WhyContent;
};

/** Full editable snapshot of marketing content. */
export type SiteContent = {
  version: 1;
  updatedAt: string;
  settings: SiteSettings;
  panels: LandingPanel[];
  menu: DayMenu[];
  plans: PlanTierDraft[];
};

export type ContentRepository = {
  load: () => Promise<SiteContent>;
  save: (content: SiteContent) => Promise<SiteContent>;
  reset: () => Promise<SiteContent>;
};
