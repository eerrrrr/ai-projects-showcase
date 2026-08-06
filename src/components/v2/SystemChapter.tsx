import { Link } from 'react-router-dom'
import type { Project } from '../../data/types'
import { buildWorkflowFromProject } from '../../data/workflowDiagram'
import { buildEvidenceEntries, buildSequenceLine } from '../../data/systemChapterContent'
import { useChapterRollState } from '../../hooks/useChapterRollState'
import { Html } from '../Html'
import { EvidenceInspector } from './EvidenceInspector'
import { Reveal } from './Reveal'
import { WorkflowDiagram } from './WorkflowDiagram'

// The one reusable chapter template all seven Systems render through.
// Generic on purpose: every string here comes from the real Project
// object or the systemChapterContent.ts mapping helper — no
// project-specific literals, no invented content. Wrapped in <StoryPage>
// by AiPortfolioV2Page.tsx, which also supplies the matching
// `chapterId` — this component subscribes to the shared single-owner
// active/scrolling engine (useChapterRollState) so its own workflow
// autoplay and evidence panel behave correctly relative to whichever
// chapter is actually the current one (correction batch §A/§E/§F).
export function SystemChapter({ project, chapterId }: { project: Project; chapterId: string }) {
  const sequence = buildSequenceLine(project)
  const evidenceEntries = buildEvidenceEntries(project)
  const valueText = project.valueLine ?? project.valueHtml
  const { isActive, isScrolling } = useChapterRollState(chapterId)

  return (
    <div className="v2-chapter-grid">
      <header className="v2-chapter-rail">
        <Reveal as="span" className="v2-eyebrow" size="small">
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
        <WorkflowDiagram workflow={buildWorkflowFromProject(project)} isActive={isActive} isScrolling={isScrolling} />
        <EvidenceInspector entries={evidenceEntries} isActive={isActive} />
      </div>
    </div>
  )
}
