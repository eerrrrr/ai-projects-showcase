import { useEffect, useState } from 'react'

// Mirrors useReducedMotion.ts's pattern exactly. Used to gate the Hero's
// pointer-proximity engine off entirely on touch/coarse-pointer devices
// (see PORTFOLIO_V2_INTERACTION_AND_WORKFLOW_BUILD_PROMPT.md's proximity-
// engine pass, Phase 13) — CSS `(pointer: coarse)` media queries already
// hide the relevant DOM layers, but this additionally stops the rAF loop
// itself from running at all on those devices, rather than running
// uselessly under `display:none`.
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)')
    const update = () => setCoarse(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return coarse
}
