import { useEffect } from 'react'
import { useReducedMotion } from './useReducedMotion'

// Final motion-polish batch — replaces the previous continuous
// scroll-scrubbed lerp (which let opacity sink as low as 0.35, read as a
// pale "ghost" page in the real recording) with a discrete
// before/active/after state machine. JS only classifies which state each
// section is in and toggles one data attribute; all actual animation
// (duration, easing, the opacity/translateY values themselves) lives in
// CSS as real `transition`s — smoother and more predictable than writing
// interpolated values on every scroll event, and it directly addresses
// the "workflow lags behind scrolling" complaint since the browser's own
// transition engine, not a per-frame JS write, now owns the motion.
export function useStoryRollEngine() {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const stages = Array.from(document.querySelectorAll<HTMLElement>('.v2-storyPage-stage'))
    if (stages.length === 0) return

    let rafId: number | null = null
    let dirty = true
    const onScroll = () => {
      dirty = true
    }

    const tick = () => {
      if (dirty) {
        dirty = false
        const viewportH = window.innerHeight
        for (const stage of stages) {
          const parent = stage.parentElement
          if (!parent) continue
          const rect = parent.getBoundingClientRect()
          const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - viewportH)))
          const state = progress < 0.22 ? 'before' : progress > 0.78 ? 'after' : 'active'
          if (stage.dataset.storyState !== state) stage.dataset.storyState = state
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [reducedMotion])
}
