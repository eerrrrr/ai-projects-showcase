---
title: Claude Recruiter V2 Full Build Brief (as received)
received: 2026-08-05
status: superseded in part — see note below
---

> **Note on this file:** this brief was pasted directly into chat and the
> harness truncated it at ~50,000 characters (it cuts off mid-section 4,
> "Do not put the complete page..."). What's below is exactly what was
> received, unedited. The actual implementation plan used —
> `C:\Users\erinw\.claude\plans\rippling-scribbling-shore.md` at the time
> of building — is the source of truth where it differs from this brief,
> because it incorporates a round of explicit corrections made after this
> brief was reviewed:
> - target `/ai` only (not a new route replacing `/`)
> - Job Screening gets a **substantial inline section on `/ai`**, not just
>   a compact tile behind a separate route
> - case-study route is `/ai/job-application-filter` (the real
>   `project.id`), not `/ai/job-screening-validation`
> - hero copy is exact approved text, stored scoped to V2, not written
>   into `page-content.json`
> - mobile hotspot fallback is 4 restrained numbered Swiss links, not
>   rounded pill "shortcut chips"
> - the older, separate "process-automation framing" restructure plan
>   (Reconciliation/Evidence-Gate additions, capability re-tagging, RoleFit
>   move) is explicitly NOT part of this work
>
> Kept here as a record of what was proposed, not as the literal spec that
> was executed.

---

# Claude Code Build Brief — Recruiter-First AI Workflow Portfolio V2

## 0. Current repository state supplied by Erin

```
V1 live source:
- main at 8ab8ebe
- backup/ui-v1-2026-08-03

V2 worktree:
- D:\ai-test\ai-projects-showcase-v2
- branch redesign/ui-v2
- latest reported checkpoint ea133b1

Existing structure:
D:\ai-test\ai-projects-showcase-v2\
├── project-docs\
│   ├── REDESIGN_CONTRACT.md
│   ├── DESIGN.md
│   ├── MOTION_SPEC.md
│   ├── FIGMA_HANDOFF.md
│   ├── KICKOFF_PROMPTS.md
│   └── UI_CONTENT_PACK_FOR_STITCH.md
├── docs\                  ← build/deploy output only
├── public\case-media\     ← real source for case media
├── src\
└── CONTENT_EXPORT_FOR_REDESIGN_2026-07-26.md
```

The approved hero source image is currently at:

```
D:\Download\Gemini_gi13qr.png
```

Copy it to:

```
D:\ai-test\ai-projects-showcase-v2\public\media\v2\ai-workflow-hero.png
```

Do not move or delete the source file in Downloads.

## 1. Working boundary and safety

Work only in:

```
D:\ai-test\ai-projects-showcase-v2
```

Expected branch:

```
redesign/ui-v2
```

Before changing any file, run and report:

```
git branch --show-current
git status --short
git log -1 --oneline
```

Rules:

- If the branch is not `redesign/ui-v2`, stop.
- If the worktree is dirty before this task begins, stop and report the files.
- Do not edit `main`.
- Do not delete V1 components.
- Do not manually edit `docs/`; it remains build output only.
- Do not alter verified figures, project claims, data structures, or deployment commands.
- Do not push or replace the live website during this task.
- Build and test V2 locally first.
- Keep every new V2 style scoped so V1 is unaffected.

Read before implementation:

```
CONTENT_EXPORT_FOR_REDESIGN_2026-07-26.md
src/data/page-content.json
src/data/projects.json
src/data/types.ts
project-docs/REDESIGN_CONTRACT.md
project-docs/DESIGN.md
project-docs/MOTION_SPEC.md
project-docs/FIGMA_HANDOFF.md
project-docs/UI_CONTENT_PACK_FOR_STITCH.md
package.json
```

Also inspect the current app entry, routing method, build command, base
path, and existing V2/gateway code before proposing files.

## 2. Decision: build now without Stitch or approved Figma frames

The current task supersedes the previous waiting state for Stitch/Figma.

Use the approved hero image and this brief as the explicit build instruction.

Do not wait for:

- Stitch directions
- Figma frames
- architecture model
- phone object
- full multidisciplinary 3D gateway

This version is the recruiter-facing AI Workflow portfolio V2.

The future multidisciplinary gateway can later replace only the cover
visual without rebuilding the entire content system.

## 3. Product goal

Create a complete recruiter-first AI Workflow portfolio V2 with:

- A. Swiss editorial hero
- B. interactive cover image
- C. normal vertical scrolling
- D. clickable project hotspots
- E. Job Screening shown first
- F. reusable Swiss-style case-study system
- G. one complete Job Screening case study
- H. compact presentation of the remaining projects

The first 10 seconds should communicate:

```
Erin Wong
AI Workflow Systems
Human-reviewed automation, data pipelines,
and reusable decision systems.
```

The user may either click a hotspot or scroll normally. Never force
interaction.

## 4. Swiss visual system

Create a restrained Swiss / International Typographic Style system.

**Layout grammar** — use a consistent 12-column desktop grid, 4-column or
single-column mobile grid, strong left alignment, generous negative space,
deliberate asymmetry, thin horizontal rules, small section numbers, clear
typographic scale, objective labels, media-led evidence, repeated
alignment lines across sections.

**Avoid:** SaaS dashboard layouts, excessive bordered cards, rounded
feature tiles everywhere, glassmorphism, generic AI gradients, decorative
blobs, chip-heavy interfaces, centred marketing layouts, long text visible
all at once, equal visual weight for every project.

**Typography** — inspect existing fonts first; prefer reusing an existing
locally configured neutral grotesk/sans font, otherwise system sans stack;
mono only for numbers/data/workflow labels; no paid or new external font
request. Sentence case, not all-caps everywhere.

**Colour system** — base the page on the approved hero atmosphere (paper/
ink/muted ink/rule/restrained terracotta-cardboard accent); do not copy
the saturated blue ComfyUI card as a site-wide accent.

**Corners** — page sections and project layouts mostly square or very
small radii; the hero image itself may stay rectangular.

[Brief truncated here by the harness — remaining sections on hero motion,
hotspot behavior, the reusable inner-page system, and safety checklist were
covered separately earlier in the same conversation and are reflected in
the implementation plan instead.]
