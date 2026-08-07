# Update report — stronger plasma flow + more visible green grading

**Date:** 2026-07-25
**Branch:** `motion/soft-section-handoff`
**Scope:** `Plasma.jsx` (shader + render loop — larger drift/stretch, new turbulence
uniform), `global.css` (wider per-section green contrast, raised opacity, new mask for
shape contrast). No scroll hook, no workflow hook touched.

## Starting state (printed per protocol)

```
$ git status --short
 M src/App.tsx
 M src/components/Hero.tsx
 M src/components/Plasma.d.ts
 M src/components/Plasma.jsx
 M src/data/page-content.json
 M src/data/types.ts
 M src/styles/global.css
?? CODEX_HANDOFF_2026-07-25.md
?? UPDATE_REPORT_2026-07-25_AMBIENT_BACKGROUND_SHAPE_CORRECTION.md
?? UPDATE_REPORT_2026-07-25_GLOBAL_AMBIENT_BACKGROUND.md
?? UPDATE_REPORT_2026-07-25_PLASMA_VERTICAL_GROWTH_CORRECTION.md
?? src/components/AmbientBackground.tsx
```
Continuing on the same uncommitted work, per instruction (feedback was "direction is
right, too subtle" — not a redesign request).

## 1. Stronger, more visible motion

`Plasma.jsx` render loop — increased the two existing scroll-driven ranges and added a
third:
```js
program.uniforms.uDriftY.value = smoothedProgress * gl.drawingBufferHeight * 0.22;  // was 0.12
program.uniforms.uStretch.value = 1 + smoothedProgress * 0.45;                       // was 0.22
program.uniforms.uMorph.value = smoothedProgress * 0.6;                              // new
```
`uMorph` is a new shader uniform applied to the fractal loop's own turbulence
coefficient (`p.x += .4*(1.+uMorph)*(1.+p.y)*sin(...)*cos(...)` — was a fixed `.4`),
making the pattern visibly more turbulent/complex as scroll progress increases, not just
bigger and offset. At `uMorph=0` (top of page) this is a no-op, identical to before.
Smoothing (the 0.04 lerp factor) is unchanged — motion is still eased, not tied directly
to wheel ticks.

## 2. Wider, more visible green contrast between sections

Previous section accents were close enough in hue/lightness to barely read as different
while scrolling. Widened the palette (still one muted "Erin green" family — no bright
neon, no rainbow):

| Section | Before | After |
|---|---|---|
| Hero | `#1f6f55` | `#1f7a55` (kept close to original reference) |
| Systems | `#1e6b4e` | unchanged (anchor color) |
| System 01 | `#176b50` | `#0f5f45` — deeper emerald |
| System 02 | `#155d45` | `#0d4a36` — darker forest |
| System 03 | `#14766f` | `#0c7d72` — clearer teal |
| System 04 | `#5f7352` | `#55663c` — sage/olive-green |
| System 05 | `#557044` | `#4f6b2e` — moss green |
| System 06 | `#6f7042` | `#6a6a2f` — olive |
| System 07 | `#217a68` | `#0c7a70` — blue-mint teal |

Every value was kept dark enough (average channel brightness roughly 45-85) to still
contrast cleanly with white text, since `--accent` is also used as a background color
with white text (`.how-it-works-btn`, active workflow markers) — not just as text color
on white. This was checked deliberately, not assumed.

## 3. Raised ambient opacity outside Hero (Hero itself left alone)

Hero's `--ambient-opacity` stayed at `1` (fully undimmed — it was already correctly
matching the reference screenshot; the complaint was specifically that *other* sections
were too faint, not Hero). Raised the rest:

```
systems: 0.55 → 0.7      system01: 0.4 → 0.55    system02: 0.34 → 0.48
system03: 0.34 → 0.48    system04: 0.28 → 0.42    system05: 0.26 → 0.4
system06: 0.22 → 0.36    system07: 0.2 → 0.34     footer: 0.06 → 0.09
```

## 4. Shape contrast via `mask-image` (the "not opacity" lever)

Per your own instruction to keep these two controls separate: added a static
`mask-image`/`-webkit-mask-image` (radial gradient) to `.ambient-bg` itself, roughly
centered where the shape already naturally concentrates (matching the existing static
CSS fallback gradient's own `70%/40%` center):
```css
mask-image: radial-gradient(78% 68% at 66% 38%, #000 0%, #000 32%, transparent 88%);
```
This keeps the viewport's corners reliably fading to fully transparent regardless of how
high `--ambient-opacity` gets, so raising opacity (step 3) doesn't turn into an even
wash — the shape reads with more local contrast and white space stays dominant at the
edges. This is the mechanism to reach for if it's ever "too green" again — reduce
opacity *and/or* tighten this mask's radius, rather than only pulling opacity down.

**This CSS property change was tested carefully** given this exact class of bug (a CSS
property silently breaking this WebGL canvas's compositing) had already bitten twice
this session (`z-index:-1`, an opaque parent background) — confirmed via screenshot that
`mask-image` does not have the same problem; the canvas renders correctly with it applied.

## Guardrails honored

- Exactly one `<canvas>` on the page — confirmed via
  `document.querySelectorAll('canvas').length === 1`.
- `useSoftPageHandoff.ts`, `useSectionSettle.ts`, `useAccentSection.ts`,
  `useWorkflowWalkthrough.ts`, `ProjectCard.tsx` all show **zero diff**.
- `rg` for every banned pattern — clean, only pre-existing comments.

## Build & verification

`npm run build` — 0 errors.

**Live Puppeteer checks, 1440x900:**
- Hero: unaffected (scroll progress 0 is still a no-op for drift/stretch/morph).
- System 03 vs System 06: confirmed visibly distinct — teal vs olive, clearly
  noticeable in the system number, chips, "How it works" button, and the active AI
  marker, per your specific request to check this pair.
- Footer (max scroll): shape now clearly visible but still reads as fading out — all
  footer text and Supporting-infrastructure cards fully legible.
- HOW IT WORKS: clicked on Project 01, step 1 goes active immediately — unaffected.
- Mobile (390x844): `.ambient-bg` still correctly hidden.

## Not touched

`ProjectCard.tsx`, `WorkflowWalkthrough.tsx`, `useWorkflowWalkthrough.ts`,
`useSectionSettle.ts`, `useSoftPageHandoff.ts`, Selected systems card structure, project
copy, `main` branch, deployment/`docs/` (not rebuilt).

## If it still needs adjusting

Per your own instruction, these two levers are independent — use whichever matches what
you actually see:
- **Still too faint / flow still hard to notice:** raise the `uDriftY`/`uStretch`/
  `uMorph` multipliers in `Plasma.jsx`'s render loop, or raise `--ambient-opacity`
  further per-section in `global.css`.
- **Too green / wash-like again:** first tighten the `mask-image` radius/stops in
  `.ambient-bg` (e.g. drop `88%` toward `75%`, or `32%` toward `20%`) before reducing
  opacity — that targets "even wash" specifically without also weakening the parts that
  are working.

**Not committed, not pushed** — awaiting your visual approval.
