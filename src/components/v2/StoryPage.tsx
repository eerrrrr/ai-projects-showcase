import type { ReactNode } from 'react'

// PASS-consolidated §B — real sticky-stage rolling engine, not just a
// scroll-snap stop. Outer <section> is taller than the viewport
// (min-height 125svh) so there's scroll distance to animate across;
// the inner .v2-storyPage-stage is position:sticky and reads
// --story-y/--story-scale/--story-opacity, written every frame by
// useStoryRollEngine() (one shared engine for every StoryPage on the
// route, called once in AiPortfolioV2Page — not per-instance). Mobile
// and reduced-motion fall back to plain flow (story-pages.css).
export function StoryPage({
  id,
  ariaLabel,
  className,
  children,
}: {
  id: string
  ariaLabel: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-label={ariaLabel} className={`v2-storyPage${className ? ` ${className}` : ''}`}>
      <div className="v2-storyPage-stage">
        <div className="v2-storyPage-inner">{children}</div>
      </div>
    </section>
  )
}
