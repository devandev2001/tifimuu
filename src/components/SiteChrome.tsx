"use client";

import { useCallback, useEffect, useState } from "react";
import { EntranceProvider } from "@/components/motion/EntranceContext";
import { PageEntrance } from "@/components/motion/PageEntrance";
import { VideoBrandSplash } from "@/components/VideoBrandSplash";

function unlockPageScroll() {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}

/**
 * Video opening splash, then a normal continuously scrolling page.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [playEntrance, setPlayEntrance] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  const onReveal = useCallback(() => {
    setPlayEntrance(true);
  }, []);

  const onFinished = useCallback(() => {
    unlockPageScroll();
    setSplashDone(true);
  }, []);

  // Fail-safe for phones: never leave the site invisible or scroll-locked.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPlayEntrance(true);
      setSplashDone(true);
      unlockPageScroll();
    }, 5500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <EntranceProvider playEntrance={playEntrance}>
      {!splashDone ? (
        <VideoBrandSplash onReveal={onReveal} onFinished={onFinished} />
      ) : null}
      <PageEntrance>{children}</PageEntrance>
    </EntranceProvider>
  );
}
