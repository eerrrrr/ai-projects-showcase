# Full content + structure export — for visual redesign

Everything below is a plain-text export of the site's actual content and
data structure, as of commit `794d80a`. Nothing here is new copy — it's a
reading of `src/data/page-content.json`, `src/data/projects.json`, and the
component structure that renders them. Use this as the source of truth
while redesigning the interface; the goal is new visuals around the same
words and logic, not new words.

---

## 1. How content is structured (the "logic" layer)

- **Two JSON files drive the whole site**: `page-content.json` (site-level
  copy: nav, hero, section headings, footer) and `projects.json` (the 7
  project cards). No copy lives hardcoded in components — a redesign can
  swap every component without touching these files, or restructure these
  files without touching component logic, independently.
- **Every project has a `tier`**: `1` = "Featured proof" (4 projects, full
  detail), `2` = "Supporting system" (1 project), `3` = "Learning lab" (2
  projects).
- **`hasWalkthrough` split**: a project gets the interactive animated
  "Play workflow" walkthrough (left column: title/value line/mini-roadmap/
  chips/Play button; right column: clickable step list with autoplay) only
  if it has `valueLine` + `miniRoadmap` + `proofChips` all three set. All 7
  projects currently qualify. Projects without those three fields would
  fall back to a simpler static Goal/Method/Result layout — that fallback
  path exists in code but isn't currently used by any project.
- **Every workflow stage has an `actor`**: `sys` (script/automation),
  `ai` (AI-assisted step), `human` (human decision gate), `out` (final
  output). This actor typing is a real content signal — it's how the site
  visually distinguishes "the machine did this" from "a human had to
  decide here," which is a recurring theme across every project (see the
  "human review" repeated as a decision point in the Decision/Limitation
  fields of every Tier-1 project).
- **Two content depths per Tier-1 project**: a short "compact" layer
  (`problemHtml`/`workflowHtml`/`resultShortHtml`, shown by default) and a
  longer layer (`goalHtml`/`methodHtml`/`resultHtml`/`failureHandledHtml`/
  `decisionHtml`/`limitationHtml`, revealed behind "Read case notes").
- **Every Tier-1 project ends on the same rhetorical shape**: Goal →
  Method → Result → what could have gone wrong and was caught
  (`failureHandledHtml`) → what was deliberately NOT automated
  (`decisionHtml`) → an honest scope boundary (`limitationHtml`). This
  structure itself is a piece of content worth preserving — it's the
  throughline across all 4 featured projects: build something, then show
  the failure mode it catches, then say plainly what it doesn't do yet.

---

## 2. Site-level content (`page-content.json`)

**Nav**
- Identity: "Erin — AI workflow systems"
- Links: Systems (in-page), LinkedIn, GitHub, Visual Portfolio (all external)

**Hero**
- Name: Erin Wong
- Tagline: "AI Workflow Systems"
- Focus line: "Process thinking · data visualization · human-reviewed AI workflows"
- Rotating/rhythm keywords: Source, Criteria, AI assist, Human review, Debug, Reuse

**Selected systems section (section 01)**
- Heading: "Selected systems"
- Statement: "Exploring how human judgment and AI capabilities can shape
  better ways of researching, deciding, creating, and learning."

**Supporting infrastructure section (section 02)**
- Heading: "Supporting infrastructure"
- Sub: "The systems the projects above stand on"
- 3 cards:
  1. **Debug Memory Infrastructure** (Knowledge capture) — "Structured
     note format for recording bugs, lessons and what to avoid next time.
     Dry-run by default; nothing writes without confirmation."
  2. **Auto-Typesetting Cover Tool** (Layout engine) — "React + Vite tool
     that turns raw text into poster / cover layouts and exports PNG, SVG
     and JSON."
  3. **Finance-style Exception Review** (Process transfer demo) — "Mock
     invoice / PO / payment dataset testing source → classify →
     human-review logic. 8 mock invoices, 6 exception types, 0
     auto-resolved."

**Footer**
- Left: "Erin · figures taken from project logs, databases and local
  files · 2026-07-20"
- Right: "Code walkthroughs & live demos available on request"

---

## 3. Project 01 — Job Screening Validation Workflow

