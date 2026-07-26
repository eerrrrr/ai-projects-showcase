import { useEffect, useRef } from 'react'

// Feature flag — flip to false to disable with one line; the effect
// returns before attaching any listener, so disabling is a zero-risk no-op.
export const ENABLE_SECTION_SETTLE = true

const SCROLL_END_FALLBACK_MS = 200 // used only on older browsers without `scrollend`
const SETTLE_ZONE_RATIO = 0.28 // a broader, still-local magnetic zone around each boundary
const SETTLE_MIN_GAP = 8 // px — already close enough, nothing to do
const SETTLE_DURATION_MS = 850
const USER_INTERRUPT_TOLERANCE = 6 // px — stop animating as soon as fresh input moves the page
const PAGE_STEP_TRIGGER_RATIO = 0.08 // one deliberate roll from an aligned page advances one page
const PAGE_START_TOLERANCE = 16 // only page-step when the gesture began at a settled boundary
// Matches .project's own `scrollMarginTop: 88px` and useSoftPageHandoff's
// NAV_OFFSET — same nav-breathing-room adjustment, applied here too so a
// settle rests a section exactly where an anchor-link jump to it would.
const NAV_OFFSET = 88

// A magnetic "settle," not a wheel hijack: this hook never intercepts wheel
// input and never calls preventDefault. It only watches passive `scroll`
// events and waits for scrolling to genuinely stop. A deliberate gesture
// that began at an already-settled boundary advances to the adjacent page;
// otherwise, only a viewport already close to a major section top is nudged
// the rest of the way. Reading in the middle of a long section never forces
// a page step.
//
// Deliberately separate from useSoftPageHandoff, which already owns the
// Hero <-> Selected-systems handoff via wheel interception — this hook
// does not track that boundary at all, so the two never fight over the
// same transition. This hook's tracked boundaries start at each system
// (`.project`) and end at the footer; arriving at Selected systems from
// Hero is entirely the other hook's job.
//
// Skips entirely whenever the user is actively engaged with a project —
// a system expanded ("View details") or a "How it works" step open — so
// it can never yank someone away from content they're mid-reading or
// mid-walkthrough. Detected via existing CSS state classes only
// (`.project--collapsed` absent, `.w-step--active` present); this hook
// never reads or writes any workflow/expand state itself.
function isUserEngagedWithAProject(): boolean {
  return Boolean(
    document.querySelector('.project:not(.project--collapsed)') || document.querySelector('.w-step--active'),
  )
}

export function useSectionSettle() {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lockedRef = useRef(false)
  const animationRef = useRef<number | null>(null)
  const gestureStartRef = useRef<number | null>(null)
  const lastScrollTopRef = useRef(0)

  useEffect(() => {
    if (!ENABLE_SECTION_SETTLE) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    lastScrollTopRef.current = window.scrollY

    const getSectionTops = () => {
      const statementEl = document.querySelector<HTMLElement>('#systems-statement')
      const projectEls = [...document.querySelectorAll<HTMLElement>('.project')]
      const footerEl = document.querySelector<HTMLElement>('[data-page-section="footer"]')
      return [statementEl, ...projectEls, footerEl]
        .filter((el): el is HTMLElement => el !== null)
        .map((el) => el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET)
    }

    const stopAnimation = () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
      animationRef.current = null
      lockedRef.current = false
    }

    const animateTo = (targetTop: number) => {
      const startTop = window.scrollY
      const distance = targetTop - startTop
      const startedAt = performance.now()
      let lastAppliedTop = startTop

      lockedRef.current = true

      const frame = (now: number) => {
        // Native scrolling remains in charge: if new user input moves the
        // viewport away from the last position this animation applied, give
        // up immediately rather than pulling against it.
        if (Math.abs(window.scrollY - lastAppliedTop) > USER_INTERRUPT_TOLERANCE) {
          stopAnimation()
          return
        }
        if (isUserEngagedWithAProject()) {
          stopAnimation()
          return
        }

        const progress = Math.min((now - startedAt) / SETTLE_DURATION_MS, 1)
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2
        const nextTop = startTop + distance * eased

        window.scrollTo({ top: nextTop, behavior: 'auto' })
        lastAppliedTop = window.scrollY

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(frame)
        } else {
          stopAnimation()
        }
      }

      animationRef.current = requestAnimationFrame(frame)
    }

    const settleAfterScroll = (allowPageStep: boolean) => {
      if (lockedRef.current) return
      if (isUserEngagedWithAProject()) {
        gestureStartRef.current = null
        return
      }

      const viewportTop = window.scrollY
      const tops = getSectionTops()
      const gestureStart = gestureStartRef.current
      gestureStartRef.current = null
      let nearest: number | null = null
      let nearestDist = Infinity
      for (const top of tops) {
        const dist = Math.abs(top - viewportTop)
        if (dist < nearestDist) {
          nearestDist = dist
          nearest = top
        }
      }

      // PPT-like page advance, without wheel interception: only a gesture
      // that began at an already-settled boundary can select the adjacent
      // page. Mid-section reading still uses the gentler nearest-boundary
      // settle below, and engaged project content disables both paths.
      if (allowPageStep && gestureStart !== null) {
        let startIndex = -1
        let startDist = Infinity
        tops.forEach((top, index) => {
          const dist = Math.abs(top - gestureStart)
          if (dist < startDist) {
            startDist = dist
            startIndex = index
          }
        })

        const travelled = viewportTop - gestureStart
        if (
          startIndex >= 0 &&
          startDist <= PAGE_START_TOLERANCE &&
          Math.abs(travelled) >= window.innerHeight * PAGE_STEP_TRIGGER_RATIO
        ) {
          const direction = travelled > 0 ? 1 : -1
          const nextIndex = startIndex + direction
          if (nextIndex >= 0 && nextIndex < tops.length) {
            animateTo(tops[nextIndex])
            return
          }
        }
      }

      if (nearest === null) return
      if (nearestDist <= SETTLE_MIN_GAP) return
      if (nearestDist > window.innerHeight * SETTLE_ZONE_RATIO) return

      animateTo(nearest)
    }

    const supportsScrollEnd = 'onscrollend' in window

    const onScroll = () => {
      const currentTop = window.scrollY
      if (!lockedRef.current && gestureStartRef.current === null) {
        gestureStartRef.current = lastScrollTopRef.current
      }
      lastScrollTopRef.current = currentTop

      if (lockedRef.current || supportsScrollEnd) return
      if (debounceRef.current) clearTimeout(debounceRef.current)
      // A timeout can detect a pause, not the true end of trackpad momentum.
      // Older browsers therefore get proximity settling only, never the
      // one-gesture page step that requires a trustworthy gesture boundary.
      debounceRef.current = setTimeout(() => settleAfterScroll(false), SCROLL_END_FALLBACK_MS)
    }

    const onScrollEnd = () => {
      if (lockedRef.current) return
      settleAfterScroll(true)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    if (supportsScrollEnd) document.addEventListener('scrollend', onScrollEnd)
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (supportsScrollEnd) document.removeEventListener('scrollend', onScrollEnd)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      stopAnimation()
    }
  }, [])
}
