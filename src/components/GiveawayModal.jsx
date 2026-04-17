import { useEffect, useRef } from 'react'
import { AndroidIcon, AppleIcon } from './StoreIcons'
import hediyeImg from '../assets/zayfix-hediye.jpg'

const ANDROID_DOWNLOAD_URL =
  'https://play.google.com/store/apps/details?id=com.everion.qrakter.app&pcampaignid=web_share'
const IOS_PREREGISTER_URL = 'https://app.zayfix.com'

function GiveawayModal({ onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    // Close on Escape key
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)

    // Trap focus & prevent body scroll
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="giveaway-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Çekiliş Duyurusu"
      onClick={handleBackdropClick}
    >
      <div className="giveaway-modal" ref={dialogRef} tabIndex={-1}>
        {/* Header */}
        <div className="giveaway-modal-header">
          <div className="giveaway-modal-header-bg" aria-hidden="true">
            <div className="giveaway-modal-orb" />
            <div className="giveaway-modal-orb giveaway-modal-orb--2" />
          </div>

          <button
            className="giveaway-modal-close"
            onClick={onClose}
            aria-label="Kapat"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="giveaway-modal-header-content">
            <span className="giveaway-modal-badge">
              <span className="giveaway-modal-badge-dot" />
              3. Adana Motofest · Özel Çekiliş
            </span>
            <h2 className="giveaway-modal-title">
              Çekilişe katıl,<br />
              <span className="giveaway-modal-title-accent">kazan!</span>
            </h2>
          </div>

        </div>

        <div className="giveaway-modal-body">
          {/* Prize row — image + info side by side */}
          <div className="giveaway-modal-prize">
            <img
              src={hediyeImg}
              alt="KNMaster KN1600CPRO interkom seti"
              className="giveaway-modal-prize-img"
            />
            <div className="giveaway-modal-prize-text">
              <p className="giveaway-modal-prize-name">KNMaster KN1600CPRO</p>
              <p className="giveaway-modal-prize-desc">
                2K kameralı motosiklet interkom seti — <strong>2 kişiye hediye!</strong>
              </p>
            </div>
          </div>

          {/* Info lines */}
          <ul className="giveaway-modal-info">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Uygulamayı indirip kayıt olan <strong>2 kişi</strong> kazanacak
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Festival konumunda uygulamayı indirenler arasından seçilecek
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              17–19 Nisan 2026 · Sarıçam Yörük Ormanı, Adana
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="giveaway-modal-actions">
            <a
              className="btn giveaway-modal-btn is-android"
              href={ANDROID_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              <AndroidIcon className="giveaway-modal-btn-icon" />
              <span>Android için indir</span>
            </a>
            <a
              className="btn giveaway-modal-btn is-ios"
              href={IOS_PREREGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              <AppleIcon className="giveaway-modal-btn-icon" />
              <span>iOS ön kayıt / Web'den erişim</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GiveawayModal
