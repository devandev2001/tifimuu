# Web 3D asset pipeline

Use GLB/glTF 2.0 as the normal delivery format. Keep source files and delivery files separate so optimization is repeatable and reversible.

## 1. Establish provenance

For every model, texture, HDRI, sound, font, and borrowed shader/example, record:

- creator and source URL;
- license and required attribution;
- whether commercial use, modification, and redistribution are allowed;
- the date acquired and any proof of purchase;
- which project files use it.

Do not download or hotlink an asset merely because it appears in a public demo. Do not remove embedded copyright/attribution metadata without understanding the license.

## 2. Preserve the source

Keep an untouched source copy outside the public delivery directory. Store a repeatable export/optimization command or written settings beside it.

In Blender or the source tool:

- use real-world scale and a consistent up axis;
- apply intended transforms and set useful origins/pivots;
- name nodes, materials, clips, and bones predictably;
- delete hidden/unused objects and animation tracks;
- reduce excessive topology before export;
- pack or relink textures intentionally;
- verify normals, UVs, tangents, skin weights, morph targets, and animation ranges;
- prefer baked lighting/details where runtime lighting adds little value.

## 3. Export GLB/glTF 2.0

Prefer one `.glb` for straightforward delivery. Use separate `.gltf` resources only when independent caching or an editing workflow requires them.

Before optimization, open the export in an engine-independent viewer and check:

- dimensions, orientation, camera framing, and pivot;
- PBR material appearance under a neutral environment;
- animation clip names, duration, loop, skinning, and morphs;
- transparency order and double-sided materials;
- color-space and normal-map correctness.

## 4. Validate

Run the Khronos glTF Validator on every final delivery asset. Treat errors as build failures. Review warnings instead of automatically ignoring them.

Official validator:

- https://github.khronos.org/glTF-Validator/

## 5. Optimize a copy

Use glTF Transform directly, or `gltfjsx --transform` for an R3F asset that also needs a typed reusable component.

Possible operations:

- prune unused nodes and data;
- deduplicate accessors, textures, and materials;
- join compatible meshes when it reduces draw calls without breaking interaction;
- instance repeated geometry;
- simplify meshes and create distance-appropriate LODs;
- quantize attributes after visual comparison;
- resize textures to the largest size visibly required;
- encode ordinary textures as WebP/AVIF where supported by the chosen loader;
- use KTX2/Basis Universal when GPU texture memory, transfer size, and transcode support justify the added pipeline;
- use Meshopt or Draco only after comparing total model plus decoder cost and load/decode time.

Never overwrite the source asset. Compare the optimized copy against the original at target viewport sizes and on a representative device.

Official tools and loader support:

- https://gltf-transform.dev/
- https://github.com/pmndrs/gltfjsx
- https://threejs.org/docs/pages/GLTFLoader.html
- https://threejs.org/docs/pages/KTX2Loader.html

## 6. Establish asset budgets

Do not use one universal polygon or megabyte limit. Set a per-page budget from:

- whether the scene is critical or below the fold;
- the target network and lowest device tier;
- the number and resolution of textures after GPU expansion;
- draw calls, material/shader variants, lights, shadows, bones, morph targets, particles, and post-processing passes;
- acceptable time to first useful content and time to interactive scene.

Use these default decisions until measurements justify more:

- do not load below-the-fold 3D during initial page rendering;
- use 1024px textures as a starting point and increase only when the target view reveals a quality problem;
- reject 4K/8K textures without a documented close-up requirement and device-memory test;
- reuse/instance repeated meshes instead of copying them;
- prefer one deliberate environment map over many dynamic lights;
- ship only animation clips and material variants the page uses;
- preload only the one asset needed immediately.

Record original and optimized transfer sizes. Also inspect GPU memory and decode time; a small compressed download can still become expensive in memory.

## 7. Load defensively

- Use same-origin or explicitly trusted asset locations with correct CORS and caching headers.
- Prefer pinned/self-hosted decoders when supply-chain, CSP, offline, or privacy requirements make a public CDN unsuitable.
- Show a poster immediately and meaningful progress only when loading is long enough to need it.
- Handle network, decode, shader compile, and unsupported-extension failures.
- Abort or ignore stale loads after route changes.
- Do not insert model metadata into HTML unsafely.

## 8. Clean up

Three.js GPU resources are not automatically freed just because a mesh leaves the scene. Dispose resources that are truly obsolete:

- geometries;
- materials;
- textures and CPU-side `ImageBitmap` objects where applicable;
- render targets and post-processing passes;
- controls, renderer instances, workers, and decoders with disposal APIs.

Do not dispose a resource still shared by another live scene.

Official cleanup guidance:

- https://threejs.org/manual/en/how-to-dispose-of-objects.html
- https://threejs.org/manual/en/cleanup.html

## 9. Automate the gate

For a mature project, make the asset build repeatable and add CI checks for:

- glTF validator errors;
- unexpected file-size growth;
- missing attribution/provenance records;
- filenames or node/clip names required by code;
- a smoke load/render of representative assets.

Generated React components and transformed models should be reproducible from the source asset, not manually patched without recording why.
