# Adding the animated Tiffimu mascot

Runtime file: `public/rive/mascot.riv` (~1.8 MB).

## Contract

- Artboard: `Main`
- State machine: `Mascot`
- Triggers: `WELCOME`, `IDLE`, `RESET`, plus adventure inputs
  (`MEAL_SELECTED`, `QUEST_COMPLETED`, `PLAN_CHOSEN`, `ORDER_CLICKED`)
- Sequence on `WELCOME`: walk in (~3s flipbook) → turn to front → idle loop

## Site wiring

- Splash: `BrandSplash` → `SplashRiveWalk` (HTML walk fallback if riv fails)
- Adventure: `MascotRiveCanvas`
- About cook reveal: GSAP Alone — do **not** wire `mascot-cook-reveal.riv` without a single full-body layer

## Technique note

Current riv is an **8-frame walk flipbook** + front still (not bone IK). Layered side parts live under `mascot/assets/side/` for a future PSD/Rive-editor pass. See `mascot/GAPS.md`.
