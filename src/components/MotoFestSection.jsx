import { useEffect, useState } from 'react'
import { AndroidIcon, AppleIcon, InstagramIcon } from './StoreIcons'
import hediyeGorseli from '../assets/zayfix-hediye.jpg'

const ANDROID_DOWNLOAD_URL =
  'https://play.google.com/store/apps/details?id=com.everion.qrakter.app&pcampaignid=web_share'
const IOS_PREREGISTER_URL = 'https://app.zayfix.com'
const INSTAGRAM_POST_URL = 'https://www.instagram.com/p/DYZ2tpktkfy/'
const INSTAGRAM_EMBED_URL = 'https://www.instagram.com/p/DYZ2tpktkfy/embed'

const modalDetails = [
  { label: 'Etkinlik', value: 'Silivri Motosiklet Şenliği' },
  { label: 'Tarih', value: '4-5-6-7 Haziran' },
  { label: 'Konsept', value: 'Büyük indirimler ve sürpriz çekilişler' },
  { label: 'Hediye', value: '2K kameralı interkom seti' },
]

function MotoFestSection() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  useEffect(() => {
    if (!isModalOpen) {
      document.body.style.overflow = ''
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  return (
    <>
      <section id="silivri-motofest" className="section motofest-section">
        <div className="container">
          <div className="motofest-grid">
            <article className="motofest-copy-card reveal">
              <div className="motofest-kicker-row">
                <p className="eyebrow motofest-eyebrow">Silivri Motosiklet Kulübü</p>
                <span className="motofest-live-pill">Silivri Motofest 2026</span>
              </div>

              <h2>Silivri Motofest alanında büyük indirimler, sürprizler ve kamera hediyesi bir arada.</h2>

              <p>
                Motosiklet markaları, ekipman mağazaları ve aksesuar dünyası aynı festival alanında buluşuyor.
                Etkinlik postunu aşağıdaki alandan inceleyebilir, tek tıkla modalda geniş görünüm açabilirsiniz.
              </p>

              <div className="motofest-highlight-grid" aria-label="Etkinlik özetleri">
                <div className="motofest-highlight-box">
                  <span>Tarih</span>
                  <strong>4-5-6-7 Haziran</strong>
                </div>
                <div className="motofest-highlight-box">
                  <span>Konum</span>
                  <strong>Silivri Motosiklet Panayırı</strong>
                </div>
              </div>

              <div className="motofest-prize-card" aria-label="Kamera hediyesi detayı">
                <img src={hediyeGorseli} alt="2K Sony kameralı KNMaster interkom seti hediye görseli" />
                <div>
                  <strong>KNMaster KN1600CPRO</strong>
                  <p>2K kameralı motosiklet interkom seti - 2 kişiye hediye!</p>
                </div>
              </div>

              <ul className="motofest-note-list" aria-label="Festival detayları">
                <li>Önde gelen motosiklet markaları</li>
                <li>Ekipman mağazaları</li>
                <li>Aksesuar ve donanım</li>
                <li>Sürpriz hediyeler ve çekilişler</li>
              </ul>

              <div className="motofest-actions">
                <a className="btn btn-primary" href={ANDROID_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                  <AndroidIcon className="motofest-platform-icon" />
                  Android için indir
                </a>
                <a className="btn btn-secondary" href={IOS_PREREGISTER_URL} target="_blank" rel="noopener noreferrer">
                  <AppleIcon className="motofest-platform-icon" />
                  iOS için web'ten erişim
                </a>
                <a className="btn btn-instagram" href={INSTAGRAM_POST_URL} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon className="motofest-platform-icon" />
                  Instagram postu
                </a>
              </div>
            </article>

            <article className="motofest-poster-card reveal" aria-label="Silivri Motofest Instagram postu">
              <div className="motofest-poster-head">
                <p className="motofest-reel-label">Instagram</p>
              </div>

              <div className="motofest-poster-frame">
                <iframe
                  src={INSTAGRAM_EMBED_URL}
                  title="Silivri Motosiklet Şenliği Instagram Postu"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  loading="lazy"
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      {isModalOpen ? (
        <div className="motofest-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="motofest-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="motofest-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="motofest-modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Modalı kapat"
            >
              Kapat
            </button>

            <div className="motofest-modal-layout">
              <div className="motofest-modal-content">
                <span className="motofest-modal-pill">Silivri Motofest 2026</span>
                <h2 id="motofest-modal-title">Silivri Motosiklet Şenliği</h2>

                <p className="motofest-modal-intro">
                  4-5-6-7 Haziran tarihlerinde Silivri Motosiklet Şenliği alanında QRAKTER ile buluşun.
                  Uygulamayı indirerek veya web üzerinden kayıt olarak etkinlik akışına katılabilirsiniz.
                </p>

                <div className="motofest-modal-tags" aria-label="Etkinlik etiketleri">
                  <span className="motofest-modal-tag">4-5-6-7 Haziran</span>
                  <span className="motofest-modal-tag">Silivri Motosiklet Panayırı</span>
                  <span className="motofest-modal-tag">İndirimler • Sürpriz çekilişler</span>
                </div>

                <div className="motofest-modal-details" aria-label="Etkinlik detayları">
                  {modalDetails.map((detail) => (
                    <div className="motofest-modal-detail" key={detail.label}>
                      <span>{detail.label}</span>
                      <strong>{detail.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="motofest-modal-prize-card" aria-label="Kamera hediyesi kartı">
                  <img src={hediyeGorseli} alt="Kameralı interkom seti hediye görseli" />
                  <div>
                    <strong>KNMaster KN1600CPRO</strong>
                    <p>2K kameralı motosiklet interkom seti - 2 kişiye hediye!</p>
                  </div>
                </div>

                <ul className="motofest-modal-note-list" aria-label="Katılım koşulları">
                  <li>Uygulamayı indirip kayıt olan ve Instagram katılım şartlarını sağlayan kullanıcılar arasından kazananlar seçilecektir.</li>
                  <li>Katılım için Instagram hesabını takip etmek ve kampanya gönderisini beğenmek gereklidir.</li>
                  <li>Hediye, katılım şartlarını sağlayan kullanıcılar arasından belirlenecektir.</li>
                </ul>

                <div className="motofest-modal-actions">
                  <a className="btn btn-primary" href={ANDROID_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                    <AndroidIcon className="motofest-platform-icon" />
                    Android için indir
                  </a>
                  <a className="btn btn-secondary" href={IOS_PREREGISTER_URL} target="_blank" rel="noopener noreferrer">
                    <AppleIcon className="motofest-platform-icon" />
                    iOS için web'ten erişim
                  </a>
                  <a className="btn btn-instagram" href={INSTAGRAM_POST_URL} target="_blank" rel="noopener noreferrer">
                    <InstagramIcon className="motofest-platform-icon" />
                    Instagram postu
                  </a>
                </div>
              </div>

              <aside className="motofest-modal-media" aria-label="Instagram postu">
                <div className="motofest-modal-embed-shell">
                  <p className="motofest-reel-label">Instagram</p>
                  <iframe
                    src={INSTAGRAM_EMBED_URL}
                    title="Silivri Motosiklet Şenliği Instagram Postu büyük görünüm"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    loading="lazy"
                  />
                </div>
              </aside>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default MotoFestSection
