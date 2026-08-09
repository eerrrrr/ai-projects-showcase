import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Word-by-word mechanical reveal for the Approach/Manifesto statement —
// replaces the previous whole-line Reveal, which showed each line as one
// complete block rather than individual words appearing in sequence.
//
// Every word is rendered in its final layout position from the start
// (display: inline-block, only opacity/transform animate) — no word is
// inserted into the DOM progressively, so there is no layout reflow as
// the sequence plays and natural text wrapping still works exactly as
// normal.
//
// Per direct feedback (two corrections):
// 1. Trigger timing — threshold was 0.2 (fires once a mere 20% of the
//    block is visible), which happens very early during scroll, so by
//    the time a user actually arrives and looks at the section the
//    whole reveal had already finished silently in the background.
//    Raised to 0.5 so it starts once the block is substantially in
//    view, closer to when it's actually being looked at.
// 2. Replays on every re-entry, not just the first time ever — the
//    original "fires once via IntersectionObserver, then disconnects"
//    design meant scrolling away and back (in either direction) never
//    replayed it. Now resets to hidden when the block leaves the
//    viewport and replays the full sequence on each re-entry, whether
//    scrolling down into it or back up into it from below.
export function WordTypeReveal({
  lines,
  ariaLabel,
  as: Component = 'h2',
  className,
}: {
  lines: string[]
  ariaLabel: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  className?: string
}) {
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLElement | null>(null)
  const [revealedCount, setRevealedCount] = useState(0)
  const timersRef = useRef<number[]>([])

  const wordEntriesRef = useRef(lines.flatMap((line) => line.split(' ')))
  const totalWords = wordEntriesRef.current.length

  useEffect(() => {
    if (reducedMotion) {
      setRevealedCount(totalWords)
      return
    }
    const el = containerRef.current
    if (!el) return

    const clearTimers = () => {
      timersRef.current.forEach((id) => window.clearTimeout(id))
      timersRef.current = []
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimers()
        if (!entry.isIntersecting) {
          // Left the viewport (either direction) — reset to hidden so
          // the next entry replays the full sequence from the start.
          setRevealedCount(0)
          return
        }

        setRevealedCount(0)
        // Slowed down per direct feedback — the original 90ms stagger with
        // a 150ms fade (in reveal.css) read as a fast strobe rather than a
        // calm cascade. Kept as the only change: no other motion system in
        // this app was touched.
        let elapsed = 260 // wait after the label before the first word
        wordEntriesRef.current.forEach((word, i) => {
          const id = window.setTimeout(() => setRevealedCount((c) => Math.max(c, i + 1)), elapsed)
          timersRef.current.push(id)
          const endsWithPunctuation = /[,.]$/.test(word)
          elapsed += 150 + (endsWithPunctuation ? 200 : 0)
        })
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimers()
    }
  }, [reducedMotion, totalWords])

  let globalIndex = 0

  return (
    <Component ref={containerRef as never} className={className} aria-label={ariaLabel}>
      {lines.map((line, lineIndex) => {
        const lineWords = line.split(' ')
        return (
          <span className="v2-wordReveal-line" key={lineIndex} aria-hidden="true">
            {lineWords.map((word, wordIndex) => {
              const idx = globalIndex
              globalIndex += 1
              return (
                <span
                  key={wordIndex}
                  className={`v2-wordReveal-word${idx < revealedCount ? ' v2-wordReveal-word--visible' : ''}`}
                >
                  {word}
                  {wordIndex < lineWords.length - 1 ? ' ' : ''}
                </span>
              )
            })}
          </span>
        )
      })}
    </Component>
  )
}