**Tier**: 1, Featured proof

**Title**: Job Screening Validation Workflow
**Tagline**: Validation gate for OpenClaw-style task records. OpenClaw was
the early experiment; n8n is the verified rebuild.

**Value line** (walkthrough card): OpenClaw-style intake → n8n validation
→ Notion-safe review handoff.

**Mini roadmap**: Intake → Normalize + validate → Review state → Notion handoff

**Proof chips**: n8n · OpenClaw-style input · Claude Code · Notion API · Safe failure

**Tags**: n8n, OpenClaw, Notion, Human-in-the-loop

**Key stat**: 6 — "task records processed · 3 review states · 1 write
attempt, failed safely"

**Compact layer**
- Problem: Task records from an OpenClaw-style router (or manual entry)
  arrive in inconsistent shapes — tags as strings instead of arrays,
  non-ISO dates, oversized text, missing fields — any of which can
  silently break a Notion write or make it look like it succeeded when it
  didn't.
- Workflow: I built a real n8n workflow that normalizes incoming records,
  validates required fields and safety rules, maps them into a
  schema-safe Notion payload, and routes each one to a review state
  (READY / NEEDS_REVIEW / BLOCKED) before any write is attempted. A
  Manual Trigger runs six repeatable test records; a Webhook input is
  built for a real sender but not yet published or authenticated.
- Result (short): A live Notion write was attempted and failed safely —
  the integration didn't yet have permission on the target database — so
  no fake success was reported; every record's outcome stays visible.
- What it proves: I can build a validation gate that keeps AI/router
  output honest before it reaches a shared system, and report a failed
  write honestly instead of hiding it.
- Production signal: Real n8n execution · 6 records normalized and
  validated · schema-safe Notion payload built · live write attempt
  failed safely, not silently

**Full layer (behind "Read case notes")**
- Goal:
  - Check AI/router output before it reaches Notion.
  - Normalize inconsistent field shapes (tags, dates, text length) before
    anything is judged.
  - Separate records into READY, NEEDS_REVIEW and BLOCKED instead of
    writing everything the same way.
  - Keep a human-readable report of what happened, including failures.
  - Never report a successful write that didn't actually happen.
- Method:
  - Start from OpenClaw-style task records — a manual test set, plus a
    Webhook input built for a real sender.
  - Normalize field shapes first: tags, dates, long text, unknown fields.
  - Validate required fields and safety rules before mapping anything
    toward Notion.
  - Map into the exact Notion payload shape, then assign a review state.
  - Attempt the write only for approved records; report success and
    failure honestly.
- Result:
  - Explored the first job-screening logic in OpenClaw.
  - Rebuilt it as a verified n8n workflow with normalization, validation
    and Notion payload mapping.
  - Ran the workflow on 6 controlled records: 1 READY, 3 NEEDS_REVIEW, 2
    BLOCKED.
  - Attempted a live Notion write; it failed safely on a permission
    error, and that failure stayed visible instead of being hidden.
  - Kept every record's outcome — including the failed write — visible
    in the report.
- Failure handled:
  - OpenClaw is shown as early exploration, not a finished product.
  - Malformed fields (string tags, non-ISO dates, oversized text) are
    normalized instead of breaking the write.
  - The one live Notion write attempt failed on a permission error — the
    workflow reported that failure rather than a fake success.
  - Nothing is silently dropped from the report.
- Decision (what was deliberately not automated):
  - AI/router output is validated and normalized, but not trusted
    blindly.
  - NEEDS_REVIEW and BLOCKED records are not written without a human
    decision.
  - A failed write is reported as a failure, never disguised as success.
  - The report supports judgment; it does not replace it.
- Limitation:
  - Uses controlled test records, not a live sender yet.
  - The Webhook input is built but not authenticated or published.
  - The one live Notion write attempt failed on a permission error —
    production use still needs that access granted, plus retry, dedupe
    and an independent error workflow.
  - Human review is still required before any write.

**Workflow — 6 stages** ("Workflow — validate before Notion write, human decides")
1. **[Script] Intake trigger** — A Manual Trigger runs six repeatable
   test records; a Webhook input is built for a real sender but not yet
   published or authenticated. *(mini: Manual test fixtures · Webhook
   built, not published · No auto-run in background)*
