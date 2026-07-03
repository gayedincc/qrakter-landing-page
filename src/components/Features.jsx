import { useMemo, useState } from 'react'
import {
    clubsScreenImage,
    communityEventsImage,
    communityRankingImage,
    documentsScreenImage,
    homeScreenImage,
    invitationScreenImage,
    miniGamesImage,
    notificationsImage,
    profileScreenImage,
    qrEmergencyCardImage,
    reportFlowScreenImage,
    reportStartScreenImage,
    reportsScreenImage,
    signatureCampaignsImage,
    wheelScreenImage,
    winnersScreenImage,
} from '../constants/landingImages'

const introHighlights = [
    {
        title: 'Hızlı erişim',
        description: 'Günlük kullanımda ihtiyaç duyulan işlemler ana alanlardan kısa adımlarla açılır.',
    },
    {
        title: 'Kayıt yönetimi',
        description: 'Profil, evrak ve kaza tutanağı kayıtları düzenli bir yapı içinde takip edilir.',
    },
    {
        title: 'Topluluk ve kulüpler',
        description: 'Kulüpler ve topluluk alanları tek sayfada anlaşılır şekilde incelenebilir.',
    },
    {
        title: 'Ödüller ve katılım',
        description: 'Çark, oyunlar, davet ve imza kampanyaları aynı bölümde görüntülenebilir.',
    },
]

