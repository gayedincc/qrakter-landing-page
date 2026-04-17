import { useEffect, useRef } from 'react'
import motorZayfixImage from '../assets/motor-zayfix.png'
import { AndroidIcon, AppleIcon } from './StoreIcons'

const ANDROID_DOWNLOAD_URL =
  "https://play.google.com/store/apps/details?id=com.everion.qrakter.app&pcampaignid=web_share";
const IOS_PREREGISTER_URL = "https://app.zayfix.com";

function Hero() {
  const sectionRef = useRef(null)
  const visualRef = useRef(null)
  const blobRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const visual = visualRef.current
    const blob = blobRef.current
    if (!section || !visual) return

    const handleMouseMove = (e) => {
      const rect = section.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / rect.width
      const dy = (e.clientY - cy) / rect.height

      visual.style.transform = `translate(${dx * -14}px, ${dy * -10}px)`
      if (blob) {
        blob.style.transform = `translate(${dx * 20}px, ${dy * 16}px)`
      }
    }

    const handleMouseLeave = () => {
      visual.style.transform = ''
      if (blob) blob.style.transform = ''
    }

    section.addEventListener('mousemove', handleMouseMove)
    section.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      section.removeEventListener('mousemove', handleMouseMove)
      section.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section className="hero-section section" ref={sectionRef}>
      <div className="hero-bg-blob" ref={blobRef} aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-content">
          <p className="eyebrow reveal">Akıllı Kaza Yardım Uygulaması</p>
          <h1 className="reveal">Kaza anında gerekli bilgi, yönlendirme ve kayıt akışı tek ekranda hazır olsun.</h1>
          <p className="hero-description reveal">
            QRAKTER; profil, sağlık, araç ve evrak verilerini düzenli tutar, kritik ekranları hızlı erişime açar ve
            ihtiyaç anında süreci daha sakin yönetmene yardımcı olur.
          </p>
          <div className="hero-store-btns reveal" style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.7rem' }}>
            <a
              className="btn floating-store-btn is-android"
              style={{ width: 'auto' }}
              href={ANDROID_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AndroidIcon className="floating-store-icon" />
              <span>Android için indir</span>
            </a>
            <a
              className="btn floating-store-btn is-ios"
              style={{ width: 'auto' }}
              href={IOS_PREREGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AppleIcon className="floating-store-icon" />
              <span>iOS ön kayıt / Web'den erişim</span>
            </a>
          </div>
        </div>

        <div className="hero-visual" ref={visualRef} style={{ transition: 'transform 0.12s ease-out', willChange: 'transform' }}>
          <div className="hero-visual-frame">
            <img className="hero-visual-image" src={motorZayfixImage} alt="Zayfix Qrakter motor sürücüsü görseli" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
