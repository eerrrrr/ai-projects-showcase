import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AiPortfolioV2Page } from './pages/AiPortfolioV2Page'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { NotFoundPage } from './pages/NotFoundPage'

// AiLandingPage (V1 content on the /ai route) is intentionally left
// unimported here, not deleted — src/pages/AiLandingPage.tsx still exists
// on disk. Rollback for the V2 Swiss redesign below is reverting this
// route's element back to <AiLandingPage />.
//
// Cancelled per direct instruction: the 3D tabletop gateway concept
// (HomeGatewayPage at "/", plus ArchitecturePage/AboutPage which only
// existed to be reached from its tiles) never worked as a landing
// experience and is removed from routing entirely — "/" now renders the
// same Swiss hero page as "/ai" directly, no gateway, no redirect flash.
// Gateway page files stay on disk unrouted (not deleted) in case of
// rollback.

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
        <Route path="/" element={<AiPortfolioV2Page />} />
        <Route path="/ai" element={<AiPortfolioV2Page />} />
        <Route path="/ai/:projectId" element={<CaseStudyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
