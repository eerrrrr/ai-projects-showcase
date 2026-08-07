import { useEffect, useState } from 'react'
import pageContent from '../data/page-content.json'
import projectsData from '../data/projects.json'
import type { PageContent, Project } from '../data/types'
import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { AmbientBackground } from '../components/AmbientBackground'
import { ProofSummary } from '../components/ProofSummary'
import { ProjectCard } from '../components/ProjectCard'
import { SupportingSystems } from '../components/SupportingSystems'
import { Footer } from '../components/Footer'
import { SectionRail } from '../components/SectionRail'
import { useSoftPageHandoff } from '../hooks/useSoftPageHandoff'
import { useSectionSettle } from '../hooks/useSectionSettle'
import { useAccentSection } from '../hooks/useAccentSection'
import '../styles/global.css'

const content = pageContent as PageContent
const projects = projectsData as Project[]

export function AiLandingPage() {
  const [activeId, setActiveId] = useState<string | null>('cover')

  useSoftPageHandoff()
  useSectionSettle()
  useAccentSection()

  useEffect(() => {
    const coverEl = document.getElementById('cover')
    const systemsEl = document.getElementById('systems')
    const projectEls = projects
      .map((project) => document.getElementById(project.id))
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
    projectEls.forEach((element) => observer.observe(element))

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
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </section>
            <SupportingSystems supporting={content.supporting} />
          </div>
        </main>

        <Footer footer={content.footer} />
      </div>
    </>
  )
}