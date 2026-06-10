import zayfixMaskotImage from '../assets/zayfix-maskot-6.webp'

function HaftalikUygulamaCekilisPage() {
  return (
    <section className="section giveaway-page haftalik-uygulama-page">
      <div className="container lock-layout">
        <div className="lock-copy">
          <p className="eyebrow">QRakter Çekiliş</p>

          <h1>Uygulama İçi Haftalık Çekiliş</h1>

          <p className="section-copy">
            QRakter kullanıcılarının biletleriyle katılabileceği haftalık ödül,
            çark ve kazananlar deneyimi çok yakında burada olacak.
          </p>

          <div className="haftalik-status-card">
            <span className="haftalik-status-badge">Yakında</span>

            <h2>Haftalık çekiliş deneyimi hazırlanıyor.</h2>

            <p>
              Bu alanda haftanın ödülü, günlük çark hakkı, biletle katılım ve
              kazananlar listesi tek bir akış içinde sunulacak.
            </p>

            <div className="haftalik-feature-list">
              <span>Haftanın ödülü</span>
              <span>Biletle katılım</span>
              <span>Günlük çark hakkı</span>
              <span>Kazananlar listesi</span>
            </div>
          </div>
        </div>

        <div className="lock-panel haftalik-uygulama-panel">
          <div className="haftalik-cekilis-visual" aria-hidden="true">
            <img src={zayfixMaskotImage} alt="" />

            <div className="haftalik-visual-card">
              <span>Yakında</span>
              <strong>Uygulama içi çekiliş</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HaftalikUygulamaCekilisPage