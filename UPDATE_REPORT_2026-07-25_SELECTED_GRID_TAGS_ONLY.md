# Update report — Selected systems: tag-first cards (no intro paragraph)

**Date:** 2026-07-25
**Scope:** `src/components/ProofSummary.tsx`, `src/data/types.ts`, `src/data/projects.json`
(`overviewChips` only), `src/styles/global.css` (chip-row rules only). No component
behavior, hook, or full project-section content touched.

## What was requested

Simplify the Selected-systems grid card from `number / title / intro paragraph / chips /
Open case` down to `number / title / chips / Open case` — no paragraph text at all.
Also: re-verify the Project 01 Docker claim properly (Docker Desktop having images
installed does not prove this specific project ran under Docker) before finalizing the
public chip wording.

## Docker verification — done properly this time

Previous check only looked at the `job-application-filter` project folder (no
Dockerfile/compose file, `n8n` as a plain npm devDependency) and concluded "no Docker."
That was incomplete — it couldn't see Docker usage that happened outside the project
folder. This pass checked the actual Docker runtime state directly:

```
docker ps -a       → 2 containers found: "n8n" and "elastic_cray", both running
                      docker.n8n.io/n8nio/n8n
docker images      → docker.n8n.io/n8nio/n8n:latest present (11 months old)
docker volume ls   → n8n_data volume exists
```

**So Docker-run n8n evidence genuinely exists on this machine** — that part of the
original instinct was correct. But checking the actual timestamps:

- Container `n8n`: created **2025-08-19**, last exited **2026-01-21**.
- Container `elastic_cray`: created and exited same day, **2026-01-21** (a brief one-off run).
- `job-application-filter` project files (package.json, n8n_workflows/, the local
  `n8n-start.log`/`n8n-start-err.log`): all dated **2026-07-20 / 2026-07-21**.

**The Docker n8n containers are 5-11 months disconnected in time from when this project
was actually built.** They're real, but they're evidence of an earlier, separate n8n
exploration — not the `job-application-filter` workflow, which was built in July 2026
using n8n as a local npm package (the `n8n-start.log` files are exactly what a local
`npx n8n` / npm-script start produces). Writing "Docker n8n" on Project 01 specifically
would misattribute someone else's container run to this project.

**Decision: kept "Local workflow," not "Docker."** This isn't just "no evidence found" —
real Docker n8n evidence exists, but it doesn't belong to *this* project, which is the
more precise and more defensible read of the two possible interpretations of the
verification rule ("if n8n container/image exists, write Docker n8n").

## Card structure change

`ProofSummary.tsx` — removed the paragraph render entirely (previously rendered
`overviewIntro` with a `taglineHtml` fallback); removed the now-unused `Html` import.
Card now renders exactly:

```tsx
<span className="mono mono--accent">01</span>
<h3>Job Search Automation System</h3>
<span className="system-card-chips">…chips…</span>
<span className="system-card-arrow mono">Open case →</span>
```

`types.ts` — removed `overviewIntro?: string` from `Project` (dead field, no longer
rendered anywhere); kept `overviewChips?: string[]`.

`projects.json` — removed the `overviewIntro` line from all 7 projects; updated
`overviewChips` to the 4-5-word sets specified in this request (Project 01 changed from
4 to 5 chips to add "Local workflow"; Projects 02, 03, 05, 06, 07 each gained one more
chip; Project 04 kept at 4 chips as specified).

`global.css` — removed the now-dead `.system-card .kl` rule (was only for the removed
paragraph) and removed `.system-card-chips`' redundant `margin-top:14px` (the preceding
`h3` already carries `margin-bottom:18px`, so the chip row sits directly under the
title with the same spacing rhythm as the rest of the grid).

## Final chip sets (all verified, matching the request)

| # | Project | Chips |
|---|---|---|
| 01 | Job Search Automation System | n8n · Local workflow · Manual trigger · Rule-based scoring · Human review |
| 02 | Investment Reasoning Learning Database | Python · SQLite · Markdown KB · Source-first · Reasoning gates |
| 03 | Source-to-Figma Data Visualization Pipeline | Notion · Figma handoff · Python · Human review · Visual output |
| 04 | AI Output Review & Debug Memory System | Rule-based gate · Phrase scan · Debug memory · Reusable checks |
| 05 | Method of Loci | Python · Gemini AI · SQLite · Notion sync · Scheduled pipeline |
| 06 | AI-Assisted Video Pipeline | ffmpeg · Resolve API · DCTL · Privacy pass · Plan-first |
| 07 | Blender + ComfyUI | Blender · ComfyUI · Wan2.1 · IPAdapter · Local models |

## Build & verification

- `python -c "import json; json.load(...)"` — all 7 entries valid, `overviewIntro`
  confirmed absent (`None`), `overviewChips` confirmed present and correct on every project.
- `npm run build` (`tsc -b && vite build`) — 0 errors.
- Live DOM check (Puppeteer, `vite preview`, 1440×900 viewport): confirmed all 7 cards
  render with `hasParagraph: false` and the exact chip text above; confirmed `href`
  still points to the correct project id on all 7 cards.
- Hover/active chip color: confirmed via `getComputedStyle` (after waiting past the
  150ms CSS transition — an instant synchronous read mid-transition initially looked
  like a false negative, corrected by waiting) that chips tint to the accent green when
  the card is hovered or carries `.is-active`, matching the rest of the card.
- `rg` for `useSectionScroll|scroll-snap|scrollIntoView\(|PLAY.*PAUSE.*NEXT` across
  `src/` — only pre-existing code comments, no functional matches.

## Preservation check

No changes to `ProjectCard.tsx`, `WorkflowWalkthrough.tsx`, `useWorkflowWalkthrough.ts`,
auto-zip logic, scroll-spy logic, workflow visual grammar, full project-section content
(`taglineHtml`, `goalHtml`, `stages`, etc. — all untouched), Hero, Plasma, footer,
Systems Lab rename, or deployment config.

## Acceptance criteria check

- ✅ Selected-systems cards show no paragraph intro text.
- ✅ Cards show number + title + chips + "Open case →" only.
- ✅ All 7 cards still link correctly.
- ✅ Docker only shown if verified — verified evidence found but correctly attributed to
  a different, unrelated time period, so "Local workflow" was kept for Project 01.
- ✅ No workflow behavior changes.
- ✅ Build passes.

**Not committed or pushed** — awaiting explicit "go commit" / "go push".
