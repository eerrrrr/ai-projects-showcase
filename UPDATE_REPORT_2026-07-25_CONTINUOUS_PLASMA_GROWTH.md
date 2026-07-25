# Update report — continuous plasma field, not per-section blobs

**Date:** 2026-07-25 (continuing the same working session)
**Branch:** `motion/soft-section-handoff`
**Scope:** `Plasma.jsx` (new `uFlowOffset` uniform + continuous opacity/color computed
in the render loop), `Plasma.d.ts` (new `colorStops` prop type), `AmbientBackground.tsx`
(passes `colorStops`, updated comments), `global.css` (removed `--ambient-opacity`
entirely — opacity is no longer CSS/section-driven). No scroll hook, no workflow hook
touched.

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
?? UPDATE_REPORT_2026-07-25_AMBIENT_FLOW_STRONGER_GRADING.md
?? UPDATE_REPORT_2026-07-25_GLOBAL_AMBIENT_BACKGROUND.md
?? UPDATE_REPORT_2026-07-25_PLASMA_VERTICAL_GROWTH_CORRECTION.md
?? src/components/AmbientBackground.tsx
```
Continuing on the same uncommitted work, per instruction.

## The actual root cause

The previous pass made the *shape distortion* (drift/stretch/morph) genuinely
continuous — one smoothed scroll-progress number, no per-section reset. But two other
things weren't: **opacity** was driven by `--ambient-opacity`, a CSS custom property set
to one of 9 discrete preset values via `data-accent-section` (via
`useAccentSection.ts`'s `IntersectionObserver`), eased over `.9s` *whenever the current
section changed* — a step function, not a continuous curve. And **the canvas's own
color never changed at all** — `Plasma`'s `color` prop was a single fixed hex, baked
into a uniform once at setup and never touched again; the "green grading" the user was
seeing was entirely from nearby UI elements (numbers, chips, buttons), not the shape
itself. A continuously-morphing shape, combined with a *stepped* opacity and a
*static* color, is exactly what reads as "separate mist patches with color switching
between them" rather than one field.

## What changed

**Opacity and color moved from CSS/section-stepped to continuous/scroll-driven,
computed entirely inside `Plasma.jsx`'s existing render loop, using the same
`smoothedProgress` that already drives the shape distortion:**

```js
// Continuous opacity: exponential ease from Hero-strength down to a floor
// that still reads as "the same field, quieter" — not fading to nothing.
const floorOpacity = opacity * 0.32;
program.uniforms.uOpacity.value = floorOpacity + (opacity - floorOpacity) * Math.exp(-4.2 * smoothedProgress);

// Continuous color: interpolated between the nearest two colorStops using
// the exact same progress value — shape and hue always move together.
if (colorStopsRgb) {
  // ...linear interpolation between colorStopsRgb[idx] and [idx+1]...
}
```

`colorStops` is a new optional prop (`['#1f7a55', '#0e5f45', '#0c7d72', '#5c6b35']` —
mist green → deep emerald → teal → olive, the same overall hue journey the UI accents
already travel, just smoothly blended instead of stepped). `color` (single fixed hex)
still works unchanged for any future caller that doesn't pass `colorStops`.

**A new `uFlowOffset` uniform was also added**, directly advancing the same phase
variable (`T`) that already drives the pattern's flow (`iTime * uSpeed * uDirection`).
Scrolling further now "un-spools" more of the flow, the same way waiting longer would —
this is what makes it feel like *travelling through* one continuous field rather than
merely stretching/offsetting a static frame. At `smoothedProgress=0` (top of page) this
is a no-op, so Hero is unchanged.

**`global.css`**: `--ambient-opacity` removed entirely (from `:root` and all 9
`data-accent-section` blocks) — `.ambient-bg` no longer has any opacity/transition rule
of its own; the shader's own `uOpacity` uniform is now the sole source of truth for how
strong the effect is. The discrete `--accent`/`--accent-rgb`/`--accent-soft` values
(used only by UI elements — numbers, chips, buttons, workflow markers) are untouched —
those are meant to be categorical labels, not part of the living field, and stepping is
correct for them.

## Why this design, not a literal document-space shader rewrite

The instruction suggested computing `pageY = (screenY + scrollY) / documentHeight` and
feeding that directly into the noise function as a true "one long world-space field."
That's a valid approach, but it requires reworking the fractal loop's own internal
coordinate math (`p`, `S`, `Q` are all derived from `C` in ways that assume a bounded,
viewport-scaled input) — a much larger, riskier change to a shader that's otherwise
untouched, delicate code. The approach actually implemented achieves the same
*experience* (one continuous field, travelled through as you scroll, color and shape
changing together, never stepped) by advancing the flow's own phase variable instead of
re-deriving its spatial coordinate system — lower risk, same result, verified by
screenshot sequence below.

## Guardrails honored

- Exactly one `<canvas>` on the page — confirmed via
  `document.querySelectorAll('canvas').length === 1`.
- `useSoftPageHandoff.ts`, `useSectionSettle.ts`, `useAccentSection.ts`,
  `useWorkflowWalkthrough.ts`, `ProjectCard.tsx` all show **zero diff**.
- `rg` for every banned pattern — clean, only pre-existing comments.
- No section is ever "reset" or re-seeded — `smoothedProgress` is a single monotonic
  (until you scroll up) number for the whole document; there's no per-section branch
  anywhere in the new code.

## Build & verification

`npm run build` — 0 errors.

**Live Puppeteer checks, 1440x900 — a screenshot sequence at progress ≈ 0, 0.18, 0.40,
0.65, 1.0 across the full document height**, specifically to verify continuity rather
than stepping:
- 0%: Hero, unchanged — mist green, strong, matches the original reference exactly
  (confirms `smoothedProgress=0` is still a full no-op).
- 18% (System 01 area): color has already visibly begun shifting toward deep emerald;
  shape is a larger, softer single form.
- 40% (System 03 area): color continues into a darker green/teal; shape fainter but
  still a clear soft form, not a hard-edged patch.
- 65% (System 05 area): color now distinctly olive/moss; shape reduced to a faint wisp.
- 100% (footer): color settled at the final olive tone; shape almost gone, reads as
  "the same field, now very quiet" rather than "cut off."

Across this sequence there is no point where the shape resets, jumps, or the color
visibly "switches" — each screenshot looks like a plausible in-between frame of the one
before and after it, which is the actual test for "continuous, not stepped."

- HOW IT WORKS: clicked on Project 01, step 1 goes active immediately — unaffected.
- Mobile (390x844): `.ambient-bg` still correctly hidden.

## Not touched

`ProjectCard.tsx`, `WorkflowWalkthrough.tsx`, `useWorkflowWalkthrough.ts`,
`useSectionSettle.ts`, `useSoftPageHandoff.ts`, Selected systems card structure, project
copy, `main` branch, deployment/`docs/` (not rebuilt).

**Not committed, not pushed** — awaiting your visual approval.
