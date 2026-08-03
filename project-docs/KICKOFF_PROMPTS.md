# V2 kickoff — ready-to-paste prompts

Use these in order. Each one is copy-paste ready as-is.

---

## Step 3 — Gemini Pro: build the UI Content Pack

Attach `CONTENT_EXPORT_FOR_REDESIGN_2026-07-26.md` (repo root, or copy at
`D:\ai-test\ai-projects-showcase-v2\CONTENT_EXPORT_FOR_REDESIGN_2026-07-26.md`)
and paste:

```text
Read the attached portfolio content export.

Do not rewrite, invent or simplify verified claims.

Create a compact UI Content Pack for redesign containing only:

1. Site identity and navigation
2. The three project tiers
3. The four Featured Proof projects:
   - title
   - value line
   - key stat
   - compact Problem
   - compact Workflow
   - compact Result
4. The three remaining projects as compact index entries
5. The Script / AI / Human / Output actor system
6. The Goal / Method / Result / Failure handled /
   Decision / Limitation case-note structure
7. A proposed visual media requirement for each project

Do not design the interface.
Do not add marketing copy.
Do not change figures.

Output a concise redesign input suitable for Google Stitch.
```

---

## Step 4 — Google Stitch: generate 3 interface directions

Paste the UI Content Pack from Step 3 as context, then:

```text
Create a complete visual redesign for Erin Wong's AI workflow portfolio.

Use the attached UI Content Pack as the content source of truth.

Do not rewrite claims, figures, project titles or project logic.

The current website is functional but visually too much like a technical
dashboard. Replace the complete presentation and storytelling layer.

PRESERVE

- Three project tiers:
  Featured Proof, Supporting System, Learning Lab
- Script / AI / Human / Output actor meaning
- Compact and expanded case-study content
- Human-review decision gates
- Honest failure and limitation reporting

DESIGN GOAL

Create a visual-first, premium and editorial systems portfolio.

The interface should feel:

- refined
- clear
- high-end
- visually structured
- contemporary
- credible
- media-led
- precise rather than decorative

Avoid:

- SaaS dashboard appearance
- excessive bordered cards
- excessive chips
- pipeline simulators
- generic AI gradients
- glassmorphism
- fake controls
- long text visible all at once
- all projects having equal visual weight

CREATE

1. Homepage desktop
2. Homepage mobile
3. Featured project preview
4. Featured case-study page desktop
5. Featured case-study page mobile
6. Workflow storytelling section
7. Evidence/result section
8. Progressive case-notes section
9. Compact Supporting System / Learning Lab index
10. Navigation and page-transition concept

STORYTELLING

Homepage:
- show four Featured Proof projects with strong visual hierarchy
- show only title, value line, key stat and visual preview
- present Supporting and Learning projects more compactly

Featured project:
- media-led opening
- compact Problem / Workflow / Result
- workflow stages shown through visual sequencing
- Script / AI / Human / Output shown as subtle labels
- real evidence section
- full case notes later through progressive disclosure

Generate three clearly different art directions using the same content:

A. Editorial systems portfolio
B. Visual digital exhibition
C. Refined designer and workflow builder

Do not generate production backend logic.
Do not create a new content model.
```

Export the chosen direction to Figma once picked.

---

## Step 9 — Gemini Pro: visual QA (use after Claude implements V2)

```text
Compare the approved Figma screen with the implemented localhost screen.

Do not redesign anything.
Do not write code.

Return a numbered visual QA list covering:

- typography
- spacing
- alignment
- image scale and crop
- component proportions
- responsive behaviour
- motion timing
- missing states

For every issue include:
- page
- component
- exact difference
- expected result
- priority
```

Then hand the numbered list to Claude Code:

```text
Implement only approved QA issues 01–14.

Do not modify content, data structure, routing,
deployment or unrelated components.
```

---

## Step 8 — Claude Code: implement approved V2 (use once Figma is approved)

Run this from inside `D:\ai-test\ai-projects-showcase-v2` (already on
branch `redesign/ui-v2`):

```text
Work only in the redesign/ui-v2 branch and this local folder:

D:\ai-test\ai-projects-showcase-v2

Read:

- CONTENT_EXPORT_FOR_REDESIGN_2026-07-26.md
- src/data/page-content.json
- src/data/projects.json
- src/data/types.ts
- project-docs/REDESIGN_CONTRACT.md
- project-docs/DESIGN.md
- project-docs/MOTION_SPEC.md
- project-docs/FIGMA_HANDOFF.md
- the approved Figma frames through Figma MCP

Use Plan Mode first.

The current JSON content, verified figures, tier system, actor typing,
compact/full content depths and project logic must remain unchanged.

The task is to replace only the presentation and visual storytelling layer.

Do not redesign the approved interface.
Do not rewrite content.
Do not modify verified figures.
Do not create new marketing copy.
Do not modify the deployment workflow.
Do not delete V1 components.

Create a parallel V2 implementation under:

- src/components/v2/
- src/styles/v2/
- src/AppV2.tsx

Initial implementation scope:

1. V2 navigation
2. V2 homepage
3. Featured project preview
4. One complete Job Screening case-study page
5. Desktop and mobile layouts
6. Approved motion
7. Reduced-motion support

Reuse the existing JSON data.

First return only:

- component map
- files to create
- files to edit
- mapping from current JSON fields to V2 components
- responsive implementation plan
- motion implementation plan
- V1/V2 switching method
- rollback plan

Do not write code until the plan is approved.
```

Before this: fill in `project-docs/DESIGN.md`, `project-docs/MOTION_SPEC.md`, and
`project-docs/FIGMA_HANDOFF.md` with the real approved values (they're templates
right now — see each file's own TEMPLATE note at the top).
