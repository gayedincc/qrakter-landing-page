const features = [
  {
    title: 'Offline Profil ve Sağlık Kartı',
    description: 'Kimlik, ehliyet, adres, kan grubu, alerji ve kronik hastalık bilgileri cihazda hazır tutulur.',
  },
  {
    title: 'Acil Durum Kişileri',
    description: 'Yakınların telefon, e-posta ve ilişki bilgileri offline korunur, bağlantıda sisteme aktarılır.',
  },
  {
    title: 'Araç ve Sigorta Bilgileri',
    description: 'Plaka, marka, model, şasi numarası ve poliçe detayları internet olmadan da kaydedilebilir.',
  },
  {
    title: 'Belgeler ve Evraklar',
    description: 'Poliçe fotoğrafı, PDF ve diğer dosyalar telefonda saklanır; internet geldiğinde otomatik yüklenir.',
  },
  {
    title: 'Kaza Bildirimi Akışı',
    description: 'Tutanak adımları internetsiz tamamlanır, kayıt cihazda tutulur ve uygun anda sisteme gönderilir.',
  },
  {
    title: 'Benim QR Kodum',
    description: 'Oluşturulan QR kod cihazda saklanır; sürücü, polis veya sağlık personeli için kontrollü bilgi paylaşımı sağlar.',
  },
]

function Features() {
  return (
    <section id="ozellikler" className="section features-section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Özellikler</p>
          <h2>QRAKTER, kazadan önce hazırlığı; kaza anında ise veri ve yönlendirmeyi tek yerde toplar.</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <article key={feature.title} className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
