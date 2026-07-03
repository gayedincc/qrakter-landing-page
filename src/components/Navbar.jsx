import { useEffect, useState } from 'react'
import logo from '../assets/zayfix-logo-2.webp'

function Navbar({ brandHref = '#ana-sayfa', headerId = 'ana-sayfa' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', closeOnResize)
    return () => window.removeEventListener('resize', closeOnResize)
  }, [])

  const links = [
    { label: 'Özellikler', href: '#ozellikler' },
    { label: 'Kaza Tutanağı', href: '#kaza-tutanagi' },
    { label: 'Kulüpler', href: '#kulupler' },
    { label: 'Topluluk', href: '#topluluk' },
    { label: 'Ödüller', href: '#oduller' },
    { label: 'İletişim', href: '#iletisim' },
  ]

  return (
    <header className="navbar" id={headerId}>
      <div className="container navbar-inner">
        <a className="brand" href={brandHref} aria-label="QRAKTER ana sayfa">
          <img className="brand-logo" src={logo} alt="" aria-hidden="true" />
          <span className="brand-text">QRAKTER</span>
        </a>

        <button
          type="button"
          className={`nav-toggle ${isMenuOpen ? 'is-open' : ''}`}
          aria-expanded={isMenuOpen}
          aria-controls="landing-navigation"
          aria-label="Navigasyon menüsünü aç veya kapat"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links-shell ${isMenuOpen ? 'is-open' : ''}`} id="landing-navigation" aria-label="Ana navigasyon">
          <div className="nav-links">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>

          {/* <a
            href="/docs/zayfix-qrakter-kullanim-kilavuzu.pdf"
            download
            className="btn btn-primary nav-cta"
            onClick={() => setIsMenuOpen(false)}
          >
            Kullanım Kılavuzunu İndir
          </a> */}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
