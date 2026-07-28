"use client";

import { whatsAppLink } from "@/lib/config";
import { useOptionalSiteContent } from "@/components/content/ContentProvider";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className ?? "size-5"}
    >
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.73-.66-1.23-1.47-1.38-1.72-.14-.24-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

type WhatsAppCtaProps = {
  message: string;
  children: React.ReactNode;
  variant?: "primary" | "light" | "dark";
  className?: string;
};

const VARIANT_CLASSES = {
  primary:
    "bg-forest text-pistachio hover:bg-forest-deep active:scale-95 shadow-lg shadow-forest/25",
  light:
    "bg-cream text-forest hover:bg-white active:scale-95 shadow-lg shadow-forest-deep/30",
  dark: "bg-lime text-forest-deep hover:bg-lime-bright active:scale-95 shadow-lg shadow-black/20",
} as const;

/**
 * Every order button on the site — opens WhatsApp with a prefilled message.
 * Number comes from control-panel content when available, else config.ts.
 */
export function WhatsAppCta({
  message,
  children,
  variant = "primary",
  className = "",
}: WhatsAppCtaProps) {
  const siteContent = useOptionalSiteContent();
  const href = siteContent
    ? siteContent.whatsAppLink(message)
    : whatsAppLink(message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 font-display text-lg font-bold transition-[background-color,transform,box-shadow] duration-(--motion-duration-fast) ease-(--motion-ease-standard) ${VARIANT_CLASSES[variant]} ${className}`}
    >
      <WhatsAppIcon />
      {children}
    </a>
  );
}
