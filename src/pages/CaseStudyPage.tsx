import { Link, useParams } from 'react-router-dom'
import projectsData from '../data/projects.json'
import type { Project } from '../data/types'
import { CaseStudyLayout } from '../components/v2/CaseStudyLayout'
import '../styles/v2/tokens.css'
import '../styles/v2/hero.css'
import '../styles/v2/case-study.css'
import '../styles/v2/workflow-diagram.css'

const projects = projectsData as Project[]

// Only this project has a built-out full case-study page so far — every
// other id falls through to the "not yet available" state below rather
// than a broken/blank page.
const BUILT_CASE_STUDY_IDS = new Set(['job-application-filter'])

export function CaseStudyPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const project = projects.find((item) => item.id === projectId)

  if (!project || !BUILT_CASE_STUDY_IDS.has(project.id)) {
    return (
      <div className="v2-page">
        <div className="v2-grid v2-case-not-available">
          <div>
            <span className="v2-eyebrow">Not yet available</span>
            <p>
              {project
                ? 'This project doesn’t have a full case-study page yet.'
                : 'No project matches this link.'}
            </p>
            <Link to="/ai">← Back to overview</Link>
          </div>
        </div>
      </div>
    )
  }

  const sorted = [...projects].sort((a, b) => a.index - b.index)
  const currentIndex = sorted.findIndex((item) => item.id === project.id)
  const nextProject = sorted[currentIndex + 1] ?? null

  return (
    <div className="v2-page">
      <main>
        <CaseStudyLayout project={project} nextProject={nextProject} />
      </main>
    </div>
  )
}
