import motofest1Image from '../assets/motofest1.jpeg'
import motofest2Image from '../assets/motofest2.jpeg'
import motofest3Image from '../assets/motofest3.jpeg'
import { AndroidIcon, AppleIcon } from './StoreIcons'

const ANDROID_DOWNLOAD_URL = 'https://play.google.com/store/apps/details?id=com.everion.qrakter.app&pcampaignid=web_share'
const IOS_PREREGISTER_URL = 'https://app.zayfix.com'
const ZAYFIX_INSTAGRAM_URL = 'https://www.instagram.com/zayfix.tr/'
const MOTOFEST_INSTAGRAM_URL = 'https://www.instagram.com/adanamotofest/'

const festivalBadges = [
  { label: '17-19 Nisan 2026' },
  { label: 'Sarıçam Yörük Ormanı' },
  { label: 'Festival etkinlikleri' },
  { label: '@adanamotofest', href: MOTOFEST_INSTAGRAM_URL },
]

const festivalDetails = [
  {
    label: 'Program',
    text: 'DJ parti, konser, eğitim, eğlence ve yarışmalarla üç gün boyunca dolu bir festival akışı sizi bekliyor.',
  },
  {
    label: 'Zayfix Qrakter',
    text: 'Festival alanındaki bilgilere göz atabilir, Android uygulamasını indirebilir veya iOS ön kaydı oluşturarak Zayfix Qrakter deneyimine katılabilirsiniz.',
  },
  {
    label: 'Instagram',
    text: (
      <>
        Güncel paylaşımlar ve festival akışı için{' '}
        <a className="festival-inline-link" href={MOTOFEST_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          @adanamotofest
        </a>{' '}
        hesabını takip edebilirsiniz.
      </>
    ),
  },
]

const festivalGallery = [
  {
    image: motofest1Image,
    alt: 'Adana Motofest 2026 festival afişi ve etkinlik atmosferi',
    label: 'Festival atmosferi',
  },
  {
    image: motofest2Image,
    alt: 'Adana Motofest 2026 kapsamında katılımcı kulüpler ve festival konsepti',
    label: 'Kulüpler ve konsept',
  },
  {
    image: motofest3Image,
    alt: 'Adana Motofest 2026 sponsor ve katılımcı tanıtım materyalleri',
    label: 'Sponsor ve katılımcılar',
  },
]

const steps = [
  {
    title: 'Etkinlik bilgilerini inceleyin',
    description: 'Festival programı, atmosferi ve öne çıkan alanlara göz atın.',
  },
  {
    title: 'Zayfix Qrakter’i keşfedin',
    description: 'Zayfix Qrakter’in sunduğu deneyimi ve uygulama akışını inceleyin.',
  },
  {
    title: 'Size uygun platformdan devam edin',
    description: 'Android için indirin veya iOS ön kaydı oluşturarak ilk adımı atın.',
  },
]

function HowItWorks() {
  const [featuredImage, ...galleryStack] = festivalGallery

  return (
    <section id="cekilise-katil" className="section how-section festival-section">
      <div className="container">
        <div className="festival-layout-grid">
          <div className="festival-layout-column festival-layout-column-left">
            <article className="festival-action-card festival-access-card">
              <p className="eyebrow">Adana Motofest 2026</p>
              <h3>Zayfix Qrakter’e kolayca ulaşın</h3>
              <p className="festival-action-copy">
                Android uygulamasını hemen indirebilir, iOS için ön kayıt oluşturarak Zayfix Qrakter’e ilk adımı atabilirsiniz.
              </p>
              <p className="festival-action-note">
                Zayfix Qrakter’i daha yakından görmek için Instagram&apos;da{' '}
                <a
                  className="festival-inline-link"
                  href={ZAYFIX_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @zayfix.tr
                </a>{' '}
                hesabına da göz atabilirsiniz.
              </p>

              <div className="feature-mini-grid festival-download-grid" aria-label="Zayfix Qrakter erişim seçenekleri">
                <article className="feature-mini-card festival-download-card">
                  <div className="festival-card-head">
                    <span className="festival-platform-label">
                      <AndroidIcon className="festival-platform-icon" />
                      <span>Android</span>
                    </span>
                  </div>
                  <h4>Android için indir</h4>
                  <p>Zayfix Qrakter’i Android uygulamasıyla keşfetmek için hemen indirin.</p>
                  <a
                    className={`btn btn-primary full-width${ANDROID_DOWNLOAD_URL ? '' : ' is-disabled'}`}
                    href={ANDROID_DOWNLOAD_URL || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!ANDROID_DOWNLOAD_URL}
                  >
                    Android için indir
                  </a>
                </article>

                <article className="feature-mini-card festival-download-card">
                  <div className="festival-card-head">
                    <span className="festival-platform-label">
                      <AppleIcon className="festival-platform-icon" />
                      <span>iOS</span>
                    </span>
                  </div>
                  <h4>iOS ön kaydı</h4>
                  <p>iOS için ön kayıt oluşturarak Zayfix Qrakter’i ilk kullananlardan olun.</p>
                  <a
                    className={`btn btn-secondary full-width${IOS_PREREGISTER_URL ? '' : ' is-disabled'}`}
                    href={IOS_PREREGISTER_URL || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!IOS_PREREGISTER_URL}
                  >
                    iOS ön kaydı
                  </a>
                </article>
              </div>
            </article>

            <div className="festival-gallery" aria-label="Adana Motofest 2026 görselleri">
              <figure className="festival-gallery-card is-featured">
                <img className="festival-gallery-image" src={featuredImage.image} alt={featuredImage.alt} loading="lazy" />
                <figcaption className="festival-gallery-caption">{featuredImage.label}</figcaption>
              </figure>

              <div className="festival-gallery-stack">
                {galleryStack.map((item) => (
                  <figure key={item.label} className="festival-gallery-card">
                    <img className="festival-gallery-image" src={item.image} alt={item.alt} loading="lazy" />
                    <figcaption className="festival-gallery-caption">{item.label}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>

          <div className="festival-layout-column festival-layout-column-right">
            <article className="festival-intro-card">
              <div className="section-head festival-section-head">
                <p className="eyebrow">Adana Motofest 2026</p>
                <h2>Adana Motofest 2026</h2>
                <p className="section-copy">
                  17, 18 ve 19 Nisan 2026&apos;da Sarıçam Yörük Ormanı&apos;nda gerçekleşecek Adana Motofest 2026&apos;da
                  etkinlikler, buluşmalar ve festival atmosferi ziyaretçileri bekliyor.
                </p>
                <p className="festival-secondary-copy">
                  Festival alanındaki bilgilere göz atabilir, Android uygulamasını indirebilir veya iOS ön kaydı
                  oluşturarak Zayfix Qrakter deneyimine katılabilirsiniz.
                </p>
              </div>

              <div className="festival-badge-list" aria-label="Adana Motofest 2026 öne çıkan bilgiler">
                {festivalBadges.map((item) =>
                  item.href ? (
                    <a
                      key={item.label}
                      className="festival-badge festival-badge-link"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span key={item.label} className="festival-badge">
                      {item.label}
                    </span>
                  ),
                )}
              </div>

              <div className="festival-info-list" aria-label="Adana Motofest 2026 detayları">
                {festivalDetails.map((item) => (
                  <article key={item.label} className="festival-info-card">
                    <span>{item.label}</span>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className="festival-action-card festival-steps-card">
              <p className="eyebrow">Adana Motofest 2026</p>
              <h3>3 adımda keşfedin</h3>

              <div className="timeline" aria-label="Adana Motofest 2026 ve Zayfix Qrakter bilgilendirme adımları">
                {steps.map((step, index) => (
                  <article key={step.title} className="timeline-item">
                    <span className="timeline-index">{index + 1}</span>
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </article>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
