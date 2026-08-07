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
// normal. Fires once via IntersectionObserver; does not restart on
// resize or on small scroll movement around the trigger threshold,
// because the observer disconnects itself the first time it fires.
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
  const triggeredRef = useRef(false)

  const wordEntriesRef = useRef(lines.flatMap((line) => line.split(' ')))
  const totalWords = wordEntriesRef.current.length

  useEffect(() => {
    if (reducedMotion) {
      setRevealedCount(totalWords)
      return
    }
    const el = containerRef.current
    if (!el || triggeredRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || triggeredRef.current) return
        triggeredRef.current = true
        observer.disconnect()

        let elapsed = 200 // wait after the label before the first word
        const timers: number[] = []
        wordEntriesRef.current.forEach((word, i) => {
          const id = window.setTimeout(() => setRevealedCount((c) => Math.max(c, i + 1)), elapsed)
          timers.push(id)
          const endsWithPunctuation = /[,.]$/.test(word)
          elapsed += 90 + (endsWithPunctuation ? 140 : 0)
        })
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
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
