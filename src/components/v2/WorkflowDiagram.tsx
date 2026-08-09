import { useCallback, useEffect, useRef, useState } from 'react'
import type { WorkflowDefinition, WorkflowNode } from '../../data/workflowDiagram'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Correction batch §A/§E — workflow autoplay is now driven entirely by
// the chapter's own single-owner active/scrolling state (from
// useChapterRollState.ts), not an independent IntersectionObserver.
//
// - autoplay only ever starts once this chapter is the single ACTIVE
//   one AND the page is not currently scrolling, and only after a short
//   settle delay past that point;
// - if scrolling resumes mid-sequence, all pending timers are cancelled
//   immediately;
// - when this chapter stops being active, everything resets to node 01
//   and every timer is cleared, so a return visit replays cleanly;
// - manual hover/focus on a node takes control immediately and stays
//   that way until Replay Workflow is clicked or the chapter is
//   re-entered.
//
// Direct correction (2nd pass): the sequence used to end by jumping back
// to node 01 automatically — removed. It now plays through once and
// holds on the final node indefinitely; node 01 only returns via
// chapter exit/re-entry or Replay Workflow. The per-node CSS entrance
// stagger (previously `i * 140ms`, before that `i * 90ms`) was a SECOND,
// competing animation rhythm running alongside the autoplay highlight —
// removed entirely. All node boxes are calmly visible together the
// moment the diagram enters; only the active-node highlight, the
// connector immediately behind it, and the shared detail content
// advance from there.
const WORKFLOW_SETTLE_DELAY_MS = 400
const INITIAL_NODE_HOLD_MS = 1000
const WORKFLOW_STEP_MS = 1400
const CONNECTOR_LEAD_MS = 180
const DETAIL_UPDATE_DELAY_MS = 260

