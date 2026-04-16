import { AndroidIcon, AppleIcon } from "./StoreIcons";

const ANDROID_DOWNLOAD_URL =
  "https://play.google.com/store/apps/details?id=com.everion.qrakter.app&pcampaignid=web_share";
const IOS_PREREGISTER_URL = "https://app.zayfix.com";

function FloatingStoreButtons() {
  return (
    <div
      className="floating-store-buttons"
      aria-label="Uygulama erişim seçenekleri"
    >
      <a
        className="btn floating-store-btn is-android"
        href={ANDROID_DOWNLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <AndroidIcon className="floating-store-icon" />
        <span>Android için indir</span>
      </a>

      <a
        className="btn floating-store-btn is-ios"
        href={IOS_PREREGISTER_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <AppleIcon className="floating-store-icon" />
        <span>iOS ön kayıt / Web'den erişim</span>
      </a>
    </div>
  );
}

export default FloatingStoreButtons;
