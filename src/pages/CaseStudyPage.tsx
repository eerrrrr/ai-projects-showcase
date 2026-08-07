import { Link, useParams } from 'react-router-dom'
import projectsData from '../data/projects.json'
import type { Project } from '../data/types'
import { CaseStudyLayout } from '../components/v2/CaseStudyLayout'
import '../styles/v2/tokens.css'
import '../styles/v2/hero.css'
import '../styles/v2/case-study.css'
import '../styles/v2/workflow-diagram.css'

const projects = projectsData as Project[]

export function CaseStudyPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const project = projects.find((item) => item.id === projectId)

  // CaseStudyLayout is fully generic (no project-specific literals — it
  // renders whichever of problemHtml/workflowHtml/resultShortHtml/
  // failureHandledHtml/decisionHtml/limitationHtml/human-actor stages
  // genuinely exist on the project, matching systemChapterContent.ts's
  // same source-of-truth logic used on the overview page). All 7 real
  // projects work through it directly — the only remaining fallback case
  // is a URL that doesn't match any real project id at all.
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
  const nextProject = sorted[currentIndex + 1] ?? null

  return (
    <div className="v2-page">
      <main>
        <CaseStudyLayout project={project} nextProject={nextProject} />
      </main>
    </div>
  )
}
