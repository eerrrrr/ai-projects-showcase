import { useEffect, useRef } from 'react'

// Feature flag — flip to false to disable this entire hook with one line;
// it early-returns before attaching any listener, so disabling it is a
// zero-risk no-op, not a partial rollback.
export const ENABLE_SOFT_PAGE_HANDOFF = true

const WHEEL_THRESHOLD = 6 // px — filters near-zero trackpad jitter, not intentional gestures
const LOCK_MS = 900 // matches the smooth-scroll transition duration
const EDGE_TOLERANCE = 4 // px — "essentially at this section's top edge"

const IGNORED_ANCESTOR_SELECTOR =
  'button, a, input, textarea, select, [role="button"], .project, .walkthrough, .expand-panel, .p-controls'

// Soft, top-level section handoff for the Hero -> Selected systems boundary
// only — the one place a plain wheel-scroll visibly stalls "half in Hero,
// half in Selected systems" instead of landing cleanly on either. This is
// deliberately narrow: once the user has scrolled to (or past) the top of
// Selected systems, this hook never intercepts again for the rest of the
// page — the four full project write-ups (HOW IT WORKS, auto-zip, expand
// panels) and the Systems Lab section below them get 100% native scroll,
// exactly as before this hook existed.
//
// This does NOT attempt a further "Selected systems -> Systems Lab" jump.
// Structurally, four full project sections sit between them — jumping past
// Selected systems straight to Systems Lab would skip over real project
// content on a single wheel tick, which is a content-hiding regression, not
// a calmer handoff. That's out of scope for this pilot; see the companion
// UPDATE_REPORT for the reasoning.
//
// Geometry is re-read from the DOM on every qualifying wheel event rather
// than tracked in a state variable, so this is self-correcting regardless
// of how the user arrived at a given scroll position (nav-link click,
// keyboard, scrollbar drag) — there's no internal "current section" state
// to fall out of sync.
export function useSoftPageHandoff() {
  const isLockedRef = useRef(false)

  useEffect(() => {
    if (!ENABLE_SOFT_PAGE_HANDOFF) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const heroEl = document.querySelector<HTMLElement>('[data-page-section="hero"]')
    const systemsEl = document.querySelector<HTMLElement>('[data-page-section="systems"]')
    if (!heroEl || !systemsEl) return

    const onWheel = (e: WheelEvent) => {
      if (isLockedRef.current) return
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return

      const target = e.target
      if (target instanceof Element && target.closest(IGNORED_ANCESTOR_SELECTOR)) return

      const systemsTop = systemsEl.getBoundingClientRect().top
      const pastHero = systemsTop <= EDGE_TOLERANCE
      const atSystemsTop = Math.abs(systemsTop) <= EDGE_TOLERANCE

      if (!pastHero && e.deltaY > 0) {
        // Still substantially within Hero, scrolling down -> land cleanly
        // on Selected systems instead of stopping halfway.
        e.preventDefault()
        isLockedRef.current = true
        window.scrollTo({ top: window.scrollY + systemsTop, behavior: 'smooth' })
        setTimeout(() => {
          isLockedRef.current = false
        }, LOCK_MS)
        return
      }

      if (pastHero && atSystemsTop && e.deltaY < 0) {
        // Exactly at the top of Selected systems, scrolling up -> back to Hero.
        e.preventDefault()
        isLockedRef.current = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => {
          isLockedRef.current = false
        }, LOCK_MS)
        return
      }

      // Anywhere else (already reading into Selected systems, inside a
      // project section, past it entirely, or scrolling further down from
      // the top of Selected systems) — do nothing, let native scroll run.
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])
}
