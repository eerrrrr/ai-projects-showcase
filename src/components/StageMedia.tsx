import { useState } from 'react'
import type { Stage } from '../data/types'

// Shows the selected stage's screenshot if the file actually exists on
// disk; falls back to an honest placeholder otherwise (most stages don't
// have a real capture yet — see public/case-media/<project>/README.txt).
export function StageMedia({ stage }: { stage: Stage }) {
  const [errored, setErrored] = useState(false)
  const hasImage = Boolean(stage.image) && !errored
  // public/ paths are root-relative; respect vite.config.ts's base (this
  // site is served under /ai-projects-showcase/, not site root).
  const src = stage.image ? import.meta.env.BASE_URL + stage.image.replace(/^\//, '') : undefined

  return (
    <div className="stage-media">
      {hasImage ? (
        <img src={src} alt={stage.caption ?? stage.title} onError={() => setErrored(true)} />
      ) : (
        <div className="stage-media-placeholder">Proof capture to be added.</div>
      )}
      {stage.caption && <p className="stage-media-caption mono">{stage.caption}</p>}
    </div>
  )
}
