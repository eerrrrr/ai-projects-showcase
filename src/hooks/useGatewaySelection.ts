import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { GatewayObjectConfig } from '../data/gatewayObjects'

export function useGatewaySelection(objects: GatewayObjectConfig[]) {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(objects[0]?.id ?? 'ai')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const activeObject = useMemo(
    () => objects.find((item) => item.id === hoveredId || item.id === selectedId) ?? objects[0],
    [hoveredId, objects, selectedId],
  )

  function select(id: string) {
    setSelectedId(id)
    setHoveredId(id)
  }

  function hover(id: string | null) {
    setHoveredId(id)
  }

  function clear() {
    const firstId = objects[0]?.id ?? 'ai'
    setSelectedId(firstId)
    setHoveredId(null)
  }

  function navigateTo(id: string) {
    const target = objects.find((item) => item.id === id)
    if (target?.external && target.externalUrl) {
      window.open(target.externalUrl, '_blank', 'noreferrer')
      return
    }
    if (target?.route) {
      navigate(target.route)
    }
  }

  return {
    selectedId: activeObject.id,
    selectedObject: activeObject,
    select,
    hover,
    clear,
    navigateTo,
  }
}