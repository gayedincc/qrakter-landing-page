const benefits = [
  {
    before: 'İnternet Beklemek',
    after: 'Offline Hazırlık',
    text: 'Profil, araç, evrak ve tutanak bilgileri cihazda hazır kalır; bağlantı yokken bile sürece devam edersin.',
  },
  {
    before: 'Dağınık Kayıtlar',
    after: 'Tek Merkezli Yönetim',
    text: 'Belgeler, sağlık verileri, acil durum kişileri ve sigorta bilgileri aynı yapı içinde toplanır.',
  },
  {
    before: 'Herkese Aynı Veri',
    after: 'Rol Bazlı QR Erişimi',
    text: 'Sürücü, polis ve sağlık personeli yalnızca ihtiyaç duyduğu bilgiyi görür; paylaşım daha güvenli ilerler.',
  },
]


function Benefits() {
  return (
    <section className="section benefits-section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Neden QRAKTER</p>
          <h2>Kaza anında veri hazırlığını, yönlendirmeyi ve güvenli paylaşımı aynı akışta birleştirir.</h2>
        </div>

        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <article key={benefit.after} className="benefit-card">
              <p className="benefit-label">Yerine</p>
              <h3>{benefit.before} yerine {benefit.after}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
