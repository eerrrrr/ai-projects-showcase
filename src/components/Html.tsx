import { forwardRef } from 'react'
import type { CSSProperties, ElementType } from 'react'

// Shared renderer for the small amount of static, author-written markup in
// the JSON data (bold emphasis, <br> line breaks, &nbsp;, <span class="num">
// highlights) — never user input, see the trust-boundary note in data/types.ts.
export const Html = forwardRef<
  HTMLElement,
  { as?: ElementType; html: string; className?: string; style?: CSSProperties }
>(function Html({ as: Tag = 'span', html, className, style }, ref) {
  return <Tag ref={ref} className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />
})
