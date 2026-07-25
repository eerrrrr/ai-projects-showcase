# Update report — unified 7-card Selected systems grid — 2026-07-25

**Supersedes** `UPDATE_REPORT_2026-07-25_ARCHIVE_LINKS.md` from earlier the same day — that pass's "quiet secondary link row" approach was explicitly reversed in favor of this one. Keeping that earlier report as historical record (not deleted), but its described behavior no longer reflects the live component.

## Request summary

Correction to the previous pass: instead of 4 featured cards + a small detached "Archive projects" link row below them, all 7 projects (01–07) should render in the **same card/grid form** — no separate heading, no demoted link list. Projects 05–07 (the ones with fuller write-ups in the Archive section further down) may look visually quieter at rest, but stay full, clickable cards in the same catalogue.

## Before editing — printed as requested

**Current `App.tsx` `ProofSummary` call (before):**
```tsx
<ProofSummary
  projects={featuredProjects}
  archiveProjects={otherProjects}
  sectionNo={content.systemsSectionNo}
  heading={content.systemsHeading}
  activeId={activeId}
/>
```

**Current `ProofSummary.tsx` (before):** rendered `projects.map(...)` (4 featured cards) then, separately, `archiveProjects.map(...)` inside a `.systems-archive-links` div with its own "Archive projects" heading — the exact structure this pass removes.

**Projects 05–07 ids/titles (from `projects.json`):**
- `method-of-loci` → "Method of Loci — automated document-ingestion pipeline"
- `video-pipeline` → "AI-Assisted Video Pipeline — &ldquo;decide before render&rdquo;"
- `blender-comfyui-previs` → "Blender + ComfyUI — controllable AI video on free local models"

**Current CSS for `.systems-grid`/`.system-card` (before):** single-row 4-column grid, `border-right` removed only via `:last-child` (correct for exactly 4 items, not for 7).

**Git status (before this pass):** `00_SYSTEM.md`, `App.tsx`, `ProjectCard.tsx` (unrelated boundary fix from the prior pass), `ProofSummary.tsx`, `global.css` modified; two `UPDATE_REPORT_*` files new.

## Files changed this pass

- `src/App.tsx` — `ProofSummary` now receives the full unsorted `projects` array (all 7) instead of `featuredProjects` + `archiveProjects` separately.
- `src/components/ProofSummary.tsx` — single render loop over all 7 projects; `system-card--quiet` modifier applied when `project.tier !== 1`; title fallback changed from raw `project.title` to `shortName(project.title)` for cards without a dedicated `shortTitle` (avoids the video-pipeline title's HTML entities leaking as literal text — a real bug that would have shown `&ldquo;decide before render&rdquo;` verbatim otherwise, since `<h3>{...}</h3>` is plain JSX text, not HTML-decoded).
- `src/styles/global.css` — grid border rules updated for a 2-row (4+3) layout; new `.system-card--quiet` rule for the muted resting state.

## Exact diff

```diff
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -53,7 +53,7 @@ export default function App() {
       <Hero content={content} />
 
       <ProofSummary
-        projects={featuredProjects}
+        projects={projects}
         sectionNo={content.systemsSectionNo}
         heading={content.systemsHeading}
         activeId={activeId}
```

```diff
--- a/src/components/ProofSummary.tsx
+++ b/src/components/ProofSummary.tsx
+function shortName(title: string) {
+  return title.split(/\s+—\s+/)[0]
+}
+
 export function ProofSummary({
   projects,
   sectionNo,
   heading,
   activeId,
 }: {...}) {
   return (
     <section id="systems" className="systems-overview">
       <div className="sec-head">...</div>
       <div className="systems-grid">
         {projects.map((project) => (
           <a
-            className={`system-card${activeId === project.id ? ' is-active' : ''}`}
+            className={`system-card${project.tier !== 1 ? ' system-card--quiet' : ''}${activeId === project.id ? ' is-active' : ''}`}
             href={`#${project.id}`}
             key={project.id}
           >
             <span className="mono mono--accent">{String(project.index).padStart(2, '0')}</span>
-            <h3>{project.shortTitle ?? project.title}</h3>
+            <h3>{project.shortTitle ?? shortName(project.title)}</h3>
             {project.taglineHtml && <Html as="p" className="kl" html={project.taglineHtml} />}
             <span className="system-card-arrow mono">Open case →</span>
           </a>
         ))}
       </div>
