import { useEffect, useRef } from 'react'

// Feature flag — flip to false to disable with one line; the effect
// returns before attaching any listener, so disabling is a zero-risk no-op.
export const ENABLE_SECTION_SETTLE = true

const SETTLE_DEBOUNCE_MS = 200 // wait this long after scrolling actually stops
const SETTLE_ZONE_RATIO = 0.18 // only settle if within ~18% of viewport height of a boundary
const SETTLE_MIN_GAP = 8 // px — already close enough, nothing to do
const LOCK_MS = 700 // matches the settle scroll's own transition duration
// Matches .project's own `scrollMarginTop: 88px` and useSoftPageHandoff's
// NAV_OFFSET — same nav-breathing-room adjustment, applied here too so a
// settle rests a section exactly where an anchor-link jump to it would.
const NAV_OFFSET = 88

// A magnetic "settle," not a wheel-jump: this hook never intercepts wheel
// input and never calls preventDefault. It only watches passive `scroll`
// events, waits for scrolling to genuinely stop, and — only if the
// viewport happens to have landed close to (but not exactly on) a major
// section's top — nudges it the rest of the way. Reading in the middle of
// a long section never triggers anything, since the nearest tracked
// boundary is far outside SETTLE_ZONE_RATIO at that point.
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

  useEffect(() => {
    if (!ENABLE_SECTION_SETTLE) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const getSectionTops = () => {
      const projectEls = [...document.querySelectorAll<HTMLElement>('.project')]
      const footerEl = document.querySelector<HTMLElement>('[data-page-section="footer"]')
      return [...projectEls, footerEl]
        .filter((el): el is HTMLElement => el !== null)
        .map((el) => el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET)
    }

    const onScroll = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        if (lockedRef.current) return
        if (isUserEngagedWithAProject()) return

        const viewportTop = window.scrollY
        const tops = getSectionTops()
        let nearest: number | null = null
        let nearestDist = Infinity
        for (const top of tops) {
          const dist = Math.abs(top - viewportTop)
          if (dist < nearestDist) {
            nearestDist = dist
            nearest = top
          }
        }
        if (nearest === null) return
        if (nearestDist <= SETTLE_MIN_GAP) return
        if (nearestDist > window.innerHeight * SETTLE_ZONE_RATIO) return

        lockedRef.current = true
        window.scrollTo({ top: nearest, behavior: 'smooth' })
        setTimeout(() => {
          lockedRef.current = false
        }, LOCK_MS)
      }, SETTLE_DEBOUNCE_MS)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])
}
