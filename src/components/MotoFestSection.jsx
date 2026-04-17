import { useEffect, useRef } from "react";
import img1 from "../assets/adanamotofest-1.jpeg";
import img2 from "../assets/adanamotofest-2.jpeg";

const EVENT_DETAILS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    label: "17 – 19 Nisan 2026",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Sarıçam Yörük Ormanı, Adana",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    label: "DJ Parti · Konser · Çekiliş · Yarışma",
  },
];

export default function MotoFestSection() {
  const sectionRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target
              .querySelectorAll(".motofest-reveal")
              .forEach((child, i) => {
                child.style.transitionDelay = `${i * 0.1}s`;
                child.classList.add("is-visible");
              });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    // Mouse parallax on gallery
    const gallery = galleryRef.current;
    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;

      if (gallery) {
        const cards = gallery.querySelectorAll(".motofest-img-wrap");
        cards.forEach((card, i) => {
          const depth = [1.4, 2.0][i] || 1.5;
          card.style.transform = `translate(${dx * depth * -6}px, ${dy * depth * -4}px) ${
            i === 0 ? "translateY(20px) scale(0.97)" : "translateY(-12px) scale(1.03)"
          }`;
        });
      }
    };

    const handleMouseLeave = () => {
      if (gallery) {
        const cards = gallery.querySelectorAll(".motofest-img-wrap");
        cards.forEach((card, i) => {
          card.style.transform = i === 0 ? "translateY(20px) scale(0.97)" : "translateY(-12px) scale(1.03)";
        });
      }
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      observer.disconnect();
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="motofest-section" ref={sectionRef} aria-label="3. Adana Motofest etkinliği">
      <div className="motofest-bg-layer" aria-hidden="true" />
      <div className="motofest-grid-overlay" aria-hidden="true" />
      <div className="motofest-orb motofest-orb-1" aria-hidden="true" />
      <div className="motofest-orb motofest-orb-2" aria-hidden="true" />

      <div className="container motofest-inner">
        {/* Left: Content */}
        <div className="motofest-content">
          <span className="motofest-badge motofest-reveal">
            <span className="motofest-badge-dot" />
            Resmi Etkinlik Katılımcısı
          </span>

          <h2 className="motofest-title motofest-reveal">
            3. Adana{" "}
            <span className="motofest-title-accent">Motofest</span>'te
            <br />
            Zayfix sahnede!
          </h2>

          <p className="motofest-description motofest-reveal">
            Binlerce motosiklet tutkununu buluşturan 3. Adana Motofest'in
            resmi etkinlik sponsoruyuz. Zayfix Qrakter, kaza anı desteği ve
            hak kayıpları paneli ile sahada olacak.
          </p>

          <ul className="motofest-details motofest-reveal" aria-label="Etkinlik detayları">
            {EVENT_DETAILS.map((item) => (
              <li key={item.label} className="motofest-detail-item">
                <span className="motofest-detail-icon">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          <a
            className="motofest-cta motofest-reveal"
            href="https://www.instagram.com/adanamotofest/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" width="18" height="18">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
            @adanamotofest
          </a>
        </div>

        {/* Right: Image Gallery */}
        <div className="motofest-gallery" ref={galleryRef} aria-label="Etkinlik görselleri">
          <div className="motofest-img-wrap motofest-img-left motofest-reveal">
            <img src={img1} alt="3. Adana Motofest ana etkinlik afişi – 17-19 Nisan 2026" className="motofest-img" loading="lazy" />
            <div className="motofest-img-shine" aria-hidden="true" />
          </div>
          <div className="motofest-img-wrap motofest-img-center motofest-reveal">
            <img src={img2} alt="Zayfix – 3. Adana Motofest Etkinlik Katılımcısı afişi" className="motofest-img" loading="lazy" />
            <div className="motofest-img-shine" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
