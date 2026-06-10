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
import HaftalikUygulamaCekilisPage from './pages/HaftalikUygulamaCekilisPage'
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

  const isCekilisRoute = pathname === '/cekilis' || pathname.startsWith('/cekilis/')

  const goToCekilisLanding = () => {
    navigateToPath('/cekilis', setPathname)
  }

  const renderCurrentPage = () => {
    if (pathname === '/cekilis') {
      return <CekilisLandingPage onNavigate={(path) => navigateToPath(path, setPathname)} />
    }

    if (pathname === '/cekilis/fuar-festival') {
      return (
        <>
          <CekilisBackButton onClick={goToCekilisLanding} />
          <GiveawayPage />
        </>
      )
    }

    if (pathname === '/cekilis/haftalikuygulama') {
      return (
        <>
          <CekilisBackButton onClick={goToCekilisLanding} />
          <HaftalikUygulamaCekilisPage />
        </>
      )
    }

    return <LandingPage />
  }

  return (
    <div className="app-shell">
      <Navbar
        brandHref={isCekilisRoute ? '/' : '#ana-sayfa'}
        headerId={isCekilisRoute ? undefined : 'ana-sayfa'}
      />

      <main>{renderCurrentPage()}</main>

      <Footer />
      {!isCekilisRoute ? <ScrollToTopButton /> : null}
    </div>
  )
}

export default App