const coreTabs = [
    {
        id: 'home',
        label: 'Ana Ekran',
        title: 'En sık kullanılan işlemleri ana sayfadan başlatın',
        description: 'Giriş yaptıktan sonra açılan ana sayfa, QRakter içindeki temel işlemlere hızlı ulaşmanızı sağlar.',
        bullets: [
            'QR Acil Durum Kartı, Profilim ve Evraklarım alanlarına ana sayfadan ulaşılır.',
            'Yeni Tutanak ile kaza tutanağı başlatılır; Tutanaklarım ile önceki kayıtlar görüntülenir.',
            'SOS, 112 ve Kaza Destek Hattı alanları acil durum ve destek ihtiyaçları için hızlı erişim sağlar.',
            'Alt menüden Topluluk, Ana Sayfa ve Kulüpler arasında geçiş yapılır.',
        ],
        image: homeScreenImage,
        alt: 'QRakter ana sayfa ve hızlı erişim alanları',
    },
    {
        id: 'profile',
        label: 'Profilim',
        title: 'Kullanıcı bilgilerinizi ve tamamlanma durumunu takip edin',
        description:
            'Profilim ekranında profil fotoğrafı, ad soyad, TCKN ve kan grubu görüntülenir. Profil Tamamlanma Durumu eksik kalan alanları gösterir; kimlik ve sürücü bilgileri, sağlık bilgileri, acil durum kişileri, araçlar ve referans kodu bu ekrandan yönetilir.',
        bullets: [
            '“Tamamlanması Gereken Alanlar” bölümü açılarak eksik bilgiler görüntülenir.',
            'Kimlik ve Sürücü Bilgileri alanında kişisel bilgiler, iletişim bilgileri ve ehliyet bilgileri tamamlanır.',
            'Sağlık Bilgileri alanında kan grubu, alerjiler, kronik hastalıklar, ilaçlar ve engellilik durumu güncel tutulur.',
            'Acil Durum Kişileri alanına kişinin adı, yakınlık derecesi ve telefon bilgileri eklenebilir.',
        ],
        detailCards: [
            {
                title: 'ARAÇLAR',
                text: 'Kayıtlı araçların plaka, marka, model ve şasi bilgileri görüntülenir. Araçla bağlantılı sigorta ve kasko bilgilerine ulaşılabilir.',
            },
            {
                title: 'REFERANS KODU',
                text: 'Kullanıcı bir saha personeli aracılığıyla kayıt olduysa ilgili saha personeline ait referans kodu bu alana girilir.',
            },
            {
                title: 'ARKADAŞINI DAVET ET',
                text: 'Davet kodu paylaşılabilir; davet edilen ve ödül kazandıran kayıt sayıları takip edilebilir.',
            },
            {
                title: 'İMZA KAMPANYALARI',
                text: 'Yayınlanan toplumsal talepler görüntülenebilir ve aktif kampanyalara destek olunabilir.',
            },
        ],
        image: profileScreenImage,
        alt: 'QRakter Profilim ekranı ve profil tamamlanma durumu',
    },
    {
        id: 'qr',
        label: 'Acil Durum QR Kartı',
        title: 'Acil durumda paylaşılacak bilgileri kontrol edin',
        description:
            'QR Acil Durum Kartı ana sayfadan açılır. Kartta QR kod, ad soyad ve kan grubu görüntülenir; kart indirilebilir veya paylaşılabilir.',
        bullets: [
            'Kartı İndir / Paylaş seçeneğiyle QR kart kullanılabilir.',
            'QR Ayarları alanında Vatandaş, Polis/Jandarma ve Sağlık rolleri için gösterilecek bilgiler ayrı ayrı belirlenir.',
            'Profil fotoğrafı, iletişim, kan grubu, alerjiler, kronik hastalıklar, ilaçlar ve engellilik durumu açılıp kapatılabilir.',
            'Fiziksel QR tanımlanabilir; anahtarlık, motor kaskı, motosiklet, cüzdan kartı ve araç camı için QR şablonları indirilebilir.',
        ],
        image: qrEmergencyCardImage,
        alt: 'QRakter QR Acil Durum Kartı görünümü',
    },
    {
        id: 'documents',
        label: 'Evraklar',
        title: 'Belgelerinizi görüntüleyin, ekleyin ve güncel tutun',
        description:
            'Evraklarım alanında kasko, trafik sigortası, araç muayenesi ve eklenen diğer belgeler kartlar hâlinde görüntülenir.',
        bullets: [
            'Belgeler evrak tipi, kalan gün ve plaka bilgisine göre filtrelenebilir.',
            'Yeni belge eklerken Sigorta/Kasko, Araç Muayenesi veya Diğer türlerinden biri seçilir.',
            'Kayıtlı belgeler görüntülenebilir, güncellenebilir veya silinebilir.',
            'Poliçe Belgesi ile Doldur seçeneğiyle belge Kamera, Galeri veya Dosya üzerinden yüklenebilir.',
        ],
        infoBox:
            'Yüklenen poliçe yapay zekâ ile analiz edilerek uygun form alanlarına aktarılır. Otomatik getirilen bilgiler kaydedilmeden önce belgeyle karşılaştırılmalıdır.',
        image: documentsScreenImage,
        alt: 'QRakter Evraklarım belge listesi',
    },
    {
        id: 'notifications',
        label: 'Bildirimler',
        title: 'Yeni ve önceki bildirimleri tek ekrandan takip edin',
        description: 'Ana sayfanın sağ üst bölümündeki zil simgesine dokunulduğunda Bildirimler ekranı açılır.',
        bullets: [
            'Çark hakkı hatırlatmaları görüntülenir.',
            'Kulüplere gelen katılım istekleri ve kulüp duyuruları listelenir.',
            'Okunmamış bildirimler Yeni bölümünde vurgulu kartlarla gösterilir.',
            'Daha önce görüntülenen bildirimler Önceki başlığı altında tarih sırasına göre listelenir.',
        ],
        image: notificationsImage,
        alt: 'QRakter bildirimler ekranı',
    },
]

