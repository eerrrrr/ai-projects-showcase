# Erin Wong — AI Workflow Systems
## UI Content Pack for Visual Redesign

This document contains redesign input only.

Do not rewrite project claims, figures, project titles or underlying
content logic. The new interface may completely change the visual
storytelling, layout, typography, media treatment and motion.

---

## 1. Site identity

Name:
Erin Wong

Tagline:
AI Workflow Systems

Focus:
Process thinking · data visualization · human-reviewed AI workflows

Rhythm keywords:
Source · Criteria · AI assist · Human review · Debug · Reuse

Navigation identity:
Erin — AI workflow systems

Navigation links:
- Systems
- LinkedIn
- GitHub
- Visual Portfolio

Selected systems heading:
Selected systems

Selected systems statement:
Exploring how human judgment and AI capabilities can shape better ways
of researching, deciding, creating, and learning.

Footer:
Erin · figures taken from project logs, databases and local files ·
2026-07-20

Code walkthroughs & live demos available on request

---

## 2. Editorial hierarchy

### Tier 1 — Featured proof

Four projects with:
- dominant visual treatment
- full case-study depth
- compact Problem / Workflow / Result visible first
- workflow storytelling
- evidence section
- expanded case notes behind deliberate reveal

Projects:
1. Job Screening Validation Workflow
2. Investment Reasoning Learning Database
3. Source-to-Figma Data Visualization Pipeline
4. AI Output Review & Debug Memory System

### Tier 2 — Supporting system

One project with:
- medium editorial weight
- compact Goal / Method / Result
- workflow summary
- no full Tier-1 case-note structure

Project:
5. Method of Loci — automated document-ingestion pipeline

### Tier 3 — Learning lab

Two projects with:
- compact visual/index treatment
- experimental framing
- Goal / Method / Result
- selected workflow evidence

Projects:
6. AI-Assisted Video Pipeline — "decide before render"
7. Blender + ComfyUI — controllable AI video on free local models

Tier 1 must be visually dominant.
Tier 2 and Tier 3 must not receive the same weight as Tier 1.

---

## 3. Featured project 01

Title:
Job Screening Validation Workflow

Value line:
OpenClaw-style intake → n8n validation → Notion-safe review handoff.

Key stat:
6 task records processed · 3 review states · 1 write attempt, failed safely

Problem:
Task records from an OpenClaw-style router (or manual entry) arrive in
inconsistent shapes — tags as strings instead of arrays, non-ISO dates,
oversized text, missing fields — any of which can silently break a
Notion write or make it look like it succeeded when it didn't.

Workflow:
I built a real n8n workflow that normalizes incoming records, validates
required fields and safety rules, maps them into a schema-safe Notion
payload, and routes each one to a review state
(READY / NEEDS_REVIEW / BLOCKED) before any write is attempted.
A Manual Trigger runs six repeatable test records; a Webhook input is
built for a real sender but not yet published or authenticated.

Result:
A live Notion write was attempted and failed safely — the integration
didn't yet have permission on the target database — so no fake success
was reported; every record's outcome stays visible.

Workflow stages:
1. Script — Intake trigger
2. Script — Normalize record
3. Script — Validate safety rules
4. Script — Map Notion payload
5. Human — Route review state
6. Output — Review report / write outcome

Recap:
Task record → normalize → validate → Notion payload → review state →
report / write outcome

Takeaway:
Check first. Normalize before judging. Report failure honestly.

---

## 4. Featured project 02

Title:
Investment Reasoning Learning Database

Value line:
Learn reasoning structure, not final opinions.

Key stat:
~515,000 traceable facts · 113 sources · 13 written research skills

Problem:
Expert investment write-ups mix facts, assumptions and conclusions
together, making it hard to learn the reasoning behind them.

Workflow:
I built a source-first database that separates evidence from
interpretation, then extracts the gates, assumptions, risks and
invalidation logic behind each case.

Result:
This is not a stock-picking system — it turns learning into reviewable
criteria, with human judgment owning the final call.

Workflow stages:
1. Script — Source inbox
2. Script — Evidence tiering
3. AI — Reasoning extraction
4. Output — Skill card review

Recap:
Source → evidence → reasoning pattern → human-reviewed skill logic

Takeaway:
Learn reasoning structure, not final opinions.

---

## 5. Featured project 03

Title:
Source-to-Figma Data Visualization Pipeline

Value line:
Turn reviewed sources into visual communication.

Key stat:
188 logged pipeline records · 50-topic batch runs ·
2.5 months of operation

Problem:
Research, drafting and visual layout are usually disconnected, so
content work has to be redone by hand each time.

Workflow:
I built a pipeline that collects sources, finds the angle, structures
the evidence into content blocks, then hands off structured content
directly into Figma.

Result:
188 logged pipeline runs later, human review still gates every piece
before it's approved or posted.

Workflow stages:
1. Script — Source collection
2. AI — Angle finding
3. Human — Content structure
4. Output — Figma-ready output

Recap:
Source → angle → content blocks → Figma output → human review

Takeaway:
Source evidence becomes visual communication.

---

## 6. Featured project 04

Title:
AI Output Review & Debug Memory System

Value line:
Check AI output before reuse.

Key stat:
2 independent safety layers · 1 real bug found and fixed

Problem:
Confident-sounding AI output can hide missing evidence or overstated
claims.

Workflow:
I built a two-layer check — a rule-based gate plus an independent phrase
scan — that reviews AI output before it's trusted, and logs what it
finds.

