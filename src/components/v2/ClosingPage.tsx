import type { PageContent } from '../../data/types'
import { Reveal } from './Reveal'

// PASS A §10 — dedicated closing page, sourced directly from
// page-content.json's existing footer text (the exact verified
// source/date line already used site-wide) — not a new date or a
// stronger claim. Wrapped in <StoryPage id="closing"> by
// AiPortfolioV2Page.tsx.
export function ClosingPage({ footer, nav }: { footer: PageContent['footer']; nav: PageContent['nav'] }) {
  const externalLinks = nav.links.filter((link) => link.external)

  return (
    <div className="v2-closing-inner">
      <Reveal as="p" className="v2-closing-eyebrow" size="small">
        11 / CLOSING
      </Reveal>
      <Reveal as="p" className="v2-closing-line">
        {footer.left}
      </Reveal>
      <Reveal as="p" className="v2-closing-line" delayMs={70}>
        {footer.right}
      </Reveal>

      <nav className="v2-closing-links" aria-label="Contact and profile links">
        {externalLinks.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
            {link.label} ↗
          </a>
        ))}
      </nav>
    </div>
  )
}
