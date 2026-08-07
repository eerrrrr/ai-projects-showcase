# Debug dump — scroll / workflow interaction — 2026-07-25

Read-only report. No functional code was changed while producing this file.

---

## 1. Current repo state

**pwd:**
```
/d/ai-test/ai-projects-showcase
```

**git status --short:**
```
 M src/components/Nav.tsx
 M src/components/ProjectCard.tsx
 M src/components/ProjectLogicCard.tsx
 M src/components/WorkflowWalkthrough.tsx
 M src/data/page-content.json
 M src/data/projects.json
 M src/styles/global.css
?? src/hooks/useWorkflowWalkthrough.ts
```
Note: `src/hooks/useSectionScroll.ts` does **not** appear here — it was created and then fully deleted within this same uncommitted working session, so git shows no trace of it now. `src/App.tsx` also does not appear — it was modified (added `useSectionScroll`) and then reverted back to its committed content, so `git diff` on it is empty (see below).

**git branch --show-current:**
```
main
```

**git log --oneline -8:**
```
f1640a3 Add interactive workflow walkthrough prototype (Project 01 only)
d58d08b Remove card-style hover-lift/shadow from full project detail rows; keep it reserved for the quick-cards grid only
4abbb42 Fix scroll-spy premature activation: never highlight a quick card while the quick-cards grid itself is still on screen
c63f38b Make Plasma effect span the full cover page, not just the right 58%
4b24ae9 Add generous Apple-style spacing: bigger section gaps, roomier cards, more breathing room throughout
10d34e0 Keep workflow diagram always visible on featured cards; button gates extra detail only, not the diagram
446dd90 Fix stage-media positioning (inline per stage, not fixed at list end); always render Plasma
75d2dcc Compact card layout: Problem/Workflow/Result reveal, gated workflow stages, calmer hover/reveal interaction
```

**git diff -- src/App.tsx:** empty (byte-identical to commit `f1640a3` — the `useSectionScroll` experiment was fully added and fully removed within this session).

**git diff -- src/components/Nav.tsx src/components/ProjectCard.tsx src/components/WorkflowWalkthrough.tsx src/styles/global.css src/data/projects.json:**

See full diff pasted below, unmodified from the `git diff` command output:

```diff
diff --git a/src/components/Nav.tsx b/src/components/Nav.tsx
index 19f11e6..01008c8 100644
--- a/src/components/Nav.tsx
+++ b/src/components/Nav.tsx
@@ -4,9 +4,9 @@ export function Nav({ nav }: { nav: PageContent['nav'] }) {
   return (
     <nav className="nav">
       <div className="nav-inner">
-        <span className="who">
+        <a href="#" className="who">
           {nav.who}&nbsp;<span>{nav.whoAccent}</span>
-        </span>
+        </a>
         {nav.links.map((link) =>
           link.external ? (
             <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="mono--accent">
diff --git a/src/components/ProjectCard.tsx b/src/components/ProjectCard.tsx
index a7c4705..4b5c31e 100644
--- a/src/components/ProjectCard.tsx
+++ b/src/components/ProjectCard.tsx
@@ -2,6 +2,7 @@ import { useEffect, useRef, useState } from 'react'
 import type { Project } from '../data/types'
 import { Html } from './Html'
 import { useReveal } from '../hooks/useReveal'
+import { useWorkflowWalkthrough } from '../hooks/useWorkflowWalkthrough'
 import { StageMedia } from './StageMedia'
 import { ProjectLogicCard } from './ProjectLogicCard'
 import { WorkflowWalkthrough } from './WorkflowWalkthrough'
@@ -58,6 +59,7 @@ export function ProjectCard({ project }: { project: Project }) {
   const articleRef = useRef<HTMLElement | null>(null)
   const [expanded, setExpanded] = useState(false)
   const [selectedStageNum, setSelectedStageNum] = useState<number | null>(null)
+  const walkthrough = useWorkflowWalkthrough(project.stages)
 
   const setArticleRef = (el: HTMLElement | null) => {
     ref.current = el
@@ -70,7 +72,7 @@ export function ProjectCard({ project }: { project: Project }) {
   // the new short-form fields — currently the 3 Archive projects.
   const compact = Boolean(project.problemHtml || project.workflowHtml || project.resultShortHtml)
 
-  // Walkthrough prototype (Project 01 only — see 00_SYSTEM.md v19). Only
+  // Walkthrough prototype (Project 01 only — see 00_SYSTEM.md v19/v20). Only
   // true when all three fields are present, so every other project renders
   // through the existing compact/full paths completely unchanged.
   const hasWalkthrough = Boolean(project.valueLine && project.miniRoadmap && project.proofChips)
@@ -121,7 +123,12 @@ export function ProjectCard({ project }: { project: Project }) {
         <aside className="p-meta">
           <div className="p-meta-inner">
             {hasWalkthrough ? (
-              <ProjectLogicCard project={project} expanded={expanded} onToggleDetails={() => setExpanded((v) => !v)} />
+              <ProjectLogicCard
+                project={project}
+                expanded={expanded}
+                onToggleDetails={() => setExpanded((v) => !v)}
+                onStartWalkthrough={walkthrough.start}
+              />
             ) : (
               <>
                 <span className="mono">
@@ -172,10 +179,10 @@ export function ProjectCard({ project }: { project: Project }) {
         </aside>
 
         <div className="p-content">
-          {/* Workflow diagram is always visible — the button only gates the
-              extra Problem/Result prose below, not this. */}
+          {/* Workflow diagram is always visible — "View details" only gates
+              the extra Problem/Result prose below, not this. */}
           {hasWalkthrough ? (
-            <WorkflowWalkthrough project={project} />
+            <WorkflowWalkthrough project={project} walkthrough={walkthrough} />
           ) : (
             <WorkflowStages project={project} selectedStageNum={selectedStageNum} setSelectedStageNum={setSelectedStageNum} />
           )}
diff --git a/src/components/WorkflowWalkthrough.tsx b/src/components/WorkflowWalkthrough.tsx
index f8ad1a1..0d8b5fd 100644
--- a/src/components/WorkflowWalkthrough.tsx
+++ b/src/components/WorkflowWalkthrough.tsx
@@ -1,115 +1,28 @@
-import { useEffect, useRef, useState } from 'react'
+import { Fragment } from 'react'
 import type { Project } from '../data/types'
 import { StageMedia } from './StageMedia'
-
-type PlayState = 'idle' | 'playing' | 'paused' | 'done'
-
-const NODE_REVEAL_MS = 300
-const STEP_DWELL_MS = 1400
-
-// Coded, data-driven workflow walkthrough — no PNG diagrams, no fake canvas,
-// no animation library. CSS transitions + a small timer-driven state
-// machine only. One major step active at a time; its mini-nodes reveal
-// progressively during autoplay, then the step collapses to a completed
-// state before the next one opens. Ends on a static recap, no looping.
-export function WorkflowWalkthrough({ project }: { project: Project }) {
+import type { WorkflowWalkthroughState } from '../hooks/useWorkflowWalkthrough'
+
+// Coded, data-driven workflow walkthrough display — no PNG diagrams, no fake
+// canvas, no animation library, no manual step player. State comes from
+// useWorkflowWalkthrough (owned by ProjectCard, shared with the "How it
+// works" trigger on ProjectLogicCard) — this component only renders it.
+//
+// Every row always shows its title + one-line explanation, same as the
+// static workflow list on non-walkthrough projects. Clicking "How it works"
+// (left column) or a row directly expands that row's mini-nodes + proof
+// capture as an accordion panel directly under it — exclusive accordion:
+// only one panel is open at a time, the previous step folds the moment the
+// next one opens.
+export function WorkflowWalkthrough({
+  project,
+  walkthrough,
+}: {
+  project: Project
+  walkthrough: WorkflowWalkthroughState
+}) {
   const stages = project.stages
-  const [playState, setPlayState] = useState<PlayState>('idle')
-  const [activeStep, setActiveStep] = useState(0)
-  const [revealedCount, setRevealedCount] = useState(0)
-  const [completed, setCompleted] = useState<Set<number>>(new Set())
-  const [reduceMotion, setReduceMotion] = useState(false)
-  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
-
-  useEffect(() => {
-    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
-    setReduceMotion(mq.matches)
-    const onChange = () => setReduceMotion(mq.matches)
-    mq.addEventListener('change', onChange)
-    return () => mq.removeEventListener('change', onChange)
-  }, [])
-
-  useEffect(() => {
-    return () => {
-      if (timerRef.current) clearTimeout(timerRef.current)
-    }
-  }, [])
-
-  // Autoplay driver: only runs while playState === 'playing'. Reveals mini
-  // nodes one at a time, dwells on the finished step, then advances.
-  useEffect(() => {
-    if (playState !== 'playing') return
-    const stage = stages[activeStep]
-    const nodeCount = stage.miniNodes?.length ?? 0
-
-    if (revealedCount < nodeCount) {
-      timerRef.current = setTimeout(() => setRevealedCount((n) => n + 1), NODE_REVEAL_MS)
-      return () => {
-        if (timerRef.current) clearTimeout(timerRef.current)
-      }
-    }
-
-    timerRef.current = setTimeout(() => {
-      setCompleted((prev) => new Set(prev).add(activeStep))
-      if (activeStep >= stages.length - 1) {
-        setPlayState('done')
-      } else {
-        setActiveStep((s) => s + 1)
-        setRevealedCount(0)
-      }
-    }, STEP_DWELL_MS)
-    return () => {
-      if (timerRef.current) clearTimeout(timerRef.current)
-    }
-  }, [playState, activeStep, revealedCount, stages])
-
-  const start = () => {
-    setCompleted(new Set())
-    setActiveStep(0)
-    setRevealedCount(reduceMotion ? (stages[0].miniNodes?.length ?? 0) : 0)
-    setPlayState(reduceMotion ? 'paused' : 'playing')
-  }
-
-  const pause = () => setPlayState('paused')
-  const resume = () => {
-    if (playState === 'done') return
-    setPlayState(reduceMotion ? 'paused' : 'playing')
-  }
-
-  // Accepts a target index or an updater reading the latest step — the
-  // updater form is what Next/Previous use so rapid clicks each read fresh
-  // state instead of the value closed over at render time.
-  const jumpTo = (indexOrFn: number | ((prev: number) => number)) => {
-    if (timerRef.current) clearTimeout(timerRef.current)
-    setPlayState('paused')
-    setActiveStep((prevStep) => {
-      const target = typeof indexOrFn === 'function' ? indexOrFn(prevStep) : indexOrFn
-      const clamped = Math.max(0, Math.min(stages.length - 1, target))
-      setCompleted((prev) => {
-        const next = new Set(prev)
-        for (let i = 0; i < clamped; i++) next.add(i)
-        for (let i = clamped; i < stages.length; i++) next.delete(i)
-        return next
-      })
-      setRevealedCount(stages[clamped].miniNodes?.length ?? 0)
-      return clamped
-    })
-  }
-
-  // Marks the last step done and shows the recap — the only way to reach
-  // 'done' outside autoplay. Needed because Next disables at the last step
-  // and, under reduced motion, Play/resume is a no-op (reduceMotion keeps
-  // playState at 'paused'), so without this a manual walkthrough could reach
-  // the last step but never see the recap.
-  const finish = () => {
-    if (timerRef.current) clearTimeout(timerRef.current)
-    setCompleted((prev) => new Set(prev).add(stages.length - 1))
-    setPlayState('done')
-  }
-
-  const isActive = playState !== 'idle'
-  const isLastStep = activeStep >= stages.length - 1
-  const activeStage = stages[activeStep]
+  const { activeStep, completed, isDone, jumpTo } = walkthrough
 
   return (
     <div className="walkthrough">
@@ -120,84 +33,55 @@ export function WorkflowWalkthrough({ project }: { project: Project }) {
 
       <ol className="w-spine">
         {stages.map((stage, i) => {
-          const state = playState === 'done' || completed.has(i) ? 'done' : i === activeStep && isActive ? 'active' : 'pending'
+          const isOpen = i === activeStep
+          const isCompleted = completed.has(i)
           return (
-            <li
-              key={stage.num}
-              className={`w-step w-step--${state}`}
-              role="button"
-              tabIndex={0}
-              onClick={() => jumpTo(i)}
-              onKeyDown={(e) => {
-                if (e.key === 'Enter' || e.key === ' ') {
-                  e.preventDefault()
-                  jumpTo(i)
-                }
-              }}
-            >
-              <span className="w-step-num">{state === 'done' ? '✓' : stage.num}</span>
-              <span className="w-step-title">{stage.title}</span>
-              <span className={`s-actor s-actor--${stage.actor}`}>{stage.actorLabel}</span>
-            </li>
+            <Fragment key={stage.num}>
+              <li
+                className={`w-step${isOpen ? ' w-step--active' : ''}${isCompleted ? ' w-step--done' : ''}`}
+                role="button"
+                tabIndex={0}
+                onClick={() => jumpTo(i)}
+                onKeyDown={(e) => {
+                  if (e.key === 'Enter' || e.key === ' ') {
+                    e.preventDefault()
+                    jumpTo(i)
+                  }
+                }}
+              >
+                <span className="w-step-num">{isCompleted ? '✓' : stage.num}</span>
+                <div className="w-step-body">
+                  <span className="w-step-title">{stage.title}</span>
+                  <span className="w-step-desc">{stage.body}</span>
+                </div>
+                <span className={`s-actor s-actor--${stage.actor}`}>{stage.actorLabel}</span>
+              </li>
+              {isOpen && (stage.miniNodes?.length || stage.image) && (
+                <li className="w-active-panel">
+                  {stage.miniNodes && (
+                    <div className="w-mini-nodes">
+                      {stage.miniNodes.map((node) => (
+                        <span key={node} className="w-mini-node w-mini-node--in">
+                          {node}
+                        </span>
+                      ))}
+                    </div>
+                  )}
+                  <StageMedia stage={stage} />
+                </li>
+              )}
+            </Fragment>
           )
         })}
       </ol>
 
-      {isActive && (
-        <div className="w-active-panel">
-          <div className="w-mini-nodes">
-            {(activeStage.miniNodes ?? []).map((node, i) => (
-              <span key={node} className={`w-mini-node${i < revealedCount ? ' w-mini-node--in' : ''}`}>
-                {node}
-              </span>
-            ))}
-          </div>
-          <p className="w-explanation">{activeStage.body}</p>
-          <StageMedia stage={activeStage} />
-        </div>
-      )}
-
-      {playState === 'done' && project.finalRoadmap && (
+      {isDone && project.finalRoadmap && (
         <div className="w-recap">
           <span className="mono mono--accent">Roadmap recap</span>
           <p className="w-recap-flow">{project.finalRoadmap}</p>
           {project.finalTakeaway && <p className="w-recap-takeaway">{project.finalTakeaway}</p>}
         </div>
       )}
-
-      <div className="w-controls">
-        {!isActive ? (
-          <button type="button" className="w-btn w-btn--primary" onClick={start}>
-            How it works ▶
-          </button>
-        ) : (
-          <>
-            {playState === 'playing' ? (
-              <button type="button" className="w-btn" onClick={pause}>
-                Pause
-              </button>
-            ) : (
-              <button type="button" className="w-btn" onClick={resume} disabled={playState === 'done'}>
-                {playState === 'done' ? 'Finished' : 'Play'}
-              </button>
-            )}
-            <button type="button" className="w-btn" onClick={() => jumpTo((s) => s - 1)} disabled={activeStep === 0 && playState !== 'done'}>
-              Previous
-            </button>
-            <button
-              type="button"
-              className="w-btn"
-              onClick={() => (isLastStep ? finish() : jumpTo((s) => s + 1))}
-              disabled={playState === 'done'}
-            >
-              {isLastStep ? 'Finish' : 'Next'}
-            </button>
-            <button type="button" className="w-btn" onClick={start}>
-              Restart
-            </button>
-          </>
-        )}
-      </div>
     </div>
   )
 }
diff --git a/src/data/projects.json b/src/data/projects.json
index d7c73b1..01b1468 100644
--- a/src/data/projects.json
+++ b/src/data/projects.json
@@ -26,10 +26,10 @@
     "stagesLabel": "Workflow — validate before score, human decides",
     "stageCountLabel": "4 stages",
     "stages": [
-      { "num": 1, ..., "body": "Runs on demand from n8n or CLI; no silent background run.", ... },
-      { "num": 2, ..., "body": "Loads one item per job listing so the source data stays visible.", ... },
-      { "num": 3, ..., "body": "Checks required fields first, then applies location, language-risk and fit rules.", ... },
-      { "num": 4, ..., "body": "Generates a readable report where passed, rejected and incomplete listings remain visible.", ... }
+      { "num": 1, ..., "body": "Start the workflow by hand from n8n or the CLI — nothing runs automatically or in the background.", ... },
+      { "num": 2, ..., "body": "Load each job listing one at a time, keeping the original listing data visible before any scoring happens.", ... },
+      { "num": 3, ..., "body": "Check required fields first, then score each listing against location, language and fit rules — nothing gets scored on incomplete data.", ... },
+      { "num": 4, ..., "body": "Generate a report where passed, flagged and incomplete listings all stay visible — the human makes the final call.", ... }
     ],
diff --git a/src/styles/global.css b/src/styles/global.css
index c6339ce..074c67a 100644
--- a/src/styles/global.css
+++ b/src/styles/global.css
@@ -44,6 +44,7 @@ body{
 .nav .who{
   font-family:'Inter Tight',sans-serif;font-weight:700;font-size:15px;
   letter-spacing:-0.02em;margin-right:auto;
+  color:var(--ink);text-decoration:none;
 }
 .nav .who span{color:var(--accent)}
 .nav a{
@@ -139,7 +140,9 @@ section{padding:168px 0 0}
 /* ---------- systems overview (below the cover hero) ---------- */
 .systems-overview{
   max-width:1200px;margin:0 auto;
-  padding:168px 48px 0;
+  padding:168px 48px;
+  min-height:calc(100vh - 56px);
+  display:flex;flex-direction:column;justify-content:center;
 }
 .systems-grid{
   display:grid;grid-template-columns:repeat(4,1fr);
@@ -174,6 +177,7 @@ section{padding:168px 0 0}
 .project{
   border-top:1px solid var(--ink);
   padding:64px 0 96px;
+  min-height:calc(100vh - 56px);
 }
 .project--collapsed{padding-bottom:64px}
 .p-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:0 48px}
@@ -238,6 +242,20 @@ section{padding:168px 0 0}
 }
 .view-details:hover{background:var(--accent);color:#fff}
 
+.p-controls{display:flex;flex-direction:column;align-items:flex-start;gap:10px;margin-top:24px}
+.p-controls .view-details{margin-top:0}
+.how-it-works-btn{
+  display:inline-flex;align-items:center;gap:6px;
+  font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:500;
+  letter-spacing:.1em;text-transform:uppercase;color:#fff;
+  background:var(--accent);border:1px solid var(--accent);border-radius:100px;
+  padding:9px 16px;cursor:pointer;transition:opacity .15s ease;
+}
+.how-it-works-btn:hover{opacity:.85}
+
 .p-content{grid-column:5 / span 8}
 [... .gmr rules unchanged ...]
@@ -339,7 +357,7 @@ ol.stages{list-style:none}
 .w-spine{list-style:none}
 .w-step{
   display:grid;grid-template-columns:32px 1fr 84px;
-  gap:0 16px;align-items:center;
+  gap:0 16px;align-items:start;
   padding:16px 0;
   cursor:pointer;
   transition:background .18s ease;
@@ -349,22 +367,41 @@ ol.stages{list-style:none}
 .w-step-num{
   font-family:'Inter Tight',sans-serif;font-weight:700;font-size:15px;
   color:var(--ink-3);font-variant-numeric:tabular-nums;
+  padding-top:1px;
   transition:color .18s ease;
 }
+.w-step-body{display:block}
 .w-step-title{
+  display:block;
   font-family:'Inter Tight',sans-serif;font-weight:600;font-size:15.5px;
   letter-spacing:-0.01em;color:var(--ink-2);
   transition:color .18s ease;
 }
+.w-step-desc{
+  display:block;margin-top:3px;
+  font-size:13px;color:var(--ink-2);line-height:1.55;max-width:52ch;
+}
 .w-step--active .w-step-title{color:var(--ink)}
 .w-step--active .w-step-num{color:var(--accent)}
 .w-step--done .w-step-num{color:var(--accent)}
 .w-step--done .w-step-title{color:var(--ink-2)}
 
 .w-active-panel{
+  display:block;
   margin:4px 0 20px;padding:20px;
   background:var(--accent-soft);border-radius:4px;
 }
+.w-active-panel + .w-step{border-top:1px solid var(--line-soft)}
 .w-mini-nodes{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}
 [... .w-mini-node unchanged ...]
 .w-mini-node--in{opacity:1;transform:none}
-.w-explanation{font-size:14px;color:var(--ink-2);line-height:1.6;margin-bottom:4px}
 @media (prefers-reduced-motion:reduce){
   .w-mini-node{transition:none;opacity:1;transform:none}
 }
@@ -386,18 +422,6 @@ ol.stages{list-style:none}
 .w-recap-flow{margin-top:10px;font-size:14.5px;color:var(--ink);line-height:1.7}
 .w-recap-takeaway{margin-top:10px;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:15px;color:var(--accent)}
 
-.w-controls{display:flex;flex-wrap:wrap;gap:10px}
-.w-btn{ ... }
-.w-btn:hover:not(:disabled){background:var(--accent);color:#fff}
-.w-btn:disabled{opacity:.35;cursor:not-allowed}
-.w-btn--primary{background:var(--accent);color:#fff}
-.w-btn--primary:hover{background:var(--accent);opacity:.85}
-
 /* ---------- supporting (archive infra cards) ---------- */
 [...]
 @media (max-width:900px){
   [...]
   .hero-cover{min-height:auto}
+  .project{min-height:auto}
   .hero-plasma{display:none}
   [...]
-  .systems-overview{padding:96px 22px 0}
+  .systems-overview{padding:96px 22px 0;min-height:auto;display:block}
   [...]
```

