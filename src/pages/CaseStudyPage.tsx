import { useLayoutEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import projectsData from '../data/projects.json'
import type { Project } from '../data/types'
import { CaseStudyLayout } from '../components/v2/CaseStudyLayout'
import '../styles/v2/tokens.css'
import '../styles/v2/hero.css'
import '../styles/v2/case-study.css'
import '../styles/v2/system-chapter.css'
import '../styles/v2/workflow-diagram.css'

const projects = projectsData as Project[]

export function CaseStudyPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const project = projects.find((item) => item.id === projectId)

  // Real bug, confirmed live: navigating between case pages (or from the
  // overview into one) kept the previous scroll position — a System 03
  // link could land the new page already scrolled into its Limitations
  // section. Runs on every projectId change, not just on first mount.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [projectId])

  // CaseStudyLayout is fully generic (no project-specific literals — it
  // renders whichever of problemHtml/workflowHtml/resultShortHtml/
  // failureHandledHtml/decisionHtml/limitationHtml/human-actor stages
  // genuinely exist on the project). All 7 real projects work through it
  // directly — the only remaining fallback case is a URL that doesn't
  // match any real project id at all.
  if (!project) {
    return (
      <div className="v2-page">
        <div className="v2-grid v2-case-not-available">
          <div>
            <span className="v2-eyebrow">Not found</span>
            <p>No project matches this link.</p>
            <Link to="/ai">← Back to overview</Link>
          </div>
        </div>
      </div>
    )
  }

  const sorted = [...projects].sort((a, b) => a.index - b.index)
  const currentIndex = sorted.findIndex((item) => item.id === project.id)
  const prevProject = currentIndex > 0 ? sorted[currentIndex - 1] : null
  const nextProject = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null

  return (
    <div className="v2-page">
      <main>
        <CaseStudyLayout
          project={project}
          prevProject={prevProject}
          nextProject={nextProject}
          position={`${String(currentIndex + 1).padStart(2, '0')} / ${String(sorted.length).padStart(2, '0')}`}
        />
      </main>
    </div>
  )
}
