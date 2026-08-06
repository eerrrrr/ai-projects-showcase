---
title: Hero rebuild — full-viewport cover canvas + generalised pointer-proximity engine
date: 2026-08-06
branch: redesign/ui-v2
commit: not committed
---

# Camera-focus generalised to every named card; no click required anywhere

## 1. Changed files

```
Modified:
  src/components/v2/SwissHero.tsx     (full rewrite — proximity engine, shared
                                        Inspector, cover-canvas markup)
  src/styles/v2/hero.css              (full rewrite — cover canvas, shared veil/
                                        Inspector styles, removed scroll cue)
  src/styles/v2/tokens.css            (--v2-paper refined, --v2-table-surface
                                        tokens added, grid margin/max-width widened,
                                        .v2-visually-hidden utility added)
  src/components/v2/FeaturedCaseSection.tsx (removed the "01 / Featured proof"
                                        visible eyebrow — moved into a visually-
                                        hidden accessible prefix instead of dropped)

Added:
  src/data/heroToolTargets.ts         (new registry — 11 individually-named,
                                        continuously-tracked proximity targets;
                                        replaces heroToolUsage.ts's 5 grouped
                                        click-to-pin clusters)
  src/hooks/useCoarsePointer.ts       (mirrors useReducedMotion.ts's pattern)

Left on disk, unreferenced (archived, not deleted — same policy as the earlier
retired overlay PNG):
  src/data/heroToolUsage.ts
  public/media/v2/hero-overlays/figma-make-overlay.png

Untouched this pass (confirmed via mtime — unchanged since the 8/5 23:58-23:59
Phase-2 pass):
  src/components/v2/WorkflowDiagram.tsx, src/data/workflowDiagram.ts
```

## 2. What changed, in one paragraph

The Hero is now a true full-viewport cover-canvas photo (no outer frame, no base
`scale(1.05)`, "SCROLL TO EXPLORE" removed entirely). Every individually-printed,
individually-named card — not just Figma Make — now gets the exact same restrained
camera-focus response, driven by one continuous `requestAnimationFrame` loop that
tracks real pointer distance to each card's measured centre, not discrete
hover/click on 5 grouped hotspot regions. No click is required anywhere: proximity
alone drives a gradual scene-focus, a shared Inspector panel, and a progressive
name → summary → full-usage reveal. Project 01 immediately follows with a wider
grid and no "01 / Featured proof" eyebrow line, sitting directly on the same
continuous warm-paper background the Hero photo itself sits on top of.

## 3. The Tool Target Registry — what's real and what isn't

Re-measured all 12 originally-assumed named cards directly from the source image
(percent-gridline overlay crops, same method this project has used throughout).
**One does not exist as assumed**: the card partly hidden behind "Comfy" was
expected to read "Codex" — a tight crop shows it actually reads "...urtex"
(partially hidden, not a real recognisable software name). It is **not registered
as a target** — flagged here rather than guessed. The registry ships with **11
targets**, not 12.

Tool→project relationships are traced to `projects.json`'s own `overviewChips`
field (its real declared stack) plus direct text search — not guessed:

```
figma-make    → Source-to-Figma Data Visualization Pipeline (03)     [kept from prior pass]
n8n           → Job Screening Validation Workflow (01)               [overviewChips]
notion        → Job Screening Validation Workflow (01)                [tags]
              → Investment Reasoning Learning Database (02)          [resultHtml prose:
                                                                        "Kept Notion as
                                                                        a view layer"]
              → Source-to-Figma Data Visualization Pipeline (03)     [overviewChips]
python-basic  → Investment Reasoning Learning Database (02)          [overviewChips]
              → Method of Loci (05)                                  [overviewChips]
sqlite        → Investment Reasoning Learning Database (02)          [overviewChips]
              → Method of Loci (05)                                  [overviewChips]
comfy         → Blender + ComfyUI (07)                               [overviewChips: 'ComfyUI']
claude-code   → portfolio-wide meta-claim (how the site itself was built) —
                carried over unchanged from the retired registry, not a
                project-stage claim
copilot / openai / ms-office / power-bi → no verified mention anywhere in
                projects.json — registered as real proximity targets (they are
                genuinely printed, named cards) but the Inspector shows the bare
                name only, no invented usage claim
```

## 4. Proximity engine — the actual mechanics

```
distance = sqrt( ((px - targetX)/radiusX)^2 + ((py - targetY)/radiusY)^2 )
strength = smoothstep(1.35, 0.35, distance)   // 0 beyond 1.35, 1 inside 0.35
```

Hysteresis (prevents flicker between the closely-stacked top cards):
```
- no active target yet  → adopt nearest if its distance < 1.35
- an active target exists → only switch if the new nearest is < 0.82x
  (~18% closer) than the current target's own distance
- release the current target once ITS OWN distance exceeds 1.5
```

Verified live (`getComputedStyle`/inline-style read after a real Puppeteer hover,
not just source-code review):
```
At Figma Make's exact centre:  scale(1.003), veil opacity 1 (of a 0.02 ceiling
                                = ~2% outer dimming), Inspector = "FIGMA MAKE /
                                03 Source-to-Figma Data Visualization Pipeline"
Moved to an empty background
  point (no card nearby):      scale reverts to 1, veil → ~0, Inspector cleared
Moved to Copilot's centre:     Inspector = "COPILOT" only (no invented claim)
Moved to Notion's centre:      Inspector = "NOTION / USED ACROSS 03 SYSTEMS /
                                01 Job Screening.../ 02 Investment.../
                                03 Source-to-Figma..." — full 3-stage progressive
                                reveal confirmed working
Keyboard .focus() on
  Claude Code's button:        Inspector shows full content immediately (strength
                                forced to 1, per "keyboard focus simulates full
                                proximity")
.blur():                       Inspector clears cleanly
```

