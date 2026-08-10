// Types for the two JSON data files. Fields typed `html` are short, static,
// author-written content (never user input) that may contain a few inline
// tags (<strong>, <span class="num">, <code>) preserved from the original
// HTML for fidelity — rendered via dangerouslySetInnerHTML. Everything else
// is plain text.

// 'control' added (System 01 V2 storytelling correction, 2026-08-09) —
// distinct from 'out'/OUTPUT: a control/gate node (e.g. a pre-write
// authorization guard) doesn't produce an output artifact, it decides
// whether the record may continue. Absent everywhere else; every other
// project's stages keep using the original 4 values.
export type StageActor = 'ai' | 'human' | 'sys' | 'out' | 'control'

export interface Stage {
  num: number
  actor: StageActor
  actorLabel: string
  title: string
  body: string
  image?: string // path under /case-media/<project-id>/ — may not exist on disk yet
  caption?: string
  // Walkthrough-only: 2-4 short phrases revealed progressively while this
  // stage is the active step. `body` doubles as the walkthrough explanation
  // — no separate field, so there's one place to edit the stage's meaning.
  miniNodes?: string[]
  // Small secondary technical term shown under a plain-language stage
  // title (e.g. title "CLEAN", technicalLabel "Normalization") — System
  // 01 Professional V2 pass, 2026-08-09. Reuses WorkflowDiagram's existing
  // node.tool rendering slot rather than adding new UI. Optional; absent
  // everywhere else, so every other project's node rendering is
  // unchanged.
  technicalLabel?: string
  // Short, real, concrete evidence for this exact stage (e.g. `tags text
  // -> array`, `missing title -> blocked`) — System 01 V3 correction,
  // 2026-08-09. Makes the node read as a real, tested system rather than
  // a concept diagram. Optional; absent everywhere else.
  example?: string
  // Three-part professional detail breakdown for the main-page active-
  // detail panel (System 01 V4 correction, 2026-08-09) — Input / Rule
  // (or Decision) / Output, real data not just a one-line gloss. All
  // optional; WorkflowDiagram.tsx falls back to the plain action+example
  // display when a stage has none of these, so every other project's
  // detail panel is unchanged.
  detailInput?: string
  detailRuleLabel?: string // defaults to "RULE"; e.g. "DECISION" for a human stage
  detailRule?: string
  detailOutput?: string
  // System 04 architecture correction (2026-08-10) — marks this stage as
  // the first node of a SEPARATE control layer, connected to the previous
  // stage by a human decision rather than by code. WorkflowDiagram.tsx
  // renders the connector immediately before this node as a distinct,
  // labelled "handoff" divider instead of the normal animated arrow, so
  // the diagram doesn't visually imply one continuous automated pipeline
  // when the verified architecture is actually two independent systems.
  // Optional; absent everywhere else, so every other project's connector
  // rendering is unchanged.
  layerBreakLabel?: string
}

export type ProjectTier = 1 | 2 | 3

export interface Project {
  id: string
  index: number
  total: number
  tier: ProjectTier
  tierLabel: string
  title: string
  shortTitle?: string // compact label for the front-page proof summary
  taglineHtml?: string // one-line proof, shown on the collapsed card and in the proof summary
  whatItProvesHtml?: string // collapsed-card field: the capability this project demonstrates
  productionSignalHtml?: string // collapsed-card field: concrete, verified execution evidence
  valueHtml?: string // compact-card one-line value statement (replaces whatItProves/productionSignal in the compact layout)
  tags: string[]
  keyNumber: string
  keyLabel: string
  goalHtml: string
  methodHtml: string
  resultHtml: string
  failureHandledHtml?: string
  decisionHtml?: string
  limitationHtml?: string
  // Compact-layout fields: when problemHtml/workflowHtml/resultShortHtml are
  // present, ProjectCard renders the short Problem/Workflow/Result reveal
  // instead of the full Goal/Logic/Build evidence/Failure handled/Decision/
  // Limitation one. The longer fields above are kept, not deleted, so this
  // is a reversible display choice, not a content loss.
  problemHtml?: string
  workflowHtml?: string
  resultShortHtml?: string
  stagesLabel: string
  stageCountLabel: string
  stages: Stage[]
  transferHeading?: string
  transferItems?: string[]
  // Walkthrough prototype fields (Project 01 only for now — see 00_SYSTEM.md
  // v19). When all three are present, ProjectCard renders the simplified
  // ProjectLogicCard left column + the interactive WorkflowWalkthrough
  // instead of the existing compact/full layouts. Absent on every other
  // project, which keeps their rendering completely untouched.
  valueLine?: string
  miniRoadmap?: string[]
  proofChips?: string[]
  finalRoadmap?: string
  finalTakeaway?: string
  // Selected-systems grid card only (ProofSummary.tsx) — 4-5 verified
  // capability/tool keywords. No intro sentence: the grid is deliberately
  // tag-first (number, title, chips, "Open case"), not a second place to
  // read a description already covered by taglineHtml on the full section.
  overviewChips?: string[]

