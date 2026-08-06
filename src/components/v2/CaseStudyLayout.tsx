import { Link } from 'react-router-dom'
import type { Project } from '../../data/types'
import { buildWorkflowFromProject } from '../../data/workflowDiagram'
import { Html } from '../Html'
import { WorkflowDiagram } from './WorkflowDiagram'

// Reusable full case-study template — deeper than FeaturedCaseSection's
// inline summary. Takes one Project as its only prop and renders whatever
// fields it has; contains no project-specific literals so any Tier-1
// project can use it once it has a route wired up. Only
// job-application-filter is routed to this in the current pass.
export function CaseStudyLayout({
  project,
  nextProject,
}: {
  project: Project
  nextProject: Project | null
}) {
  const humanStages = project.stages.filter((stage) => stage.actor === 'human')

  return (
    <article className="v2-case-page">
      <div className="v2-grid v2-case-page-masthead">
        <div>
          <Link to="/ai" className="v2-back-link">
            ← Back to overview
          </Link>
          <span className="v2-section-number">{String(project.index).padStart(2, '0')}</span>
          <span className="v2-eyebrow">{project.tierLabel}</span>
          <Html as="h1" html={project.title} />
        </div>
      </div>

      <div className="v2-grid v2-case-evidence">
        <div className="v2-case-key">
          <span className="v2-case-key-number">{project.keyNumber}</span>
          <span className="v2-case-key-label">{project.keyLabel}</span>
        </div>
        <ul className="v2-case-tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>

      <hr className="v2-rule v2-case-rule" />

      <div className="v2-grid v2-case-body">
        {project.problemHtml && (
          <div className="v2-case-block">
            <span className="v2-eyebrow">Problem</span>
            <Html as="p" html={project.problemHtml} />
          </div>
        )}

        {project.workflowHtml && (
          <div className="v2-case-block">
            <span className="v2-eyebrow">Workflow</span>
            <Html as="p" html={project.workflowHtml} />
          </div>
        )}
      </div>

      {/* WorkflowDiagram replaces the old plain <ol> stage list — same
          reasoning as FeaturedCaseSection.tsx: no two competing six-stage
          displays. */}
      <div className="v2-grid v2-case-workflow-row">
        <div className="v2-case-block v2-case-block--full">
          <span className="v2-eyebrow">Sequence</span>
          <WorkflowDiagram workflow={buildWorkflowFromProject(project)} />
        </div>
      </div>

      <div className="v2-grid v2-case-body">
        {humanStages.length > 0 && (
          <div className="v2-case-block v2-case-block--human">
            <span className="v2-eyebrow">Human-review gate</span>
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

        <Html as="div" className="v2-case-block" html={project.resultHtml} />

        {project.failureHandledHtml && (
          <div className="v2-case-block">
            <span className="v2-eyebrow">Failure handled</span>
            <Html as="div" html={project.failureHandledHtml} />
          </div>
        )}

        {project.decisionHtml && (
          <div className="v2-case-block">
            <span className="v2-eyebrow">Decision</span>
            <Html as="div" html={project.decisionHtml} />
          </div>
        )}

        {project.limitationHtml && (
          <div className="v2-case-block">
            <span className="v2-eyebrow">Limitation</span>
            <Html as="div" html={project.limitationHtml} />
          </div>
        )}
      </div>

      <hr className="v2-rule v2-case-rule" />

      <div className="v2-grid v2-case-next">
        {nextProject ? (
          <Link to={`/ai#${nextProject.id}`} className="v2-case-next-link">
            <span className="v2-eyebrow">Next project</span>
            <Html as="span" html={nextProject.title} />
          </Link>
        ) : (
          <Link to="/ai" className="v2-case-next-link">
            <span className="v2-eyebrow">Back to overview</span>
          </Link>
        )}
      </div>
    </article>
  )
}
