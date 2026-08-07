import type { PageContent } from '../../data/types'
import { Reveal } from './Reveal'

// PASS A §9 — dedicated page for the 3 supporting-infrastructure items,
// sourced directly from page-content.json's existing `supporting` block
// (the same real content V1 already ships) rather than inventing new
// copy. Wrapped in <StoryPage id="supporting-infrastructure"> by
// AiPortfolioV2Page.tsx.
export function SupportingInfrastructurePage({ supporting }: { supporting: PageContent['supporting'] }) {
  return (
    <div className="v2-supporting-inner">
      <header className="v2-supporting-header">
        <Reveal as="p" size="small">{supporting.sectionNo} / SUPPORTING</Reveal>
        <Reveal as="h2">{supporting.heading}</Reveal>
      </header>

      <ol className="v2-supporting-list">
        {supporting.cards.map((card, i) => (
          <Reveal as="li" key={card.title} className="v2-supporting-row" delayMs={i * 60}>
            <span className="v2-eyebrow">{card.eyebrow}</span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}
