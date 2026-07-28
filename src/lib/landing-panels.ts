import {
  DELIVERY_AREAS,
  GENERAL_INQUIRY_MESSAGE,
  SITE,
  WHY_TIFFIMU,
} from "@/lib/config";

export type LandingPanelId =
  | "welcome"
  | "why"
  | "menu"
  | "plans"
  | "story"
  | "order"
  | "how";

export type LandingPanel = {
  id: LandingPanelId;
  eyebrow: string;
  title: string;
  body: string;
  image: {
    src: string;
    alt: string;
    caption: string;
  };
  glow: "start" | "end";
  imageTilt: number;
  primaryCta: { label: string; message: string };
  secondaryCta?: { label: string; targetPanel: LandingPanelId };
  notes?: string[];
};

/** Welcome → Why → Menu → Plans → Story → Order → How */
export const LANDING_PANELS: LandingPanel[] = [
  {
    id: "welcome",
    eyebrow: SITE.region,
    title: SITE.name,
    body: "Fresh home-style tiffin to your door.",
    image: {
      src: "/menu/meals/tuesday-pulao.jpg",
      alt: "Home-style pulao in a tiffin",
      caption: "Home-style pulao",
    },
    glow: "end",
    imageTilt: -2.5,
    primaryCta: { label: "Order now", message: GENERAL_INQUIRY_MESSAGE },
    secondaryCta: { label: "See menu", targetPanel: "menu" },
  },
  {
    id: "why",
    eyebrow: WHY_TIFFIMU.eyebrow,
    title: WHY_TIFFIMU.title,
    body: "Home-style food, made the right way.",
    image: {
      src: "/menu/meals/monday-jeera-rice.jpg",
      alt: "Jeera rice meal",
      caption: "Tastes like home",
    },
    glow: "start",
    imageTilt: 2,
    primaryCta: { label: "See menu", message: GENERAL_INQUIRY_MESSAGE },
    secondaryCta: { label: "Menu", targetPanel: "menu" },
  },
  {
    id: "menu",
    eyebrow: "This week",
    title: "Menu",
    body: "Pick a day.",
    image: {
      src: "/menu/desserts/gulab-jamun.jpg",
      alt: "Gulab jamun dessert",
      caption: "Gulab jamun",
    },
    glow: "end",
    imageTilt: 2,
    primaryCta: { label: "Order", message: GENERAL_INQUIRY_MESSAGE },
    secondaryCta: { label: "Plans", targetPanel: "plans" },
  },
  {
    id: "plans",
    eyebrow: "Plans",
    title: "Plans",
    body: "Choose your portion.",
    image: {
      src: "/menu/meals/saturday-ghee-rice.jpg",
      alt: "Ghee rice meal",
      caption: "Ghee rice",
    },
    glow: "start",
    imageTilt: -2,
    primaryCta: { label: "Order", message: GENERAL_INQUIRY_MESSAGE },
    secondaryCta: { label: "Menu", targetPanel: "menu" },
  },
  {
    id: "story",
    eyebrow: "Our story",
    title: "From our kitchen in Mangaf",
    body: "Food that tastes like home, without the effort.",
    image: {
      src: "/menu/meals/sunday-lemon-rice.jpg",
      alt: "Lemon rice meal",
      caption: "Lemon rice",
    },
    glow: "end",
    imageTilt: 1.5,
    primaryCta: { label: "Order", message: GENERAL_INQUIRY_MESSAGE },
    secondaryCta: { label: "Why Tiffimu", targetPanel: "why" },
  },
  {
    id: "order",
    eyebrow: "Order",
    title: "Order",
    body: "Tell us your plan on WhatsApp.",
    image: {
      src: "/menu/meals/thursday-tomato-rice.jpg",
      alt: "Tomato rice meal",
      caption: "Tomato rice",
    },
    glow: "start",
    imageTilt: -2,
    primaryCta: { label: "WhatsApp us", message: GENERAL_INQUIRY_MESSAGE },
    notes: DELIVERY_AREAS.map((area) => area),
  },
  {
    id: "how",
    eyebrow: "How",
    title: "Pick. Chat. Eat.",
    body: "Choose a plan, message us, we deliver.",
    image: {
      src: "/menu/meals/wednesday-sambar-rice.jpg",
      alt: "Sambar rice meal",
      caption: "Sambar rice",
    },
    glow: "end",
    imageTilt: -1.5,
    primaryCta: { label: "Start order", message: GENERAL_INQUIRY_MESSAGE },
    secondaryCta: { label: "Menu", targetPanel: "menu" },
  },
];

export const LANDING_PANEL_INDEX: Record<LandingPanelId, number> =
  Object.fromEntries(
    LANDING_PANELS.map((panel, index) => [panel.id, index]),
  ) as Record<LandingPanelId, number>;

export function getLandingPanel(id: LandingPanelId): LandingPanel {
  const panel = LANDING_PANELS.find((entry) => entry.id === id);
  if (!panel) throw new Error(`Unknown landing panel: ${id}`);
  return panel;
}
