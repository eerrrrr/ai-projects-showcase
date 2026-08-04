import { Link } from 'react-router-dom'
import { architectureGatewayConfig } from '../data/gatewayObjects'

export function ArchitecturePage() {
  const { externalUrl } = architectureGatewayConfig

  return (
    <main className="route-page route-page--architecture">
      <p className="route-page-kicker">Architecture</p>
      <h1>Existing architecture portfolio</h1>
      <p>
        This page stays as a transition point to the maintained architecture portfolio so the V2 gateway can stay
        lightweight.
      </p>
      <div className="route-page-actions">
        {externalUrl ? (
          <a className="route-page-button route-page-button--primary" href={externalUrl} target="_blank" rel="noreferrer">
            Open existing portfolio
          </a>
        ) : (
          <span className="route-page-button route-page-button--primary route-page-button--disabled" aria-disabled="true">
            External portfolio URL not configured
          </span>
        )}
        <Link className="route-page-button" to="/">
          Back to table
        </Link>
      </div>
    </main>
  )
}