const accidentTabs = [
    {
        id: 'start',
        label: 'Başlangıç',
        title: 'Bulunduğunuz duruma uygun işlemle başlayın',
        description: 'Kaza Tutanağı ekranında Yeni Tutanak Başlat, Tutanağa Katıl ve Tutanaklarım seçenekleri bulunur.',
        bullets: [
            'Yeni Tutanak Başlat: Kazayı ilk raporlayan kullanıcı yeni süreci açar.',
            'Tutanağa Katıl: Diğer sürücünün başlattığı tutanağa QR kodla katılım sağlanır.',
            'Tutanaklarım: Önceki ve tamamlanmamış kayıtlar görüntülenir.',
        ],
        image: reportStartScreenImage,
        alt: 'QRakter kaza tutanağı başlangıç seçenekleri',
    },
    {
        id: 'flow',
        label: 'Tutanak Akışı',
        title: 'Bireysel veya paylaşımlı tutanakla ilerleyin',
        description:
            'Diğer sürücüde QRakter yoksa Bireysel tutanak seçilir. Her iki sürücüde de QRakter varsa Paylaşımlı tutanakla taraflar kendi bilgilerini kendi cihazlarından doldurabilir.',
        bullets: [
            'Tutanak Bireysel veya Paylaşımlı olarak oluşturulur.',
            'Sürücü ve araç bilgileri profilden alınır veya elle girilir.',
            'Araç türü, darbe noktaları, fotoğraflar, konum ve açıklamalar eklenir.',
            'Kaza senaryosu hazırlanır ve tüm bilgiler kontrol edilir.',
            'Gerekirse tanık bilgisi eklenir; sürücüler imza ve e-posta koduyla işlemi tamamlar.',
        ],
        image: reportFlowScreenImage,
        alt: 'QRakter kaza tutanağı adımları görünümü',
    },
    {
        id: 'reports',
        label: 'Tutanaklarım',
        title: 'Taslak ve tamamlanan kayıtlarınıza yeniden ulaşın',
        description: 'Tutanaklarım ekranında daha önce oluşturulan tutanaklar kartlar hâlinde listelenir.',
        bullets: [
            'Taslak, devam eden ve tamamlanan kayıtlar listelenir.',
            'Kartlarda tutanak durumu, tipi, tarih, konum ve katılımcı sayısı görüntülenir.',
            'Tamamlanmamış tutanağa geri dönülebilir.',
            'Tamamlanan kaydın katılımcı, araç, sigorta ve poliçe bilgileri incelenebilir.',
        ],
        image: reportsScreenImage,
        alt: 'QRakter tutanaklarım kayıt listesi',
    },
]

const communityTabs = [
    {
        id: 'events',
        label: 'Etkinlikler',
        title: 'Yayınlanan etkinlikleri görüntüleyin',
        description:
            'Etkinlikler kartlar hâlinde listelenir. Kartlarda etkinliğin adı, kısa açıklaması, katılımcı sayısı, yüklenen fotoğraf sayısı ve güncel durumu yer alır.',
        bullets: [
            'İncelenmek istenen etkinlik kartından etkinlik detayına geçilir.',
            'Aktif etkinliklerde kullanıcı fotoğraf yükleyebilir.',
            'Tamamlanan etkinlikler kart üzerinde “Sona erdi” bilgisiyle gösterilir.',
            'Fotoğrafları Değerlendir butonuyla etkinlik kapsamında paylaşılan fotoğraflar incelenir.',
        ],
        image: communityEventsImage,
        alt: 'QRakter Topluluk Etkinlikler listesi',
    },
    {
        id: 'leaders',
        label: 'Enler',
        title: 'Etkinliklerde öne çıkan kullanıcıları inceleyin',
        description:
            'Enler sekmesi, seçilen etkinlikte kullanıcıların aldığı beğeni sayısına göre oluşan sıralamayı gösterir.',
        bullets: [
            'Kullanıcı önce incelemek istediği etkinliği seçer.',
            'Katılımcılar paylaşımlarının aldığı beğeni sayısına göre sıralanır.',
            'İlk üç kullanıcı madalya simgeleriyle gösterilir.',
            'Her kartta kullanıcının adı, etkinlik paylaşımı ve toplam beğeni sayısı yer alır.',
        ],
        image: communityRankingImage,
        alt: 'QRakter Topluluk Enler sıralaması',
    },
]

