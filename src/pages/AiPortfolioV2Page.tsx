import { useEffect } from 'react'
import { useStoryRollEngine } from '../hooks/useStoryRollEngine'
import pageContent from '../data/page-content.json'
import projectsData from '../data/projects.json'
import type { PageContent, Project } from '../data/types'
import { SwissHero } from '../components/v2/SwissHero'
import { StoryPage } from '../components/v2/StoryPage'
import { ManifestoPage } from '../components/v2/ManifestoPage'
import { SelectedSystemsIndex } from '../components/v2/SelectedSystemsIndex'
import { SystemChapter } from '../components/v2/SystemChapter'
import { SupportingInfrastructurePage } from '../components/v2/SupportingInfrastructurePage'
import { ClosingPage } from '../components/v2/ClosingPage'
import '../styles/v2/tokens.css'
import '../styles/v2/hero.css'
import '../styles/v2/reveal.css'
import '../styles/v2/story-pages.css'
import '../styles/v2/system-chapter.css'
import '../styles/v2/workflow-diagram.css'

const content = pageContent as PageContent
const projects = projectsData as Project[]

// PASS A — full page-by-page sequence. Hero keeps its own separate,
// frozen implementation (SwissHero); everything below it now renders
// through the one shared StoryPage wrapper, giving the whole route a
// consistent page rhythm instead of Job Screening being the only section
// with real depth and everything else a compact list.
export function AiPortfolioV2Page() {
  const sortedProjects = [...projects].sort((a, b) => a.index - b.index)

  // Real sticky-stage rise/recede motion for every StoryPage on the
  // route — one shared engine, not one per section.
  useStoryRollEngine()

  // Soft, non-mandatory scroll-snap (PASS A §1: "proximity", not
  // "mandatory") — set on the document element only while this route is
  // mounted, and explicitly reset on unmount, so it never leaks into V1,
  // the 3D gateway, or any other route. Ordinary trackpad/wheel scrolling
  // remains fully functional throughout; this only encourages settling
  // at a page boundary, it never forces or intercepts a scroll gesture.
  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.scrollSnapType
    root.style.scrollSnapType = 'y proximity'
    return () => {
      root.style.scrollSnapType = previous
    }
  }, [])

  return (
    <div className="v2-page">
      <a className="skip-link" href="#v2-main-content">
        Skip to content
      </a>

      <main id="v2-main-content">
        <SwissHero />

        <StoryPage id="approach" ariaLabel="Approach">
          <ManifestoPage />
        </StoryPage>

        <StoryPage id="selected-systems" ariaLabel="Selected systems index">
          <SelectedSystemsIndex projects={sortedProjects} />
        </StoryPage>

        {sortedProjects.map((project) => (
          <StoryPage
            key={project.id}
            id={`system-${String(project.index).padStart(2, '0')}`}
            ariaLabel={`System ${project.index}: ${project.shortTitle ?? project.title}`}
          >
            <SystemChapter project={project} />
          </StoryPage>
        ))}

        <StoryPage id="supporting-infrastructure" ariaLabel="Supporting infrastructure">
          <SupportingInfrastructurePage supporting={content.supporting} />
        </StoryPage>

        <StoryPage id="closing" ariaLabel="Closing">
          <ClosingPage footer={content.footer} nav={content.nav} />
        </StoryPage>
      </main>
    </div>
  )
}
