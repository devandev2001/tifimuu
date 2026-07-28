---
name: build-3d-web-experience
description: Plan, build, integrate, optimize, and verify accessible animated 3D web experiences. Use for Three.js, React Three Fiber, Drei, Spline, WebGL or WebGPU, GLB or glTF assets, 3D product viewers, scroll-driven 3D, shaders, particles, camera motion, post-processing, or browser-based physics.
---

# Build 3D Web Experience

Build 3D as a progressive enhancement to a fast, semantic website. Choose the smallest capable stack, protect the normal UI from the 3D runtime, and verify the result on constrained devices as well as a development machine.

## Non-negotiable principles

- Keep navigation, headings, body text, forms, prices, calls to action, and important status messages in semantic HTML. Never make a canvas the only way to understand or use the page.
- Give every 3D scene a static poster or equivalent fallback. The page must remain useful if JavaScript, WebGL/WebGPU, an asset request, or the scene itself fails.
- Use one renderer and one animation owner per animated property. Do not let GSAP, React state, a frame loop, and a Spline event compete over the same transform.
- Treat WebGPU as progressive enhancement unless the project explicitly targets a controlled browser/device set. Preserve a tested WebGL2 or non-3D fallback.
- Respect `prefers-reduced-motion`, keyboard and touch input, responsive layouts, and zoom from the first implementation.
- Do not add a 3D library, physics engine, post-processing stack, or smooth-scroll library without a requirement that needs it.
- Do not copy an attractive demo wholesale. Confirm its license, adapt it to the product, and remove unused code and assets.

## Required workflow

### 1. Inspect before choosing

Read the existing package manifest, lockfile, framework configuration, routing, styling approach, component conventions, tests, and current animation libraries. Preserve the existing package manager and architecture.

Clarify or infer:

- the purpose of 3D and the user action or story it supports;
- whether the scene is decorative, informative, or interactive;
- target browsers and the lowest realistic device tier;
- the source, ownership, and license of every model, texture, HDRI, font, sound, and example;
- acceptable load time and quality trade-offs;
- whether the experience must work with reduced motion, no 3D, or no JavaScript.

Do not install dependencies until the rendering route is selected.

### 2. Select the smallest suitable rendering route

Read [stack-selection.md](references/stack-selection.md) whenever choosing libraries or integrating into a framework.

Use this order:

1. CSS transforms or SVG for shallow perspective, cards, and simple parallax.
2. `<model-viewer>` for a single product/object viewer, turntable, hotspots, or AR.
3. Spline for a designer-authored scene whose supported runtime events are sufficient.
4. React Three Fiber plus Drei for a custom Three.js experience in React or Next.js.
5. Plain Three.js for a non-React app, a reusable renderer module, or low-level control.

Add GSAP ScrollTrigger only for deliberate scroll-linked sequencing. Add Rapier only when real collision or physical simulation is part of the experience.

Record the selected route and why the simpler options are insufficient.

### 3. Design a complete non-3D page first

Build the responsive DOM layout, content hierarchy, calls to action, loading footprint, and fallback poster before connecting the canvas. Reserve the final scene dimensions to prevent layout shift.

Create a short motion map:

- trigger: load, scroll, pointer, keyboard, or explicit control;
- target and property being animated;
- purpose: feedback, orientation, continuity, hierarchy, or storytelling;
- duration/easing or physics behavior;
- reduced-motion replacement;
- interruption, reversal, and cleanup behavior.

Remove motion with no purpose. Never block navigation until an intro finishes, hijack native scrolling, autoplay audio, or hide required information behind hover.

### 4. Prepare assets before integration

Read [asset-pipeline.md](references/asset-pipeline.md) whenever adding or changing `.glb`, `.gltf`, textures, environment maps, animations, or fonts.

Keep an untouched source asset and generate a web delivery copy. Validate glTF, optimize geometry and textures, preserve attribution, and compare visual output before replacing the original.

Do not ship raw Blender files, unbounded 4K/8K textures, duplicate materials, unused animation clips, or a model whose license is unknown.

### 5. Integrate behind a narrow boundary

- Put browser-only 3D code in a dedicated client-side scene component. Keep the page, content, metadata, and data fetching outside that boundary.
- Lazy-load non-critical scene code and assets. Preload only an above-the-fold scene proven to benefit.
- Render a size-matched poster/skeleton while loading and a useful fallback on error or unsupported hardware.
- Keep scene data and configuration separate from rendering code. Use stable names or IDs for model nodes that code addresses.
- Use refs or engine objects for per-frame values. Never call React state setters on every frame.
- Make frame-rate-dependent changes use elapsed time or frame delta.
- Pause off-screen, hidden-tab, and unnecessary continuous rendering. Use on-demand rendering for static scenes.
- Reuse geometry and materials; instance repeated meshes; add level of detail where distance makes the change invisible.
- Dispose obsolete geometries, materials, textures, render targets, controls, observers, timelines, event listeners, and animation-frame loops.
- Surface recoverable asset/runtime errors without crashing the rest of the page.

### 6. Add motion and effects in layers

Implement in this order and verify after each layer:

1. camera, scale, and responsive framing;
2. essential object animation and interaction;
3. DOM/canvas coordination;
4. scroll choreography, if required;
5. lighting, shadows, particles, shaders, and post-processing.

If a later layer harms readability, input responsiveness, thermal behavior, or the agreed performance target, simplify or remove that layer. Prefer baked lighting and lightweight materials over expensive real-time effects when the visual result is acceptable.

### 7. Verify before declaring complete

Read [performance-accessibility-qa.md](references/performance-accessibility-qa.md) and run the relevant checks.

At minimum verify:

- production build, type checks, lint, and existing automated tests;
- desktop and mobile viewport behavior;
- keyboard, pointer, touch, resize, route changes, and interrupted animations;
- normal and reduced-motion modes;
- slow network, asset failure, unsupported 3D, and fallback behavior;
- recent Chromium, Safari/WebKit, and Firefox when the project supports them;
- memory/resource cleanup after repeated navigation or scene replacement;
- Core Web Vitals and runtime responsiveness on a constrained profile or real lower-end device.

Do not claim 60 FPS, accessibility, cross-browser support, or WebGPU compatibility unless measured.

## Completion report

Report:

- chosen stack and why;
- dependencies and files added or changed;
- asset sources, licenses, original and optimized sizes;
- fallback and reduced-motion behavior;
- browsers, devices, build/tests, and performance checks actually run;
- remaining limitations or measurements not performed.

Never describe an untested assumption as a verified result.
