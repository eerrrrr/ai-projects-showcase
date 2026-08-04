import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AiLandingPage } from './pages/AiLandingPage'
import { HomeGatewayPage } from './pages/HomeGatewayPage'
import { ArchitecturePage } from './pages/ArchitecturePage'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/NotFoundPage'

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
        <Route path="/ai" element={<AiLandingPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
