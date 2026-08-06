import { useCallback, useEffect, useRef, useState } from 'react'
import type { WorkflowDefinition, WorkflowNode } from '../../data/workflowDiagram'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Reusable, data-driven workflow diagram — Pass W (Hero+Workflow
// correction pass v3.2, see
// PORTFOLIO_V2_INTERACTION_AND_WORKFLOW_BUILD_PROMPT.md). Retires the
// six-full-paragraph-cards presentation: each node now shows only its
// number/short title/tool/actor — an n8n-style compact node, not a
// documentation card — and the full stage description (`node.action`,
// the existing verified `stage.body` text, unchanged) lives in ONE
// shared "active detail" area below, showing exactly one stage at a
// time. Contains no project-specific literals, so a second project can
// reuse it later via buildWorkflowFromProject.
//
// First entrance auto-advances through the nodes once (node reveals,
// connector draws, next node reveals...), settling back on node 01.
// Hovering or focusing a node at any point — during or after the
// sequence — takes manual control and stops the automatic advance
// immediately, per the "no click required, hover/focus feels like a
// workflow" spec.
const SEQUENCE_STEP_MS = 640

export function WorkflowDiagram({ workflow }: { workflow: WorkflowDefinition }) {
  const [hasEntered, setHasEntered] = useState(false)
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()
  const userControlRef = useRef(false)
  const timersRef = useRef<number[]>([])

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
      }, i * SEQUENCE_STEP_MS)
      timersRef.current.push(id)
    })
    const endId = window.setTimeout(
      () => {
        if (userControlRef.current) return
        setActiveNodeId(workflow.nodes[0]?.id ?? null)
      },
      workflow.nodes.length * SEQUENCE_STEP_MS,
    )
    timersRef.current.push(endId)
  }, [clearTimers, workflow.nodes])

  useEffect(() => {
    if (reducedMotion) {
      setHasEntered(true)
      setActiveNodeId(workflow.nodes[0]?.id ?? null)
      return
    }
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true)
          runSequence()
          observer.disconnect() // fires once — no replay on scroll-by
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reducedMotion, runSequence, workflow.nodes])

  useEffect(() => clearTimers, [clearTimers])

  const selectStage = useCallback((id: string) => {
    userControlRef.current = true
    clearTimers()
    setActiveNodeId(id)
  }, [clearTimers])

  const handleReplay = useCallback(() => {
    if (reducedMotion) {
      setActiveNodeId(workflow.nodes[0]?.id ?? null)
      return
    }
    runSequence()
  }, [reducedMotion, runSequence, workflow.nodes])

  const activeStage: WorkflowNode | undefined =
    workflow.nodes.find((node) => node.id === activeNodeId) ?? workflow.nodes[0]

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
          const isActive = activeNodeId === node.id
          const prevNode = i > 0 ? workflow.nodes[i - 1] : null
          const connectorTouchesActive =
            activeNodeId !== null && (activeNodeId === node.id || activeNodeId === prevNode?.id)
          const connectorDimmed = activeNodeId !== null && !connectorTouchesActive
          return (
            <div className="v2-workflow-item" key={node.id} role="listitem">
              {i > 0 && (
                <div
                  className={`v2-workflow-connector${connectorDimmed ? ' v2-workflow-connector--dim' : ''}`}
                  // Was `i * 100ms` — far faster than the SEQUENCE_STEP_MS
                  // (640ms) the JS active-highlight sequence actually
                  // advances at, so all 6 nodes visually finished
                  // appearing (well under 1s) long before the highlight
                  // had cycled through even half of them — reading as
                  // "everything appears together," not "one by one." Now
                  // synced to the same cadence: the connector draws
                  // shortly BEFORE its node becomes active, matching the
                  // spec's "connector draws, then next node appears."
                  style={{ transitionDelay: hasEntered ? `${Math.max(0, i * SEQUENCE_STEP_MS - 150)}ms` : '0ms' }}
                  aria-hidden="true"
                />
              )}
              {/* Compact node — number/short title/tool/actor only. The
                  full description (node.action, the same verified
                  stage.body text as before) is NOT rendered here — it
                  moved to the single shared detail area below, per the
                  "one stable detail area, not a paragraph in every node"
                  correction. */}
              <button
                type="button"
                className={`v2-flowNode v2-flowNode--${node.actor.toLowerCase()}${
                  isActive ? ' v2-flowNode--active' : ''
                }`}
                style={{ transitionDelay: hasEntered ? `${i * SEQUENCE_STEP_MS}ms` : '0ms' }}
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

      {/* One shared active-detail area — the full stage description for
          whichever node is currently active, crossfading on switch via
          the `key`-remount CSS animation. Manual hover/focus (via
          selectStage) stops the automatic entrance sequence immediately
          and gives control to the user, per spec 7.8. */}
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
