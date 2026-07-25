# Update report — archive project links under Selected systems — 2026-07-25

Small, scoped addition. Does not touch ProjectCard, ProjectLogicCard, WorkflowWalkthrough, useWorkflowWalkthrough, auto-zip, or workflow visual grammar.

## Request summary

The Selected systems section had unused space below the four main cards. Add a quiet, secondary link row pointing at Projects 05–07 (Archive) — number + short name only, no description, no card styling — so it doesn't compete with the four featured cards.

## Files changed

- `src/App.tsx` — pass `otherProjects` (already computed, unchanged) into `ProofSummary` as `archiveProjects`.
- `src/components/ProofSummary.tsx` — new optional `archiveProjects` prop, renders `.systems-archive-links` below the existing `.systems-grid`. Short names are *derived* from each project's existing `title` (split at the em-dash separator already used in the data, e.g. `"Method of Loci — automated document-ingestion pipeline"` → `"Method of Loci"`), not hardcoded.
- `src/styles/global.css` — new `.systems-archive-links` rules only.

## Exact diff

```diff
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -54,6 +54,7 @@ export default function App() {
       <ProofSummary
         projects={featuredProjects}
+        archiveProjects={otherProjects}
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
+  archiveProjects,
   sectionNo,
   heading,
   activeId,
 }: {
   projects: Project[]
+  archiveProjects?: Project[]
   ...
 }) {
   return (
     <section id="systems" className="systems-overview">
       ...
       <div className="systems-grid">...</div>
+
+      {archiveProjects && archiveProjects.length > 0 && (
+        <div className="systems-archive-links">
+          <span className="mono">Archive projects</span>
+          <ul>
+            {archiveProjects.map((project) => (
+              <li key={project.id}>
+                <a href={`#${project.id}`}>
+                  <span className="mono mono--accent">{String(project.index).padStart(2, '0')}</span>
+                  {shortName(project.title)}
+                </a>
+              </li>
+            ))}
+          </ul>
+        </div>
+      )}
     </section>
   )
 }
```

```diff
--- a/src/styles/global.css
+++
+.systems-archive-links{margin-top:56px;padding-top:24px;border-top:1px solid var(--line-soft)}
+.systems-archive-links > .mono{display:block;margin-bottom:14px}
+.systems-archive-links ul{list-style:none;display:flex;flex-wrap:wrap;gap:10px 28px}
+.systems-archive-links a{
+  display:inline-flex;align-items:center;gap:8px;
+  text-decoration:none;color:var(--ink-2);font-size:13.5px;
+  transition:color .15s ease;
+}
+.systems-archive-links a:hover{color:var(--accent)}
+.systems-archive-links a .mono--accent{font-size:10px}
```

## Build result

```
> ai-projects-showcase@0.1.0 build
✓ 112 modules transformed.
dist/index.html                 0.82 kB │ gzip:  0.45 kB
dist/assets/index-B3m-Ey9d.css  17.18 kB │ gzip:  3.78 kB
dist/assets/index-BHUJR4yU.js   231.40 kB │ gzip: 72.43 kB
✓ built in 720ms
```
Zero errors.

## Live verification (Puppeteer, 1440×900)

- Rendered links: `05 Method of Loci → #method-of-loci`, `06 AI-Assisted Video Pipeline → #video-pipeline`, `07 Blender + ComfyUI → #blender-comfyui-previs` — all three correct, derived (not hardcoded) short names.
- Four main `.system-card` elements still present and unchanged (`mainCardsStillFour: 4`).
- Clicked the video-pipeline link — landed at `getBoundingClientRect().top ≈ 87.6px`, matching the existing `scroll-margin-top: 88px` already set on `.project` elements exactly, confirming the anchor jump is correct (a same-page smooth scroll over this distance just needs more than 300ms to finish animating — an artifact of test timing, not a bug).

## Confirmed: no workflow files touched by this task

`git status --short` shows only `App.tsx`, `ProofSummary.tsx`, `global.css` changed by this specific addition (`ProjectCard.tsx` also shows modified, but that's the separate, already-reported auto-zip boundary fix from immediately before this task, not touched again here).

## Manual test checklist

- Hard-refresh `localhost:5191`, scroll to "Selected systems."
- Confirm the four featured cards look unchanged, and a quiet "Archive projects" row with three short links appears below them.
- Click each of the three links, confirm it scrolls to the correct Project 05/06/07 section.
- Confirm the full Archive section further down the page is unchanged (not duplicated).

## Preservation check

- ProjectCard / ProjectLogicCard / WorkflowWalkthrough / useWorkflowWalkthrough / auto-zip / workflow visual grammar — untouched.
- Archive project cards themselves — untouched.
- Hero / Plasma / Footer / deployment — untouched.
