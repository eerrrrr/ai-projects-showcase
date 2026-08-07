import { useEffect } from 'react'

// Feature flag — flip to false to disable with one line.
export const ENABLE_ACCENT_SCALE = true

// Purely decorative: watches which major section is currently in view and
// stamps `data-accent-section` on <html> so the CSS variable overrides in
// global.css (`:root[data-accent-section="..."]`) can take effect. This
// hook never reads or sets any workflow/expand state, and never calls
// scrollTo — it only observes, it never moves the page. Disabling
// ENABLE_ACCENT_SCALE (or removing this hook's call entirely) leaves the
// site at its single default --accent color with zero other change.
export function useAccentSection() {
  useEffect(() => {
    if (!ENABLE_ACCENT_SCALE) return

    const heroEl = document.querySelector<HTMLElement>('[data-page-section="hero"]')
    const systemsEl = document.querySelector<HTMLElement>('[data-page-section="systems"]')
    const projectEls = [...document.querySelectorAll<HTMLElement>('.project')]
    const footerEl = document.querySelector<HTMLElement>('[data-page-section="footer"]')

    const sections: { el: HTMLElement; key: string }[] = []
    if (heroEl) sections.push({ el: heroEl, key: 'hero' })
    if (systemsEl) sections.push({ el: systemsEl, key: 'systems' })
    projectEls.forEach((el, i) => sections.push({ el, key: `system${String(i + 1).padStart(2, '0')}` }))
    if (footerEl) sections.push({ el: footerEl, key: 'footer' })
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const match = sections.find((s) => s.el === entry.target)
          if (match) document.documentElement.dataset.accentSection = match.key
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    sections.forEach((s) => observer.observe(s.el))
    return () => observer.disconnect()
  }, [])
}
