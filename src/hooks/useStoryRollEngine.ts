import { useEffect } from 'react'
import { useReducedMotion } from './useReducedMotion'

// PASS-consolidated §B — the actual sticky-stage rise/recede engine, on
// top of the scroll-snap-align already in place. Previously each
// StoryPage just sat in normal flow with a soft snap point; this adds
// the real page-like handoff (incoming page rises + settles, outgoing
// page recedes) the spec's §9.3 formula describes, using one shared
// passive scroll listener + one shared RAF loop for every story page
// (not one listener per section) — matches the project's existing
// single-RAF-loop discipline (SwissHero's own proximity engine, the
// existing StoryPage-adjacent components).
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

    const smoothstep = (edge0: number, edge1: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
      return t * t * (3 - 2 * t)
    }
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      if (dirty) {
        dirty = false
        const viewportH = window.innerHeight
        for (const stage of stages) {
          const parent = stage.parentElement
          if (!parent) continue
          const rect = parent.getBoundingClientRect()
          // progress: 0 when the section's top just enters the bottom of
          // the viewport, 1 when its bottom has fully passed the top —
          // matches the canonical §9.3 formula exactly.
          const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - viewportH)))
          const enter = smoothstep(0, 0.22, progress)
          const exit = smoothstep(0.72, 1, progress)
          const yVh = lerp(7, 0, enter) + lerp(0, -4, exit)
          const scale = lerp(0.992, 1, enter) * lerp(1, 0.987, exit)
          const opacity = lerp(0.35, 1, enter) * lerp(1, 0.72, exit)
          stage.style.setProperty('--story-y', `${yVh}vh`)
          stage.style.setProperty('--story-scale', scale.toFixed(4))
          stage.style.setProperty('--story-opacity', opacity.toFixed(4))
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
