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
  splashStepCount,
  splashWalkStartX,
} from "@/lib/motion";
import { WalkingMascot } from "@/components/splash/WalkingMascot";
import { SplashRiveWalk } from "@/components/splash/SplashRiveWalk";

gsap.registerPlugin(useGSAP);

type BrandSplashProps = {
  /** Fired when the dissolve starts — page entrance begins underneath. */
  onReveal: () => void;
  /** Fired after the splash is fully gone and may unmount. */
  onFinished: () => void;
};

type SplashEngine = "detecting" | "rive" | "html";

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

function burstDust(nodes: HTMLElement[]) {
  nodes.forEach((node, index) => {
    gsap.killTweensOf(node);
    gsap.fromTo(
      node,
      { opacity: 0.55, x: 0, y: 0, scale: 0.35 },
      {
        opacity: 0,
        x: (index - (nodes.length - 1) / 2) * 14,
        y: -18 - index * 3,
        scale: 1.15,
        duration: 0.42,
        ease: "power2.out",
      },
    );
  });
}

/**
 * Opening splash:
 * 1) Prefer mascot.riv (Main / SM Mascot / WELCOME → Walk → Turn → Idle)
 * 2) Fall back to HTML 8-frame walk + GSAP if the riv cannot load
 * Character ends left of the HTML “Tiffimu” wordmark; cook reveal stays Alone.
 */
