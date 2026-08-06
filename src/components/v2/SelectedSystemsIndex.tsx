// Old-site-style Selected Systems ruled index — the second piece of the
// page sequence, between the Manifesto and System 01. Derives its rows
// directly from `projects.json`'s own `index`/`title`/`overviewChips`
// fields — no second, parallel content source. Wrapped in <StoryPage
// id="selected-systems"> by AiPortfolioV2Page.tsx (PASS A refactor — no
// longer renders its own <section>).
//
// Each row anchors to the project's real id, which now resolves to a
// full <StoryPage> System chapter further down the page (PASS A —
// previously only Job Screening had a full section; the other 6 were a
// compact list further down without their own anchor-worthy chapter).

import type { Project } from '../../data/types'
import { Html } from '../Html'
import { Reveal } from './Reveal'

export function SelectedSystemsIndex({ projects }: { projects: Project[] }) {
  const rows = [...projects].sort((a, b) => a.index - b.index)

  return (
    <div className="v2-systemIndex-inner">
      <header className="v2-systemIndex-header">
        <Reveal as="p">02 / INDEX</Reveal>
        <Reveal as="h2" id="selected-systems-title">
          Selected systems
        </Reveal>
      </header>

      <ol className="v2-systemIndex-list">
        {rows.map((project, i) => (
          <Reveal as="li" key={project.id} delayMs={Math.min(i, 6) * 50}>
            <a className="v2-systemIndex-row" href={`#system-${String(project.index).padStart(2, '0')}`}>
              <span className="v2-systemIndex-number">{String(project.index).padStart(2, '0')}</span>
              <Html as="span" className="v2-systemIndex-title" html={project.title} />
              <span className="v2-systemIndex-signals">{(project.overviewChips ?? []).join(' / ')}</span>
              <span className="v2-systemIndex-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}
