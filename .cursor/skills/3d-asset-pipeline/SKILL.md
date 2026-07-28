---
name: 3d-asset-pipeline
description: Validate, optimize, compress, convert, deliver, or integrate 3D web assets for this project. Use for GLB/glTF models, Blender exports, glTF Transform, gltfjsx, Draco or Meshopt geometry compression, KTX2/Basis textures, HDR environments, lazy loading, CDN/cache configuration, asset licensing, or 3D bundle-size problems.
---

# 3D Asset Pipeline

Create a repeatable source-to-web pipeline. Apply `.cursor/rules/10-code-quality.mdc`, `20-testing-and-verification.mdc`, `30-security-and-privacy.mdc`, and `50-motion-and-animation.mdc`.

## Establish provenance

For every model, texture, HDRI, font, sound, shader, or borrowed example, record:

- creator and original URL;
- license, commercial/modification rights, and required attribution;
- acquisition date and proof of purchase when relevant;
- project pages and components that use it.

Do not hotlink unknown assets or assume public availability grants reuse rights.

## Preserve source and delivery copies

Keep an untouched source asset outside the public delivery path. Generate optimized web copies into the project's established asset location.

Never overwrite the Blender/source file or the only GLB. Make transformations reproducible through a script, package command, or recorded CLI invocation.

## Prepare the source

Before export:

- use consistent real-world scale, axes, pivots, and applied transforms;
- name required nodes, bones, clips, and materials predictably;
- remove hidden geometry, unused materials, cameras, lights, and animation tracks;
- fix normals, UVs, tangents, skin weights, morphs, transparency, and texture color spaces;
- reduce excessive topology before destructive compression;
- bake lighting/details when runtime lighting adds no user value.

Export GLB/glTF 2.0 and confirm appearance and animation in an engine-independent viewer.

## Validate before and after optimization

Run the Khronos glTF Validator. Treat errors as failures and review every warning.

Inspect the asset with the installed or temporary glTF Transform CLI. Check the tool's current `--help` and official documentation before composing commands; do not guess flags from memory.

Record:

- file and texture sizes;
- vertices/triangles, primitives, materials, draw-call implications, skins/morphs, and clips;
- required extensions and decoder/transcoder dependencies;
- original and optimized visual screenshots.

## Optimize a copy

Choose only operations supported by evidence:

- prune unused data and deduplicate resources;
- join compatible meshes when it reduces draw calls without breaking interaction;
- instance repeated geometry;
- simplify distant or overly dense meshes and create LODs;
- quantize attributes after visual comparison;
- resize textures to the maximum visibly required resolution;
- encode ordinary textures as WebP/AVIF where the selected loader supports them;
- use KTX2/Basis when GPU memory, transfer, and device tests justify the transcoder;
- use Meshopt or Draco only when model savings exceed decoder and decode costs;
- remove unused clips, cameras, lights, and material variants.

For R3F, `gltfjsx --transform --types` can create a reusable typed component and optimized copy. Treat generated code as generated; regenerate from source instead of casually hand-editing it.

## Apply project delivery defaults

Until target-device measurements justify otherwise:

- start textures at 1024px and permit 2048px for verified close-ups;
- reject 4K/8K textures without a documented visual requirement and GPU-memory test;
- lazy-load below-the-fold scenes and assets;
- preload only the critical above-the-fold model;
- show a size-matched poster immediately;
- keep a useful fallback for network, decode, WebGL/WebGPU, or extension failure;
- avoid loading multiple quality tiers simultaneously.

Use `$perf-audit-3d` to establish page-specific transfer, draw-call, memory, and frame budgets.

## Integrate loading safely

- Use stable public URLs or imports consistent with the framework.
- Prefer same-origin/self-hosted assets when CSP, privacy, reliability, offline behavior, or supply-chain control matters.
- For a CDN, use content-hashed immutable URLs, long-lived caching, correct MIME types, compression, and explicit CORS.
- Pin or self-host decoders/transcoders when public-CDN dependencies are not acceptable.
- Abort or ignore stale loads after route changes.
- Never inject untrusted model metadata into HTML.
- Keep attribution in the UI or legal notices as the license requires.

## Clean up ownership

Dispose obsolete geometries, materials, textures, render targets, controls, workers, decoders, mixers, blob URLs, and CPU-side image resources. Do not dispose shared cached resources still used by another mounted scene.

## Automate and verify

Add repeatable commands or CI gates when the project has an asset pipeline:

- fail on glTF validation errors;
- flag unexpected asset-size growth;
- verify required filenames, nodes, clips, and extensions;
- require provenance/attribution records;
- smoke-load representative assets.

Test the optimized asset in the production build on target browsers and a constrained device. Compare materials, animation, skinning, morphs, transparency, loading, memory, and visual quality against the source. Report commands, tool versions, before/after sizes, validation results, and trade-offs.
