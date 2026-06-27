import { useEffect, useState } from 'react'
import { AndroidIcon, AppleIcon, InstagramIcon } from './StoreIcons'
import hediyeGorseli from '../assets/zayfix-hediye.jpg'

const ANDROID_DOWNLOAD_URL =
    'https://play.google.com/store/apps/details?id=com.everion.qrakter.app&pcampaignid=web_share'
const IOS_PREREGISTER_URL = 'https://app.zayfix.com'
const INSTAGRAM_POST_URL =
    'https://www.instagram.com/p/DZCkZkVNopw/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='

const INSTAGRAM_EMBED_URL =
    'https://www.instagram.com/p/DZCkZkVNopw/embed'

const modalDetails = [
    { label: 'Etkinlik', value: '5. Erdek Motofest' },
    { label: 'Tarih', value: '25-28 Haziran 2026' },
    { label: 'Konsept', value: 'Dostluk, müzik, kamp ve özgürlük' },
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
            <section id="erdek-motofest" className="section motofest-section">
                <div className="container">
                    <div className="motofest-grid">
                        <article className="motofest-copy-card reveal">
                            <div className="motofest-kicker-row">
                                <p className="eyebrow motofest-eyebrow">Türkiye Motosiklet Platformu</p>
                                <span className="motofest-live-pill">5. Erdek Motofest 2026</span>
                            </div>

                            <h2>On binlerce motosiklet tutkunu Erdek’te müzik, kamp ve eğlenceyle buluşuyor.</h2>

                            <p>
                                Canlı konserler, ödüllü yarışmalar, köpük partisi ve sürpriz çekilişlerle dolu festival,
                                Göktur Çamlık Camping’de motosiklet tutkunlarını bir araya getiriyor. Etkinlik postunu
                                yan taraftaki alandan inceleyebilirsiniz.
                            </p>

                            <div className="motofest-highlight-grid" aria-label="Etkinlik özetleri">
                                <div className="motofest-highlight-box">
                                    <span>Tarih</span>
                                    <strong>25-28 Haziran 2026</strong>
                                </div>
                                <div className="motofest-highlight-box">
                                    <span>Konum</span>
                                    <strong>Göktur Çamlık Camping – Erdek</strong>
                                </div>
                            </div>

                            <div className="motofest-prize-card" aria-label="Kamera hediyesi detayı">
                                <img src={hediyeGorseli} alt="2K Sony kameralı KNMaster interkom seti hediye görseli" />
                                <div>
                                    <strong>KNMaster KN1600CPRO</strong>
                                    <p>2K kameralı motosiklet interkom seti - 3 kişiye hediye!</p>
                                </div>
                            </div>

                            <ul className="motofest-note-list" aria-label="Festival detayları">
                                <li>Canlı konserler</li>
                                <li>Ödüllü yarışmalar</li>
                                <li>Köpük partisi</li>
                                <li>Sürpriz çekilişler</li>
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

                        <article className="motofest-poster-card reveal" aria-label="5. Erdek Motofest Instagram postu">
                            <div className="motofest-poster-head">
                                <p className="motofest-reel-label">Instagram</p>
                            </div>

                            <div className="motofest-poster-frame">
                                <iframe
                                    src={INSTAGRAM_EMBED_URL}
                                    title="5. Erdek Motofest Instagram Postu"
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
                                <span className="motofest-modal-pill">5. Erdek Motofest 2026</span>
                                <h2 id="motofest-modal-title">5. Erdek Motofest</h2>

                                <p className="motofest-modal-intro">
                                    25-28 Haziran 2026 tarihlerinde Göktur Çamlık Camping – Erdek’te düzenlenecek
                                    5. Erdek Motofest’te QRAKTER ile buluşun. Uygulamayı indirerek veya web üzerinden
                                    kayıt olarak etkinlik akışına katılabilirsiniz.
                                </p>

                                <div className="motofest-modal-tags" aria-label="Etkinlik etiketleri">
                                    <span className="motofest-modal-tag">25-28 Haziran 2026</span>
                                    <span className="motofest-modal-tag">Göktur Çamlık Camping – Erdek</span>
                                    <span className="motofest-modal-tag">Konser • Yarışma • Köpük partisi</span>
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
                                        <p>2K kameralı motosiklet interkom seti - 3 kişiye hediye!</p>
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
                                        title="5. Erdek Motofest Instagram Postu büyük görünüm"
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
