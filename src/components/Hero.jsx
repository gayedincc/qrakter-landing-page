import { useEffect, useRef } from 'react'
import motorZayfixImage from '../assets/motor-zayfix.png'

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
