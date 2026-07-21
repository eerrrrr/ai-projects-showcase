import { useEffect, useState } from 'react'
import type { PageContent } from '../data/types'
import { Html } from './Html'
import { KeywordRhythm } from './KeywordRhythm'
import Plasma from './Plasma'

// Cover-page hero: near-full viewport height, Plasma as subtle background
// atmosphere (skipped entirely under prefers-reduced-motion), content on
// top with z-index. Project cards live in their own section below — see
// #systems in App.tsx — so this screen is identity-only.
export function Hero({ content }: { content: PageContent }) {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <header className="hero hero-cover">
      {!reduceMotion && (
        <div className="hero-plasma" aria-hidden="true">
          <Plasma color="#1f7a55" speed={0.35} direction="forward" scale={1.25} opacity={0.22} mouseInteractive={false} />
        </div>
      )}

      <div className="hero-content">
        <div className="hero-text">
          <h1>{content.heroName}</h1>
          <div className="hero-tagline">{content.heroTagline}</div>
          <Html as="p" className="focus-line mono" html={content.focusLineHtml} />

          <KeywordRhythm words={content.thinkingList} />

          <a className="scroll-cue mono" href="#systems">
            View systems ↓
          </a>
        </div>
      </div>
    </header>
  )
}
