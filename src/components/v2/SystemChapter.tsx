import { Link } from 'react-router-dom'
import type { Project } from '../../data/types'
import { buildWorkflowFromProject } from '../../data/workflowDiagram'
import { buildEvidenceEntries, buildSequenceLine } from '../../data/systemChapterContent'
import { Html } from '../Html'
import { Reveal } from './Reveal'
import { WorkflowDiagram } from './WorkflowDiagram'

// PASS A §4/§5 — the ONE reusable chapter template all seven Systems
// render through (previously only System 01 had this depth via
// FeaturedCaseSection; Systems 02-07 were a compact SwissOverview list).
// Generic on purpose: every string here comes from the real Project
// object or the systemChapterContent.ts mapping helper — no
// project-specific literals, no invented content. Wrapped in <StoryPage>
// by AiPortfolioV2Page.tsx; this component renders only the chapter's
// inner content.
export function SystemChapter({ project }: { project: Project }) {
  const sequence = buildSequenceLine(project)
  const evidenceEntries = buildEvidenceEntries(project)
  const valueText = project.valueLine ?? project.valueHtml

  return (
    <div className="v2-chapter-grid">
      <header className="v2-chapter-rail">
        <Reveal as="span" className="v2-eyebrow">
          SYSTEM {String(project.index).padStart(2, '0')} · {project.tierLabel.toUpperCase()}
        </Reveal>
        <Reveal as="p" className="v2-chapter-number" delayMs={55}>
          {String(project.index).padStart(2, '0')}
        </Reveal>
        <Reveal as="h2" className="v2-chapter-title" delayMs={55}>
          <Html html={project.title} />
        </Reveal>
        {valueText && (
          <Reveal as="p" className="v2-chapter-value" delayMs={90}>
            {valueText}
          </Reveal>
        )}
        {sequence && <p className="v2-chapter-sequence">{sequence}</p>}
        {(project.keyNumber || project.keyLabel) && (
          <p className="v2-chapter-key">
            <span className="v2-chapter-key-number">{project.keyNumber}</span>{' '}
            <span className="v2-chapter-key-label">{project.keyLabel}</span>
          </p>
        )}
        {project.tags.length > 0 && (
          <ul className="v2-chapter-tags">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        <div className="v2-chapter-cta">
          <Link to={`/ai/${project.id}`}>Read case notes →</Link>
        </div>
      </header>

      <div className="v2-chapter-workflowField">
        <WorkflowDiagram workflow={buildWorkflowFromProject(project)} />
      </div>

      {evidenceEntries.length > 0 && (
        <div className="v2-chapter-evidence">
          {evidenceEntries.map((entry) => (
            <details className="v2-caseNotes" key={entry.label}>
              <summary>{entry.label}</summary>
              <Html as="div" className="v2-caseNotes-content" html={entry.html} />
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
