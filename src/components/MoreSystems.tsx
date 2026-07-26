import type { Project } from '../data/types'
import { Html } from './Html'

export function MoreSystems({ projects }: { projects: Project[] }) {
  return (
    <section id="more-systems" className="more-systems" aria-labelledby="more-systems-title">
      <div className="more-systems-head">
        <span className="mono mono--accent">04–07</span>
        <h2 id="more-systems-title">More systems</h2>
        <p>Additional workflows, shown as concise summaries for faster scanning.</p>
      </div>

      <div className="more-systems-list">
        {projects.map((project) => (
          <article
            id={project.id}
            className="more-system"
            data-page-section={`system${String(project.index).padStart(2, '0')}`}
            key={project.id}
          >
            <div className="more-system-index mono mono--accent">
              {String(project.index).padStart(2, '0')}
            </div>
            <div className="more-system-copy">
              <span className="mono">{project.tierLabel}</span>
              <Html as="h3" html={project.shortTitle ?? project.title} />
              {project.valueLine && <p>{project.valueLine}</p>}
            </div>
            <div className="more-system-flow" aria-label="Workflow summary">
              {project.stages.map((stage, index) => (
                <span key={stage.num}>
                  {stage.title}
                  {index < project.stages.length - 1 && <span aria-hidden="true"> → </span>}
                </span>
              ))}
            </div>
            <div className="more-system-chips" aria-label="Tools and capabilities">
              {project.overviewChips?.slice(0, 2).map((chip) => (
                <span className="system-card-chip" key={chip}>{chip}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
