import type { PageContent } from '../data/types'
import { Html } from './Html'
import { KeywordRhythm } from './KeywordRhythm'
import Plasma from './Plasma'

// Cover-page hero: near-full viewport height, Plasma as subtle background
// atmosphere, content on top with z-index. Project cards live in their own
// section below — see #systems in App.tsx — so this screen is identity-only.
//
// Always rendered regardless of prefers-reduced-motion: asked for twice by
// the user after the accessibility guard hid it on their machine, so this
// is a deliberate trade — their explicit choice over the default guard.
// .hero-plasma also carries a static CSS gradient fallback (see
// global.css) in case WebGL2 itself isn't available, which is a different,
// unrelated failure mode from reduced-motion.
export function Hero({ content }: { content: PageContent }) {
  return (
    <header className="hero hero-cover">
      <div className="hero-plasma" aria-hidden="true">
        <Plasma color="#1f7a55" speed={0.35} direction="forward" scale={1.25} opacity={0.22} mouseInteractive={false} />
      </div>

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
