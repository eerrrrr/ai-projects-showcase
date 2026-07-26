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
  return (
    <header id="cover" className="hero hero-cover" data-page-section="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>{content.heroName}</h1>
          <div className="hero-tagline">{content.heroTagline}</div>
          <Html as="p" className="focus-line mono" html={content.focusLineHtml} />

          <KeywordRhythm words={content.thinkingList} />
        </div>
      </div>
      <a className="scroll-cue mono" href="#systems">
        <span>View systems</span>
        <span className="scroll-cue-arrow" aria-hidden="true">↓</span>
      </a>
    </header>
  )
}
