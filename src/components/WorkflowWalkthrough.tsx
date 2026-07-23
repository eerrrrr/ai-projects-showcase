import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/types'
import { StageMedia } from './StageMedia'

type PlayState = 'idle' | 'playing' | 'paused' | 'done'

const NODE_REVEAL_MS = 300
const STEP_DWELL_MS = 1400

// Coded, data-driven workflow walkthrough — no PNG diagrams, no fake canvas,
// no animation library. CSS transitions + a small timer-driven state
// machine only. One major step active at a time; its mini-nodes reveal
// progressively during autoplay, then the step collapses to a completed
// state before the next one opens. Ends on a static recap, no looping.
export function WorkflowWalkthrough({ project }: { project: Project }) {
  const stages = project.stages
  const [playState, setPlayState] = useState<PlayState>('idle')
  const [activeStep, setActiveStep] = useState(0)
  const [revealedCount, setRevealedCount] = useState(0)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [reduceMotion, setReduceMotion] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Autoplay driver: only runs while playState === 'playing'. Reveals mini
  // nodes one at a time, dwells on the finished step, then advances.
  useEffect(() => {
    if (playState !== 'playing') return
    const stage = stages[activeStep]
    const nodeCount = stage.miniNodes?.length ?? 0

    if (revealedCount < nodeCount) {
      timerRef.current = setTimeout(() => setRevealedCount((n) => n + 1), NODE_REVEAL_MS)
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    }

    timerRef.current = setTimeout(() => {
      setCompleted((prev) => new Set(prev).add(activeStep))
      if (activeStep >= stages.length - 1) {
        setPlayState('done')
      } else {
        setActiveStep((s) => s + 1)
        setRevealedCount(0)
      }
    }, STEP_DWELL_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [playState, activeStep, revealedCount, stages])

  const start = () => {
    setCompleted(new Set())
    setActiveStep(0)
    setRevealedCount(reduceMotion ? (stages[0].miniNodes?.length ?? 0) : 0)
    setPlayState(reduceMotion ? 'paused' : 'playing')
  }

  const pause = () => setPlayState('paused')
  const resume = () => {
    if (playState === 'done') return
    setPlayState(reduceMotion ? 'paused' : 'playing')
  }

  // Accepts a target index or an updater reading the latest step — the
  // updater form is what Next/Previous use so rapid clicks each read fresh
  // state instead of the value closed over at render time.
  const jumpTo = (indexOrFn: number | ((prev: number) => number)) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setPlayState('paused')
    setActiveStep((prevStep) => {
      const target = typeof indexOrFn === 'function' ? indexOrFn(prevStep) : indexOrFn
      const clamped = Math.max(0, Math.min(stages.length - 1, target))
      setCompleted((prev) => {
        const next = new Set(prev)
        for (let i = 0; i < clamped; i++) next.add(i)
        for (let i = clamped; i < stages.length; i++) next.delete(i)
        return next
      })
      setRevealedCount(stages[clamped].miniNodes?.length ?? 0)
      return clamped
    })
  }

  // Marks the last step done and shows the recap — the only way to reach
  // 'done' outside autoplay. Needed because Next disables at the last step
  // and, under reduced motion, Play/resume is a no-op (reduceMotion keeps
  // playState at 'paused'), so without this a manual walkthrough could reach
  // the last step but never see the recap.
  const finish = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setCompleted((prev) => new Set(prev).add(stages.length - 1))
    setPlayState('done')
  }

  const isActive = playState !== 'idle'
  const isLastStep = activeStep >= stages.length - 1
  const activeStage = stages[activeStep]

  return (
    <div className="walkthrough">
      <div className="stages-label">
        <span className="mono">{project.stagesLabel}</span>
        <span className="mono">{project.stageCountLabel}</span>
      </div>

      <ol className="w-spine">
        {stages.map((stage, i) => {
          const state = playState === 'done' || completed.has(i) ? 'done' : i === activeStep && isActive ? 'active' : 'pending'
          return (
            <li
              key={stage.num}
              className={`w-step w-step--${state}`}
              role="button"
              tabIndex={0}
              onClick={() => jumpTo(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  jumpTo(i)
                }
              }}
            >
              <span className="w-step-num">{state === 'done' ? '✓' : stage.num}</span>
              <span className="w-step-title">{stage.title}</span>
              <span className={`s-actor s-actor--${stage.actor}`}>{stage.actorLabel}</span>
            </li>
          )
        })}
      </ol>

      {isActive && (
        <div className="w-active-panel">
          <div className="w-mini-nodes">
            {(activeStage.miniNodes ?? []).map((node, i) => (
              <span key={node} className={`w-mini-node${i < revealedCount ? ' w-mini-node--in' : ''}`}>
                {node}
              </span>
            ))}
          </div>
          <p className="w-explanation">{activeStage.body}</p>
          <StageMedia stage={activeStage} />
        </div>
      )}

      {playState === 'done' && project.finalRoadmap && (
        <div className="w-recap">
          <span className="mono mono--accent">Roadmap recap</span>
          <p className="w-recap-flow">{project.finalRoadmap}</p>
          {project.finalTakeaway && <p className="w-recap-takeaway">{project.finalTakeaway}</p>}
        </div>
      )}

      <div className="w-controls">
        {!isActive ? (
          <button type="button" className="w-btn w-btn--primary" onClick={start}>
            How it works ▶
          </button>
        ) : (
          <>
            {playState === 'playing' ? (
              <button type="button" className="w-btn" onClick={pause}>
                Pause
              </button>
            ) : (
              <button type="button" className="w-btn" onClick={resume} disabled={playState === 'done'}>
                {playState === 'done' ? 'Finished' : 'Play'}
              </button>
            )}
            <button type="button" className="w-btn" onClick={() => jumpTo((s) => s - 1)} disabled={activeStep === 0 && playState !== 'done'}>
              Previous
            </button>
            <button
              type="button"
              className="w-btn"
              onClick={() => (isLastStep ? finish() : jumpTo((s) => s + 1))}
              disabled={playState === 'done'}
            >
              {isLastStep ? 'Finish' : 'Next'}
            </button>
            <button type="button" className="w-btn" onClick={start}>
              Restart
            </button>
          </>
        )}
      </div>
    </div>
  )
}
