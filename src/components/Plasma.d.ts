import type { FC } from 'react'

export interface PlasmaProps {
  color?: string
  speed?: number
  direction?: 'forward' | 'reverse' | 'pingpong'
  scale?: number
  opacity?: number
  mouseInteractive?: boolean
}

declare const Plasma: FC<PlasmaProps>
export default Plasma
