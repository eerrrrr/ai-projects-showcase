# Update report — Selected systems grid + walkthrough timing polish

**Date:** 2026-07-25
**Scope:** `App.tsx` (scroll-spy effect only), `page-content.json` (nav/heading rename
only), `projects.json` (2 new optional fields per project), `types.ts` (2 new optional
fields on `Project`), `ProofSummary.tsx` (render the 2 new fields), `global.css` (new
chip-row rules only), `useWorkflowWalkthrough.ts` (1 constant). No redesign, no wheel
hijacking, no scroll-snap, no IntersectionObserver added to the workflow itself.

## A. Fixed: Project 01 permanently-green in Selected systems

**Root cause:** the scroll-spy `IntersectionObserver` in `App.tsx` only ever called
`setActiveId(entry.target.id)` — it never had a code path that cleared `activeId` back
to `null`. Once a featured project's section had been visited, its card stayed
highlighted indefinitely, even after scrolling back up to the quick-cards grid.

**Fix:** `#systems` (the quick-cards grid itself) is now also observed by the same
`IntersectionObserver`. When it re-intersects the same `-40%/-50%` detection band,
`setActiveId(null)` fires explicitly.

```tsx
if (entry.target === systemsEl) {
  if (entry.isIntersecting) setActiveId(null)
  return
}
```

**Verification:** live `IntersectionObserver` callbacks could not be exercised through
Puppeteer in this session — the automated browser reports `document.visibilityState:
"hidden"` even when navigated with `headless:false`, which suppresses IO delivery
entirely (confirmed with a bare test observer: zero callbacks fired at any scroll
position, including the mandatory initial callback on `observe()`). This is an
environment limitation of the current Puppeteer setup, not something this fix could
route around.

Instead, the exact algorithm (same rootMargin math, same guard clauses, in the same
order the browser would evaluate them) was replicated against real `getBoundingClientRect()`
values at 12 scroll positions spanning the full 9562px document height, in both
directions:

- Scrolling down: `null → null → null → job-application-filter → investment-research-system
  → moss-content-factory → evidence-review-decision-gate` (then holds, correctly — there
  are no more featured sections after it to spy on).
- Scrolling back up: the exact reverse, correctly returning to `null` once `#systems`
  re-enters the band.

This confirms the fix logic is correct; a manual click-through in a real browser tab is
still recommended before treating this as fully closed, given the harness limitation above.

## B. Selected systems: 7 cards, no Archive/Additional label

Already satisfied by a prior pass this session — confirmed still true, no regression.

## C. Intro sentence + capability chips on all 7 cards

Added two new **optional** fields to the `Project` type (`types.ts`) so the 5 projects
that don't use them render exactly as before:

```ts
overviewIntro?: string   // one sentence, grid card only
overviewChips?: string[] // 3-5 verified capability/tool keywords, grid card only
```

Populated for all 7 projects in `projects.json`. **Verified against real project files
before writing**, using the same standing rule applied to Project 01's Docker/Claude/
Notion claims — a background verification pass checked the actual tool stack for
`investment-research-system` and the `moss-content-factory` (daily_content_system)
pipeline before any chip was written:

| Project | Chips written | What was declined and why |
|---|---|---|
| Job Search Automation System | n8n, Manual trigger, Rule-based scoring, Human review | Docker, Claude, Notion — none exist in the real workflow (see the companion Project 01 report) |
| Investment Reasoning Learning Database | Python, SQLite, Markdown KB, Source-first | Claude — no `import anthropic`/API key/endpoint anywhere in the codebase; the LLM step is a human pasting a printed prompt into Claude Code interactively, not a pipeline API call. Notion — only an optional stub explicitly marked "v1 is a stub" in requirements.txt |
| Source-to-Figma Data Visualization Pipeline | Notion, Figma handoff, Python, Human review | Claude API — no `import anthropic`/API calls found in pipeline scripts (real usage is a human running Claude Code interactively with the Figma MCP tool, not an automated pipeline step) |
| AI Output Review & Debug Memory System | Rule-based gate, Independent phrase scan, Bug found & fixed, Debug memory | (all verified via prior direct inspection of the evidence-review-decision-gate n8n workflow) |
| Method of Loci | Python, Gemini AI, SQLite, Notion sync | — (unchanged from this project's existing, already-verified tag list) |
| AI-Assisted Video Pipeline | ffmpeg, Resolve API, DCTL, Privacy pass | — (unchanged from existing verified tags) |
| Blender + ComfyUI | Blender, ComfyUI, Wan2.1, IPAdapter | — (unchanged from existing verified tags) |

`ProofSummary.tsx` now renders `overviewIntro` in place of `taglineHtml` when present
(falls back to the old `taglineHtml` render for safety, though all 7 projects now have
`overviewIntro`), plus a new `.system-card-chips` row of `.system-card-chip` pills.
`global.css` gained ~10 lines of new rules only (chip pill shape, muted-on-`--quiet`,
accent-on-hover/active) — no existing selector was changed.

## D. "Archive" → "Systems Lab"

`page-content.json`: nav link label, `flagshipHeading`, and `flagshipSub` (reworded from
"Additional systems, kept compact." to "Full detail behind the systems above, plus
supporting infrastructure.", since "Additional" was one of the labels explicitly ruled
out). Verified live: nav shows "Systems Lab", section heading shows "Systems Lab".
Remaining "Archive" strings in the codebase are only in code comments (not
public-facing) — left as-is.

## E. Walkthrough timing: ~1800ms → ~3600ms per step

`useWorkflowWalkthrough.ts`: `STEP_DWELL_MS` changed from `1800` to `3600` (middle of
the requested 3400-3800ms range). This project uses a single dwell constant (no
separate marker/reveal/dwell/collapse sub-phases), so the simpler one-constant increase
was used rather than restructuring the state machine into phases.

**Verified live** (this one Puppeteer *could* exercise, since it's pure click +
`setTimeout`, no `IntersectionObserver` involved): clicked "How it works" on Project 01
and measured real transition timestamps —

```
step 1 → step 2:  3600ms
step 2 → step 3:  3623ms
step 3 → step 4:  3580ms
```

All three land inside the requested 3400-3800ms band. Confirmed the sequence still
completes step 1 → 2 → 3 → 4 → recap and stops there (does not loop).

## F. "Safe" calm feel

No new global wheel listener, no forced scroll-snap, no `scrollIntoView` on wheel, no
scroll-driven workflow-step selection was added — confirmed via `rg` across `src/` for
`useSectionScroll|scroll-snap|scrollIntoView|PLAY.*PAUSE`: only pre-existing code
comments documenting what was deliberately removed, no functional matches. This pass did
not add any new anchor-scroll/fade-in behavior beyond what already existed
(`scroll-behavior: smooth` and the existing `useReveal` hook both predate this pass).

## Build

`npm run build` (`tsc -b && vite build`) — 0 errors, both before and after all edits in
this pass.

## Not touched

Hero, Plasma, `ProjectCard.tsx` behavior (only pre-existing auto-zip code, untouched
this pass), `WorkflowWalkthrough.tsx`, auto-zip logic, footer, deployment/`docs/`.

**`docs/` has not been rebuilt** to reflect this pass (or the prior unified-grid /
auto-zip-boundary passes) — needs a fresh `npm run build` → `docs/` copy cycle before
any future push.

**Not committed or pushed** — awaiting explicit "go commit" / "go push".
