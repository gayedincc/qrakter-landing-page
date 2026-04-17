import { AndroidIcon, AppleIcon } from "./StoreIcons";

const ANDROID_DOWNLOAD_URL =
  "https://play.google.com/store/apps/details?id=com.everion.qrakter.app&pcampaignid=web_share";
const IOS_PREREGISTER_URL = "https://app.zayfix.com";
const ZAYFIX_INSTAGRAM_URL = "https://www.instagram.com/zayfix.tr/";

function HowItWorks() {
  return (
    <section id="zayfix-erisim" className="section how-section access-section">
      <div className="container">
        <article className="access-card reveal">
          <h3>Zayfix Qrakter’e kolayca ulaşın</h3>
          <p className="access-copy">
            Android uygulamasını hemen indirebilir, iOS için ön kayıt
            oluşturabilir veya web&apos;den erişerek Zayfix Qrakter deneyimine
            devam edebilirsiniz.
          </p>
          <p className="access-note">
            Zayfix Qrakter’i daha yakından görmek için Instagram&apos;da{" "}
            <a
              className="access-inline-link"
              href={ZAYFIX_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              @zayfix.tr
            </a>{" "}
            hesabına da göz atabilirsiniz.
          </p>

          <div
            className="feature-mini-grid access-download-grid"
            aria-label="Zayfix Qrakter erişim seçenekleri"
          >
            <article className="feature-mini-card access-download-card">
              <div className="access-card-head">
                <span className="access-platform-label">
                  <AndroidIcon className="access-platform-icon" />
                  <span>Android</span>
                </span>
              </div>
              <h4>Android için indir</h4>
              <p>
                Zayfix Qrakter’i Android uygulamasıyla keşfetmek için hemen
                indirin.
              </p>
              <a
                className={`btn btn-primary full-width${ANDROID_DOWNLOAD_URL ? "" : " is-disabled"}`}
                href={ANDROID_DOWNLOAD_URL || undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!ANDROID_DOWNLOAD_URL}
              >
                Android için indir
              </a>
            </article>

            <article className="feature-mini-card access-download-card">
              <div className="access-card-head">
                <span className="access-platform-label">
                  <AppleIcon className="access-platform-icon" />
                  <span>iOS</span>
                </span>
              </div>
              <h4>iOS için ön kayıt / Web’den erişim</h4>
              <p>
                iOS için ön kayıt oluşturabilir veya web’den erişerek Zayfix
                Qrakter’i hemen kullanabilirsiniz.
              </p>
              <a
                className={`btn btn-secondary full-width${IOS_PREREGISTER_URL ? "" : " is-disabled"}`}
                href={IOS_PREREGISTER_URL || undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!IOS_PREREGISTER_URL}
              >
                iOS için ön kayıt / Web’den erişim
              </a>
            </article>
          </div>
        </article>
      </div>
    </section>
  );
}

export default HowItWorks;
