import { useCallback, useEffect, useRef, useState } from 'react'
import type { Stage } from '../data/types'

// 3600ms — enough time to actually read the marker, title, description and
// mini-node chips before the step folds and the next one opens (1800ms was
// too fast to be a readable animated diagram, more like a fast slideshow).
export const STEP_DWELL_MS = 3600

// Timer-driven autoplay walkthrough, exclusive accordion: only one step's
// panel is open at a time — the previous one folds the moment the next one
// opens. "How it works" starts autoplay from step 1 and it runs on its own
// through step 4, then stops on the recap. Clicking any row directly jumps
// straight to it and pauses autoplay — no PLAY/PAUSE/NEXT/PREVIOUS/RESTART
// buttons; "How it works" itself is the only entry point, and clicking it
// again always restarts from step 1. `reset()` exists for ProjectCard to
// call when this project scrolls out of view, so a finished/mid-autoplay
// walkthrough doesn't stay visually open on a project the user has left.
//
// Deliberately does not use scroll, wheel, or IntersectionObserver for
// anything — a scroll-driven version of this was tried twice earlier this
// session and reverted both times after repeatedly conflicting with
// whole-page scroll behavior (a separate wheel controller, CSS scroll-snap,
// both since removed). This version only uses React state + setTimeout.
export function useWorkflowWalkthrough(stages: Stage[]) {
  const [started, setStarted] = useState(false)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [isPlaying, setIsPlaying] = useState(false)
  const [runId, setRunId] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Opens exactly one step and folds the rest — steps before it are marked
  // completed (checkmark, no panel), steps at or after it are not.
  const goTo = (index: number) => {
    setActiveStep(index)
    setCompleted(() => {
      const next = new Set<number>()
      for (let i = 0; i < index; i++) next.add(i)
      return next
    })
  }

  // Autoplay driver: only runs while isPlaying. Dwells on the active step,
  // then either advances to the next one or — on the last step — marks it
  // completed and stops.
  useEffect(() => {
    if (!isPlaying || activeStep === null) return
    const isLastStep = activeStep >= stages.length - 1

    timerRef.current = setTimeout(() => {
      if (isLastStep) {
        setCompleted((prev) => new Set(prev).add(activeStep))
        setIsPlaying(false)
      } else {
        goTo(activeStep + 1)
      }
    }, STEP_DWELL_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isPlaying, activeStep, stages.length])

  // Entry point — always restarts from step 1, whether this is the first
  // click or the walkthrough was already mid-autoplay or paused. Stable
  // identity (useCallback, no deps — goTo and the setState functions never
  // change) so callers depending on it in an effect array don't get
  // needless re-runs.
  const start = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setRunId((value) => value + 1)
    setStarted(true)
    setIsPlaying(true)
    goTo(0)
  }, [])

  // Clicking a row jumps straight to it and pauses autoplay — the panel
  // stays open until the user clicks elsewhere; it doesn't resume playing
  // on its own.
  const jumpTo = useCallback((index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setStarted(true)
    setIsPlaying(false)
    goTo(index)
  }, [])

  // Returns to the untouched default state — nothing started, no step
  // open, nothing completed. Used when this project's card scrolls out of
  // view; not part of the autoplay sequence itself.
  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setStarted(false)
    setIsPlaying(false)
    setActiveStep(null)
    setCompleted(new Set())
  }, [])

  const isDone = started && activeStep === stages.length - 1

  return {
    started,
    activeStep,
    completed,
    isDone,
    isPlaying,
    runId,
    start,
    jumpTo,
    reset,
  }
}

export type WorkflowWalkthroughState = ReturnType<typeof useWorkflowWalkthrough>
