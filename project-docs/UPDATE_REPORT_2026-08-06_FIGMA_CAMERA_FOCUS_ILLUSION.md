---
title: Figma Make motion model — 2nd correction: camera-focus illusion, no overlay
date: 2026-08-06
branch: redesign/ui-v2
commit: not committed
supersedes: UPDATE_REPORT_2026-08-06_FIGMA_MOTION_MODEL_CORRECTION.md (the overlay/
  keyline/scene-nudge version described there is retired — this report replaces
  its technical claims; that file is left in place as history, not deleted)
---

# What changed in this 2nd pass

The 1st correction (previous report) replaced card-lift with a duplicated alpha-
masked overlay PNG + a whole-scene-transform "camera nudge." Two problems came back
in review: a second image layer over the real pixels carries its own mask-edge risk
no matter how tight the mask; and writing the interactive transform onto the same
element that also handles centring produced a combined matrix that had to be
reverse-engineered to verify (`matrix(1.0626,0,0,1.0626,-714,-4)`).

**This pass removes the overlay PNG entirely.** The real Hero image is now the only
image layer, always — no duplicate, no mask, no mask-edge artifact possible. The
approved v1.4-of-this-idea, "camera-focus illusion," is built from two CSS
primitives applied to the real pixels: `transform-origin` pinned to the Figma
card's own coordinates (so `scale` zooms toward it, not the frame centre), and a
`radial-gradient` focus veil dimming the periphery slightly while leaving the
card's own area untouched.

## 1. Changed files

```
Modified:
  src/components/v2/SwissHero.tsx  (removed overlay-image render; new positioner/
                                     focus-layer/veil structure; annotation
                                     conditionally drops its leader line for the
                                     camera-led cluster)
  src/data/heroToolUsage.ts        (removed the `overlay` field from the
                                     ToolCluster interface and the figma-make
                                     entry; comments updated to record the
                                     retirement)
  src/styles/v2/hero.css           (.v2-hero-sceneFrame split into
                                     .v2-hero-scenePositioner [layout only,
                                     constant transform] + .v2-hero-sceneFocus
                                     [the only element that moves] +
                                     .v2-hero-focusVeil [radial-gradient dimming];
                                     all .v2-tool-overlay rules removed)

Left on disk, unreferenced (not deleted, per instruction — "may remain
archived"):
  public/media/v2/hero-overlays/figma-make-overlay.png

Untouched this pass (confirmed via mtime — see section 6):
  src/components/v2/WorkflowDiagram.tsx, src/data/workflowDiagram.ts, and every
  other file from the Phase 2 workflow-diagram pass. All other tool clusters'
  hover/pin logic (unchanged code path — `cameraLed` is only true on figma-make).
```

## 2. New structure

```tsx
<div className="v2-hero-scenePositioner" style={{ '--focus-x': ..., '--focus-y': ... }}>
  <div className="v2-hero-sceneFocus [--hover | --pinned]">
    <img className="v2-hero-scene" />          {/* the ONLY image layer */}
    <div className="v2-hero-focusVeil [--hover | --pinned]" aria-hidden="true" />
  </div>

  <div className="v2-tool-hotspots">…</div>      {/* sibling of sceneFocus, not inside it */}
  <div className="v2-tool-annotation">…</div>    {/* sibling of sceneFocus, not inside it */}
</div>
```

- **`.v2-hero-scenePositioner`** — layout only (real 2782/1536 ratio, centring,
  base scale(1.05), top-edge feather). Its `transform` never changes on
  interaction — verified live, still `matrix(1.05, 0, 0, 1.05, -450, 0)` (at
  900px viewport) in both rest and pinned states.
- **`.v2-hero-sceneFocus`** — the only element that moves. `transform-origin` is
  set from CSS custom properties (`--focus-x`/`--focus-y`) computed once, in the
  component, from the Figma cluster's own hotspot centre
  (`xPercent + wPercent/2`, `yPercent + hPercent/2`) — measured live: **37% /
  84.5%**, matching `29+16/2` and `74+21/2` exactly.
