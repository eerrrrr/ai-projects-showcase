status: received 2026-08-05, implementation in progress
target: /ai — Figma Make 2.5D selection proof (Hero) + reusable WorkflowDiagram (Project 01)

---

Start the next implementation phase now.

Do not reopen the overall visual-direction discussion.
Do not ask which route to use.
The target route is fixed: /ai.

This phase has two tightly scoped deliverables:

1. one lightweight 2.5D tool-selection proof in the existing Hero;
2. one reusable animated workflow-diagram proof for Project 01.

Do not build full 3D.
Do not redesign the complete website.
Do not implement all tools or all projects yet.

[Full instruction preserved verbatim below]

---

## A. CURRENT APPROVED BASELINE

Route: /ai
Approved Hero asset: public/media/v2/ai-workflow-hero.png
Verified source resolution: 2782 × 1536

Lock the current static Hero composition. Do not change title scale/
position, subtitle copy, navigation, Hero image, image resolution,
scene-frame aspect ratio, background treatment, scene placement, scroll
cue, mobile numbered project list, routes, project names, verified
figures, project descriptions.

## B. FINAL INFORMATION LOGIC

The Hero is a Tool Usage Field, not a Project Hotspot Map. Hovering a
tool explains where/how it was used; a tool doesn't have to link to one
project; clicking pins the annotation; normal scrolling leads to real
project sections below.

## C. PHASE 1 — FIGMA MAKE 2.5D PROOF

One tool only: Figma Make. Prove the "selected card" interaction before
duplicating it to other tools.

- C1: aligned overlay (clip-path or generated alpha-masked PNG at the
  Hero's real 2782x1536 canvas), sourced from the real image, no redraw,
  documented coordinates.
- C2: invisible interaction region, accessible name "Figma Make — used in
  Source-to-Figma Data Visualization Pipeline".
- C3: hover/focus — scale ~1.025, translate ~3px up, rotate 0.4-0.5deg,
  subtle brightness + drop shadow, 150-180ms, no full-scene movement.
- C4: annotation — FIGMA MAKE / USED IN / 03 SOURCE-TO-FIGMA DATA
  VISUALIZATION PIPELINE, Swiss editorial, transparent/max 6-8% tint,
  one leader line, max 4 lines, no modal/tooltip box.
- C5: click pins/unpins; click-outside and Escape close; Tab focus shows
  same state; no navigation, no modal, no scroll hijack.
- C6: reduced-motion = opacity-only; mobile disables the interaction
  entirely (image + numbered links only).

## D. PHASE 2 — REUSABLE WORKFLOW DIAGRAM

WorkflowDiagram component, Project 01 (Job Screening Validation Workflow)
only this pass. Data-driven (WorkflowNode/WorkflowDefinition types), no
React Flow, no heavy diagramming dependency. Six verified stages (Intake
trigger/Normalize record/Validate safety rules/Map Notion payload/Route
review state/Review report-write outcome), actors SCRIPT/SCRIPT/SCRIPT/
SCRIPT/HUMAN/OUTPUT — no invented AI actor or unverified tool placement.
Swiss visual language, no dashboard/glassmorphism/n8n-copy. Desktop
left-to-right, mobile top-to-bottom. Entrance stagger 80-120ms/~1.2s
total, hover/focus emphasis without layout shift, reduced-motion shows
immediately. Placed near top of Project 01, replacing the old duplicate
six-stage display (no two competing six-stage UIs).

## E-H. Quality / Scope / Tests / Review output

See full detail in the original pasted instruction (2026-08-05 chat) —
condensed above for space; the binding rules are: no full 3D, no other
tools/projects touched this pass, no route/figure/content changes, no
commit/push/deploy, 9 real screenshots under
project-docs/screenshots/interaction-workflow-proof/, honest reporting of
any ghosting/clipping issues or workflow content that couldn't be filled
because source data didn't support it.