2. **[Script] Normalize record** — Incoming records are unwrapped,
   checked against an allowed-field list, and cleaned into one consistent
   shape before anything is judged. *(mini: Tags string → array · Unknown
   fields removed · Correlation ID assigned)*
3. **[Script] Validate safety rules** — Required fields, intent, dates,
   long text and oversized URLs are checked before anything is mapped
   toward Notion. *(mini: Required fields checked · Date / URL / text
   fallback · Missing data flagged)*
4. **[Script] Map Notion payload** — Validated records are mapped into
   the exact property shape Notion's API requires — before any write is
   attempted. *(mini: Schema-safe mapping · Payload preview built · No
   write yet)*
5. **[Human] Route review state** — Each record becomes READY,
   NEEDS_REVIEW or BLOCKED — only READY records are eligible for a write;
   the rest wait for a human decision. *(mini: READY · NEEDS_REVIEW ·
   BLOCKED)*
6. **[Output] Review report / write outcome** — The workflow generates a
   human-readable report; a real write attempt is reported honestly,
   including when it fails. *(mini: Markdown report · Real write
   attempted · Failure reported, not hidden)*

**Recap**: Task record → normalize → validate → Notion payload → review
state → report / write outcome
**Takeaway**: "Check first. Normalize before judging. Report failure honestly."

**Transfer**: Normalizes inconsistent field shapes before validation. /
Reports a failed write honestly instead of a fake success.

---

## 4. Project 02 — Investment Reasoning Learning Database

**Tier**: 1, Featured proof

**Title**: Investment Reasoning Learning Database
**Tagline**: Source-first database for learning investment reasoning
through evidence, risk and invalidation.

**Value line**: Learn reasoning structure, not final opinions.
**Mini roadmap**: Sources → Evidence → Reasoning → Skill review
**Proof chips**: Source-first · Risk logic · Human-gated
**Tags**: Investment learning, Source-first, Reasoning structure, Skill database
**Key stat**: ~515,000 — "traceable facts · 113 sources · 13 written research skills"

**Compact layer**
- Problem: Expert investment write-ups mix facts, assumptions and
  conclusions together, making it hard to learn the reasoning behind
  them.
- Workflow: I built a source-first database that separates evidence from
  interpretation, then extracts the gates, assumptions, risks and
  invalidation logic behind each case.
- Result (short): This is not a stock-picking system — it turns learning
  into reviewable criteria, with human judgment owning the final call.
- What it proves: I can learn expert reasoning structure instead of
  copying final opinions.
- Production signal: Source-first database · evidence gates ·
  assumptions / risks / invalidation extracted · reusable skill logic

**Full layer**
- Goal:
  - Learn how investment reasoning works, not only what conclusion
    someone reaches.
  - Break expert examples into evidence, assumptions, gates, risks and
    invalidation.
  - Convert repeated reasoning patterns into reusable review logic.
  - Avoid copying expert opinions as automatic answers.
  - Build a source-first learning database.
- Method:
  - Start from source material: filings, articles, interviews, notes and
    discussions.
  - Separate facts from interpretation and hypothesis.
  - Extract the decision structure behind the reasoning.
  - Identify review gates: evidence quality, risk, valuation, data gaps
    and invalidation.
  - Human review decides whether a pattern becomes reusable knowledge.
- Result:
  - Built a large source-first research and learning database.
  - Structured professional reasoning into reusable learning material.
  - Created review gates for evidence, assumptions, risk and
    invalidation.
  - Used flagged mistakes as candidates for future skill patches.
  - Kept Notion as a view layer, not the source of truth.
- Failure handled:
  - Prevents copying someone else's conclusion without understanding the
    logic.
  - Prevents expert confidence from becoming automatic action.
  - Flags missing data, weak comparison and overconfident conclusions.
  - Keeps human review before any rule is promoted.
- Decision:
  - This is not a stock-picking system.
  - It does not give investment recommendations.
  - It extracts professional reasoning structure.
  - It turns learning into review criteria.
  - Human judgment owns the final interpretation.
