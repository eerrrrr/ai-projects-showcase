import type { Project } from '../data/types'
import { Html } from './Html'

// Systems overview: the 4 featured-project quick cards, in their own
// section below the cover hero (not inside it). Each links to its full
// project section; `activeId` (driven by scroll-spy in App.tsx) highlights
// whichever project is currently in view.
export function ProofSummary({
  projects,
  sectionNo,
  heading,
  activeId,
}: {
  projects: Project[]
  sectionNo: string
  heading: string
  activeId: string | null
}) {
  return (
    <section id="systems" className="systems-overview">
      <div className="sec-head">
        <span className="no">{sectionNo}</span>
        <h2>{heading}</h2>
      </div>
      <div className="systems-grid">
        {projects.map((project) => (
          <a
            className={`system-card${activeId === project.id ? ' is-active' : ''}`}
            href={`#${project.id}`}
            key={project.id}
          >
            <span className="mono mono--accent">{String(project.index).padStart(2, '0')}</span>
            <h3>{project.shortTitle ?? project.title}</h3>
            {project.taglineHtml && <Html as="p" className="kl" html={project.taglineHtml} />}
            <span className="system-card-arrow mono">Open case →</span>
          </a>
        ))}
      </div>
    </section>
  )
}
