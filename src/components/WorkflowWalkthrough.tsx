import { Fragment } from 'react'
import type { Project } from '../data/types'
import { StageMedia } from './StageMedia'
import {
  STEP_DWELL_MS,
  type WorkflowWalkthroughState,
} from '../hooks/useWorkflowWalkthrough'

// Coded, data-driven workflow walkthrough display — no PNG diagrams, no fake
// canvas, no animation library, no manual step player. State comes from
// useWorkflowWalkthrough (owned by ProjectCard, shared with the "How it
// works" trigger on ProjectLogicCard) — this component only renders it.
//
// Every row always shows its title + one-line explanation, same as the
// static workflow list on non-walkthrough projects. Clicking "How it works"
// (left column) or a row directly expands that row's mini-nodes + proof
// capture as an accordion panel directly under it — exclusive accordion:
// only one panel is open at a time, the previous step folds the moment the
// next one opens.
//
// Row visual grammar deliberately matches the archive's static .stage rows
// (number + spine + shape marker + title/desc + actor label) — the stage
// number never becomes a checkmark; active/done state is carried by the
// marker shape/colour instead, same principle as .stage--selected.
export function WorkflowWalkthrough({
  project,
  walkthrough,
}: {
  project: Project
  walkthrough: WorkflowWalkthroughState
}) {
  const stages = project.stages
  const { activeStep, completed, isDone, isPlaying, jumpTo, runId } = walkthrough
  const pausedProgress =
    activeStep === null || stages.length < 2
      ? 0
      : (activeStep / (stages.length - 1)) * 100

  return (
    <div className="walkthrough">
      <div className="stages-label">
        <span className="mono">{project.stagesLabel}</span>
        <span className="mono">{project.stageCountLabel}</span>
      </div>

      <div
        className={`w-spine-shell${isPlaying ? ' w-spine-shell--playing' : ''}`}
        style={{
          '--walkthrough-total': `${STEP_DWELL_MS * stages.length}ms`,
          '--walkthrough-paused-progress': `${pausedProgress}%`,
        } as React.CSSProperties}
      >
        <span className="w-spine-track" aria-hidden="true">
          <span key={runId} className="w-spine-progress" />
        </span>
        <ol className="w-spine">
          {stages.map((stage, i) => {
          const isOpen = i === activeStep
          const isCompleted = completed.has(i)
          return (
            <Fragment key={stage.num}>
              <li
                className={`w-step${stage.actor === 'sys' ? '' : ` w-step--${stage.actor}`}${isOpen ? ' w-step--active' : ''}${isOpen && isPlaying ? ' w-step--playing' : ''}${isCompleted ? ' w-step--done' : ''}`}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-controls={`${project.id}-walkthrough-${stage.num}`}
                onClick={() => jumpTo(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    jumpTo(i)
                  }
                }}
              >
                <span className="w-step-num">{stage.num}</span>
                <span className="w-step-marker" />
                <div className="w-step-body">
                  <span className="w-step-title">{stage.title}</span>
                  <span className="w-step-desc">{stage.body}</span>
                </div>
                <span className={`s-actor s-actor--${stage.actor}`}>{stage.actorLabel}</span>
              </li>
              {isOpen && (stage.miniNodes?.length || stage.image) && (
                <li
                  id={`${project.id}-walkthrough-${stage.num}`}
                  className="w-active-panel"
                >
                  {stage.miniNodes && (
                    <div className="w-mini-nodes">
                      {stage.miniNodes.map((node) => (
                        <span key={node} className="w-mini-node w-mini-node--in">
                          {node}
                        </span>
                      ))}
                    </div>
                  )}
                  <StageMedia stage={stage} />
                </li>
              )}
            </Fragment>
          )
          })}
        </ol>
      </div>

      {isDone && project.finalRoadmap && (
        <div className="w-recap">
          <span className="mono mono--accent">Roadmap recap</span>
          <p className="w-recap-flow">{project.finalRoadmap}</p>
          {project.finalTakeaway && <p className="w-recap-takeaway">{project.finalTakeaway}</p>}
        </div>
      )}
    </div>
  )
}
