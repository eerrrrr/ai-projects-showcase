import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Shared restrained reveal system (PASS A §8) — one implementation reused
// by every page-level heading, eyebrow and statement site-wide (Manifesto,
// Selected Systems, every chapter number/title, Supporting Infrastructure,
// Closing) instead of each page hand-rolling its own IntersectionObserver.
// Transform + opacity only, fires once per element, reduced-motion shows
// content immediately with no motion at all.
export function Reveal({
  children,
  as: Component = 'div',
  className,
  delayMs = 0,
  ...rest
}: {
  children: ReactNode
  as?: ElementType
  className?: string
  delayMs?: number
  [key: string]: unknown
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true)
      return
    }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <Component
      ref={ref}
      className={`v2-reveal${visible ? ' v2-reveal--visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: `${delayMs}ms` }}
      {...rest}
    >
      {children}
    </Component>
  )
}
