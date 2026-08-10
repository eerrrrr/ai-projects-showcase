import type { Project } from './types'

// Data types for the reusable WorkflowDiagram component (Phase 2, see
// project-docs/PORTFOLIO_V2_INTERACTION_AND_WORKFLOW_BUILD_PROMPT.md).
// Deliberately built by DERIVING from `project.stages` (the existing,
// single source of truth already used by the V1 ProjectCard walkthrough)
// rather than authoring a second, competing stage dataset — there is
// exactly one place stage content lives; this is just a different lens
// on it, so a future edit to the real stage text never has to be made
// twice.

// 'CONTROL' added (System 01 V2 storytelling correction, 2026-08-09) —
// see StageActor's 'control' value in types.ts.
export type WorkflowActor = 'SCRIPT' | 'AI' | 'HUMAN' | 'OUTPUT' | 'CONTROL'

export interface WorkflowNode {
  id: string
  number: string
  title: string
  actor: WorkflowActor
  tool?: string
  action?: string
  // Short, real, concrete evidence for this exact node (System 01 V3
  // correction, 2026-08-09) — e.g. "tags text -> array". Optional; only
  // rendered when a stage actually supplies it.
  example?: string
  // Three-part professional detail breakdown (System 01 V4 correction,
  // 2026-08-09) — see Stage's matching fields in types.ts.
  detailInput?: string
  detailRuleLabel?: string
  detailRule?: string
  detailOutput?: string
  // See Stage.layerBreakLabel in types.ts (System 04 architecture
  // correction, 2026-08-10).
  layerBreakLabel?: string
}

// Optional per-workflow timing override (System 01 Professional V2 pass,
// 2026-08-09) — every field falls back to WorkflowDiagram.tsx's existing
// shared constants when absent, so every other project's pacing is
// byte-identical to before this was added.
export interface WorkflowTiming {
  settleDelayMs?: number
  initialHoldMs?: number
  // Per-transition hold duration (ms), one entry per node AFTER the
  // first — stepDurationsMs[0] is how long node 2 stays active before
  // node 3 starts, etc. Shorter than nodes.length-1 falls back to the
  // shared uniform step constant for the remaining transitions.
  stepDurationsMs?: number[]
}

export interface WorkflowDefinition {
  id: string
  title: string
  nodes: WorkflowNode[]
  timing?: WorkflowTiming
}

const ACTOR_MAP: Record<Project['stages'][number]['actor'], WorkflowActor> = {
  sys: 'SCRIPT',
  ai: 'AI',
  human: 'HUMAN',
  out: 'OUTPUT',
  control: 'CONTROL',
}

// Explicit, auditable per-project tool assignment — NOT a guess baked
// silently into the mapping function below. Projects with no entry here
// render with no `tool` field at all — per instruction, "do not guess
// tool placement."
//
// job-application-filter REMOVED (System 01 Professional V2 storytelling
// pass, 2026-08-09) per direct feedback: "Do not display a repeated n8n
// tool label inside every workflow node. n8n is already identified at
// project level. The main diagram is a conceptual explanation." — the
// project's own `tags` array already states n8n once; repeating it on
// all 6 nodes was noise, not new information.
const PROJECT_WIDE_TOOL: Record<string, string> = {}

// Per-project workflow pacing override (see WorkflowTiming above) — only
// job-application-filter has one so far, added per direct feedback that
// the previous uniform 1400ms-per-step rhythm was too fast to read.
// Every other project keeps WorkflowDiagram.tsx's original shared
// constants (also doubled directly there, System 01 V3 correction,
// 2026-08-09 — "make it slower half the time with all"). Re-tuned again
// (readability pass, 2026-08-09) to 3.0-3.6s/stage — per direct
// feedback watching a real recording: with the richer Input/Rule/Output
// detail panel now showing per node, even the doubled pacing didn't
// leave enough time to actually read a stage before it advanced.
const PROJECT_TIMING: Record<string, WorkflowTiming> = {
  'job-application-filter': {
    settleDelayMs: 700,
    initialHoldMs: 3200,
    stepDurationsMs: [3200, 3200, 3200, 3600], // node 3, 4, 5, 6 hold times — 3.0-3.6s/stage
  },
}

export function buildWorkflowFromProject(project: Project): WorkflowDefinition {
  const projectTool = PROJECT_WIDE_TOOL[project.id]
  return {
    id: project.id,
    title: project.title,
    nodes: project.stages.map((stage) => ({
      id: `${project.id}-${stage.num}`,
      number: String(stage.num).padStart(2, '0'),
      title: stage.title,
      actor: ACTOR_MAP[stage.actor],
      // Per-stage technicalLabel (e.g. "Normalization" under a plain
      // "CLEAN" title) takes priority over a project-wide tool name —
      // reuses the same rendering slot, they're never both needed at
      // once in practice.
      tool: stage.technicalLabel ?? projectTool,
      // Reuses the existing, already-verified stage.body sentence as the
      // node's action line — not a new/invented summary. Kept as-is
      // (already concise, one sentence) rather than truncated further.
      action: stage.body,
      example: stage.example,
      detailInput: stage.detailInput,
      detailRuleLabel: stage.detailRuleLabel,
      detailRule: stage.detailRule,
      detailOutput: stage.detailOutput,
      layerBreakLabel: stage.layerBreakLabel,
    })),
    timing: PROJECT_TIMING[project.id],
  }
}