Result:
An unsafe note was rejected, a clean one passed, and a real scanner bug
was found, fixed and logged as a reusable lesson.

Workflow stages:
1. Script — Structured extraction
2. Script — Evidence and consistency check
3. Script — Independent phrase scan
4. Output — Debug memory update

Recap:
AI output → evidence check → risk scan → debug memory → reusable rule

Takeaway:
Mistakes become reusable review rules.

---

## 7. Supporting system

Title:
Method of Loci — automated document-ingestion pipeline

Value line:
Scheduled Python pipeline that turns saved archives into a searchable,
offline knowledge base.

Key stat:
860 AI extracts · 175 posts · 748 assets · 3.5 months hands-off

Goal:
Turn saved social-media archives into a searchable, offline knowledge
base.

Method:
A scheduled Python pipeline imports, normalizes, AI-extracts, syncs and
stores each item with status tracking.

Result:
Processed 175 posts, 748 media assets, 860 AI extracts and 162 Notion
syncs.

Workflow:
ZIP inbox → import + normalize → AI extraction → sync to Notion →
searchable database

Takeaway:
Runs unattended. SQLite stays the source of truth.

---

## 8. Learning lab 01

Title:
AI-Assisted Video Pipeline — "decide before render"

Value line:
Plan-before-render editing pipeline — nothing renders until a human
approves the edit plan.

Key stat:
2 published productions · locked reusable template ·
full chain including privacy pass

Goal:
Turn raw phone footage into publishable vertical reels without wasting
time on repeated renders.

Method:
Plan, triage and approve the edit before rendering; compute is spent
only after a human-approved plan.

Result:
Built a reusable template, then completed a second production with
triage, voiceover, music bed, privacy pass and export.

Workflow:
Footage ingest → privacy pass → triage + EDIT_PLAN → human approval →
build the cut → final export

Takeaway:
Compute is spent only after a human-approved plan.

---

## 9. Learning lab 02

Title:
Blender + ComfyUI — controllable AI video on free local models

Value line:
A 3D control layer (Blender) drives local AI video generation for
controllable motion and camera.

Key stat:
3 finished content tracks · graded masters · written case study

Goal:
Test whether local AI video tools can produce controllable motion,
camera and material effects.

Method:
Use Blender greybox scenes as control layers, then pass depth and
reference images into local video generation.

Result:
Validated the workflow through 3 finished content tracks with graded
masters, release formats and a written case study.

Workflow:
Blender greybox → depth render → Wan2.1 VACE generation →
grade + upscale → finish → release packages

Takeaway:
A 3D control layer keeps local AI video generation controllable.

---

## 10. Supporting infrastructure

Debug Memory Infrastructure
Knowledge capture

Structured note format for recording bugs, lessons and what to avoid
next time. Dry-run by default; nothing writes without confirmation.

Auto-Typesetting Cover Tool
Layout engine

React + Vite tool that turns raw text into poster / cover layouts and
exports PNG, SVG and JSON.

Finance-style Exception Review
Process transfer demo

Mock invoice / PO / payment dataset testing source → classify →
human-review logic. 8 mock invoices, 6 exception types, 0 auto-resolved.

---

## 11. Actor system

The actor system must remain visible, but visually secondary.

SCRIPT / SYSTEM
Automated script, deterministic transformation or integration step.

AI
AI-assisted classification, extraction, drafting or generation.

HUMAN
Deliberate judgment, review, approval or decision gate.

OUTPUT
Final report, database, visual result, export or reusable knowledge.

Do not represent every actor as a large dashboard card.
Use subtle labels, typography, diagram notation or restrained signals.

---

## 12. Featured case-note structure

Every Tier-1 project contains two content depths.

Default compact layer:
- Problem
- Workflow
- Result

Expanded case notes:
- Goal
- Method
- Result
- Failure handled
- Decision — what was deliberately not automated
- Limitation

Expanded case notes must remain behind a deliberate reveal.
Do not show the complete long-form content on the homepage.

---

## 13. Proposed media requirements

These are design requirements, not claims about assets already available.
Use clearly labelled placeholders until real media is supplied.

### Job Screening Validation Workflow
- n8n workflow overview
- raw record vs normalized record
- validation-state view: READY / NEEDS_REVIEW / BLOCKED
- mapped Notion payload
- failed permission response
- final human-readable report
- optional short execution recording

### Investment Reasoning Learning Database
- source/database overview
- evidence vs interpretation comparison
- source traceability example
- risk / assumption / invalidation structure
- human-reviewed skill card
- database-scale visualization

### Source-to-Figma Data Visualization Pipeline
- source collection view
- angle-selection example
- structured content-block view
- Figma-ready output
- source-to-final before/after sequence
- optional short handoff recording

### AI Output Review & Debug Memory System
- unsafe note vs clean note
- structured claim extraction
- first rule-gate result
- independent phrase-scan result
- scanner bug before/after
- debug-memory lesson entry

### Method of Loci
- ZIP inbox
- import / normalization status
- AI extraction example
- Notion synchronization status
- SQLite search result
- pipeline-run overview

### AI-Assisted Video Pipeline
- footage contact sheet
- privacy mosaic QA
- KEEP / TRIM / KILL triage
- EDIT_PLAN
- human approval state
- render/build view
- final vertical reel

### Blender + ComfyUI
- Blender greybox
- depth render
- ComfyUI workflow graph
- raw AI generation
- graded / upscaled result
- final vertical and square release formats