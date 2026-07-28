import { whatsAppLink, type PlanTierId } from "@/lib/config";
import type { MealPreference } from "@/lib/menu";

export type OrderDraft = {
  name?: string;
  tier?: PlanTierId;
  schedule?: "5-day" | "6-day";
  preference?: MealPreference | "either";
  notes?: string;
};

function buildOrderMessage(draft: OrderDraft = {}): string {
  const lines = [
    "Hello Tiffimu! I'd like to order a home-style tiffin plan.",
    "",
    `Name: ${draft.name?.trim() || "—"}`,
    `Tier: ${draft.tier ?? "— (Budget / Executive / Premium)"}`,
    `Schedule: ${draft.schedule ?? "— (5-day or 6-day)"}`,
    `Preference: ${draft.preference ?? "— (veg / non-veg)"}`,
    "Area: — (Mina Abdulla / Fahaheel / Ahmadi)",
    draft.notes?.trim() ? `Notes: ${draft.notes.trim()}` : null,
    "",
    "Please help me get started. Thank you!",
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}

/** Build a WhatsApp deep link with a pre-filled order message. */
export function getWhatsAppOrderUrl(draft: OrderDraft = {}): string {
  return whatsAppLink(buildOrderMessage(draft));
}
