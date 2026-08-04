export type GatewayObjectConfig = {
  id: string
  title: string
  category: string
  route: string
  description: string
  ctaLabel: string
  objectType: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  focusCameraPosition: [number, number, number]
  focusCameraTarget: [number, number, number]
  enabled: boolean
  external?: boolean
  externalUrl?: string
}

export const gatewayObjects: GatewayObjectConfig[] = [
  {
    id: 'ai',
    title: 'AI',
    category: 'Safe transitional landing',
    route: '/ai',
    description: 'The existing AI portfolio, kept intact and still reachable from the gateway.',
    ctaLabel: 'Enter AI portfolio',
    objectType: '3D card stack',
    position: [-3.1, 0.08, 1.5],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    focusCameraPosition: [-4.4, 2.9, 4.7],
    focusCameraTarget: [-3.0, 0.16, 1.4],
    enabled: true,
  },
  {
    id: 'architecture',
    title: 'Architecture',
    category: 'External portfolio link',
    route: '/architecture',
    description: 'A transition page for the separately maintained architecture portfolio.',
    ctaLabel: 'Open architecture page',
    objectType: '3D model study',
    position: [0.75, 0.06, -0.45],
    rotation: [0, -0.4, 0],
    scale: [1, 1, 1],
    focusCameraPosition: [1.3, 3.0, 4.6],
    focusCameraTarget: [0.9, 0.6, -0.2],
    enabled: true,
  },
  {
    id: 'future',
    title: 'Future work',
    category: 'Placeholder for next category',
    route: '/about',
    description: 'An original abstract object reserved for future Making, Game or Product work.',
    ctaLabel: 'See future work',
    objectType: '3D abstract marker',
    position: [3.05, 0.07, 1.15],
    rotation: [0, 0.5, 0],
    scale: [1, 1, 1],
    focusCameraPosition: [4.25, 3.0, 4.7],
    focusCameraTarget: [3.1, 0.4, 1.1],
    enabled: true,
  },
]

export const gatewayRouteMap: Record<string, string> = {
  ai: '/ai',
  architecture: '/architecture',
  future: '/about',
}

export const architectureGatewayConfig = gatewayObjects[1]