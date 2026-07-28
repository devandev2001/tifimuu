/**
 * Backend handoff for the Tiffimu control panel
 * ==============================================
 *
 * Frontend is ready. Content is saved in the browser (localStorage) today.
 * When you build the backend, keep this SiteContent JSON shape and swap one function.
 *
 * 1. Content shape
 *    See: src/lib/content/types.ts → SiteContent
 *    Includes: settings, panels, menu, plans
 *
 * 2. Switch storage
 *    File: src/lib/content/repository.ts
 *    Change getContentRepository() from createLocalContentRepository()
 *    to createHttpContentRepository() (already stubbed).
 *
 * 3. Suggested API
 *    GET  /api/content        → SiteContent
 *    PUT  /api/content        → body SiteContent, returns SiteContent
 *    POST /api/content/reset  → SiteContent (seed defaults)
 *
 * 4. Auth (required before public deploy)
 *    Protect /admin and /api/content with login.
 *    The UI has no password yet on purpose.
 *
 * 5. Optional later
 *    Image upload endpoint → store files, return public URL for image path fields.
 */
export {};
