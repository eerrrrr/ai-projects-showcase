import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <main className="route-page route-page--about">
      <p className="route-page-kicker">About</p>
      <h1>AI workflow systems</h1>
      <p>
        This workspace is a V2 gateway for Erin Wong&apos;s AI projects: 3D entry on the home route, the existing AI
        portfolio at /ai, and a transition page for the architecture portfolio.
      </p>
      <div className="route-page-actions">
        <Link className="route-page-button route-page-button--primary" to="/">
          Back to table
        </Link>
        <Link className="route-page-button" to="/ai">
          View AI portfolio
        </Link>
      </div>
    </main>
  )
}