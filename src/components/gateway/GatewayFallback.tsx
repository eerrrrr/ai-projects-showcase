import { Link } from 'react-router-dom'
import type { GatewayObjectConfig } from '../../data/gatewayObjects'

type GatewayFallbackProps = {
  selected: GatewayObjectConfig
  objects: GatewayObjectConfig[]
  onSelect: (id: string) => void
  onNavigate: (id: string) => void
}

export function GatewayFallback({ selected, objects, onSelect, onNavigate }: GatewayFallbackProps) {
  return (
    <section className="gateway-fallback" aria-label="Static tabletop fallback">
      <p className="gateway-fallback-note">WebGL is unavailable or reduced motion is preferred. Use the buttons below.</p>
      <div className="gateway-fallback-table">
        {objects.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`gateway-fallback-card${selected.id === item.id ? ' is-active' : ''}`}
            onMouseEnter={() => onSelect(item.id)}
            onFocus={() => onSelect(item.id)}
            onClick={() => onNavigate(item.id)}
          >
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </button>
        ))}
      </div>
      <div className="gateway-fallback-links">
        <Link to={selected.route}>Enter selected category</Link>
        <Link to="/about">About</Link>
      </div>
    </section>
  )
}