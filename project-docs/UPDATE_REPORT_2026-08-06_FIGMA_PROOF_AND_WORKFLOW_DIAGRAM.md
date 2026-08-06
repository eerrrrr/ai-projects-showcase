---
title: Phase 1 (Figma 2.5D proof) + Phase 2 (WorkflowDiagram) — update report
date: 2026-08-06
branch: redesign/ui-v2
commit: not committed
---

# Two proofs delivered, per H's 9 required return items

## 1. Changed files

```
Modified:
  src/App.tsx                          (unchanged from prior pass — route wiring)
  project-docs/DESIGN.md, MOTION_SPEC.md (unchanged from prior passes)

Added — Phase 1 (Figma):
  public/media/v2/hero-overlays/figma-make-overlay.png
  src/data/heroToolUsage.ts             (extended: overlay + annotationLines fields)
  src/components/v2/SwissHero.tsx       (overlay render, accessibleLabel(), usageText()
                                          override)
  src/styles/v2/hero.css                (.v2-tool-overlay rules, rest-state fix,
                                          mobile/coarse-pointer disable)

Added — Phase 2 (WorkflowDiagram):
  src/data/workflowDiagram.ts           (WorkflowNode/WorkflowDefinition types +
                                          buildWorkflowFromProject())
  src/components/v2/WorkflowDiagram.tsx
  src/styles/v2/workflow-diagram.css
  src/components/v2/FeaturedCaseSection.tsx  (old <ol> stage list replaced)
  src/components/v2/CaseStudyLayout.tsx      (same replacement)
  src/styles/v2/case-study.css           (.v2-case-workflow-row, .v2-case-block--full)
  src/pages/AiPortfolioV2Page.tsx, CaseStudyPage.tsx (workflow-diagram.css import)

Untouched (confirmed via git status): src/data/projects.json, page-content.json,
types.ts, /, /architecture, /about, docs/.
```

## 2. Final Figma mask/overlay method

Option 2 (Python/Pillow alpha-masked PNG), not CSS clip-path — chosen directly since
a hand-estimated polygon needed feathering to avoid a visible hard edge, which
`clip-path` alone doesn't do well. Script: polygon fill → `GaussianBlur(radius=5)` on
an `L`-mode mask → `putalpha()` on the real source image → tight crop with 20px
padding. **No redraw, no regenerated card, no invented hidden area** — every pixel in
the overlay is the original photo's own pixels, just alpha-masked.

## 3. Exact clipping polygon / overlay coordinates

Source image space (2782×1536, visually estimated from a direct crop-and-inspect
pass, not pixel-perfect segmentation):
```
Polygon: (830,1315) (895,1170) (985,1160) (1135,1185)
         (1240,1345) (1190,1465) (1055,1500) (885,1465)
Feather: GaussianBlur radius 5px
Cropped/saved bbox: (810,1140)-(1260,1520)
```
Converted to scene-frame percentages (used for CSS positioning):
```
xPercent: 29.12   yPercent: 74.22   wPercent: 16.18   hPercent: 24.74
```
Both are documented in code (`heroToolUsage.ts`'s `figma-make` entry).

## 4. Interaction state logic

**Figma overlay** (Hero): idle → hover/focus reveals selected state (scale 1.025,
translateY -3px, rotate 0.45deg, brightness 1.04, drop-shadow) + annotation → click
pins (persists after mouse leaves) → second click / click-outside / Escape unpins.
Reuses the same `hoveredId`/`pinnedId` state machine already built for the other 4
tool clusters in the prior Gate B pass — no separate interaction system was built.

**WorkflowDiagram**: `hasEntered` (IntersectionObserver, fires once, threshold 0.3) +
`activeNodeId` (hover/focus, dims non-adjacent nodes/connectors, no pin/click
behavior — the spec didn't ask for click-to-pin on workflow nodes, only hover/focus
emphasis).

## 5. Workflow data structure

```ts
type WorkflowActor = 'SCRIPT' | 'AI' | 'HUMAN' | 'OUTPUT'
interface WorkflowNode { id, number, title, actor, tool?, action? }
interface WorkflowDefinition { id, title, nodes: WorkflowNode[] }
```
`buildWorkflowFromProject(project)` **derives** nodes from `project.stages` (the
existing, already-verified single source of truth) rather than authoring a second
parallel dataset — a future edit to real stage text never needs to happen twice.
`tool: 'n8n'` is applied via an explicit, auditable `PROJECT_WIDE_TOOL` lookup (only
`job-application-filter` has an entry, because its own `workflowHtml` text explicitly
says "I built a real n8n workflow that normalizes... validates... maps... routes...",
i.e. n8n verifiably runs all 6 stages) — not silently guessed per-node.

## 6. Screenshot paths

```
project-docs/screenshots/interaction-workflow-proof/
├── hero-rest-1440x900.png
├── hero-figma-hover-1440x900.png
├── hero-figma-pinned-1440x900.png
├── hero-figma-keyboard-focus.png
├── hero-mobile-390x844.png
├── workflow-project01-desktop.png
├── workflow-project01-mobile.png
├── workflow-project01-reduced-motion.png
└── CONTACT_SHEET.png
```

## 7. Build and type-check result

`npm run build` (`tsc -b && vite build`) — **zero TypeScript errors, nothing
suppressed**, ran clean on every pass including the final one. Only pre-existing
warning: the unrelated 3D gateway's `GatewayCanvas` chunk exceeds 500kB (present since
before this task, not touched here).

