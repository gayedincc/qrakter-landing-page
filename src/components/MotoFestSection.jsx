import { AndroidIcon, AppleIcon } from "./StoreIcons";
import hediyeGorseli from "../assets/zayfix-hediye.jpg";

const ANDROID_DOWNLOAD_URL =
  "https://play.google.com/store/apps/details?id=com.everion.qrakter.app&pcampaignid=web_share";
const IOS_PREREGISTER_URL = "https://app.zayfix.com";
const ZAYFIX_INSTAGRAM_URL =
  "https://www.instagram.com/zayfix.tr?igsh=MWxoeDh6ZGx3dHQ4cA==";

function MotoFestSection() {
  return (
    <section id="cekilise-katil" className="section motofest-section">
      <div className="container">
        <div className="motofest-grid">
          <article className="motofest-copy-card reveal">
            <p className="eyebrow">Motobike İstanbul 2026</p>
            <h2>Hediyeni kazanma fırsatını kaçırma!</h2>
            <p>
              İstanbul Fuar Merkezi’nde Motobike İstanbul etkinliğinde QRAKTER standına
              uğrayın, uygulamayı indirip kaydını tamamlayın. Ardından
              {" "}
              <a
                className="campaign-inline-link"
                href={ZAYFIX_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Zayfix Instagram hesabını
              </a>
              {" "}
              takip edip son gönderiyi beğenerek katılım şartlarını tamamlayın.
            </p>

            <div className="motofest-prize-card" aria-label="Hediye detayı">
              <img src={hediyeGorseli} alt="Hediye ürünü KNMaster KN1600CPRO interkom seti" />
              <div>
                <strong>KNMaster KN1600CPRO</strong>
                <p>2K kameralı motosiklet interkom seti - 4 kişiye hediye!</p>
              </div>
            </div>

            <ul className="motofest-note-list" aria-label="Hediye koşulları">
              <li>Uygulamayı indirip kayıt olan ve Instagram katılım şartlarını sağlayan kullanıcılar arasından 4 kişi seçilecektir.</li>
              <li>Katılım için Zayfix Instagram hesabını takip etmek ve son gönderiyi beğenmek gereklidir.</li>
              <li>Hediye, katılım şartlarını sağlayan kullanıcılar arasından belirlenecektir.</li>
              <li>22 - 25 Nisan 2026 • İstanbul Fuar Merkezi • 10:00 - 19:00</li>
            </ul>

            <div className="motofest-actions">
              <a
                className="btn btn-primary"
                href={ANDROID_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AndroidIcon className="motofest-platform-icon" />
                Android için indir
              </a>
              <a
                className="btn btn-secondary"
                href={IOS_PREREGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AppleIcon className="motofest-platform-icon" />
                iOS ön kayıt / Web&apos;den erişim
              </a>
              <a
                className="btn btn-instagram"
                href={ZAYFIX_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Zayfix Instagram Sayfası"
              >
                Zayfix Instagram
              </a>
            </div>
          </article>

          <article className="motofest-reel-card reveal" aria-label="Motobike İstanbul reels videosu">
            <p className="motofest-reel-label">INSTAGRAM</p>
            <div className="reel-clickwrap">
              <iframe
                src="https://www.instagram.com/reel/DWde-neDBrc/embed"
                title="Motobike İstanbul Instagram Reels"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                loading="lazy"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default MotoFestSection;
