---
name: three-scene-setup
description: Scaffold or repair a production-ready React Three Fiber scene in this Next.js project. Use for new Three.js canvases, R3F scene foundations, Next.js client boundaries, dynamic imports with SSR disabled, responsive cameras, lighting, pixel-ratio limits, loading/error fallbacks, or scene lifecycle setup.
---

# Three Scene Setup

Create the smallest reliable R3F foundation for this site. Apply `.cursor/rules/00-core-guardrails.mdc`, `10-code-quality.mdc`, `20-testing-and-verification.mdc`, `40-frontend-ui-ux.mdc`, and `50-motion-and-animation.mdc`.

## Inspect first

1. Read `package.json`, the lockfile, Next.js configuration, router structure, TypeScript configuration, global styles, components, and tests.
2. Confirm whether the project uses the App Router or Pages Router and whether `three`, `@react-three/fiber`, and `@react-three/drei` already exist.
3. Check current official compatibility before selecting package versions. Preserve the repository's package manager.
4. Define whether the scene is decorative, informative, or interactive and whether it moves continuously.
5. Do not install GSAP, physics, post-processing, or smooth scrolling as part of scene setup.

## Create the boundary

Keep semantic page content server-rendered. Isolate browser-only rendering in a leaf client component:

```text
page/layout (Server Component)
└── SceneShell (small Client Component)
    ├── reserved-size poster/loading state
    ├── dynamic SceneCanvas with ssr:false
    └── error/unsupported fallback
```

Put `ssr: false` inside a Client Component:

```tsx
'use client'

import dynamic from 'next/dynamic'

const SceneCanvas = dynamic(
  () => import('./SceneCanvas').then((module) => module.SceneCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster status="loading" />,
  },
)
```

Do not mark an entire page or layout as client-side merely to render one canvas. Do not access `window`, WebGL, or browser-only libraries from a Server Component.

## Build the canvas

- Reserve an explicit aspect ratio or block size before loading to prevent CLS.
- Start with `dpr={[1, 1.5]}`. Raise it only after measuring target devices.
- Start with a restrained perspective camera such as `fov: 40–50`, a positive near plane around `0.1`, and the smallest far plane that contains the scene. Frame from the model bounds instead of relying on unexplained coordinates.
- Use `frameloop="demand"` for a static or event-driven scene. Use continuous rendering only while something genuinely changes.
- Use `ResizeObserver` or R3F sizing; do not attach duplicate global resize listeners.
- Configure output color space, tone mapping, and shadows deliberately. Do not paste renderer flags from demos without understanding them.
- Provide `Suspense`, a size-matched poster, recoverable asset-error UI, and a useful no-WebGL fallback.

## Add a sensible scene

1. Establish camera framing and responsive behavior.
2. Add one environment or a minimal light rig.
3. Prefer baked lighting for static objects.
4. If real-time lighting is required, begin with one ambient/hemisphere contribution and one key light.
5. Enable shadows only for selected lights and meshes; begin with a modest shadow map and tight camera bounds.
6. Add controls only if the user needs direct manipulation. Preserve touch scrolling with appropriate `touch-action`.
7. Keep headings, descriptions, buttons, forms, prices, and status messages in HTML, not inside the canvas.

## Keep the render loop safe

- Use refs for frame-by-frame scene values.
- Use `useFrame((state, delta) => ...)` and make movement frame-rate independent.
- Never call a React state setter every frame.
- Reuse vectors, colors, geometries, and materials instead of allocating them in the loop.
- Give each animated property one owner.
- Pause off-screen or hidden scenes and invalidate demand-rendered scenes only when needed.
- Dispose resources created outside managed R3F lifecycles, and clean up controls, observers, events, timers, and animation systems on unmount.

## Build accessibility in

- Mark a purely decorative canvas hidden from assistive technology.
- For an informative or interactive scene, add an HTML description and semantic, keyboard-operable controls.
- Import and apply `$reduced-motion-a11y` before adding camera travel, parallax, particles, rotation, or continuous motion.
- Ensure the page remains understandable and actionable if the scene never loads.

## Verify

Run the repository's real formatter, lint, type-check, test, and production-build commands. Then test the running build:

- approximately 320px, 768px, 1024px, and 1440px widths;
- Chromium, WebKit/Safari, and Firefox when supported;
- touch, keyboard, pointer, zoom, resize, and route navigation;
- slow network, failed model load, disabled/unsupported 3D, and reduced motion;
- console, network, hydration, and WebGL warnings;
- repeated mount/unmount for stale canvases, loops, listeners, and GPU memory growth.

Report exact files, dependencies, checks, measurements, and anything unverified.
