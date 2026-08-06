import { Link } from 'react-router-dom'
import type { Project } from '../../data/types'
import { buildWorkflowFromProject } from '../../data/workflowDiagram'
import { Html } from '../Html'
import { WorkflowDiagram } from './WorkflowDiagram'

// Reusable Project Chapter — left 4-column System Summary rail + right
// 8-column Workflow field, per the correction pass following direct
// screenshot review: the previous version put long Problem/Workflow
// paragraphs above the workflow diagram, reading as a documentation page
// rather than a chapter with the workflow as its primary visual content.
//
// Long-form evidence (Problem, full Workflow explanation, Human-review
// detail, Result) is NOT deleted — it moves BELOW the primary 4:8
// composition into its own evidence block, so a recruiter sees the
// summary + visual workflow first and the full written evidence remains
// available immediately after, in normal scroll flow (no click, no
// collapsed <details> — that would hide it too aggressively for a first
// pass; just reordered).
//
// Generic on purpose: takes one Project and renders whatever fields it
// has. Only wired to Job Screening this pass, but contains no
// Job-Screening-specific literals so the remaining projects can reuse it
// later without rework.
export function FeaturedCaseSection({ project }: { project: Project }) {
  const humanStages = project.stages.filter((stage) => stage.actor === 'human')
  const sequence = project.stages.map((stage) => stage.title).join(' → ')

  return (
    <section id={project.id} className="v2-case-section" style={{ scrollMarginTop: '32px' }}>
      <div className="v2-case-chapterGrid">
        <header className="v2-case-summary">
          <span className="v2-eyebrow">
            SYSTEM {String(project.index).padStart(2, '0')} · {project.tierLabel.toUpperCase()}
          </span>
          <p className="v2-case-summary-number">{String(project.index).padStart(2, '0')}</p>
          <Html as="h2" className="v2-case-summary-title" html={project.title} />
          {project.valueLine && <p className="v2-case-summary-value">{project.valueLine}</p>}
          {sequence && <p className="v2-case-summary-sequence">{sequence}</p>}
          {project.tags.length > 0 && (
            <ul className="v2-case-summary-tags">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
          <div className="v2-case-cta">
            <Link to={`/ai/${project.id}`}>Read case notes →</Link>
          </div>
        </header>

        <div className="v2-case-workflowField">
          <WorkflowDiagram workflow={buildWorkflowFromProject(project)} />
        </div>
      </div>

      {/* Evidence layer — full written detail, preserved in full, moved
          below the primary chapter composition rather than deleted or
          hidden behind a click. */}
      <hr className="v2-rule v2-case-rule" />

      <div className="v2-grid v2-case-evidence">
        <div className="v2-case-key">
          <span className="v2-case-key-number">{project.keyNumber}</span>
          <span className="v2-case-key-label">{project.keyLabel}</span>
        </div>
      </div>

      <div className="v2-grid v2-case-body">
        {project.problemHtml && (
          <div className="v2-case-block">
            <span className="v2-eyebrow">Problem</span>
            <Html as="p" html={project.problemHtml} />
          </div>
        )}

        {project.workflowHtml && (
          <div className="v2-case-block">
            <span className="v2-eyebrow">Implementation</span>
            <Html as="p" html={project.workflowHtml} />
          </div>
        )}

        {humanStages.length > 0 && (
          <div className="v2-case-block v2-case-block--human">
            <span className="v2-eyebrow">Human decision</span>
            {humanStages.map((stage) => (
              <p key={stage.num}>{stage.body}</p>
            ))}
          </div>
        )}

        {project.resultShortHtml && (
          <div className="v2-case-block">
            <span className="v2-eyebrow">Result</span>
            <Html as="p" html={project.resultShortHtml} />
          </div>
        )}
      </div>
    </section>
  )
}
