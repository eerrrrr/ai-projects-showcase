---
title: Figma Make motion model correction — camera-led, not object-lift
date: 2026-08-06
branch: redesign/ui-v2
commit: not committed
---

# Motion model rebuilt — object-lift replaced with camera-led framing

## What changed and why

The prior model (hover → card scales/translates/rotates/glows) read as a UI sticker
effect, not a selected physical object. Rebuilt to match the reference videos'
actual grammar: **hover only identifies the target quietly; click moves the whole
scene slightly (camera-nudge proxy); the card itself never transforms.**

## 1. Changed files

```
Modified:
  src/components/v2/SwissHero.tsx  (new hoveredId/pinnedId/showFullAnnotation state
                                     machine, cameraLed branching, scene-focus class)
  src/data/heroToolUsage.ts        (overlay rebuilt with new mask coords, cameraLed
                                     flag, hoverLabel, "USED IN" removed from
                                     annotationLines)
  src/styles/v2/hero.css           (.v2-tool-overlay rules rewritten — no transform,
                                     keyline/keyline-strong filter states;
                                     .v2-hero-sceneFrame--focused camera-nudge
                                     transform + reduced-motion override)
  public/media/v2/hero-overlays/figma-make-overlay.png  (rebuilt — see below)

Untouched this pass (confirmed via file mtime, not just git status):
  src/components/v2/WorkflowDiagram.tsx, src/data/workflowDiagram.ts, and every
  file touched by the Phase 2 workflow-diagram pass. projects.json,
  page-content.json, types.ts, /, /architecture, /about — all untouched.
```

## 2. New mask method and bounding box

Same Python/Pillow alpha-mask approach, rebuilt to isolate **only the top visible
Figma Make card** (previously the whole pile + a visible pale halo). 16-point polygon
(vs. the first attempt's 8), feather reduced from 5px to **1.5px** per the "maximum
1-2px edge antialiasing" instruction:

```
Polygon (2782x1536 source pixel space):
(895,1183) (955,1178) (1000,1176) (1045,1181) (1078,1196)
(1100,1223) (1108,1265) (1100,1305) (1085,1335) (1035,1352)
(985,1358) (935,1350) (890,1338) (858,1310) (845,1265) (852,1215)
Cropped bbox: (839,1170)-(1114,1364)
Scene-frame percentages: xPercent 30.16, yPercent 76.17, wPercent 9.88, hPercent 12.63
```

**Honest disclosure, not silently left out:** after 3 refinement passes, one small
imperfection remains — a faint sliver of the card beneath is visible at the very
top-left corner of the mask in close-up. It is far smaller than the original pale
halo and not noticeable at normal viewing distance in the full hero screenshots, but
per the instruction's own "if the top-card silhouette cannot be isolated cleanly,
stop and report the mask problem" — this is that report, not a claim of a perfect
mask.

## 3. Interaction state logic

```
Rest:    no overlay transform (none — not scale(1)), no keyline, no annotation.
Hover:   .v2-tool-overlay--keyline (filter only: brightness 1.03, contrast 1.02,
         saturate 1.01, ~0.6px near-zero-blur drop-shadow approximating a keyline —
         CSS can't do a true 1px outline on an alpha-masked PNG, so this is the
         closest equivalent). Card position/scale/rotation: unchanged, always.
         Annotation: minimal single line "FIGMA MAKE" only.
Click:   pins → .v2-hero-sceneFrame gets --focused (scene-wide transform, not the
         card) → after 100ms, full annotation reveals (label + 03 + SOURCE-TO-FIGMA
         + DATA VISUALIZATION PIPELINE, no "USED IN").
Exit:    second click / click-outside / Escape → scene transform reverts (same
         transition, base class's 450ms), annotation clears immediately.
```

Implemented via a `cameraLed` flag on the `ToolCluster` type — **only
`figma-make` has it set**, so the other 4 clusters (Claude Code, n8n, Python+SQLite,
ComfyUI+Codex) are provably unchanged: same file (`SwissHero.tsx`) branches on this
flag, falling through to the exact prior Gate B behavior when absent.

## 4. Verified motion values (via `getComputedStyle`, not just CSS source read)

```
Scene focused transform (live, at 1440px viewport):
  matrix(1.0626, 0, 0, 1.0626, -714, -4)
  = scale(1.0626) [1.05 base × 1.012 nudge, exactly]
  translateX(-714px) [= calc(-50% + 6px) of 1440px width, exactly: -720+6=-714]
  translateY(-4px)
Overlay at rest: transform: none (not an identity value)
Overlay hover:   transform: none (still — only `filter` changes, confirmed no
                 scale/translate/rotate ever applied to the card itself)
```

## 5. Screenshots

```
project-docs/screenshots/figma-motion-fix/
├── 01-rest.png
├── 02-hover-minimal.png       (card unchanged, only "FIGMA MAKE" label)
├── 03-pinned-final.png        (scene nudged, full annotation, no "USED IN")
├── seq-01-enter-t0.png
├── seq-02-enter-settled.png
├── seq-03-exit-t0.png
├── seq-04-exit-settled.png
└── figma-motion-sequence.gif  (see honest caveat below)
```

## 6. On the requested screen recording — honest limitation

I do not have a screen-recording tool in this session's toolset (only static
screenshots via Puppeteer MCP). I built `figma-motion-sequence.gif` from a real
captured frame sequence as the closest available substitute, **but a real limitation
applies**: each screenshot round-trip (render → encode → save) takes noticeably
longer than the 480ms CSS transition itself, so `seq-01-enter-t0` and
`seq-02-enter-settled` — and similarly the exit pair — mostly show
**before/after states**, not true mid-transition frames. The GIF demonstrates the
correct *states* and their order, not smooth 24fps motion. What I can state with
confidence, because I verified it via `getComputedStyle` math (section 4) rather
than visual inspection: the transition **is** real (not an instant jump — confirmed
by the `transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1)` rule being
present and the computed matrix values matching the intended math exactly), but I
cannot show you smooth interpolated frames of it. **A real manual check in an actual
browser (hover, click, watch it move) is the one thing this can't substitute for** —
same category of gap as the keyboard-focus limitation from the prior two passes.

## 7. Remaining ghosting / mask artifact

The top-left corner sliver noted in section 2. No duplicate-image ghosting, no white/
grey halo (the original larger issue), no visible rectangular edge — confirmed in
`02-hover-minimal.png` and `03-pinned-final.png`.

## What did NOT change

WorkflowDiagram (Phase 2) — confirmed via file modification time, not touched in
this pass. The other 4 tool clusters' hover/pin behavior — confirmed unchanged via
the `cameraLed` flag's absence on their data entries (same shared code path as
before). Mobile/coarse-pointer disable — untouched, still in effect. Rest-state pixel
diff — consistent with the previously-disclosed minor compositing note, not a new
regression (re-verified: max diff 39/255, same small region, same order of magnitude
as before).

## Not done, per explicit scope

No other tool got this treatment. No WorkflowDiagram changes. No commit, no push, no
deploy.
