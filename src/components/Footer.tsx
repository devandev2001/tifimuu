import Image from "next/image";
import {
  CONTACT,
  DELIVERY_AREAS,
  GENERAL_INQUIRY_MESSAGE,
  KITCHEN_AREA,
  SITE,
} from "@/lib/config";
import { Magnetic } from "@/components/motion/Magnetic";
import { WhatsAppCta } from "@/components/WhatsAppCta";

export function Footer() {
  return (
    <footer className="border-t border-lime/15 bg-forest-deep text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/characters/mascot-head-v2.png"
            alt=""
            width={56}
            height={56}
            className="h-12 w-12"
          />
          <div>
            <p className="font-display text-2xl font-extrabold">{SITE.name}</p>
            <p className="text-sm font-bold tracking-wide text-lime uppercase">
              {SITE.tagline}
            </p>
          </div>
        </div>
        <div className="max-w-md space-y-4 text-sm font-semibold text-cream/80">
          <p>
            Home-style tiffin delivery from our {KITCHEN_AREA} kitchen to{" "}
            {DELIVERY_AREAS.join(", ")}.
          </p>
          <p>
            {CONTACT.phone} ·{" "}
            <a
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline"
            >
              {CONTACT.instagramHandle}
            </a>
          </p>
          <Magnetic>
            <WhatsAppCta message={GENERAL_INQUIRY_MESSAGE} variant="dark">
              Message us on WhatsApp
            </WhatsAppCta>
          </Magnetic>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs font-semibold text-cream/55 sm:px-6">
        © {new Date().getFullYear()} {SITE.name}. Made for you in {SITE.region}.
      </div>
    </footer>
  );
}
