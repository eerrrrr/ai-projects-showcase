import { Link } from 'react-router-dom'
import type { GatewayObjectConfig } from '../../data/gatewayObjects'

type GatewayNavigationProps = {
  objects: GatewayObjectConfig[]
  selectedId: string
  onSelect: (id: string) => void
  onActivate: (id: string) => void
}

export function GatewayNavigation({ objects, selectedId, onSelect, onActivate }: GatewayNavigationProps) {
  return (
    <nav className="gateway-nav" aria-label="Portfolio categories">
      <div className="gateway-nav-group">
        {objects.map((item) => (
          <button
            key={item.id}
            className={`gateway-nav-button${selectedId === item.id ? ' is-active' : ''}`}
            type="button"
            onMouseEnter={() => onSelect(item.id)}
            onFocus={() => onSelect(item.id)}
            onClick={() => onSelect(item.id)}
            aria-pressed={selectedId === item.id}
            aria-label={`${item.title} category`}
          >
            <span>{item.title}</span>
            <span className="gateway-nav-button-meta">{item.category}</span>
          </button>
        ))}
      </div>
      <div className="gateway-nav-links">
        <button className="gateway-nav-linklike" type="button" onClick={() => onActivate(selectedId)}>
          Enter category
        </button>
        <Link to="/about">About</Link>
        <Link to="/ai">AI portfolio</Link>
      </div>
    </nav>
  )
}