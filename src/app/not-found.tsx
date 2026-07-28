import Link from "next/link";
import { SITE } from "@/lib/config";
import { InteractiveMascot } from "@/components/InteractiveMascot";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-cream px-4 py-16 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-mint)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom,_var(--color-lime)_0%,_transparent_50%)] opacity-70"
      />
      <div className="relative z-10 flex max-w-md flex-col items-center gap-6">
        <InteractiveMascot
          variant="wave"
          initialEvent="WELCOME"
          interactEvent="WELCOME"
          className="h-48 w-36 cursor-pointer sm:h-56 sm:w-44"
        />
        <div className="space-y-3">
          <p className="font-display text-sm font-extrabold tracking-widest text-olive uppercase">
            {SITE.name}
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
            Page not found
          </h1>
          <p className="text-base font-semibold text-ink/75 sm:text-lg">
            That link doesn&apos;t lead to a tiffin page. Head home for menus,
            plans, and WhatsApp ordering.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-forest px-6 py-3 text-base font-extrabold text-pistachio shadow-lg shadow-forest/25 transition-[transform,background-color] duration-(--motion-duration-fast) hover:bg-forest-deep active:scale-95"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
