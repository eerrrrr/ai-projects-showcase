// Manifesto content — the first piece of the page sequence after the
// Hero. Exact approved text, unchanged across every pass this line has
// appeared in this project — not invented here. Wrapped in <StoryPage
// id="approach"> by AiPortfolioV2Page.tsx (PASS A refactor — this
// component now renders only its inner content, not its own <section>,
// so the page-level wrapper is the single shared StoryPage everywhere).

import { Reveal } from './Reveal'

const LINES = [
  'Exploring how human judgment',
  'and AI capabilities shape',
  'better ways of researching,',
  'deciding, creating and learning.',
]

export function ManifestoPage() {
  return (
    <div className="v2-manifesto-grid">
      <Reveal as="p" className="v2-manifesto-index" size="small">
        01 / APPROACH
      </Reveal>
      <h2 id="v2-manifesto-title" className="v2-manifesto-statement">
        {LINES.map((line, index) => (
          <Reveal key={line} as="span" className="v2-manifesto-line" delayMs={55 + index * 50}>
            {line}
          </Reveal>
        ))}
      </h2>
    </div>
  )
}
