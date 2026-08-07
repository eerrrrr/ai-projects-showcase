// Manifesto content — the first piece of the page sequence after the
// Hero. Exact approved text, unchanged across every pass this line has
// appeared in this project — not invented here. Wrapped in <StoryPage
// id="approach"> by AiPortfolioV2Page.tsx.

import { Reveal } from './Reveal'
import { WordTypeReveal } from './WordTypeReveal'

const LINES = [
  'Exploring how human judgment',
  'and AI capabilities shape',
  'better ways of researching,',
  'deciding, creating and learning.',
]

const FULL_STATEMENT = LINES.join(' ')

export function ManifestoPage() {
  return (
    <div className="v2-manifesto-grid">
      <Reveal as="p" className="v2-manifesto-index" size="small">
        01 / APPROACH
      </Reveal>
      <WordTypeReveal
        as="h2"
        className="v2-manifesto-statement"
        lines={LINES}
        ariaLabel={FULL_STATEMENT}
      />
    </div>
  )
}
