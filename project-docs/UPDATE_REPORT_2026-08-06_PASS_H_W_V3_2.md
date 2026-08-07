---
title: Pass H (Hero height-led framing + local annotation) + Pass W (n8n-style workflow nodes)
date: 2026-08-06
branch: redesign/ui-v2
commit: not committed
---

# Two problems fixed: Hero side bands, and the Inspector's disconnected location

Also saved verbatim: `project-docs/CLAUDE_HERO_WORKFLOW_CORRECTION_V3_2.md` (your
full spec, pasted inline — sandbox links aren't reachable from this session, so I
worked from the text in your message directly).

## Pass H — Hero

**Geometry**: `min(100vw, 100dvh*ratio)` (Gate 1.1's contain-fit) → height-led:
```css
.v2-hero-scenePositioner { height: 100%; width: auto; aspect-ratio: 2782/1536; }
```
Top and bottom always fully visible (unchanged from Gate 1.1 — still no crop
there). What's different: the mask-blend at the left/right edges is now much
broader and photographic (8 stops, ~8% transition zone each side, applied to
`.v2-hero-sceneFocus` only — not the positioner, so hotspots/annotations are
never faded by it), sitting over a two-layer studio gradient (radial room-glow +
linear top/bottom, using the same real-PNG-measured edge colours as Gate 1.1).
**Verified at 1920×800**: no hard seam, reads as one continuous room — screenshot
`pass-h-w-v3-2/02-widescreen-1920x800.png`.

**Annotation moved off the fixed corner.** Each of the 11 targets now has
`annotationSide`/`annotationOffsetX`/`annotationOffsetY` in the registry; the
annotation is `position: fixed`, computed from the source canvas's real
`getBoundingClientRect()` + the target's own percent position, clamped to stay
on-screen. **Verified live** at Figma Make: annotation renders directly above the
card (`transform: translate(-50%, calc(-100% - 4px))`), not in the lower-left
corner. Screenshot `pass-h-w-v3-2/01-annotation-figma.png`.

**Zoom restored to visible-but-restrained.** `MAX_SCENE_SCALE_DELTA`: 0.003 →
0.006 (spec's target value, under the 1.007 hard ceiling). Added a capped
translate-toward-target (max 3.5px/2.5px). **Verified live**: at Figma Make's
centre, `transform: translate3d(0.91px, -1.725px, 0px) scale(1.006)` — both the
scale and the directional shift are present and match the intended ceiling.

**Local veil, not full-scene wash**: the radial gradient's ellipse size is now
tied to the active target's own `radiusXPercent`/`radiusYPercent` × 1.8 (written
each frame via `--focus-radius-x`/`-y`), not a fixed full-viewport gradient.

**Asymmetric enter/exit smoothing**: added `dampToward()` — 105ms while a value
is rising toward its target (snappier engagement), 180ms while falling (softer
release) — for strength, scale, veil, and the translate shift. Focus x/y use one
constant 135ms regardless of direction, per your spec. No Motion/Framer Motion
dependency was added — confirmed again this pass, still not in `package.json`.

## Pass W — Project 01 workflow

**Nodes are compact now** — number, short title, tool, actor only. `node.action`
(the full verified `stage.body` sentence) is no longer rendered inside every
node — moved to one shared detail area below the node track. **Verified live**:
screenshot `pass-h-w-v3-2/03-workflow-nodes.png` shows six small precise
rectangles with visible ports, not six paragraph cards.

**Sequential entrance, once**: on first scroll-into-view, nodes/connectors reveal
in order (existing CSS transition-delay stagger, kept) AND `activeNodeId`
auto-advances through each node (~640ms/step) so the shared detail area follows
along, settling back on node 01. **Verified live**: node 01's detail — "A Manual
Trigger runs six repeatable test records..." — is showing correctly on load.

**Hover/focus takes control immediately** — no click. **Verified live**: hovering
the Human-review node (05) instantly swapped the detail area to "05 / ROUTE
REVIEW STATE... Each record becomes READY, NEEDS_REVIEW or BLOCKED...".

**Replay control** added (`REPLAY WORKFLOW ↻`, small text control, not a big
play button) — re-runs the one-time sequence on demand.

**Single source of truth preserved**: `src/data/workflowDiagram.ts` (which
derives nodes from `project.stages`) is **completely untouched** — confirmed via
file mtime, still dated 8/5 23:58, unchanged since before this whole pass. Only
the presentation component (`WorkflowDiagram.tsx`) and its CSS changed.

## Files changed

```
src/data/heroToolTargets.ts        annotationSide/OffsetX/OffsetY added to all 11 targets
src/components/v2/SwissHero.tsx    local annotation positioning, stronger scale/translate,
                                     asymmetric enter/exit smoothing, local veil radius
src/styles/v2/hero.css             height-led geometry, broader mask-blend, .v2-toolAnnotation
src/components/v2/WorkflowDiagram.tsx   compact nodes, auto-sequence, shared detail area, replay
src/styles/v2/workflow-diagram.css      .v2-flowNode (compact/ports), .v2-workflow-detail

Untouched (confirmed via mtime):
src/data/workflowDiagram.ts        unchanged since 8/5 23:58 — same derivation logic
```

## Build

`npm run build` — zero TypeScript errors.

## Not independently re-verified this pass (disclosed, not hidden)

- Hysteresis behaviour across the tightly-stacked top cluster (Copilot/Notion/
  OpenAI/MS Office/Claude Code/n8n) — the underlying distance/switch-ratio logic
  is unchanged from the previous pass (already verified working then), but I
  didn't re-run a dedicated flicker test after tightening `REACH_OUTER`/
  `REACH_INNER` this pass. Worth a manual check.
- Reduced-motion and keyboard-focus visual behaviour — same standing headless-
  testing limitation as every prior pass in this session (no CDP media emulation
  or real Tab-press available here); the code paths were written and reviewed
  directly, not live-verified.
- 1366×768 / 1280×720 specifically — I tested 800×600, 1440×900, and 1920×800
  live; the other two sizes weren't independently captured this pass.

## Local preview

**http://127.0.0.1:5195/ai-projects-showcase/ai** — same server, still running,
not restarted.

## Not done, per explicit scope

Systems 02–07 not touched. No commit, no push, no deploy. No project JSON or
verified figures changed.