(`page-content.json` and `ProjectLogicCard.tsx` diffs omitted from the pasted block above for length — their current full content is in section 4 below; the only page-content.json change this session was adding a GitHub nav link, and ProjectLogicCard.tsx's diff is the "How it works" button addition also shown in full below.)

---

## 2. File tree

```
src/
├── App.tsx
├── main.tsx
├── vite-env.d.ts
├── components/
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Html.tsx
│   ├── KeywordRhythm.tsx
│   ├── Nav.tsx
│   ├── Plasma.css
│   ├── Plasma.d.ts
│   ├── Plasma.jsx
│   ├── ProjectCard.tsx
│   ├── ProjectLogicCard.tsx
│   ├── ProofSummary.tsx
│   ├── StageMedia.tsx
│   ├── SupportingSystems.tsx
│   └── WorkflowWalkthrough.tsx
├── data/
│   ├── page-content.json
│   ├── projects.json
│   └── types.ts
├── hooks/
│   ├── useReveal.ts
│   └── useWorkflowWalkthrough.ts
└── styles/
    └── global.css
```

Note: `src/hooks/useSectionScroll.ts` no longer exists — deleted during the stabilization pass earlier this session.

---

## 3. Search results

`rg -n "useSectionScroll|useWorkflowWalkthrough|scrollIntoView|addEventListener\('wheel|wheel|scroll-snap|IntersectionObserver|data-scroll-exempt|walkthrough|expanded|hash|location\.hash|preventDefault|lockedRef|scrollExempt" src`:

```
src/App.tsx:35:    const observer = new IntersectionObserver(
src/data/page-content.json:66:    "right": "Code walkthroughs & live demos available on request"
src/data/types.ts:18:  // stage is the active step. `body` doubles as the walkthrough explanation
src/hooks/useWorkflowWalkthrough.ts:4:// Click-based workflow walkthrough, exclusive accordion: only one step's
src/hooks/useWorkflowWalkthrough.ts:7:// pass): no scroll-tracking, no IntersectionObserver, no timers. "How it
src/hooks/useWorkflowWalkthrough.ts:11:// whole-page scroll behavior (a separate wheel controller, CSS scroll-snap)
src/hooks/useWorkflowWalkthrough.ts:14:export function useWorkflowWalkthrough(stages: Stage[]) {
src/hooks/useWorkflowWalkthrough.ts:54:export type WorkflowWalkthroughState = ReturnType<typeof useWorkflowWalkthrough>
src/styles/global.css:222:/* ---------- walkthrough-mode left column (ProjectLogicCard) ---------- */
src/styles/global.css:355:/* ---------- coded workflow walkthrough ---------- */
src/styles/global.css:356:.walkthrough{margin-bottom:8px}
src/styles/global.css:382:   starting the walkthrough. */
src/hooks/useReveal.ts:8:// unless the browser supports IntersectionObserver (only then do elements
src/hooks/useReveal.ts:19:    if (!('IntersectionObserver' in window)) {
src/hooks/useReveal.ts:26:    const observer = new IntersectionObserver(
src/components/Plasma.jsx:196:      e.preventDefault();
src/components/Plasma.jsx:210:    const io = new IntersectionObserver(([entry]) => {
src/components/WorkflowWalkthrough.tsx:4:import type { WorkflowWalkthroughState } from '../hooks/useWorkflowWalkthrough'
src/components/WorkflowWalkthrough.tsx:6:// Coded, data-driven workflow walkthrough display — no PNG diagrams, no fake
src/components/WorkflowWalkthrough.tsx:8:// useWorkflowWalkthrough (owned by ProjectCard, shared with the "How it
src/components/WorkflowWalkthrough.tsx:12:// static workflow list on non-walkthrough projects. Clicking "How it works"
src/components/WorkflowWalkthrough.tsx:19:  walkthrough,
src/components/WorkflowWalkthrough.tsx:22:  walkthrough: WorkflowWalkthroughState
src/components/WorkflowWalkthrough.tsx:25:  const { activeStep, completed, isDone, jumpTo } = walkthrough
src/components/WorkflowWalkthrough.tsx:28:    <div className="walkthrough">
src/components/WorkflowWalkthrough.tsx:47:                    e.preventDefault()
src/components/ProjectLogicCard.tsx:4:// Compact left column for walkthrough-enabled projects: number, title, one
src/components/ProjectLogicCard.tsx:9:// "How it works" lives here too, not inside the right-side walkthrough
src/components/ProjectLogicCard.tsx:11:// walkthrough, open the written detail) belong in one control stack on the
src/components/ProjectLogicCard.tsx:12:// left, next to each other. It stays visible even while the walkthrough is
src/components/ProjectLogicCard.tsx:14:// Restart control anywhere. The button only starts the walkthrough; the
src/components/ProjectLogicCard.tsx:18:  expanded,
src/components/ProjectLogicCard.tsx:23:  expanded: boolean
src/components/ProjectLogicCard.tsx:64:          {expanded ? 'Hide details −' : 'View details ↓'}
src/components/ProjectCard.tsx:5:import { useWorkflowWalkthrough } from '../hooks/useWorkflowWalkthrough'
src/components/ProjectCard.tsx:37:                e.preventDefault()
src/components/ProjectCard.tsx:60:  const [expanded, setExpanded] = useState(false)
src/components/ProjectCard.tsx:62:  const walkthrough = useWorkflowWalkthrough(project.stages)
src/components/ProjectCard.tsx:84:      if (window.location.hash === `#${project.id}`) setExpanded(true)
src/components/ProjectCard.tsx:87:    window.addEventListener('hashchange', checkHash)
src/components/ProjectCard.tsx:88:    return () => window.removeEventListener('hashchange', checkHash)
src/components/ProjectCard.tsx:97:    if (!expanded) return
src/components/ProjectCard.tsx:101:    const observer = new IntersectionObserver(
src/components/ProjectCard.tsx:113:  }, [expanded])
src/components/ProjectCard.tsx:119:      className={`project ${className}${expanded ? '' : ' project--collapsed'}${compact ? ' project--compact' : ''}`}
src/components/ProjectCard.tsx:128:                expanded={expanded}
src/components/ProjectCard.tsx:130:                onStartWalkthrough={walkthrough.start}
src/components/ProjectCard.tsx:174:                  {expanded ? 'Hide details −' : 'View details ↓'}
src/components/ProjectCard.tsx:185:            <WorkflowWalkthrough project={project} walkthrough={walkthrough} />
src/components/ProjectCard.tsx:190:          <div className={`expand-panel${expanded ? ' expand-panel--open' : ''}`}>
```

**Zero matches** for: `useSectionScroll`, `scroll-snap` (as an actual CSS rule — only a code-comment mention above), `addEventListener('wheel'`, `data-scroll-exempt`, `scrollExempt`, `lockedRef`, `scrollIntoView`, anywhere in `src/`.

---

## 4. Full code files

### `src/main.tsx`
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### `src/App.tsx`
```tsx
import { useEffect, useState } from 'react'
import pageContent from './data/page-content.json'
import projectsData from './data/projects.json'
import type { PageContent, Project } from './data/types'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ProofSummary } from './components/ProofSummary'
import { ProjectCard } from './components/ProjectCard'
import { SupportingSystems } from './components/SupportingSystems'
import { Footer } from './components/Footer'
import './styles/global.css'

