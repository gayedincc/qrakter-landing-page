import logo from '../assets/zayfix-logo-2.webp'

function Navbar() {
  return (
    <header className="navbar" id="ana-sayfa">
      <div className="container navbar-inner">
        <a className="brand" href="#ana-sayfa" aria-label="QRAKTER ana sayfa">
          <img className="brand-logo" src={logo} alt="" aria-hidden="true" />
          <span className="brand-text">QRAKTER</span>
        </a>
      </div>
    </header>
  )
}

export default Navbar
