import { useState } from 'react'
import type { RepresentativeCase, TestMatrixRow } from '../../data/types'

// Proof layer: a few representative cases shown first (fast scan), the
// full regression matrix behind one disclosure control (progressive
// depth) — driven by project.representativeCases/testMatrix, generic for
// reuse by any project with its own verified test suite. Renders nothing
// if the project has neither.
export function ProofMatrix({ cases, matrix }: { cases?: RepresentativeCase[]; matrix?: TestMatrixRow[] }) {
  const [expanded, setExpanded] = useState(false)
  const hasCases = cases && cases.length > 0
  const hasMatrix = matrix && matrix.length > 0
  if (!hasCases && !hasMatrix) return null

  return (
    <div className="v2-proofMatrix">
      {hasCases && (
        <ul className="v2-proofMatrix-cases">
          {cases.map((item) => (
            <li key={item.eyebrow} className="v2-proofMatrix-case">
              <span className="v2-proofMatrix-caseEyebrow">{item.eyebrow}</span>
              <ul className="v2-proofMatrix-caseLines">
                {item.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      {hasMatrix && (
        <>
          <button
            type="button"
            className="v2-proofMatrix-toggle"
            aria-expanded={expanded}
            aria-controls="proof-matrix-table"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? 'HIDE FULL TEST MATRIX' : `VIEW ALL ${matrix.length} TESTS`}
          </button>

          {expanded && (
            <div className="v2-proofMatrix-tableWrap" id="proof-matrix-table">
              <p className="v2-proofMatrix-summary">
                Deterministic regression suite · {matrix.length} cases · {matrix.filter((row) => row.result === 'PASS').length} passed ·{' '}
                {matrix.filter((row) => row.result !== 'PASS').length} failed
              </p>
              <table className="v2-proofMatrix-table">
                <thead>
                  <tr>
                    <th>CASE</th>
                    <th>INPUT</th>
                    <th>VALIDATION</th>
                    <th>SCREENING</th>
                    <th>RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row) => (
                    <tr key={row.caseId}>
                      <td>{row.caseId}</td>
                      <td>{row.input}</td>
                      <td>{row.validation}</td>
                      <td>{row.screening}</td>
                      <td className="v2-proofMatrix-result">
                        <span aria-hidden="true">✓</span> {row.result}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
