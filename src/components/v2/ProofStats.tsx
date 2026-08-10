import type { ProofStat } from '../../data/types'

// Generic top-level proof figures (e.g. "8 / 8 regression tests passed") —
// System 01 Professional V2 pass, 2026-08-09, but driven entirely by
// project.proofStats so any other project can adopt the same pattern
// later without a new component. Renders nothing if the project has no
// proofStats.
export function ProofStats({ stats }: { stats?: ProofStat[] }) {
  if (!stats || stats.length === 0) return null
  return (
    <ul className="v2-proofStats">
      {stats.map((stat) => (
        <li key={stat.label} className="v2-proofStats-item">
          <span className="v2-proofStats-value">{stat.value}</span>
          <span className="v2-proofStats-label">{stat.label}</span>
          {stat.sublabel && <span className="v2-proofStats-sublabel">{stat.sublabel}</span>}
        </li>
      ))}
    </ul>
  )
}
