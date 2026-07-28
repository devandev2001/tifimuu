# Performance, accessibility, and QA

Test the complete production build. Development-mode timing and a powerful laptop are not proof of user performance.

## Performance targets

Use Core Web Vitals as the page-level floor:

- LCP at or below 2.5 seconds;
- INP at or below 200 milliseconds;
- CLS at or below 0.1;
- evaluate the 75th percentile of real visits when field data exists.

Official thresholds:

- https://web.dev/articles/vitals
- https://web.dev/articles/defining-core-web-vitals-thresholds

Also define a scene-specific frame target before polishing. A reasonable project may target 60 FPS on capable desktops and 30 FPS on its lowest supported mobile tier, but report measured frame time and dropped frames rather than promising a number.

## Measure in layers

1. Measure the DOM-only fallback.
2. Add the renderer and an empty scene.
3. Add the optimized model and base lighting.
4. Add essential motion and input.
5. Add shadows, particles, shaders, physics, and post-processing individually.

Record the cost of each layer. Remove or downgrade the layer that breaks the agreed target.

Check:

- initial JavaScript, model, texture, environment, decoder, and font transfer;
- parse/decode and shader compilation time;
- main-thread long tasks and interaction latency;
- CPU and GPU frame time;
- draw calls, triangles, geometries, textures, programs, and render targets;
- device pixel ratio and canvas pixel dimensions;
- layout shift while the scene loads;
- memory before/after repeated navigation;
- battery/thermal behavior during continuous animation where practical.

## Runtime scaling

Prefer measured adaptation over device-name checks:

- cap or dynamically lower device pixel ratio;
- disable or reduce post-processing, real-time shadows, reflections, particles, and light count;
- select a lower LOD or texture set;
- reduce physics frequency/complexity;
- use on-demand rendering when nothing moves;
- pause off-screen scenes and hidden tabs;
- stop decorative animation after a sensible period where appropriate.

Maintain the same content and controls at every quality tier. Degrading graphics must not remove the user's ability to complete the task.

## Accessibility

### Decorative scene

- Keep the canvas out of the accessibility tree when it conveys no information.
- Provide no keyboard trap.
- Ensure pointer tracking does not interfere with scrolling or selection.
- Disable large movement, parallax, camera travel, and continuous motion in reduced-motion mode.

### Informative or interactive scene

- Provide a concise accessible name/description and an HTML equivalent for important information.
- Put controls in semantic HTML with visible labels, focus states, and keyboard operation.
- Do not rely on color, sound, hover, drag, or 3D position alone.
- Preserve native touch scrolling unless a deliberate control is active.
- Announce important state changes through suitable DOM status text, not the canvas.
- Provide reset-view and pause/stop controls when ongoing motion or camera changes can disorient users.
- Keep focus order aligned with the visual task.

### Reduced motion

Use `prefers-reduced-motion: reduce` in CSS and `matchMedia` or the framework's supported hook in JavaScript.

In reduced-motion mode:

- replace fly-throughs, spins, zooms, parallax, and scroll-scrubbing with a static end state or small opacity transition;
- stop non-essential loops and particles;
- keep immediate functional feedback;
- never require the user to watch motion to reveal content.

Test the operating-system setting, not only a developer override.

Official W3C technique:

- https://www.w3.org/WAI/WCAG21/Techniques/css/C39

## Functional matrix

| Area | Required checks |
| --- | --- |
| Loading | Fast/slow network, cached/uncached, decoder load, broken model/texture, timeout or route change |
| Input | Mouse, touch, keyboard, wheel/trackpad, zoom, scroll while pointer is over canvas |
| Layout | Small phone, tablet, desktop, landscape, 200% browser zoom, resize and orientation change |
| Motion | Normal, reduced motion, rapid repeated input, reverse/interruption, navigation during animation |
| Lifecycle | Mount/unmount repeatedly, route back/forward, scene replacement, tab background/foreground |
| Browsers | Project-supported Chromium, Safari/WebKit, and Firefox; WebGPU and fallback paths separately |
| Content | No-JS/static fallback, canvas failure, readable contrast, HTML CTA usable above the scene |
| Errors | WebGL context loss where feasible, asset CORS failure, unsupported extension, low-memory behavior |

## Browser verification

- Use production builds and automated browser tests for smoke coverage.
- Use browser performance tooling for timelines, Core Web Vitals, screenshots, console errors, network waterfalls, and memory.
- Test at least one constrained CPU/network profile and, when the audience includes mobile, one real lower-end mobile device.
- Compare screenshots at stable animation timestamps or disable motion for visual regression tests.
- Watch the console for shader, color-space, texture, CORS, hydration, and context warnings.
- Re-run tests after asset optimization; compression can change materials, tangents, skinning, and animation.

## Release gate

Do not release until:

- the production build and existing checks pass;
- there are no uncaught scene errors or unexplained console warnings;
- every asset has known provenance and passes validation;
- the page is useful before and without the scene;
- reduced motion and keyboard/touch paths work;
- important browser paths and the lowest supported device tier are measured;
- repeated navigation does not show unbounded resource growth;
- the result meets the agreed page and scene performance targets.

If a check cannot be run, report it as unverified with the exact reason. Do not silently weaken the target.