export function BrandSplash({ onReveal, onFinished }: BrandSplashProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState(true);
  const [engine, setEngine] = useState<SplashEngine>("detecting");
  const [sideReady, setSideReady] = useState(false);
  const [frontReady, setFrontReady] = useState(false);
  const [riveReady, setRiveReady] = useState(false);
  const revealedRef = useRef(false);
  const finishedRef = useRef(false);
  const imageReady = sideReady && frontReady;
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
    setActive(false);
    onFinished();
  }, [onFinished, reveal]);

  /**
   * Rive path: time brand text with the character’s Turn beat.
   * Wordmark as she settles → tagline while she faces the camera.
   */
  const playRiveBrandSync = useCallback(() => {
    const root = rootRef.current;
    const wordLetters = wordmarkRef.current?.querySelectorAll(
      '[data-splash-letter="word"]',
    );
    const tagLetters = taglineRef.current?.querySelectorAll(
      '[data-splash-letter="tag"]',
    );
    if (!root || !wordLetters?.length || !tagLetters?.length) {
      finish();
      return;
    }

    timelineRef.current?.kill();
    const timeline = gsap.timeline({
      defaults: { ease: motionEases.enter },
    });
    timelineRef.current = timeline;

    timeline.to(
      wordLetters,
      {
        opacity: 1,
        y: 0,
        duration: motionDurations.slow,
        stagger: splashMotion.letterStagger,
      },
      splashMotion.riveWordmarkAt,
    );

    timeline.to(
      tagLetters,
      {
        opacity: 1,
        y: 0,
        duration: motionDurations.slow,
        stagger: splashMotion.taglineStagger,
      },
      splashMotion.riveTaglineAt,
    );

    timeline.to(
      {},
      { duration: splashMotion.holdAfterTagline },
      splashMotion.riveTaglineAt + motionDurations.slow,
    );
    timeline.add(reveal);
    timeline.to(root, {
      opacity: 0,
      duration: motionDurations.slow,
      ease: motionEases.standard,
      onComplete: finish,
    });
  }, [finish, reveal]);

  const onRiveReady = useCallback(() => {
    setEngine("rive");
  }, []);

  const onRiveUnavailable = useCallback(() => {
    setEngine("html");
  }, []);

  const onRiveComplete = useCallback(() => {
    setRiveReady(true);
  }, []);

  useEffect(() => {
    if (engine !== "detecting") return;
    const timer = window.setTimeout(() => {
      // Only fall back if Rive never became ready (load hang / missing file).
      setEngine((current) => (current === "detecting" ? "html" : current));
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [engine]);

  /** Kick off wordmark → turn-timed tagline once Rive WELCOME is playing. */
  useEffect(() => {
    if (engine !== "rive" || reducedMotion || !active) return;
    playRiveBrandSync();
    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [active, engine, playRiveBrandSync, reducedMotion]);

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
  }, [active, reducedMotion, engine]);

  useLayoutEffect(() => {
    if (!active || engine !== "html") return;
    const walker = walkerRef.current;
    const body = walker?.querySelector<HTMLElement>("[data-splash-body]");
    const turn = walker?.querySelector<HTMLElement>("[data-splash-turn]");
    const side = walker?.querySelector<HTMLElement>('[data-splash-pose="side"]');
    const front = walker?.querySelector<HTMLElement>(
      '[data-splash-pose="front"]',
    );
    const walkFrames = walker
      ? Array.from(
          walker.querySelectorAll<HTMLElement>("[data-splash-walk-frame]"),
        )
      : [];
    const shadow = walker?.querySelector<HTMLElement>("[data-splash-shadow]");
    if (!walker || !body || !turn || !side || !front || !shadow) return;

    if (reducedMotion) {
      gsap.set(walker, { x: 0, opacity: 1 });
      gsap.set([body, turn], { clearProps: "transform" });
      gsap.set(side, { autoAlpha: 0 });
      gsap.set(front, { autoAlpha: 1 });
      walkFrames.forEach((frame) => {
        frame.style.opacity = "0";
        frame.style.visibility = "hidden";
      });
      return;
    }

    gsap.set(walker, {
      x: splashWalkStartX(window.innerWidth),
      opacity: 1,
    });
    gsap.set(body, {
      y: 0,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
      transformOrigin: "50% 100%",
    });
    gsap.set(turn, { rotateY: 0 });
    gsap.set(side, { autoAlpha: 1, rotateY: 0 });
    gsap.set(front, { autoAlpha: 0, rotateY: -90 });
    walkFrames.forEach((frame, index) => {
      frame.style.opacity = index === 0 ? "1" : "0";
      frame.style.visibility = index === 0 ? "visible" : "hidden";
    });
    gsap.set(shadow, { scaleX: 1, opacity: 0.28 });
  }, [active, reducedMotion, engine]);

  useEffect(() => {
    if (engine !== "html" || imageReady) return;
    const timer = window.setTimeout(() => {
      setSideReady(true);
      setFrontReady(true);
    }, splashMotion.imageReadyFallbackMs);
    return () => window.clearTimeout(timer);
  }, [engine, imageReady]);

  useGSAP(
    () => {
      if (engine !== "html") return;

      const root = rootRef.current;
      const walker = walkerRef.current;
      const body = walker?.querySelector<HTMLElement>("[data-splash-body]");
      const turn = walker?.querySelector<HTMLElement>("[data-splash-turn]");
      const side = walker?.querySelector<HTMLElement>(
        '[data-splash-pose="side"]',
      );
      const front = walker?.querySelector<HTMLElement>(
        '[data-splash-pose="front"]',
      );
      const walkFrames = walker
        ? Array.from(
            walker.querySelectorAll<HTMLElement>("[data-splash-walk-frame]"),
          )
        : [];
      const shadow = walker?.querySelector<HTMLElement>("[data-splash-shadow]");
      const dustNodes = walker
        ? Array.from(
            walker.querySelectorAll<HTMLElement>("[data-splash-dust]"),
          )
        : [];
      const wordLetters = wordmarkRef.current?.querySelectorAll(
        '[data-splash-letter="word"]',
      );
      const tagLetters = taglineRef.current?.querySelectorAll(
        '[data-splash-letter="tag"]',
      );

      if (
        !root ||
        !walker ||
        !body ||
        !turn ||
        !side ||
        !front ||
        !shadow ||
        walkFrames.length < 2 ||
        !wordLetters?.length ||
        !tagLetters?.length ||
        !imageReady
      ) {
        return;
      }

      if (reducedMotion) {
        gsap.set(walker, { x: 0, opacity: 1 });
        gsap.set(side, { autoAlpha: 0 });
        gsap.set(front, { autoAlpha: 1 });
        gsap.set(walkFrames, { autoAlpha: 0 });
        gsap.set([wordLetters, tagLetters], { opacity: 1, y: 0 });
        const timer = window.setTimeout(finish, splashMotion.reducedHoldMs);
        return () => window.clearTimeout(timer);
      }

      const startX = splashWalkStartX(window.innerWidth);
      const steps = splashStepCount();
      const stepPeriod = splashMotion.walkDuration / steps;
      const frameCount = walkFrames.length;

      const showWalkFrame = (index: number) => {
        const i = ((index % frameCount) + frameCount) % frameCount;
        walkFrames.forEach((frame, frameIndex) => {
          frame.style.opacity = frameIndex === i ? "1" : "0";
          frame.style.visibility = frameIndex === i ? "visible" : "hidden";
        });
      };

      gsap.set(root, { opacity: 1 });
      gsap.set(walker, { x: startX, opacity: 1 });
      gsap.set(body, {
        y: 0,
        rotate: splashMotion.stepLean,
        scaleX: 1,
        scaleY: 1,
        transformOrigin: "50% 100%",
      });
      gsap.set(turn, { rotateY: 0, transformOrigin: "50% 50%" });
      gsap.set(side, { autoAlpha: 1, rotateY: 0 });
      gsap.set(front, { autoAlpha: 0, rotateY: -95 });
      showWalkFrame(0);
      gsap.set(shadow, { scaleX: 1, opacity: 0.28 });
      gsap.set(wordLetters, { opacity: 0, y: motionDistances.md });
      gsap.set(tagLetters, { opacity: 0, y: motionDistances.sm });

      const frameState = { i: 0 };
      const frameTween = gsap.to(frameState, {
        i: Math.max(
          frameCount,
          Math.round(
            splashMotion.walkDuration / splashMotion.walkFramePeriod,
          ),
        ),
        duration: splashMotion.walkDuration,
        ease: "none",
        onUpdate: () => showWalkFrame(Math.floor(frameState.i)),
      });

      const stepLoop = gsap.timeline({ repeat: steps - 1 });
      stepLoop
        .to(body, {
          y: -splashMotion.stepLift,
          scaleY: splashMotion.stepStretch,
          scaleX: 0.992,
          rotate: -splashMotion.stepLean,
          duration: stepPeriod * 0.42,
          ease: "power2.out",
        })
        .to(
          shadow,
          {
            scaleX: 0.78,
            opacity: 0.16,
            duration: stepPeriod * 0.42,
            ease: "power2.out",
          },
          "<",
        )
        .to(body, {
          y: 0,
          scaleY: splashMotion.stepSquash,
          scaleX: 1.015,
          rotate: splashMotion.stepLean,
          duration: stepPeriod * 0.5,
          ease: "power2.in",
          onStart: () => burstDust(dustNodes),
        })
        .to(
          shadow,
          {
            scaleX: 1.06,
            opacity: 0.34,
            duration: stepPeriod * 0.5,
            ease: "power2.in",
          },
          "<",
        )
        .to(body, {
          scaleY: 1,
          scaleX: 1,
          duration: stepPeriod * 0.08,
          ease: "power1.out",
        });

      const timeline = gsap.timeline({
        defaults: { ease: motionEases.enter },
      });
      timelineRef.current = timeline;
      timeline.add(frameTween, 0);
      timeline.add(stepLoop, 0);

      timeline.to(
        walker,
        {
          x: 0,
          duration: splashMotion.walkDuration,
          ease: "none",
        },
        0,
      );

      timeline.add(() => {
        frameTween.pause();
        stepLoop.pause(0);
        showWalkFrame(0);
        gsap.set(body, { y: 0, rotate: 0, scaleX: 1, scaleY: 1 });
        gsap.set(shadow, { scaleX: 1, opacity: 0.26 });
      }, splashMotion.walkDuration);

      timeline.to(
        wordLetters,
        {
          opacity: 1,
          y: 0,
          duration: motionDurations.slow,
          stagger: splashMotion.letterStagger,
        },
        splashMotion.walkDuration + 0.05,
      );

      const turnAt = splashMotion.walkDuration + 0.28;

      // Settle pose, then turn to face the viewer.
      timeline.to(
        body,
        {
          y: -4,
          scaleY: 1.02,
          duration: 0.18,
          ease: "power2.out",
        },
        turnAt - 0.12,
      );
      timeline.to(
        body,
        {
          y: 0,
          scaleY: 1,
          duration: 0.16,
          ease: "power2.in",
        },
        turnAt - 0.02,
      );

      timeline.to(
        turn,
        {
          rotateY: 12,
          duration: splashMotion.turnDuration,
          ease: "power2.inOut",
        },
        turnAt,
      );
      timeline.to(
        side,
        {
          rotateY: 90,
          autoAlpha: 0,
          duration: splashMotion.turnDuration,
          ease: "power2.inOut",
        },
        turnAt,
      );
      timeline.fromTo(
        front,
        { rotateY: -95, autoAlpha: 0, scale: 0.96 },
        {
          rotateY: 0,
          autoAlpha: 1,
          scale: 1,
          duration: splashMotion.turnDuration,
          ease: "power2.inOut",
        },
        turnAt,
      );

      // Tagline lands as she finishes facing you.
      timeline.to(
        tagLetters,
        {
          opacity: 1,
          y: 0,
          duration: motionDurations.slow,
          stagger: splashMotion.taglineStagger,
        },
        turnAt + splashMotion.turnDuration * 0.45,
      );

      timeline.to(
        {},
        { duration: splashMotion.holdAfterTagline },
        turnAt + splashMotion.turnDuration + 0.12,
      );
      timeline.add(reveal);
      timeline.to(root, {
        opacity: 0,
        duration: motionDurations.slow,
        ease: motionEases.standard,
        onComplete: finish,
      });

      return () => {
        frameTween.kill();
        stepLoop.kill();
        timeline.kill();
        dustNodes.forEach((node) => gsap.killTweensOf(node));
        if (timelineRef.current === timeline) {
          timelineRef.current = null;
        }
      };
    },
    {
      scope: rootRef,
      dependencies: [reducedMotion, finish, reveal, imageReady, engine],
    },
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
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
    if (!active || !reducedMotion) return;
    if (engine === "detecting") return;
    const timer = window.setTimeout(finish, splashMotion.reducedHoldMs);
    return () => window.clearTimeout(timer);
  }, [active, reducedMotion, engine, finish]);

  if (!active) return null;

  const showRive = engine === "detecting" || engine === "rive";
  const showHtml = engine === "html";

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Tiffimu brand introduction"
      className="fixed inset-0 z-[200] flex cursor-pointer items-center justify-center overflow-hidden bg-lime"
      onClick={finish}
    >
      <div
        aria-hidden
        className="splash-atmosphere pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="splash-grain pointer-events-none absolute inset-0 opacity-25"
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

      <div className="relative flex w-full max-w-3xl items-end justify-center gap-1 px-4 sm:gap-2 sm:px-6">
        {showRive ? (
          <div
            className="relative shrink-0"
            style={{ width: "min(42vw, 240px)", height: "min(58vw, 400px)" }}
          >
            <SplashRiveWalk
              className="absolute inset-0 h-full w-full"
              onReady={onRiveReady}
              onComplete={onRiveComplete}
              onUnavailable={onRiveUnavailable}
            />
          </div>
        ) : null}

        {showHtml ? (
          <WalkingMascot
            ref={walkerRef}
            onSideReady={() => setSideReady(true)}
            onFrontReady={() => setFrontReady(true)}
            className="w-[min(42vw,220px)] sm:w-[240px]"
          />
        ) : null}

        <div className="min-w-0 pb-3 sm:pb-5">
          <p
            ref={wordmarkRef}
            className="font-display text-[clamp(2.6rem,9.5vw,4.75rem)] leading-none font-extrabold tracking-tight text-forest"
            aria-label={WORDMARK}
          >
            <LetterSpans text={WORDMARK} kind="word" />
          </p>
          <p
            ref={taglineRef}
            className="mt-3 max-w-[20rem] font-sans text-[clamp(0.72rem,2.4vw,1rem)] font-extrabold tracking-[0.2em] text-forest uppercase"
            aria-label={SITE.tagline}
          >
            <LetterSpans text={TAGLINE} kind="tag" />
          </p>
        </div>
      </div>

      <p className="sr-only">
        Opening animation. The mascot walks in beside Tiffimu, turns to face
        you, then the tagline “{SITE.tagline}” appears. Press Escape or Skip to
        continue.
        {riveReady ? " Rive welcome sequence loaded." : ""}
      </p>
    </div>
  );
}
