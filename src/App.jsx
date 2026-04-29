import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import MersinMotoFestSection from './components/MersinMotoFestSection'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
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
      <MersinMotoFestSection />
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

    // Yeni render edilen elemanları da yakala
    const mutationObserver = new MutationObserver(observe)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [pathname])

  const isGiveawayPage = pathname === '/cekilis'

  return (
    <div className="app-shell">
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
