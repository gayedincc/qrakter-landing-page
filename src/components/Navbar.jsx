import { useState } from 'react'

const navItems = [
  { label: 'Ana Sayfa', href: '#ana-sayfa' },
  { label: 'Özellikler', href: '#ozellikler' },
  { label: 'Nasıl Çalışır', href: '#nasil-calisir' },
  { label: 'İletişim', href: '#iletisim' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = () => {
    setIsOpen(false)
  }

  return (
    <header className="navbar" id="ana-sayfa">
      <div className="container navbar-inner">
        <a className="brand" href="#ana-sayfa" aria-label="QRAKTER ana sayfa">
          <span className="brand-mark" aria-hidden="true">
            QR
          </span>
          <span className="brand-text">QRAKTER</span>
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-label="Menüyü aç veya kapat"
          aria-expanded={isOpen}
          aria-controls="main-menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${isOpen ? 'is-open' : ''}`} id="main-menu" aria-label="Ana menü">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={handleNavClick}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
