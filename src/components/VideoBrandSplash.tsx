"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SITE } from "@/lib/config";
import {
  motionDistances,
  motionDurations,
  motionEases,
  splashMotion,
} from "@/lib/motion";

gsap.registerPlugin(useGSAP);

type VideoBrandSplashProps = {
  /** Fired when the dissolve starts — page entrance begins underneath. */
  onReveal: () => void;
  /** Fired after the splash is fully gone and may unmount. */
  onFinished: () => void;
};

const WORDMARK = SITE.name;
const TAGLINE = SITE.tagline.toUpperCase();

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function LetterSpans({
  text,
  kind,
}: {
  text: string;
  kind: "word" | "tag";
}) {
  return (
    <>
      {Array.from(text).map((char, index) => (
        <span
          key={`${kind}-${char}-${index}`}
          data-splash-letter={kind}
          aria-hidden
          className="inline-block opacity-0 will-change-transform"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
}

/**
 * Opening splash: mascot walk video (baked text removed) + animated HTML brand
 * overlaid in the cleared space to the right of the walker.
 */
export function VideoBrandSplash({
  onReveal,
  onFinished,
}: VideoBrandSplashProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const revealedRef = useRef(false);
  const finishedRef = useRef(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    onReveal();
  }, [onReveal]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    reveal();
    timelineRef.current?.kill();
    timelineRef.current = null;
    videoRef.current?.pause();
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    setActive(false);
    onFinished();
  }, [onFinished, reveal]);

  useLayoutEffect(() => {
    if (!active) return;
    const wordLetters = wordmarkRef.current?.querySelectorAll(
      '[data-splash-letter="word"]',
    );
    const tagLetters = taglineRef.current?.querySelectorAll(
      '[data-splash-letter="tag"]',
    );
    if (!wordLetters?.length || !tagLetters?.length) return;

    if (reducedMotion) {
      gsap.set([wordLetters, tagLetters], { opacity: 1, y: 0 });
      return;
    }

    gsap.set(wordLetters, { opacity: 0, y: motionDistances.md });
    gsap.set(tagLetters, { opacity: 0, y: motionDistances.sm });
  }, [active, reducedMotion]);

  useGSAP(
    () => {
      if (!active || !videoReady) return;

      const root = rootRef.current;
      const wordLetters = wordmarkRef.current?.querySelectorAll(
        '[data-splash-letter="word"]',
      );
      const tagLetters = taglineRef.current?.querySelectorAll(
        '[data-splash-letter="tag"]',
      );
      if (!root || !wordLetters?.length || !tagLetters?.length) return;

      if (reducedMotion) {
        gsap.set([wordLetters, tagLetters], { opacity: 1, y: 0 });
        const timer = window.setTimeout(finish, splashMotion.reducedHoldMs);
        return () => window.clearTimeout(timer);
      }

      timelineRef.current?.kill();
      const timeline = gsap.timeline({
        defaults: { ease: motionEases.enter },
      });
      timelineRef.current = timeline;

      gsap.set(wordLetters, { opacity: 0, y: motionDistances.md });
      gsap.set(tagLetters, { opacity: 0, y: motionDistances.sm });

      timeline.to(
        wordLetters,
        {
          opacity: 1,
          y: 0,
          duration: motionDurations.slow,
          stagger: splashMotion.letterStagger,
        },
        splashMotion.videoWordmarkAt,
      );

      timeline.to(
        tagLetters,
        {
          opacity: 1,
          y: 0,
          duration: motionDurations.slow,
          stagger: splashMotion.taglineStagger,
        },
        splashMotion.videoTaglineAt,
      );

      timeline.to(
        {},
        { duration: splashMotion.videoHoldAfterTagline },
        splashMotion.videoTaglineAt + motionDurations.slow,
      );
      timeline.add(reveal);
      timeline.to(root, {
        opacity: 0,
        duration: motionDurations.slow,
        ease: motionEases.standard,
        onComplete: finish,
      });

      return () => {
        timeline.kill();
        if (timelineRef.current === timeline) {
          timelineRef.current = null;
        }
      };
    },
    {
      scope: rootRef,
      dependencies: [active, videoReady, reducedMotion, finish, reveal],
    },
  );

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finish]);

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(finish, splashMotion.videoFallbackMs);
    return () => window.clearTimeout(timer);
  }, [active, finish]);

  // If video never becomes ready on mobile, still run the text + handoff.
  useEffect(() => {
    if (!active || videoReady) return;
    const timer = window.setTimeout(() => setVideoReady(true), 800);
    return () => window.clearTimeout(timer);
  }, [active, videoReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active) return;

    const markReady = () => setVideoReady(true);
    const onEnded = () => finish();
    const onError = () => markReady();

    if (reducedMotion) {
      video.pause();
      try {
        video.currentTime = Math.min(2.2, video.duration || 2.2);
      } catch {
        /* ignore seek errors before metadata */
      }
      markReady();
      return;
    }

    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    if (video.readyState >= 2) {
      markReady();
    } else {
      video.addEventListener("loadeddata", markReady, { once: true });
    }

    void video.play().catch(() => {
      markReady();
    });

    return () => {
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      video.removeEventListener("loadeddata", markReady);
    };
  }, [active, reducedMotion, finish]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Tiffimu brand introduction"
      className="fixed inset-0 z-[200] cursor-pointer overflow-hidden bg-[#cfed94]"
      onClick={finish}
    >
      <div
        aria-hidden
        className="splash-atmosphere pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="splash-grain pointer-events-none absolute inset-0 opacity-20"
      />

      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-contain object-center"
        src={splashMotion.videoSrc}
        muted
        playsInline
        autoPlay
        preload="auto"
        aria-hidden
      />

      <button
        type="button"
        className="absolute top-6 right-5 z-10 rounded-full border border-forest/20 bg-cream/75 px-4 py-2 text-xs font-extrabold tracking-wide text-forest uppercase backdrop-blur-sm sm:right-8"
        onClick={(event) => {
          event.stopPropagation();
          finish();
        }}
      >
        Skip
      </button>

      {/* HTML brand sits in the cleared text zone (right of the walker). */}
      <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
        <div className="flex w-full max-w-5xl items-center px-6 sm:px-10 lg:px-14">
          <div className="w-[42%] shrink-0 sm:w-[38%]" aria-hidden />
          <div className="min-w-0 flex-1">
            <p
              ref={wordmarkRef}
              className="font-display text-[clamp(2.75rem,9.5vw,5.5rem)] leading-none font-extrabold tracking-tight text-forest"
              aria-label={WORDMARK}
            >
              <LetterSpans text={WORDMARK} kind="word" />
            </p>
            <p
              ref={taglineRef}
              className="mt-3 max-w-[22rem] font-sans text-[clamp(0.72rem,2.3vw,1.05rem)] font-extrabold tracking-[0.2em] text-forest uppercase"
              aria-label={SITE.tagline}
            >
              <LetterSpans text={TAGLINE} kind="tag" />
            </p>
          </div>
        </div>
      </div>

      <p className="sr-only">
        Opening animation. The mascot walks in, then the brand name {WORDMARK}{" "}
        and tagline “{SITE.tagline}” appear. Press Escape or Skip to continue.
      </p>
    </div>
  );
}
