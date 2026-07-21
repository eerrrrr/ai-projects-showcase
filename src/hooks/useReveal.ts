import { useEffect, useRef, useState } from 'react'

const REVEAL_FAILSAFE_MS = 2500

// Ported from the original scroll-reveal IIFE, but per-component instead of
// a single global registry — each `.reveal` element calls this hook itself.
// Progressive enhancement, same as the source: the page stays fully visible
// unless the browser supports IntersectionObserver (only then do elements
// start hidden and animate in), and a failsafe guarantees nothing stays
// permanently invisible.
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const [isIn, setIsIn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      setIsIn(true)
      return
    }

    document.documentElement.classList.add('js-anim')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIn(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0, rootMargin: '0px 0px -5% 0px' },
    )
    observer.observe(el)
    const failsafe = setTimeout(() => setIsIn(true), REVEAL_FAILSAFE_MS)

    return () => {
      observer.disconnect()
      clearTimeout(failsafe)
    }
  }, [])

  return { ref, className: isIn ? 'reveal in' : 'reveal' }
}
