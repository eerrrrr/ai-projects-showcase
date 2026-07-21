# AI Projects Showcase — Full Site Text (2026-07-21, post-v16 trim pass)

Every string of copy currently live on the page, in page order, HTML entities decoded to plain text for readability. Pulled directly from `src/data/page-content.json` and `src/data/projects.json` — nothing paraphrased.

This is the trimmed version — "Where this applies" sections cut to 2-bullet "Transfer" blocks (featured projects only, archive projects have none), Archive projects 05–07 condensed to Goal/Logic/Build evidence/Workflow only, Supporting infrastructure cut from 5 cards to 3.

---

## Nav

Erin — AI workflow systems

Systems · Archive · Visual Portfolio ↗ (links to https://erin-wong-portfolio.vercel.app/)

---

## Hero (cover page)

**Erin Wong**
**AI Workflow Systems**

Process thinking · data visualization · human-reviewed AI workflows

SOURCE / CRITERIA / AI ASSIST / HUMAN REVIEW / DEBUG / REUSE

View systems ↓

---

## 01 — Selected systems (quick cards)

**01 — Job Search Automation System**
Criteria-first job screening workflow. OpenClaw was the early experiment; n8n is the verified rebuild.

**02 — Investment Reasoning Learning Database**
Source-first database for learning investment reasoning through evidence, risk and invalidation.

**03 — Source-to-Figma Data Visualization Pipeline**
Collected sources → clear angle → structured content → Figma-ready visual output.

**04 — AI Output Review & Debug Memory System**
Checks AI output, captures mistakes and turns recurring issues into reusable review rules.

---

## Project 01 / 07 · Featured proof — Job Search Automation System

**Tags:** n8n · Job search · Workflow automation · Human-in-the-loop

**What it proves:** I can turn messy job listings into structured, criteria-based review output.

**Production signal:** Real n8n execution · validation rules · review report generated · edge case caught

**Key stat:** 9 — mock listings screened · 4 review states · 0 silent drops

**Workflow — validate before score, human decides** (4 stages)
1. **Manual trigger** — Runs on demand from n8n or CLI; no silent background run.
2. **Load listings** — Loads one item per job listing so the source data stays visible.
3. **Validate, score and flag** — Checks required fields first, then applies location, language-risk and fit rules.
4. **Build summary report** — Generates a readable report where passed, rejected and incomplete listings remain visible.

**Goal**
- Make job-opportunity review more consistent.
- Check explicit criteria before judgment.
- Flag missing data, location mismatch and language risk.
- Produce a review report for human decision.
- Avoid automatic applications or hidden rejection.

**Logic**
- Start from messy job listings.
- Validate required fields before scoring.
- Use rules to structure location, language and basic fit.
- Let the workflow explain the review state.
- Keep the final apply / reject decision manual.

**Build evidence**
- Explored the first job-screening logic in OpenClaw.
- Rebuilt the useful logic as a verified n8n workflow.
- Ran the workflow and generated a structured report.
- Caught an incomplete listing / validation edge case.
- Kept rejected and incomplete items visible.

**Failure handled**
- OpenClaw is shown as early exploration, not a finished product.
- The rebuild removed unreliable parts and kept the useful filter logic.
- Missing data is flagged instead of guessed.
- Nothing is silently dropped from the report.

**Decision**
- AI and workflow assist with structure and review.
- Human decision stays final.
- The system does not auto-apply.
- The report supports judgment; it does not replace it.

**Limitation**
- Uses controlled / mock listing data.
- Current rules focus on location, language and missing data.
- It is not yet a full job-fit evaluator.
- Human review is still required.

**Transfer**
- Validates required fields before scoring.
- Keeps rejected and incomplete items visible for review.

---

## Project 02 / 07 · Featured proof — Investment Reasoning Learning Database

**Tags:** Investment learning · Source-first · Reasoning structure · Skill database

**What it proves:** I can learn expert reasoning structure instead of copying final opinions.

**Production signal:** Source-first database · evidence gates · assumptions / risks / invalidation extracted · reusable skill logic

**Key stat:** ~515,000 — traceable facts · 113 sources · 13 written research skills

**Workflow — extract reasoning, not answers** (4 stages)
1. **Source inbox** — Collect notes, filings, discussions and research examples as source material.
2. **Evidence tiering** — Separate source evidence from interpretation, opinion and missing information.
3. **Reasoning extraction** — Extract gates, assumptions, risks and invalidation logic — not final calls, not automatic answers.
4. **Skill card review** — Human review decides whether a pattern becomes reusable skill logic.

**Goal**
- Learn how investment reasoning works, not only what conclusion someone reaches.
- Break expert examples into evidence, assumptions, gates, risks and invalidation.
- Convert repeated reasoning patterns into reusable review logic.
- Avoid copying expert opinions as automatic answers.
- Build a source-first learning database.

**Logic**
- Start from source material: filings, articles, interviews, notes and discussions.
- Separate facts from interpretation and hypothesis.
- Extract the decision structure behind the reasoning.
- Identify review gates: evidence quality, risk, valuation, data gaps and invalidation.
- Human review decides whether a pattern becomes reusable knowledge.

**Build evidence**
- Built a large source-first research and learning database.
- Structured professional reasoning into reusable learning material.
- Created review gates for evidence, assumptions, risk and invalidation.
- Used flagged mistakes as candidates for future skill patches.
- Kept Notion as a view layer, not the source of truth.

**Failure handled**
- Prevents copying someone else's conclusion without understanding the logic.
- Prevents expert confidence from becoming automatic action.
- Flags missing data, weak comparison and overconfident conclusions.
- Keeps human review before any rule is promoted.

**Decision**
- This is not a stock-picking system.
- It does not give investment recommendations.
- It extracts professional reasoning structure.
- It turns learning into review criteria.
- Human judgment owns the final interpretation.

**Limitation**
- Investment logic may not transfer automatically to other domains.
- Source quality still needs human judgment.
- A large database does not equal correctness.
- The skill-evolution loop still needs human review.

**Transfer**
- Distils expert process without copying final opinions.
- Turns repeated reasoning patterns into reviewed skill logic.

---

## Project 03 / 07 · Featured proof — Source-to-Figma Data Visualization Pipeline

**Tags:** Source collection · Data visualization · Figma handoff · Human-in-the-loop

**What it proves:** I can connect source collection, analysis and visual communication.

**Production signal:** Source material → angle finding → structured content blocks → Figma-ready output · human approval before publish

**Key stat:** 188 — logged pipeline records · 50-topic batch runs · 2.5 months of operation

**Workflow — source to angle to visual output** (4 stages)
1. **Source collection** — Collect notes, images, references and source material from reviewed sources.
2. **Angle finding** — Identify the main point before generating content or layout.
3. **Content structure** — Turn evidence into captions, content blocks and visual text.
4. **Figma-ready output** — Prepare structured content for Figma layout and final human review.

**Goal**
- Turn collected sources into readable visual communication.
- Connect research, analysis, content structure and visual output.
- Avoid AI-invented facts.
- Make repeated content work easier to review and maintain.
- Create Figma-ready material from source-backed content.

**Logic**
- Start from source material, not blank prompting.
- Find the angle before drafting.
- Structure evidence into content blocks.
- Use AI to organise and draft, not to invent.
- Use Figma as the visual handoff layer.

**Build evidence**
- Built a repeated content workflow from source collection to visual output: 188 pipeline scripts.
- Connected notes, references, angle finding, AI drafting and design handoff.
- Prepared content for Figma-ready visual structure.
- Kept human review before publication.

**Failure handled**
- Source comes before caption.
- Weak evidence blocks strong visual claims.
- Visual polish cannot hide missing sources.
- Human review checks meaning, fact, caption and publication.

**Decision**
- AI helps structure and draft.
- Human approves the final meaning.
- Figma is the output layer, not the source of truth.
- The workflow supports communication; it does not replace editorial responsibility.

**Limitation**
- Some source evaluation remains manual.
- Visual quality still depends on design judgment.
- The system supports content production, not fully automated publishing.
- More real screenshots should be added as proof captures.

**Transfer**
- Turns reviewed source material into visual output without losing evidence.
- Connects database content to Figma-ready communication materials.

---

## Project 04 / 07 · Featured proof — AI Output Review & Debug Memory System

**Tags:** AI review · Debugging · Mistake log · Quality gate · Reusable rules

**What it proves:** I can test AI output before trusting it, and turn bugs or unclear answers into reusable workflow improvements.

**Production signal:** Unsafe output rejected · clean output passed · scanner bug found and fixed · mistake logged for future reuse

**Key stat:** 2 — independent safety layers · 1 real bug found and fixed

**Workflow — check AI output, then log the lesson** (4 stages)
1. **Structured extraction** — Split rough AI output into facts, assumptions, missing information and claims.
2. **Evidence and consistency check** — Checks whether claims have source support, whether key information is missing, and whether the answer overstates certainty.
3. **Independent phrase scan** — Runs a second check on the rendered output to catch unsafe wording, action bias or unsupported conclusions.
4. **Debug memory update** — Records the bug, lesson and what to avoid next time so the same mistake can become a future check.

**Goal**
- Stop AI output from being trusted too quickly.
- Separate facts, assumptions, missing information and unsupported claims.
- Catch overconfident or action-biased wording.
- Record bugs and unclear outputs as reusable learning.
- Improve future workflows through reviewed experience.

**Logic**
- Start from rough AI output, workflow notes, bugs or unclear answers.
- Extract the claim structure before judging the answer.
- Check whether claims are supported by source material.
- Run a second scan for risky wording or overclaiming.
- Save the lesson into debug memory for future review.

**Build evidence**
- Built an AI output review / decision-gate workflow.
- Unsafe output was rejected.
- Clean output passed.
- A real scanner bug was found and fixed.
- The bug was recorded as a reusable system lesson.

**Failure handled**
- Prevents confident AI output from becoming trusted output.
- Flags missing evidence and unsupported claims.
- Catches action-biased wording before reuse.
- Keeps human interpretation separate from AI classification.
- Treats bugs as material for system improvement.

**Decision**
- AI can classify, extract and flag risk.
- AI does not decide what the evidence means.
- Human review owns interpretation.
- Bugs are not hidden; they become rule candidates.
- The system learns through reviewed experience, not automatic self-modification.

**Limitation**
- This is a human-reviewed learning loop, not a fully autonomous self-learning agent.
- Rule-based checks can miss differently worded unsafe claims.
- Human review is still required.
- More real cases and proof captures should be added over time.

**Transfer**
- Separates verified information from AI interpretation before reuse.
- Uses two checks so one weak gate does not decide alone.

---

## 02 — Archive
*Additional systems, kept compact.*

### Project 05 / 07 · Supporting system — Method of Loci — automated document-ingestion pipeline

**Tags:** Document ingestion · AI extraction · Scheduled automation · Python · Gemini · SQLite

**Key stat:** 860 — AI extracts · 175 posts · 748 assets · 3.5 months hands-off

**Goal:** Turn saved social-media archives into a searchable, offline knowledge base.

**Logic:** A scheduled Python pipeline imports, normalizes, AI-extracts, syncs and stores each item with status tracking.

**Build evidence:** Processed 175 posts, 748 media assets, 860 AI extracts and 162 Notion syncs.

**Workflow — runs unattended at login** (5 stages)
1. **ZIP inbox** — Export archives enter a watched folder.
2. **Import + normalize** — Files are unpacked, renamed and registered.
3. **AI extraction** — Gemini writes searchable image and video descriptions.
4. **Sync to Notion** — Each post carries a pipeline status.
5. **Searchable database** — SQLite remains the offline source of truth.

*(No Transfer section — archive projects keep Goal/Logic/Build evidence/Workflow only.)*

### Project 06 / 07 · Learning lab — AI-Assisted Video Pipeline — decide before render

**Tags:** Process design · Cost control · Privacy automation · ffmpeg · Resolve API · DCTL

**Key stat:** 2 — Published productions · locked reusable template · full chain incl. privacy pass

**Goal:** Turn raw phone footage into publishable vertical reels without wasting time on repeated renders.

**Logic:** Plan, triage and approve the edit before rendering; compute is spent only after a human-approved plan.

**Build evidence:** Built a reusable template, then completed a second production with triage, voiceover, music bed, privacy pass and export.

**Workflow — plan approved before compute is spent** (6 stages)
1. **Footage ingest** — Read metadata and group clips.
2. **Privacy pass** — Mosaic bystander faces with a QA contact sheet.
3. **Triage + EDIT_PLAN** — Mark KEEP / TRIM / KILL and write the edit plan.
4. **Human approval** — No render before sign-off.
5. **Build the cut** — ffmpeg assembles the approved plan.
6. **Final export** — Exported, metadata-stripped, versioned output.

### Project 07 / 07 · Learning lab — Blender + ComfyUI — controllable AI video on free local models

**Tags:** Generative AI · Prototyping · Build-vs-buy · Blender · Wan2.1 · IPAdapter

**Key stat:** 3 — Finished content tracks · graded masters · written case study

**Goal:** Test whether local AI video tools can produce controllable motion, camera and material effects.

**Logic:** Use Blender greybox scenes as control layers, then pass depth and reference images into local video generation.

**Build evidence:** Validated the workflow through 3 finished content tracks with graded masters, release formats and a written case study.

**Workflow — a 3D control layer feeds the video model** (6 stages)
1. **Blender greybox** — Rough 3D scene defines camera and blocking.
2. **Depth render** — Depth pass becomes the control signal.
3. **Wan2.1 VACE generation** — Local model generates motion from control inputs.
4. **Grade + upscale** — Improve the raw output.
5. **Finish** — Add interpolation and room tone.
6. **Release packages** — Export vertical, square and showcase formats.

---

## 03 — Supporting infrastructure (3 mini-cards, trimmed from 5)

*The systems the projects above stand on*

**Knowledge capture — Debug Memory Infrastructure**
Structured note format for recording bugs, lessons and what to avoid next time. Dry-run by default; nothing writes without confirmation.

**Layout engine — Auto-Typesetting Cover Tool**
React + Vite tool that turns raw text into poster / cover layouts and exports PNG, SVG and JSON.

**Process transfer demo — Finance-style Exception Review**
Mock invoice / PO / payment dataset testing source → classify → human-review logic. 8 mock invoices, 6 exception types, 0 auto-resolved.

*(Removed from public display: Remote Dispatch Hub, Language-Study Document Generator — per user request, kept out of a job-search-facing showcase.)*

---

## Footer

Left: Erin · figures taken from project logs, databases and local files · 2026-07-20
Right: Code walkthroughs & live demos available on request

---

*This is every word of copy currently rendered on the page. Nothing here has been paraphrased or summarized — it's a direct extraction from the live data files, verified against the built bundle via grep and against the live DOM via browser evaluation.*
