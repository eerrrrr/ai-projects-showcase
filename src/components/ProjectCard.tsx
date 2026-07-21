import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/types'
import { Html } from './Html'
import { useReveal } from '../hooks/useReveal'
import { StageMedia } from './StageMedia'

export function ProjectCard({ project }: { project: Project }) {
  const { ref, className } = useReveal<HTMLElement>()
  const articleRef = useRef<HTMLElement | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [selectedStageNum, setSelectedStageNum] = useState<number | null>(null)
  const selectedStage = project.stages.find((s) => s.num === selectedStageNum)

  const setArticleRef = (el: HTMLElement | null) => {
    ref.current = el
    articleRef.current = el
  }

  // Clicking a ProofSummary link (or loading with a direct #id URL) should
  // expand this card, not just scroll to it.
  useEffect(() => {
    function checkHash() {
      if (window.location.hash === `#${project.id}`) setExpanded(true)
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [project.id])

  // Zip the detail back up once the card has scrolled fully out of view —
  // "hasBeenVisible" guards against the observer's very first callback
  // firing before an anchor-triggered scroll has actually arrived, which
  // would otherwise immediately re-collapse a card someone just clicked
  // open from the systems-overview cards.
  useEffect(() => {
    if (!expanded) return
    const el = articleRef.current
    if (!el) return
    let hasBeenVisible = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasBeenVisible = true
        } else if (hasBeenVisible) {
          setExpanded(false)
        }
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [expanded])

  return (
    <article
      ref={setArticleRef}
      id={project.id}
      className={`project ${className}${expanded ? '' : ' project--collapsed'}`}
      style={{ scrollMarginTop: '88px' }}
    >
      <div className="p-grid">
        <aside className="p-meta">
          <div className="p-meta-inner">
            <span className="mono">
              Project {String(project.index).padStart(2, '0')} / {String(project.total).padStart(2, '0')}
              {' · '}
              {project.tierLabel}
            </span>
            <div className="p-num">{String(project.index).padStart(2, '0')}</div>
            <Html as="h3" html={project.title} />
            <div className="tags">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            {project.whatItProvesHtml || project.productionSignalHtml ? (
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
            <button type="button" className="view-details" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Hide details −' : 'View details ↓'}
            </button>
          </div>
        </aside>

        <div className="p-content">
          {/* Workflow preview — always visible, collapsed or expanded. This
              is the "what does it actually do" proof; Goal/Method/Result
              below is the "how I think about it" explanation, opt-in. */}
          <div className="stages-wrap">
            <div className="stages-label">
              <span className="mono">{project.stagesLabel}</span>
              <span className="mono">{project.stageCountLabel}</span>
            </div>
            <ol className="stages">
              {project.stages.map((stage) => (
                <li
                  className={`${stage.actor === 'sys' ? 'stage' : `stage stage--${stage.actor}`}${
                    selectedStageNum === stage.num ? ' stage--selected' : ''
                  }`}
                  key={stage.num}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedStageNum((prev) => (prev === stage.num ? null : stage.num))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedStageNum((prev) => (prev === stage.num ? null : stage.num))
                    }
                  }}
                >
                  <span className="s-num">{stage.num}</span>
                  <span className="s-marker" />
                  <div className="s-body">
                    <b>{stage.title}</b>
                    <span>{stage.body}</span>
                  </div>
                  <span className={`s-actor s-actor--${stage.actor}`}>{stage.actorLabel}</span>
                </li>
              ))}
            </ol>
            {selectedStage && <StageMedia stage={selectedStage} />}
          </div>

          {expanded && (
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

              {project.transferHeading && project.transferItems && (
                <details className="transfer">
                  <summary>
                    <span className="plus">+</span>
                    <span className="mono mono--accent">{project.transferHeading}</span>
                  </summary>
                  <div className="t-body">
                    <ul>
                      {project.transferItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  )
}
