import type { Project } from '../../data/types'
import { Html } from '../Html'

// Compact overview grid for every project EXCEPT the one already given a
// full FeaturedCaseSection (Job Screening, this pass). Order is driven by
// tier/index, not hardcoded — remaining Featured Proof first, then
// Supporting System, then Learning Lab.
export function SwissOverview({
  projects,
  excludeProjectId,
}: {
  projects: Project[]
  excludeProjectId: string
}) {
  const remaining = projects
    .filter((project) => project.id !== excludeProjectId)
    .sort((a, b) => a.tier - b.tier || a.index - b.index)

  return (
    <section className="v2-overview" aria-label="Remaining systems">
      <div className="v2-grid">
        <span className="v2-eyebrow v2-overview-heading">Selected systems</span>
      </div>
      <hr className="v2-rule" />

      <ul className="v2-overview-list">
        {remaining.map((project) => (
          <li
            key={project.id}
            id={project.id}
            className="v2-overview-item"
            style={{ scrollMarginTop: '32px' }}
          >
            <div className="v2-grid">
              <span className="v2-section-number">{String(project.index).padStart(2, '0')}</span>
              <div className="v2-overview-item-body">
                <Html as="h3" html={project.title} />
                {project.valueLine && <p className="v2-overview-item-value">{project.valueLine}</p>}
                <p className="v2-overview-item-key">
                  <span className="v2-case-key-number">{project.keyNumber}</span>{' '}
                  <span className="v2-case-key-label">{project.keyLabel}</span>
                </p>
                <span className="v2-eyebrow">{project.tierLabel}</span>
              </div>
            </div>
            <hr className="v2-rule" />
          </li>
        ))}
      </ul>
    </section>
  )
}
