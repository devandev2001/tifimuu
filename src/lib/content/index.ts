import { getContentRepository } from "./repository";
import type { SiteContent } from "./types";

export type { SiteContent, ContentRepository, SiteSettings } from "./types";
export { createDefaultSiteContent } from "./defaults";
export {
  CONTENT_STORAGE_KEY,
  createHttpContentRepository,
  createLocalContentRepository,
  getContentRepository,
  isSiteContent,
} from "./repository";

export async function loadSiteContent(): Promise<SiteContent> {
  return getContentRepository().load();
}

export async function saveSiteContent(
  content: SiteContent,
): Promise<SiteContent> {
  return getContentRepository().save(content);
}

export async function resetSiteContent(): Promise<SiteContent> {
  return getContentRepository().reset();
}
