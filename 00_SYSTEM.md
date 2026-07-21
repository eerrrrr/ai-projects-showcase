---
title: ai-projects-showcase — system state
created: 2026-07-20
updated: 2026-07-20 (v2 restructure, same day)
status: working build, not yet deployed
---

# ai-projects-showcase

## What this is

A React + JSON rebuild of `D:\ai-test\reports\AI_PROJECTS_SHOWCASE_2026-07.html`
— a job-application showcase built for an "AI Project Manager" role at
Arcto/Aurinkokarhu (Vaasa), presenting 5 flagship AI projects (Investment
Research System, Moss Content Factory, Method of Loci, Video Pipeline,
Blender/ComfyUI Previs) mapped against Arcto's 4 stated tool areas (contract
analysis, land & permitting, deal screening, market intelligence).

The original was a single 1,277-line static HTML file — well-designed but not
maintainable: editing a project, reordering, or building a second version for
a different job target meant hand-editing HTML. This rebuild moves all
content into JSON so the underlying React components can be reused for
future targets.

## Why it exists (design rationale)

Same content, same visual design, same verified numbers as the original —
this pass re-architects *structure*, not substance. See the approved plan at
the time this was built (referenced in conversation) for the full design
rationale. Key decisions:

- **Standalone project**, not inside the live portfolio
  (`E:\my-portfolio-website\eerrrrr.portfolio.github.io`) — that site has a
  standing "no React, no JSON migration" hands-off rule from an earlier
  stability decision (2026-05-18). Keeping this separate means that rule
  never has to be broken.
