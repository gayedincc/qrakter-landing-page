const roles = [
  {
    title: 'Sürücü / Vatandaş',
    description:
      'Ad-soyad, araç plakası ve acil durum kişileri gibi özet bilgiler kontrollü biçimde gösterilir.',
    note: 'Tıbbi bilgiler yalnızca kullanıcı paylaşmayı seçtiyse görünür.',
  },
  {
    title: 'Polis / Trafik Görevlisi',
    description:
      'Kimlik, araç ve sigorta bilgileri; kaza tespiti için gereken seviyede erişime açılır.',
    note: 'Ekranda sadece kaza tespiti amacıyla kullanılmalıdır uyarısı yer alır.',
  },
  {
    title: 'Sağlık Personeli',
    description:
      'Kan grubu, alerjiler, kronik hastalıklar, ilaçlar ve acil durum telefonları öncelikli sunulur.',
    note: 'Veri görünümü tıbbi müdahale senaryosuna göre sadeleştirilir.',
  },
]

function QRCodeAccess() {
  return (
    <section className="section qr-section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">QR Kod Akışı</p>
          <h2>Benim QR Kodum okutulduğunda bilgi, role göre güvenli şekilde açılır.</h2>
          <p className="section-copy">
            QRAKTER, aynı QR kodu herkese aynı veriyi gösterecek şekilde kurgulamaz. Görünen bilgi,
            senaryoya ve kullanıcı tipine göre filtrelenir.
          </p>
        </div>

        <div className="qr-role-grid">
          {roles.map((role) => (
            <article key={role.title} className="qr-role-card">
              <h3>{role.title}</h3>
              <p>{role.description}</p>
              <span>{role.note}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default QRCodeAccess
