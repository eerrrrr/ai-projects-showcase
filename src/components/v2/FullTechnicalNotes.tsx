import { useState } from 'react'
import { QuickReadContent } from './QuickReadContent'

interface CaseSection {
  label: string
  html: string
}

// Detail-page final section — the original Why it exists / How it works /
// Human decision / Proof / Control / Implementation content (the exact
// same fields the pre-two-level-storytelling detail page always showed),
// plus known dependencies and the current technical boundary, all demoted
// to secondary, behind one disclosure control, instead of being the
// page's primary information architecture (GOV.UK accordion guidance:
// don't collapse content most readers need — do collapse full matrices,
// node-level implementation, exact rule definitions, known dependencies).
// Nothing is deleted — every field CaseStudyLayout.tsx already derives
// via buildCaseSections is still here, just no longer the first thing a
// reader sees.
export function FullTechnicalNotes({
  sections,
  knownDependencies,
  currentBoundary,
}: {
  sections: CaseSection[]
  knownDependencies?: string[]
  currentBoundary?: string
}) {
  const [expanded, setExpanded] = useState(false)
  if (sections.length === 0 && !knownDependencies && !currentBoundary) return null

  return (
    <div className="v2-fullTechnicalNotes">
      <button type="button" className="v2-fullTechnicalNotes-toggle" aria-expanded={expanded} onClick={() => setExpanded((e) => !e)}>
        {expanded ? 'HIDE FULL TECHNICAL NOTES' : 'FULL TECHNICAL NOTES ↓'}
      </button>
      {expanded && (
        <div className="v2-fullTechnicalNotes-body">
          {sections.map((section) => (
            <div className="v2-grid v2-caseRow" key={section.label}>
              <span className="v2-caseRow-label">{section.label}</span>
              <div className="v2-caseRow-content">
                <QuickReadContent html={section.html} className="v2-caseRow-prose" />
              </div>
            </div>
          ))}
          {currentBoundary && (
            <div className="v2-grid v2-caseRow">
              <span className="v2-caseRow-label">Current boundary</span>
              <div className="v2-caseRow-content">
                <p className="v2-caseRow-prose">{currentBoundary}</p>
              </div>
            </div>
          )}
          {knownDependencies && knownDependencies.length > 0 && (
            <div className="v2-grid v2-caseRow">
              <span className="v2-caseRow-label">Known dependencies</span>
              <div className="v2-caseRow-content">
                <ul className="v2-caseRow-prose">
                  {knownDependencies.map((dep) => (
                    <li key={dep}>{dep}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
