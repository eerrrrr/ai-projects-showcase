import type { ArchitectureCard } from '../../data/types'

// Compact technical-layer summary cards (TEST / CONTROL / FAILURE for
// System 01) — driven by project.architectureCards, generic for reuse.
// Deliberately small/quick-reading, not paragraph cards — per direct
// feedback, this shows "testing, production control, failure handling"
// as a fact, not a place to re-explain implementation detail already
// covered elsewhere.
export function ArchitectureCards({ cards }: { cards?: ArchitectureCard[] }) {
  if (!cards || cards.length === 0) return null
  return (
    <ul className="v2-architectureCards">
      {cards.map((card) => (
        <li key={card.eyebrow} className="v2-architectureCard">
          <span className="v2-architectureCard-eyebrow">{card.eyebrow}</span>
          <strong className="v2-architectureCard-title">{card.title}</strong>
          <p className="v2-architectureCard-body">{card.body}</p>
        </li>
      ))}
    </ul>
  )
}
