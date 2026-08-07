import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { gatewayObjects } from '../../data/gatewayObjects'

type CameraDirectorProps = {
  selectedId: string
  reducedMotion: boolean
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value)
}

export function CameraDirector({ selectedId, reducedMotion }: CameraDirectorProps) {
  const { camera, invalidate } = useThree()
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const selected = gatewayObjects.find((item) => item.id === selectedId) ?? gatewayObjects[0]
    const startPosition = camera.position.clone()
    const endPosition = new Vector3(...selected.focusCameraPosition)
    const endTarget = new Vector3(...selected.focusCameraTarget)

    if (reducedMotion) {
      camera.position.copy(endPosition)
      camera.lookAt(endTarget)
      invalidate()
      return
    }

    const startTime = performance.now()
    const duration = 720

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration)
      const eased = smoothstep(progress)
      camera.position.lerpVectors(startPosition, endPosition, eased)
      camera.lookAt(endTarget)
      invalidate()
      if (progress < 1) {
        animationRef.current = window.requestAnimationFrame(tick)
      }
    }

    animationRef.current = window.requestAnimationFrame(tick)
    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current)
      }
    }
  }, [camera, invalidate, reducedMotion, selectedId])

  return null
}