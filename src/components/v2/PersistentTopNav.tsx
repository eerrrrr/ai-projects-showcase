import pageContent from '../../data/page-content.json'
import type { PageContent } from '../../data/types'

const content = pageContent as PageContent

// Per direct feedback: the persistent top bar only actually lived inside
// SwissHero.tsx, so it only ever appeared on the /ai (and /) route where
// SwissHero mounts — the case-study route (/ai/:projectId,
// CaseStudyPage.tsx) had no nav at all. Extracted into its own
// standalone component, mounted once at the App.tsx level (outside
// <Routes>, see App.tsx) so it's genuinely present on every page instead
// of being re-wired per route.
//
// Same content/markup/className as the nav that used to live in
// SwissHero.tsx (reuses hero.css's existing .v2-hero-nav rules
// unchanged — position:fixed, styling, narrow-breakpoint full-width bar
// — all already written to not assume a Hero-specific ancestor). The one
// thing intentionally NOT carried over is the "Visual Portfolio" badge's
// pointer-proximity zoom (SwissHero's own RAF proximity engine, tied to
// the Hero's local pointermove tracking) — that effect doesn't make
// sense outside the Hero photo, and duplicating a second proximity
// engine here would be exactly the kind of scope creep this pass is
// meant to avoid. The badge still renders with its full styling
// (background/padding/bold white text — all plain CSS), just without
// the extra zoom-on-approach flourish, on every page including /ai.
export function PersistentTopNav() {
  return (
    // .v2-page wrapper: this component mounts in App.tsx outside any
    // page's own .v2-page div, but hero.css's nav styling reads several
    // .v2-page-scoped custom properties (--v2-ink-2, --v2-accent, etc.)
    // — without this, those simply wouldn't resolve here (custom
    // properties don't cross from a sibling subtree). tokens.css's
    // .v2-page rule sets properties only (no layout/sizing), so this
    // wrapper contributes no visible box of its own around the
    // position:fixed nav inside it.
    <div className="v2-page">
      <nav className="v2-hero-nav" aria-label="Primary navigation">
        {content.nav.links
          .filter((link) => link.href !== '#systems')
          .map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={link.label === 'Visual Portfolio' ? 'v2-hero-nav-featured' : undefined}
              >
                {link.label} ↗
              </a>
            ) : (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ),
          )}
      </nav>
    </div>
  )
}
