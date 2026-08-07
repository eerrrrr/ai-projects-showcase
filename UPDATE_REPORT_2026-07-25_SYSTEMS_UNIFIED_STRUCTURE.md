# Update report — Pass 1: unify systems structure, remove fragile count, extend walkthrough to all 7

**Date:** 2026-07-25
**Branch:** `motion/soft-section-handoff` (continuing on top of the uncommitted soft-handoff
pilot, per instruction — this pass deliberately does not touch motion code)
**Scope:** nav/heading copy, project meta-line format, and evidence-based `hasWalkthrough`
fields for Projects 05-07. No motion files touched.

## Starting state (printed per protocol)

```
$ git branch --show-current
motion/soft-section-handoff
$ git status --short
 M src/App.tsx
 M src/components/Hero.tsx
 M src/components/ProofSummary.tsx
?? UPDATE_REPORT_2026-07-25_SOFT_PAGE_HANDOFF_PILOT.md
?? src/hooks/useSoftPageHandoff.ts
```

(This is the soft-handoff pilot's own uncommitted work from the prior pass, on the same
branch — expected, since that pilot is still awaiting your visual approval before commit.)

**Pre-edit `rg` scan** (`Systems Lab|Archive|PROJECT .* / 07|hasWalkthrough|miniNodes|useSoftPageHandoff|useSectionScroll|scroll-snap|wheel|activeStep`):
confirmed "Systems Lab" existed in exactly 2 places (`page-content.json`'s nav label and
`flagshipHeading`), the "/ 07" meta format existed in exactly 2 places
(`ProjectCard.tsx:143`, `ProjectLogicCard.tsx:30`), and 3 stale "Archive" mentions existed
only in code comments (harmless, not public-facing, but updated anyway for accuracy since
this pass touches those exact areas).

## 1. Removed "Systems Lab" as a separate nav identity

`page-content.json`:
- Nav now has 3 links: **Systems · Visual Portfolio · GitHub** (removed the `#flagship
  Systems Lab` entry entirely).