export function WorkflowDiagram({
  workflow,
  // Optional, defaulting to "always active, never scrolling" — the
  // standalone case-study route (CaseStudyLayout.tsx) renders a
  // WorkflowDiagram outside any StoryPage/useChapterRollState context,
  // so it keeps this default behavior. Only SystemChapter.tsx (the main
  // /ai overview route) passes real values from the shared engine.
  isActive = true,
  isScrolling = false,
}: {
  workflow: WorkflowDefinition
  isActive?: boolean
  isScrolling?: boolean
}) {
  const [hasEntered, setHasEntered] = useState(false)
  const [activeNodeId, setActiveNodeId] = useState<string | null>(workflow.nodes[0]?.id ?? null)
  const [activeConnectorId, setActiveConnectorId] = useState<string | null>(null)
  const [displayedNodeId, setDisplayedNodeId] = useState<string | null>(workflow.nodes[0]?.id ?? null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()
  const userControlRef = useRef(false)
  const timersRef = useRef<number[]>([])
  const wasActiveRef = useRef(false)
  // Real bug, confirmed by direct feedback: onPointerEnter below took
  // manual control PERMANENTLY (per the old file comment: "stays that
  // way until Replay Workflow is clicked or the chapter is re-entered")
  // — so a mouse cursor merely resting on or passing over any single
  // node while scrolling silently killed autoplay for the rest of that
  // visit, with no visible error and no way back short of leaving and
  // re-entering the whole chapter. Fixed by resuming autoplay a short
  // beat after the pointer actually leaves the node area, instead of
  // requiring an explicit Replay click. isHoveringRef tracks whether the
  // pointer is still over any node right now; the resume timer only
  // actually restarts the sequence if it's genuinely still clear when it
  // fires (guards against a fast re-hover of a different node).
  const isHoveringRef = useRef(false)
  const resumeTimerRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current != null) {
      window.clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
  }, [])

  const runSequence = useCallback(() => {
    clearTimers()
    userControlRef.current = false
    setActiveNodeId(workflow.nodes[0]?.id ?? null)
    setActiveConnectorId(null)

    let cumulative = INITIAL_NODE_HOLD_MS
    workflow.nodes.forEach((node, i) => {
      if (i === 0) return
      const connectorTime = cumulative
      const nodeTime = cumulative + CONNECTOR_LEAD_MS
      const connectorTimerId = window.setTimeout(() => {
        if (userControlRef.current) return
        setActiveConnectorId(node.id)
      }, connectorTime)
      const nodeTimerId = window.setTimeout(() => {
        if (userControlRef.current) return
        setActiveNodeId(node.id)
      }, nodeTime)
      timersRef.current.push(connectorTimerId, nodeTimerId)
      cumulative += WORKFLOW_STEP_MS
    })
    // No end-of-sequence reset — the last scheduled setActiveNodeId call
    // above (for the final node) is the sequence's last effect. The
    // diagram holds there.
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
      clearResumeTimer()
      userControlRef.current = false
      isHoveringRef.current = false
      wasActiveRef.current = false
      setActiveNodeId(workflow.nodes[0]?.id ?? null)
      setActiveConnectorId(null)
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
    }, WORKFLOW_SETTLE_DELAY_MS)
    timersRef.current.push(settleTimer)
    return () => window.clearTimeout(settleTimer)
  }, [isActive, isScrolling, reducedMotion, hasEntered, clearTimers, clearResumeTimer, runSequence, workflow.nodes])

  useEffect(() => {
    return () => {
      clearTimers()
      clearResumeTimer()
    }
  }, [clearTimers, clearResumeTimer])

  // Detail rail updates a short beat after the node itself activates.
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
      isHoveringRef.current = true
      clearResumeTimer()
      userControlRef.current = true
      clearTimers()
      setActiveNodeId(id)
      setActiveConnectorId(id)
    },
    [clearTimers, clearResumeTimer],
  )

  // Real bug fix, continued: fires when the pointer leaves the node row
  // entirely (not per-node — moving between adjacent nodes shouldn't
  // trigger this). After a short pause — long enough to have genuinely
  // finished looking at a node, not a passing brush — resumes autoplay
  // from the top, same as clicking Replay, but only if the pointer is
  // still clear of every node when the timer actually fires (a fast
  // re-hover of a different node cancels it via clearResumeTimer above).
  const RESUME_DELAY_MS = 900
  const handleContainerPointerLeave = useCallback(() => {
    isHoveringRef.current = false
    clearResumeTimer()
    if (!userControlRef.current || reducedMotion) return
    resumeTimerRef.current = window.setTimeout(() => {
      resumeTimerRef.current = null
      if (isHoveringRef.current) return
      runSequence()
    }, RESUME_DELAY_MS)
  }, [clearResumeTimer, reducedMotion, runSequence])

  const handleReplay = useCallback(() => {
    clearResumeTimer()
    if (reducedMotion) {
      setActiveNodeId(workflow.nodes[0]?.id ?? null)
      return
    }
    runSequence()
  }, [reducedMotion, runSequence, workflow.nodes, clearResumeTimer])

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
        onPointerLeave={handleContainerPointerLeave}
      >
        {workflow.nodes.map((node, i) => {
          const isNodeActive = activeNodeId === node.id
          const prevNode = i > 0 ? workflow.nodes[i - 1] : null
          const connectorTouchesActive =
            activeConnectorId !== null && (activeConnectorId === node.id || activeConnectorId === prevNode?.id)
          const connectorDimmed = activeConnectorId !== null && !connectorTouchesActive
          return (
            <div className="v2-workflow-item" key={node.id} role="listitem">
              {i > 0 && (
                <div
                  className={`v2-workflow-connector${connectorDimmed ? ' v2-workflow-connector--dim' : ''}`}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                className={`v2-flowNode v2-flowNode--${node.actor.toLowerCase()}${
                  isNodeActive ? ' v2-flowNode--active' : ''
                }`}
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
