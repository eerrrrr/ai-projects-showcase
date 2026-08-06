import { useCallback, useEffect, useRef, useState } from 'react'
import type { WorkflowDefinition, WorkflowNode } from '../../data/workflowDiagram'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Correction batch §A/§E — workflow autoplay is now driven entirely by
// the chapter's own single-owner active/scrolling state (from
// useChapterRollState.ts), not an independent IntersectionObserver.
// Previously this component decided for itself when to start (first time
// 30% visible) and never stopped or reset — so it could keep animating
// while the page was still scrolling past it, and never replayed on a
// return visit. Now:
//
// - autoplay only ever starts once this chapter is the single ACTIVE
//   one AND the page is not currently scrolling, and only after a short
//   settle delay past that point;
// - if scrolling resumes mid-sequence, all pending timers are cancelled
//   immediately — it does not keep changing nodes behind a page
//   transition;
// - when this chapter stops being active, everything resets to node 01
//   and every timer is cleared, so a return visit replays cleanly
//   instead of resuming a stale sequence;
// - manual hover/focus on a node still takes control immediately and
//   stays that way until Replay Workflow is clicked or the chapter is
//   re-entered (leaving and coming back resets `userControlRef`).
const WORKFLOW_SETTLE_DELAY = 220
const WORKFLOW_STEP_MS = 600
const DETAIL_UPDATE_DELAY_MS = 130

