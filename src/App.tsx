import { useEffect, useState } from 'react'
import pageContent from './data/page-content.json'
import projectsData from './data/projects.json'
import type { PageContent, Project } from './data/types'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ProofSummary } from './components/ProofSummary'
import { ProjectCard } from './components/ProjectCard'
import { SupportingSystems } from './components/SupportingSystems'
import { Footer } from './components/Footer'
import { useSoftPageHandoff } from './hooks/useSoftPageHandoff'
import './styles/global.css'

const content = pageContent as PageContent
const projects = projectsData as Project[]
const featuredProjects = projects.filter((p) => p.tier === 1)
const otherProjects = projects.filter((p) => p.tier !== 1)

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null)

  useSoftPageHandoff()

  // Scroll-spy: highlight whichever featured project's full section is
  // currently in view, on the systems-overview quick cards above it.
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
    const systemsEl = document.getElementById('systems')
    const projectEls = featuredProjects
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => el !== null)
    if (projectEls.length === 0 || !systemsEl) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === systemsEl) {
            if (entry.isIntersecting) setActiveId(null)
            return
          }
          if (!entry.isIntersecting) return
          const stillShowingQuickCards = systemsEl.getBoundingClientRect().bottom > 0
          if (stillShowingQuickCards) return
          setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    )
    observer.observe(systemsEl)
    projectEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Nav nav={content.nav} />
      <Hero content={content} />

      <ProofSummary
        projects={projects}
        sectionNo={content.systemsSectionNo}
        heading={content.systemsHeading}
        activeId={activeId}
      />

      <div className="wrap">
        <section id="flagship-featured">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>

        <section id="flagship">
          <div className="sec-head">
            <span className="no">{content.flagshipSectionNo}</span>
            <h2 dangerouslySetInnerHTML={{ __html: content.flagshipHeading }} />
            <span className="sub mono">{content.flagshipSub}</span>
          </div>
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <SupportingSystems supporting={content.supporting} />
        </section>
      </div>

      <Footer footer={content.footer} />
    </>
  )
}
