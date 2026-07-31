/**
 * Backend handoff for the Tiffimu control panel
 * ==============================================
 *
 * Supabase integration is wired in the app.
 * Until you add project keys, the site stays in localStorage mode.
 *
 * Setup checklist
 * ---------------
 * 1. Create a free project at https://supabase.com
 * 2. Copy Project URL + publishable/anon key into `.env.local`
 *    (see `.env.example`)
 * 3. In Supabase → SQL Editor, run:
 *    `supabase/migrations/20260731000000_site_content.sql`
 * 4. Authentication → Users → Add user (email + password) for yourself
 * 5. Optional: Authentication → Providers → Email
 *    turn off "Confirm email" while testing, or confirm via inbox
 * 6. Restart `npm run dev`, open `/admin/login`, sign in, save content
 *
 * Content shape
 * -------------
 * See: src/lib/content/types.ts → SiteContent
 * Includes: settings, panels, menu, plans
 *
 * Storage switch
 * --------------
 * File: src/lib/content/repository.ts → getContentRepository()
 * Uses HTTP/Supabase when NEXT_PUBLIC_SUPABASE_URL is set,
 * otherwise browser localStorage.
 *
 * API
 * ---
 * GET  /api/content        → SiteContent (public read)
 * PUT  /api/content        → body SiteContent (auth required)
 * POST /api/content/reset  → SiteContent (auth required)
 *
 * Auth
 * ----
 * /admin is protected by Supabase session (via src/proxy.ts)
 * when Supabase env vars are present.
 *
 * Optional later
 * --------------
 * ✅ Image upload to Supabase Storage (admin Upload photo buttons)
 *    Bucket: site-media (public read, authenticated write)
 *    API: POST /api/content/upload
 */
export {};
