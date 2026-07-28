---
name: scroll-motion
description: Design, implement, debug, or clean up scroll-driven motion in this project using CSS scroll-driven animations first, then GSAP ScrollTrigger when sequencing or pinning requires it, with optional Lenis integration. Use for parallax, scrubbed timelines, pinned storytelling, scroll-linked Three.js cameras, route cleanup, or smooth scrolling.
---

# Scroll Motion

Build on native scrolling and use the smallest animation system. Apply `.cursor/rules/40-frontend-ui-ux.mdc` and `50-motion-and-animation.mdc`, then apply `$reduced-motion-a11y`.

## Choose the technology

Use this order:

1. **CSS sticky positioning, transitions, and scroll-driven animations** for simple reveal, progress, and transform effects.
2. **Intersection Observer plus the existing UI animation system** for enter/exit triggers that do not need continuous scroll progress.
3. **GSAP + ScrollTrigger** for coordinated timelines, complex pinning, SVG sequencing, or synchronizing DOM and Three.js values.
4. **Lenis** only when the user explicitly wants smooth scrolling and native scroll is insufficient.

Do not let CSS, GSAP, and a frame loop control the same property.

## Start with CSS

- Use `animation-timeline: view()` or `scroll()` only after checking the current supported-browser matrix.
- Put `animation-timeline` after the `animation` shorthand because the shorthand resets it.
- Wrap enhanced behavior in `@supports` and provide a stable fallback.
- Animate `transform` and `opacity`; avoid layout-changing properties.
- Remove optional scroll timelines under `prefers-reduced-motion: reduce`.
- Use native `position: sticky` before JavaScript pinning.

## Use ScrollTrigger deliberately

1. Confirm GSAP and its React integration are already installed or justify adding them.
2. Register `ScrollTrigger` explicitly once in the client bundle.
3. Scope selectors to a component ref.
4. Prefer `@gsap/react`'s `useGSAP` when the project uses it; otherwise use `gsap.context`.
5. Build one labeled timeline for a narrative section rather than many competing triggers.
6. Use `gsap.matchMedia()` for responsive and reduced-motion variants.
7. Keep `markers` development-only.
8. Refresh ScrollTrigger after fonts, images, models, or layout changes that alter measurements.

When pinning:

- pin a stable wrapper and animate its child, not the pinned element itself;
- avoid nested pins unless the relationship is explicit;
- reserve space to prevent jumps;
- test back/forward navigation, refresh at a scrolled position, mobile browser chrome, and orientation changes;
- never prevent users from escaping a pinned section.

Use a component-scoped React pattern:

```tsx
const section = useRef<HTMLElement>(null)

useGSAP(
  () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: section.current,
        start: 'top top',
        end: '+=150%',
        scrub: true,
        pin: true,
      },
    }).to('[data-motion-target]', { yPercent: -20, ease: 'none' })
  },
  { scope: section },
)
```

Keep the pinned wrapper stable and place `data-motion-target` on a child. Let `useGSAP` revert the scoped animation on unmount. Use project motion tokens instead of copying the example distance and scroll range unchanged.

## Coordinate with R3F

- Let ScrollTrigger own one normalized progress value or a GSAP-controlled Three.js property.
- Read mutable progress from `useFrame`; do not set React state on every scroll event.
- Make camera positions and model transforms responsive rather than hard-coded to one viewport.
- Pause or simplify the 3D scene when its section is off-screen.
- Keep DOM content and controls independent of canvas rendering.

## Add Lenis only when approved

Do not add Lenis merely because a reference site feels smooth. If used:

- use one root Lenis instance for the app;
- disable its automatic RAF when GSAP's ticker drives it;
- convert GSAP ticker seconds to Lenis milliseconds;
- update ScrollTrigger from Lenis scroll events;
- remove ticker callbacks and scroll subscriptions on cleanup;
- destroy the owned Lenis instance when its provider is permanently removed;
- disable interpolation for reduced-motion users;
- preserve anchor links, focus scrolling, history restoration, keyboard scrolling, and touch behavior;
- call `ScrollTrigger.refresh()` after relevant route/layout changes.

Do not run a Lenis RAF and an independent application RAF for the same instance.

For a directly owned Lenis instance, follow this lifecycle shape:

```ts
const lenis = new Lenis({ autoRaf: false })
const update = (timeInSeconds: number) => lenis.raf(timeInSeconds * 1000)
const syncScrollTrigger = () => ScrollTrigger.update()

lenis.on('scroll', syncScrollTrigger)
gsap.ticker.add(update)

return () => {
  gsap.ticker.remove(update)
  lenis.off('scroll', syncScrollTrigger)
  lenis.destroy()
}
```

If a shared provider owns Lenis, clean up only the component subscription; do not destroy the provider's instance.

## Clean up by ownership

On route change or unmount:

- revert the component's GSAP context or `useGSAP` scope;
- kill only ScrollTriggers created by that component, not every trigger in the application;
- remove media-query contexts, observers, listeners, ticker callbacks, and timers;
- cancel pending RAF work;
- restore temporary inline styles when required;
- leave shared providers alive only when another mounted route owns them.

## Verify

Test normal and reduced motion, mouse wheel, trackpad, keyboard, touch, anchors, browser back/forward, direct navigation, refresh mid-page, resize, orientation, slow devices, and route transitions.

Inspect for:

- scroll jacking, focus loss, broken history restoration, and inaccessible pinned content;
- layout shift, blank gaps, overlapping sections, and stale pin spacers;
- duplicate triggers/listeners after repeated navigation;
- long tasks, layout thrashing, dropped frames, and noisy console output.

Report the selected technology and why simpler options were insufficient.
