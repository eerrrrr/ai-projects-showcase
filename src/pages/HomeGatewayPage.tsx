import { Suspense } from 'react'
import { PortfolioGateway } from '../components/gateway/PortfolioGateway'

export function HomeGatewayPage() {
  return (
    <Suspense fallback={<div className="gateway-shell gateway-shell--loading">Loading gateway...</div>}>
      <PortfolioGateway />
    </Suspense>
  )
}