# Update report — remove "System details" header + plasma vertical scroll-growth

**Date:** 2026-07-25
**Branch:** `motion/soft-section-handoff`
**Scope:** two independent corrections — (1) remove the visible "System details"
header block, (2) make the ambient plasma shape drift/stretch vertically with scroll
progress instead of sitting as a static fade. Touches `App.tsx`, `page-content.json`,
`types.ts`, `Plasma.jsx`/`Plasma.d.ts`, `AmbientBackground.tsx`, `global.css`.

## Starting state (printed per protocol)

```
$ git status --short
 M src/App.tsx
 M src/components/Hero.tsx
 M src/styles/global.css
?? UPDATE_REPORT_2026-07-25_GLOBAL_AMBIENT_BACKGROUND.md
?? src/components/AmbientBackground.tsx
```
(Continuing on the same uncommitted ambient-background work from the prior two
corrections, per instruction — not re-checkpointed.)

## 1. Removed the "System details" header

`App.tsx`'s `#flagship` section rendered a `.sec-head` block ("02 · System details ·
Full detail behind each system, plus supporting infrastructure.") between the four
featured projects and Systems 05-07. Removed that block entirely — `#flagship` remains
as a plain anchor id (nothing currently links to it; kept only for structure), so the
page now flows directly from System 04 into System 05 with just the existing
`.project{border-top}` divider line, same as every other project-to-project transition.

Also removed the now-unused `flagshipSectionNo`/`flagshipHeading`/`flagshipSub` fields
from `page-content.json` and `PageContent` in `types.ts` (confirmed via `grep` that
nothing else referenced them — `.sec-head` itself is still used by `ProofSummary.tsx`
and `SupportingSystems.tsx`, so only the JSON data and this one usage site were removed,
not the shared CSS class).

**Found and fixed in passing**: removing the "02" from `#flagship` left a numbering gap
("Selected systems" = 01, then "Supporting infrastructure" = 03, with no 02 anywhere
on the page). Renumbered `supporting.sectionNo` from `"03"` to `"02"` to close it.

Verified: `document.querySelectorAll('h2')` now returns exactly `["Selected systems",
"Supporting infrastructure"]` — "System details" is gone.

## 2. Plasma shape now drifts/stretches vertically with scroll

Previous version: the same static shape, just faded via CSS `opacity` per section — no
motion of the shape itself. Implemented actual vertical growth in the shader:

**`Plasma.jsx`** — added two new uniforms, `uDriftY` and `uStretch`, applied to the
fragment shader's coordinate transform right after the existing `uScale` line:
```glsl
C = (C - center) / uScale + center;
C.y = center.y + (C.y - center.y) * uStretch + uDriftY;
```
At `uStretch=1, uDriftY=0` (top of page) this is a no-op — pixel-identical to the
original shape. A new optional prop, `scrollProgressRef` (a plain mutable ref, not
React state), is read once per frame inside Plasma's own existing render loop:
```js
const targetProgress = scrollProgressRef ? scrollProgressRef.current : 0;
smoothedProgress += (targetProgress - smoothedProgress) * 0.04; // eased, not raw
program.uniforms.uDriftY.value = smoothedProgress * gl.drawingBufferHeight * 0.12;
program.uniforms.uStretch.value = 1 + smoothedProgress * 0.22;
```
The 0.04 lerp factor means a fast scroll never snaps the shape — it eases toward the
new position over roughly half a second, exactly the "slow and subtle, not tied to every
wheel tick" behavior asked for.

**`AmbientBackground.tsx`** — owns the scroll-progress ref and its own tiny, independent
`scroll`/`resize` listener (both `passive: true`), computing `window.scrollY / (document
height - viewport height)` clamped to 0-1, written into the ref. This listener:
- never calls `scrollTo` or `preventDefault`
- never reads or writes workflow/expand/section state
- never triggers a React re-render (writes to a ref, not `useState`)
- is completely independent of `useSoftPageHandoff`/`useSectionSettle` — a third,
  read-only scroll observer that cannot conflict with either, since it only ever reads
  `window.scrollY`
- disabled entirely under `prefers-reduced-motion: reduce` (the effect just returns
  early, so the ref never updates past its initial `0` — the shape simply never drifts,
  which combined with Plasma's own reduced-speed prop from the prior pass gives a fully
  frozen background, matching the requested behavior with no extra code needed)

**`Plasma.d.ts`** updated to type the new optional `scrollProgressRef` prop.

## Why no separate CSS `mask-image` was added

The suggested implementation mentioned `mask-image`/gradient masking as one option to
keep the background as "organic forms, not a full-page tint." That specific problem was
already root-caused and fixed in the prior pass (removing the flat color-tint overlay
and the double-dimming bug) — verified then via screenshots that Hero, Selected systems,
and a project section all already showed soft organic shapes with dominant white space,
not a flat wash. Adding a second, independent mask on top wasn't needed to solve a
problem that no longer existed, and risked introducing a new visual artifact for no
verified benefit — so it was left out. If you'd still like an edge vignette on top of
the vertical growth, it's a small addition, but the request's core problems (flat wash,
static shape) are both addressed without it.

## One tuning pass during verification

First implementation used `uDriftY` range `×0.18` and `uStretch` range `×0.35`. Screenshotting
the very bottom of the page (max scroll progress) showed the shape still fairly present
even at the footer's low `--ambient-opacity` (0.1) — stretch/drift growth was partially
offsetting the intended "fade out softly" for the footer specifically. Reduced both
ranges (`×0.12` drift, `×0.22` stretch) and lowered the footer's `--ambient-opacity` from
`0.1` to `0.06`; re-verified — footer now fades to a faint wisp, consistent with the
other sections' fade curve.

## Guardrails honored

- Exactly one `<canvas>` on the page — confirmed via
  `document.querySelectorAll('canvas').length === 1`.
- `useSoftPageHandoff.ts`, `useSectionSettle.ts`, `useAccentSection.ts`,
  `useWorkflowWalkthrough.ts`, `ProjectCard.tsx` all show **zero diff**.
- `rg` for every banned pattern — clean, only pre-existing comments.
- No workflow/expand/section state read or written by the new scroll listener or by
  Plasma's shader changes.

## Build & verification

`npm run build` — 0 errors (both before and after the tuning adjustment).

**Live Puppeteer checks, 1440x900:**
- Hero: pixel-equivalent to the previous good version (scroll progress 0 → no-op).
- System 04 → System 05 transition: confirmed no header block, just the standard
  project divider — flows as one continuous catalogue.
- Deep scroll (System 05 area): shape visibly larger/drifted compared to Hero, still
  fully readable text, chips, and workflow rows.
- Max scroll (footer): shape fades to a faint corner wisp after the tuning pass; footer
  text and Supporting-infrastructure cards fully legible; "Supporting infrastructure"
  correctly reads "02" (no gap).
- HOW IT WORKS: clicked on Project 01, step 1 goes active immediately — unaffected.

## Not touched

`ProjectCard.tsx`, `WorkflowWalkthrough.tsx`, `useWorkflowWalkthrough.ts`,
`useSectionSettle.ts`, `useSoftPageHandoff.ts`, Selected systems card structure, project
copy, `main` branch, deployment/`docs/` (not rebuilt).

**Not committed, not pushed** — awaiting your visual approval.
