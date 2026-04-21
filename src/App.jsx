import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { AndroidIcon, AppleIcon } from './components/StoreIcons'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
import MotoFestSection from './components/MotoFestSection'
import hediyeGorseli from './assets/zayfix-hediye.jpg'
import './styles/landing.css'

const ANDROID_DOWNLOAD_URL =
  'https://play.google.com/store/apps/details?id=com.everion.qrakter.app&pcampaignid=web_share'
const IOS_PREREGISTER_URL = 'https://app.zayfix.com'
const ZAYFIX_INSTAGRAM_URL =
  'https://www.instagram.com/zayfix.tr?igsh=MWxoeDh6ZGx3dHQ4cA=='

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
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false)

  useEffect(() => {
    setIsPromoModalOpen(true)
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

    const els = document.querySelectorAll('.reveal')
    els.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isPromoModalOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsPromoModalOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isPromoModalOpen])

  return (
    <div className="app-shell">
      <Navbar brandHref="#ana-sayfa" headerId="ana-sayfa" />
      <main>
        <LandingPage />
      </main>

      {isPromoModalOpen ? (
        <div
          className="event-modal-backdrop"
          role="presentation"
          onClick={() => setIsPromoModalOpen(false)}
        >
          <div
            className="event-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="event-modal-close"
              type="button"
              onClick={() => setIsPromoModalOpen(false)}
              aria-label="Modalı kapat"
            >
              Kapat
            </button>

            <div className="event-modal-layout">
              <div className="event-modal-content">
                <p className="event-modal-pill">Motobike İstanbul 2026 • Özel Hediye Fırsatı</p>
                <h2 id="event-modal-title">Katıl, şartları tamamla, hediyeni kazan!</h2>

                <p className="event-modal-description">
                  Uygulamayı indirip kaydını tamamla, ardından
                  {' '}
                  <a
                    className="campaign-inline-link"
                    href={ZAYFIX_INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Zayfix Instagram hesabını
                  </a>
                  {' '}
                  takip edip son gönderiyi beğen. Katılım şartlarını sağlayan kullanıcılar arasından 10 kişi hediye kazanacaktır.
                </p>

                <article className="event-modal-prize-card" aria-label="Hediye detayı">
                  <img src={hediyeGorseli} alt="KNMaster KN1600CPRO hediye ürünü" />
                  <div>
                    <strong>KNMaster KN1600CPRO</strong>
                    <p>2K kameralı motosiklet interkom seti - 10 kişiye hediye!</p>
                  </div>
                </article>

                <ul className="event-modal-note-list" aria-label="Hediye koşulları">
                  <li>Uygulamayı indirip kayıt olan ve Instagram katılım şartlarını sağlayan kullanıcılar arasından 10 kişi seçilecektir.</li>
                  <li>Katılım için Zayfix Instagram hesabını takip etmek ve son gönderiyi beğenmek gereklidir.</li>
                  <li>Hediye, katılım şartlarını sağlayan kullanıcılar arasından belirlenecektir.</li>
                  <li>22 - 25 Nisan 2026 • İstanbul Fuar Merkezi • 10:00 - 19:00</li>
                </ul>

                <div className="event-modal-actions">
                  <a
                    className="btn btn-primary"
                    href={ANDROID_DOWNLOAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AndroidIcon className="motofest-platform-icon" />
                    Android için indir
                  </a>

                  <a
                    className="btn btn-secondary"
                    href={IOS_PREREGISTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AppleIcon className="motofest-platform-icon" />
                    iOS ön kayıt / Web&apos;den erişim
                  </a>

                  <a
                    className="btn btn-instagram"
                    href={ZAYFIX_INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Zayfix Instagram Sayfası"
                  >
                    Zayfix Instagram
                  </a>
                </div>
              </div>

              <aside className="event-modal-reel" aria-label="Instagram reels videosu">
                <p className="event-modal-reel-label">INSTAGRAM</p>
                <iframe
                  src="https://www.instagram.com/reel/DWde-neDBrc/embed"
                  title="Motobike İstanbul Instagram Reels"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  loading="lazy"
                />
              </aside>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
      <ScrollToTopButton />
    </div>
  )
}

export default App