- Limitation:
  - Investment logic may not transfer automatically to other domains.
  - Source quality still needs human judgment.
  - A large database does not equal correctness.
  - The skill-evolution loop still needs human review.

**Workflow — 4 stages** ("Workflow — extract reasoning, not answers")
1. **[Script] Source inbox** — Collect source material before extracting
   lessons or patterns. *(mini: Filings, articles, interviews · Notes and
   discussions · Source material first)*
2. **[Script] Evidence tiering** — Separate evidence from interpretation,
   opinion and missing information. *(mini: Separate evidence from
   opinion · Flag missing information · Evidence-tier grading)*
3. **[AI] Reasoning extraction** — Extract gates, assumptions, risks and
   invalidation logic, not final calls. *(mini: Extract gates and
   assumptions · Extract risks and invalidation logic · Not final calls
   or answers)*
4. **[Output] Skill card review** — Human review decides whether a
   repeated pattern becomes reusable skill logic. *(mini: Human reviews
   the pattern · Decides if it becomes a skill · Reusable, not automatic)*

**Recap**: Source → evidence → reasoning pattern → human-reviewed skill logic
**Takeaway**: "Learn reasoning structure, not final opinions."

**Transfer**: Distils expert process without copying final opinions. /
Turns repeated reasoning patterns into reviewed skill logic.

---

## 5. Project 03 — Source-to-Figma Data Visualization Pipeline

**Tier**: 1, Featured proof

**Title**: Source-to-Figma Data Visualization Pipeline
**Tagline**: Collected sources → clear angle → structured content →
Figma-ready visual output.

**Value line**: Turn reviewed sources into visual communication.
**Mini roadmap**: Sources → Angle → Content blocks → Figma output
**Proof chips**: Source-backed · Figma output · Human approval
**Tags**: Source collection, Data visualization, Figma handoff, Human-in-the-loop
**Key stat**: 188 — "logged pipeline records · 50-topic batch runs · 2.5 months of operation"

**Compact layer**
- Problem: Research, drafting and visual layout are usually disconnected,
  so content work has to be redone by hand each time.
- Workflow: I built a pipeline that collects sources, finds the angle,
  structures the evidence into content blocks, then hands off structured
  content directly into Figma.
- Result (short): 188 logged pipeline runs later, human review still
  gates every piece before it's approved or posted.
- What it proves: I can connect source collection, analysis and visual
  communication.
- Production signal: Source material → angle finding → structured
  content blocks → Figma-ready output · human approval before publish

**Full layer**
- Goal:
  - Turn collected sources into readable visual communication.
  - Connect research, analysis, content structure and visual output.
  - Avoid AI-invented facts.
  - Make repeated content work easier to review and maintain.
  - Create Figma-ready material from source-backed content.
- Method:
  - Start from source material, not blank prompting.
  - Find the angle before drafting.
  - Structure evidence into content blocks.
  - Use AI to organise and draft, not to invent.
  - Use Figma as the visual handoff layer.
- Result:
  - Built a repeated content workflow from source collection to visual
    output: 188 pipeline scripts.
  - Connected notes, references, angle finding, AI drafting and design
    handoff.
  - Prepared content for Figma-ready visual structure.
  - Kept human review before publication.
- Failure handled:
  - Source comes before caption.
  - Weak evidence blocks strong visual claims.
  - Visual polish cannot hide missing sources.
  - Human review checks meaning, fact, caption and publication.
- Decision:
  - AI helps structure and draft.
  - Human approves the final meaning.
  - Figma is the output layer, not the source of truth.
  - The workflow supports communication; it does not replace editorial
    responsibility.
- Limitation:
  - Some source evaluation remains manual.
  - Visual quality still depends on design judgment.
  - The system supports content production, not fully automated
    publishing.
  - More real screenshots should be added as proof captures.

**Workflow — 4 stages** ("Workflow — source to angle to visual output")
1. **[Script] Source collection** — Collect notes, images and references
   from reviewed sources. *(mini: Notes, images, references · Reviewed
   sources only · No invented facts)*
