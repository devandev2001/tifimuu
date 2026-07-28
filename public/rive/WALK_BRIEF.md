# Rive mascot walk brief (for animator)

Deliver **one file**: `mascot.riv`  
Place it at: `public/rive/mascot.riv` on the Tiffimu website.

## Character
Use the official Tiffimu 3D mascot (source files preferred).  
Do **not** redraw a new character. Match face, apron, tiffin, tote, and colors.

## Opening performance (WELCOME)
1. **Walk** — side view, facing right, looping walk cycle, holding tiffin  
2. **Move** — character travels left → right across the artboard (or root X is driven by code)  
3. **Stop** at center  
4. **Turn** to face the camera  
5. **Present** — right hand / tiffin above logo area  
6. Hold for tagline

## Technical contract (required)
- Artboard / state machine name: **`Mascot`**
- Trigger: **`WELCOME`** — plays the full walk → turn → present sequence once  
- Trigger: **`IDLE`** — gentle front idle loop after WELCOME  
- Optional later: `MEAL_SELECTED`, `QUEST_COMPLETED`, `PLAN_CHOSEN`, `ORDER_CLICKED`
- Keep loops stoppable for `prefers-reduced-motion` (site will skip motion)

## Delivery checklist
- [ ] `.riv` loads in Rive runtime / preview  
- [ ] `WELCOME` fires the full intro without extra clicks  
- [ ] Walk cycle has clear foot contact (no sliding)  
- [ ] Turn feels continuous (no pop)  
- [ ] File size preferably under ~2–4 MB  

## References to send the animator
- `public/characters/mascot-tiffin-v2.png` (front)  
- `public/characters/mascot-walk-side.png` (side reference)  
- `public/characters/logo.png`  
- Original Blender/Spline/3D source if available  
