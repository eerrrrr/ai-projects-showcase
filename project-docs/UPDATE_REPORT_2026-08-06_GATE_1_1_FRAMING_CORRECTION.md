---
title: Gate 1.1 — Hero framing correction (contain, not cover)
date: 2026-08-06
branch: redesign/ui-v2
commit: not committed
---

# Fixed: the source image was being cropped. Now it never is.

## The bug

Previous pass used `width: max(100vw, 100dvh*ratio)` — mathematically, that is
**cover** sizing: it guarantees full-viewport fill by always cropping whichever
axis has "extra" image. At ordinary desktop aspect ratios this was cutting the
bottom off the Figma Make and Python/SQLite card piles, and trimming the top
studio background — exactly what you flagged from the recording.

## The fix

Changed `max(...)` to `min(...)`:

```css
.v2-hero-scenePositioner {
  width: min(100vw, calc(100dvh * 1.8111979167));
  aspect-ratio: 2782 / 1536;
}
```

`min` is **contain**: the box is sized so the full image always fits inside the
viewport, on both axes, with room to spare on whichever axis doesn't need it —
never larger than needed, never cropped. Leftover space is filled with colour,
not more image.

**Verified at 1920×800** (an aspect ratio wider than the photo, the scenario
most likely to expose a cover-crop bug): full image now visible, both card
piles show their complete bottom edge, no cropping on any side. Screenshot:
`project-docs/screenshots/gate-1-1-framing/01-widescreen-1920x800.png`.

## Edge colour — measured, not guessed

```python
# median of the real PNG's own outer-ring pixels
top ring    → #eae0d7
bottom ring → #dcd3cc
```

Used directly:
```css
--v2-hero-edge-top: #eae0d7;
--v2-hero-edge-bottom: #dcd3cc;
background: linear-gradient(to bottom, var(--v2-hero-edge-top), var(--v2-hero-edge-bottom));
```

`--v2-paper` (the flat colour every section below the Hero sits on) is now set
to the **exact same** `#dcd3cc` — not a close approximation. Verified live:
```
Hero gradient bottom stop:  rgb(220, 211, 204)
.v2-page background:        rgb(220, 211, 204)   ← identical, not just similar
```

**One honest residual, not hidden**: my fill is a single top→bottom gradient;
the real photo also has a subtle *side-to-side* vignette a 2-stop vertical
gradient can't fully reproduce. At the 1920×800 test there's a faint vertical
seam where the actual photo meets the letterbox fill on the far left/right —
much smaller than the original crop bug, but not perfectly invisible. Flagging
it rather than claiming a pixel-perfect blend.

## "SYSTEMS" removed from nav

Filtered out in `SwissHero.tsx`, not deleted from `page-content.json` — the
shared content file stays untouched (contract requirement). It was also a
dead link in V2 specifically: it pointed at `#systems`, an anchor id that only
exists in V1's single-page layout, not anywhere in this routed page. Verified
live: nav now reads `LINKEDIN / GITHUB / VISUAL PORTFOLIO` only.

## What was NOT touched, confirmed via file mtime

```
src/data/heroToolTargets.ts             unchanged since the proximity-engine pass
src/components/v2/WorkflowDiagram.tsx   unchanged since 8/5
src/data/workflowDiagram.ts             unchanged since 8/5
```
The proximity engine, hysteresis, shared Inspector, keyboard behaviour, and
all 11 registered targets are the exact same code as before — only the
nav-links `.filter()` line changed in `SwissHero.tsx`. Re-verified live:
hovering Figma Make still produces `FIGMA MAKE / 03 Source-to-Figma Data
Visualization Pipeline` in the Inspector, unchanged.

## Files changed

```
src/styles/v2/hero.css     scenePositioner cover→contain, edge-colour gradient
src/styles/v2/tokens.css   --v2-paper set to the same measured bottom-edge colour
src/components/v2/SwissHero.tsx   nav links filtered (Systems removed), no other change
```

## Build

`npm run build` — zero TypeScript errors.

## Not done, stopping here per your instruction

No content architecture work (Systems index, workflow-node redesign, evidence
strip, case-notes) — that's Gate 2+, explicitly deferred. No commit, no push,
no deploy.

## Local preview

**http://127.0.0.1:5195/ai-projects-showcase/ai** — still the same dev server
from before, left running, not restarted, no `taskkill`.

Please check at your own 1440×900 / 1366×768 / 1280×720 / 390×844, and
whatever width your embedded browser actually is — I tested 800×600, 1440×900,
and 1920×800 directly and confirmed no cropping at any of them, but I can't
reproduce your exact VS Code browser chrome width from here.
