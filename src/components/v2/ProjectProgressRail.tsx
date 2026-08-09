import { useEffect, useRef, useState } from 'react'
import { Html } from '../Html'
import type { Project } from '../../data/types'

// Per direct feedback: dots confirmed as the right pattern (fixed dot
// navigation / section pagination — active dot emphasised, label only
// revealed on hover, not a permanently-visible full list). Refined here,
// not redesigned: opacity/size/spacing/position polish, a hover title
// label, and a switch to a dedicated IntersectionObserver for this
// component's OWN active-section tracking.
//
// That observer is intentionally separate from useChapterRollState's
// shared RAF engine (which SystemChapter's autoplay/roll still owns
// untouched) — per direct feedback, viewport-intersection is exactly
// what IntersectionObserver is for, and this rail's "which dot lights
// up" concern doesn't need to be coupled to the page-roll/autoplay state
// machine. rootMargin mirrors the existing useAccentSection.ts pattern
// already in this codebase (-45%/-45% band = viewport-centre proximity).
const VISIBLE_IDS = ['selected-systems', 'system-01', 'system-02', 'system-03', 'system-04', 'system-05', 'system-06', 'system-07']

export function ProjectProgressRail({ projects }: { projects: Project[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const intersecting = useRef<Set<string>>(new Set())
  const centered = useRef<Map<string, number>>(new Map()) // id -> distance from viewport centre, smaller = more centred

  useEffect(() => {
    const targets = VISIBLE_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0) return

    // Two observers: a wide one purely for show/hide (any part of the
    // Selected-Systems-through-System-07 span on screen at all), and a
    // narrow centre-band one for deciding WHICH single section is the
    // active one (mirrors useAccentSection.ts's -45%/-45% technique).
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id
          if (entry.isIntersecting) intersecting.current.add(id)
          else intersecting.current.delete(id)
        })
        setVisible(intersecting.current.size > 0)
      },
      { threshold: 0 },
    )
    const centreObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect
            const dist = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2)
            centered.current.set(id, dist)
          } else {
            centered.current.delete(id)
          }
        })
        let nearestId: string | null = null
        let nearestDist = Infinity
        centered.current.forEach((dist, id) => {
          if (dist < nearestDist) {
            nearestDist = dist
            nearestId = id
          }
        })
        setActiveId(nearestId)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    targets.forEach((el) => {
      visibilityObserver.observe(el)
      centreObserver.observe(el)
    })
    return () => {
      visibilityObserver.disconnect()
      centreObserver.disconnect()
    }
  }, [])

  const sorted = [...projects].sort((a, b) => a.index - b.index)
  const isIndexActive = activeId === 'selected-systems'

  return (
    <nav className="v2-progressRail" aria-label="Project progress" data-visible={visible} aria-hidden={!visible}>
      {/* Secondary "return to Selected Systems index" node — per direct
          feedback, deliberately NOT System 00 and not part of the 01-07
          sequence (separate class, extra gap below via CSS, no number
          shown). Weaker at rest than every project dot; becomes only
          moderately more visible while Selected Systems itself is the
          active section (data-index-active), never as strong as an
          active project dot. */}
      <a
        href="#selected-systems"
        className="v2-progressRail-index"
        data-index-active={isIndexActive}
        aria-label="Back to Selected systems"
        tabIndex={visible ? 0 : -1}
      >
        <span className="v2-progressRail-indexLabel">INDEX</span>
        <span className="v2-progressRail-indexMark" aria-hidden="true" />
      </a>
      {sorted.map((project) => {
        const chapterId = `system-${String(project.index).padStart(2, '0')}`
        const isActive = activeId === chapterId
        return (
          <a
            key={project.id}
            href={`#${chapterId}`}
            className="v2-progressRail-item"
            data-active={isActive}
            aria-current={isActive ? 'location' : undefined}
            tabIndex={visible ? 0 : -1}
          >
            <span className="v2-progressRail-label">
              <span className="v2-progressRail-labelNumber">{String(project.index).padStart(2, '0')} /</span>{' '}
              <Html as="span" html={project.shortTitle ?? project.title} />
            </span>
            <span className="v2-progressRail-number">{String(project.index).padStart(2, '0')}</span>
            <span className="v2-progressRail-mark" aria-hidden="true" />
          </a>
        )
      })}
    </nav>
  )
}
