---
name: perf-audit-3d
description: Profile, diagnose, optimize, and verify performance of Three.js, React Three Fiber, Spline, WebGL, or WebGPU experiences in this project. Use for low FPS, jank, slow 3D loading, excessive draw calls, high GPU memory, large assets, overheating, pixel-ratio tuning, instancing, demand rendering, or scene memory leaks.
---

# 3D Performance Audit

Measure before and after every optimization. Apply `.cursor/rules/20-testing-and-verification.mdc`, `50-motion-and-animation.mdc`, and `70-release-quality-gate.mdc`.

## Establish the test

1. Use a production build.
2. Identify the critical page and repeatable interaction.
3. Record browser, viewport, device pixel ratio, CPU/network throttling, and hardware.
4. Include one representative mid-range or constrained device profile.
5. Capture a baseline before changing code or assets.

Do not report development-mode FPS as production evidence.

## Set provisional budgets

Use existing project budgets when present. Otherwise begin with these triage targets and adjust from real measurements:

| Measure | Initial target |
| --- | --- |
| Page-level user experience | LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 |
| Scene frame rate | 60 FPS on capable desktop; at least 30 FPS on the lowest supported mobile tier |
| Canvas DPR | Start capped at 1.5; increase only with measured headroom |
| Draw calls | Aim below 100 for a mobile hero and below 200 for desktop; investigate every excess |
| Texture dimensions | Start at 1024px; use 2048px only when target views reveal a real quality need |
| Continuous rendering | Zero when the static scene is idle |

Treat these as investigation thresholds, not universal proof of quality.

## Capture evidence

Record:

- JavaScript, model, texture, environment, decoder, and font transfer sizes;
- LCP, INP/TBT during lab work, CLS, and long tasks;
- CPU and GPU frame time, dropped frames, and worst interaction;
- renderer draw calls, triangles, geometries, textures, shader programs, and render targets;
- canvas pixel dimensions and DPR;
- model decode, shader compilation, and first-render time;
- memory before and after repeated navigation or scene replacement.

Use `renderer.info`, browser Performance/Memory/Network tooling, R3F performance helpers, and a WebGL frame inspector when needed.

## Optimize in impact order

1. Stop unnecessary continuous rendering. Use `frameloop="demand"` and invalidate only on change.
2. Cap or adapt DPR based on observed performance.
3. Remove unseen work, duplicate renderers, duplicate loops, and off-screen scenes.
4. Reuse geometry/materials and instance repeated meshes.
5. Reduce draw calls and expensive material/shader variants.
6. optimize models, texture dimensions/formats, environment maps, and delivery order with `$3d-asset-pipeline`.
7. Add distance-based LOD or quality tiers.
8. Tighten real-time shadows, light count, reflection updates, particles, transparency, overdraw, and post-processing passes.
9. Remove per-frame React state, object allocation, traversal, and layout reads.
10. Simplify physics colliders and update frequency when physics is present.

Make one category of change at a time and remeasure.

## Use adaptive quality

Degrade graphics, not function:

- lower DPR;
- choose lower LOD or texture sets;
- reduce shadows, reflections, particles, and post-processing;
- switch to baked lighting;
- pause off-screen and hidden-tab work;
- use a poster/static fallback on incapable or unstable devices.

Do not remove content, controls, or task completion paths at lower quality.

## Check resource lifecycle

Repeat route entry/exit and model replacement while monitoring:

- canvases and WebGL contexts;
- RAF callbacks, timers, observers, and event listeners;
- geometries, materials, textures, render targets, controls, and post-processing passes;
- workers, decoders, blob URLs, animation mixers, and physics worlds.

Dispose only resources owned by the departing scene; do not dispose shared cached assets still in use.

## Verify and report

Re-run the identical baseline scenario and provide a before/after table. Include:

- measured improvements and regressions;
- visual or functional quality trade-offs;
- build, browser, and device checks run;
- remaining bottleneck and the next evidence-backed action;
- any target that failed or could not be measured.

Do not use “optimized,” “smooth,” or “60 FPS” without measurements.
