import type { Project } from '../data/types'

// Titles are "Short Name — longer subtitle" (see projects.json); used as
// the card heading fallback for projects that don't have a dedicated
// `shortTitle` (currently the 3 non-featured projects) — derived rather
// than hardcoded so it stays correct if a title ever changes, and so a
// title's HTML entities (e.g. the smart quotes in the video-pipeline
// title) never leak into this plain-text heading.
function shortName(title: string) {
  return title.split(/\s+—\s+/)[0]
}

// Systems overview: all 7 projects as one card grid, in its own section
// below the cover hero (not inside it). Every card links to its full
// project section; `activeId` (driven by scroll-spy in App.tsx) highlights
// whichever featured project is currently in view. Tier 2/3 projects (the
// ones with a fuller write-up further down the page, under "System details")
// render in the exact same card form and color — no separate heading, no
// detached link row, no muted styling; they're still real, clickable cards
// in the same catalogue, not a demoted afterthought.
export function ProofSummary({
  projects,
  heading,
  statement,
  activeId,
}: {
  projects: Project[]
  heading: string
  statement: string
  activeId: string | null
}) {
  return (
    <section id="systems" className="systems-overview" data-page-section="systems">
      <div className="sec-head">
        <h2>{heading}</h2>
      </div>
      <p className="systems-intro">{statement}</p>
      <div className="systems-grid">
        {projects.map((project, index) => (
          <a
            className={`system-card${index < 3 ? ' system-card--featured' : ' system-card--more'}${activeId === project.id ? ' is-active' : ''}`}
            href={`#${project.id}`}
            key={project.id}
          >
            <span className="mono mono--accent">{String(project.index).padStart(2, '0')}</span>
            <h3>{project.shortTitle ?? shortName(project.title)}</h3>
            {project.overviewChips && (
              <span className="system-card-chips">
                {project.overviewChips.map((chip) => (
                  <span className="system-card-chip mono" key={chip}>
                    {chip}
                  </span>
                ))}
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  )
}
