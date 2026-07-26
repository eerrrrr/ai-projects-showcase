import type { Project } from '../data/types'
import { Html } from './Html'

// Compact left column for walkthrough-enabled projects: number, title, one
// value line, a mini roadmap, and 2-3 proof chips — readable in a few
// seconds. Heavier fields (tags list, key stat, Goal/Logic/etc.) stay out
// of the default view; "View details" still reveals them separately.
//
// "How it works" lives here too, not inside the right-side walkthrough
// component — both user-facing actions for this card (start the
// walkthrough, open the written detail) belong in one control stack on the
// left, next to each other. It stays visible even while the walkthrough is
// running — clicking it again just restarts, so there's no separate
// Restart control anywhere. The button only starts the walkthrough; the
// actual state and rendering live in WorkflowWalkthrough on the right.
export function ProjectLogicCard({
  project,
  expanded,
  onToggleDetails,
  onStartWalkthrough,
}: {
  project: Project
  expanded: boolean
  onToggleDetails: () => void
  onStartWalkthrough: () => void
}) {
  return (
    <>
      <span className="mono">
        System {String(project.index).padStart(2, '0')}
        {' · '}
        {project.tierLabel}
      </span>
      <div className="p-num">{String(project.index).padStart(2, '0')}</div>
      <Html as="h2" html={project.title} />
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

      <div className="p-controls">
        <button type="button" className="how-it-works-btn" onClick={onStartWalkthrough}>
          Play workflow ▶
        </button>
        <button
          type="button"
          className="view-details"
          aria-expanded={expanded}
          aria-controls={`${project.id}-details`}
          onClick={onToggleDetails}
        >
          {expanded ? 'Hide case notes −' : 'Read case notes ↓'}
        </button>
      </div>
    </>
  )
}