const rewardTabs = [
    {
        id: 'wheel',
        label: 'Şans Çarkı',
        title: 'Günlük çark hakkınızı kullanarak bilet kazanın',
        description: 'Kullanıcı günlük hakkıyla çarkı çevirir ve okun gösterdiği bilet miktarı hesaba eklenir.',
        bullets: [
            'Kullanıcı günlük hakkıyla çarkı çevirir.',
            'Okun gösterdiği bilet miktarı hesaba eklenir.',
            'Toplam bilet sayısı ekranın üst bölümünde görüntülenir.',
            'Aktif çekiliş hediyesi ve bitiş süresi takip edilir.',
        ],
        image: wheelScreenImage,
        alt: 'QRakter Şans Çarkı ve toplam bilet görünümü',
    },
    {
        id: 'winners',
        label: 'Kazananlar',
        title: 'Aktif ve önceki çekiliş sonuçlarını inceleyin',
        description: 'Kazananlar alanında devam eden ve tamamlanan çekiliş bilgileri birlikte görüntülenir.',
        bullets: [
            'Aktif Çekiliş ve Önceki Çekiliş alanları bulunur.',
            'Aktif çekilişin hediyesi ve kalan süresi görüntülenir.',
            'Önceki çekilişlerde açıklanan sonuçlar incelenir.',
            'Kazanana e-posta üzerinden bilgilendirme yapılır.',
        ],
        image: winnersScreenImage,
        alt: 'QRakter aktif ve önceki çekiliş sonuçları',
    },
    {
        id: 'mini-games',
        label: 'Mini Oyunlar',
        title: 'Mini oyunlarla puanınızı yükseltin ve yeni haklar kazanın',
        description: 'Mini oyunlarda kullanıcı ilerlemesini ve kazanımlarını tek alandan takip edebilir.',
        bullets: [
            'Oyunlardan bilet, puan veya ek çark hakkı kazanılabilir.',
            'Günlük seri, görevler, puan, rekor ve sıralama takip edilir.',
            'Ödüllü günlük hak dolduğunda Pratik Oyna ile ödülsüz devam edilir.',
        ],
        image: miniGamesImage,
        alt: 'QRakter Mini Oyunlar, görevler ve puan görünümü',
    },
    {
        id: 'invitation',
        label: 'Davet',
        title: 'Arkadaşlarınızı davet ederek ek çark hakkı kazanma fırsatı',
        description: 'Profilim ekranındaki davet alanından kişiye özel kod paylaşılır ve kayıt durumu izlenir.',
        bullets: [
            'Davet kodu paylaşılır.',
            'Davet edilen kullanıcıların kayıtları takip edilir.',
            'Ödül kazandıran kayıt sayısı ayrıca görüntülenir.',
            'Uygun kayıt tamamlandığında ek çark hakkı kazanılabilir.',
        ],
        image: invitationScreenImage,
        alt: 'QRakter davet kodu ve davet istatistikleri',
    },
    {
        id: 'signature',
        label: 'İmza Kampanyaları',
        title: 'Toplumsal talepleri görüntüleyin ve desteğinizi gösterin',
        description: 'Profilim ekranındaki İmza Kampanyaları alanından yayınlanan kampanyalara ulaşılabilir.',
        bullets: [
            'Profilim ekranından İmza Kampanyaları alanına ulaşılır.',
            'Yayınlanan toplumsal talepler görüntülenir.',
            'İlgili kampanyalara destek olunabilir.',
            'Aktif kampanya yoksa “Şu an aktif imza kampanyası yok.” mesajı gösterilir.',
        ],
        image: signatureCampaignsImage,
        alt: 'QRakter İmza Kampanyaları aktif kampanya bulunmayan görünüm',
        categoryTag: 'KATILIM',
    },
]

function FeatureTabs({ tabs, activeTab, onChange, ariaLabel }) {
    return (
        <div className="feature-tabs" role="tablist" aria-label={ariaLabel}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    className={`feature-tab-trigger ${activeTab === tab.id ? 'is-active' : ''}`}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`${tab.id}-panel`}
                    id={`${tab.id}-tab`}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}

function PhonePreview({ image, alt, panelId, tabId }) {
    return (
        <div className="phone-preview-card" role="tabpanel" id={panelId} aria-labelledby={tabId}>
            {image ? (
                <img className="phone-preview-image" src={image} alt={alt} loading="lazy" decoding="async" />
            ) : (
                <div className="phone-preview-fallback" aria-hidden="true" />
            )}
        </div>
    )
}

