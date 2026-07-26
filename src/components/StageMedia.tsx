import { useState } from 'react'
import type { Stage } from '../data/types'

// Shows the selected stage's screenshot if the file actually exists on
// disk (public/ paths are root-relative; respect vite.config.ts's base —
// this site is served under /ai-projects-showcase/, not site root).
//
// No real capture exists for any stage on this site yet (see
// public/case-media/<project>/README.txt) — a large dashed "Proof capture
// to be added" box reads as unfinished on a public page, so this never
// renders an empty placeholder. If the stage has its own caption (already
// human-written, verified copy — not new invented proof), that shows as a
// quiet one-line evidence note instead; if it has neither an image nor a
// caption, nothing renders at all rather than an apologetic box.
export function StageMedia({ stage }: { stage: Stage }) {
  const [errored, setErrored] = useState(false)
  const hasImage = Boolean(stage.image) && !errored
  const src = stage.image ? import.meta.env.BASE_URL + stage.image.replace(/^\//, '') : undefined

  if (hasImage) {
    return (
      <div className="stage-media">
        <img
          src={src}
          alt={stage.caption ?? stage.title}
          loading="lazy"
          decoding="async"
          onError={() => setErrored(true)}
        />
        {stage.caption && <p className="stage-media-caption mono">{stage.caption}</p>}
      </div>
    )
  }

  if (stage.caption) {
    return <p className="stage-evidence-note mono">{stage.caption}</p>
  }

  return null
}
