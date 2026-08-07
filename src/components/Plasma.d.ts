import type { FC, MutableRefObject } from 'react'

export interface PlasmaProps {
  color?: string
  speed?: number
  direction?: 'forward' | 'reverse' | 'pingpong'
  scale?: number
  opacity?: number
  mouseInteractive?: boolean
  // 0-1, read once per frame inside Plasma's own render loop to drift/
  // stretch the shape vertically — see AmbientBackground.tsx and the
  // uDriftY/uStretch uniforms in Plasma.jsx.
  scrollProgressRef?: MutableRefObject<number>
  // 2+ hex colors, continuously interpolated (never stepped) by the same
  // scroll progress that drives the shape distortion. Replaces `color` for
  // the animated hue when provided.
  colorStops?: string[]
}

declare const Plasma: FC<PlasmaProps>
export default Plasma
