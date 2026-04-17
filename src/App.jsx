import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import ContactForm from './components/ContactForm'
import MotoFestSection from './components/MotoFestSection'
import GiveawayModal from './components/GiveawayModal'
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
      <MotoFestSection />
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

  // Global scroll-reveal for .reveal elements
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

    const els = document.querySelectorAll('.reveal')
    els.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [pathname])

  const isGiveawayPage = pathname === '/cekilis'
  const [showModal, setShowModal] = useState(() => !isGiveawayPage)

  const handleCloseModal = () => setShowModal(false)

  return (
    <div className="app-shell">
      {showModal && !isGiveawayPage && <GiveawayModal onClose={handleCloseModal} />}
      <Navbar brandHref={isGiveawayPage ? '/' : '#ana-sayfa'} headerId={isGiveawayPage ? undefined : 'ana-sayfa'} />
      <main>
        {isGiveawayPage ? <GiveawayPage /> : <LandingPage />}
      </main>
      <Footer />
      {!isGiveawayPage ? <ScrollToTopButton /> : null}
    </div>
  )
}

export default App
