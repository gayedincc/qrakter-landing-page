import zayfixMaskotImage from '../assets/zayfix-maskot-6.webp'

function CekilisLandingPage({ onNavigate }) {
    const navigateTo = (path) => {
        if (typeof onNavigate === 'function') {
            onNavigate(path)
            return
        }

        window.location.assign(path)
    }

    return (
        <section className="section cekilis-landing-page">
            <div className="container cekilis-landing-shell">
                <div className="cekilis-landing-hero">
                    <p className="eyebrow">QRakter Çekiliş</p>

                    <h1>Çekiliş türünü seçin.</h1>

                    <p className="section-copy">
                        Fuar, festival ve uygulama içi kampanyalar için doğru çekiliş akışını
                        seçerek devam edin. QRakter, katılım sürecini hızlı, güvenli ve
                        yönetilebilir hale getirir.
                    </p>

                    <div className="cekilis-landing-mascot" aria-hidden="true">
                        <img src={zayfixMaskotImage} alt="" />
                    </div>
                </div>

                <div className="cekilis-options-grid">
                    <button
                        type="button"
                        className="cekilis-option-card"
                        onClick={() => navigateTo('/panel/cekilis/fuar')}
                    >
                        <span className="cekilis-option-icon cekilis-option-icon-event" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M4 20h16M6 20V9.8L12 4l6 5.8V20M8.5 20v-5.5a3.5 3.5 0 0 1 7 0V20M7.2 9.2h9.6" />
                            </svg>
                        </span>
                        <span className="cekilis-option-badge">Etkinlik Akışı</span>

                        <h2>Fuar / Festival Çekilişi</h2>

                        <p>
                            Etkinlik alanında yapılan QRakter çekilişleri için giriş ekranına
                            devam edin. Konum, şifre ve yarıçap bilgileriyle çekiliş alanını
                            yönetebilirsiniz.
                        </p>

                        <span className="cekilis-option-cta">
                            Fuar Çekilişine Git
                            <span aria-hidden="true">→</span>
                        </span>
                    </button>

                    <button
                        type="button"
                        className="cekilis-option-card"
                        onClick={() => navigateTo('/panel/cekilis/haftalik-uygulama')}
                    >
                        <span className="cekilis-option-icon cekilis-option-icon-gift" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M4.5 10h15v10h-15V10ZM3.8 7h16.4v3H3.8V7ZM12 7v13M8.2 7C6.9 7 6 6.1 6 5s.9-2 2-2c2.4 0 4 4 4 4M15.8 7C17.1 7 18 6.1 18 5s-.9-2-2-2c-2.4 0-4 4-4 4" />
                            </svg>
                        </span>
                        <span className="cekilis-option-badge">Uygulama İçi</span>

                        <h2>Uygulama İçi Haftalık Çekiliş</h2>

                        <p>
                            Kullanıcıların biletleriyle katıldığı haftalık ödül ve çark sistemi
                            için hazırlanan uygulama içi çekiliş alanına devam edin.
                        </p>

                        <span className="cekilis-option-cta">
                            Haftalık Uygulama Çekilişine Git
                            <span aria-hidden="true">→</span>
                        </span>
                    </button>

                    <button
                        type="button"
                        className="cekilis-option-card"
                        onClick={() => navigateTo('/panel/cekilis/gelismis')}
                    >
                        <span className="cekilis-option-icon cekilis-option-icon-event" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M4 6h16M4 12h10M4 18h7M17 14l2.2 2.2L22 13" />
                            </svg>
                        </span>
                        <span className="cekilis-option-badge">Kriter Bazlı</span>

                        <h2>Gelişmiş Çekiliş</h2>

                        <p>
                            Şehir, kayıt tarihi, kulüp, aktiflik gibi kriterlerle katılımcı havuzu
                            oluşturun; manuel katılımcı ekleyin, ödülleri tanımlayın ve çekilişi yapın.
                        </p>

                        <span className="cekilis-option-cta">
                            Gelişmiş Çekilişe Git
                            <span aria-hidden="true">→</span>
                        </span>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default CekilisLandingPage