  // System 01 Professional V2 storytelling pass (2026-08-09) — generic,
  // optional structured fields so any project can adopt the same pattern
  // later, not System-01-specific literals baked into a component. Every
  // field is undefined (renders nothing extra) unless a project's data
  // actually sets it.
  proofStats?: ProofStat[] // top-level proof figures (e.g. "8 / 8 regression tests passed")
  // Plain (non-KPI-styled) line under proofStats — e.g. "HUMAN DECISION /
  // SHORTLIST · HOLD · SKIP". Deliberately NOT a ProofStat: a state list
  // isn't performance evidence and shouldn't carry equal visual weight
  // to a real verified number (System 01 V2 correction, 2026-08-09).
  humanDecisionLabel?: string
  // 2-3 short "input -> real handling" bullets under the value line — a
  // concrete complement to the abstract value sentence (System 01 V3
  // correction, 2026-08-09).
  realExamples?: string[]
  // Optional override for the small eyebrow label above realExamples
  // (defaults to "Real cases" in SystemChapter.tsx). Added readability
  // pass, 2026-08-10 — "Real cases" reads as real production job
  // records; System 01's bullets are actually test-fixture scenarios, so
  // it overrides to "What it catches" (outcome-framed, no claim about
  // production data).
  realExamplesLabel?: string
  // Compact 3-column "how the system is engineered" strip — System 01 V4
  // correction, 2026-08-09. Lives on the RIGHT side (below the workflow
  // field, under the active-detail panel), not the left rail — v3 had
  // put "system structure"/"built with" in the rail, which overloaded
  // it; this moves the "how it's engineered" story to sit next to the
  // workflow it actually describes. Deliberately NOT the same shape as
  // architectureCards (the detail page's richer 3-card version) — this
  // is a plain grid+rules strip, shorter, no card chrome.
  // Kept as data (still used on the detail page via architectureCards'
  // near-identical content) but no longer rendered as a full block on
  // the main chapter — see controlSummaryLine below (hierarchy-rebuild
  // pass, 2026-08-10). Field itself is unchanged/not removed so nothing
  // about the underlying data model breaks.
  systemControlStrip?: { eyebrow: string; title: string; detail?: string }[]
  builtWithLabel?: string // e.g. "n8n Code · Wait Form · Pre-write Guard · Error Trigger" — kept as data, detail-page only now
  // One compact line replacing the full systemControlStrip block on the
  // main chapter (hierarchy-rebuild pass, 2026-08-10) — per direct
  // feedback that the full TEST/PRODUCTION/FAILURE strip duplicated the
  // detail page's own architectureCards section and competed with the
  // workflow/active-detail panel for main-page reading attention. Text
  // is derived from the same verified data already in
  // systemControlStrip/architectureCards, not new information.
  controlSummaryLine?: string
  // Overrides the "DECISION FLOW" eyebrow shown above the main-page
  // workflow diagram (System 01 V3 correction, 2026-08-09).
  workflowFieldLabel?: string
  architectureCards?: ArchitectureCard[] // compact technical-layer summary cards (detail page)
  testMatrix?: TestMatrixRow[] // full case-by-case regression table, shown behind a disclosure control
  // Overrides EvidenceInspector.tsx's default short tab labels (Problem/
  // Build/Human check/Outcome/Failure/Limits) for THIS project only, keyed
  // by the generic label buildEvidenceEntries produces (Problem,
  // Implementation, Human decision, Result, Failure handled, Limitations).
  // Every other project keeps the shared default labels untouched.
  evidenceLabelOverrides?: Record<string, string>
  // Overrides the main-chapter CTA text ("Read case notes →" by default)
  // — System 01 two-level storytelling pass, 2026-08-09.
  detailCtaLabel?: string

