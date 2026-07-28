# Gaps vs ideal Blender / PSD Rive workflow

## What shipped (2026-07-27)

- `public/rive/mascot.riv` (~1.83 MB) — artboard **Main**, state machine **Mascot**
- Flow: **Ready → WELCOME → Welcome (3s flipbook) → Turn → Idle**
- Triggers: `WELCOME`, `IDLE`, `RESET` + adventure hooks
- Technique: **8-frame walk flipbook** from cleaned walk PNGs + front still turn/idle
- Built via RiveMCP `assemble_sprite_animation` + hand-authored SM (not bone IK)
- Splash: `BrandSplash` prefers `SplashRiveWalk`; **HTML flipbook + GSAP is automatic fallback** if riv fails to paint
- Adventure: `MascotRiveCanvas` (same contract)
- Cook reveal / AnimatedFoodHero: untouched

## Honesty — not a Pixar bone rig

Flat PNG sources only. No PSD/Blender. `assemble_character` schema blocked layered bone assembly. This is a **real walk cycle via flipbook**, not limb IK.

## Blockers

1. **RiveMCP `export_riv` trial exhausted (3/3)** — need `POLYMATION_LICENSE_KEY` from https://polymation.stunning.gg for official export/optimize. File on disk is a `save_session` checkpoint (structurally valid).
2. **No layered PSD** — bone IK / springs / mesh skin need that (or fixed assemble pipeline).
3. If checkpoint riv fails to paint in browser, splash falls back to HTML walk (same visual intent).

## Preview

- Dev server: `http://127.0.0.1:3010` (or current Next port)
- Hard-refresh to see splash; Skip anytime
