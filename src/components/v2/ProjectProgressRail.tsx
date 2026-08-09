import { useActiveChapterId } from '../../hooks/useChapterRollState'
import type { Project } from '../../data/types'

// Per direct request: a persistent scroll-progress rail listing every
// project, visible starting from the Selected Systems index and staying
// visible through all 7 System chapters — hidden everywhere else (Hero,
// Approach, Supporting Infrastructure, Closing), since those aren't part
// of the "which project am I looking at" question this answers.
//
// Reuses useActiveChapterId (see useChapterRollState.ts) — the exact
// same module-level roll engine SystemChapter.tsx already subscribes to,
// not a second scroll/IntersectionObserver system. Pure CSS opacity/
// pointer-events toggle for show/hide, so there's no mount/unmount
// thrash as the user scrolls back and forth across the boundary.
const VISIBLE_IDS = new Set(['selected-systems', 'system-01', 'system-02', 'system-03', 'system-04', 'system-05', 'system-06', 'system-07'])

export function ProjectProgressRail({ projects }: { projects: Project[] }) {
  const activeId = useActiveChapterId()
  const sorted = [...projects].sort((a, b) => a.index - b.index)
  const visible = activeId !== null && VISIBLE_IDS.has(activeId)

  return (
    <nav className="v2-progressRail" aria-label="Project progress" data-visible={visible} aria-hidden={!visible}>
      {sorted.map((project) => {
        const chapterId = `system-${String(project.index).padStart(2, '0')}`
        const isActive = activeId === chapterId
        return (
          <a
            key={project.id}
            href={`#${chapterId}`}
            className="v2-progressRail-item"
            data-active={isActive}
            aria-current={isActive ? 'true' : undefined}
            tabIndex={visible ? 0 : -1}
          >
            <span className="v2-progressRail-number">{String(project.index).padStart(2, '0')}</span>
            <span className="v2-progressRail-mark" aria-hidden="true" />
          </a>
        )
      })}
    </nav>
  )
}
