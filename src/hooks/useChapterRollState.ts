import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

// Correction batch — replaces the previous per-section continuous-progress
// roll engine. Root cause of the "long grey interval / workflow plays while
// the page is still pale / evidence stacks across chapters" complaint was
// that every StoryPage independently decided its own before/active/after
// state, with no single owner and no shared "is the user currently
// scrolling" signal — so a chapter's workflow/evidence could start or stay
// open while a different chapter was actually the one settling into view.
//
// This module is a single shared engine (module-level singleton, not a
// React Context — matches this codebase's existing pattern of a
// module-scoped RAF loop, e.g. SwissHero's own proximity engine):
//
// - queries every element carrying `data-chapter-id` (written by
//   StoryPage.tsx onto its outer <section>) each scroll-settled frame;
// - finds the ONE whose centre is nearest the viewport centre — that is
//   the single active chapter, full stop, no other section may also
//   claim to be active;
// - writes `data-story-state` (before/active/after, purely by DOM index
//   relative to the active one) onto each chapter's `.v2-storyPage-stage`
//   child — CSS owns the actual page-roll animation from there, no
//   opacity fade (see story-pages.css);
// - tracks one shared `isScrolling` flag (true immediately on scroll,
//   false ~220ms after the last scroll event) that any chapter's own
//   workflow/evidence logic can gate on, so nothing plays or opens while
//   the page is still moving.
//
// Only `useChapterRollState(chapterId)` triggers a React re-render, and
// only when ITS OWN activeness or the shared isScrolling flag actually
// changes — not on every scroll tick, and not for chapters whose active
// state didn't change.

type Listener = () => void

const listeners = new Set<Listener>()
let activeId: string | null = null
let isScrolling = false
let engineStarted = false
let scrollSettleTimer: number | null = null

function notify() {
  listeners.forEach((listener) => listener())
}

function startEngine() {
  if (engineStarted) return
  engineStarted = true

  let rafId: number | null = null
  let dirty = true

  const onScroll = () => {
    dirty = true
    if (!isScrolling) {
      isScrolling = true
      notify()
    }
    if (scrollSettleTimer) window.clearTimeout(scrollSettleTimer)
    scrollSettleTimer = window.setTimeout(() => {
      isScrolling = false
      notify()
    }, 220)
  }

  const tick = () => {
    if (dirty) {
      dirty = false
      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter-id]'))
      if (sections.length > 0) {
        const viewportCenter = window.innerHeight / 2
        let nearestIndex = 0
        let nearestDist = Infinity
        const centers = sections.map((el) => {
          const rect = el.getBoundingClientRect()
          return rect.top + rect.height / 2
        })
        centers.forEach((center, i) => {
          const dist = Math.abs(center - viewportCenter)
          if (dist < nearestDist) {
            nearestDist = dist
            nearestIndex = i
          }
        })
        const nearestId = sections[nearestIndex].dataset.chapterId ?? null
        if (nearestId !== activeId) {
          activeId = nearestId
          notify()
        }
        sections.forEach((el, i) => {
          const stage = el.querySelector<HTMLElement>('.v2-storyPage-stage')
          if (!stage) return
          const state = i < nearestIndex ? 'before' : i > nearestIndex ? 'after' : 'active'
          if (stage.dataset.storyState !== state) stage.dataset.storyState = state
        })
      }
    }
    rafId = requestAnimationFrame(tick)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  rafId = requestAnimationFrame(tick)

  // Kept for symmetry/debug only — this engine is expected to live for
  // the whole route's lifetime, same as the rest of this app's
  // module-level engines, so no teardown path is exercised in practice.
  void rafId
}

export function useChapterRollState(chapterId: string): { isActive: boolean; isScrolling: boolean } {
  const reducedMotion = useReducedMotion()
  const [, forceRender] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    startEngine()
    const listener = () => forceRender((n) => n + 1)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [reducedMotion])

  if (reducedMotion) return { isActive: true, isScrolling: false }
  return { isActive: activeId === chapterId, isScrolling }
}
