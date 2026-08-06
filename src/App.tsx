import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AiPortfolioV2Page } from './pages/AiPortfolioV2Page'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { HomeGatewayPage } from './pages/HomeGatewayPage'
import { ArchitecturePage } from './pages/ArchitecturePage'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/NotFoundPage'

// AiLandingPage (V1 content on the /ai route) is intentionally left
// unimported here, not deleted — src/pages/AiLandingPage.tsx still exists
// on disk. Rollback for the V2 Swiss redesign below is reverting this
// route's element back to <AiLandingPage />.

function RedirectBridge() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const redirectPath = params.get('redirect')

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />
  }

  return null
}

export default function App() {
  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <RedirectBridge />
      <Routes>
        <Route path="/" element={<HomeGatewayPage />} />
        <Route path="/ai" element={<AiPortfolioV2Page />} />
        <Route path="/ai/:projectId" element={<CaseStudyPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