export function WorkflowDiagram({
  workflow,
  // Optional, defaulting to "always active, never scrolling" — the
  // standalone case-study route (CaseStudyLayout.tsx) and the
  // superseded FeaturedCaseSection.tsx render a WorkflowDiagram outside
  // any StoryPage/useChapterRollState context, so they keep their
  // original "autoplay once visible" behavior unchanged. Only
  // SystemChapter.tsx (the main /ai route) passes real values from the
  // shared engine.
  isActive = true,
  isScrolling = false,
}: {
  workflow: WorkflowDefinition
  isActive?: boolean
  isScrolling?: boolean
}) {
  const [hasEntered, setHasEntered] = useState(false)
  const [activeNodeId, setActiveNodeId] = useState<string | null>(workflow.nodes[0]?.id ?? null)
  const [displayedNodeId, setDisplayedNodeId] = useState<string | null>(workflow.nodes[0]?.id ?? null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()
  const userControlRef = useRef(false)
  const timersRef = useRef<number[]>([])
  const wasActiveRef = useRef(false)

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const runSequence = useCallback(() => {
    clearTimers()
    userControlRef.current = false
    workflow.nodes.forEach((node, i) => {
      const id = window.setTimeout(() => {
        if (userControlRef.current) return
        setActiveNodeId(node.id)
      }, i * WORKFLOW_STEP_MS)
      timersRef.current.push(id)
    })
    const endId = window.setTimeout(
      () => {
        if (userControlRef.current) return
        setActiveNodeId(workflow.nodes[0]?.id ?? null)
      },
      workflow.nodes.length * WORKFLOW_STEP_MS,
    )
    timersRef.current.push(endId)
  }, [clearTimers, workflow.nodes])

  // Single-owner autoplay gating — see the file-level comment above.
  useEffect(() => {
    if (reducedMotion) {
      setHasEntered(true)
      setActiveNodeId(workflow.nodes[0]?.id ?? null)
      return
    }

    if (!isActive) {
      clearTimers()
      userControlRef.current = false
      wasActiveRef.current = false
      setActiveNodeId(workflow.nodes[0]?.id ?? null)
      return
    }

    const justBecameActive = !wasActiveRef.current
    wasActiveRef.current = true

    if (isScrolling) {
      clearTimers()
      return
    }

    // Already settled and playing/played this visit — nothing to do.
    if (!justBecameActive && hasEntered) return

    const settleTimer = window.setTimeout(() => {
      setHasEntered(true)
      runSequence()
    }, WORKFLOW_SETTLE_DELAY)
    timersRef.current.push(settleTimer)
    return () => window.clearTimeout(settleTimer)
  }, [isActive, isScrolling, reducedMotion, hasEntered, clearTimers, runSequence, workflow.nodes])

  useEffect(() => clearTimers, [clearTimers])

  // §E — detail rail updates a short beat after the node itself
  // activates, rather than in the exact same tick, so the eye reads
  // "node activated, then its explanation appeared" instead of both
  // happening simultaneously.
  useEffect(() => {
    if (reducedMotion) {
      setDisplayedNodeId(activeNodeId)
      return
    }
    const id = window.setTimeout(() => setDisplayedNodeId(activeNodeId), DETAIL_UPDATE_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [activeNodeId, reducedMotion])

  const selectStage = useCallback(
    (id: string) => {
      userControlRef.current = true
      clearTimers()
      setActiveNodeId(id)
    },
    [clearTimers],
  )

  const handleReplay = useCallback(() => {
    if (reducedMotion) {
      setActiveNodeId(workflow.nodes[0]?.id ?? null)
      return
    }
    runSequence()
  }, [reducedMotion, runSequence, workflow.nodes])

  const activeStage: WorkflowNode | undefined =
    workflow.nodes.find((node) => node.id === displayedNodeId) ?? workflow.nodes[0]

  return (
    <div>
      <div
        ref={containerRef}
        className={`v2-workflow${hasEntered ? ' v2-workflow--entered' : ''}${
          reducedMotion ? ' v2-workflow--instant' : ''
        }`}
        role="list"
        aria-label={`${workflow.title} workflow, ${workflow.nodes.length} steps`}
      >
        {workflow.nodes.map((node, i) => {
          const isNodeActive = activeNodeId === node.id
          const prevNode = i > 0 ? workflow.nodes[i - 1] : null
          const connectorTouchesActive =
            activeNodeId !== null && (activeNodeId === node.id || activeNodeId === prevNode?.id)
          const connectorDimmed = activeNodeId !== null && !connectorTouchesActive
          return (
            <div className="v2-workflow-item" key={node.id} role="listitem">
              {i > 0 && (
                <div
                  className={`v2-workflow-connector${connectorDimmed ? ' v2-workflow-connector--dim' : ''}`}
                  style={{ transitionDelay: hasEntered ? `${Math.max(0, i * 90)}ms` : '0ms' }}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                className={`v2-flowNode v2-flowNode--${node.actor.toLowerCase()}${
                  isNodeActive ? ' v2-flowNode--active' : ''
                }`}
                style={{ transitionDelay: hasEntered ? `${Math.max(0, i * 90)}ms` : '0ms' }}
                onPointerEnter={() => selectStage(node.id)}
                onFocus={() => selectStage(node.id)}
                aria-describedby={`${workflow.id}-detail`}
              >
                <span className="v2-flowNode__port v2-flowNode__port--in" aria-hidden="true" />
                <span className="v2-flowNode__number">{node.number}</span>
                <strong className="v2-flowNode__title">{node.title}</strong>
                {node.tool && <span className="v2-flowNode__tool">{node.tool}</span>}
                <span className="v2-flowNode__actor">{node.actor}</span>
                <span className="v2-flowNode__port v2-flowNode__port--out" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>

      <div className="v2-workflow-detail" id={`${workflow.id}-detail`} aria-live="polite">
        {activeStage && (
          <div className="v2-workflow-detail-content" key={activeStage.id}>
            <span className="v2-workflow-detail-number">
              {activeStage.number} / {activeStage.title.toUpperCase()}
            </span>
            {activeStage.action && <p className="v2-workflow-detail-body">{activeStage.action}</p>}
          </div>
        )}
      </div>

      <button type="button" className="v2-workflow-replay" onClick={handleReplay}>
        REPLAY WORKFLOW ↻
      </button>
    </div>
  )
}
