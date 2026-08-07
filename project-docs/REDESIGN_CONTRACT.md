---
title: Portfolio V2 — redesign contract
created: 2026-08-03
updated: 2026-08-04 — scope expanded, see "Scope decision log"
status: active — read before any V2 work
---

# What this contract is

This branch (`redesign/ui-v2`, worktree at
`D:\ai-test\ai-projects-showcase-v2`) is the safe redesign worktree for
the AI portfolio. This file is the hard boundary for that work — read it
before touching code, and re-check it before merging anything back to
`main`.

V1 lives untouched at `D:\ai-test\ai-projects-showcase` (branch `main`,
backed up separately at `backup/ui-v1-2026-08-03`). Nothing in V2 work
should ever require editing that folder.

## Scope decision log

**2026-08-03 (original scope):** replace only the AI portfolio's visual
storytelling layer — same content, same routes, new interface.

**2026-08-04 (Option A chosen — scope expanded):** this worktree becomes
a **3D total-portfolio gateway**, not just a reskinned AI portfolio.
Planned route structure:

```
/            3D desktop gateway (new — not built yet)
/ai          existing 7 AI projects, redesigned interface (this was the
             original V2 scope, unchanged in substance)
/architecture  brief intro + link out to the existing, separately
               maintained architecture site (not migrated in, not rebuilt)
/furniture   future
/game        future
```

Reasoning for Option A over a brand-new `erin-portfolio-platform` repo:
this worktree already has the safety branches, the verified AI content/
JSON, and a working GitHub Pages deploy path — starting a second repo
would duplicate all of that for no structural benefit, at real token
cost. The old standalone AI site (`main`) is not meant to be preserved
long-term; V2 replacing it as the new total entry point is the intended
end state, not a scope violation.

**What did NOT change:** everything in "What must NOT change" below
still applies in full to the `/ai` section specifically — the AI
content/JSON/tier/actor rules were never about the AI portfolio being
the *only* thing this worktree becomes, they're about not letting a
visual redesign (of any scope) corrupt that specific content.

## What must NOT change

- `src/data/page-content.json`, `src/data/projects.json`,
  `src/data/types.ts` — content and shape. New components may read these
  files differently, but the values inside them (titles, taglines, stage
  text, figures, chips, etc.) are not to be rewritten, shortened, or
  "improved" as copy. If a new layout genuinely can't fit existing copy,
  that's a flag to raise, not a silent edit.
- The **tier system** (`tier: 1/2/3` → Featured proof / Supporting
  system / Learning lab) — this is a real editorial decision already
  made, not a placeholder.
- The **actor typing** (`sys`/`ai`/`human`/`out`) on every workflow
  stage — this is the throughline that shows where a human decision
  gate sits versus where automation ran. A redesign can restyle it
  completely but must not erase the distinction.
- The **compact vs. expanded content depth** on Tier-1 projects
  (`problemHtml`/`workflowHtml`/`resultShortHtml` shown by default;
  `goalHtml`/`methodHtml`/`resultHtml`/`failureHandledHtml`/
  `decisionHtml`/`limitationHtml` behind a reveal) — this progressive
  disclosure is deliberate, not a limitation of the old design.
- Verified figures (515,000 facts, 188 pipeline runs, 860 AI extracts,
  6 test records / 1 READY / 3 NEEDS_REVIEW / 2 BLOCKED, etc.) — these
  came from real logs/executions checked earlier in this project's
  history. Do not round, dramatize, or "polish" them.
- The deployment path: `main` branch → `docs/` folder → GitHub Pages.
  V2 work stays on `redesign/ui-v2` until explicitly approved and merged.

## What IS the job

- A completely new visual system: typography, spacing, color, motion,
  layout, media treatment, page structure.
- New components under `src/components/v2/`, new styles under
  `src/styles/v2/`, wired up behind a V1/V2 switch — V1 components stay
  in place and functional throughout.
- Real media-led storytelling where the old design had no images at all
  (`StageMedia.tsx` currently renders caption-only text for every single
  workflow stage across all 7 projects — no screenshot files exist yet).
- (Per the 2026-08-04 scope decision above) A new 3D desktop gateway at
  site root, with `/ai` becoming the redesigned AI portfolio and
  `/architecture` linking out to the existing separate site. **Not
  started yet** — no greybox, no route structure, no build prompt written
  for this piece as of this update. Do not begin implementing it without
  an explicit build instruction; this contract only records that it's
  the agreed direction, not a go-ahead to start building.

## Source of truth for content

`CONTENT_EXPORT_FOR_REDESIGN_2026-07-26.md` (repo root) — full export of
every field in `projects.json`/`page-content.json`, plus the component
inventory. Read this, not a paraphrase of it, before generating any UI
content pack for Gemini/Stitch.

## Before merging back to main

1. Confirm `.github/workflows` (if any) only deploys from `main` —
   `redesign/ui-v2` pushes must never trigger a live deploy.
2. Visual QA against approved Figma frames (see `FIGMA_HANDOFF.md`).
3. Confirm every field listed above is still sourced from the same JSON
   files, unedited.
4. Explicit user approval before `git merge redesign/ui-v2` into `main`,
   and explicit "go push" before pushing `main`.
