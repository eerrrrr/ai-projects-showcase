# Update report — Project 01 wording correction (Docker / schedule note)

**Date:** 2026-07-25
**Scope:** `src/data/projects.json` — `job-application-filter` entry only. No component, hook, or layout files touched.

## What was requested

Make Project 01 read as "already a real n8n / Docker-based workflow" with the 09:30
scheduled trigger framed as a planned operating mode of the same workflow, using the
suggested proof line:

> Local Docker-based n8n workflow · manual run verified · planned daily 09:30 trigger · human review before action

With an explicit accuracy rule: do not claim the 09:30 trigger is already implemented
unless it's actually built and tested — write it as planned mode.

## Verification done before writing anything

Before writing any public copy, the actual project was inspected directly (not assumed):

- `D:\ai-test\job-application-filter\package.json` — `n8n` is a plain npm
  `devDependency` (`^2.30.8`). No `Dockerfile`, no `docker-compose.yml`, no Docker
  reference anywhere in the repo.
- `D:\ai-test\job-application-filter\n8n_workflows\job_application_filter.json` — node
  types present are only `n8n-nodes-base.manualTrigger`, three
  `n8n-nodes-base.code` nodes, and sticky-note comments. Zero Claude/Anthropic/Notion
  node types or references anywhere in the real workflow.

**Result: the "Docker-based" claim does not check out, and the workflow contains no
Claude/Notion integration to chip.** Per this project's standing verify-before-write
rule, these two claims were declined rather than published, and accurate substitute
wording was used instead. The 09:30 scheduled trigger itself is correctly treated as
**planned, not built** — this part of the original request was already accurate and is
now stated explicitly in the copy.

## What actually changed — `src/data/projects.json`, `job-application-filter`

| Field | Before | After |
|---|---|---|
| `valueLine` | "Criteria-first job screening workflow." | "Criteria-first job screening workflow built in n8n, with human review before action." |
| `proofChips` | `["n8n executed", "0 silent drops", "Human review"]` | `["n8n workflow", "Manual run verified", "Planned 09:30 trigger", "0 silent drops"]` |
| `workflowHtml` | (no mode statement) | added: "Current mode is manual execution for controlled review; planned mode is a daily 09:30 Europe/Helsinki scheduled trigger." |

Stage 1's `body` text ("Start the workflow by hand from n8n or the CLI — nothing runs
automatically or in the background.") was left untouched — it was already accurate and
already carries the "manual, not automatic" framing; duplicating that sentence there
would have been redundant.

Not used, and why:
- **"Docker-based"** — declined, no Docker anywhere in the real project.
- **"Claude · Notion" chips** — declined, zero references in the actual n8n workflow file.
- **"fully automated" / "auto-apply" / "production deployment" / "live daily scheduler
  already running"** — never written; current mode is manual, scheduled mode is planned only.

## Build & verification

- `npm run build` (`tsc -b && vite build`) — 0 errors.
- Live DOM check (Puppeteer, `vite preview`, 1440×900 viewport): Project 01's rendered
  section text contains no "docker", "claude", or "notion" strings; contains "09:30" and
  "Planned"/"planned" — confirming the corrected copy is what actually ships, not just
  what's in the JSON source.

## Preservation check

No changes to `ProjectCard.tsx`, `WorkflowWalkthrough.tsx`, `useWorkflowWalkthrough.ts`,
auto-zip logic, workflow visual grammar, Hero, Plasma, footer, or deployment config.
`rg` for `useSectionScroll|scroll-snap|scrollIntoView|PLAY.*PAUSE` across `src/` returns
no functional matches (only pre-existing code comments documenting what was
deliberately removed).

**Not committed or pushed** — awaiting explicit "go commit" / "go push".
