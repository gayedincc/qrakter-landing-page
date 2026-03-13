import { useEffect, useState } from 'react'

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 320)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      type="button"
      className={`scroll-top-button ${isVisible ? 'is-visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Sayfanın en üstüne çık"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 5.5 4.75 12.75l1.5 1.5L11 9.5V20h2V9.5l4.75 4.75 1.5-1.5z" />
      </svg>
    </button>
  )
}

export default ScrollToTopButton
