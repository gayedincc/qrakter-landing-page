import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
import GiveawayPage from './pages/GiveawayPage'
import CekilisLandingPage from './pages/CekilisLandingPage'
import HaftalikUygulamaPage from './pages/cekilis/haftalikuygulama/HaftalikUygulamaPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import { getAdminAccessToken, getStoredAdminUser, isAdminUser } from './utils/adminAuth'
import './styles/landing.css'

function normalizePath(pathname) {
  const trimmedPath = pathname.replace(/\/+$/, '')
  return trimmedPath || '/'
}

function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <ContactForm />
    </>
  )
}

function navigateToPath(path, setPathname) {
  const nextPath = normalizePath(path)

  if (nextPath === normalizePath(window.location.pathname)) {
    return
  }

  window.history.pushState({}, '', nextPath)
  setPathname(nextPath)
  window.scrollTo({ top: 0, behavior: 'auto' })
}

function replaceWithPath(path, setPathname) {
  const nextPath = normalizePath(path)

  if (nextPath === normalizePath(window.location.pathname)) {
    return
  }

  window.history.replaceState({}, '', nextPath)
  setPathname(nextPath)
  window.scrollTo({ top: 0, behavior: 'auto' })
}

function hasAdminPanelAccess() {
  return Boolean(getAdminAccessToken()) && isAdminUser(getStoredAdminUser())
}

function isPublicCekilisRoute(pathname) {
  return pathname === '/cekilis' || pathname.startsWith('/cekilis/')
}

function CekilisBackButton({ onClick }) {
  return (
    <div className="container cekilis-back-container">
      <button type="button" className="cekilis-back-button" onClick={onClick}>
        <span aria-hidden="true">←</span>
        Çekiliş türü seçimine dön
      </button>
    </div>
  )
}

function App() {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => {
      setPathname(normalizePath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const observe = () => {
      const els = document.querySelectorAll('.reveal')
      els.forEach((el) => observer.observe(el))
    }

    observe()

    const mutationObserver = new MutationObserver(observe)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [pathname])

  useEffect(() => {
    if (isPublicCekilisRoute(pathname)) {
      replaceWithPath('/panel/giris', setPathname)
      return
    }

    if (pathname.startsWith('/panel/cekilis') && !hasAdminPanelAccess()) {
      replaceWithPath('/panel/giris', setPathname)
    }
  }, [pathname])

  const isCekilisRoute = pathname === '/cekilis' || pathname.startsWith('/cekilis/')
  const isPanelRoute = pathname === '/panel/giris' || pathname.startsWith('/panel/')
  const showPublicChrome = !isPanelRoute && !isPublicCekilisRoute(pathname)

  const renderCurrentPage = () => {
    const renderPanelLogin = () => (
      <AdminLoginPage onLoginSuccess={() => navigateToPath('/panel/cekilis', setPathname)} />
    )

    if (pathname === '/panel/giris') {
      return renderPanelLogin()
    }

    if (isPublicCekilisRoute(pathname)) {
      return renderPanelLogin()
    }

    if (pathname.startsWith('/panel/cekilis') && !hasAdminPanelAccess()) {
      return renderPanelLogin()
    }

    if (pathname === '/panel/cekilis') {
      return <CekilisLandingPage onNavigate={(path) => navigateToPath(path, setPathname)} />
    }

    if (pathname === '/panel/cekilis/haftalik-uygulama') {
      return <HaftalikUygulamaPage />
    }

    if (pathname === '/panel/cekilis/fuar') {
      return <GiveawayPage />
    }

    if (pathname.startsWith('/panel/')) {
      return renderPanelLogin()
    }

    return <LandingPage />
  }

  return (
    <div className="app-shell">
      {showPublicChrome ? (
        <Navbar
          brandHref={isCekilisRoute ? '/' : '#ana-sayfa'}
          headerId={isCekilisRoute ? undefined : 'ana-sayfa'}
        />
      ) : null}

      <main>{renderCurrentPage()}</main>

      {showPublicChrome ? <Footer /> : null}
      {showPublicChrome && !isCekilisRoute ? <ScrollToTopButton /> : null}
    </div>
  )
}

export default App
