import { useEffect, useRef } from 'react'
import type { PageContent } from '../data/types'
import { Html } from './Html'
import { KeywordRhythm } from './KeywordRhythm'

// Cover-page hero: near-full viewport height, content on top with z-index.
// Project cards live in their own section below — see #systems in
// App.tsx — so this screen is identity-only.
//
// The Plasma background that used to be mounted here (.hero-plasma) is now
// a single global layer (AmbientBackground, mounted once in App.tsx) that
// continues faintly down the whole page instead of stopping at the cover —
// see UPDATE_REPORT_2026-07-25_GLOBAL_AMBIENT_BACKGROUND.md. Hero still
// reads as the strongest moment purely via CSS (--ambient-opacity is
// highest at data-accent-section="hero"); nothing here changed about that
// judgment, just where the canvas itself lives.
export function Hero({ content }: { content: PageContent }) {
  const heroRef = useRef<HTMLElement>(null)
  const scrollCueRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    let frame = 0

    const updateScrollCue = () => {
      frame = 0
      const hero = heroRef.current
      const cue = scrollCueRef.current
      if (!hero || !cue) return

      const fadeDistance = Math.max(1, hero.offsetHeight * 0.55)
      const progress = Math.min(1, Math.max(0, window.scrollY / fadeDistance))
      cue.style.opacity = String(1 - progress)
      cue.style.pointerEvents = progress >= 0.98 ? 'none' : ''
    }

    const queueUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollCue)
    }

    updateScrollCue()
    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('resize', queueUpdate)

    return () => {
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', queueUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header ref={heroRef} id="cover" className="hero hero-cover" data-page-section="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>{content.heroName}</h1>
          <p className="hero-tagline">{content.heroTagline}</p>
          <Html as="p" className="focus-line mono" html={content.focusLineHtml} />

          <KeywordRhythm words={content.thinkingList} />
        </div>
      </div>
      <a ref={scrollCueRef} className="scroll-cue mono" href="#systems">
        <span>Scroll</span>
        <span className="scroll-cue-arrow" aria-hidden="true">↓</span>
      </a>
    </header>
  )
}