Maximum values, both at the shared ceiling already approved for Figma Make in the
prior pass, now generalised to all 11 targets: **scene scale +0.003, veil ≈2%
outer dimming** — not the larger 1.008/3.5% values from the click-to-pin version,
which this pass fully retires.

## 5. No spring library — disclosed substitution

This project has **no Motion/Framer Motion dependency** — checked `package.json`
and `node_modules` directly, neither exists. The very first motion-correction pass
in this whole saga already established "do not install a new dependency" as a
standing rule. Rather than add one now, "critically damped spring" is approximated
with plain **per-property exponential smoothing**, using a real elapsed-time delta
each animation frame (framerate-independent): `value += (target - value) * (1 -
exp(-dt/tau))`. This is mathematically incapable of overshoot or bounce by
construction, satisfying that specific requirement directly — but it is not a
literal mass/stiffness/damping simulation, so it won't feel identical to a real
spring. Focus position uses a slower time-constant (220ms, "heavier"), the
Inspector-driving strength value a faster one (120ms, "quiet and quick") — the
qualitative character requested, built without a new dependency. Flagging this
substitution explicitly rather than silently reinterpreting the spec.

## 6. Full-viewport cover canvas

```css
.v2-hero-scenePositioner {
  width: max(100vw, calc(100dvh * 1.8111979167));
  aspect-ratio: 2782 / 1536;
  transform: translate(-50%, -50%);
}
```
Used verbatim as given. Verified live: at an 800×600 test viewport the positioner
resolved to 1086.7×599.99px (height-bound branch, since `100dvh*ratio` exceeded
`100vw`) — matches the formula's intended behaviour exactly, with `.v2-hero`'s own
`overflow: clip` confirmed containing the oversized box (`document.documentElement
.scrollWidth === clientWidth`, no horizontal overflow introduced).

## 7. Continuous background / no seam

The Hero no longer has any margin/padding, and Project 01 sits directly on the same
flat `--v2-paper` (`#f0e5d5`) the rest of the page already used — verified visually
via a screenshot scrolled exactly to the Hero/Project-01 boundary: no white gap, no
separate panel, no visible margin. **One honest observation, not hidden**: there is
a soft ~15px tonal band right at that boundary where the real photo's own bottom-
edge floor colour meets the flat page colour — both are close warm neutrals, so it
reads as a natural photo-to-page transition rather than a hard seam, but it is not
a perfectly invisible blend either. No `--v2-table-surface` gradient blend was
added at that exact line since the spec's acceptance checks ask for "no gap / no
white band / no separate panel," not a pixel-matched blend — those criteria are
met.

## 8. "01 / Featured proof" removal

Removed from visible rendering; kept as a `.v2-visually-hidden` prefix inside the
`<h2>` itself (`01. Featured proof. Job Screening Validation Workflow`, only the
title text visible) rather than deleted outright, so screen-reader users don't
lose the "this is item 01 of a tiered list" context that sighted users now get
implicitly from position instead.

## 9. Screenshots

```
project-docs/screenshots/proximity-engine-v3/
├── 01-rest.png              — full-viewport hero, no scroll cue, no markers
└── 02-proximity-figma.png   — pointer at Figma Make: shared Inspector visible,
                                card itself unchanged, subtle veil/scale (not
                                visually obvious at this zoom, by design)
```

Also visually confirmed (not saved as separate files, screen-viewed directly):
mobile (390×844, static image + numbered links, no proximity layer), the Hero→
Project 01 scroll boundary, and the top-stack cluster (Copilot/Notion/OpenAI/MS
Office/Claude Code/n8n) all six individually reachable.

**Not attempted this pass**: a real screen recording (same standing tool
limitation as every prior pass — no CDP/recording tool available). Given this
pass's core claims are now backed by live `getComputedStyle`/inline-style
verification at multiple discrete points (section 4) rather than static
screenshots alone, this is a reasonable substitute for the specific mechanics, but
**the actual felt smoothness of the exponential-smoothing motion still needs your
own eyes on the running site** — that's exactly the category of thing static
verification can't confirm.

## 10. What I did not implement, disclosed deliberately

**Phase 15's scroll-linked micro-response** (scene scale 1→1.015 / identity
translateY 0→-12px / opacity 1→0.84 tied to early scroll) — **not implemented**.
It isn't part of the 22-point acceptance checklist, it's framed as a "maximum,"
and scroll-linked transforms carry real jank risk for marginal visual payoff on
top of an already-substantial rewrite. The plain CSS entrance animation (scene/
identity/nav fade-and-settle on load, Phase 15's other half) **is** implemented.
Flagging the trim explicitly rather than silently skipping it.

## 11. Confirmed untouched

```
src/components/v2/WorkflowDiagram.tsx   2026-08-05 23:59:26   (unchanged)
src/data/workflowDiagram.ts             2026-08-05 23:58:33   (unchanged)
```
Verified live too: the Job Screening Sequence section still renders all 6 stages
with correct actor labels, unaffected by the Hero/grid changes around it.

## 12. Build

`npm run build` (`tsc -b && vite build`) — zero TypeScript errors.

## Local preview

Dev server left running at **http://127.0.0.1:5195/ai-projects-showcase/ai** — not
stopped, not killed, no `taskkill` used this time (only this one tracked process).

## Not done, per explicit scope

No commit, no push, no deploy. No change to verified project data/figures beyond
the tool→project mappings documented in section 3 above (all traced to existing
`projects.json` fields, none invented).