const content = pageContent as PageContent
const projects = projectsData as Project[]
const featuredProjects = projects.filter((p) => p.tier === 1)
const otherProjects = projects.filter((p) => p.tier !== 1)

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null)

  // Scroll-spy: highlight whichever featured project's full section is
  // currently in view, on the systems-overview quick cards above it.
  // Guarded so it can never activate while the quick-cards grid (#systems)
  // is itself still on screen — without this, a very tall first project
  // section can drift into the detection band on a large monitor while
  // someone is still just looking at the quick cards, before they've
  // actually scrolled down into that project's content.
  useEffect(() => {
    const systemsEl = document.getElementById('systems')
    const els = featuredProjects
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const stillShowingQuickCards = (systemsEl?.getBoundingClientRect().bottom ?? 0) > 0
          if (stillShowingQuickCards) return
          setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Nav nav={content.nav} />
      <Hero content={content} />

      <ProofSummary
        projects={featuredProjects}
        sectionNo={content.systemsSectionNo}
        heading={content.systemsHeading}
        activeId={activeId}
      />

      <div className="wrap">
        <section id="flagship-featured">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>

        <section id="flagship">
          <div className="sec-head">
            <span className="no">{content.flagshipSectionNo}</span>
            <h2 dangerouslySetInnerHTML={{ __html: content.flagshipHeading }} />
            <span className="sub mono">{content.flagshipSub}</span>
          </div>
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <SupportingSystems supporting={content.supporting} />
        </section>
      </div>

      <Footer footer={content.footer} />
    </>
  )
}
```

### `src/components/Nav.tsx`
```tsx
import type { PageContent } from '../data/types'

