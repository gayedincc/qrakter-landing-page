import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
import FloatingStoreButtons from './components/FloatingStoreButtons'
import GiveawayPage from './pages/GiveawayPage'
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

  const isGiveawayPage = pathname === '/cekilis'

  return (
    <div className="app-shell">
      <Navbar brandHref={isGiveawayPage ? '/' : '#ana-sayfa'} headerId={isGiveawayPage ? undefined : 'ana-sayfa'} />
      <main>
        {isGiveawayPage ? <GiveawayPage /> : <LandingPage />}
      </main>
      <Footer />
      {!isGiveawayPage ? <FloatingStoreButtons /> : null}
      {!isGiveawayPage ? <ScrollToTopButton /> : null}
    </div>
  )
}

export default App
