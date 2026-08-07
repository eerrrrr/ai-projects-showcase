---
title: Project 1 workflow-diagram sync — update report
date: 2026-07-26
branch: main
commit: not committed
---

# Project 1 workflow-diagram sync

## Scope

Requested: sync Project 1's animated workflow diagram/sequence to the new
OpenClaw-style n8n → Notion handoff story, without touching layout, CSS,
scroll, background, `useWorkflowWalkthrough` logic, `ProjectCard` behavior,
Selected-systems cards, or deployment/docs.

## Finding: mostly already done

The prior pass (content-only Project 1 update, same session) already
rewrote `projects.json`'s `stages` array to the exact 6-step sequence this
request asks for — `WorkflowWalkthrough.tsx` and `useWorkflowWalkthrough.ts`
are both fully data-driven off `project.stages` (no hardcoded step count or
step names), so no component code needed to change for the diagram itself
to reflect the new sequence. This report documents verification of that,
plus the specific checks this request asked for.

## Current stage sequence (verified, `src/data/projects.json`, Project 1)

```
1. [sys]   Intake trigger
2. [sys]   Normalize record
3. [sys]   Validate safety rules
4. [sys]   Map Notion payload
5. [human] Route review state
6. [out]   Review report / write outcome
```

Matches the requested linear 6-step sequence exactly. The site's
`WorkflowWalkthrough` component renders steps as a linear accordion list
(no branch/merge visualization support), so per the request's own fallback
instruction ("if branching is not supported yet, keep it as a clean linear
6-step sequence") — this is used as-is; no new branching UI was built.

## Node-name check

Grepped `src/data/projects.json`, `src/components/*.tsx`, and
`src/data/page-content.json` for the outdated/misleading terms named in the
request:

```
Contract Test | Validate Contract | Docker | auto-apply |
production deployment | Telegram-to-Notion | Job Search Automation System |
Manual trigger | Load listings | 09:30
```

Zero matches. The "Load Contract Test Payloads" / "Validate Contract and
Safety Rules" node names only ever existed inside the separate
`openclaw-notion-sync` n8n workflow JSON (a different project,
`D:\ai-test\openclaw-notion-sync\`) — they were never copied into the
showcase site's copy, so there was nothing to rename here.

## `actor: "human"` check

Stage 5 uses `"actor": "human"`, newly introduced to this project's stages
in the prior content pass. Verified this is an existing, already-styled
variant (not a new/unstyled one):
- CSS: `.stage--human`, `.s-actor--human`, `.w-step--human` all already
  defined in `src/styles/global.css`.
- Prior art: `video-pipeline` (stage 4) and `social-media-pipeline`
  (stage 3) already use `actor: "human"` the same way.

## Files touched this pass

None — `src/data/projects.json` was already correct from the prior content
update; this pass was verification only (greps + a rebuild), no new edits.

## Verification

- `npm run build` — zero TypeScript errors, clean Vite build.
- Output CSS asset hash (`index-nnikoliN.css`) identical to the pre-existing
  build from before this pass — confirms no CSS/layout drift.
- `git status --short` — only `src/data/projects.json` shows as modified
  (from the prior content pass); no component, hook, or style file touched.

## Not done / explicitly out of scope

- No branching diagram visualization was built (per the request's own
  fallback instruction).
- No changes to `useSoftPageHandoff`, `useSectionSettle`, `useAccentSection`,
  `AmbientBackground`, or any scroll/background behavior.
- No commit, no push — waiting for visual approval per standing instruction.
