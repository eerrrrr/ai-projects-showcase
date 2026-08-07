import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="route-page">
      <p className="route-page-kicker">Not found</p>
      <h1>This route does not exist</h1>
      <p>That page isn't part of the site.</p>
      <div className="route-page-actions">
        <Link className="route-page-button route-page-button--primary" to="/">
          Back to AI portfolio
        </Link>
      </div>
    </main>
  )
}