-      {archiveProjects && ... <div className="systems-archive-links">...}  ← removed entirely
     </section>
   )
 }
```

```diff
--- a/src/styles/global.css
+++
 .system-card{...}
+.system-card:nth-child(4n){border-right:none}
 .system-card:last-child{border-right:none}
+.system-card:nth-child(n+5){border-top:1px solid var(--line-soft)}
 ...
+.system-card--quiet .mono--accent{color:var(--ink-3)}
+.system-card--quiet h3{color:var(--ink-2)}
-.systems-archive-links{...}  ← entire block removed (5 rules)
```

## Build result

```
> ai-projects-showcase@0.1.0 build
✓ 112 modules transformed.
dist/index.html                 0.82 kB │ gzip:  0.45 kB
dist/assets/index-CHIDWsOh.css  16.89 kB │ gzip:  3.73 kB
dist/assets/index-B6YW8xkB.js   231.07 kB │ gzip: 72.37 kB
✓ built in 713ms
```
Zero errors.

## Verification search

`rg -n "useSectionScroll|scroll-snap|addEventListener\('wheel|scrollIntoView|location\.hash|hashchange|PLAY|PREVIOUS|NEXT|RESTART" src` → 2 matches, both explanatory comments in `useWorkflowWalkthrough.ts` describing what's absent, not functional code. Zero real matches.

## Confirmed: no ProjectCard / WorkflowWalkthrough / hook files touched

`git status --short` after this pass shows only `00_SYSTEM.md`, `App.tsx`, `ProofSummary.tsx`, `global.css` modified by this task (`ProjectCard.tsx` was already modified by the separate, previously-reported auto-zip boundary fix — not touched again here).

## Live verification (Puppeteer, 1440×900 desktop viewport)

- All 7 cards render with correct titles and `href`s: `01 Job Search Automation System → #job-application-filter` ... through `07 Blender + ComfyUI → #blender-comfyui-previs`.
- **Confirmed the entity-leak bug did NOT occur**: `video-pipeline`'s card shows clean text "AI-Assisted Video Pipeline", not the raw `&ldquo;...&rdquo;` HTML entities — proving the `shortName()` fallback correctly avoids the plain-text-rendering issue the old `project.title` fallback would have caused.
- `system-card--quiet` class correctly present on exactly cards 5, 6, 7 (`false, false, false, false, true, true, true`).
- **Border layout correct for the 2-row (4+3) grid**: cards 1–3 have a right border, card 4 doesn't (row 1 end); cards 5–6 have a right border, card 7 doesn't (row 2 end, also last child); cards 5–7 have a top border (row separator), cards 1–4 don't.
- **Muted color confirmed**: quiet-card number `rgb(143,140,131)` (ink-3) vs. featured-card number `rgb(30,107,78)` (accent green); quiet-card title `rgb(84,82,76)` (ink-2) vs. featured-card title `rgb(17,17,16)` (near-black). Hover/active feedback (`background`, accent title color, arrow reveal) is defined on the shared `.system-card` selector with no `--quiet` exclusion, so it applies identically to all 7 on interaction — confirmed by reading the source directly (simulating real `:hover` via synthetic DOM events isn't reliable in headless testing, so this wasn't click-tested, only source-verified).

## Manual test checklist

- Hard-refresh `localhost:5191`, look at Selected systems.
- Confirm 7 cards total, arranged 4 + 3, with the second row's cards reading as quieter (less bold color) but still clearly clickable.
- Hover over a row-2 card — confirm it gets the same green highlight/arrow-reveal feedback as a row-1 card.
- Click a row-2 card, confirm it scrolls to the correct Archive project section further down the page (and that section itself is unchanged, not duplicated).

## Preservation check

- ProjectCard / ProjectLogicCard / WorkflowWalkthrough / useWorkflowWalkthrough / auto-zip / workflow visual grammar — untouched.
- Archive project detail sections (Goal/Logic/Build evidence for 05–07) — untouched, not duplicated.
- Hero / Plasma / Footer / deployment — untouched.

## Still not committed

Per instruction, not committing yet. `docs/` also not yet rebuilt for this or the auto-zip boundary fix. Waiting for further direction (proceed to the next polish item, or move to finalizing/committing).
