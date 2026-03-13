import motorZayfixImage from '../assets/motor-zayfix.png'

function Hero() {
  return (
    <section className="hero-section section">
      <div className="container hero-grid">
        <div className="hero-content">
          <p className="eyebrow">Akıllı Kaza Yardım Uygulaması</p>
          <h1>Kaza anında gerekli bilgi, yönlendirme ve kayıt akışı tek ekranda hazır olsun.</h1>
          <p className="hero-description">
            QRAKTER; profil, sağlık, araç ve evrak verilerini düzenli tutar, kritik ekranları hızlı erişime
            açar ve ihtiyaç anında süreci daha sakin yönetmene yardımcı olur.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#iletisim">
              Formu Doldur
            </a>
            <a className="btn btn-secondary" href="#ozellikler">
              Özellikleri İncele
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-frame">
            <img className="hero-visual-image" src={motorZayfixImage} alt="Zayfix motor sürücüsü görseli" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
