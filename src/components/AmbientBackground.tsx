import { useEffect, useRef } from 'react'
import Plasma from './Plasma'

// The one and only Plasma canvas on the page — mounted once here at the
// App root (see App.tsx), not per-section and not per-project. It used to
// live scoped inside Hero (.hero-plasma), visible only on the cover; moved
// here, fixed to the viewport, so the same living-background feeling
// continues (much fainter) all the way down the page.
//
// Every visual change per scroll — shape distortion, opacity, and hue — is
// now driven by ONE continuous smoothed scroll-progress number computed
// inside Plasma's own render loop (see Plasma.jsx). There is deliberately
// no per-section preset for any of it: the earlier version faded opacity
// via CSS keyed to data-accent-section (a *stepped* value, eased over
// 0.9s whenever the "current section" changed) while the canvas's own
// color never changed at all — that combination read as "a separate
// background patch behind each section" rather than one field flowing
// downward. Fixed by moving opacity and hue into the same continuous
// scroll-driven system as the shape distortion, entirely inside Plasma —
// see UPDATE_REPORT_2026-07-25_CONTINUOUS_PLASMA_GROWTH.md.
//
// The discrete `--accent`/data-accent-section system (project numbers,
// chips, buttons, workflow markers) is untouched and still correctly
// categorical — those are UI labels ("which system am I looking at"),
// not part of the living background, and are fine being stepped.
//
// z-index is 0, not negative — a negative z-index on a position:fixed
// ancestor was found to silently break this WebGL canvas's compositing
// (confirmed by isolation testing: identical setup with z-index:-1 draws
// nothing, z-index:0 draws correctly). Content still visually sits above
// this layer because everything else is wrapped in .page-content, its own
// stacking context at z-index:1 — see App.tsx and global.css. See
// UPDATE_REPORT_2026-07-25_GLOBAL_AMBIENT_BACKGROUND.md for the full
// investigation.
//
// Always rendered regardless of prefers-reduced-motion, matching Hero's
// own pre-existing, deliberate choice (see Hero.tsx) — but its animation
// speed drops sharply under reduced motion, and disabling the scroll
// listener below means every scroll-driven value (drift/stretch/morph/
// flow/opacity/hue) simply freezes at whatever it was when reduced motion
// was detected, instead of continuing to animate.
export function AmbientBackground() {
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Scroll progress (0 at the top of the document, 1 at the bottom) is
  // read here and handed to Plasma as a plain mutable ref — never React
  // state, never a prop that changes. The listener below only ever writes
  // a number into that ref; Plasma reads it once per animation frame
  // inside its own existing render loop to drive shape, opacity, and hue
  // together (see Plasma.jsx). This cannot trigger a React re-render,
  // cannot affect layout, and is completely independent of
  // useSoftPageHandoff / useSectionSettle — it never calls scrollTo, never
  // calls preventDefault, and never reads or writes workflow/expand state.
  const scrollProgressRef = useRef(0)
  useEffect(() => {
    if (reducedMotion) return
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      scrollProgressRef.current = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [reducedMotion])

  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-bg-canvas">
        <Plasma
          color="#1f7a55"
          colorStops={['#1f7a55', '#0e5f45', '#0c7d72', '#5c6b35']}
          speed={reducedMotion ? 0.02 : 0.35}
          direction="forward"
          scale={1.25}
          opacity={0.22}
          mouseInteractive={false}
          scrollProgressRef={scrollProgressRef}
        />
      </div>
    </div>
  )
}
