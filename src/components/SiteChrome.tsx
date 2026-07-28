"use client";

import { EntranceProvider } from "@/components/motion/EntranceContext";
import { PageEntrance } from "@/components/motion/PageEntrance";

/**
 * Light page chrome — site opens immediately (no walking splash).
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <EntranceProvider playEntrance>
      <PageEntrance>{children}</PageEntrance>
    </EntranceProvider>
  );
}