## 8. Visible overlay ghosting / clipping concerns

**One honestly disclosed, minor issue:** a rest-state pixel diff against the
previously-approved baseline screenshot showed a small region (max channel diff 38/255,
0.58% of total pixels, confined to the Figma pile's own footprint) — traced to soft-edge
alpha blending where the feathered overlay PNG is displayed at a different scale than
its native resolution, layered on the identical base pixels underneath. Verified via
direct `getBoundingClientRect()` math that the overlay is positioned pixel-accurately
(not a misalignment bug) — this is compositing-level, not detectable by eye in a direct
side-by-side crop comparison I did before/after. I did fix and eliminate one real,
larger issue first (identity `transform`/`filter` values on the base overlay class were
promoting it to its own compositing layer with different anti-aliasing — removed by
using no `transform`/`filter` property at all at rest, rather than identity values).

No rectangular edges, no duplicate-image ghosting, no exposed mask artifact — confirmed
visually in the hover/pinned screenshots (see contact sheet items 2–3).

## 9. Workflow content that could not be filled

None — all 6 stages, all actor classifications, and the `tool: 'n8n'` label were
directly supported by existing verified project data (`projects.json`'s
`job-application-filter` entry). No node was left with a guessed tool or an invented
actor.

---

## Also flagged, carried over honestly from the prior Gate B pass

**Keyboard-focus visual verification remains unresolved in this headless testing
environment** — same root cause identified last time (programmatic `.focus()` doesn't
reliably dispatch the event cascade a real Tab press would in headless Chrome; even
`document.activeElement` correctly updates while no visible focus-ring/annotation
appears in the screenshot). The Figma overlay's hotspot reuses the exact same
native-listener fix already applied to the other 4 clusters, so the same caveat
applies: **a real manual keyboard test in an actual browser is still the one thing I
can't substitute for.** Screenshot 4 (`hero-figma-keyboard-focus.png`) shows no visible
change from rest — an honest negative result, not a fabricated positive one.

## Tests completed

**Figma interaction:** rest ✓, hover ✓, mouse-leave ✓ (real Puppeteer hover, not
synthetic dispatchEvent — that produced false negatives in earlier testing, documented
in the prior Gate B report), click-to-pin ✓, second-click-unpin ✓, click-outside ✓,
Escape ✓ (verified via `aria-pressed` state directly, checked in a follow-up call per
the async-batching lesson from Gate B), keyboard Tab focus — code fixed, visually
unverifiable here (see above), normal scroll while pinned — not explicitly re-tested
this pass (no code touched scroll behavior), reduced motion — CSS-level `!important`
fallback confirmed present and correct by direct read, mobile — confirmed `display:none`
via `getComputedStyle`, no overflow.

**Workflow diagram:** desktop horizontal ✓, mobile vertical ✓ (`flex-direction: column`
confirmed via computed style, no overflow), first-viewport entry ✓ (confirmed nodes
start at `opacity:0` before scroll, `--entered` class + `opacity:1` after — the
animation setup is real, not a no-op), node hover ✓ (correct node activated, other 5
dimmed, confirmed via DOM query and screenshot), keyboard focus — same headless
limitation as above, reduced motion ✓ (verified the CSS end-state renders correctly;
true OS-level `prefers-reduced-motion` emulation isn't available via this session's
Puppeteer tooling, same caveat as Hero), no horizontal overflow ✓, no duplicate
six-stage UI ✓ (confirmed `.v2-case-stages` — the old `<ol>` — no longer exists in the
DOM in either FeaturedCaseSection or CaseStudyLayout).

## Not done, per explicit scope

No other tool got the 2.5D overlay treatment. No other project got a WorkflowDiagram.
No full 3D, no Blender/GLB/Spline/React Three Fiber. `/`, `/architecture`, `/about`
untouched. No verified figures or project descriptions changed. No commit, no push, no
deploy.