  // ==========================================================
  // Detail-page ("System Logic & Proof") storytelling fields —
  // System 01 two-level pass, 2026-08-09. All optional/generic so any
  // project can adopt the same detail-page structure later. Presence of
  // systemLogicConcepts is what CaseStudyLayout.tsx and SystemChapter.tsx
  // use to switch into this richer detail-page layout / the calmer
  // main-page layout — every project without it keeps the original
  // generic case-page and chapter rendering byte-identical.
  // ==========================================================
  detailSubtitle?: string // smaller detail-page header line, under "SYSTEM LOGIC & PROOF"
  detailProofLine?: string // e.g. "8 / 8 regression cases matched expected outcomes" — sits right under the detail header, not as a separate KPI block
  whyIntro?: string // short opening tension paragraph ("01 / WHY")
  systemLogicIntro?: string
  // Overrides the "DECISION MODEL" eyebrow on detail-page section 02
  // (Systems 04–07 standardization pass, 2026-08-10) — a project without
  // a real decision axis (e.g. an unattended pipeline) can use its own
  // true vocabulary ("AUTOMATION RULES", "CONTROL MODEL") for the same
  // reusable component instead of being forced to call it a decision.
  // Defaults to "DECISION MODEL", so Systems 01–04 render unchanged.
  systemLogicSectionLabel?: string
  // Four-layer decision model (System 01 V2 correction, 2026-08-09) —
  // each concept now carries its own real state vocabulary, not just a
  // question. Order matters: data integrity -> job fit -> human decision
  // -> authorization is the actual control sequence.
  systemLogicConcepts?: { eyebrow: string; question: string; states: string }[]
  systemLogicPrinciple?: string
  decisionCases?: RepresentativeCase[] // {eyebrow, lines: [data, fit, human, guard]} — 4 layers now
  architectureIntro?: string
  architectureFlow?: { main: string[]; test: string[]; failure: string[] }
  testEvidencePreview?: RepresentativeCase[] // reuses the same shape as decisionCases
  // Overrides the "TEST EVIDENCE" eyebrow on detail-page section 05
  // (Systems 04–07 standardization pass, 2026-08-10) — same reasoning as
  // systemLogicSectionLabel above: a project without a regression suite
  // can call this section "REAL OUTPUT" or "PROOF" instead. Defaults to
  // "TEST EVIDENCE".
  testEvidenceSectionLabel?: string
  implementationDetails?: { title: string; body: string }[]
  currentBoundary?: string
  // "Known dependencies" — real, verified-as-not-yet-built items (see
  // V2_VERIFICATION.md's own "Known incomplete dependencies" list) —
  // collapsed under Technical Notes, not a warning panel on the main
  // surface.
  knownDependencies?: string[]
}

export interface ProofStat {
  value: string
  label: string
  sublabel?: string
}

export interface ArchitectureCard {
  eyebrow: string // e.g. "TEST" / "CONTROL" / "FAILURE"
  title: string
  body: string
}

export interface RepresentativeCase {
  eyebrow: string // e.g. "CLEAN ROLE"
  lines: string[] // short state labels, one per layer — a 3-layer or 4-layer
  // scheme is decided by the consuming component (DecisionCases.tsx uses
  // a 4-item DATA/FIT/HUMAN/GUARD label set; ProofMatrix's preview cards
  // don't add labels at all), not by this shared shape.
}

export interface TestMatrixRow {
  caseId: string
  input: string
  validation: string
  screening: string
  result: string
}

export interface MiniCard {
  eyebrow: string
  title: string
  body: string
}

export interface PageContent {
  heroName: string
  heroTagline: string
  focusLineHtml: string
  thinkingList: string[]
  systemsSectionNo: string
  systemsHeading: string
  systemsStatement: string
  supporting: {
    sectionNo: string
    heading: string
    sub: string
    cards: MiniCard[]
  }
  footer: { left: string; right: string }
  nav: { who: string; whoAccent: string; links: { href: string; label: string; external?: boolean }[] }
}