2. **[AI] Angle finding** — Identify the main point before generating
   content or layout. *(mini: Find the angle first · Before content or
   layout · AI drafts, doesn't invent)*
3. **[Human] Content structure** — Turn evidence into captions, content
   blocks and visual text. *(mini: Evidence into captions · Structured
   content blocks · Human review gate)*
4. **[Output] Figma-ready output** — Prepare structured content for
   Figma layout and final human review. *(mini: Figma-ready layout ·
   Final human review · Approved before publish)*

**Recap**: Source → angle → content blocks → Figma output → human review
**Takeaway**: "Source evidence becomes visual communication."

**Transfer**: Turns reviewed source material into visual output without
losing evidence. / Connects database content to Figma-ready
communication materials.

---

## 6. Project 04 — AI Output Review & Debug Memory System

**Tier**: 1, Featured proof

**Title**: AI Output Review & Debug Memory System
**Tagline**: Checks AI output, captures mistakes and turns recurring
issues into reusable review rules.

**Value line**: Check AI output before reuse.
**Mini roadmap**: AI output → Evidence check → Risk scan → Debug memory
**Proof chips**: 2 safety layers · Bug fixed · Reusable checks
**Tags**: AI review, Debugging, Mistake log, Quality gate, Reusable rules
**Key stat**: 2 — "independent safety layers · 1 real bug found and fixed"

**Compact layer**
- Problem: Confident-sounding AI output can hide missing evidence or
  overstated claims.
- Workflow: I built a two-layer check — a rule-based gate plus an
  independent phrase scan — that reviews AI output before it's trusted,
  and logs what it finds.
- Result (short): An unsafe note was rejected, a clean one passed, and a
  real scanner bug was found, fixed and logged as a reusable lesson.
- What it proves: I can test AI output before trusting it, and turn bugs
  or unclear answers into reusable workflow improvements.
- Production signal: Unsafe output rejected · clean output passed ·
  scanner bug found and fixed · mistake logged for future reuse

**Full layer**
- Goal:
  - Stop AI output from being trusted too quickly.
  - Separate facts, assumptions, missing information and unsupported
    claims.
  - Catch overconfident or action-biased wording.
  - Record bugs and unclear outputs as reusable learning.
  - Improve future workflows through reviewed experience.
- Method:
  - Start from rough AI output, workflow notes, bugs or unclear answers.
  - Extract the claim structure before judging the answer.
  - Check whether claims are supported by source material.
  - Run a second scan for risky wording or overclaiming.
  - Save the lesson into debug memory for future review.
- Result:
  - Built an AI output review / decision-gate workflow.
  - Unsafe output was rejected.
  - Clean output passed.
  - A real scanner bug was found and fixed.
  - The bug was recorded as a reusable system lesson.
- Failure handled:
  - Prevents confident AI output from becoming trusted output.
  - Flags missing evidence and unsupported claims.
  - Catches action-biased wording before reuse.
  - Keeps human interpretation separate from AI classification.
  - Treats bugs as material for system improvement.
- Decision:
  - AI can classify, extract and flag risk.
  - AI does not decide what the evidence means.
  - Human review owns interpretation.
  - Bugs are not hidden; they become rule candidates.
  - The system learns through reviewed experience, not automatic
    self-modification.
- Limitation:
  - This is a human-reviewed learning loop, not a fully autonomous
    self-learning agent.
  - Rule-based checks can miss differently worded unsafe claims.
  - Human review is still required.
  - More real cases and proof captures should be added over time.

**Workflow — 4 stages** ("Workflow — check AI output, then log the lesson")
1. **[Script] Structured extraction** — Split rough AI output into facts,
   assumptions, missing information and claims. *(mini: Facts vs
   assumptions · Missing information flagged · Claims separated out)*
2. **[Script] Evidence and consistency check** — Check source support,
   missing information and overstated certainty. *(mini: Check source
   support · Flag missing information · Catch overstated certainty)*
3. **[Script] Independent phrase scan** — Run a second check to catch
   unsafe wording, action bias or unsupported conclusions. *(mini:
   Second, independent check · Catch unsafe wording · Catch action bias)*
4. **[Output] Debug memory update** — Record the bug, lesson and what to
   avoid next time so the mistake becomes reusable. *(mini: Log the bug
   and lesson · Record what to avoid · Becomes a future check)*

**Recap**: AI output → evidence check → risk scan → debug memory →
reusable rule
**Takeaway**: "Mistakes become reusable review rules."

**Transfer**: Separates verified information from AI interpretation
before reuse. / Uses two checks so one weak gate does not decide alone.

---

## 7. Project 05 — Method of Loci — automated document-ingestion pipeline

**Tier**: 2, Supporting system

**Title**: Method of Loci — automated document-ingestion pipeline
**Tagline**: Turns saved social-media archives into a searchable,
offline knowledge base.

**Value line**: Scheduled Python pipeline that turns saved archives into
a searchable, offline knowledge base.
**Mini roadmap**: Inbox → Import → AI extract → Sync → Database
**Proof chips**: 860 AI extracts · 175 posts · 3.5 months hands-off
**Tags**: Document ingestion, AI extraction, Scheduled automation, Python · Gemini · SQLite
**Key stat**: 860 — "AI extracts · 175 posts · 748 assets · 3.5 months hands-off"

- Goal: Turn saved social-media archives into a searchable, offline
  knowledge base.
- Method: A scheduled Python pipeline imports, normalizes, AI-extracts,
  syncs and stores each item with status tracking.
- Result: Processed 175 posts, 748 media assets, 860 AI extracts and 162
  Notion syncs.

**Workflow — 5 stages** ("Workflow — runs unattended at login")
1. **[Script] ZIP inbox** — Export archives enter a watched folder.
   *(mini: Watched folder · Export archive arrives)*
2. **[Script] Import + normalize** — Files are unpacked, renamed and
   registered. *(mini: Unpacked · Renamed · Registered)*
3. **[AI] AI extraction** — Gemini writes searchable image and video
   descriptions. *(mini: Gemini AI · Image descriptions · Video
   descriptions)*
4. **[Script] Sync to Notion** — Each post carries a pipeline status.
   *(mini: Synced to Notion · Pipeline status tracked)*
5. **[Output] Searchable database** — SQLite remains the offline source
   of truth. *(mini: SQLite database · Offline source of truth)*

**Recap**: ZIP inbox → import + normalize → AI extraction → sync to
Notion → searchable database
**Takeaway**: "Runs unattended. SQLite stays the source of truth."

(No compact/full Problem/Decision/Limitation layer — this project uses
the simpler original Goal/Method/Result shape only, no `decisionHtml`/
`limitationHtml`/`transferItems`.)

---

## 8. Project 06 — AI-Assisted Video Pipeline — "decide before render"

**Tier**: 3, Learning lab

**Title**: AI-Assisted Video Pipeline — "decide before render"
**Tagline**: Plan-before-render editing pipeline for phone footage →
publishable vertical reels.

**Value line**: Plan-before-render editing pipeline — nothing renders
until a human approves the edit plan.
**Mini roadmap**: Ingest → Privacy → Triage → Approval → Render → Export
**Proof chips**: 2 productions · Privacy pass · Human approval gate
**Tags**: Process design, Cost control, Privacy automation, ffmpeg · Resolve API · DCTL
**Key stat**: 2 — "Published productions · locked reusable template ·
full chain incl. privacy pass"

- Goal: Turn raw phone footage into publishable vertical reels without
  wasting time on repeated renders.
- Method: Plan, triage and approve the edit before rendering; compute is
  spent only after a human-approved plan.
- Result: Built a reusable template, then completed a second production
  with triage, voiceover, music bed, privacy pass and export.

**Workflow — 6 stages** ("Workflow — plan approved before compute is spent")
1. **[Script] Footage ingest** — Read metadata and group clips. *(mini:
   Read metadata · Group clips)*
2. **[AI] Privacy pass** — Mosaic bystander faces with a QA contact
   sheet. *(mini: Mosaic bystander faces · QA contact sheet)*
3. **[AI] Triage + EDIT_PLAN** — Mark KEEP / TRIM / KILL and write the
   edit plan. *(mini: KEEP / TRIM / KILL · Edit plan written)*
4. **[Human] Human approval** — No render before sign-off. *(mini: Human
   sign-off required · No render before approval)*
5. **[Script] Build the cut** — ffmpeg assembles the approved plan.
   *(mini: ffmpeg assembly · Approved plan only)*
6. **[Output] Final export** — Exported, metadata-stripped, versioned
   output. *(mini: Metadata stripped · Versioned output)*

**Recap**: Footage ingest → privacy pass → triage + EDIT_PLAN → human
approval → build the cut → final export
**Takeaway**: "Compute is spent only after a human-approved plan."

---

## 9. Project 07 — Blender + ComfyUI — controllable AI video on free local models

**Tier**: 3, Learning lab

**Title**: Blender + ComfyUI — controllable AI video on free local models
**Tagline**: Tests whether local AI video tools can produce controllable
motion, camera and material effects.

**Value line**: A 3D control layer (Blender) drives local AI video
generation for controllable motion and camera.
**Mini roadmap**: Greybox → Depth → AI generate → Grade → Finish → Release
**Proof chips**: 3 content tracks · Graded masters · Local models
**Tags**: Generative AI, Prototyping, Build-vs-buy, Blender · Wan2.1 · IPAdapter
**Key stat**: 3 — "Finished content tracks · graded masters · written
case study"

- Goal: Test whether local AI video tools can produce controllable
  motion, camera and material effects.
- Method: Use Blender greybox scenes as control layers, then pass depth
  and reference images into local video generation.
- Result: Validated the workflow through 3 finished content tracks with
  graded masters, release formats and a written case study.

**Workflow — 6 stages** ("Workflow — a 3D control layer feeds the video model")
1. **[3D] Blender greybox** — Rough 3D scene defines camera and
   blocking. *(mini: Rough 3D scene · Camera blocking)*
2. **[3D] Depth render** — Depth pass becomes the control signal. *(mini:
   Depth pass · Control signal)*
3. **[AI] Wan2.1 VACE generation** — Local model generates motion from
   control inputs. *(mini: Local model · Motion generation · Control
   inputs)*
4. **[Script] Grade + upscale** — Improve the raw output. *(mini: Grade
   the output · Upscale)*
5. **[Script] Finish** — Add interpolation and room tone. *(mini:
   Interpolation · Room tone)*
6. **[Output] Release packages** — Export vertical, square and showcase
   formats. *(mini: Vertical format · Square format · Showcase format)*

**Recap**: Blender greybox → depth render → Wan2.1 VACE generation →
grade + upscale → finish → release packages
**Takeaway**: "A 3D control layer keeps local AI video generation
controllable."

---

## 10. Component inventory (what currently renders this content)

For reference when rebuilding the interface — these are the pieces that
turn the JSON above into the current page, in render order:

- `AmbientBackground.tsx` — global WebGL Plasma canvas, one instance,
  behind everything.
- `Nav.tsx` — top nav from `page-content.json.nav`.
- `SectionRail.tsx` — right-edge scroll-spy rail (System 00/01.../07).
- `Hero.tsx` — cover screen (name, tagline, focus line, keyword rhythm).
- `ProofSummary.tsx` — "Selected systems" quick-cards grid (section 01).
- `ProjectCard.tsx` — one per project; branches into either
  `ProjectLogicCard` + `WorkflowWalkthrough` (all 7 currently) or the
  older static `WorkflowStages` fallback (currently unused).
- `ProjectLogicCard.tsx` — left column: number/tier, title, value line,
  mini roadmap, proof chips, Play/Read case notes buttons.
- `WorkflowWalkthrough.tsx` — right column: animated step list, driven by
  `useWorkflowWalkthrough.ts` (autoplay/jump/reset state machine).
- `StageMedia.tsx` — per-step image or caption-only fallback (no image
  files currently exist for any project — every stage currently renders
  its `caption` text only).
- `SupportingSystems.tsx` — section 02, the 3 infrastructure cards.
- `Footer.tsx` — footer left/right text.

Behavioral hooks (no visible content of their own, but shape how content
is experienced — worth knowing before redesigning interaction):
`useSoftPageHandoff.ts` (Hero→Systems wheel handoff), `useSectionSettle.ts`
(passive scroll-settle below Systems), `useAccentSection.ts` (per-section
green accent color).
