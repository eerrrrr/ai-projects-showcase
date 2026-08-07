import { Link } from 'react-router-dom'
import type { GatewayObjectConfig } from '../../data/gatewayObjects'

type GatewayOverlayProps = {
  selected: GatewayObjectConfig
  route: string
  onBackToTable: () => void
  onEnterCategory: (id: string) => void
}

export function GatewayOverlay({ selected, route, onBackToTable, onEnterCategory }: GatewayOverlayProps) {
  return (
    <aside className="gateway-overlay" aria-live="polite">
      <p className="gateway-overlay-kicker">Preview</p>
      <h2>{selected.title}</h2>
      <p>{selected.description}</p>
      <div className="gateway-overlay-meta">
        <span>{selected.category}</span>
        <span>{selected.objectType}</span>
      </div>
      <div className="gateway-overlay-actions">
        <button type="button" className="gateway-button gateway-button--primary" onClick={() => onEnterCategory(selected.id)}>
          {selected.ctaLabel}
        </button>
        <button type="button" className="gateway-button" onClick={onBackToTable}>
          Back to table
        </button>
      </div>
      <p className="gateway-overlay-route">Route: {route}</p>
      <Link className="gateway-overlay-link" to={selected.route}>
        Enter category page
      </Link>
    </aside>
  )
}