- `flagshipHeading`: `"Systems Lab"` -> `"System details"` (neutral, not a second brand).
- `flagshipSub`: `"Full detail behind the systems above, plus supporting infrastructure."`
  -> `"Full detail behind each system, plus supporting infrastructure."` (dropped "the
  systems above," which implied 05-07 sit apart from a primary group).

The section itself (`#flagship`, holding Projects 05-07 + Supporting infrastructure)
still exists as a DOM section below the 4 featured project write-ups — merging it into
one single section wasn't requested and risked disturbing existing border/CSS rules tied
to that structure, so it stays, just under a neutral heading instead of a second identity.

## 2. Removed the fragile "/ 07" project count

`ProjectCard.tsx` and `ProjectLogicCard.tsx` both had:
```
Project {index} / {total} · {tierLabel}
```
Changed to:
```
System {index} · {tierLabel}
```
in both files (they're two separate render paths — walkthrough-enabled projects use
`ProjectLogicCard`, others use the inline block in `ProjectCard.tsx` — both needed the
fix). "System" was used instead of "Project" per your stated preference, matching the
site's own "AI Workflow Systems" framing. The project number itself is kept; only the
"/ total" is gone, so adding project 08 later won't make any existing card's meta line
read stale.

## 3. All 7 systems now have "How it works" (evidence-based, not invented)

**What was actually missing** for Projects 05-07 to qualify: `ProjectCard.tsx`'s
`hasWalkthrough` check is `Boolean(valueLine && miniRoadmap && proofChips)` — Projects
05-07 had real `stages` (with real `title`/`body` per stage, correct `actor` types) but
none of `valueLine`/`miniRoadmap`/`proofChips`/`finalRoadmap`/`finalTakeaway`, and their
per-stage `miniNodes` (the 2-4 short phrases shown when a step is expanded) were also
absent. Both were addable purely by restating already-approved copy — no new facts:

- `valueLine`/`miniRoadmap`/`proofChips`/`finalRoadmap`/`finalTakeaway` for each project
  are direct compressions of that project's own existing `goalHtml`/`methodHtml`/
  `resultHtml`/`keyLabel` — e.g. Method of Loci's `proofChips: ["860 AI extracts", "175
  posts", "3.5 months hands-off"]` are the exact numbers already in its `keyLabel`.
- Every stage's `miniNodes` (2-3 phrases each, 15 stages total across the 3 projects) are
  direct splits of that stage's own existing `body` sentence — e.g. "Files are unpacked,
  renamed and registered." -> `["Unpacked", "Renamed", "Registered"]`. No new claims,
  numbers, or capabilities were introduced anywhere.
- **No `image`/`caption` fields were added** to any of these stages — there are no real
  screenshots for these 3 projects, and `StageMedia.tsx` already has an honest, existing
  fallback ("Proof capture to be added.") for exactly this case, so nothing needed to be
  invented or faked to make the walkthrough work.
- Also added one `taglineHtml` per project (e.g. "Turns saved social-media archives into
  a searchable, offline knowledge base.") — needed so the existing `p-key p-key--inline`
  gate in the expand-panel (`{project.taglineHtml && <div className="p-key p-key--inline">}`)
  still shows each project's `keyNumber`/`keyLabel` stat block. Without this, switching
  to the walkthrough left-column layout would have silently dropped those verified
  numbers (860 AI extracts, 2 published productions, 3 content tracks) from the page
  entirely, since `ProjectLogicCard` doesn't render them — caught this by tracing the
  actual render paths before editing, not after.

All 7 projects now pass `hasWalkthrough` and every stage across all 7 has `miniNodes` —
confirmed by script, not assumption (see Build & verification below).

## Guardrails honored

- No motion files touched: `useSoftPageHandoff.ts` untouched (verified — no edit/write
  call made against it this pass), `useWorkflowWalkthrough.ts` timing untouched, no
  scroll behavior/wheel listener/auto-zip logic changed.
- No reintroduction of `useSectionScroll`, `scroll-snap`, wheel hijacking beyond the
  existing pilot, scroll-driven step selection, hash auto-expand, or PLAY/PAUSE/NEXT/
  PREVIOUS controls — confirmed via `rg`, only pre-existing comments matched.
- Did not create a second project category label — Projects 05-07 render in the exact
  same card form (Selected-systems grid) and now the exact same walkthrough component as
  01-04; the only remaining distinction is each project's own honest `tierLabel`
  ("Featured proof" / "Supporting system" / "Learning lab"), which you didn't ask to
  remove and which isn't archive-like framing, just an honest category name per card.

## Build & verification

- `npm run build` (`tsc -b && vite build`) — 0 errors.
- Script-verified: all 7 projects now satisfy `hasWalkthrough`, and every stage (23
  total across all 7) has `miniNodes` populated.
- Live DOM check (Puppeteer, `vite preview`, 1440x900):
  - Nav renders exactly `Systems / Visual Portfolio / GitHub` — no "Systems Lab".
  - All 7 meta lines read `System 0X · <tierLabel>` — confirmed no `/07` anywhere.
  - `#flagship` heading renders "System details", sub renders the reworded text.
  - Clicked "How it works" on Method of Loci, AI-Assisted Video Pipeline, and Blender +
    ComfyUI (previously static-only) — all three now start the interactive walkthrough,
    step 1 goes active, real `miniNodes` render in the expanded panel. Screenshot
    confirms the full card (intro line, mini-roadmap, proof chips, "How it works" +
    "View details" buttons, walkthrough spine, and roadmap recap) renders cleanly and
    matches the existing 01-04 visual language exactly.
- `rg` for banned patterns across `src/` — clean, only pre-existing comments.

## Not touched this pass

`useSoftPageHandoff.ts`, `useWorkflowWalkthrough.ts` (timing/logic), auto-zip logic,
scroll-spy logic, Selected-systems card structure/chips (still tag-first, untouched),
Hero/Plasma, footer, deployment config, `docs/` (not rebuilt — still pending your
approval of both this pass and the motion pilot before any deploy step).

**Not committed, not pushed** — still on `motion/soft-section-handoff`, awaiting your
review of this structural pass before Pass 2 (full soft motion + green accent scale)
begins.