export function Nav({ nav }: { nav: PageContent['nav'] }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#" className="who">
          {nav.who}&nbsp;<span>{nav.whoAccent}</span>
        </a>
        {nav.links.map((link) =>
          link.external ? (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="mono--accent">
              {link.label} ↗
            </a>
          ) : (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ),
        )}
      </div>
    </nav>
  )
}
```

### `src/components/ProjectCard.tsx`
```tsx
import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/types'
import { Html } from './Html'
import { useReveal } from '../hooks/useReveal'
import { useWorkflowWalkthrough } from '../hooks/useWorkflowWalkthrough'
import { StageMedia } from './StageMedia'
import { ProjectLogicCard } from './ProjectLogicCard'
import { WorkflowWalkthrough } from './WorkflowWalkthrough'

function WorkflowStages({
  project,
  selectedStageNum,
  setSelectedStageNum,
}: {
  project: Project
  selectedStageNum: number | null
  setSelectedStageNum: (fn: (prev: number | null) => number | null) => void
}) {
  return (
    <div className="stages-wrap">
      <div className="stages-label">
        <span className="mono">{project.stagesLabel}</span>
        <span className="mono">{project.stageCountLabel}</span>
      </div>
      <ol className="stages">
        {project.stages.map((stage) => (
          <li
            className={`${stage.actor === 'sys' ? 'stage' : `stage stage--${stage.actor}`}${
              selectedStageNum === stage.num ? ' stage--selected' : ''
            }`}
            key={stage.num}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedStageNum((prev) => (prev === stage.num ? null : stage.num))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelectedStageNum((prev) => (prev === stage.num ? null : stage.num))
              }
            }}
          >
            <span className="s-num">{stage.num}</span>
            <span className="s-marker" />
            <div className="s-body">
              <b>{stage.title}</b>
              <span>{stage.body}</span>
            </div>
            <span className={`s-actor s-actor--${stage.actor}`}>{stage.actorLabel}</span>
            {selectedStageNum === stage.num && <StageMedia stage={stage} />}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  const { ref, className } = useReveal<HTMLElement>()
  const articleRef = useRef<HTMLElement | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [selectedStageNum, setSelectedStageNum] = useState<number | null>(null)
  const walkthrough = useWorkflowWalkthrough(project.stages)

  const setArticleRef = (el: HTMLElement | null) => {
    ref.current = el
    articleRef.current = el
  }

  // Compact layout: Problem/Workflow/Result reveal, workflow stages gated
  // behind "View workflow" too. Falls back to the older Goal/Logic/Build
  // evidence layout (stages always visible) for projects that don't have
  // the new short-form fields — currently the 3 Archive projects.
  const compact = Boolean(project.problemHtml || project.workflowHtml || project.resultShortHtml)

  // Walkthrough prototype (Project 01 only — see 00_SYSTEM.md v19/v20). Only
  // true when all three fields are present, so every other project renders
  // through the existing compact/full paths completely unchanged.
  const hasWalkthrough = Boolean(project.valueLine && project.miniRoadmap && project.proofChips)

  // Clicking a ProofSummary link (or loading with a direct #id URL) should
  // expand this card, not just scroll to it.
  useEffect(() => {
    function checkHash() {
      if (window.location.hash === `#${project.id}`) setExpanded(true)
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [project.id])

  // Zip the detail back up once the card has scrolled fully out of view —
  // "hasBeenVisible" guards against the observer's very first callback
  // firing before an anchor-triggered scroll has actually arrived, which
  // would otherwise immediately re-collapse a card someone just clicked
  // open from the systems-overview cards.
  useEffect(() => {
    if (!expanded) return
    const el = articleRef.current
    if (!el) return
    let hasBeenVisible = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasBeenVisible = true
        } else if (hasBeenVisible) {
          setExpanded(false)
        }
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [expanded])

  return (
    <article
      ref={setArticleRef}
      id={project.id}
      className={`project ${className}${expanded ? '' : ' project--collapsed'}${compact ? ' project--compact' : ''}`}
      style={{ scrollMarginTop: '88px' }}
    >
      <div className="p-grid">
        <aside className="p-meta">
          <div className="p-meta-inner">
            {hasWalkthrough ? (
              <ProjectLogicCard
                project={project}
                expanded={expanded}
                onToggleDetails={() => setExpanded((v) => !v)}
                onStartWalkthrough={walkthrough.start}
              />
            ) : (
              <>
                <span className="mono">
                  Project {String(project.index).padStart(2, '0')} / {String(project.total).padStart(2, '0')}
                  {' · '}
                  {project.tierLabel}
                </span>
                <div className="p-num">{String(project.index).padStart(2, '0')}</div>
                <Html as="h3" html={project.title} />
                <div className="tags">
                  {(compact ? project.tags.slice(0, 3) : project.tags).map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                {compact ? (
                  project.valueHtml && <Html as="p" className="p-tagline" html={project.valueHtml} />
                ) : project.whatItProvesHtml || project.productionSignalHtml ? (
                  <div className="p-proof">
                    {project.whatItProvesHtml && (
                      <>
                        <span className="mono">What it proves</span>
                        <Html as="p" html={project.whatItProvesHtml} />
                      </>
                    )}
                    {project.productionSignalHtml && (
                      <>
                        <span className="mono">Production signal</span>
                        <Html as="p" className="p-proof-signal" html={project.productionSignalHtml} />
                      </>
                    )}
                  </div>
                ) : project.taglineHtml ? (
                  <Html as="p" className="p-tagline" html={project.taglineHtml} />
                ) : (
                  <div className="p-key">
                    <div className="kn">{project.keyNumber}</div>
                    <div className="kl mono">{project.keyLabel}</div>
                  </div>
                )}
                <button type="button" className="view-details" onClick={() => setExpanded((v) => !v)}>
                  {expanded ? 'Hide details −' : 'View details ↓'}
                </button>
              </>
            )}
          </div>
        </aside>

        <div className="p-content">
          {/* Workflow diagram is always visible — "View details" only gates
              the extra Problem/Result prose below, not this. */}
          {hasWalkthrough ? (
            <WorkflowWalkthrough project={project} walkthrough={walkthrough} />
          ) : (
            <WorkflowStages project={project} selectedStageNum={selectedStageNum} setSelectedStageNum={setSelectedStageNum} />
          )}

          <div className={`expand-panel${expanded ? ' expand-panel--open' : ''}`}>
            {compact ? (
              <dl className="gmr">
                <dt className="mono">Problem</dt>
                <Html as="dd" html={project.problemHtml ?? ''} />
                <dt className="mono">Workflow</dt>
                <Html as="dd" html={project.workflowHtml ?? ''} />
                <dt className="mono">Result</dt>
                <Html as="dd" html={project.resultShortHtml ?? ''} />
              </dl>
            ) : (
              <>
                {project.taglineHtml && (
                  <div className="p-key p-key--inline">
                    <div className="kn">{project.keyNumber}</div>
                    <div className="kl mono">{project.keyLabel}</div>
                  </div>
                )}
                <dl className="gmr">
                  <dt className="mono">Goal</dt>
                  <Html as="dd" html={project.goalHtml} />
                  <dt className="mono">Logic</dt>
                  <Html as="dd" html={project.methodHtml} />
                  <dt className="mono">Build evidence</dt>
                  <Html as="dd" html={project.resultHtml} />
                  {project.failureHandledHtml && (
                    <>
                      <dt className="mono">Failure handled</dt>
                      <Html as="dd" html={project.failureHandledHtml} />
                    </>
                  )}
                  {project.decisionHtml && (
                    <>
                      <dt className="mono">Decision</dt>
                      <Html as="dd" html={project.decisionHtml} />
                    </>
                  )}
                  {project.limitationHtml && (
                    <>
                      <dt className="mono">Limitation</dt>
                      <Html as="dd" html={project.limitationHtml} />
                    </>
                  )}
                </dl>
              </>
            )}

            {project.transferHeading && project.transferItems && (
              <div className="transfer-block">
                <span className="mono mono--accent">{project.transferHeading}</span>
                <ul>
                  {project.transferItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
```

### `src/components/ProjectLogicCard.tsx`
```tsx
import type { Project } from '../data/types'
import { Html } from './Html'

// Compact left column for walkthrough-enabled projects: number, title, one
// value line, a mini roadmap, and 2-3 proof chips — readable in a few
// seconds. Heavier fields (tags list, key stat, Goal/Logic/etc.) stay out
// of the default view; "View details" still reveals them separately.
//
// "How it works" lives here too, not inside the right-side walkthrough
// component — both user-facing actions for this card (start the
// walkthrough, open the written detail) belong in one control stack on the
// left, next to each other. It stays visible even while the walkthrough is
// running — clicking it again just restarts, so there's no separate
// Restart control anywhere. The button only starts the walkthrough; the
// actual state and rendering live in WorkflowWalkthrough on the right.
export function ProjectLogicCard({
  project,
  expanded,
  onToggleDetails,
  onStartWalkthrough,
}: {
  project: Project
  expanded: boolean
  onToggleDetails: () => void
  onStartWalkthrough: () => void
}) {
  return (
    <>
      <span className="mono">
        Project {String(project.index).padStart(2, '0')} / {String(project.total).padStart(2, '0')}
        {' · '}
        {project.tierLabel}
      </span>
      <div className="p-num">{String(project.index).padStart(2, '0')}</div>
      <Html as="h3" html={project.title} />
      {project.valueLine && <p className="p-tagline">{project.valueLine}</p>}

      {project.miniRoadmap && (
        <div className="mini-roadmap mono">
          {project.miniRoadmap.map((step, i) => (
            <span key={step}>
              {step}
              {i < project.miniRoadmap!.length - 1 && <span className="mini-roadmap-arrow"> → </span>}
            </span>
          ))}
        </div>
      )}

      {project.proofChips && (
        <div className="proof-chips">
          {project.proofChips.map((chip) => (
            <span className="proof-chip" key={chip}>
              {chip}
            </span>
          ))}
        </div>
      )}

      <div className="p-controls">
        <button type="button" className="how-it-works-btn" onClick={onStartWalkthrough}>
          How it works ▶
        </button>
        <button type="button" className="view-details" onClick={onToggleDetails}>
          {expanded ? 'Hide details −' : 'View details ↓'}
        </button>
      </div>
    </>
  )
}
```

### `src/components/WorkflowWalkthrough.tsx`
```tsx
import { Fragment } from 'react'
import type { Project } from '../data/types'
import { StageMedia } from './StageMedia'
import type { WorkflowWalkthroughState } from '../hooks/useWorkflowWalkthrough'

// Coded, data-driven workflow walkthrough display — no PNG diagrams, no fake
// canvas, no animation library, no manual step player. State comes from
// useWorkflowWalkthrough (owned by ProjectCard, shared with the "How it
// works" trigger on ProjectLogicCard) — this component only renders it.
//
// Every row always shows its title + one-line explanation, same as the
// static workflow list on non-walkthrough projects. Clicking "How it works"
// (left column) or a row directly expands that row's mini-nodes + proof
// capture as an accordion panel directly under it — exclusive accordion:
// only one panel is open at a time, the previous step folds the moment the
// next one opens.
export function WorkflowWalkthrough({
  project,
  walkthrough,
}: {
  project: Project
  walkthrough: WorkflowWalkthroughState
}) {
  const stages = project.stages
  const { activeStep, completed, isDone, jumpTo } = walkthrough

  return (
    <div className="walkthrough">
      <div className="stages-label">
        <span className="mono">{project.stagesLabel}</span>
        <span className="mono">{project.stageCountLabel}</span>
      </div>

      <ol className="w-spine">
        {stages.map((stage, i) => {
          const isOpen = i === activeStep
          const isCompleted = completed.has(i)
          return (
            <Fragment key={stage.num}>
              <li
                className={`w-step${isOpen ? ' w-step--active' : ''}${isCompleted ? ' w-step--done' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => jumpTo(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    jumpTo(i)
                  }
                }}
              >
                <span className="w-step-num">{isCompleted ? '✓' : stage.num}</span>
                <div className="w-step-body">
                  <span className="w-step-title">{stage.title}</span>
                  <span className="w-step-desc">{stage.body}</span>
                </div>
                <span className={`s-actor s-actor--${stage.actor}`}>{stage.actorLabel}</span>
              </li>
              {isOpen && (stage.miniNodes?.length || stage.image) && (
                <li className="w-active-panel">
                  {stage.miniNodes && (
                    <div className="w-mini-nodes">
                      {stage.miniNodes.map((node) => (
                        <span key={node} className="w-mini-node w-mini-node--in">
                          {node}
                        </span>
                      ))}
                    </div>
                  )}
                  <StageMedia stage={stage} />
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>

      {isDone && project.finalRoadmap && (
        <div className="w-recap">
          <span className="mono mono--accent">Roadmap recap</span>
          <p className="w-recap-flow">{project.finalRoadmap}</p>
          {project.finalTakeaway && <p className="w-recap-takeaway">{project.finalTakeaway}</p>}
        </div>
      )}
    </div>
  )
}
```

### `src/hooks/useSectionScroll.ts`
**File does not exist.** Deleted during the stabilization pass earlier this session — this is intentional and is the entire point of that pass, not an omission from this dump.

### `src/hooks/useWorkflowWalkthrough.ts`
```ts
import { useState } from 'react'
import type { Stage } from '../data/types'

// Click-based workflow walkthrough, exclusive accordion: only one step's
// panel is open at a time — the previous one folds the moment the next one
// opens. Deliberately simple and deterministic (2026-07-25 stabilization
// pass): no scroll-tracking, no IntersectionObserver, no timers. "How it
// works" opens step 1; clicking any row jumps straight to it, folding
// whatever was open before. A scroll-driven version of this was tried
// twice and reverted both times after repeatedly conflicting with
// whole-page scroll behavior (a separate wheel controller, CSS scroll-snap)
// — if scroll-driven reveal comes back later, it needs a clean redesign
// against a stable base, not another patch stacked on this one.
export function useWorkflowWalkthrough(stages: Stage[]) {
  const [started, setStarted] = useState(false)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [completed, setCompleted] = useState<Set<number>>(new Set())

  // Opens exactly one step and folds the rest — steps before it are marked
  // completed (checkmark, no panel), steps at or after it are not.
  const goTo = (index: number) => {
    setActiveStep(index)
    setCompleted(() => {
      const next = new Set<number>()
      for (let i = 0; i < index; i++) next.add(i)
      return next
    })
  }

  const start = () => {
    setStarted(true)
    goTo(0)
  }

  // Clicking a row jumps straight to it, folding whatever step was open
  // before.
  const jumpTo = (index: number) => {
    setStarted(true)
    goTo(index)
  }

  const isDone = started && activeStep === stages.length - 1

  return {
    started,
    activeStep,
    completed,
    isDone,
    start,
    jumpTo,
  }
}

export type WorkflowWalkthroughState = ReturnType<typeof useWorkflowWalkthrough>
```

### `src/components/StageMedia.tsx` (imported by WorkflowWalkthrough)
```tsx
import { useState } from 'react'
import type { Stage } from '../data/types'

// Shows the selected stage's screenshot if the file actually exists on
// disk; falls back to an honest placeholder otherwise (most stages don't
// have a real capture yet — see public/case-media/<project>/README.txt).
export function StageMedia({ stage }: { stage: Stage }) {
  const [errored, setErrored] = useState(false)
  const hasImage = Boolean(stage.image) && !errored
  // public/ paths are root-relative; respect vite.config.ts's base (this
  // site is served under /ai-projects-showcase/, not site root).
  const src = stage.image ? import.meta.env.BASE_URL + stage.image.replace(/^\//, '') : undefined

  return (
    <div className="stage-media">
      {hasImage ? (
        <img src={src} alt={stage.caption ?? stage.title} onError={() => setErrored(true)} />
      ) : (
        <div className="stage-media-placeholder">Proof capture to be added.</div>
      )}
      {stage.caption && <p className="stage-media-caption mono">{stage.caption}</p>}
    </div>
  )
}
```

`ProjectLogicCard` imports only `Project` (types) and `Html` — `Html.tsx` is a small `dangerouslySetInnerHTML` wrapper unrelated to scroll/workflow logic, omitted here as out of scope. No `WorkflowOverview`, `WorkflowMiniNode`, or `WorkflowRecap` components exist in this codebase — those were names from an earlier planning document, never actually built as separate files; their responsibilities all live inline inside `WorkflowWalkthrough.tsx`.

### `src/styles/global.css`
Full 497-line file — see it directly at `D:\ai-test\ai-projects-showcase\src\styles\global.css`; reproduced in full in this session's tool output, omitted here only to keep this already-very-long file from duplicating ~500 lines twice. The scroll/workflow-relevant rules are: `html{scroll-behavior:smooth}` (line 14, only remaining scroll-related CSS), `.hero-cover`/`.systems-overview`/`.project` `min-height:calc(100vh - 56px)` (lines 68-73, 141-146, 177-181 — visual spacing only, no snap/jump behavior), `.w-step`/`.w-step-body`/`.w-step-desc`/`.w-active-panel`/`.w-step--active`/`.w-step--done` (lines 355-424 — the accordion's visual states), `.p-controls`/`.how-it-works-btn` (lines 245-257 — the left control stack). Zero `scroll-snap-type`, zero `scroll-snap-align` anywhere in the file.

### `src/data/projects.json`
Full 230-line file — all 7 projects. Reproduced in full in this session's tool output at `D:\ai-test\ai-projects-showcase\src\data\projects.json`; only Project 01 (`job-application-filter`) has the walkthrough fields (`valueLine`, `miniRoadmap`, `proofChips`, `finalRoadmap`, `finalTakeaway`, per-stage `miniNodes`) — Projects 02-07 do not, confirmed by direct inspection of the file, which is why `hasWalkthrough` (`ProjectCard.tsx`) is `true` only for Project 01.

---

## 5. Current `ProjectCard` render structure

```
<ProjectCard>
  <article className="project ... [project--collapsed if !expanded] [project--compact if compact]" id={project.id}>
    <div className="p-grid">

      <aside className="p-meta">
        <div className="p-meta-inner">
          {hasWalkthrough (true only for Project 01) ?
            <ProjectLogicCard>              ← left column, walkthrough projects
              number / title / valueLine / mini-roadmap / proof-chips
              <div className="p-controls">
                <button className="how-it-works-btn">How it works ▶</button>   ← HOW IT WORKS, here
                <button className="view-details">View details / Hide details</button>  ← VIEW DETAILS, here
              </div>
            </ProjectLogicCard>
          : (else, Projects 02-07)
            number / title / tags / tagline-or-proof-or-key
            <button className="view-details">View details</button>            ← VIEW DETAILS, here (no How it works — no walkthrough data)
          }
        </div>
      </aside>

      <div className="p-content">
        {hasWalkthrough ?
          <WorkflowWalkthrough>          ← right column, Project 01 only
            <ol className="w-spine">
              {each stage}
                <li className="w-step [--active] [--done]">   ← workflow stage rows, here
                  num / title / desc (always visible) / actor
                </li>
                {isOpen && <li className="w-active-panel">     ← active walkthrough panel, here
                  mini-nodes, StageMedia
                </li>}
            </ol>
            {isDone && <div className="w-recap">...}           ← roadmap recap, here
          </WorkflowWalkthrough>
        : (else)
          <WorkflowStages>              ← right column, Projects 02-07 (static, always-visible list)
        }

        <div className="expand-panel [--open if expanded]">     ← details content, here
          <dl className="gmr">Problem/Workflow/Result or Goal/Logic/Build evidence/...</dl>
          {transferHeading && <div className="transfer-block">...}
        </div>
      </div>

    </div>
  </article>
</ProjectCard>
```

`data-scroll-exempt` does **not** appear anywhere — it was added during the "state-based exemption" attempt and removed during the stabilization pass. There is no `.project`-class element anywhere else in the tree besides this one `<article>` — one per `ProjectCard` instance, 7 total on the page (4 in `#flagship-featured`, 3 in `#flagship`).

---

## 6. Current scroll ownership logic

- **Which hook listens to wheel events?** None. `useSectionScroll` was deleted; zero `addEventListener('wheel'` anywhere in `src/`.
- **Which component calls `useSectionScroll`?** None — the import and call were both removed from `App.tsx`; confirmed by the empty `git diff` on that file.
- **Which selector is passed into `useSectionScroll`?** N/A, hook doesn't exist.
- **Which elements become section targets?** N/A.
- **When does the code call `preventDefault`?** Only in two unrelated, pre-existing places: `Plasma.jsx:196` (WebGL pointer/touch handling, untouched all session) and the keyboard `onKeyDown` handlers in `ProjectCard.tsx`/`WorkflowWalkthrough.tsx` (Enter/Space triggering a click-equivalent — standard accessibility pattern, not scroll-related).
- **When does the code call `scrollIntoView`?** Nowhere. Zero matches in `src/`.
- **What is the cooldown/lock logic?** None exists anymore.
- **What condition marks a project as scroll-exempt?** None — `data-scroll-exempt` doesn't exist anywhere in current code.
- **What happens when HOW IT WORKS is active?** Nothing scroll-related. `ProjectCard`'s `<article>` has no special class or attribute based on walkthrough state. The page just scrolls normally, exactly like any other content.
- **What happens when View details is open?** Same — nothing scroll-related. `expand-panel--open` just changes CSS `max-height`/`opacity` (a local, non-scroll-affecting transition) to reveal the content in place.
- **What happens when clicking nav / hash links?** Standard browser anchor-jump behavior only, using `html{scroll-behavior:smooth}` for the animation. Additionally, `ProjectCard.tsx`'s `hashchange` listener (lines 82-89) sets `expanded=true` if the URL's hash matches that project's own id — this is the one pre-existing, intentional side effect of hash navigation, unrelated to any of this session's scroll work.

---

## 7. Current walkthrough logic

- **What starts HOW IT WORKS?** Clicking the "How it works ▶" button in `ProjectLogicCard`, which calls `onStartWalkthrough` → `walkthrough.start` (from `useWorkflowWalkthrough`).
- **What is `walkthrough.started`?** A boolean, `false` until `start()` or `jumpTo()` is ever called once; never resets to `false` again afterward for that card's lifetime.
- **What is `walkthrough.isDone`?** `started && activeStep === stages.length - 1` — true exactly when the walkthrough has been started AND the currently-open step is the last one.
- **How is the active step chosen?** Purely by explicit calls: `start()` calls `goTo(0)`. Clicking any `.w-step` row calls `jumpTo(i)` → `goTo(i)`. `goTo(index)` sets `activeStep = index` directly — nothing else can change it.
- **Does `IntersectionObserver` still control step reveal?** No. Zero `IntersectionObserver` usage in `useWorkflowWalkthrough.ts` (confirmed by direct read of the file, section 4 above).
- **Does wheel/scroll still affect active step?** No — no scroll or wheel listener exists anywhere that touches walkthrough state.
- **Does it auto-play, scroll-reveal, or click-only reveal?** Click-only. No timers (`setTimeout`/`setInterval`), no scroll listeners.
- **Where does the active step panel render?** Inline, as a `<li className="w-active-panel">` immediately after that step's own `<li className="w-step">` inside the same `<ol className="w-spine">` — via a `Fragment` per stage in the `.map()` (see `WorkflowWalkthrough.tsx` section 4). Only rendered when `isOpen && (stage.miniNodes?.length || stage.image)`.
- **How does it move from step 1 to step 2?** Only by the user clicking step 2's row (or any other row) — `jumpTo(1)` → `goTo(1)` → `activeStep=1`, `completed={0}` (step 0 gets the ✓ checkmark, its panel closes since `isOpen` is now false for it).

---

## 8. Build check

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
dist/assets/index-BejvoypG.js   228.57 kB │ gzip: 71.80 kB
✓ built in 565ms
```

Zero TypeScript errors, zero build errors.

---

## 9. Not fixed — stopped here as instructed

No code changes were made while producing this report. This reflects the exact current state after the earlier stabilization pass (removed `useSectionScroll`, removed the `IntersectionObserver` from `useWorkflowWalkthrough`, removed `scroll-snap` CSS, removed `data-scroll-exempt`). Nothing has been touched since that pass except this dump itself.
