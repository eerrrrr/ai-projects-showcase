---
title: V4 pre-implementation review — video findings, V4 read, comparison, plan
date: 2026-08-06
status: REVIEW ONLY — no code changed this turn
---

# Method, honestly stated

I do not have a video-playback/frame-by-frame tool. What I actually did: ran
`ffprobe` for exact duration/resolution/fps on all 4 files, then used `ffmpeg`
to generate one contact-sheet image per video (30–42 sampled frames spread
evenly across the full duration, tiled into a grid) and read those as images.
This gives me real coverage of each video's full timeline at ~1 frame per
1–5 seconds — enough to read composition, states, and page structure
confidently, but **not** enough to extract precise millisecond easing/duration
values (a contact sheet can't show me a 200ms transition). Where the review
below states a timing number, it's from the V4 document's own text, not
something I measured from the videos myself. I want to be clear about that
line, not blur it.

## Video 1 — `video_1_1.mp4` (32.1s, 1152×720, 30fps)

"My Room in 3D" — this is a **tutorial/review video** of an open-source
Three.js room template (ends on its GitHub repo page, "My Room in 3D"), not a
live interactive portfolio walkthrough. Fixed isometric camera throughout —
essentially the same framing in all 30 sampled frames, no camera movement, no
page transition, no click-response visible. Saturated pink/purple gaming-room
palette — explicitly NOT Erin's palette, and V4 correctly never references it.
**Low transferable value** beyond "stable single-scene atmosphere," which V4
already states independently in §1.4.

## Video 2 — `video_1_2.mp4` (218.1s / 3m38s, 1264×720, 30fps) — "Bigpengu's room"

Rich isometric desk scene: whiteboard with onboarding text ("Drag around and
take a look. Some things in this room are clickable... Stay curious. Have
fun"), bookshelf, photo-frame/gallery viewer, bicycle, camera, terminal
laptop. **Confirmed interaction pattern: click an object → a flat overlay
panel appears anchored at/near that object** (a black+yellow text-reader
panel, an image-gallery viewer with a thumbnail strip, a working CLI terminal
with typed commands: `help`, `about`, `interests`, `socials`, `echo`,
`clear`). The isometric room framing itself stays static across nearly every
sampled frame — **no camera dolly/zoom is visible in this reference.**

## Video 3 — `video_1_3.mp4` (43.9s, 1562×720, 30fps) — "DA×WN STUDIO"

Two distinct halves. First ~60%: a literal pegboard with 4 hanging
tag/card objects (keyring fob, ID-badge pass card "02 SELECTED WORKS",
folded card "01 ABOUT ME", postcard "CONTACT") — clicking one opens a
content panel at that spot (about-text panel, a horizontal "SKILLS 技能列表"
image carousel, a CV-style scan). **Around 60% through, the content changes
entirely** to a flat, non-3D, Swiss-editorial studio site: "DA×WN STUDIO — a
visual design studio exploring brands, objects, stories and image systems
through graphic, packaging and AI-driven design," followed by a plain ruled
project-index table (client/year/type) and then full-bleed colour-blocked
project tiles. **This is the strongest, most directly-relevant reference for
V4's Manifesto (§7) and Selected Systems index (§8)** — those sections read
as a credible, grounded adaptation of this exact pattern, not an invented one.

## Video 4 — `20260805-1628-33.9654885.mp4` (86.3s, 2410×1424, 30fps) — "Pin Chen's room"

Same underlying grammar as video 2, independently: isometric desk scene
(monitor+photo, records, camera, notebook, laptop) → click laptop → terminal
boot animation (ASCII face, "PinChen" banner, loading bars) → a tabbed
photo-viewer panel → eventually a **separate**, plain, centered, small-type
text bio page ("pin chen — Hi, I'm pin chen...", headed sections "What I am
living these days:", "Other obsessions:", footer social icons). Static
framing throughout, overlay-at-object pattern, then a flat page for the
"about" content — confirms video 2's pattern independently rather than
contradicting it.

## The one honest cross-video finding that matters

**None of these four videos demonstrate "click an object → smooth-scroll to
a page section while the scene stays visible."** All four instead show
"click → local overlay/panel appears at or near the object" and/or "eventual
transition to a separate flat text page." The "click → scroll to `#ai`
section" architecture decision earlier in this project's history was based
on a **different, fifth video that I have still never actually been able to
watch** (same tool limitation, from several turns ago) — I want to say that
plainly rather than imply these four videos retroactively confirm it, because
they don't. **This doesn't block V4 specifically**, though — V4's Hero section
requires no click at all (pure proximity, unchanged), so this tension isn't
live in the current spec. It only matters if a future pass revisits
click-driven navigation anywhere.

---

# V4 spec read — summary

Read in full (2,854 lines). It is a careful, well-constrained document:

- Explicitly locks in and preserves Pass H v3.2's Hero geometry, the RAF
  proximity engine, smoothstep/hysteresis, all 11 verified targets, and the
  "no click in Hero" rule — it does **not** ask for a Hero rebuild.
- Explicitly forbids installing Motion/Framer Motion/GSAP/Lenis/Three.js/R3F/
  Spline, forbids `scroll-snap-type`, forbids wheel interception, forbids
  `taskkill /F /IM node.exe` — all consistent with constraints already
  established and honoured in this session.
- The rolling-page mechanism (`position: sticky` stage inside a
  `min-height: 132svh` wrapper) is the real, load-bearing mechanism; CSS
  `animation-timeline: view()` is explicitly gated behind `@supports` as pure
  progressive enhancement, with a stated non-JS-scroll-simulated fallback and
  a `prefers-reduced-motion` override. This matches how `view()` timelines
  are actually meant to be used per current browser-support reality — I
  can't independently verify cross-browser behaviour in this environment
  (no cross-browser testing tool here, only the one Chromium instance
  Puppeteer drives), but the fallback is real and doesn't depend on it.
- §14 (WorkflowDiagram) proposes a cleaner, extracted `useWorkflowPlayback`
  hook version of what I hand-built inline in Pass W — genuinely better
  organised (proper cleanup, settle-back-to-node-0 timer, reduced-motion
  branch built in from the start). This is a refactor of existing work, not
  a conflicting rebuild.
- §6.6–6.8 is a real, specific behaviour change from what's currently live:
  **remove the bare tool-name-only annotation state entirely.** Currently,
  low-strength proximity shows just the tool's name (e.g. "COPILOT") even
  for the 4 unverified/decorative targets. V4 says: if a target has no
  verified project mapping, the camera-focus response still happens but
  **no annotation renders at all** — never a name-only label. This is
  explicit and intentional in the spec, not a gap I'm inferring, but it is a
  real change in what a recruiter sees when hovering Power BI/Copilot/OpenAI/
  MS Office, so I'm flagging it rather than quietly implementing it.

---

# What should be adopted

- The full page sequence (§4) — directly answers the "long list" and
  "no page-by-page grammar" complaints from the last review round.
- Manifesto as its own page (§7) and the old-site-style ruled Selected
  Systems index (§8) — both grounded in the DA×WN reference, not invented.
- `ChapterRail` + `useActiveChapter` via IntersectionObserver, not a scroll
  listener (§9) — matches the performance discipline already in place.
- `StoryPage` sticky-stage shell with `@supports`-gated view-timeline
  enhancement, explicit fallback, explicit reduced-motion, explicit mobile
  override (§10) — technically sound, doesn't gate content access on an
  unproven API.
- `SystemPresentation` adapter over existing `project.stages`/`projects.json`
  (§11–§12) — one more presentation layer, not a second data source; matches
  this whole project's "verified data stays verified" rule.
- 4/8 grid `SystemChapter` composition (§13) and the refactored
  `WorkflowDiagram`/`useWorkflowPlayback` (§14) — upgrades Pass W rather than
  replacing its intent.
- Evidence strip (§15, max 3 items) and case-notes `<details>` fallback
  (§16) for projects without a full case-study route.

# What should not be copied from the reference videos

- The literal pegboard/3D-room visual language, the click→overlay-panel
  interaction pattern, and the terminal/CLI gimmick — V4 correctly doesn't
  ask for any of these, and I won't introduce them on my own initiative.
  They're useful as *evidence that the Manifesto/Index pattern is a real,
  credible reference*, not as literal interaction targets.
- Video 1's saturated gaming-room palette — no relevance to Erin's material
  world, V4 doesn't reference it, I won't either.

# Conflicts / technical risks in V4, stated plainly

1. **Total page length.** 12 stacked `min-height: 132svh` sections ≈ roughly
   14–15× viewport height of scrollable document. V4's whole premise is that
   the sticky-stage rolling effect makes this read as discrete pages, not a
   flat long list — architecturally different from the earlier complaint,
   but I can only confirm whether it *actually* reads that way once it's
   built and I can screenshot/scroll it live, not from reading the spec.
   Flagging as "needs a real look before calling it solved," per V4's own
   §23 step-by-step + stop-and-check discipline.
2. **`HeroToolTarget.annotation` reshape.** V4 proposes a new nested
   `{ offsetXPercent, offsetYPercent, align, usageLead, projectRows }` shape,
   different from my current flat `annotationSide/annotationOffsetX/
   annotationOffsetY` fields. I'll migrate my 11 existing, already-verified
   entries into V4's shape rather than run two parallel annotation systems —
   moderate, mechanical work, not a design risk.
3. **Token duplication risk.** V4's §5 CSS variables (`--v2-ink-soft`,
   `--v2-page-pad`, `--v2-content-max`, `--v2-rule-strong`, `--v2-ease-out`,
   `--v2-ease-soft`, etc.) partially overlap in *purpose* with tokens I
   already have under different names (`--v2-grid-margin` ≈ `--v2-page-pad`,
   `--v2-max-width` ≈ `--v2-content-max`, `--v2-rule` already exists). I'll
   consolidate onto one set rather than let both exist — will reuse my
   existing names where equivalent, and only add genuinely new tokens
   (ink-soft/faint, table-soft/deep, rule-strong, the two ease curves).
4. **§6.6–6.8's "no annotation for unverified targets" is a real UX
   change** (see above) — implementing it as specified, but naming it
   explicitly rather than letting it slide in unannounced.
5. **`usePrefersReducedMotion` vs my existing `useReducedMotion`.** Same
   hook, different name in V4's file list. Per V4's own "do not duplicate a
   component under a slightly different name" rule (§22), I'll keep my
   existing `useReducedMotion.ts` and use it wherever V4 says
   `usePrefersReducedMotion`, not create a second file.
6. **`FeaturedCaseSection.tsx`/`SwissOverview.tsx` are superseded, not
   mentioned.** V4's `SystemChapter` + `SelectedSystemsIndex` functionally
   replace what these two components currently do for the `/ai` main page.
   V4 doesn't explicitly say to retire them. I'll stop referencing them from
   `AiPortfolioV2Page.tsx` and leave the files on disk unreferenced — same
   archived-not-deleted policy as every other retired file this session
   (`heroToolUsage.ts`, the old overlay PNG).

# Exact files I expect to change

```
Modify:
  src/components/v2/SwissHero.tsx        (bottom feather CSS, title micro-scale
                                           setProperty, annotation model swap)
  src/components/v2/WorkflowDiagram.tsx  (refactor onto useWorkflowPlayback hook)
  src/data/heroToolTargets.ts            (annotation field reshape, all 11 entries)
  src/pages/AiPortfolioV2Page.tsx        (assemble new page sequence + ChapterRail)
  src/styles/v2/tokens.css               (consolidate/add tokens, no duplication)
  src/styles/v2/hero.css                 (feather, annotation restyle)
  src/styles/v2/workflow-diagram.css     (node styling refresh per §14.5)

Add:
  src/components/v2/HeroUsageAnnotation.tsx
  src/components/v2/ManifestoPage.tsx
  src/components/v2/SelectedSystemsIndex.tsx
  src/components/v2/ChapterRail.tsx
  src/components/v2/StoryPage.tsx
  src/components/v2/SystemChapter.tsx
  src/components/v2/SystemSummary.tsx
  src/components/v2/SystemEvidence.tsx
  src/components/v2/SystemCaseNotes.tsx
  src/data/systemPresentation.ts
  src/hooks/useActiveChapter.ts
  src/hooks/useWorkflowPlayback.ts
  src/styles/v2/story-pages.css
  src/styles/v2/system-index.css
  src/styles/v2/system-chapter.css

Stop referencing (left on disk, archived not deleted):
  src/components/v2/FeaturedCaseSection.tsx
  src/components/v2/SwissOverview.tsx

Untouched:
  src/data/projects.json, page-content.json, types.ts
  src/pages/CaseStudyPage.tsx, src/components/v2/CaseStudyLayout.tsx (deep case-study route, unaffected)
  src/data/workflowDiagram.ts (stage-derivation source of truth)
  src/hooks/useReducedMotion.ts, useCoarsePointer.ts (reused, not duplicated)
  /, /architecture, /about, main, V1
```

# Implementation order I'll follow (adopting V4's own §23 verbatim)

```
1. Snapshot current state           — already have this (Pass H/W reports)
2. Narrow Hero refinement only      — feather, title micro-scale, usage-only
                                       annotation, generic component; RUN AND
                                       LOOK before continuing
3. Manifesto page                   — verify visually independent
4. Selected Systems index           — verify exact old-site titles/signals
5. Reusable StoryPage rolling shell — test Hero→Manifesto→Index→one empty
                                       chapter; confirm native scroll intact
6. SystemChapter                    — wire Project 01 only, confirm 4/8 grid
7. Generalise to Systems 01–07      — from data + presentation adapter
8. Workflow hook generalisation
9. Supporting Infrastructure + Closing
10. QA, screenshots, real recording — STOP
```

I will not collapse this into one uninterrupted pass — matches both V4's own
explicit staging and this whole session's repeated lesson about not changing
too much at once to stay able to diagnose what broke.

---

**Stopping here, as instructed.** No code changed this turn. Waiting for
approval before starting Step 2.
