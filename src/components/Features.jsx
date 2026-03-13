import anaEkranScreenshot from '../assets/anaekran.jpg'
import kazaTutanagiScreenshot from '../assets/kaza-tutanagi-sayfasi.jpg'
import profilScreenshot from '../assets/profil-sayfasi.jpg'

const introHighlights = [
  {
    title: 'Offline profil ve sağlık kartı',
    description: 'Kimlik, ehliyet, adres, kan grubu, alerji ve kronik hastalık bilgileri cihazda hazır tutulur.',
  },
  {
    title: 'Araç ve sigorta bilgileri',
    description: 'Plaka, marka, model, şasi numarası ve poliçe detayları tek akışta düzenli biçimde saklanır.',
  },
  {
    title: 'Kaza anı yönlendirmesi',
    description: 'Kritik adımlar karmaşayı azaltan sade ekranlarla ilerler; belge, bilgi ve tutanak akışı aynı yerde toplanır.',
  },
]

const features = [
  {
    id: '01',
    kicker: 'Ana ekran görünümü',
    title: 'QR Acil Durum Kartı ile doğru ekrana hızlı geçiş',
    description:
      'Ana ekrandaki QR Acil Durum Kartı okutulduğunda, paylaşım senaryosuna göre açılması gereken bilgi bölümü gösterilir. Acil Kişilerim ve Araçlarım kartları ise kullanıcıyı doğrudan profil ekranındaki ilgili alt bölümlere yönlendirir.',
    points: [
      'QR okutma sonrası senaryoya uygun bilgi alanı açılır',
      'Acil Kişilerim tıklaması profilde Acil Durum Kişileri bölümüne götürür',
      'Araçlarım tıklaması profilde Araçlarım bölümünü açar',
      'SOS ve 112 butonları tek dokunuşta acil aksiyon sağlar',
    ],
    image: anaEkranScreenshot,
    imageAlt: 'QRAKTER ana ekranında acil durum ve hızlı erişim kartları',
    imageClassName: 'is-dashboard',
  },
  {
    id: '02',
    kicker: 'Kaza tutanağı akışı',
    title: 'Kaza tutanağı süreci sakin ve net bir sırada ilerler',
    description:
      'Kaza anında hangi adımla başlanacağı belirsiz kalmasın diye sayfa üç net seçeneğe ayrılır: Yeni Tutanak Başlat, Tutanağa Katıl ve Tutanaklarım. Böylece kullanıcı, bulunduğu senaryoya göre doğru akışa saniyeler içinde geçer.',
    points: [
      'Yeni Tutanak Başlat: Kişi tutanağı doğrudan başlatır ve adımları sırayla doldurur',
      'Tutanağa Katıl: Karşı tarafın başlattığı kayda QR ile hızlıca dahil eder',
      'Tutanaklarım: Geçmiş başvuruları görüntüleyip devam etmeyi kolaylaştırır',
      'Sayfa dili panik anında kısa ve yönlendirici kalacak şekilde kurgulanır',
    ],
    image: kazaTutanagiScreenshot,
    imageAlt: 'QRAKTER kaza tutanağı sayfasında yeni tutanak ve katılım seçenekleri',
    imageClassName: 'is-documents',
  },
  {
    id: '03',
    kicker: 'Profil ve doğruluk durumu',
    title: 'Profilde görüntüle, düzenle ve kaydet akışı birlikte sunulur',
    description:
      'Profil ekranında kullanıcı mevcut bilgilerini sadece görüntüleyebilir; ihtiyaç duyduğu başlığa girip ilgili alanı düzenleyip kaydedebilir. Kimlik, sağlık, acil durum kişileri ve araç bölümleri ayrı yönetilir; bildirim tercihleri de aynı sayfadan ayarlanır.',
    points: [
      'Tamamlanma oranı ve ilerleme çubuğu eksik alanları görünür kılar',
      'Her bölümde görüntüleme ve gerektiğinde düzenleme-kaydetme seçeneği bulunur',
      'Kimlik, sağlık, acil kişi ve araç bilgileri bağımsız kartlarda yönetilir',
      'Bildirim tercihleri tek noktadan açılıp kişiselleştirilir',
    ],
    image: profilScreenshot,
    imageAlt: 'QRAKTER profil sayfasında tamamlanma durumu ve bilgi kartları',
    imageClassName: 'is-flow',
  },
]

const detailFeatures = [
  {
    id: '01',
    title: 'Acil durum kişileri',
    description: 'Telefon, e-posta ve yakınlık bilgileriyle ihtiyaç anında hızlı erişime hazır tutulur.',
  },
  {
    id: '02',
    title: 'Belge ve tutanak düzeni',
    description: 'Evraklar ve tutanak akışı aynı yapı içinde toplanarak dağınıklık azaltılır.',
  },
  {
    id: '03',
    title: 'Adım adım kaza akışı',
    description: 'Kaza tespit süreci daha sakin ve anlaşılır ekranlarla ilerleyecek şekilde kurgulanır.',
  },
  {
    id: '04',
    title: 'QR ile kontrollü paylaşım',
    description: 'Doğru kişiye doğru bilgi gösterilmesi hedeflenir; paylaşım senaryosu daha güvenli ilerler.',
  },
]

function Features() {
  return (
    <section id="ozellikler" className="section features-section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Özellikler</p>
          <h2>QRAKTER, kaza öncesi hazırlığı ve kaza anı yönlendirmesini tek akışta bir araya getirir.</h2>
          <p className="section-copy">
            Profil, sağlık, araç, sigorta, evrak ve QR paylaşım mantığı; kaza anında hızlı erişim sağlayacak şekilde
            aynı ürün deneyiminde buluşur.
          </p>
        </div>

        <div className="feature-intro-grid">
          {introHighlights.map((item) => (
            <article key={item.title} className="feature-intro-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>

        <div className="feature-showcase">
          {features.map((feature, index) => (
            <article
              key={feature.id}
              className={`feature-showcase-card ${index % 2 === 1 ? 'is-reversed' : ''}`}
            >
              <div className="feature-media">
                <span className="feature-id">{feature.id}</span>
                <img className={`feature-media-image ${feature.imageClassName}`} src={feature.image} alt={feature.imageAlt} />
              </div>

              <div className="feature-copy-block">
                <p className="feature-kicker">{feature.kicker}</p>
                <h3>{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>

                <ul className="feature-points">
                  {feature.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="feature-detail-strip">
          <div className="feature-detail-copy">
            <p className="eyebrow">Neden QRAKTER?</p>
            <h3>Kaza anında dağınık bilgi yerine tek merkezli ve anlaşılır bir akış sunar.</h3>
            <p>
              QRAKTER; kullanıcının ihtiyaç duyduğu bilgiye daha kısa sürede ulaşmasını hedefler. Sağlık kartı, araç ve
              poliçe bilgileri, evrak ekranları ve QR ile kontrollü paylaşım senaryosu aynı yapı içinde düşünülür.
            </p>

            <div className="feature-detail-tags" aria-label="Öne çıkan modüller">
              <span>Profil</span>
              <span>Evrak</span>
              <span>Tutanak</span>
              <span>QR Paylaşım</span>
            </div>
          </div>

          <div className="feature-mini-grid">
            {detailFeatures.map((item) => (
              <article key={item.id} className="feature-mini-card">
                <span className="feature-mini-id">{item.id}</span>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
