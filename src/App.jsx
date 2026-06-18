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
import HaftalikUygulamaCampaignDetailPage from './pages/cekilis/haftalikuygulama/HaftalikUygulamaCampaignDetailPage'
import HaftalikUygulamaCampaignEditPage from './pages/cekilis/haftalikuygulama/HaftalikUygulamaCampaignEditPage'
import HaftalikUygulamaCampaignsPage from './pages/cekilis/haftalikuygulama/HaftalikUygulamaCampaignsPage'
import HaftalikUygulamaDashboardPage from './pages/cekilis/haftalikuygulama/HaftalikUygulamaDashboardPage'
import HaftalikUygulamaSettingsPage from './pages/cekilis/haftalikuygulama/HaftalikUygulamaSettingsPage'
import HaftalikUygulamaWinnersPage from './pages/cekilis/haftalikuygulama/HaftalikUygulamaWinnersPage'
import HaftalikUygulamaPage from './pages/cekilis/haftalikuygulama/HaftalikUygulamaPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import ClubReviewApplicationDetailPage from './pages/clubs/review/ClubReviewApplicationDetailPage'
import ClubReviewApplicationsPage from './pages/clubs/review/ClubReviewApplicationsPage'
import ClubReviewLoginPage from './pages/clubs/review/ClubReviewLoginPage'
import { getAdminAccessToken, getStoredAdminUser, isAdminUser } from './utils/adminAuth'
import { hasClubReviewAccess } from './services/clubReviewService'
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

function isClubReviewRoute(pathname) {
  return pathname === '/kulup-onay/giris' || pathname.startsWith('/kulup-onay/')
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
      return
    }

    if (pathname.startsWith('/kulup-onay/basvurular') && !hasClubReviewAccess()) {
      replaceWithPath('/kulup-onay/giris', setPathname)
    }
  }, [pathname])

  const isCekilisRoute = pathname === '/cekilis' || pathname.startsWith('/cekilis/')
  const isPanelRoute = pathname === '/panel/giris' || pathname.startsWith('/panel/')
  const showPublicChrome = !isPanelRoute && !isPublicCekilisRoute(pathname) && !isClubReviewRoute(pathname)

  const renderCurrentPage = () => {
    const campaignEditMatch = pathname.match(/^\/panel\/cekilis\/haftalik-uygulama\/cekilisler\/([^/]+)\/duzenle$/)
    const campaignDetailMatch = pathname.match(/^\/panel\/cekilis\/haftalik-uygulama\/cekilisler\/([^/]+)$/)
    const clubReviewDetailMatch = pathname.match(/^\/kulup-onay\/basvurular\/([^/]+)$/)

    const renderPanelLogin = () => (
      <AdminLoginPage onLoginSuccess={() => navigateToPath('/panel/cekilis', setPathname)} />
    )
    const renderClubReviewLogin = () => (
      <ClubReviewLoginPage onLoginSuccess={() => navigateToPath('/kulup-onay/basvurular', setPathname)} />
    )

    if (pathname === '/panel/giris') {
      return renderPanelLogin()
    }

    if (pathname === '/kulup-onay/giris') {
      return renderClubReviewLogin()
    }

    if (isPublicCekilisRoute(pathname)) {
      return renderPanelLogin()
    }

    if (pathname.startsWith('/panel/cekilis') && !hasAdminPanelAccess()) {
      return renderPanelLogin()
    }

    if (pathname.startsWith('/kulup-onay/basvurular') && !hasClubReviewAccess()) {
      return renderClubReviewLogin()
    }

    if (pathname === '/kulup-onay/basvurular') {
      return <ClubReviewApplicationsPage onNavigate={(path) => navigateToPath(path, setPathname)} />
    }

    if (clubReviewDetailMatch) {
      return (
        <ClubReviewApplicationDetailPage
          applicationId={decodeURIComponent(clubReviewDetailMatch[1])}
          onNavigate={(path) => navigateToPath(path, setPathname)}
        />
      )
    }

    if (pathname === '/panel/cekilis') {
      return <CekilisLandingPage onNavigate={(path) => navigateToPath(path, setPathname)} />
    }

    if (pathname === '/panel/cekilis/haftalik-uygulama') {
      return <HaftalikUygulamaDashboardPage onNavigate={(path) => navigateToPath(path, setPathname)} />
    }

    if (pathname === '/panel/cekilis/haftalik-uygulama/sonuclandir') {
      return <HaftalikUygulamaPage onNavigate={(path) => navigateToPath(path, setPathname)} />
    }

    if (pathname === '/panel/cekilis/haftalik-uygulama/ayarlar') {
      return <HaftalikUygulamaSettingsPage onNavigate={(path) => navigateToPath(path, setPathname)} />
    }

    if (campaignEditMatch) {
      return (
        <HaftalikUygulamaCampaignEditPage
          campaignId={decodeURIComponent(campaignEditMatch[1])}
          onNavigate={(path) => navigateToPath(path, setPathname)}
        />
      )
    }

    if (campaignDetailMatch) {
      return (
        <HaftalikUygulamaCampaignDetailPage
          campaignId={decodeURIComponent(campaignDetailMatch[1])}
          onNavigate={(path) => navigateToPath(path, setPathname)}
        />
      )
    }

    if (pathname === '/panel/cekilis/haftalik-uygulama/cekilisler') {
      return <HaftalikUygulamaCampaignsPage onNavigate={(path) => navigateToPath(path, setPathname)} />
    }

    if (
      pathname === '/panel/cekilis/haftalik-uygulama/kazananlar' ||
      pathname === '/panel/cekilis/haftalik-uygulama/son-kazananlar'
    ) {
      return <HaftalikUygulamaWinnersPage onNavigate={(path) => navigateToPath(path, setPathname)} />
    }

    if (pathname === '/panel/cekilis/fuar') {
      return <GiveawayPage />
    }

    if (pathname.startsWith('/panel/')) {
      return renderPanelLogin()
    }

    if (pathname.startsWith('/kulup-onay/')) {
      return renderClubReviewLogin()
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
