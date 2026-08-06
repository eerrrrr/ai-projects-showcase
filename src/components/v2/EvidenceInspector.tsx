import { useEffect, useState } from 'react'
import type { EvidenceEntry } from '../../data/systemChapterContent'
import { Html } from '../Html'

// Correction batch §F/G/H — replaces the six independently-expanding
// <details> blocks (which pushed the chapter taller every time one
// opened, confusing the roll engine's page-range math and letting a
// previous chapter's expanded content still occupy space while the next
// chapter rolled in). Exactly one entry may be open at a time, in one
// shared panel below a compact label selector — the panel's own open/
// close doesn't change the STICKY STAGE's height (the stage is
// min-height:100svh with overflow:clip; see system-chapter.css), so
// opening evidence can no longer distort the roll engine's chapter
// boundaries.
//
// All original content is preserved verbatim (via buildEvidenceEntries)
// — this only changes how many can be visible at once, never what's in
// them.
export function EvidenceInspector({ entries, isActive }: { entries: EvidenceEntry[]; isActive: boolean }) {
  const [activeKey, setActiveKey] = useState<string | null>(null)

  // §H — mandatory cleanup: when this chapter stops being the single
  // active one, its evidence panel must not remain open while the next
  // chapter is rolling into view.
  useEffect(() => {
    if (!isActive) setActiveKey(null)
  }, [isActive])

  if (entries.length === 0) return null

  const activeEntry = entries.find((entry) => entry.label === activeKey) ?? null

  return (
    <div className="v2-evidenceInspector">
      <div className="v2-evidenceInspector-grid" role="tablist" aria-label="Evidence">
        {entries.map((entry) => {
          const selected = activeKey === entry.label
          return (
            <button
              key={entry.label}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-expanded={selected}
              className={`v2-evidenceInspector-tab${selected ? ' v2-evidenceInspector-tab--active' : ''}`}
              onClick={() => setActiveKey((current) => (current === entry.label ? null : entry.label))}
            >
              <span>{entry.label}</span>
              <span aria-hidden="true">{selected ? '−' : '+'}</span>
            </button>
          )
        })}
      </div>

      {activeEntry && (
        <div className="v2-evidenceInspector-panel" role="tabpanel" key={activeEntry.label}>
          <Html as="div" className="v2-evidenceInspector-content" html={activeEntry.html} />
        </div>
      )}
    </div>
  )
}
