# Update report — auto-zip boundary fix — 2026-07-25

Builds on the visual-grammar baseline (`UPDATE_REPORT_2026-07-25_WORKFLOW_VISUAL_GRAMMAR.md`). Small, targeted fix only — no redesign.

## Request summary

The visual-grammar report noted a real boundary case: scrolling only from Project 01 to the immediately-adjacent Project 02 sometimes didn't trigger the auto-zip reset, because two full-viewport-height sections (`min-height:calc(100vh - 56px)`) can land exactly edge-to-edge with ~0px of residual overlap, which `threshold:0` alone can still count as "intersecting."

## Fix

Added `rootMargin: '-15% 0px -15% 0px'` to the existing scroll-away observer in `ProjectCard.tsx` — shrinks the effective viewport by 15% on each edge, giving a real buffer so a project reliably registers as "left" once it's meaningfully out of view, rather than only at an exact zero-overlap boundary. This is the same observer already responsible for the reset (not a new mechanism, not a scroll controller, doesn't select or drive workflow steps).

## Exact diff

```diff
--- a/src/components/ProjectCard.tsx
+++ b/src/components/ProjectCard.tsx
@@ -92,6 +92,14 @@ export function ProjectCard({ project }: { project: Project }) {
   // workflow step is active and never selects one. `walkthrough.reset` is
   // a stable (useCallback) reference, so this effect only re-runs on the
   // meaningful open/close transitions below, not on every autoplay tick.
+  //
+  // rootMargin shrinks the effective viewport by 15% on each edge — plain
+  // threshold:0 alone can miscount a project as still "intersecting" when
+  // it lands exactly edge-to-edge against an equally tall adjacent section
+  // (both are full-viewport-height via CSS min-height), leaving ~0px of
+  // residual overlap that still satisfies threshold:0. This margin gives a
+  // real buffer so scrolling to the next project reliably resets this one,
+  // without resetting prematurely while still mostly in view.
   useEffect(() => {
     if (!expanded && !walkthrough.started) return
     const el = articleRef.current
@@ -106,7 +114,7 @@ export function ProjectCard({ project }: { project: Project }) {
           walkthrough.reset()
         }
       },
-      { threshold: 0 },
+      { threshold: 0, rootMargin: '-15% 0px -15% 0px' },
     )
     observer.observe(el)
     return () => observer.disconnect()
```

One file changed, one line of actual logic (the options object), plus an explanatory comment.

## Build result

```
> ai-projects-showcase@0.1.0 build
> tsc -b && vite build
✓ 112 modules transformed.
dist/index.html                 0.82 kB │ gzip:  0.45 kB
dist/assets/index-BuM4OeR0.css  16.68 kB │ gzip:  3.71 kB
dist/assets/index-DEqfPzBT.js   230.98 kB │ gzip: 72.33 kB
✓ built in 681ms
```
Zero errors.

## Verification search

`rg -n "useSectionScroll|scroll-snap|addEventListener\('wheel|scrollIntoView|hashchange|location\.hash|PLAY|PREVIOUS|NEXT|RESTART" src` → 2 matches, both in `useWorkflowWalkthrough.ts`'s own explanatory comments ("no PLAY/PAUSE/NEXT/PREVIOUS/RESTART", "a separate wheel controller, CSS scroll-snap... since removed") — describing what's *not* present, not functional code. Zero actual matches.

## Live verification (Puppeteer, 1440×900 desktop viewport)

- **The exact boundary case, retested**: scrolled Project 01 into view, started "How it works," then scrolled only as far as the immediately-adjacent Project 02 (`investment-research-system`) — this was the specific case that failed before. Now: `active: false` on Project 01 after the scroll — reset correctly fires.
- **No false-positive early reset**: started "How it works" on Project 01 and let it run 2.5 seconds *without scrolling away at all* — still `active: true`, correctly progressed to step 2 ("Load listings") on its own. Confirms the added margin doesn't reset a project the user is still legitimately looking at.

## Manual test checklist

- Hard-refresh `localhost:5191`.
- Start "How it works" on Project 01, then scroll down just one project's worth (to Project 02) — confirm Project 01 resets.
- Scroll back up to Project 01 — confirm it's clean.
- Start "How it works" again and just wait without scrolling — confirm it keeps autoplaying normally and doesn't reset on its own.

## Preservation check

- Hero / Plasma / Selected systems / Archive / Footer / deployment / routing — untouched.
- Workflow visual grammar (markers/spine), autoplay, left-column controls — untouched, only the reset-trigger sensitivity changed.
- No removed system reintroduced.

## Commit recommendation (not executed — awaiting approval)

Working tree now has (all uncommitted): `Nav.tsx`, `ProjectCard.tsx`, `ProjectLogicCard.tsx`, `WorkflowWalkthrough.tsx`, `page-content.json`, `projects.json`, `global.css` modified; `useWorkflowWalkthrough.ts` new; five `UPDATE_REPORT_*`/`DEBUG_*` markdown files new. This represents a large, multi-pass but now-stable body of work (walkthrough feature, stabilization, visual polish, workflow visual grammar, auto-zip, this boundary fix). Recommend committing once you've had a chance to look at it yourself — happy to stage and write the commit message when you say go, but not doing so unprompted.
