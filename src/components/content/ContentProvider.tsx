"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createDefaultSiteContent,
  loadSiteContent,
  resetSiteContent,
  saveSiteContent,
} from "@/lib/content";
import type { SiteContent } from "@/lib/content";

type ContentContextValue = {
  content: SiteContent;
  ready: boolean;
  saving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  save: (next: SiteContent) => Promise<void>;
  reset: () => Promise<void>;
  whatsAppLink: (message: string) => string;
};

const ContentContext = createContext<ContentContextValue | null>(null);

function buildWhatsAppLink(whatsappUrl: string, message: string): string {
  const base = whatsappUrl.replace(/\/$/, "");
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}text=${encodeURIComponent(message)}`;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() =>
    createDefaultSiteContent(),
  );
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const next = await loadSiteContent();
      setContent(next);
      setError(null);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load site content.",
      );
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(async (next: SiteContent) => {
    setSaving(true);
    setError(null);
    try {
      const saved = await saveSiteContent(next);
      setContent(saved);
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Could not save site content.";
      setError(message);
      throw cause;
    } finally {
      setSaving(false);
    }
  }, []);

  const reset = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const defaults = await resetSiteContent();
      setContent(defaults);
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Could not reset site content.";
      setError(message);
      throw cause;
    } finally {
      setSaving(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      content,
      ready,
      saving,
      error,
      refresh,
      save,
      reset,
      whatsAppLink: (message: string) =>
        buildWhatsAppLink(content.settings.whatsappUrl, message),
    }),
    [content, ready, saving, error, refresh, save, reset],
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useSiteContent(): ContentContextValue {
  const value = useContext(ContentContext);
  if (!value) {
    throw new Error("useSiteContent must be used within ContentProvider");
  }
  return value;
}

export function useOptionalSiteContent(): ContentContextValue | null {
  return useContext(ContentContext);
}
