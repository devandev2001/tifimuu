import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createDefaultSiteContent } from "./defaults";
import type { ContentRepository, SiteContent } from "./types";

export const CONTENT_STORAGE_KEY = "tiffimu.site-content.v3";

function cloneContent(content: SiteContent): SiteContent {
  return structuredClone(content);
}

export function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    record.version === 1 &&
    typeof record.settings === "object" &&
    Array.isArray(record.panels) &&
    Array.isArray(record.menu) &&
    Array.isArray(record.plans)
  );
}

/**
 * Browser repository — saves edits in this device’s localStorage.
 * Swap to `createHttpContentRepository` when the backend is ready.
 */
export function createLocalContentRepository(): ContentRepository {
  return {
    async load() {
      if (typeof window === "undefined") {
        return createDefaultSiteContent();
      }
      try {
        const raw = window.localStorage.getItem(CONTENT_STORAGE_KEY);
        if (!raw) return createDefaultSiteContent();
        const parsed: unknown = JSON.parse(raw);
        if (!isSiteContent(parsed)) return createDefaultSiteContent();
        return cloneContent(parsed);
      } catch {
        return createDefaultSiteContent();
      }
    },

    async save(content) {
      const next: SiteContent = {
        ...cloneContent(content),
        version: 1,
        updatedAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    },

    async reset() {
      const defaults = createDefaultSiteContent();
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(CONTENT_STORAGE_KEY);
      }
      return defaults;
    },
  };
}

/**
 * Future backend adapter — point at your API when ready.
 *
 * Expected endpoints (suggested):
 *   GET  /api/content  → SiteContent
 *   PUT  /api/content  → SiteContent (body: SiteContent)
 *   POST /api/content/reset → SiteContent
 */
export function createHttpContentRepository(
  baseUrl = "/api/content",
): ContentRepository {
  return {
    async load() {
      const response = await fetch(baseUrl, {
        cache: "no-store",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to load content (${response.status})`);
      }
      const parsed: unknown = await response.json();
      if (!isSiteContent(parsed)) {
        throw new Error("Content API returned an unexpected shape");
      }
      return cloneContent(parsed);
    },

    async save(content) {
      const response = await fetch(baseUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(content),
      });
      if (!response.ok) {
        throw new Error(`Failed to save content (${response.status})`);
      }
      const parsed: unknown = await response.json();
      if (!isSiteContent(parsed)) {
        throw new Error("Content API returned an unexpected shape");
      }
      return cloneContent(parsed);
    },

    async reset() {
      const response = await fetch(`${baseUrl}/reset`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to reset content (${response.status})`);
      }
      const parsed: unknown = await response.json();
      if (!isSiteContent(parsed)) {
        throw new Error("Content API returned an unexpected shape");
      }
      return cloneContent(parsed);
    },
  };
}

/**
 * Uses Supabase-backed HTTP API when configured; otherwise browser localStorage.
 */
export function getContentRepository(): ContentRepository {
  if (isSupabaseConfigured()) {
    return createHttpContentRepository();
  }
  return createLocalContentRepository();
}
