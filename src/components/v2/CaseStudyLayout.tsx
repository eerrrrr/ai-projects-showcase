import { Link } from 'react-router-dom'
import type { Project } from '../../data/types'
import { buildWorkflowFromProject } from '../../data/workflowDiagram'
import { Html } from '../Html'
import { QuickReadContent } from './QuickReadContent'
import { WorkflowDiagram } from './WorkflowDiagram'

interface CaseSection {
  label: string
  html: string
}

// Full case-page section order, per direct correction: Problem/
// Implementation first, then Outcome summary (always-visible short
// result) and Outcome detail (the fuller result write-up, collapsible
// via QuickReadContent when long) as two distinct rows, then Failure
// handled, Human decision, Limitations. Reuses the same real fields as
// systemChapterContent.ts's overview mapping — no second, competing
// content source — just a finer split (Result becomes two rows here
// instead of one) and a different order suited to a full narrative page.
function buildCaseSections(project: Project): CaseSection[] {
  const sections: CaseSection[] = []

  if (project.problemHtml) sections.push({ label: 'Problem', html: project.problemHtml })
  else if (project.goalHtml) sections.push({ label: 'Goal', html: project.goalHtml })

  if (project.workflowHtml) sections.push({ label: 'Implementation', html: project.workflowHtml })
  else if (project.methodHtml) sections.push({ label: 'Method', html: project.methodHtml })

  if (project.resultShortHtml) sections.push({ label: 'Outcome', html: project.resultShortHtml })
  if (project.resultHtml) sections.push({ label: 'Outcome detail', html: project.resultHtml })

  if (project.failureHandledHtml) sections.push({ label: 'Failure handled', html: project.failureHandledHtml })

  const humanStages = project.stages.filter((stage) => stage.actor === 'human')
  if (humanStages.length > 0 || project.decisionHtml) {
    const stageParas = humanStages.map((stage) => `<p>${stage.body}</p>`).join('')
    sections.push({ label: 'Human decision', html: `${stageParas}${project.decisionHtml ?? ''}` })
  }

  if (project.limitationHtml) sections.push({ label: 'Limitations', html: project.limitationHtml })

  return sections
}

// Reusable full case-study template — takes one Project as its only
// content prop; contains no project-specific literals, so all 7 real
// projects render through this identically. `position` ("02 / 07") and
// prev/next come from CaseStudyPage.tsx, which knows the full sorted
// project list.
export function CaseStudyLayout({
  project,
  prevProject,
  nextProject,
  position,
}: {
  project: Project
  prevProject: Project | null
  nextProject: Project | null
  position: string
}) {
  const framing = project.taglineHtml ?? project.valueHtml
  const sections = buildCaseSections(project)
  const workflow = buildWorkflowFromProject(project)

  return (
    <article className="v2-case-page">
      <div className="v2-grid v2-caseTopNav">
        <Link to={`/ai#${project.id}`} className="v2-back-link">
          ← All systems
        </Link>
        <span className="v2-caseTopNav-position">{position}</span>
      </div>

      <div className="v2-grid v2-caseMasthead">
        <div className="v2-caseMasthead-main">
          <span className="v2-eyebrow">
            {String(project.index).padStart(2, '0')} · {project.tierLabel}
          </span>
          <Html as="h1" html={project.title} />
          {framing && <Html as="p" className="v2-caseMasthead-framing" html={framing} />}
        </div>
        <div className="v2-caseMasthead-proof">
          {(project.keyNumber || project.keyLabel) && (
            <div className="v2-case-key">
              <span className="v2-case-key-number">{project.keyNumber}</span>
              <span className="v2-case-key-label">{project.keyLabel}</span>
            </div>
          )}
          {project.tags.length > 0 && (
            <ul className="v2-caseMasthead-tags">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="v2-caseWorkflowSection">
        <div className="v2-caseWorkflowSection-heading">
          <span className="v2-eyebrow">Sequence</span>
          <span className="v2-caseWorkflowSection-count">{workflow.nodes.length} stages</span>
        </div>
        <WorkflowDiagram workflow={workflow} />
      </div>

      <div className="v2-caseSections">
        {sections.map((section) => (
          <div className="v2-grid v2-caseRow" key={section.label}>
            <span className="v2-caseRow-label">{section.label}</span>
            <div className="v2-caseRow-content">
              <QuickReadContent html={section.html} className="v2-caseRow-prose" />
            </div>
          </div>
        ))}
      </div>

      <div className="v2-grid v2-caseNav">
        {prevProject ? (
          <Link to={`/ai/${prevProject.id}`} className="v2-caseNav-link v2-caseNav-link--prev">
            <span className="v2-eyebrow">← Previous case</span>
            <Html as="span" html={prevProject.title} />
          </Link>
        ) : (
          <span />
        )}
        {nextProject ? (
          <Link to={`/ai/${nextProject.id}`} className="v2-caseNav-link v2-caseNav-link--next">
            <span className="v2-eyebrow">Next case →</span>
            <Html as="span" html={nextProject.title} />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </article>
  )
}
