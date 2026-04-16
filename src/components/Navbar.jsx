import logo from '../assets/zayfix-logo-2.webp'

function Navbar({ brandHref = '#ana-sayfa', headerId = 'ana-sayfa' }) {
  return (
    <header className="navbar" id={headerId}>
      <div className="container navbar-inner">
        <a className="brand" href={brandHref} aria-label="QRAKTER ana sayfa">
          <img className="brand-logo" src={logo} alt="" aria-hidden="true" />
          <span className="brand-text">QRAKTER</span>
        </a>
      </div>
    </header>
  )
}

export default Navbar
