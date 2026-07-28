/**
 * =====================================================================
 *  TIFFIMU SITE SETTINGS — THE ONE FILE TO EDIT BEFORE LAUNCH
 * =====================================================================
 * Edit values between the quotes, save, and the site updates.
 * (Structured weekly menu + dish photo paths live in `src/lib/menu.ts`.)
 */

export const SITE = {
  name: "Tiffimu",
  tagline: "Tiffin Made For You",
  region: "Kuwait",
} as const;

/**
 * 1. WHATSAPP ORDER LINK
 *    Every "Order on WhatsApp" button opens this link.
 *    REPLACE WITH REAL WHATSAPP NUMBER/LINK — edit the address below,
 *    e.g. "https://wa.me/96555123456" (international format, no "+"
 *    or spaces). You can also set NEXT_PUBLIC_WHATSAPP_URL in a
 *    `.env.local` file instead (see `.env.example`).
 */
export const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() ||
  "https://wa.me/96551282020";

/** Builds a WhatsApp deep link with a prefilled message. */
export function whatsAppLink(message: string): string {
  const base = WHATSAPP_URL.replace(/\/$/, "");
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}text=${encodeURIComponent(message)}`;
}

/** Message used by general nav / hero / footer CTAs. */
export const GENERAL_INQUIRY_MESSAGE = [
  "Hello Tiffimu! I'd like to order a home-style tiffin plan.",
  "",
  "Tier: — (Budget / Executive / Premium)",
  "Schedule: — (5-day or 6-day)",
  "Preference: — (veg / non-veg)",
  "Area: — (Mina Abdulla / Fahaheel / Ahmadi)",
  "",
  "Please help me get started. Thank you!",
].join("\n");

/**
 * 2. PLAN TIERS — prices are PLACEHOLDERS in KWD / week.
 *    Replace "XX" when real prices are decided.
 */
export const PLAN_TIERS = [
  {
    id: "Budget",
    title: "Budget",
    price: "XX",
    blurb: "The full home-style meal, priced for every day.",
    points: [
      "Complete daily tiffin + dessert",
      "Veg or non-veg where the menu offers both",
      "Same fresh kitchen, friendliest price",
    ],
    featured: false,
  },
  {
    id: "Executive",
    title: "Executive",
    price: "XX",
    blurb: "Our most popular balance of portion and price.",
    points: [
      "Generous portions for working lunches",
      "Veg or non-veg where the menu offers both",
      "Best pick for most customers",
    ],
    featured: true,
  },
  {
    id: "Premium",
    title: "Premium",
    price: "XX",
    blurb: "The fullest tiffin we pack — for bigger appetites.",
    points: [
      "Largest portions and extras",
      "Veg or non-veg where the menu offers both",
      "Treat-yourself tier",
    ],
    featured: false,
  },
] as const;

export type PlanTierId = (typeof PLAN_TIERS)[number]["id"];

/** 3. Kitchen + delivery areas */
export const KITCHEN_AREA = "Mangaf" as const;
export const DELIVERY_AREAS = ["Mina Abdulla", "Fahaheel", "Ahmadi"] as const;

/**
 * 4. CONTACT — all PLACEHOLDERS until real details are confirmed.
 */
export const CONTACT = {
  phone: "+965 5128 2020",
  email: "hello@tiffimu.com",
  instagramHandle: "@tiffimu",
  instagramUrl: "https://instagram.com/tiffimu",
} as const;

/**
 * 5. Our story (About section). Light punctuation fixes only.
 */
export const STORY_PARAGRAPHS = [
  "Every day, thousands of people across Mina Abdulla, Fahaheel, and Ahmadi rush through lunch — ordering from outside, skipping it altogether, or settling for something quick and forgettable. And for those who do cook, spending hours in the kitchen after a full day of work is tiring — a chore nobody really looks forward to.",
  "We watched this from our own kitchen in Mangaf — a kitchen that has spent years cooking for this very community. We kept hearing the same thing, in different words: “I just want something that tastes like home, without the effort.”",
  "That's where Tiffimu started. Not an idea dreamed up in a boardroom, but the obvious next step for a kitchen that already knew how to cook for this community — we just needed to bring it to their doorstep, every working day.",
  "Home-style food, made fresh daily, priced fairly — Budget, Executive, or Premium, whatever fits you. That's what “Tiffimu” means to us: food that shows up, so cooking and ordering out don't have to.",
] as const;

/**
 * 6. Why Tiffimu — value reasons (home-style, clean ingredients, taste).
 */
export const WHY_TIFFIMU = {
  eyebrow: "Why Tiffimu?",
  title: "Home-style food, made the right way",
  reasons: [
    {
      title: "Tastes Like Home",
      body: "Every meal is made the way it's made at home — familiar flavors, cooked fresh, not mass-produced.",
    },
    {
      title: "No Additives, No Preservatives",
      body: "Nothing artificial, nothing sitting around. Just real ingredients, cooked fresh every day.",
    },
    {
      title: "Health-Friendly",
      body: "No added colours, controlled oil, and balanced spice levels — food that's kind to your body without asking you to compromise.",
    },
    {
      title: "Without Compromising on Taste",
      body: "Healthy doesn't mean bland here. We spent time getting the balance right, so it's still the tastiest meal in your day.",
    },
    {
      title: "Made for Everyone",
      body: "Whether you grew up on this food or simply love the cuisine, Tiffimu is for anyone who wants a proper, honest meal.",
    },
  ],
} as const;
