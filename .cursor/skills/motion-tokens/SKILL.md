---
name: motion-tokens
description: Define, centralize, apply, or audit motion design tokens for this project. Use for CSS animation variables, durations, easing curves, movement distances, stagger values, spring settings, GSAP defaults, R3F transitions, reduced-motion overrides, or inconsistent animation timing across components.
---

# Motion Tokens

Create one coherent motion language for this site. Apply `.cursor/rules/40-frontend-ui-ux.mdc` and `50-motion-and-animation.mdc`.

## Inspect before defining

1. Find existing design tokens, CSS layers, Tailwind/theme configuration, animation utilities, GSAP defaults, motion-library configuration, and component conventions.
2. Reuse established names and values when they are intentional.
3. Inventory repeated durations, easings, distances, staggers, and springs.
4. Identify conflicts where multiple systems control the same property.
5. Do not silently replace existing motion across the site.

## Define a small semantic scale

If no system exists, begin with this project starter set and tune it through browser testing:

```css
:root {
  --motion-duration-instant: 80ms;
  --motion-duration-fast: 160ms;
  --motion-duration-base: 240ms;
  --motion-duration-slow: 400ms;
  --motion-duration-narrative: 700ms;

  --motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --motion-ease-enter: cubic-bezier(0, 0, 0, 1);
  --motion-ease-exit: cubic-bezier(0.3, 0, 1, 1);
  --motion-ease-emphasized: cubic-bezier(0.2, 0, 0, 1.2);

  --motion-distance-xs: 4px;
  --motion-distance-sm: 8px;
  --motion-distance-md: 16px;
  --motion-distance-lg: 32px;

  --motion-stagger-fast: 40ms;
  --motion-stagger-base: 80ms;

  --motion-spring-snappy-stiffness: 420;
  --motion-spring-snappy-damping: 34;
  --motion-spring-gentle-stiffness: 180;
  --motion-spring-gentle-damping: 24;
}
```

Treat these as design defaults, not laws. Keep only tokens the project actually uses.

## Choose tokens by purpose

- **Instant:** press, toggle, and direct manipulation feedback.
- **Fast:** hover, focus, tooltip, and small state changes.
- **Base:** ordinary enter/exit and component state transitions.
- **Slow:** deliberate layout continuity or a larger reveal.
- **Narrative:** rare hero/story sequences, always interruptible.
- **Standard ease:** movement between visible states.
- **Enter ease:** decelerate into view.
- **Exit ease:** accelerate out of view.
- **Spring:** gesture or spatial continuity where overshoot is useful.

Do not give every animation the same duration. Scale distance and duration with the visual change while keeping frequent interactions quick.

## Integrate across systems

- Use CSS custom properties directly in CSS transitions and keyframes.
- Put JavaScript-only numeric values in one typed `motion` module rather than scattering literals.
- If CSS and TypeScript must mirror values, document the source of truth and add a small parity test or generation step.
- Configure GSAP defaults from the shared module and override only for a stated reason.
- Map component-motion springs to named spring tokens.
- Use the same semantic names for Three.js/R3F camera or object transitions, while keeping per-frame interpolation frame-rate independent.
- Never use a CSS easing string as an unvalidated substitute for a physics spring.

Example:

```css
.interactive-card {
  transition:
    transform var(--motion-duration-fast) var(--motion-ease-standard),
    opacity var(--motion-duration-fast) var(--motion-ease-standard);
}
```

## Define reduced-motion behavior

Apply `$reduced-motion-a11y`. Prefer component-level static end states. When token overrides are useful:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-distance-xs: 0px;
    --motion-distance-sm: 0px;
    --motion-distance-md: 0px;
    --motion-distance-lg: 0px;
  }
}
```

Do not globally zero every duration if doing so breaks callbacks, progress feedback, or component logic.

## Audit and verify

- Replace unexplained one-off values only when their behavior maps cleanly to a token.
- Keep an intentional exception if changing it harms the interaction; document why.
- Test rapid input, interruption, reversal, touch, keyboard, normal motion, and reduced motion.
- Check that animations do not fight, delay navigation, shift layout, or obscure content.
- Report token files changed, migrated components, intentional exceptions, and browser checks run.
