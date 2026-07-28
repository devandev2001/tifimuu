# Tiffimu — Tiffin Made For You

Marketing site for Tiffimu: home-style tiffin delivery in Kuwait.
Orders go to WhatsApp only — no database, no payments on this site.

## How to run

```bash
cd "/Users/devandev/tiffin website"
npm install
npm run dev
```

Open http://localhost:3000. Stop with `Ctrl + C`.

Production build:

```bash
npm run build
npm run start
```

## What you must set before launch

1. **WhatsApp link** — copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/965XXXXXXXX
```

   Or edit the fallback in `src/lib/config.ts` (`WHATSAPP_URL`).

2. **Plan prices** — in `src/lib/config.ts`, replace the `"XX"` placeholders on Budget / Executive / Premium.

3. **Contact placeholders** — phone, email, Instagram in the same file.

## Where things live

- `src/lib/config.ts` — brand, WhatsApp, plans, story, contact
- `src/lib/menu.ts` — weekly menu + dish photo paths
- `public/characters/` — transparent mascot PNGs + logo
- `public/menu/` — meal and dessert photos
- `src/components/MascotCharacter.tsx` — idle + entrance motion for mascots
- `src/components/hero/` — 3D interactive tiffin (R3F) + poster fallback
- `assets/source/` — untouched original artwork
- `scripts/prepare-images.py` — regenerates transparent characters

## Notes

- Character motion uses PNGs until a 3D GLB mascot is available.
- Reduced-motion visitors get a static mascot and a static tiffin poster (3D paused).
- Friday is off; Saturday is 6-day plan only.
