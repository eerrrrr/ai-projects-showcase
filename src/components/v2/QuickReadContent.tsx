import { useMemo, useRef } from 'react'
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

// Per direct feedback: the "Show full notes (+N)" collapse is removed —
// the user does not want long text anyway ("i wont put too much text as
// good for the reading afterall"), so hiding a couple of items behind a
// click was solving a problem that no longer needs solving. Everything
// the real data has is just shown directly now. Kept as a thin wrapper
// (not inlined at call sites) only so toBulletHtml's normalization stays
// centralized in one place for both the overview EvidenceInspector panel
// and the full case-study page rows.
export function QuickReadContent({ html: rawHtml, className }: { html: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const html = useMemo(() => toBulletHtml(rawHtml), [rawHtml])

  return (
    <div>
      <Html as="div" ref={containerRef} className={className ?? 'v2-evidenceInspector-content'} html={html} />
    </div>
  )
}
