import { useEffect, useState } from 'react'
import pageContent from './data/page-content.json'
import projectsData from './data/projects.json'
import type { PageContent, Project } from './data/types'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { AmbientBackground } from './components/AmbientBackground'
import { ProofSummary } from './components/ProofSummary'
import { ProjectCard } from './components/ProjectCard'
import { SupportingSystems } from './components/SupportingSystems'
import { MoreSystems } from './components/MoreSystems'
import { Footer } from './components/Footer'
import { SectionRail } from './components/SectionRail'
import { useSoftPageHandoff } from './hooks/useSoftPageHandoff'
import { useSectionSettle } from './hooks/useSectionSettle'
import { useAccentSection } from './hooks/useAccentSection'
import './styles/global.css'

const content = pageContent as PageContent
const projects = projectsData as Project[]
const featuredProjects = projects.slice(0, 3)
const moreProjects = projects.slice(3)

export default function App() {
  const [activeId, setActiveId] = useState<string | null>('cover')

  useSoftPageHandoff()
  useSectionSettle()
  useAccentSection()

  // Scroll-spy: report the project currently crossing the reading band.
  // This state only updates navigation highlights; it never writes the page's
  // scroll position or changes project/workflow state.
  // Guarded so it can never activate while the quick-cards grid (#systems)
  // is itself still on screen — without this, a very tall first project
  // section can drift into the detection band on a large monitor while
  // someone is still just looking at the quick cards, before they've
  // actually scrolled down into that project's content.
  //
  // #systems is also observed directly (not just used for the bounding-rect
  // check above) so activeId explicitly clears back to null when the user
  // scrolls back up to it — without this, a project's card stayed
  // permanently highlighted after its section was first visited, since
  // nothing ever reset activeId once set.
  useEffect(() => {
    const coverEl = document.getElementById('cover')
    const systemsEl = document.getElementById('systems')
    const projectEls = projects
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => el !== null)
    if (projectEls.length === 0 || !coverEl || !systemsEl) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          if (entry.target === coverEl) {
            setActiveId('cover')
            return
          }
          if (entry.target === systemsEl) {
            setActiveId('systems')
            return
          }
          const stillShowingQuickCards = systemsEl.getBoundingClientRect().bottom > 0
          if (stillShowingQuickCards) return
          setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-18% 0px -76% 0px', threshold: 0 },
    )
    observer.observe(coverEl)
    observer.observe(systemsEl)
    projectEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <AmbientBackground />

      <div className="page-content">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Nav nav={content.nav} />
        <SectionRail projects={projects} activeId={activeId} />
        <main id="main-content">
        <Hero content={content} />

        <ProofSummary
          projects={projects}
          heading={content.systemsHeading}
          statement={content.systemsStatement}
          activeId={activeId}
        />

        <div className="wrap">
          <section id="flagship-featured" aria-label="Featured systems">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>

          <MoreSystems projects={moreProjects} />
          <SupportingSystems supporting={content.supporting} />
        </div>
        </main>

        <Footer footer={content.footer} />
      </div>
    </>
  )
}
