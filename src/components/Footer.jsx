function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>QRAKTER</h3>
          <p>
            Trafik kazası anında yönlendirme, bilgi toplama ve dijital süreç yönetimini kolaylaştıran
            akıllı yardım uygulaması.
          </p>
        </div>
        <div>
          <h4>İletişim</h4>
          <p>E-posta: iletisim@qrakter.com</p>
          <p>Telefon: +90 5XX XXX XX XX</p>
        </div>
      </div>
      <p className="copyright">© {new Date().getFullYear()} QRAKTER. Tüm hakları saklıdır.</p>
    </footer>
  )
}

export default Footer
