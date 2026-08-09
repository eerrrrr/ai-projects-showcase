import { useEffect, useMemo, useRef, useState } from 'react'
import { Html } from '../Html'

// Per direct feedback: some project fields (problemHtml, workflowHtml,
// resultShortHtml/resultHtml, the human-decision paragraphs) are a plain
// sentence/paragraph in projects.json, while others (goalHtml, methodHtml,
// failureHandledHtml, limitationHtml) are already authored as <ul><li>
// lists — so the same evidence table showed some panels bulleted and
// others as a flat paragraph, inconsistently, across all 7 projects.
// Rather than rewriting projects.json content (a standing rule this
// project has followed throughout — the actual words never change here,
// only how they're wrapped), this normalizes the HTML at render time,
// centralized in this one shared component so both the overview
// EvidenceInspector table and the full case-study page rows get the same
// consistent bulleted treatment automatically.
function toBulletHtml(html: string): string {
  if (!html) return html
  // Already a real list — leave untouched.
  if (/<(ul|ol)[\s>]/i.test(html)) return html
  // Multiple <p> paragraphs (the human-decision entry, built from several
  // stage paragraphs + a decision paragraph) — one bullet per paragraph.
  const paragraphs = html.match(/<p>[\s\S]*?<\/p>/gi)
  if (paragraphs && paragraphs.length > 0) {
    const items = paragraphs.map((p) => `<li>${p.replace(/^<p>|<\/p>$/gi, '')}</li>`).join('')
    return `<ul>${items}</ul>`
  }
  // A single plain sentence/paragraph with no markup at all — wrap the
  // whole thing as one bullet, so every panel at least reads as a list
  // rather than some being bulleted and others a flat block of text.
  return `<ul><li>${html}</li></ul>`
}

// Shared progressive-disclosure wrapper — originally built for the
// overview EvidenceInspector, now reused by CaseStudyLayout.tsx too so
// both the compact overview panel and the full case-study page collapse
// long source content the same way instead of each inventing its own
// pattern. Collapses more than 3 list items or more than 2 top-level
// blocks behind "Show full notes", using the real rendered DOM (native
// `hidden` attribute) rather than string-parsing the source HTML.
// Nothing is deleted or rewritten; collapsed items stay in the DOM.
export function QuickReadContent({ html: rawHtml, className }: { html: string; className?: string }) {
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [overflowCount, setOverflowCount] = useState(0)
  const html = useMemo(() => toBulletHtml(rawHtml), [rawHtml])

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
