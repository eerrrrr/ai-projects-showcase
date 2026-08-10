import type { RepresentativeCase } from '../../data/types'

// "How the system makes a decision" — 2-4 cases, each showing four
// explicitly labelled layers so the core architecture point (each
// project's own 4 decision axes are separate questions) reads
// immediately. Generic on the same {eyebrow, lines} shape ProofMatrix/
// testEvidencePreview already use. A case whose data was BLOCKED never
// reaches a human decision at all — its layer for that axis reads "NOT
// REACHED", not a decision value, matching the real control flow
// (System 01 V2 correction, 2026-08-09).
//
// `layerLabels` is caller-supplied (CaseStudyLayout.tsx passes each
// project's own systemLogicConcepts eyebrows) so the chip above each
// line names that PROJECT's real decision axis, not a fixed set.
// DATA/FIT/HUMAN/GUARD remains the fallback for any project without its
// own systemLogicConcepts (System 01's original shape, byte-identical
// to before this was made generic — its lines are bare values with no
// embedded label, which only reads correctly against this exact
// fallback). Reconciliation fix, 2026-08-10: Systems 02-04 each embedded
// their own "LABEL: value" text directly in `lines` to work around the
// previously-hardcoded fallback always showing DATA/FIT/HUMAN/GUARD
// regardless of the project's real axes — that produced doubled,
// sometimes actively mismatched labels (a "HUMAN" chip over a
// note-quality value, for instance). Reverted those projects' lines
// back to bare values now that the real per-project label is passed in
// properly.
const FALLBACK_LAYER_LABELS = ['DATA', 'FIT', 'HUMAN', 'GUARD']

export function DecisionCases({ cases, layerLabels }: { cases?: RepresentativeCase[]; layerLabels?: string[] }) {
  if (!cases || cases.length === 0) return null
  const labels = layerLabels && layerLabels.length > 0 ? layerLabels : FALLBACK_LAYER_LABELS
  return (
    <ul className="v2-decisionCases">
      {cases.map((item) => (
        <li key={item.eyebrow} className="v2-decisionCase">
          <span className="v2-decisionCase-eyebrow">{item.eyebrow}</span>
          <div className="v2-decisionCase-layers">
            {item.lines.map((line, i) => (
              <div className="v2-decisionCase-layer" key={labels[i] ?? i}>
                <span className="v2-decisionCase-layerLabel">{labels[i] ?? ''}</span>
                <span className="v2-decisionCase-layerValue">{line}</span>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}
