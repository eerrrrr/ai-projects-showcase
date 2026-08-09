// Per direct request: a restrained "next page" hint for the three
// opening story pages only (Hero, Approach, Selected Systems) — not
// navigation in the same sense as the project progress rail, just a
// quiet cue that there's more below. One reusable component, same
// markup/CSS everywhere it's used (see story-pages.css's .v2-scrollCue
// rules for the actual visual/motion spec).
//
// Plain anchor, no onClick/scrollIntoView override — reuses the site's
// EXISTING navigation mechanism (the project progress rail's dots are
// also plain <a href="#id"> with no custom scroll JS; global.css sets
// `scroll-behavior: auto` site-wide), rather than introducing a second,
// differently-behaved scroll system just for this cue.
export function ScrollCue({ target, label }: { target: string; label: string }) {
  return (
    <a href={target} className="v2-scrollCue" aria-label={label}>
      <span aria-hidden="true">↓ SCROLL</span>
    </a>
  )
}
