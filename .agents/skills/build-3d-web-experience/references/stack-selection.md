# Stack selection and integration

Use this reference after inspecting the existing project. Prefer its current framework and animation conventions unless they cannot satisfy the requirement.

## Decision table

| Need | Preferred route | Add only when needed |
| --- | --- | --- |
| Tilted cards, layered hero art, shallow parallax | CSS transforms, SVG, or the existing UI motion library | No WebGL runtime |
| One product/object with orbit, animation, hotspots, or AR | `<model-viewer>` | Custom controls or effects only if the component cannot provide them |
| Designer-created interactive scene with fast iteration | Spline runtime or React/Next component | External code events after naming scene objects deliberately |
| Custom React/Next scene, shaders, particles, scene graph, or deep UI integration | `three`, `@react-three/fiber`, `@react-three/drei` | GSAP, post-processing, physics, or helpers individually |
| Custom non-React renderer or engine-like control | `three` | Three.js addons selected individually |
| True collisions, rigid bodies, joints, or simulation | `@react-three/rapier` with compatible React/R3F versions | Debug visualization only in development |
| Narrative scroll sequence | GSAP plus ScrollTrigger, or the project's existing scroll system | One timeline owns each animated Three.js property |
| Experimental node materials, compute, or WebGPU-specific work | Three.js `WebGPURenderer` and TSL | Tested WebGL2/static fallback |

## Recommended custom React stack

For a new custom React or Next.js experience, the usual foundation is:

- Three.js for rendering and scene primitives;
- React Three Fiber (R3F) as the React renderer;
- Drei for selected, well-understood helpers;
- GLB/glTF 2.0 for delivery assets;
- GSAP ScrollTrigger only for a scroll narrative;
- React Three Rapier only for genuine physics.

Check the installed React version and official compatibility notes before choosing R3F or Rapier versions. Install with the repository's existing package manager and commit the matching lockfile. Do not paste a dated version number into the project without checking the current official package metadata.

## React and Next.js boundary

Keep the 3D subtree small:

```text
Server-rendered page
├── semantic content, SEO, forms, navigation
├── size-reserved scene shell
│   ├── poster/loading state
│   ├── lazy client-only scene
│   └── error/unsupported fallback
└── remaining server-rendered content
```

- Put canvas code and browser APIs in a leaf client component.
- Lazy-load a non-critical scene with the framework-supported dynamic import and `Suspense`.
- In Next.js, configure `ssr: false` from a Client Component, not a Server Component.
- Keep secrets, privileged data fetching, and server-only modules outside the scene bundle.
- Set an explicit aspect ratio or stable block size before the scene loads to avoid layout shift.
- Use an error boundary around the scene where the framework supports it.

Official Next.js guidance:

- https://nextjs.org/docs/app/guides/lazy-loading
- https://nextjs.org/docs/app/getting-started/server-and-client-components

## React Three Fiber rules

- Treat `useFrame` as a render loop, not an application state loop. Mutate scene refs and use `delta`; do not call state setters or allocate new vectors/colors every frame.
- Reuse loaded resources. Use loader caching intentionally and do not mutate cached source assets in a way that affects other consumers.
- Share geometry and materials and use instancing for repeated meshes.
- Use `frameloop="demand"` for scenes that change only through explicit interaction; call `invalidate()` for external mutations.
- Adapt rendering based on observed performance: reduce device pixel ratio, shadows, particles, reflection quality, post-processing, or model detail.
- Avoid mounting and unmounting heavy scene graphs merely to toggle visibility when reuse is safe.

Official performance guidance:

- https://r3f.docs.pmnd.rs/advanced/pitfalls
- https://r3f.docs.pmnd.rs/advanced/scaling-performance

## Spline route

Choose Spline when a designer needs to own scene layout and built-in interactions, and the exported runtime supports the behavior.

- Export for the exact target: Vanilla JS, React, Next.js, Three.js, or R3F.
- Spline documentation notes that built-in animations and events are enabled for Vanilla JS and React exports; verify the selected export mode before committing to it.
- Name interactive objects deliberately and prefer stable object IDs for code integration.
- Lazy-load non-critical scenes and show a static poster while loading.
- Self-host `.splinecode` when reliability, CORS, privacy, or change control requires it.
- Test touch, keyboard-accessible external controls, reduced motion, and fallback behavior; an interactive canvas does not replace semantic controls.
- Do not also rebuild the same scene in R3F unless there is a clear migration plan.

Official guidance:

- https://docs.spline.design/exporting-your-scene/web/exporting-as-code
- https://github.com/splinetool/react-spline

## `<model-viewer>` route

Choose `<model-viewer>` before a custom scene when the main job is presenting one glTF/GLB object.

- Provide useful `alt` text, a poster, `touch-action="pan-y"`, and explicit controls appropriate to the task.
- Use its reveal/lazy-loading behavior; do not force a large model into the critical path without evidence.
- Remember that a compression decoder has its own transfer and startup cost. Compress only when total delivery improves.
- Keep product information and purchase controls in HTML.

Official guidance:

- https://modelviewer.dev/
- https://modelviewer.dev/examples/loading/

## Three.js renderer choice

Use `WebGLRenderer` for broad, stable WebGL2 delivery. Consider `WebGPURenderer` when the required feature or measured benefit justifies it.

Three.js currently describes `WebGPURenderer` as a next-generation renderer with a WebGL2 fallback, while also documenting it as experimental and identifying migration incompatibilities. Test required materials, post-processing, loaders, browsers, and fallbacks rather than assuming parity.

Official guidance:

- https://threejs.org/docs/pages/WebGLRenderer.html
- https://threejs.org/manual/en/webgpurenderer

## Animation ownership

Assign one owner for each domain:

- CSS or the UI motion library owns DOM micro-interactions.
- The R3F/Three frame loop owns continuous physical or procedural scene motion.
- A Three.js `AnimationMixer` owns imported skeletal/keyframe clips.
- One GSAP timeline owns scroll-linked camera/object values.
- Rapier owns simulated body transforms; visual objects follow physics state.
- Spline owns its internal event animation unless explicitly controlled through its runtime API.

Bridge domains through coarse progress, commands, or shared configuration. Do not mirror per-frame scene values into React state.

For GSAP in React, scope animations and revert/kill timelines and ScrollTriggers during cleanup. Register ScrollTrigger explicitly.

Official guidance:

- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://gsap.com/docs/v3/GSAP/gsap.context%28%29/
