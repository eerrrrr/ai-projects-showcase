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
import './styles/global.css'

const content = pageContent as PageContent
const projects = projectsData as Project[]
const featuredProjects = projects.filter((p) => p.tier === 1)
const otherProjects = projects.filter((p) => p.tier !== 1)

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null)

  // Scroll-spy: highlight whichever featured project's full section is
  // currently in view, on the systems-overview quick cards above it.
  useEffect(() => {
    const els = featuredProjects
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Nav nav={content.nav} />
      <Hero content={content} />

      <ProofSummary
        projects={featuredProjects}
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
