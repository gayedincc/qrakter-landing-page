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
          <p>Telefon: 0 (216) 906 20 66</p>
          <p>Adresimiz: Soğanlık Yeni Mah. Aliağa Sok. No:8 K:24 D:159 Bumerang Towers Kartal/İstanbul</p>
          <p>Resmi E-posta: bilgi@zayfix.com</p>
        </div>
      </div>
      <p className="copyright">© {new Date().getFullYear()} QRAKTER. Tüm hakları saklıdır.</p>
    </footer>
  )
}

export default Footer
