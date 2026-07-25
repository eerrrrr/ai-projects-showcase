// Types for the two JSON data files. Fields typed `html` are short, static,
// author-written content (never user input) that may contain a few inline
// tags (<strong>, <span class="num">, <code>) preserved from the original
// HTML for fidelity — rendered via dangerouslySetInnerHTML. Everything else
// is plain text.

export type StageActor = 'ai' | 'human' | 'sys' | 'out'

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
  supporting: {
    sectionNo: string
    heading: string
    sub: string
    cards: MiniCard[]
  }
  footer: { left: string; right: string }
  nav: { who: string; whoAccent: string; links: { href: string; label: string; external?: boolean }[] }
}
