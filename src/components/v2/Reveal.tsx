import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Shared restrained reveal system, reused by every major heading/eyebrow/
// row site-wide. Fires once per element via IntersectionObserver — an
// element that has already revealed stays fully opaque and never
// re-toggles pale as the user scrolls a few pixels around the trigger
// threshold (correction batch §J). `size="small"` is for eyebrows/page
// numbers/index metadata; the default is for major titles/statements —
// each keeps its own opacity floor and duration per §J rather than one
// value doing double duty for very different text sizes.
export function Reveal({
  children,
  as: Component = 'div',
  className,
  delayMs = 0,
  size = 'default',
  ...rest
}: {
  children: ReactNode
  as?: ElementType
  className?: string
  delayMs?: number
  size?: 'default' | 'small'
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

  const sizeClass = size === 'small' ? ' v2-reveal--small' : ''

  return (
    <Component
      ref={ref}
      className={`v2-reveal${sizeClass}${visible ? ' v2-reveal--visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: `${delayMs}ms` }}
      {...rest}
    >
      {children}
    </Component>
  )
}
