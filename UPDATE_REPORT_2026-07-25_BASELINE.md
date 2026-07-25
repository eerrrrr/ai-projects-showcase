# Baseline report — 2026-07-25

Marks the current state of the ProjectCard / workflow interaction as the working baseline. Future updates build on top of this, not on top of any of the removed experiments below.

## 1. Current stable behavior

- **SYSTEMS nav** → `#systems`, lands on the "Selected systems" quick-cards section only.
- **Details** — every project loads collapsed on a clean URL. "View details" is the only way to open the written Goal/Logic/Build-evidence (or Problem/Workflow/Result) content.
- **Projects 01–04** (all 4 Tier-1 featured projects: Job Search Automation System, Investment Reasoning Learning Database, Source-to-Figma Data Visualization Pipeline, AI Output Review & Debug Memory System) share one pattern: left column = number/title/value line/mini-roadmap/proof-chips + a `.p-controls` stack with "How it works ▶" (primary) above "View details" (secondary); right column = `WorkflowWalkthrough` (accordion spine + active panel + recap).
- **"How it works"** starts deterministic autoplay: step 1 opens → dwells 1400ms → folds to a ✓ and step 2 opens → same through step 4 → recap appears, autoplay stops. Clicking any row directly jumps to it and pauses autoplay. Clicking "How it works" again always restarts from step 1.
- **Archive projects** (05–07: Method of Loci, Video Pipeline, Blender+ComfyUI) unchanged — static always-visible stage list, no walkthrough, no `ProjectLogicCard`.
- Hero (cover + Plasma), Archive section wrapper, Footer, and deployment setup — untouched all session.

## 2. Old broken systems removed — do not reintroduce

- `src/hooks/useSectionScroll.ts` — whole-page wheel-gesture section-jump controller. Deleted. Repeatedly conflicted with the workflow's own interaction and with native scroll; caused "eaten" rolls, wrong-step jumps, and a version that could trap the user inside a project.
- CSS `scroll-snap-type` / `scroll-snap-align` — removed from `global.css` entirely. Was actively cancelling small native scroll deltas near a snap point.
- `IntersectionObserver`-driven workflow step reveal — removed from `useWorkflowWalkthrough.ts`. Scroll position no longer affects `activeStep` at all.
- Manual PLAY / PAUSE / PREVIOUS / NEXT / RESTART buttons in `WorkflowWalkthrough.tsx` — removed. "How it works" is the only entry point; re-clicking it restarts.
- Hash-based auto-expand (`window.location.hash === '#'+project.id` → `setExpanded(true)`) in `ProjectCard.tsx` — removed. Navigating to a project anchor scrolls there but no longer force-opens its details.
- `data-scroll-exempt` / `data-walkthrough-active` attributes and the state-based scroll-exemption logic that read them — removed along with `useSectionScroll`.

**None of the above should be reintroduced without an explicit, separate ask** — each was tried, caused a concrete regression, and was deliberately rolled back.

## 3. Files currently changed (uncommitted, relative to commit `f1640a3`)

```
 M src/components/Nav.tsx
 M src/components/ProjectCard.tsx
 M src/components/ProjectLogicCard.tsx
 M src/components/WorkflowWalkthrough.tsx
 M src/data/page-content.json
 M src/data/projects.json
 M src/styles/global.css
?? src/hooks/useWorkflowWalkthrough.ts
?? DEBUG_SCROLL_WORKFLOW_DUMP_2026-07-25.md
```
`src/App.tsx` is byte-identical to the last commit (the `useSectionScroll` experiment was fully added and fully reverted within this session, net zero diff).

## 4. Build result

```
> ai-projects-showcase@0.1.0 build
> tsc -b && vite build

vite v5.4.21 building for production...
transforming...
✓ 112 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                 0.82 kB │ gzip:  0.45 kB
dist/assets/index-B_HZsEUB.css  15.15 kB │ gzip:  3.50 kB
dist/assets/index-4Bm0K1Pe.js   230.84 kB │ gzip: 72.32 kB
✓ built in 894ms
```
Zero TypeScript errors.

## 5. Manual checks still needed

None of this has been visually confirmed by a human yet in this exact combined state (nav fix + hash-removal + autoplay + 4-project rollout all together). Recommend checking, on a hard-refreshed `localhost:5191`:
- SYSTEMS nav lands on quick-cards, not a project.
- Clean URL: all 7 project cards collapsed.
- Each of Projects 01–04: "How it works" autoplays step 1→2→3→4→recap without needing any click.
- Projects 05–07: unchanged, no "How it works" button, static list.

## 6. Next recommended small upgrade steps

1. **ProjectCard visual polish** — left-column hierarchy (How it works vs. View details weight), workflow row states, active-panel styling, recap-as-conclusion-card, dwell timing (1400ms → ~1600–2000ms). Scoped, in progress as the next update after this report.
2. Unify Project 01–04 copy style (stage bodies, mini-node phrasing) for consistency.
3. Mobile layout pass — deferred.
4. Apple-like one-scroll section jump — deferred indefinitely as its own clean feature, built fresh against this stable base, not resumed from any of the removed attempts.
