const steps = [
  {
    title: 'Verilerini Önceden Hazırla',
    description: 'Profil, sağlık, araç, sigorta ve acil durum bilgilerini bir kez kaydet; uygulama cihazında saklasın.',
  },
  {
    title: 'Kaza Anında Offline Devam Et',
    description: 'Bağlantı olmasa bile belgeleri ekle, tutanak akışını doldur ve gerekli bilgileri ekrandan takip et.',
  },
  {
    title: 'Senkronize Et ve Paylaş',
    description: 'İnternet geldiğinde kayıtlar sisteme aktarılsın, QR kod ile doğru kişiye doğru bilgiler güvenle gösterilsin.',
  },
]

function HowItWorks() {
  return (
    <section id="nasil-calisir" className="section how-section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Nasıl Çalışır</p>
          <h2>Üç adımda offline hazır, online senkron bir kaza deneyimi.</h2>
        </div>

        <div className="timeline">
          {steps.map((step, index) => (
            <article key={step.title} className="timeline-item">
              <span className="timeline-index">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
