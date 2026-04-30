import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AndroidIcon, AppleIcon } from './StoreIcons';
import hediyeGorseli from '../assets/zayfix-hediye.jpg';

function CalendarIcon() {
  return (
    <svg className="mersin-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="mersin-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BikeIcon() {
  return (
    <svg className="mersin-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6h-5l-3 8h10l-2-8z" />
      <path d="M8 14l2-6" />
      <path d="M18.5 14l-3.5-8" />
    </svg>
  );
}


const ANDROID_URL =
  'https://play.google.com/store/apps/details?id=com.everion.qrakter.app&pcampaignid=web_share';
const IOS_URL = 'https://app.zayfix.com';
const REEL_EMBED_URL = 'https://www.instagram.com/reel/DQjcpADiFWP/embed';
const INSTAGRAM_URL = 'https://www.instagram.com/mersinmotofest2026/';

function MersinMotoFestModal({ onClose }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className="mersin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Mersin Motofest 2026 detayları"
      onClick={handleBackdropClick}
    >
      <div className="mersin-modal">
        <button
          className="mersin-modal-close"
          onClick={onClose}
          aria-label="Kapat"
          type="button"
        />

        <div className="mersin-modal-layout">
          <div className="mersin-modal-content">
            <span className="mersin-modal-pill"><CalendarIcon />1-3 Mayıs 2026 · Erdemli, Mersin</span>
            <h2>Mersin Motofest&nbsp;2026</h2>

            <p className="mersin-modal-description">
              1&ndash;3 Mayıs 2026, Erdemli / Tırtar Kamp Alanı&#8217;nda QRAKTER ailesiyle
              buluşun. Grup sürüşleri, konserler ve sahil keyfi sizi bekliyor.
            </p>

            <div className="mersin-modal-actions mersin-modal-actions-priority">
              <a className="btn btn-primary" href={ANDROID_URL} target="_blank" rel="noopener noreferrer">
                <AndroidIcon className="motofest-platform-icon" />
                Android için indir
              </a>
              <a className="btn mersin-modal-btn-ios" href={IOS_URL} target="_blank" rel="noopener noreferrer">
                <AppleIcon className="motofest-platform-icon" />
                iOS ön kayıt / Web
              </a>
              <a className="btn btn-mersin-ig" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                Instagram&#8217;a Git
              </a>
            </div>

            <div className="motofest-prize-card mersin-modal-prize-inline" aria-label="Hediye detayı">
              <img src={hediyeGorseli} alt="Hediye ürünü KNMaster KN1600CPRO interkom seti" />
              <div>
                <strong>KNMaster KN1600CPRO</strong>
                <p>2K kameralı motosiklet interkom seti — 4 kişiye hediye!</p>
              </div>
            </div>

            <div className="mersin-modal-steps">
              <div className="mersin-modal-step">
                <span className="mersin-modal-step-num" aria-hidden="true">1</span>
                <div className="mersin-modal-step-body">
                  <strong>İndir veya Web&#8217;e Eriş</strong>
                  <p>Android, iOS veya web üzerinden QRAKTER&#8217;e kayıt ol.</p>
                </div>
              </div>
              <div className="mersin-modal-step">
                <span className="mersin-modal-step-num" aria-hidden="true">2</span>
                <div className="mersin-modal-step-body">
                  <strong>Profilini Oluştur</strong>
                  <p>Sağlık ve araç bilgilerini bir kez gir, her yerde hazır olsun.</p>
                </div>
              </div>
              <div className="mersin-modal-step">
                <span className="mersin-modal-step-num" aria-hidden="true">3</span>
                <div className="mersin-modal-step-body">
                  <strong>Festivale Gel</strong>
                  <p>Tırtar Kamp Alanı&#8217;nda QRAKTER standını ziyaret et.</p>
                </div>
              </div>
            </div>

            <ul className="mersin-modal-info-list" aria-label="Festival bilgileri">
              <li><CalendarIcon />1 Mayıs Cuma · 2 Mayıs Cumartesi · 3 Mayıs Pazar</li>
              <li><PinIcon />Tırtar Kamp Alanı, Erdemli / Mersin</li>
              <li><BikeIcon />Grup sürüşleri, konserler, stantlar ve sahil keyfi</li>
            </ul>

          </div>

          <div className="mersin-modal-reel" aria-label="Mersin Motofest videosu">
            <p className="mersin-modal-reel-label">Sitede İzle</p>
            <div className="reel-clickwrap">
              <iframe
                src={REEL_EMBED_URL}
                title="Mersin Motofest 2026 videosu"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}

function MersinMotoFestSection() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <>
      <section id="mersin-motofest" className="section mersin-mf-section">
        <div className="container">
          <div className="mersin-mf-grid">
            <article className="mersin-mf-copy-card reveal">
              <p className="mersin-mf-eyebrow">Mersin Motofest 2026</p>
              <h2>Mersin Motor Kulübü&#8217;nün 20. yılında büyük festival</h2>

              <p className="mersin-mf-desc">
                1&ndash;3 Mayıs&#8217;ta Erdemli&#8217;de QRAKTER ile buluşun. Uygulamayı indirin veya
                web üzerinden kayıt olun; standımızda sizi bekliyoruz.
              </p>

              <div className="mersin-mf-chips" role="list" aria-label="Festival detayları">
                <span className="mersin-mf-chip" role="listitem"><CalendarIcon />1-3 Mayıs 2026</span>
                <span className="mersin-mf-chip" role="listitem"><PinIcon />Erdemli / Tırtar, Mersin</span>
                <span className="mersin-mf-chip" role="listitem"><BikeIcon />Grup sürüşleri · konserler · sahil keyfi</span>
              </div>

              <div className="motofest-prize-card" aria-label="Hediye detayı">
                <img src={hediyeGorseli} alt="Hediye ürünü KNMaster KN1600CPRO interkom seti" />
                <div>
                  <strong>KNMaster KN1600CPRO</strong>
                  <p>2K kameralı motosiklet interkom seti — 4 kişiye hediye!</p>
                </div>
              </div>

              <ul className="motofest-note-list" aria-label="Hediye koşulları">
                <li>Uygulamayı indirip kayıt olan ve Instagram katılım şartlarını sağlayan kullanıcılar arasından 4 kişi seçilecektir.</li>
                <li>Katılım için Mersin Motofest Instagram hesabını takip etmek ve son gönderiyi beğenmek gereklidir.</li>
                <li>Hediye, katılım şartlarını sağlayan kullanıcılar arasından belirlenecektir.</li>
              </ul>

              <div className="mersin-mf-actions">
                <a className="btn btn-primary" href={ANDROID_URL} target="_blank" rel="noopener noreferrer">
                  <AndroidIcon className="motofest-platform-icon" />
                  Android için indir
                </a>
                <a className="btn mersin-mf-btn-ios" href={IOS_URL} target="_blank" rel="noopener noreferrer">
                  <AppleIcon className="motofest-platform-icon" />
                  iOS / Web
                </a>
                <a className="btn btn-mersin-ig" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  Instagram&#8217;a Git
                </a>
              </div>
            </article>

            <article className="mersin-mf-reel-card reveal" aria-label="Mersin Motofest videosu">
              <p className="mersin-mf-reel-label">Sitede İzle</p>
              <div className="reel-clickwrap">
                <iframe
                  id="mersin-mf-video-main"
                  src={REEL_EMBED_URL}
                  title="Mersin Motofest 2026 videosu"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  loading="lazy"
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      {modalOpen && <MersinMotoFestModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

export default MersinMotoFestSection;
