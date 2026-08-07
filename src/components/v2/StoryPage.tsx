import type { ReactNode } from 'react'

// Shared page-level wrapper for every major section after the Hero.
// `data-chapter-id` (== `id`) is what useChapterRollState.ts's shared
// engine queries to find every candidate chapter and determine which one
// is currently nearest the viewport centre — the single active chapter.
// The engine writes `data-story-state` onto the inner `.v2-storyPage-stage`
// child; CSS (story-pages.css) owns the actual before/active/after
// animation from there.
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
    <section id={id} data-chapter-id={id} aria-label={ariaLabel} className={`v2-storyPage${className ? ` ${className}` : ''}`}>
      <div className="v2-storyPage-stage">
        <div className="v2-storyPage-inner">{children}</div>
      </div>
    </section>
  )
}
