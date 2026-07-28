---
name: reduced-motion-a11y
description: Make animated, scroll-driven, WebGL, Three.js, R3F, Spline, GSAP, or motion-library UI accessible in this project. Use when adding or reviewing motion, canvas interactions, keyboard controls, prefers-reduced-motion behavior, pause controls, focus behavior, or WCAG 2.2 AA compliance.
---

# Reduced Motion and Accessibility

Make motion optional while preserving function and meaning. Apply `.cursor/rules/40-frontend-ui-ux.mdc` and `50-motion-and-animation.mdc`.

## Classify the experience

Before editing, label the animation or scene:

- **Decorative:** conveys no information and accepts no essential input.
- **Informative:** communicates state, structure, or product details.
- **Interactive:** accepts input or is required to complete a task.

Document what remains when motion and 3D are disabled.

## Preserve an HTML experience

- Keep all essential content, navigation, calls to action, forms, instructions, prices, and state messages in semantic HTML.
- Hide a decorative canvas from the accessibility tree and prevent it from receiving focus.
- Give informative content an equivalent HTML description.
- Build interactive controls as native HTML buttons, inputs, links, or appropriately implemented widgets outside the canvas.
- Provide visible focus, logical focus order, meaningful names, and comfortable touch targets, normally at least 44×44 CSS pixels where practical.
- Never require hover, drag, color, sound, or spatial position as the only way to understand or operate something.

## Implement the preference once

1. Reuse the project's existing reduced-motion hook or utility when present.
2. Otherwise create one central source based on `matchMedia('(prefers-reduced-motion: reduce)')`.
3. Handle server rendering without reading `window`.
4. Subscribe to preference changes and remove the listener during cleanup.
5. Use the same preference for CSS, GSAP, R3F, Spline integration, and other motion systems.
6. Avoid a first-paint burst of motion before the client preference is known.

Always include the CSS baseline:

```css
@media (prefers-reduced-motion: reduce) {
  /* Stop non-essential timelines and use a stable readable state. */
}
```

Do not apply a global rule that breaks functional progress indicators, focus feedback, or component lifecycle events.

## Define the reduced experience

For reduced motion:

- remove parallax, scroll scrubbing, fly-throughs, zooms, large translations, spins, camera shake, autoplayed model clips, particles, and non-essential loops;
- show the important final/static state immediately;
- prefer no animation or a short opacity change;
- keep immediate functional feedback such as pressed, selected, loading, and error states;
- prevent smooth-scroll interpolation and return to native scrolling;
- avoid mounting a heavy continuous 3D scene when a poster communicates the same result;
- preserve all controls and outcomes.

Never merely speed up a disorienting movement.

## Make interactions equivalent

- Provide keyboard commands for any required pointer interaction and document them visibly.
- Do not trap focus inside a canvas.
- Preserve page scrolling when a pointer is over the scene unless an explicit control mode is active.
- Add reset-view and pause/stop controls for user-controlled cameras or ongoing motion.
- Announce important changes through appropriate DOM status text.
- Ensure external controls remain synchronized with scene state without sending per-frame values through React state.

## Meet motion-related WCAG safeguards

- Provide pause, stop, or hide controls for non-essential moving content that starts automatically, lasts more than five seconds, and appears alongside other content.
- Never create content that flashes more than three times in any one-second period.
- Do not make an interaction-triggered animation essential unless the movement is necessary for the function or information.
- Preserve contrast, focus indicators, text zoom, reflow, and keyboard operation in every motion state.

## Verify

Test the production build with:

- operating-system reduced motion enabled and disabled;
- keyboard only, touch only, pointer, screen zoom, and text resizing;
- animation interruption, rapid repeated input, reverse navigation, and route changes;
- JavaScript/3D failure and the static fallback;
- automated accessibility tooling plus manual focus/order/name inspection;
- a screen reader for any custom interactive control or meaningful live status.

Record failures as failures. Do not claim WCAG conformance from an automated scan alone.
