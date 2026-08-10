import { Link } from 'react-router-dom'
import type { Project } from '../../data/types'
import { buildWorkflowFromProject } from '../../data/workflowDiagram'
import { buildEvidenceEntries, buildSequenceLine } from '../../data/systemChapterContent'
import { useChapterRollState } from '../../hooks/useChapterRollState'
import { Html } from '../Html'
import { EvidenceInspector } from './EvidenceInspector'
import { ProofStats } from './ProofStats'
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
        {/* Real concrete examples under the value line (System 01 V3
            correction, 2026-08-09) — a complement to the abstract value
            sentence, not a replacement for it. Small "REAL CASES" eyebrow
            added in V4 so these bullets don't float unlabelled under the
            description. */}
        {project.realExamples && project.realExamples.length > 0 && (
          <div className="v2-chapter-realExamplesBlock">
            <span className="v2-chapter-metaLine-label">{project.realExamplesLabel ?? 'Real cases'}</span>
            <ul className="v2-chapter-realExamples">
              {project.realExamples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
          </div>
        )}
        {/* The RECEIVE->CLEAN->...->GUARD sequence line is redundant once
            the real diagram sits right next to it (System 01 V3
            correction, 2026-08-09) — every other project still shows it,
            since only System 01 has a full six-node diagram immediately
            adjacent repeating the exact same information. */}
        {sequence && !project.systemLogicConcepts && <p className="v2-chapter-sequence">{sequence}</p>}
        {project.proofStats ? (
          <ProofStats stats={project.proofStats} />
        ) : (
          (project.keyNumber || project.keyLabel) && (
            <p className="v2-chapter-key">
              <span className="v2-chapter-key-number">{project.keyNumber}</span>{' '}
              <span className="v2-chapter-key-label">{project.keyLabel}</span>
            </p>
          )
        )}
        {/* System 01 V4 correction, 2026-08-09: the human-decision state
            line and "system structure"/"built with" moved OUT of the
            rail entirely — they're "how it's engineered" information,
            which now lives on the right side next to the workflow it
            actually describes (see systemControlStrip below). The rail
            keeps only identity/meaning/evidence/CTA. Projects without
            this restructuring (no systemControlStrip) keep the original
            plain tags list here, unchanged. */}
        {!project.systemControlStrip && project.tags.length > 0 && (
          <ul className="v2-chapter-tags">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        <div className="v2-chapter-cta">
          <Link to={`/ai/${project.id}`}>{project.detailCtaLabel ?? 'Read case notes →'}</Link>
        </div>
      </header>

      <div className="v2-chapter-workflowField">
        {/* Distinguishes the main page's conceptual decision flow from
            the detail page's real system architecture diagram (same
            correction pass) — only shown for projects with a detail
            page, since only those have a second, differently-scoped
            diagram it needs to be told apart from. */}
        {project.systemLogicConcepts && (
          <span className="v2-chapter-workflowLabel">{project.workflowFieldLabel ?? 'DECISION FLOW'}</span>
        )}
        <WorkflowDiagram workflow={buildWorkflowFromProject(project)} isActive={isActive} isScrolling={isScrolling} />
        {/* Hierarchy-rebuild pass, 2026-08-10: the full System Control
            block (SystemControlStrip, TEST/PRODUCTION/FAILURE cards +
            implementation line) was removed from the main chapter — it
            duplicated the detail page's own "04 / SYSTEM ARCHITECTURE"
            section (architectureCards carries near-identical content)
            and competed with the workflow/active-detail panel for
            reading attention on the main page. Replaced with one
            compact, project-authored line. Full data untouched — still
            fully present in systemControlStrip/architectureCards for
            the detail page. */}
        {project.controlSummaryLine && <p className="v2-chapter-controlSummary">{project.controlSummaryLine}</p>}
        {/* System 01 two-level storytelling pass, 2026-08-09: a project
            with systemLogicConcepts (i.e. it has a full detail page — see
            CaseStudyLayout.tsx) keeps the main chapter calm — no
            architecture cards, no example cases, no six-tab evidence
            accordion here. That content now lives on the detail page
            instead. Every project WITHOUT systemLogicConcepts (all of
            Systems 02-07 today) keeps the original evidence accordion on
            the main chapter, completely unchanged. */}
        {!project.systemLogicConcepts && (
          <EvidenceInspector entries={evidenceEntries} isActive={isActive} labelOverrides={project.evidenceLabelOverrides} />
        )}
      </div>
    </div>
  )
}
