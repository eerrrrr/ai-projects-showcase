import type { PageContent } from '../data/types'

export function Nav({ nav }: { nav: PageContent['nav'] }) {
  return (
    <nav className="nav" aria-label="Primary navigation">
      <div className="nav-inner">
        <a href="#cover" className="who">
          {nav.who}&nbsp;<span>{nav.whoAccent}</span>
        </a>
        {nav.links.map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={`nav-external${
                link.label === 'Visual Portfolio' ? ' nav-external--primary' : ''
              }`}
            >
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
