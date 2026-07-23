import type { Project } from '../data/types'
import { Html } from './Html'

// Compact left column for walkthrough-enabled projects: number, title, one
// value line, a mini roadmap, and 2-3 proof chips — readable in a few
// seconds. Heavier fields (tags list, key stat, Goal/Logic/etc.) stay out
// of the default view; "View details" still reveals them separately.
export function ProjectLogicCard({
  project,
  expanded,
  onToggleDetails,
}: {
  project: Project
  expanded: boolean
  onToggleDetails: () => void
}) {
  return (
    <>
      <span className="mono">
        Project {String(project.index).padStart(2, '0')} / {String(project.total).padStart(2, '0')}
        {' · '}
        {project.tierLabel}
      </span>
      <div className="p-num">{String(project.index).padStart(2, '0')}</div>
      <Html as="h3" html={project.title} />
      {project.valueLine && <p className="p-tagline">{project.valueLine}</p>}

      {project.miniRoadmap && (
        <div className="mini-roadmap mono">
          {project.miniRoadmap.map((step, i) => (
            <span key={step}>
              {step}
              {i < project.miniRoadmap!.length - 1 && <span className="mini-roadmap-arrow"> → </span>}
            </span>
          ))}
        </div>
      )}

      {project.proofChips && (
        <div className="proof-chips">
          {project.proofChips.map((chip) => (
            <span className="proof-chip" key={chip}>
              {chip}
            </span>
          ))}
        </div>
      )}

      <button type="button" className="view-details" onClick={onToggleDetails}>
        {expanded ? 'Hide details −' : 'View details ↓'}
      </button>
    </>
  )
}
