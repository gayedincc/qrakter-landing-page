import StatusBadge from "./StatusBadge";
import styles from "../HaftalikUygulamaPage.module.css";
import { GIVEAWAY_CAMPAIGN_STATUS_LABELS } from "../../../../services/wheelGiveawayWebService";

function FieldLabel({ label, field }) {
  return (
    <span className={styles.fieldLabel}>
      <span>{label}</span>
      <small>{field}</small>
    </span>
  );
}

function Metric({ label, field, value }) {
  return (
    <div className={styles.metricItem}>
      <FieldLabel label={label} field={field} />
      <strong>{value}</strong>
    </div>
  );
}

function getStatusTone(status) {
  if (status === "active") return "success";
  if (status === "closed") return "warning";
  if (status === "drawn") return "info";
  if (status === "archived") return "muted";
  return "neutral";
}

function CampaignStatusCard({ campaign, formatDate }) {
  if (!campaign) {
    return (
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.kicker}>Kampanya Durumu</p>
            <h2>Aktif çekiliş bulunmuyor</h2>
          </div>
          <StatusBadge>Hazır</StatusBadge>
        </div>
        <p className={styles.emptyText}>
          Yeni çekilişi başlatarak varsayılan ödül ve çark dilimleriyle bir kampanya oluşturabilirsiniz.
        </p>
      </section>
    );
  }

  const isCompletedCampaign = campaign.status === "drawn" || campaign.status === "archived";
  const previewLabel = isCompletedCampaign
    ? "Kesinleşti"
    : campaign.status === "closed" && campaign.has_draw_preview
      ? "Onay Bekliyor"
      : "Ön Çekiliş Yok";

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.kicker}>Kampanya Durumu</p>
          <h2>{campaign.name}</h2>
          <p className={styles.description}>{campaign.description}</p>
        </div>
        <StatusBadge tone={getStatusTone(campaign.status)}>
          {GIVEAWAY_CAMPAIGN_STATUS_LABELS[campaign.status] ?? campaign.status}
        </StatusBadge>
      </div>

      <div className={styles.metricGrid}>
        <Metric label="Durum" field="status" value={GIVEAWAY_CAMPAIGN_STATUS_LABELS[campaign.status]} />
        <Metric label="Katılımcı Sayısı" field="participant_count" value={campaign.participant_count} />
        <Metric label="Ödül Sayısı" field="prize_count" value={campaign.prize_count} />
        <Metric label="Dilim Sayısı" field="segment_count" value={campaign.segment_count} />
        <Metric label="Kazanan Sayısı" field="winner_count" value={campaign.winner_count} />
        <Metric label="Ön Çekiliş Durumu" field="has_draw_preview" value={previewLabel} />
        <Metric
          label="Ön Çekiliş Tarihi"
          field="draw_preview_created_at"
          value={formatDate(campaign.draw_preview_created_at)}
        />
      </div>
    </section>
  );
}

export default CampaignStatusCard;
