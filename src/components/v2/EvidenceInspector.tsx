import { useEffect, useRef, useState } from 'react'
import type { EvidenceEntry } from '../../data/systemChapterContent'
import { Html } from '../Html'

// Correction batch — replaces the six independently-expanding <details>
// blocks with one shared panel below a compact label selector. Exactly
// one entry may be open at a time. All original content is preserved
// verbatim (via buildEvidenceEntries) — this only changes how much is
// visible at once, never what's in it.
//
// 2nd-pass correction: short visible labels (full label kept in
// aria-label), plain disclosure-button semantics instead of
// tab/tabpanel (every item can be fully closed, which tablist semantics
// don't model correctly), and QuickReadContent below adds a real
// "Show full notes" progressive-disclosure layer on top of the existing
// content instead of dumping every bullet/paragraph at once.
const SHORT_LABELS: Record<string, string> = {
  Problem: 'Problem',
  Goal: 'Goal',
  Implementation: 'Build',
  Method: 'Method',
  'Human decision': 'Human check',
  Result: 'Outcome',
  'Failure handled': 'Failure',
  Limitations: 'Limits',
}

// Collapses source content that's genuinely long — more than 3 list
// items, or more than 2 top-level blocks — behind a "Show full notes"
// toggle, using the real rendered DOM (native `hidden` attribute, works
// across any element type) rather than string-parsing the source HTML.
// Nothing is deleted or rewritten; collapsed items stay in the DOM.
function QuickReadContent({ html }: { html: string }) {
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [overflowCount, setOverflowCount] = useState(0)

  useEffect(() => {
    setExpanded(false)
  }, [html])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const items = Array.from(container.querySelectorAll('li'))
    const blocks = Array.from(container.children) as HTMLElement[]

    if (items.length > 3) {
      items.forEach((item, i) => {
        item.hidden = !expanded && i >= 3
      })
      setOverflowCount(items.length - 3)
    } else if (blocks.length > 2) {
      blocks.forEach((block, i) => {
        block.hidden = !expanded && i >= 2
      })
      setOverflowCount(blocks.length - 2)
    } else {
      setOverflowCount(0)
    }
  }, [html, expanded])

  return (
    <div>
      <Html as="div" ref={containerRef} className="v2-evidenceInspector-content" html={html} />
      {overflowCount > 0 && (
        <button type="button" className="v2-quickread-toggle" onClick={() => setExpanded((e) => !e)}>
          {expanded ? 'Hide full notes' : `Show full notes (+${overflowCount})`}
        </button>
      )}
    </div>
  )
}

export function EvidenceInspector({ entries, isActive }: { entries: EvidenceEntry[]; isActive: boolean }) {
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const panelId = 'evidence-panel'

  // Mandatory cleanup: when this chapter stops being the single active
  // one, its evidence panel must not remain open while the next chapter
  // rolls into view.
  useEffect(() => {
    if (!isActive) setActiveKey(null)
  }, [isActive])

  if (entries.length === 0) return null

  const activeEntry = entries.find((entry) => entry.label === activeKey) ?? null

  return (
    <div className="v2-evidenceInspector">
      <div className="v2-evidenceInspector-grid" role="group" aria-label="Evidence">
        {entries.map((entry) => {
          const selected = activeKey === entry.label
          return (
            <button
              key={entry.label}
              type="button"
              aria-expanded={selected}
              aria-controls={selected ? panelId : undefined}
              aria-label={entry.label}
              className={`v2-evidenceInspector-tab${selected ? ' v2-evidenceInspector-tab--active' : ''}`}
              onClick={() => setActiveKey((current) => (current === entry.label ? null : entry.label))}
            >
              <span>{SHORT_LABELS[entry.label] ?? entry.label}</span>
              <span aria-hidden="true">{selected ? '−' : '+'}</span>
            </button>
          )
        })}
      </div>

      {activeEntry && (
        <div className="v2-evidenceInspector-panel" id={panelId} key={activeEntry.label}>
          <QuickReadContent html={activeEntry.html} />
        </div>
      )}
    </div>
  )
}