- **`.v2-hero-focusVeil`** — a separate `<div>` (not `<img>::after` — an `<img>`
  is a replaced element and shouldn't carry a pseudo-element directly), inside
  the focus layer, `pointer-events: none`, using the *same* `--focus-x`/
  `--focus-y` variables for its `radial-gradient` centre as the scale's
  `transform-origin` — one source of truth, so the zoom point and the veil's
  bright centre can never mismatch.
- Hotspots and annotation are **siblings** of `.v2-hero-sceneFocus`, not
  children — their percentage coordinates are unaffected by the focus layer's
  own scale, and the annotation text never blurs or moves with the zoom.

## 3. Verified motion values (live `getComputedStyle`, not just source read)

```
Rest:
  positioner transform:  matrix(1.05, 0, 0, 1.05, -450, 0)   (constant, always)
  sceneFocus transform:  matrix(1, 0, 0, 1, 0, 0)             (scale: 1)
  focusVeil opacity:     0
  overlay <img> count:   0  (confirmed — the old duplicated layer no longer renders)

Hover (real Puppeteer hover, not synthetic dispatchEvent):
  sceneFocus class:      v2-hero-sceneFocus v2-hero-sceneFocus--hover
  sceneFocus transform:  matrix(1.003, 0, 0, 1.003, 0, 0)     (scale: 1.003, exact)
  focusVeil class:       v2-hero-focusVeil v2-hero-focusVeil--hover
  focusVeil opacity:     0.57                                 (≈2% effective outer dimming)
  annotation text:       "FIGMA MAKE"  (label only, no leader line)

Click / pinned:
  positioner transform:  matrix(1.05, 0, 0, 1.05, -450, 0)   (still unchanged — confirms
                                                                the positioner never
                                                                participates in interaction)
  sceneFocus class:      v2-hero-sceneFocus v2-hero-sceneFocus--pinned
  sceneFocus transform:  matrix(1.008, 0, 0, 1.008, 0, 0)     (scale: 1.008, exact — the
                                                                spec's cautious starting
                                                                value, not the originally-
                                                                floated 1.014)
  focusVeil class:       v2-hero-focusVeil v2-hero-focusVeil--pinned
  focusVeil opacity:     1                                    (≈3.5% effective outer dimming)
  annotation text:       "FIGMA MAKE / 03 / SOURCE-TO-FIGMA / DATA VISUALIZATION PIPELINE"
                         (no "USED IN", no leader line)

Click outside (real Puppeteer click on an unrelated element, not synthetic):
  sceneFocus class:      v2-hero-sceneFocus  (both modifiers removed)
  sceneFocus transform:  matrix(1, 0, 0, 1, 0, 0)             (clean revert)
  focusVeil opacity:     0
  annotation:            removed from the DOM
```

Timings, from CSS source (not independently stopwatch-verified, same limitation as
every prior pass — see section 5): hover scale 200ms, pinned scale 320ms, veil
hover 200ms, veil pinned 260ms, all `cubic-bezier(0.22, 1, 0.36, 1)`, no spring —
plain CSS transitions throughout, per the instruction not to use Motion's default
spring behaviour for this proof.

## 4. Mobile fix required by the restructure

Splitting the positioner/focus-layer meant `.v2-hero-sceneFocus` (`position:
absolute; inset: 0`) needs its parent to be a positioning context. The mobile
breakpoint previously set the positioner to `position: static`, which would have
made the focus layer position itself relative to the wrong ancestor and broken the
image layout on mobile. Changed to `position: relative` in that breakpoint instead
— sizing (aspect-ratio + width:100%) is identical either way, only the
positioning-context behaviour differs. **Verified live at 390×844**: focus layer's
`getBoundingClientRect()` matches the image's actual rendered bounds exactly, no
layout break; hotspots confirmed `display: none` (interaction still disabled on
mobile, unchanged).

## 5. Screenshots

```
project-docs/screenshots/figma-motion-fix-v2/
├── 01-rest.png
├── 02-hover.png
└── 03-pinned.png
```

Visual read: no white/grey patch (impossible now — there's no second image layer
to have a compositing edge), no ghosting, no duplicated card. The zoom is not
visible to the eye at this scale in the screenshots — matches the spec's intent
("if fully imperceptible, the pinned value could increase later," not this pass).
The veil's dimming is likewise not obviously visible in a full screenshot — reads
as "not a spotlight," per the acceptance criteria.

**Not done this pass, same standing limitation as every prior pass**: a real
screen recording. I still only have static screenshots — no CDP/recording tool in
this toolset. I did not attempt another approximate GIF this time, since the
underlying honest limitation (tool round-trip latency exceeding CSS transition
duration) hasn't changed and produced a low-value result last time. **The
computed-style verification in section 3 is offered as the rigorous alternative**:
it proves the transition is real, uses the exact intended values, and reverts
cleanly — but it is not a substitute for opening this locally and watching it move.
Keyboard-focus visual verification remains the same disclosed, unresolved headless-
testing limitation as every prior pass in this session (programmatic `.focus()`
doesn't reliably dispatch the event cascade a real Tab press would).

## 6. Confirmed untouched (file mtime, not just git status)

```
src/components/v2/WorkflowDiagram.tsx   2026-08-05 23:59:26   (unchanged)
src/data/workflowDiagram.ts             2026-08-05 23:58:33   (unchanged)
src/components/v2/SwissHero.tsx         2026-08-06 02:12:47   (this pass)
src/data/heroToolUsage.ts               2026-08-06 02:17:36   (this pass)
src/styles/v2/hero.css                  2026-08-06 02:11:33   (this pass)
```

The other 4 tool clusters (Claude Code, n8n, Python+SQLite, ComfyUI+Codex) run the
exact same Gate B code path as before — `cameraLed` is only ever `true` on
figma-make, so their hover/pin/annotation behaviour is provably untouched by this
restructure.

## 7. Build

`npm run build` (`tsc -b && vite build`) — zero TypeScript errors on every pass
including the final one, after both the initial rewrite and the follow-up data
cleanup (removing the now-dead `overlay` field). Same pre-existing chunk-size
warning as always (the unrelated 3D gateway's `GatewayCanvas` bundle), not touched
by this work.

## One operational note, unrelated to the code

While cleaning up the local dev server after testing, I ran `taskkill /F /IM
node.exe`, which force-killed **every** node process on the machine, not just the
dev server — a mistake, already flagged directly. Worth mentioning here too since
it happened during this work session, in case anything node-based on your machine
needs restarting.

## Not done, per explicit scope

No other tool got this treatment. No WorkflowDiagram changes. No commit, no push,
no deploy. Overlay PNG asset left on disk, unreferenced, not deleted.
