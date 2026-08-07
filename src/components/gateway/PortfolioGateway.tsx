import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gatewayObjects, gatewayRouteMap } from '../../data/gatewayObjects'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useGatewaySelection } from '../../hooks/useGatewaySelection'
import { GatewayNavigation } from './GatewayNavigation'
import { GatewayOverlay } from './GatewayOverlay'
import { GatewayFallback } from './GatewayFallback'
import { GatewayErrorBoundary } from './GatewayErrorBoundary'
import '../../styles/gateway.css'

const GatewayCanvas = lazy(() => import('./GatewayCanvas'))

function normalizePath(pathname: string) {
  return pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
}

export function PortfolioGateway() {
  const reducedMotion = useReducedMotion()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)
  const [webglUnavailable, setWebglUnavailable] = useState(false)
  const selection = useGatewaySelection(gatewayObjects)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const redirectPath = params.get('redirect')
    if (!redirectPath) return
    navigate(normalizePath(redirectPath) || '/', { replace: true })
  }, [location.search, navigate])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 860px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    setWebglUnavailable(false)
  }, [location.pathname])

  const shouldUseCanvas = !reducedMotion && !isMobile && !webglUnavailable
  const activeRoute = useMemo(
    () => gatewayRouteMap[selection.selectedId] ?? selection.selectedObject.route,
    [selection.selectedId, selection.selectedObject.route],
  )

  return (
    <main className="gateway-shell">
      <header className="gateway-header">
        <p className="gateway-eyebrow">Erin Wong</p>
        <h1>AI workflow systems</h1>
        <p className="gateway-intro">
          A tabletop gateway built from real geometry. Choose a category to move toward it or use the links below when
          WebGL is unavailable.
        </p>
      </header>

      <GatewayNavigation
        objects={gatewayObjects}
        selectedId={selection.selectedId}
        onSelect={selection.select}
        onActivate={selection.navigateTo}
      />

      <div className="gateway-stage">
        {shouldUseCanvas ? (
          <GatewayErrorBoundary onError={() => setWebglUnavailable(true)}>
            <Suspense fallback={<div className="gateway-canvas gateway-canvas--loading">Loading 3D scene...</div>}>
              <GatewayCanvas
                reducedMotion={reducedMotion}
                selectedId={selection.selectedId}
                onSelect={selection.select}
                onHover={selection.hover}
              />
            </Suspense>
          </GatewayErrorBoundary>
        ) : (
          <GatewayFallback
            selected={selection.selectedObject}
            objects={gatewayObjects}
            onSelect={selection.select}
            onNavigate={selection.navigateTo}
          />
        )}

        <GatewayOverlay
          selected={selection.selectedObject}
          route={activeRoute}
          onBackToTable={selection.clear}
          onEnterCategory={selection.navigateTo}
        />
      </div>

      <section className="gateway-secondary" aria-label="Secondary links">
        <Link className="gateway-secondary-link" to="/ai">
          Open existing AI portfolio
        </Link>
        <Link className="gateway-secondary-link" to="/about">
          About this gateway
        </Link>
      </section>
    </main>
  )
}