import type { PageContent } from '../data/types'
import { Html } from './Html'
import { useReveal } from '../hooks/useReveal'

function MiniCard({ card }: { card: PageContent['supporting']['cards'][number] }) {
  const { ref, className } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`mini ${className}`}>
      <span className="mono">{card.eyebrow}</span>
      <h3>{card.title}</h3>
      <p>{card.body}</p>
    </div>
  )
}

export function SupportingSystems({ supporting }: { supporting: PageContent['supporting'] }) {
  return (
    <section id="supporting">
      <div className="sec-head">
        <span className="no">{supporting.sectionNo}</span>
        <Html as="h2" html={supporting.heading} />
        <Html as="span" className="sub mono" html={supporting.sub} />
      </div>
      <div className="mini-grid">
        {supporting.cards.map((card) => (
          <MiniCard card={card} key={card.title} />
        ))}
      </div>
    </section>
  )
}
