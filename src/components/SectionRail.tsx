import type { Project } from '../data/types'

export function SectionRail({
  projects,
  activeId,
}: {
  projects: Project[]
  activeId: string | null
}) {
  const activeProject = projects.find((project) => project.id === activeId)
  const currentLabel =
    activeId === 'cover'
      ? 'Cover'
      : activeId === 'systems'
        ? 'Selected'
        : activeProject
          ? `System ${String(activeProject.index).padStart(2, '0')}`
          : 'Systems'
  const mobileLabel =
    activeId === 'cover'
      ? 'Cover'
      : activeId === 'systems'
        ? 'Systems'
        : activeProject
          ? `${String(activeProject.index).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`
          : ''

  return (
    <nav
      className="section-rail section-rail--visible"
      aria-label="Page chapters"
    >
      <span className="section-rail-label mono" aria-hidden="true">
        {currentLabel}
      </span>

      <ol className="section-rail-list">
        <li>
          <a
            className={`section-rail-link${activeId === 'cover' ? ' is-current' : ''}`}
            href="#cover"
            aria-current={activeId === 'cover' ? 'location' : undefined}
            aria-label="Cover"
            title="Cover"
          >
            <span className="section-rail-number" aria-hidden="true">00</span>
            <span className="section-rail-line" aria-hidden="true" />
          </a>
        </li>
        <li>
          <a
            className={`section-rail-link${activeId === 'systems' ? ' is-current' : ''}`}
            href="#systems"
            aria-current={activeId === 'systems' ? 'location' : undefined}
            aria-label="Selected systems"
            title="Selected systems"
          >
            <span className="section-rail-number section-rail-number--index" aria-hidden="true">All</span>
            <span className="section-rail-line" aria-hidden="true" />
          </a>
        </li>
        {projects.map((project) => {
          const isCurrent = project.id === activeId
          const number = String(project.index).padStart(2, '0')

          return (
            <li key={project.id}>
              <a
                className={`section-rail-link${isCurrent ? ' is-current' : ''}`}
                href={`#${project.id}`}
                aria-current={isCurrent ? 'location' : undefined}
                aria-label={`${number} — ${project.shortTitle ?? project.title}`}
                title={project.shortTitle ?? project.title}
              >
                <span className="section-rail-number" aria-hidden="true">
                  {number}
                </span>
                <span className="section-rail-line" aria-hidden="true" />
              </a>
            </li>
          )
        })}
      </ol>

      {mobileLabel && (
        <span className="section-rail-mobile mono" aria-hidden="true">
          {mobileLabel}
        </span>
      )}
    </nav>
  )
}
