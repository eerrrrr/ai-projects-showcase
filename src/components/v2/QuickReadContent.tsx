import { useEffect, useRef, useState } from 'react'
import { Html } from '../Html'

// Shared progressive-disclosure wrapper — originally built for the
// overview EvidenceInspector, now reused by CaseStudyLayout.tsx too so
// both the compact overview panel and the full case-study page collapse
// long source content the same way instead of each inventing its own
// pattern. Collapses more than 3 list items or more than 2 top-level
// blocks behind "Show full notes", using the real rendered DOM (native
// `hidden` attribute) rather than string-parsing the source HTML.
// Nothing is deleted or rewritten; collapsed items stay in the DOM.
export function QuickReadContent({ html, className }: { html: string; className?: string }) {
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
      <Html as="div" ref={containerRef} className={className ?? 'v2-evidenceInspector-content'} html={html} />
      {overflowCount > 0 && (
        <button type="button" className="v2-quickread-toggle" onClick={() => setExpanded((e) => !e)}>
          {expanded ? 'Hide full notes' : `Show full notes (+${overflowCount})`}
        </button>
      )}
    </div>
  )
}
