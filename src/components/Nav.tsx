import type { PageContent } from '../data/types'

export function Nav({ nav }: { nav: PageContent['nav'] }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <span className="who">
          {nav.who}&nbsp;<span>{nav.whoAccent}</span>
        </span>
        {nav.links.map((link) =>
          link.external ? (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="mono--accent">
              {link.label} ↗
            </a>
          ) : (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ),
        )}
      </div>
    </nav>
  )
}
