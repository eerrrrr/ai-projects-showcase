import type { Project } from './types'

// Data types for the reusable WorkflowDiagram component (Phase 2, see
// project-docs/PORTFOLIO_V2_INTERACTION_AND_WORKFLOW_BUILD_PROMPT.md).
// Deliberately built by DERIVING from `project.stages` (the existing,
// single source of truth already used by the V1 ProjectCard walkthrough)
// rather than authoring a second, competing stage dataset — there is
// exactly one place stage content lives; this is just a different lens
// on it, so a future edit to the real stage text never has to be made
// twice.

export type WorkflowActor = 'SCRIPT' | 'AI' | 'HUMAN' | 'OUTPUT'

export interface WorkflowNode {
  id: string
  number: string
  title: string
  actor: WorkflowActor
  tool?: string
  action?: string
}

export interface WorkflowDefinition {
  id: string
  title: string
  nodes: WorkflowNode[]
}

const ACTOR_MAP: Record<Project['stages'][number]['actor'], WorkflowActor> = {
  sys: 'SCRIPT',
  ai: 'AI',
  human: 'HUMAN',
  out: 'OUTPUT',
}

// Explicit, auditable per-project tool assignment — NOT a guess baked
// silently into the mapping function below. Only job-application-filter
// has a verified project-wide tool: its workflowHtml explicitly says "I
// built a real n8n workflow that normalizes... validates... maps...
// routes...", i.e. n8n runs every one of its 6 stages, so labelling all
// 6 nodes "n8n" is supported by the real project text, not invented.
// Projects with no entry here render with no `tool` field at all —
// per instruction, "do not guess tool placement."
const PROJECT_WIDE_TOOL: Record<string, string> = {
  'job-application-filter': 'n8n',
}

export function buildWorkflowFromProject(project: Project): WorkflowDefinition {
  const tool = PROJECT_WIDE_TOOL[project.id]
  return {
    id: project.id,
    title: project.title,
    nodes: project.stages.map((stage) => ({
      id: `${project.id}-${stage.num}`,
      number: String(stage.num).padStart(2, '0'),
      title: stage.title,
      actor: ACTOR_MAP[stage.actor],
      tool,
      // Reuses the existing, already-verified stage.body sentence as the
      // node's action line — not a new/invented summary. Kept as-is
      // (already concise, one sentence) rather than truncated further.
      action: stage.body,
    })),
  }
}
