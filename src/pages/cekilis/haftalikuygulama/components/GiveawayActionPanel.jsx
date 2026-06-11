import styles from "../HaftalikUygulamaPage.module.css";

const ACTIONS = {
  start: "Yeni Çekilişi Başlat",
  close: "Aktif Kampanyayı Kapat",
  preview: "Çekiliş Sonucunu Önizle",
  confirm: "Sonucu Onayla ve Mail Gönder",
  refresh: "Ön Sonucu Yenile",
  cancel: "Ön Sonucu İptal Et",
};

function getVisibleActions(campaign) {
  if (!campaign) return ["start"];

  if (campaign.status === "active") return ["close"];

  if (campaign.status === "closed" && !campaign.has_draw_preview) {
    return ["preview"];
  }

  if (campaign.status === "closed" && campaign.has_draw_preview) {
    return ["confirm", "refresh", "cancel"];
  }

  if (campaign.status === "drawn" || campaign.status === "archived") {
    return ["start"];
  }

  return ["start"];
}

function GiveawayActionPanel({ campaign, actionLoading, onAction }) {
  const visibleActions = getVisibleActions(campaign);

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.kicker}>Operasyonlar</p>
          <h2>Duruma göre aksiyonlar</h2>
        </div>
      </div>

      <div className={styles.actionGrid}>
        {visibleActions.map((actionKey) => (
          <button
            className={`btn ${actionKey === "confirm" ? "btn-primary" : "btn-secondary"} ${styles.actionButton} ${
              actionLoading ? "is-disabled" : ""
            }`}
            key={actionKey}
            type="button"
            disabled={Boolean(actionLoading)}
            aria-busy={actionLoading === actionKey}
            onClick={() => onAction(actionKey)}
          >
            {actionLoading === actionKey ? "İşleniyor..." : ACTIONS[actionKey]}
          </button>
        ))}
      </div>
    </section>
  );
}

export default GiveawayActionPanel;