- **Vite + React 18 + TypeScript**, matching the one other React precedent in
  this workspace (`E:\AI_editing\auto-typesetting-cover-tool\`) rather than
  introducing a new stack.
- **Faithful port**: content, copy, numbers and visual design carried over
  as-is from the source HTML — this pass is structural only.

## Architecture

```
src/data/
  types.ts           — TypeScript interfaces for both JSON files
  projects.json       — the 5 flagship projects (goal/method/result, 6-ish
                         stage workflow, "how this transfers" bullets, tags,
                         domains for the JD-area filter)
  page-content.json    — everything else: hero, architecture diagram, the 4
                          JD tool-area buttons, lab notebook, supporting
                          systems, role-fit checklist, principles, footer

src/components/        — one component per section of the original page,
                          named to match (Hero, ArchitectureDiagram, JdAreas,
                          ProjectCard, LabNotebook, SupportingSystems,
                          RoleFit, Principles, Footer, FilterBar, Nav)

src/hooks/
  useFilter.ts         — JD-area click-to-highlight (replaces the original's
                          vanilla-JS filter IIFE)
  useCountUp.ts         — the hero stat count-up animation, same easing curve
                          and same two failsafes as the original
  useReveal.ts           — scroll-reveal-on-intersect, same progressive-
                          enhancement approach as the original (page stays
                          fully visible unless IntersectionObserver confirms
                          it can animate)

src/styles/global.css  — the original's ~490-line embedded stylesheet,
                          ported near-verbatim; same class names as the
                          source HTML on purpose
```

`src/components/Html.tsx` is a small shared renderer for the handful of JSON
fields (`*Html` suffix in `types.ts`) that carry inline emphasis (`<strong>`,
`<span class="num">`, `<code>`) preserved from the original copy — these are
static, author-written strings baked into the JSON at build time, never user
input, so `dangerouslySetInnerHTML` is the standard low-risk pattern here.

## What's built and verified (2026-07-20)

- Full scaffold (Vite + React + TS), all data ported, all components written.
- `npm run build` (`tsc -b && vite build`) — **compiles clean, zero
  TypeScript errors, first try.**
- `npm run preview` served the production build; verified via:
  - `curl` — correct HTML shell, correct asset paths under the
    `/ai-projects-showcase/` base.
  - Grepping the built JS bundle for key figures (515,000 / 439 / 188 / 860 /
    518 / 27-ticker) and project titles — all present, correctly bundled.
  - Opened in the default Windows browser for a manual look.
- **Not yet done:** an automated pixel-level visual diff against the
  original HTML — headless-browser MCP tools (Puppeteer / Chrome DevTools)
  were unavailable in the build session. Worth a manual side-by-side check.

## Deployment (deliberately not done yet)

A GitHub Actions workflow (`.github/workflows/deploy.yml`) is included,
ready to build and deploy to GitHub Pages the standard way
(`actions/deploy-pages`). **Not yet run**: this project has not been
`git init`'d, no GitHub repo has been created, nothing has been pushed, and
GitHub Pages has not been enabled. All of that is a manual step to confirm
with the user first — creating a repo and pushing is a visible, external
action outside what a build/rebuild task implies on its own.

## v2 restructure (2026-07-20, same day as the initial build)

The showcase was originally content-faithful to one specific job application
(see "What this is" above) — 5 project cards, all equal visual weight,
company-specific copy throughout. Two things changed this in one pass:

1. Two more working demos had been built the same night
   (`D:\ai-test\reconciliation-exception-review\`,
   `investment-research-system\n8n_workflows\evidence_review_decision_gate.json`)
   but never added as cards.
2. The user made an explicit, deliberate decision **not** to retarget the
   whole site to any one employer, and **not** to fork a second site or build
   real multi-route plumbing — instead: one target-neutral core portfolio,
   capability-tiered, with a generic "process automation" framing that reads
   as directly relevant to that kind of role without naming any employer.

**Hard rule enforced in this pass, and for all future edits:** the public
site (`page-content.json`, `projects.json`, and by extension the built
bundle) must never name a specific employer, use "-facing" language, or say
"prepared for X." Verified by `grep -io "staria\|arcto\|aurinkokarhu"` across
both JSON files and `dist/assets/*.js` — zero matches after this pass. Any
company-specific reasoning (why a given case is relevant to a given
application) belongs only in this file, `AGENTS.md`, the decision log, or
Claude's memory — never in the two content JSON files.

**What changed:**
- `types.ts`: `Project` gained `tier` (1/2/3), `tierLabel` (public-facing:
  "Featured proof" / "Supporting system" / "Learning lab"), and two optional
  fields (`decisionHtml`, `limitationHtml`) for a
  Problem→Built→Decision→Proof→Limitation→Transfer template.
- `projects.json`: grew from 5 → 8 (added Reconciliation Exception Review and
  Evidence Review & Decision-Gate Automation; the previously-orphaned Job
  Application Filter is now correctly tiered too), reordered so the 3
  Tier-1 "Featured proof" cards lead, `transferHeading` genericized from
  "How this transfers to Arcto's pipeline" to "Where this applies" across
  **all** 8 cards (not just the new ones).
- `page-content.json`: hero/meta copy genericized; the `jdEcho` quote
  attribution ("— Arcto's job ad") replaced with an unattributed generic
  industry framing; the 4 `jdAreas` filter buttons re-tagged from
  employer-specific tool areas (contract/permitting/deal/adoption) to
  capability groups (automation/governance/documentation/lab); the `fit`
  section rewritten from "six things the ad says" into generic role-family
  asks, and moved up to right after the operating-model section.
- `ProjectCard.tsx`: renders the new `tierLabel`; conditionally renders
  Decision/Limitation rows only when present (so Tier 2/3 cards, which don't
  have them, render unchanged).
- `App.tsx`: `RoleFit` moved from after Supporting Systems to right after
  `ArchitectureDiagram`.

**Exact final roster (8, not 9 — the showcase site itself is not a card):**
Tier 1 (3): Reconciliation Exception Review, Evidence Review &
Decision-Gate Automation, AI-Assisted Job Application Filter. Tier 2 (2):
Source-First Investment Research System, Method of Loci. Tier 3 (3): Moss
Content Factory, AI-Assisted Video Pipeline, Blender + ComfyUI Previs.

## v3 — front-loaded focus pass (2026-07-20, same day, third pass)

After v2 shipped, the user reviewed it against two more rounds of external
critique and landed on a scoped, explicit instruction: the front of the page
was still too broad — an interviewer should understand the value in the
first screen, not after scrolling past stats, an architecture diagram, a fit
matrix and capability filters. A separate idea (click-a-capability →
screenshot proof gallery) was explored and explicitly **deferred**, not
built — "capture gallery 係好 idea，但係第二步" (good idea, but step two).

**What changed:**
- `Hero.tsx` reduced to identity only: meta row + title + one subheading. The
  `jdEcho` quote-and-answer block was removed entirely (not relocated — it
  was redundant with the new subheading). Stats were extracted out.
- New `StatsStrip.tsx` — the exact same count-up stats, same hook
  (`useCountUp`), just relocated further down the page instead of living
  inside Hero.
- New `ProofSummary.tsx` — a compact 3-column strip right under the hero,
  one block per Tier-1 project, reusing each project's existing
  `keyNumber`/`keyLabel` (no duplicated copy) plus a new optional
  `shortTitle` field (`types.ts`) for a compact label ("Finance-style
  Exception Review" / "Evidence Review Gate" / "Real n8n Workflow").
- New `MethodLine.tsx` — renders `page-content.json`'s new `methodLine`
  string array ("Source → AI assist → Quality gate → Human review → Logged
  output → Reuse") as a single Swiss-style row.
- `App.tsx` reordered: Hero → ProofSummary → MethodLine → **Tier-1 cards in
  full detail** (new `featuredSectionNo`/`featuredHeading`/`featuredSub`
  fields) → StatsStrip → ArchitectureDiagram (operating model) → RoleFit →
  JdAreas (capability filters) → SupportingSystems → **Tier-2/3 cards**
  (existing `flagshipSectionNo`/`flagshipHeading`, renamed to "Supporting
  systems & learning lab, in detail" since it's no longer all 8 projects) →
  LabNotebook → Principles → Footer. All `sectionNo` values renumbered 01–08
  to match.
- `projects.json`: split into `featuredProjects` (tier 1) and
  `otherProjects` (tier ≠ 1) in `App.tsx`, each rendered in its own
  `<section>` rather than one combined loop over all 8 — this is what lets
  Tier-1 show early while Tier-2/3 stay later without duplicating any card.

**Verified again after this pass:** `grep -io "staria|arcto|aurinkokarhu"`
across `page-content.json`, `projects.json` and the built bundle — still
zero matches. `npm run build` — zero TypeScript errors. Bundle grep confirms
the new hero copy, method line, all three `shortTitle` labels, and all 8
project titles (3 featured + 5 other) are present.

## v4 — swap the featured 3, drop an unverified 4th case (2026-07-21, same session)

The user had a real concern: leading with the finance-style exception review
made the front page read like it was built to order for one JD, when the
user has no professional finance background — the demo is real but the
framing was doing more work than the evidence supported. Two more rounds of
pasted review proposed a full swap: lead with the job-application-filter
(most honest, actually executed), promote the investment-research-system
and Moss content pipeline (reframed), and add a fourth case built around
"3D printing / a bamboo thesis / experiment feedback."

**Before writing any of this, checked what's actually true:**
- `investment-research-system/.claude/skills/` genuinely contains
  `thinking_distillation` ("Extract reusable reasoning patterns... process
  and mental models, not profit... never treat the person as always
  correct") and `skill_evolver` (proposes skill patches from flagged
  reasoning errors, human reviews before applying). The "Research & Skill
  Database" reframe is real, not invented — verified by reading the actual
  skill files before writing the new copy.
- `D:\ai-test\3d print\` is a Notion logging bridge plus a folder of
  unrelated reference/inspiration images — no assumption→test→result→
  failure→lesson structure exists there. `grep`ing the whole workspace for
  "bamboo" returned nothing. **This 4th case was not built** — asked the
  user, who confirmed: drop it rather than write unverifiable copy. If real
  source material exists outside this workspace, it can be added later from
  that material, not invented.
- The pasted copy also folded an "OpenClaw" bot experiment into the
  job-filter case as if OpenClaw itself were a finished, working prototype
  — this directly contradicts what was established when this project was
  first built (OpenClaw's own job-tracker was never finished; only the
  *filter logic* was rebuilt fresh in n8n). Asked the user; they chose to
  keep the honest framing, de-emphasized: one sentence noting OpenClaw as
  early inspiration, never calling it a finished system.
- The pasted copy also asked for a link to `https://erin-wong-portfolio.vercel.app/`
  — a URL with zero prior mention anywhere in this project, memory, or
  conversation. **Not added.** Flagged to the user directly rather than
  publishing an unverified external link; if it's real, it needs to come
  from the user, not be assumed from pasted third-party text.

**What actually changed:**
- Roster dropped from 8 → **7** projects. `reconciliation-exception-review`
  was removed from `projects.json` entirely and now lives only as a small
  mini-card in `supporting.cards` ("Process transfer demo — Finance-style
  Exception Review"), explicitly labeled as mock data testing whether the
  same pattern transfers to an operations context — not a flagship claim.
- New Tier-1 roster (3, still "Featured proof"): `job-application-filter`
  (retitled "Opportunity Screening Workflow", now index 1),
  `investment-research-system` (reframed "Source-First Research & Skill
  Database", index 2), `moss-content-factory` (retitled "Daily Content &
  Visual Communication Pipeline", index 3, promoted from Tier 3).
  `evidence-review-decision-gate` moved to Tier 2 (not mentioned in the
  user's proposed reorder, so kept as a Supporting system by default rather
  than dropped).
- Hero rewritten again: `heroTitleHtml` now "I turn messy information into
  structured workflows that can be reviewed, reused, and improved.";
  `ledeHtml` is now a 5-item bullet list ("Source before AI output" /
  "Criteria before judgment" / "Human decision before action" / "Logs
  before memory" / "Reuse before rebuild") instead of a paragraph — new
  `.core-thinking` CSS, `Hero.tsx`'s lede changed from `<p>` to `<div>` to
  legally contain a `<ul>`.
- `types.ts`: added `shortTitle?: string` for the compact `ProofSummary`
  labels ("Opportunity Screening Workflow" / "Research & Skill Database" /
  "Daily Content Pipeline").
- Every "eight" reference in `page-content.json` (architecture heading,
  `noteLeft`) updated to "seven."

**Verified again:** company-name grep still zero matches; also grepped for
"bamboo" and "vercel" across the built bundle and source JSON — zero
matches, confirming neither the dropped case nor the unverified URL leaked
in. `npm run build` — zero TypeScript errors.

## v5 — 4th featured proof, verified external link, two-list hero (2026-07-21)

Follow-up pass, same day. The user's PDF review of v4 described content that
didn't match what was actually shipped (quote box, stats-first, finance-demo
leading — all already fixed in v3/v4) — likely a stale export, not
re-flagged as a bug. Real new requests on top of v4:

- **`https://erin-wong-portfolio.vercel.app/` came up again**, this time
  typed directly in the user's own message rather than only inside pasted
  third-party text. Before adding a link to an application-facing site,
  checked it rather than trusting repetition: `curl -I` → HTTP 200, then
  `WebFetch` to confirm the content is actually Erin Wong's real
  architecture/furniture-design portfolio (Aalto MSc, ComfyUI/Blender
  tooling — consistent with facts already in this project). Added as
  `heroLink` in `page-content.json`, rendered as a real `<a>` in `Hero.tsx`
  (previously `metaRow.right` was inert text, not a link).
- **`evidence-review-decision-gate` promoted from Tier 2 → Tier 1** (now 4
  featured proofs, not 3). `ProofSummary`'s CSS grid changed from 3 to 4
  columns (mobile: 2 columns).
- **`investment-research-system` renamed** "Investment Research Learning
  System" (was "Source-First Research & Skill Database") — copy substance
  unchanged (still grounded in the real `thinking_distillation`/
  `skill_evolver` skills verified in v4), just the public title.
- **Hero restructured again**: the single bullet list became two, side by
  side — `buildListHeading`/`buildList` ("What I build") and
  `thinkingHeading`/`thinkingList` ("Core thinking"), replacing the single
  `ledeHtml` field (removed from `types.ts` and the JSON). `metaRow` lost
  its `.right` field (was inert descriptive text); `heroLink` replaces it
  with something clickable.
- `JdAreas` (capability filters) moved after `SupportingSystems`, further
  from the top — `sectionNo` 04/05 swapped between them in
  `page-content.json`; `App.tsx` reordered to match.

**Final roster (still 7, tiers redistributed):** Tier 1 (4): Opportunity
Screening Workflow, Investment Research Learning System, Daily Content &
Visual Communication Pipeline, Evidence Review & Decision-Gate Automation.
Tier 2 (1): Method of Loci. Tier 3 (2): Video Pipeline, Blender + ComfyUI.

**Verified again:** company-name grep zero; `npm run build` zero
TypeScript errors; bundle grep confirms the portfolio link, both hero list
headings, and "Four featured proofs, in detail" are all present.

## v6 — progressive disclosure: collapsed by default, click to expand (2026-07-21)

Same-day follow-up. The user's core complaint: even after v5, the page still
read as fully-expanded reports stacked one after another — every project's
full Goal/Method/Result/Decision/Limitation/Stages/Transfer content was
always visible, so the four systems didn't fit "the first screen" no matter
how short the hero got. The fix isn't more copy-trimming — it's an actual
interaction change: **show a compact summary by default, expand full detail
only on click.**

**What changed:**
- `Hero.tsx` simplified further: the two bullet lists (`buildList`/
  `thinkingList` from v5) removed entirely. Replaced with one h1 statement
  ("I build small AI systems from real workflow problems.") and one compact
  `focusLineHtml` line ("My focus: define the criteria · let AI assist ·
  keep human decision visible · reuse what I learn"). `types.ts` updated to
  match (`buildListHeading`/`buildList`/`thinkingHeading`/`thinkingList`
  removed, `focusLineHtml` added).
- New `Project.taglineHtml?` field (`types.ts`) — a single verified one-line
  proof statement, populated only on the 4 Tier-1 cards. `ProofSummary.tsx`
  now shows this tagline instead of the raw keyNumber/keyLabel pair, so the
  front-page summary reads as a proof sentence, not a stat.
- `ProjectCard.tsx` now has real collapse/expand state (`useState`,
  component-local — no lifting needed, each card is independent). Collapsed
  (default): number, title, tags, tagline (or keyNumber/keyLabel if no
  tagline — the 3 non-featured cards), and a "View details ↓" button.
  Expanded: the full existing content unchanged, plus the keyNumber/keyLabel
  stat re-shown inline (only for cards that used the tagline in their
  collapsed view, avoiding duplicating it for cards that already show it
  collapsed). This is applied uniformly to **every** `ProjectCard` instance
  — both the featured section and the "supporting/lab" section — so the
  latter's request to be "compact archive only" is satisfied by the same
  mechanism, not a second component.
- `featuredHeading`/`flagshipHeading` copy adjusted to drop "in detail"
  (no longer accurate — detail is opt-in now) and `featuredSub` now says
  "Click a project to expand."

**Verified again:** company-name grep zero; new hero copy present in bundle,
old bullet-list text (`What I build`, `Source before AI output`) confirmed
gone; all three tagline sentences present; "View details" button text
present. `npm run build` — zero TypeScript errors.

## v7 — literal project names, bullet-point detail, clickable stage evidence (2026-07-21)

Final same-day pass. Two real asks beyond more copy tuning: (1) the four
featured titles were still abstract ("Opportunity Screening Workflow" etc.)
— renamed to literal, immediately-parseable names; (2) a genuinely new
feature — click a workflow stage number to see a screenshot/capture for
that specific stage, not just read about it.

**Titles renamed** (content/numbers unchanged, only the public label):
Opportunity Screening Workflow → **Job Search Automation System**;
Investment Research Learning System → unchanged; Daily Content & Visual
Communication Pipeline → **Social Media Content Pipeline**; Evidence Review
& Decision-Gate Automation → **AI Mistake Review & Learning Gate**.

**Hero, once more:** the two-line bullet lists from v6 are gone. Now
name-led: `heroName` ("Erin Wong") as h1, `heroTagline` ("AI Workflow
Systems") as a large accent line beneath it, a compact `focusLineHtml`
subline, and the "Core thinking" list is back (`thinkingHeading`/
`thinkingList` re-added to `types.ts`/`page-content.json` — this field pair
was removed in v6 and is now reinstated with slightly different wording,
"Mistakes become rules" replacing "Logs before memory").

**Goal/Method/Result/Decision/Limitation converted from prose to `<ul><li>`
bullet lists** for all 4 featured cards — same underlying facts and
numbers (515K, 9 listings, 188 scripts, 2 safety layers, etc.), reformatted
for scannability. No new fields needed — these are still the same
`goalHtml`/`methodHtml`/etc. string fields, just containing list markup
instead of paragraph markup (the existing `Html` + `dangerouslySetInnerHTML`
pattern renders either equally well).

**New: clickable stage evidence.** `Stage` (`types.ts`) gained optional
`image`/`caption` fields. Every stage across all 4 featured cards now has
these set, pointing at `/case-media/<project-id>/stage-N-*.png` — files
that **do not exist yet** (folders created with a `README.txt` placeholder
each; real screenshots need to be dropped in by hand later). New
`StageMedia.tsx` component: clicking a stage row (`ProjectCard.tsx`, new
`selectedStageNum` state) shows that stage's image if it loads, or a clean
"Proof capture to be added." placeholder if the `<img>` `onError`s — which
is what happens for all of them right now, honestly, since no real captures
exist. Image `src` is built via `import.meta.env.BASE_URL` (added
`src/vite-env.d.ts` for the type) so paths resolve correctly under this
site's `/ai-projects-showcase/` base instead of assuming site root.

**Verified again:** company-name grep zero; all 4 renamed titles present in
bundle; bullet-list markup confirmed present; stage image paths and the
"Proof capture to be added." placeholder text both present. `npm run build`
— zero TypeScript errors. Noted but not a bug: `vite preview`'s dev server
SPA-fallback returns `index.html` (200, `text/html`) for the not-yet-real
image paths rather than a genuine 404 — browsers still fail to decode that
as image bytes and correctly fire `onError`, so the placeholder renders
correctly in an actual browser regardless; a real static host (e.g. GitHub
Pages) would 404 properly in production anyway.

## v8 — drop the section header, workflow preview visible by default (2026-07-21)

Same-day, immediately after v7. Two fixes, both concrete: (1) the "Four
featured proofs" / "Click a project to expand: Goal · Method · Result ·
Decision · Limitation" section header (added in v7 alongside the collapse
feature) read like a report chapter title — removed entirely, projects now
start directly after the method line with no announcing heading. (2) Real
structural gap: `ProjectCard.tsx`'s collapsed state showed *only*
number/title/tagline/tags/button — the workflow stage list (the actual
"what does this system do" proof) was hidden behind the same "View details"
toggle as the Goal/Method/Result prose. Fixed by splitting what the toggle
gates: the `stages-wrap` block (workflow title + stage list + click-a-stage
media panel) now renders unconditionally in `.p-content`; only the
`dl.gmr` (Goal/Method/Result/Decision/Limitation) and the "Where this
applies" transfer accordion stay behind `{expanded && ...}`. Also removed
the now-unused `featuredSectionNo`/`featuredHeading`/`featuredSub` fields
from `types.ts` and `page-content.json`, and renumbered the remaining
sections 01–07 (architecture through principles) since the featured
section no longer claims a number.

**Verified again:** company-name grep zero; "Four featured proofs" and
"Click a project to expand" confirmed absent from the bundle; all stage
titles ("Manual trigger," "Load listings," etc.) and each project's
`stagesLabel` confirmed present — proving the workflow preview text ships
regardless of expand state. `npm run build` — zero TypeScript errors.

## v9 — production-signal framing, verify-before-rename discipline (2026-07-21)

Same-day, immediately after v8. The pasted reference this time argued
portfolios should show "production signals" (failure handling, structured
data, deployment evidence) rather than generic demos — reasonable advice,
implemented as new **optional** `Project` fields: `whatItProvesHtml` /
`productionSignalHtml`, shown in the collapsed card ahead of the "View
details" button, alongside (not replacing) `taglineHtml`.

**Two renames proposed, one applied, one explicitly held back — this is the
important part of this pass:**
- **Applied:** `investment-research-system`'s title → "Investment Reasoning
  Learning Database" (from "Source-First Research & Skill Database" /
  "Investment Research Learning System" in earlier passes) — pure wording,
  content unchanged, no accuracy risk.
- **Applied, but reframed rather than accepted as-written:**
  `evidence-review-decision-gate` → "Experience Debugging & Mistake
  Learning System". The pasted copy wanted a 4th stage ("Convert lesson
  into rule") and language implying this *specific demo* runs an ongoing
  mistake-accumulation database. Asked the user directly whether that's
  real; they confirmed the underlying claim is true — but grounded in the
  workspace's actual **Debug Memory System** (already documented in
  Supporting Infrastructure: 17 structured fields, problem/lesson/
  what-to-avoid-next-time), not a mechanism inside this specific quality
  gate. `decisionHtml` was rewritten to say exactly that — the bug found
  here "was logged the same way as any debugging session across this
  workspace... not left as a one-off fix" — true and verifiable, instead of
  implying a rule-database UI that doesn't exist in this demo.
- **Held back, not applied:** renaming `moss-content-factory` to "MCP Data
  Visualization Pipeline" and adding MCP tags/stage-labels. No evidence in
  this codebase that the Moss content pipeline (source → angle → Figma) uses
  MCP (Model Context Protocol) anywhere. Asked the user directly; they said
  they'd explain how it's used but hadn't yet by the time this pass shipped
  — so the name stays "Social Media Content Pipeline" and no MCP claim was
  added anywhere. **Do not add MCP branding to this project without that
  explanation actually being given and verified first.**

**Other changes:** `ProjectCard` articles now have `id={project.id}` +
`scrollMarginTop`; `ProofSummary` items are now real `<a href="#...">`
links that scroll to their full project section. Top nav simplified from
the old abstract labels (Operating Model / Fit / Capabilities / Projects /
Lab / Principles) to Systems / Workflow / Archive / Visual Portfolio↗ (the
last one external, opens the verified portfolio link). Selected-stage
visual state strengthened (filled accent background band + filled marker
circle, not just a color change on the title).

**Verified again:** company-name grep zero; grepped specifically for "MCP"
across the bundle and both JSON files — zero matches, confirming the
held-back claim didn't leak in anywhere. Both renamed titles present;
"What it proves"/"Production signal" labels present; new nav labels
present. `npm run build` — zero TypeScript errors.

## v10 — keyword rhythm, auto-expand-on-click; Plasma + MCP still blocked (2026-07-21)

Same-day, immediately after v9. The user proposed adding a "Plasma"
animated WebGL background (a named React Bits component using the `ogl`
library) as a subtle hero atmosphere layer, plus reiterated the still-
unconfirmed MCP rename for Project 03. **Both held back again:**

- **Plasma**: no source code was provided for the actual component (just a
  prop interface and design direction). Reconstructing a WebGL/OGL shader
  component from memory without the real source risks shipping something
  broken or visually wrong — asked the user directly to paste the actual
  `Plasma.jsx`/`Plasma.css` source before installing `ogl` or writing
  anything. Not implemented this pass.
- **MCP**: still no explanation given for how Project 03 actually uses MCP.
  Held back again, same as v9 — "Social Media Content Pipeline" unchanged,
  verified via grep that no "MCP" string leaked in anywhere.

**What was implemented** (the parts that didn't depend on either blocker):
- Replaced the vertical "Core thinking" bullet list in the hero with a
  horizontal Swiss-style keyword row (new `KeywordRhythm.tsx`): Source /
  Criteria / AI assist / Human review / Debug / Reuse. `thinkingHeading`
  removed from `types.ts`/`page-content.json` (no longer rendered);
  `thinkingList` values updated to the new keyword set.
- `ProjectCard` now checks `window.location.hash` on mount and on
  `hashchange` — clicking a `ProofSummary` link now both scrolls to *and*
  auto-expands the target project, not just scrolls (this was explicitly
  requested three times across v8–v10; implemented via URL hash rather
  than lifting expand-state into `App.tsx`, since every `ProjectCard`
  already owns its own `expanded` state independently).

**Verified again:** company-name grep zero; MCP grep zero (still); new
keyword-rhythm words present in bundle; old "Source before AI output"-style
bullet wording confirmed gone. `npm run build` — zero TypeScript errors.

## v11 — removed the language-gap note (2026-07-21)

User asked to cut the "On languages, honestly" note (the Swedish-gap
disclosure) from the Process Automation Fit section entirely — not move it,
cancel it. Removed `noteLabel`/`noteBodyHtml` from `fit` in both
`types.ts` and `page-content.json`, and the corresponding JSX block from
`RoleFit.tsx` (also dropped the now-unused `useReveal` call for it). No
replacement content. Verified gone from the built bundle; company-name grep
still zero; `npm run build` — zero TypeScript errors.

## v12 — front-page reset: cut to Hero / Systems / Archive / Footer (2026-07-21)

User feedback: repeated rounds of "trim this heading, cut that section" (v3–v11)
had produced a site that was still structurally a report, not a front page —
the fix wasn't more wording edits, it was removing whole sections. Explicit
instruction: final structure is only Hero → Systems (featured project cards)
→ Archive (remaining projects + supporting infra) → Footer. Nothing else.

**Removed entirely** (component no longer rendered from `App.tsx`, dead files
deleted outright rather than left as orphaned dead code):
- `ArchitectureDiagram.tsx` ("Operating Model" section)
- `RoleFit.tsx` ("Process Automation Fit" section)
- `JdAreas.tsx` ("Capability areas" filter section)
- `LabNotebook.tsx` ("ComfyUI lab notebook" section)
- `StatsStrip.tsx` (big stats row)
- `FilterBar.tsx` + `useFilter.ts` hook (capability-filter interaction — no
  filter UI left to drive it)
- `MethodLine.tsx` (redundant with the v10 hero keyword rhythm)
- `Principles.tsx` ("The same engineering habits" section)
- `useCountUp.ts` hook (only used by the deleted `StatsStrip`)

Corresponding now-unused JSON blocks (`architecture`, `fit`, `jdAreas`, `lab`,
`principles`, `stats`, `methodLine`) removed from `page-content.json`, and
their types (`ArchCell`/`ArchCellVariant`, `JdArea`, `LabColumn`, `FitRow`,
`Principle`, `Stat`) removed from `types.ts`. This mattered for more than
tidiness: these fields were still being bundled into the shipped JS as part
of the whole-object JSON import even though nothing rendered them, so the
user's own verification checklist (grep the built bundle for "Operating
Model", "Fit", "Capabilities", "Lab", "Principles") would have failed on
dead data alone if left in place.

Nav trimmed to `Systems / Archive / Visual Portfolio ↗` (the `Workflow`
link pointing at the now-gone `#architecture` anchor was already dropped in
an earlier pass). `flagshipHeading` simplified to plain "Archive"; section
numbers renumbered 01/02/03 to match the now-shorter page.

**Project 04 renamed**: "Experience Debugging & Mistake Learning System" →
"Debug Memory & Mistake Learning System". Tagline/tags reworded to match the
latest phrasing request. Deliberately did **not** replace the real 4-stage
workflow (`Structured extraction → Rule-based quality gate → Independent
phrase scan → Decision-gate report`) with the pasted content's fabricated
stage sequence ending in "Convert lesson into rule" — the actual script
doesn't do automated rule-conversion; that capability lives in the separate,
real Debug Memory System (already correctly referenced in this card's
`decisionHtml`). Same verify-before-write discipline as v9.

**Still blocked, unchanged from v9/v10** — asked again, still no answer:
- **MCP**: no explanation ever given for how Project 03 (social media
  pipeline) actually uses MCP. Not renamed to "MCP-to-Figma..."; no MCP tags
  added; verified zero "MCP" occurrences in bundle + source JSON.
- **Plasma**: still no real `Plasma.jsx`/`Plasma.css` source provided. Not
  implemented; `ogl` not installed.

**Verification performed:**
- `npm run build` — zero TypeScript errors (also required deleting the now-
  broken dead component files above, which referenced removed types).
- Grepped built bundle (`dist/assets/*.js`) + both source JSON files for:
  "Operating Model", "Capabilities", "Four featured proofs", "Staria",
  "Arcto", "prepared for", "facing", "MCP" — zero matches on all.
- Grepped "Fit" / "Lab" / "Principles" / "language" with context — all
  remaining hits are unrelated legitimate uses ("fit score" in the job-
  filter project, "Learning lab" tier label, "Core principle" in the video-
  pipeline goal text, "language risk" in job-filter scoring, "Language-Study
  Document Generator" supporting-infra card title) — none are remnants of
  the removed sections.
- `vite preview` on :5191 confirmed serving the rebuilt `dist/` (HTTP 200).

## v13 — cover-page hero with real Plasma; systems moved below the fold (2026-07-21)

The v12 audit correctly diagnosed that the site had never actually gotten a
visual redesign — only content/section deletions. This pass is the real
visual rebuild, plus the first two audit-confirmed bugs actually fixed.

**Plasma, for real this time.** Across v9/v10/v12 I repeatedly held back on
Plasma because no actual component source had ever appeared in the
conversation — only prop examples. This pass, the user pasted the complete
React Bits `Plasma` source (WebGL2 via `ogl`: vertex/fragment shaders,
`Renderer`/`Program`/`Mesh`/`Triangle`, mouse tracking, context-loss
handling, `IntersectionObserver`-gated animation loop). Installed `ogl`,
added `src/components/Plasma.jsx` + `Plasma.css` **verbatim** (not
reconstructed from memory — copied exactly as given), plus a hand-written
`Plasma.d.ts` so the `.tsx` files importing it stay fully typed without
`allowJs` (tsconfig has no `allowJs`, so `.jsx` files aren't type-checked by
`tsc -b` — Vite/esbuild bundles them regardless; the `.d.ts` gives the
import a real type at the call site).

**Verified the effect actually renders**, not just "build passed": used a
headless Puppeteer screenshot. First attempt showed no Plasma — traced to
`Hero.tsx`'s own `prefers-reduced-motion` check correctly detecting that
the *test browser* reports `reduce: true` by default (a real, working
accessibility guard, not a bug). Temporarily hard-coded the check to `false`
for one verification build, confirmed the WebGL plasma field renders
correctly (subtle green-tinted cloud, right side of hero, text fully
readable, off-white base preserved), then reverted immediately to the real
`window.matchMedia` check and rebuilt to identical output hashes.

**Hero rebuilt as an actual cover page**, not a patched version of the old
one: `.hero-cover` is `min-height: calc(100vh - 56px)` with content
vertically centered; `.hero-plasma` sits absolutely positioned on the right
56% of the viewport, `pointer-events: none`, `z-index: 0`, with hero text at
`z-index: 1` so it's never obscured. Added a `View systems ↓` scroll cue
linking to `#systems`. Project cards no longer render inside the hero at
all — `ProofSummary` (renamed conceptually to "systems overview") is now
its own `<section id="systems">` sibling *after* `<Hero>`, with a proper
`01 / Selected systems` section head matching the rest of the page's
numbering convention (Archive and Supporting Infrastructure renumbered to
02/03 accordingly). This means on any real viewport, the four system cards
now start on the *second* screen, after the user scrolls past the cover —
the core structural complaint from this pass.

**Systems cards got real interactive states**, not just a text grid:
`.system-card` now has a visible border, `:hover`/`:focus-visible` states
(pale green background, green bottom rule, accent-colored title, an
"Open case →" indicator that fades in), and an `.is-active` class driven by
a scroll-spy `IntersectionObserver` in `App.tsx` (watches each featured
project's full section, highlights the matching quick card while its
section is in view). **Caveat, stated plainly rather than glossed over:**
I could not get a live visual confirmation of the scroll-spy specifically —
the Puppeteer test browser reports `document.hidden: true`, which is a
known headless-Chrome quirk that suppresses `IntersectionObserver`
callbacks entirely (confirmed by attaching a bare test observer with no
React involved, which also never fired). The implementation is a standard,
correct IO pattern and I'm confident in the code, but I'm flagging that this
one specific behavior needs a real-browser check, not claiming a screenshot
proved it when it didn't.

**Two audit-confirmed bugs fixed:**
- Project 02's `shortTitle` was "Reasoning Learning Database" (dropping
  "Investment") on the front-page quick card even though the full `title`
  had it correctly. Now both match: "Investment Reasoning Learning
  Database."
- Project 04's `shortTitle` contained the literal HTML entity `&amp;`,
  which rendered as visible `&amp;` text on the quick card because
  `ProofSummary` renders `shortTitle` as plain JSX text (no HTML decoding),
  unlike `title` which goes through the `<Html>`/`dangerouslySetInnerHTML`
  path. Fixed by writing the literal `&` character into `shortTitle`
  instead of the entity — correct for a plain-text render target.

**Project 03 renamed** from "Social Media Content Pipeline" to "Social
Media / Data Visualization Pipeline" — explicitly *not* "MCP-to-Figma Data
Visualization Pipeline." MCP usage is still unverified (asked 5 times now
across this whole session); "Data Visualization" is a defensible addition
on its own since the pipeline's real, documented final stage produces
Figma-ready visual output, so it doesn't carry the same unverified-claim
risk MCP does.

**Cleanup that was safe to do now that the visual rebuild touched
everything anyway:** removed the dead `isMatch`/`filterable`/`match`/
`match-pill` wiring from `ProjectCard.tsx` and `SupportingSystems.tsx`
(flagged as dead in the v12 audit, confirmed still unused, deleted rather
than left half-wired); removed the now-fully-unused `domains` field from
`Project`/`MiniCard` in `types.ts` and both JSON files (was only ever read
by the deleted filter feature); deleted ~150 lines of dead CSS for the v12
section removals (`.arch*`, `.map-btn*`, `.filter-bar`, `.lab-*`, `.fit-*`,
`.principles`/`.p-grid2`/`.p-item*`, old `.hero-cols`/`.lede`/`.jd-echo`,
`.stats`/`.stat`, `.method-line`, `.core-thinking`/`.hero-thinking`,
`.meta-row` (now fully unused after the earlier same-session removal of the
hero's duplicate portfolio-link row)). Built CSS dropped from 18.9 KB to
12.3 KB.

**Nav portfolio link made visually prominent** (bold, accent green,
underline-on-hover) since it's now the *only* home for that link — the
duplicate hero row was removed in the immediately preceding same-session
turn at the user's own direct instruction ("cancel it, keep it empty
space... also no the line"). I did not restore a second copy of the link
inside the hero cover despite this pass's pasted spec asking for one; I
flagged the conflict to the user directly rather than silently picking a
side.

Verified: `npm run build` — zero TypeScript errors (109 modules now, up
from 43, confirming `ogl`/`Plasma` are actually bundled). Grepped source +
built bundle for both required-present terms (`Plasma`, `ogl`,
`hero-cover`, `systems-overview`, `system-card` — all found) and
required-absent terms (Core thinking / Operating Model / Capabilities /
Four featured proofs / Staria / Arcto / prepared for / facing — all zero;
the two substring hits on "Reasoning Learning Database" and "Debug Memory
&amp;" were verified as false positives from an overly broad grep pattern —
actual context is the *correct* full strings, not the buggy ones).

## v14 — content parity pass: renames, a new Failure-handled field, dedup (2026-07-21)

Two of the five issues the user reported this pass (`Investment` missing from
Project 02's quick card, the visible `&amp;` on Project 04's quick card)
turned out to already be fixed from v13 — the user was looking at a stale
cached page again (same root cause as the "nothing changed" report earlier
in v13). Verified against source before doing anything, confirmed both were
already correct, and told the user plainly rather than silently re-doing
already-done work.

The other three were real and applied:

- **Project 03 renamed** "Social Media / Data Visualization Pipeline" →
  "Source-to-Figma Data Visualization Pipeline" — more accurately names the
  real value chain (source → angle → structured content → Figma-ready
  output) without claiming MCP, which is still unverified (asked 6 times
  now across the whole session).
- **Project 04 renamed** "Debug Memory & Mistake Learning System" → "AI
  Mistake Review & Debug Memory System" — more accurately foregrounds what
  the workflow actually does (review/quality-gate AI output) before the
  Debug Memory connection.
- **Archive/Project 04 name collision fixed**: the Archive's "Debug Memory
  System" mini-card was easy to confuse with Project 04 now that Project 04
  also has "Debug Memory" in its title. Renamed the Archive card to "Debug
  Memory Infrastructure" and added one clarifying clause to its body ("the
  underlying note format Project 04 draws on") rather than dropping the
  real, previously-verified specifics (17 structured fields, FastAPI
  bridge, dry-run default) in favor of vaguer suggested copy — kept the
  concrete facts, fixed the naming collision.

**New optional field**: added `failureHandledHtml` to the `Project` type,
rendered as a new "Failure handled" `<dt>/<dd>` row (conditional, between
"Build evidence" and "Decision") in `ProjectCard.tsx`. Also renamed the
existing "Method" and "Result" labels to "Logic" and "Build evidence"
site-wide (all 7 projects share the component, so this is a uniform
terminology change, not per-project).

**Full detail-copy rewrite for all 4 featured projects** (Goal / Logic /
Build evidence / Failure handled / Decision / Limitation bullets, plus
`taglineHtml`/`whatItProvesHtml`/`productionSignalHtml` and all 4 workflow
stage titles/bodies) to the user's latest wording. Checked every new bullet
against facts already established earlier in this session before writing
it — none introduced a new unverified claim; all are rewordings/
restructurings of already-verified content (real n8n execution counts, real
evidence-tiering skills, real Figma layer schema, real rejected/passed test
notes and the real scanner bug). Some previously-included concrete
specifics (e.g. Project 02's `thinking_distillation`/`skill_evolver` skill
names, Project 01's inline PASS_FOR_REVIEW/WATCH_LANGUAGE_RISK counts in the
"Build evidence" bullets) were dropped from those particular bullet lists
per the user's simplified wording — but remain visible elsewhere on the
same card (`keyLabel`, `productionSignalHtml`), so nothing became
unverifiable, just less repeated.

Verified: `npm run build` — zero TypeScript errors. Grepped built bundle:
old project names ("Social Media Content Pipeline", "Social Media
Pipeline") — zero matches; "Investment Reasoning Learning Database" and "AI
Mistake Review & Debug Memory System" — present and correct, no `&amp;`
leak on the plain-text-rendered `shortTitle` fields (the one remaining
`&amp;` occurrence is `title`'s correct HTML-encoded form for its
`dangerouslySetInnerHTML` render path); "Debug Memory System" as a
standalone duplicate title — zero real matches, the two substring hits are
both just the tail of "...Debug Memory System" inside the longer Project 04
title/shortTitle, and the Archive card is now distinctly "Debug Memory
Infrastructure". Screenshot-confirmed all 4 quick-card titles render
correctly in the browser.

## v15 — hero alignment bug, auto-collapse on scroll-out, Project 04 tone (2026-07-21)

Three things this pass: one real layout bug found via a screenshot the user
sent, one genuinely new interaction feature, and one more content-mixing
report that turned out to be the same stale-cache pattern as before (third
time this session) mixed with a real wording improvement.

**Hero misalignment bug, root-caused and fixed.** User's screenshot on a
wide monitor showed "Erin Wong" sitting far to the left of the nav bar's
content above it, with a huge gap on the right. Root cause:
`.hero-cover{display:grid}` had no `grid-template-columns`, so its implicit
column sized to content instead of the container width — `.hero-content`'s
`max-width:1200px;margin:0 auto` centering had no extra space to distribute
because the grid cell itself was already shrink-wrapped. First fix attempt
(`grid-template-columns:1fr`) didn't resolve it either — confirmed via
`getBoundingClientRect()` that width was still stuck at the content's
intrinsic size even after switching the container to `display:flex`. Root
cause was `align-items` stretch not being sufficient on its own; the
reliable fix was giving `.hero-content` an explicit `width:100%` (not
relying on stretch/grid-auto-margin semantics at all) alongside
`max-width:1200px;margin:0 auto`. Verified via `getBoundingClientRect()`
before/after: hero content's left edge now matches nav-inner's left edge
exactly (both compute to the same `x` at a 2000px viewport), confirmed with
a screenshot. Restructured `Hero.tsx` in the process: `.hero-content` is now
the 1200px-centered positioning column (mirrors `.nav-inner`/`.wrap`
exactly), with a new inner `.hero-text` div holding the actual
640px-max-width readable copy.

**New feature: cards auto-collapse when scrolled out of view.** User asked
for project detail panels to "zip back" once scrolled away, not stay
permanently expanded. Added a second `IntersectionObserver` in
`ProjectCard.tsx` (separate from `useReveal`'s one-shot fade-in observer,
and from `App.tsx`'s scroll-spy observer) that only runs while
`expanded===true`, and collapses the card once it transitions from visible
to not-visible. Guarded with a `hasBeenVisible` flag so the observer's
mandatory first-fire callback (which can report `isIntersecting:false`
before an anchor-triggered scroll has actually arrived) doesn't immediately
re-collapse a card someone just clicked open from the systems-overview
quick cards. Required merging two refs onto the same `<article>` element
(`useReveal`'s ref plus a new local `articleRef`) via a callback ref, since
a DOM node can only take one `ref` prop directly.

**Project 04 content refinement, not a fix.** User reported Project 04 still
contained investment-specific language ("missing valuation context," "weak
comparability," "buy/sell recommendation") — checked source first, found
this wording had already been removed in v14; the user was looking at a
stale cached page for the third time this session. Independent of that,
their newly-proposed title and copy were a real improvement, applied
regardless: "AI Mistake Review & Debug Memory System" → "AI Output Review &
Debug Memory System" (drops the mildly negative "Mistake" framing), plus a
full rewrite of the quick-card copy and all 4 workflow stage
titles/bodies to match ("Structured extraction" → "Evidence and consistency
check" → "Independent phrase scan" → "Debug memory update"). Also tweaked
Project 02's stage-3 body wording per the user's suggestion ("not final
calls, not automatic answers").

**Verified:** `npm run build` — zero TypeScript errors (the merged-ref
pattern for the auto-collapse observer type-checks cleanly under `strict`).
Grepped built bundle: old Project 04 wording ("missing valuation context",
"weak comparability", "buy/sell recommendation", "AI Mistake Review", "never
profit") — zero matches; new wording ("AI Output Review", "Debug memory
update", "Evidence and consistency check") — present and correct.
Screenshot-confirmed hero alignment fix and Plasma rendering together
correctly post-fix (using the same temporary-override-then-revert
verification method as v13, since this test browser still reports
`prefers-reduced-motion:reduce` by default).

**Still unresolved, told to the user rather than guessed at:** the user's
own browser reports no Plasma visible at all, unlike this session's test
browser where it renders correctly once `prefers-reduced-motion` is
bypassed. Asked the user to check Windows' Animation effects accessibility
setting (the most likely cause based on how the component is built) — no
confirmation back yet either way. Do not silently remove the
`prefers-reduced-motion` guard without the user explicitly choosing that
option; they were offered it and didn't take it.

## v16 — copy trim pass: cut sales language, not add more (2026-07-21)

User read the full text dump section by section and gave a clear, scoped
verdict: structure is right, but "Where this applies" / Archive / Supporting
infrastructure read as self-explanatory sales copy instead of proof. The
instruction was explicitly to cut, not rewrite — kept to that.

**Type/component change to support it:** `transferHeading`/`transferItems`
on `Project` are now optional, and `transferItems` changed from
`{label, body}[]` to a plain `string[]` (removed the now-unused `LabelBody`
type). `ProjectCard.tsx`'s transfer `<details>` block only renders when both
fields are present. This is what let the 3 archive projects (05–07) drop
the section entirely rather than getting an empty one.

**Featured projects (01–04):** each "Where this applies" (3 label+body
items) replaced with a 2-item plain-bullet "Transfer" block. Quick-card
`taglineHtml` and `keyLabel` shortened per the user's exact wording. Project
03's key stat changed from "Pipeline scripts" to "logged pipeline records"
(the user's own call — softer, less inflatable-sounding claim for the same
188 figure). Removed the one clearly misplaced line: Project 03's transfer
item mentioned "the banned-phrase scan" — that's Project 04's mechanism,
not Project 03's; user caught it, it's gone.

**Archive projects (05–07):** condensed from paragraph-style Goal/Logic/
Build evidence plus a 3-item transfer accordion, down to just three short
sentences and a Transfer-free workflow list. Stage bodies shortened
across all 12 remaining archive stages.

**Supporting infrastructure:** cut from 5 mini-cards to 3. Removed "Remote
Dispatch Hub" and "Language-Study Document Generator" entirely from the
public page — user's reasoning: personal/hacker-flavored infrastructure
that doesn't support a job-search-facing showcase's story. Kept "Debug
Memory Infrastructure" but dropped the 17-structured-fields/FastAPI-bridge
specifics the user had deliberately kept in v14 — this time it's an
explicit, deliberate simplification the user wrote themselves, not a
factual-accuracy issue, so no pushback needed.

**Hero subtitle** changed "visual documentation" → "data visualization"
(more accurate to what Project 03 actually demonstrates). **Archive section**
gained a `flagshipSub` subtitle ("Additional systems, kept compact.") — a
field that existed pre-v12, was removed as orphaned dead data during the
v12 cleanup, and is now back because it's actually wanted again; not a
regression. **Footer** reworded ("live databases" → "project logs,
databases and local files" — less inflated-sounding for the same claim).

**Verified:** `npm run build` — zero TypeScript errors. Grepped built
bundle: removed phrases ("Where this applies", "Remote Dispatch Hub",
"Language-Study Document Generator", "Compliance-style QA", "No-code-ready",
"rots unread in a silo") — zero matches; new copy ("Additional systems,
kept compact", "data visualization", "logged pipeline records", "figures
taken from project logs") — present. Live-DOM checks via Puppeteer (not
just grep): Project 01's Transfer block renders with exactly 2 bullets;
Project 05 (archive) renders Goal/Logic/Build evidence with **no** Transfer
block at all, confirming the conditional rendering actually works, not just
that the JSON looks right. Regenerated `SITE_TEXT_DUMP_2026-07-21.md` to
match for the user's continued review.

**Tooling note, not a site bug:** Puppeteer screenshots repeatedly crashed
the test browser to `about:blank` mid-session when combined with the
Hero's active Plasma WebGL context + scrolling — this happened identically
during the v15 scroll-spy check too. Worked around it by verifying through
`document.querySelector`/`getBoundingClientRect` DOM checks instead of
fighting for a screenshot; this is a test-tooling instability in this
sandboxed headless Chrome, not a symptom of anything wrong with Plasma or
the page itself.

## Not built / explicitly out of scope

- No backend, no database, no external API calls.
- No multi-target routing system (e.g. one config picker for "version A" vs.
  "version B") — the user explicitly chose a single target-neutral site over
  this. To make a version for a different application: copy
  `src/data/*.json`, edit the content, done — no component changes needed.
- No visual/CSS redesign in the v2 pass — the existing grid/typography/color
  already matched the "Swiss, sparse, no shadows" direction the user wanted.

## Related

- `D:\ai-test\reports\AI_PROJECTS_SHOWCASE_2026-07.html` — the original this
  was ported from; keep as the reference for verifying wording/numbers.
- `E:\AI_editing\auto-typesetting-cover-tool\` — the sibling React+Vite
  project this one's tooling conventions were copied from.
- `D:\ai-test\AI_HANDOFF_INDEX.md` §1 — workspace-level system inventory
  (this project is registered there).
