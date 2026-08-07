import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/types'
import { Html } from './Html'
import { useReveal } from '../hooks/useReveal'
import { useWorkflowWalkthrough } from '../hooks/useWorkflowWalkthrough'
import { StageMedia } from './StageMedia'
import { ProjectLogicCard } from './ProjectLogicCard'
import { WorkflowWalkthrough } from './WorkflowWalkthrough'

function WorkflowStages({
  project,
  selectedStageNum,
  setSelectedStageNum,
}: {
  project: Project
  selectedStageNum: number | null
  setSelectedStageNum: (fn: (prev: number | null) => number | null) => void
}) {
  return (
    <div className="stages-wrap">
      <div className="stages-label">
        <span className="mono">{project.stagesLabel}</span>
        <span className="mono">{project.stageCountLabel}</span>
      </div>
      <ol className="stages">
        {project.stages.map((stage) => (
          <li className="stage-item" key={stage.num}>
            <button
              type="button"
              className={`${stage.actor === 'sys' ? 'stage' : `stage stage--${stage.actor}`}${
                selectedStageNum === stage.num ? ' stage--selected' : ''
              }`}
              aria-expanded={selectedStageNum === stage.num}
              aria-controls={`${project.id}-stage-${stage.num}`}
              onClick={() => setSelectedStageNum((prev) => (prev === stage.num ? null : stage.num))}
            >
              <span className="s-num">{stage.num}</span>
              <span className="s-marker" />
              <span className="s-body">
                <b>{stage.title}</b>
                <span>{stage.body}</span>
              </span>
              <span className={`s-actor s-actor--${stage.actor}`}>{stage.actorLabel}</span>
            </button>
            {selectedStageNum === stage.num && (
              <div id={`${project.id}-stage-${stage.num}`}>
                <StageMedia stage={stage} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  const { ref, className } = useReveal<HTMLElement>()
  const articleRef = useRef<HTMLElement | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [selectedStageNum, setSelectedStageNum] = useState<number | null>(null)
  const walkthrough = useWorkflowWalkthrough(project.stages)

  const setArticleRef = (el: HTMLElement | null) => {
    ref.current = el
    articleRef.current = el
  }

  // Compact layout: Problem/Workflow/Result reveal, workflow stages gated
  // behind "View workflow" too. Falls back to the older Goal/Logic/Build
  // evidence layout (stages always visible) for projects that don't have
  // the new short-form fields — currently Systems 05-07.
  const compact = Boolean(project.problemHtml || project.workflowHtml || project.resultShortHtml)

  // Interactive walkthrough (see 00_SYSTEM.md v19-v22) — true when all three
  // fields are present. Started with Project 01 only, then extended to all
  // 7 systems once each had truthful stage data to support it.
  const hasWalkthrough = Boolean(project.valueLine && project.miniRoadmap && project.proofChips)

  // Zip the card back to its default clean state — details closed, and
  // (for walkthrough projects) the "How it works" walkthrough reset —
  // once it's scrolled fully out of view. Keeps only the project the user
  // is actually looking at in an expanded/active state, instead of an
  // earlier project's finished walkthrough or open details sitting around
  // while browsing later ones. "hasBeenVisible" guards against the
  // observer's very first callback firing before an anchor-triggered
  // scroll has actually arrived, which would otherwise immediately
  // re-collapse a card someone just clicked open from the
  // systems-overview cards.
  //
  // This observer only ever resets state on exit — it never reads which
  // workflow step is active and never selects one. `walkthrough.reset` is
  // a stable (useCallback) reference, so this effect only re-runs on the
  // meaningful open/close transitions below, not on every autoplay tick.
  //
  // rootMargin shrinks the effective viewport by 15% on each edge — plain
  // threshold:0 alone can miscount a project as still "intersecting" when
  // it lands exactly edge-to-edge against an equally tall adjacent section
  // (both are full-viewport-height via CSS min-height), leaving ~0px of
  // residual overlap that still satisfies threshold:0. This margin gives a
  // real buffer so scrolling to the next project reliably resets this one,
  // without resetting prematurely while still mostly in view.
  useEffect(() => {
    if (!expanded && !walkthrough.started) return
    const el = articleRef.current
    if (!el) return
    let hasBeenVisible = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasBeenVisible = true
        } else if (hasBeenVisible) {
          setExpanded(false)
          walkthrough.reset()
        }
      },
      { threshold: 0, rootMargin: '-15% 0px -15% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [expanded, walkthrough.started, walkthrough.reset])

  return (
    <article
      ref={setArticleRef}
      id={project.id}
      className={`project ${className}${expanded ? '' : ' project--collapsed'}${compact ? ' project--compact' : ''}`}
      style={{ scrollMarginTop: '88px' }}
    >
      <div className="p-grid">
        <aside className="p-meta">
          <div className="p-meta-inner">
            {hasWalkthrough ? (
              <ProjectLogicCard
                project={project}
                expanded={expanded}
                onToggleDetails={() => setExpanded((v) => !v)}
                onStartWalkthrough={walkthrough.start}
              />
            ) : (
              <>
                <span className="mono">
                  System {String(project.index).padStart(2, '0')}
                  {' · '}
                  {project.tierLabel}
                </span>
                <div className="p-num">{String(project.index).padStart(2, '0')}</div>
                <Html as="h2" html={project.title} />
                <div className="tags">
                  {(compact ? project.tags.slice(0, 3) : project.tags).map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                {compact ? (
                  project.valueHtml && <Html as="p" className="p-tagline" html={project.valueHtml} />
                ) : project.whatItProvesHtml || project.productionSignalHtml ? (
                  <div className="p-proof">
                    {project.whatItProvesHtml && (
                      <>
                        <span className="mono">What it proves</span>
                        <Html as="p" html={project.whatItProvesHtml} />
                      </>
                    )}
                    {project.productionSignalHtml && (
                      <>
                        <span className="mono">Production signal</span>
                        <Html as="p" className="p-proof-signal" html={project.productionSignalHtml} />
                      </>
                    )}
                  </div>
                ) : project.taglineHtml ? (
                  <Html as="p" className="p-tagline" html={project.taglineHtml} />
                ) : (
                  <div className="p-key">
                    <div className="kn">{project.keyNumber}</div>
                    <div className="kl mono">{project.keyLabel}</div>
                  </div>
                )}
                <button
                  type="button"
                  className="view-details"
                  aria-expanded={expanded}
                  aria-controls={`${project.id}-details`}
                  onClick={() => setExpanded((v) => !v)}
                >
                  {expanded ? 'Hide details −' : 'View details ↓'}
                </button>
              </>
            )}
          </div>
        </aside>

        <div className="p-content">
          {/* Workflow diagram is always visible — "View details" only gates
              the extra Problem/Result prose below, not this. */}
          {hasWalkthrough ? (
            <WorkflowWalkthrough project={project} walkthrough={walkthrough} />
          ) : (
            <WorkflowStages project={project} selectedStageNum={selectedStageNum} setSelectedStageNum={setSelectedStageNum} />
          )}

          <div
            id={`${project.id}-details`}
            className={`expand-panel${expanded ? ' expand-panel--open' : ''}`}
            aria-hidden={!expanded}
          >
            {compact ? (
              <dl className="gmr">
                <dt className="mono">Problem</dt>
                <Html as="dd" html={project.problemHtml ?? ''} />
                <dt className="mono">Workflow</dt>
                <Html as="dd" html={project.workflowHtml ?? ''} />
                <dt className="mono">Result</dt>
                <Html as="dd" html={project.resultShortHtml ?? ''} />
              </dl>
            ) : (
              <>
                {project.taglineHtml && (
                  <div className="p-key p-key--inline">
                    <div className="kn">{project.keyNumber}</div>
                    <div className="kl mono">{project.keyLabel}</div>
                  </div>
                )}
                <dl className="gmr">
                  <dt className="mono">Goal</dt>
                  <Html as="dd" html={project.goalHtml} />
                  <dt className="mono">Logic</dt>
                  <Html as="dd" html={project.methodHtml} />
                  <dt className="mono">Build evidence</dt>
                  <Html as="dd" html={project.resultHtml} />
                  {project.failureHandledHtml && (
                    <>
                      <dt className="mono">Failure handled</dt>
                      <Html as="dd" html={project.failureHandledHtml} />
                    </>
                  )}
                  {project.decisionHtml && (
                    <>
                      <dt className="mono">Decision</dt>
                      <Html as="dd" html={project.decisionHtml} />
                    </>
                  )}
                  {project.limitationHtml && (
                    <>
                      <dt className="mono">Limitation</dt>
                      <Html as="dd" html={project.limitationHtml} />
                    </>
                  )}
                </dl>
              </>
            )}

            {project.transferHeading && project.transferItems && (
              <div className="transfer-block">
                <span className="mono mono--accent">{project.transferHeading}</span>
                <ul>
                  {project.transferItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
