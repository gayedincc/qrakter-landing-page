import styles from "./WeeklyGiveawaySubNav.module.css";

const NAV_ITEMS = [
  {
    label: "Genel Bakış",
    path: "/panel/cekilis/haftalik-uygulama",
    isActive: (pathname) => pathname === "/panel/cekilis/haftalik-uygulama",
  },
  {
    label: "Ayarlar",
    path: "/panel/cekilis/haftalik-uygulama/ayarlar",
    isActive: (pathname) => pathname.startsWith("/panel/cekilis/haftalik-uygulama/ayarlar"),
  },
  {
    label: "Çekilişler",
    path: "/panel/cekilis/haftalik-uygulama/cekilisler",
    isActive: (pathname) => pathname.startsWith("/panel/cekilis/haftalik-uygulama/cekilisler"),
  },
  {
    label: "Sonuçlandırma",
    path: "/panel/cekilis/haftalik-uygulama/sonuclandir",
    isActive: (pathname) => pathname.startsWith("/panel/cekilis/haftalik-uygulama/sonuclandir"),
  },
  {
    label: "Kazananlar",
    path: "/panel/cekilis/haftalik-uygulama/kazananlar",
    isActive: (pathname) =>
      pathname.startsWith("/panel/cekilis/haftalik-uygulama/kazananlar") ||
      pathname.startsWith("/panel/cekilis/haftalik-uygulama/son-kazananlar"),
  },
];

function WeeklyGiveawaySubNav({ onNavigate }) {
  const pathname = typeof window === "undefined" ? "" : window.location.pathname.replace(/\/+$/, "");

  const navigateTo = (path) => {
    if (typeof onNavigate === "function") {
      onNavigate(path);
      return;
    }

    window.location.assign(path);
  };

  return (
    <nav className={styles.subNav} aria-label="Haftalık çekiliş menüsü">
      <div className={styles.navScroller}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.isActive(pathname);

          return (
            <button
              key={item.path}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              type="button"
              onClick={() => navigateTo(item.path)}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default WeeklyGiveawaySubNav;
