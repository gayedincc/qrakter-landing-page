function Hero() {
  return (
    <section className="hero-section section">
      <div className="container hero-grid">
        <div className="hero-content">
          <p className="eyebrow">Akıllı Kaza Yardım Uygulaması</p>
          <h1>Kaza anında gerekli tüm bilgiler elinin altında, süreç her koşulda kontrolünde.</h1>
          <p className="hero-description">
            QRAKTER; profil, sağlık, araç, evrak ve tutanak verilerini cihazda hazır tutar,
            bağlantı geldiğinde sistemle senkronize eder ve kaza anında seni adım adım yönlendirir.
          </p>
          <div className="hero-stats" aria-label="QRAKTER modül özeti">
            <div className="hero-stat-card">
              <strong>Profil</strong>
              <span>Cihazda kayıtlı ve senkrona hazır</span>
            </div>
            <div className="hero-stat-card">
              <strong>Evraklar</strong>
              <span>Offline ekle, bağlantıda yükle</span>
            </div>
            <div className="hero-stat-card">
              <strong>Tutanaklar</strong>
              <span>İnternetsiz doldur, sonra gönder</span>
            </div>
          </div>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#iletisim">
              Formu Doldur
            </a>
            <a className="btn btn-secondary" href="#ozellikler">
              Özellikleri İncele
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="phone-mockup">
            <div className="phone-header">
              <span className="signal"></span>
              <span>QRAKTER Hazır Durum</span>
            </div>
            <ol>
              <li>Profil, araç ve sağlık bilgileri cihazda hazır</li>
              <li>Belgeler ve tutanaklar internetsiz kaydedilir</li>
              <li>İnternet geldiğinde tüm kayıtlar senkronize olur</li>
            </ol>
            <div className="status-pill">Durum: Offline destekli ve senkronize</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