function Features() {
    const [activeCoreTab, setActiveCoreTab] = useState(coreTabs[0].id)
    const [activeAccidentTab, setActiveAccidentTab] = useState(accidentTabs[0].id)
    const [activeCommunityTab, setActiveCommunityTab] = useState(communityTabs[0].id)
    const [activeRewardTab, setActiveRewardTab] = useState(rewardTabs[0].id)

    const selectedCoreTab = useMemo(() => coreTabs.find((item) => item.id === activeCoreTab) ?? coreTabs[0], [activeCoreTab])
    const selectedAccidentTab = useMemo(
        () => accidentTabs.find((item) => item.id === activeAccidentTab) ?? accidentTabs[0],
        [activeAccidentTab]
    )
    const selectedCommunityTab = useMemo(
        () => communityTabs.find((item) => item.id === activeCommunityTab) ?? communityTabs[0],
        [activeCommunityTab]
    )
    const selectedRewardTab = useMemo(() => rewardTabs.find((item) => item.id === activeRewardTab) ?? rewardTabs[0], [activeRewardTab])

    return (
        <section className="section features-section">
            <div className="container">
                <div id="ozellikler" className="section-head reveal">
                    <p className="eyebrow">ÖZELLİKLER</p>
                    <h2>QRakter’de ihtiyaç duyduğunuz bilgilere kolayca ulaşın</h2>
                    <p className="section-copy">
                        Ana sayfa, profil, QR Acil Durum Kartı, evraklar ve bildirimler; günlük kullanımda ihtiyaç duyulan
                        işlemlere hızlı ve düzenli erişim sağlar.
                    </p>
                </div>

                <div className="feature-intro-grid">
                    {introHighlights.map((item, i) => (
                        <article key={item.title} className="feature-intro-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>

                <article className="feature-hub-card reveal" aria-labelledby="ana-deneyim-baslik">
                    <div className="feature-hub-copy">
                        <p className="feature-kicker">ÖZELLİKLER</p>
                        <h3 id="ana-deneyim-baslik">{selectedCoreTab.title}</h3>
                        <p className="feature-description">{selectedCoreTab.description}</p>

                        <FeatureTabs
                            tabs={coreTabs}
                            activeTab={activeCoreTab}
                            onChange={setActiveCoreTab}
                            ariaLabel="Özellik sekmeleri"
                        />

                        <ul className="feature-points">
                            {selectedCoreTab.bullets.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>

                        {selectedCoreTab.detailCards ? (
                            <div className="profile-detail-grid" aria-label="Profilim ek alanları">
                                {selectedCoreTab.detailCards.map((item) => (
                                    <article key={item.title} className="profile-detail-card">
                                        <h4>{item.title}</h4>
                                        <p>{item.text}</p>
                                    </article>
                                ))}
                            </div>
                        ) : null}

                        {selectedCoreTab.infoBox ? <p className="feature-info-note">{selectedCoreTab.infoBox}</p> : null}
                    </div>

                    <div className="feature-hub-media">
                        <PhonePreview
                            image={selectedCoreTab.image}
                            alt={selectedCoreTab.alt}
                            panelId={`${selectedCoreTab.id}-panel`}
                            tabId={`${selectedCoreTab.id}-tab`}
                        />
                    </div>
                </article>

                <section
                    className="feature-group-card reveal anchor-target"
                    aria-labelledby="kaza-tutanagi-baslik">
                    <div id="kaza-tutanagi" className="feature-group-copy">
                        <p className="feature-kicker">KAZA TUTANAĞI</p>
                        <h3 id="kaza-tutanagi-baslik">Kaza tutanağı sürecini adım adım tamamlayın</h3>
                        <p className="feature-description">
                            Yeni bir tutanak başlatabilir, diğer sürücünün oluşturduğu tutanağa QR kodla katılabilir veya daha önce
                            oluşturduğunuz kayıtları görüntüleyebilirsiniz.
                        </p>

                        <FeatureTabs
                            tabs={accidentTabs}
                            activeTab={activeAccidentTab}
                            onChange={setActiveAccidentTab}
                            ariaLabel="Kaza tutanağı sekmeleri"
                        />

                        <h4 className="feature-subtitle">{selectedAccidentTab.title}</h4>
                        <p className="feature-description">{selectedAccidentTab.description}</p>

                        <ul className="feature-points">
                            {selectedAccidentTab.bullets.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="feature-group-media">
                        <PhonePreview
                            image={selectedAccidentTab.image}
                            alt={selectedAccidentTab.alt}
                            panelId={`${selectedAccidentTab.id}-panel`}
                            tabId={`${selectedAccidentTab.id}-tab`}
                        />
                    </div>
                </section>

                <section className="clubs-community-section reveal" aria-labelledby="kulupler-topluluklar-baslik">


                    <div className="clubs-community-grid">
                        <article id="kulupler" className="feature-group-card clubs-community-card" aria-labelledby="kulupler-baslik">
                            <div className="feature-group-copy clubs-community-card__content">
                                <p className="feature-kicker">KULÜPLER</p>
                                <h3 id="kulupler-baslik">Kulüplerinizi yönetin, yeni kulüpler keşfedin</h3>
                                <p className="feature-description">
                                    Alt menüdeki Kulüpler sekmesinden üye olduğunuz veya yönettiğiniz kulüplere ulaşabilir, yeni bir kulüp
                                    arayabilir ve kulüp başvurularınızı yönetebilirsiniz.
                                </p>

                                <ul className="feature-points">
                                    <li>Kulüplerim alanında kulüp adı, şehir, üye sayısı ve kullanıcının rolü görüntülenir.</li>
                                    <li>Kulübe Katıl seçeneğiyle kulüp adına göre arama yapılabilir ve kulüp detayı incelenebilir.</li>
                                    <li>
                                        Kulüp Oluştur alanından yeni kulüp başvurusu yapılabilir; Kulüp Başvurularım alanından başvurunun
                                        durumu takip edilebilir.
                                    </li>
                                    <li>
                                        Kulüp detayında hakkında bilgisi, kuruluş tarihi, konum, iletişim, duyurular ve geçmiş çekilişler
                                        görüntülenir.
                                    </li>
                                </ul>

                                <article className="clubs-community-detail-card">
                                    <h4>Kulüp Sahibi</h4>
                                    <p>
                                        Kulüp Sahibi etiketi, kullanıcının ilgili kulübü yönetebildiğini gösterir. Kulüp sahibi duyuru
                                        oluşturabilir, katılım isteklerini onaylayabilir veya reddedebilir ve kulüp çekilişlerini yönetebilir.
                                    </p>
                                </article>
                            </div>

                            <div className="feature-group-media clubs-community-card__visual">
                                <PhonePreview
                                    image={clubsScreenImage}
                                    alt="QRakter Kulüplerim listesi ve kulüp yönetimi"
                                    panelId="clubs-panel"
                                    tabId="kulupler-baslik"
                                />
                            </div>
                        </article>

                        <article id="topluluk" className="feature-group-card clubs-community-card" aria-labelledby="topluluk-baslik">
                            <div className="feature-group-copy clubs-community-card__content">
                                <p className="feature-kicker">TOPLULUK</p>
                                <h3 id="topluluk-baslik">Etkinliklere katılın, fotoğrafları değerlendirin</h3>
                                <p className="feature-description">
                                    Alt menüdeki Topluluk sekmesinden uygulamada yayınlanan etkinliklere ve etkinliklerde öne çıkan
                                    kullanıcıların sıralamasına ulaşabilirsiniz.
                                </p>

                                <FeatureTabs
                                    tabs={communityTabs}
                                    activeTab={activeCommunityTab}
                                    onChange={setActiveCommunityTab}
                                    ariaLabel="Topluluk sekmeleri"
                                />

                                <h4 className="feature-subtitle">{selectedCommunityTab.title}</h4>
                                <p className="feature-description">{selectedCommunityTab.description}</p>

                                <ul className="feature-points">
                                    {selectedCommunityTab.bullets.map((point) => (
                                        <li key={point}>{point}</li>
                                    ))}
                                </ul>

                                {selectedCommunityTab.note ? <p className="clubs-community-inline-note">{selectedCommunityTab.note}</p> : null}
                            </div>

                            <div className="feature-group-media clubs-community-card__visual">
                                <PhonePreview
                                    image={selectedCommunityTab.image}
                                    alt={selectedCommunityTab.alt}
                                    panelId={`${selectedCommunityTab.id}-panel`}
                                    tabId={`${selectedCommunityTab.id}-tab`}
                                />
                            </div>
                        </article>
                    </div>
                </section>

                <section className="feature-group-card reveal" aria-labelledby="oduller-baslik">
                    <div id="oduller" className="feature-group-copy">
                        <p className="feature-kicker">ÖDÜLLER VE KATILIM</p>
                        <h3 id="oduller-baslik">Çarkı çevirin, oyunlara katılın ve kazandığınız hakları takip edin</h3>

                        {activeRewardTab === 'signature' ? <span className="feature-category-pill">KATILIM</span> : null}

                        <FeatureTabs
                            tabs={rewardTabs}
                            activeTab={activeRewardTab}
                            onChange={setActiveRewardTab}
                            ariaLabel="Ödüller ve katılım sekmeleri"
                        />

                        <h4 className="feature-subtitle">{selectedRewardTab.title}</h4>
                        <p className="feature-description">{selectedRewardTab.description}</p>

                        <ul className="feature-points">
                            {selectedRewardTab.bullets.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="feature-group-media">
                        <PhonePreview
                            image={selectedRewardTab.image}
                            alt={selectedRewardTab.alt}
                            panelId={`${selectedRewardTab.id}-panel`}
                            tabId={`${selectedRewardTab.id}-tab`}
                        />
                    </div>
                </section>
            </div>
        </section>
    )
}

export default Features
