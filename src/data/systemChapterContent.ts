import type { Project } from './types'

// PASS A §5/§6 — normalizes each project's real, existing fields into one
// consistent "evidence entries" shape for SystemChapter's zipped
// disclosure area. Systems 01-04 have the newer problemHtml/workflowHtml/
// resultShortHtml/failureHandledHtml/limitationHtml fields; Systems 05-07
// only have the older goalHtml/methodHtml/resultHtml shape. Per PASS A's
// explicit instruction ("if a field genuinely does not exist, omit it
// rather than inventing it"), this falls back to the older field under an
// honest label (Goal/Method) rather than forcing it under a label
// ("Problem"/"Implementation") the source data doesn't actually support.
// No content is invented anywhere in this file — every string here is a
// direct reference to an existing verified field.

export interface EvidenceEntry {
  label: string
  html: string
}

export function buildEvidenceEntries(project: Project): EvidenceEntry[] {
  const entries: EvidenceEntry[] = []

  if (project.problemHtml) entries.push({ label: 'Problem', html: project.problemHtml })
  else if (project.goalHtml) entries.push({ label: 'Goal', html: project.goalHtml })

  if (project.workflowHtml) entries.push({ label: 'Implementation', html: project.workflowHtml })
  else if (project.methodHtml) entries.push({ label: 'Method', html: project.methodHtml })

  const humanStages = project.stages.filter((stage) => stage.actor === 'human')
  if (humanStages.length > 0 || project.decisionHtml) {
    const stageParas = humanStages.map((stage) => `<p>${stage.body}</p>`).join('')
    const decisionPara = project.decisionHtml ?? ''
    entries.push({ label: 'Human decision', html: `${stageParas}${decisionPara}` })
  }

  if (project.resultShortHtml) entries.push({ label: 'Result', html: project.resultShortHtml })
  else if (project.resultHtml) entries.push({ label: 'Result', html: project.resultHtml })

  if (project.failureHandledHtml) entries.push({ label: 'Failure handled', html: project.failureHandledHtml })
  if (project.limitationHtml) entries.push({ label: 'Limitations', html: project.limitationHtml })

  return entries
}

// PASS A §5 — sequence line for the left rail. Prefers the existing
// authored finalRoadmap string (already formatted with arrows); falls
// back to deriving one from the real stage titles when finalRoadmap isn't
// present, rather than a second competing dataset.
export function buildSequenceLine(project: Project): string {
  return project.finalRoadmap ?? project.stages.map((stage) => stage.title).join(' → ')
}
