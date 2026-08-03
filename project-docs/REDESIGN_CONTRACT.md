---
title: Portfolio V2 — redesign contract
created: 2026-08-03
status: active — read before any V2 work
---

# What this contract is

This branch (`redesign/ui-v2`, worktree at
`D:\ai-test\ai-projects-showcase-v2`) exists to replace the **visual
storytelling layer only**. This file is the hard boundary for that work —
read it before touching code, and re-check it before merging anything
back to `main`.

V1 lives untouched at `D:\ai-test\ai-projects-showcase` (branch `main`,
backed up separately at `backup/ui-v1-2026-08-03`). Nothing in V2 work
should ever require editing that folder.

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
