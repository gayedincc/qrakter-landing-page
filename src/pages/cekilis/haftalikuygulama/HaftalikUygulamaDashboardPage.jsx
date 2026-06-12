import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GIVEAWAY_CAMPAIGN_STATUS_LABELS,
  listGiveawayCampaigns,
  listGiveawayParticipants,
  startGiveawayCampaignFromDefaults,
} from "../../../services/wheelGiveawayWebService";
import WeeklyGiveawaySubNav from "./components/WeeklyGiveawaySubNav";
import styles from "./HaftalikUygulamaDashboardPage.module.css";

const RESULT_ROUTE = "/panel/cekilis/haftalik-uygulama/sonuclandir";
const CAMPAIGNS_ROUTE = "/panel/cekilis/haftalik-uygulama/cekilisler";

const PARTICIPANT_COUNT_KEYS = ["participant_count", "total_participants", "participants_count"];
const SPIN_COUNT_KEYS = ["spin_count", "total_spins", "total_spin_count"];
const TICKET_COUNT_KEYS = ["total_tickets", "ticket_count"];
const WINNER_COUNT_KEYS = ["winner_count", "winners_count"];

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function toIsoDateValue(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getNumberValue(source, keys) {
  for (const key of keys) {
    const value = source?.[key];

    if (value === null || value === undefined || value === "") {
      continue;
    }

    const numberValue = Number(value);

    if (Number.isFinite(numberValue)) {
      return numberValue;
    }
  }

  return null;
}

function getTextValue(source, keys, fallback = "-") {
  for (const key of keys) {
    const value = source?.[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return fallback;
}

function getCampaignId(campaign) {
  return campaign?.id ?? campaign?.pk;
}

function sumParticipantValues(participants, keys) {
  return participants.reduce((total, participant) => {
    return total + (getNumberValue(participant, keys) ?? 0);
  }, 0);
}

function sumCampaignCounts(campaigns, keys) {
  let hasAnyValue = false;
  const total = campaigns.reduce((sum, campaign) => {
    const value = getNumberValue(campaign, keys);

    if (value === null) {
      return sum;
    }

    hasAnyValue = true;
    return sum + value;
  }, 0);

  return hasAnyValue ? total : null;
}

function selectOngoingCampaign(campaigns) {
  const activeCampaign = campaigns.find((campaign) => campaign.status === "active");
  const closedCampaign = campaigns.find((campaign) => campaign.status === "closed");

  return activeCampaign || closedCampaign || null;
}

function shouldLoadParticipants(campaign) {
  if (!getCampaignId(campaign) || (campaign.status !== "active" && campaign.status !== "closed")) {
    return false;
  }

  return (
    getNumberValue(campaign, PARTICIPANT_COUNT_KEYS) === null ||
    getNumberValue(campaign, SPIN_COUNT_KEYS) === null ||
    getNumberValue(campaign, TICKET_COUNT_KEYS) === null
  );
}

function getCampaignName(campaign) {
  return (
    getTextValue(campaign, ["name", "title", "campaign_name"], "") ||
    (campaign?.id ? `Kampanya #${campaign.id}` : "Haftalık çekiliş kampanyası")
  );
}

function getStatusClass(status) {
  if (status === "active") return styles.statusBadgeActive;
  if (status === "closed") return styles.statusBadgeClosed;
  return "";
}

function getCampaignMetrics(campaign, participants, hasLoadedParticipants) {
  if (!campaign) {
    return {
      participantCount: null,
      spinCount: null,
      ticketCount: null,
      winnerCount: null,
    };
  }

  const participantCount =
    getNumberValue(campaign, PARTICIPANT_COUNT_KEYS) ??
    (hasLoadedParticipants ? participants.length : null);
  const spinCount =
    getNumberValue(campaign, SPIN_COUNT_KEYS) ??
    (hasLoadedParticipants ? sumParticipantValues(participants, ["spin_count"]) : null);
  const ticketCount =
    getNumberValue(campaign, TICKET_COUNT_KEYS) ??
    (hasLoadedParticipants ? sumParticipantValues(participants, TICKET_COUNT_KEYS) : null);

  return {
    participantCount,
    spinCount,
    ticketCount,
    winnerCount: getNumberValue(campaign, WINNER_COUNT_KEYS),
  };
}

function getLatestDrawDate(campaigns) {
  const latestTimestamp = campaigns.reduce((latest, campaign) => {
    const value = campaign.drawn_at;

    if (!value) {
      return latest;
    }

    const timestamp = new Date(value).getTime();

    if (Number.isNaN(timestamp)) {
      return latest;
    }

    return Math.max(latest, timestamp);
  }, 0);

  return latestTimestamp ? formatDate(latestTimestamp) : "-";
}

function formatMetric(value) {
  return value === null || value === undefined ? "-" : `${value}`;
}

function buildStats(campaigns, ongoingCampaign, ongoingMetrics) {
  const totalParticipants =
    sumCampaignCounts(campaigns, PARTICIPANT_COUNT_KEYS) ??
    (ongoingCampaign ? ongoingMetrics.participantCount : null);
  const totalSpins =
    sumCampaignCounts(campaigns, SPIN_COUNT_KEYS) ??
    (ongoingCampaign ? ongoingMetrics.spinCount : null);
  const totalTickets =
    sumCampaignCounts(campaigns, TICKET_COUNT_KEYS) ??
    (ongoingCampaign ? ongoingMetrics.ticketCount : null);

  return [
    { label: "Toplam çekiliş sayısı", value: campaigns.length },
    { label: "Aktif çekiliş var mı?", value: campaigns.some((campaign) => campaign.status === "active") ? "Var" : "Yok" },
    { label: "Kapalı çekiliş sayısı", value: campaigns.filter((campaign) => campaign.status === "closed").length },
    {
      label: "Tamamlanan çekiliş sayısı",
      value: campaigns.filter((campaign) => campaign.status === "drawn" || campaign.status === "archived").length,
    },
    { label: "Toplam katılımcı sayısı", value: formatMetric(totalParticipants) },
    { label: "Toplam spin sayısı", value: formatMetric(totalSpins) },
    { label: "Toplam bilet sayısı", value: formatMetric(totalTickets) },
    { label: "Toplam kazanan sayısı", value: formatMetric(sumCampaignCounts(campaigns, WINNER_COUNT_KEYS)) },
    { label: "Son çekiliş tarihi", value: getLatestDrawDate(campaigns) },
  ];
}

function getFriendlyErrorMessage(error) {
  const message = error?.message || "İşlem şu anda tamamlanamadı.";
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("no_active_default_prizes")) {
    return "Varsayılan ödül bulunamadı. Backend/Django Admin tarafında aktif varsayılan ödül eklenmesi gerekiyor.";
  }

  if (normalizedMessage.includes("no_active_default_segments")) {
    return "Varsayılan çark dilimi bulunamadı. Backend/Django Admin tarafında aktif varsayılan segment eklenmesi gerekiyor.";
  }

  return message;
}

function HaftalikUygulamaDashboardPage({ onNavigate }) {
  const [campaigns, setCampaigns] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [hasLoadedParticipants, setHasLoadedParticipants] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    endsAt: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const ongoingCampaign = useMemo(() => selectOngoingCampaign(campaigns), [campaigns]);
  const ongoingMetrics = useMemo(
    () => getCampaignMetrics(ongoingCampaign, participants, hasLoadedParticipants),
    [ongoingCampaign, participants, hasLoadedParticipants]
  );
  const stats = useMemo(
    () => buildStats(campaigns, ongoingCampaign, ongoingMetrics),
    [campaigns, ongoingCampaign, ongoingMetrics]
  );
  const ongoingCampaignId = getCampaignId(ongoingCampaign);
  const canStartCampaign = !ongoingCampaign;

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextCampaigns = normalizeArray(await listGiveawayCampaigns());
      const nextOngoingCampaign = selectOngoingCampaign(nextCampaigns);
      let nextParticipants = [];
      let nextHasLoadedParticipants = false;

      if (shouldLoadParticipants(nextOngoingCampaign)) {
        nextParticipants = normalizeArray(await listGiveawayParticipants(getCampaignId(nextOngoingCampaign)));
        nextHasLoadedParticipants = true;
      }

      setCampaigns(nextCampaigns);
      setParticipants(nextParticipants);
      setHasLoadedParticipants(nextHasLoadedParticipants);
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleStartCampaign = async (event) => {
    event.preventDefault();

    if (!canStartCampaign) {
      return;
    }

    const endDateValue = toIsoDateValue(formValues.endsAt);

    if (!formValues.endsAt) {
      setErrorMessage("Bitiş tarihi zorunludur.");
      setToastMessage("");
      return;
    }

    if (!endDateValue) {
      setErrorMessage("Bitiş tarihi geçerli bir tarih olmalıdır.");
      setToastMessage("");
      return;
    }

    setIsStarting(true);
    setErrorMessage("");
    setToastMessage("");

    try {
      const name = formValues.name.trim();
      const description = formValues.description.trim();
      const payload = {
        name,
        description,
        activate: true,
        ends_at: endDateValue,
      };

      await startGiveawayCampaignFromDefaults(payload);

      setIsStartModalOpen(false);
      setFormValues({ name: "", description: "", endsAt: "" });
      setToastMessage("Yeni çekiliş başlatıldı.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setIsStarting(false);
    }
  };

  const navigateTo = (path) => {
    if (typeof onNavigate === "function") {
      onNavigate(path);
      return;
    }

    window.location.assign(path);
  };

  return (
    <section className="section">
      <div className={`container ${styles.pageShell}`}>
        <div className={styles.pageHeader}>
          <div>
            <p className="eyebrow">QRakter Panel</p>
            <h1>Haftalık Uygulama Çekilişi</h1>
            <p>
              Aktif çekilişi, kampanyaları, ayarları ve sonuçlandırma akışını bu panelden yönetin.
            </p>
          </div>

        </div>

        <WeeklyGiveawaySubNav onNavigate={onNavigate} />

        {toastMessage ? (
          <div className={styles.toast} role="status">
            {toastMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className={styles.errorBanner} role="alert">
            {errorMessage}
          </div>
        ) : null}

        <section className={styles.panel}>
          <div className={styles.campaignHeader}>
            <div className={styles.campaignTitle}>
              <p className="eyebrow">Aktif Kampanya</p>
              <h2>{ongoingCampaign ? getCampaignName(ongoingCampaign) : "Aktif çekiliş bulunmuyor."}</h2>
              {ongoingCampaign ? (
                <span className={`${styles.statusBadge} ${getStatusClass(ongoingCampaign.status)}`}>
                  {GIVEAWAY_CAMPAIGN_STATUS_LABELS[ongoingCampaign.status] || ongoingCampaign.status || "-"}
                </span>
              ) : (
                <p className={styles.emptyCopy}>Yeni çekiliş başlatabilirsiniz.</p>
              )}
            </div>
          </div>

          {isLoading ? (
            <p className={styles.loadingText}>Haftalık çekiliş dashboard'u yükleniyor...</p>
          ) : !ongoingCampaign ? (
            <div className={styles.emptyCampaignActions}>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setIsStartModalOpen(true)}
                disabled={!canStartCampaign}
              >
                + Yeni Çekiliş Başlat
              </button>
            </div>
          ) : (
            <>
              <div className={styles.metricGrid}>
                <div className={styles.metricItem}>
                  <span>Başlangıç / aktif olma tarihi</span>
                  <strong>{formatDate(ongoingCampaign?.activated_at || ongoingCampaign?.starts_at || ongoingCampaign?.created_at)}</strong>
                </div>
                <div className={styles.metricItem}>
                  <span>Bitiş Tarihi</span>
                  <strong>{formatDate(ongoingCampaign?.ends_at || ongoingCampaign?.end_date || ongoingCampaign?.finish_at)}</strong>
                </div>
                <div className={styles.metricItem}>
                  <span>Kapanış tarihi</span>
                  <strong>{formatDate(ongoingCampaign?.closed_at)}</strong>
                </div>
                <div className={styles.metricItem}>
                  <span>Çekiliş tarihi</span>
                  <strong>{formatDate(ongoingCampaign?.drawn_at)}</strong>
                </div>
                <div className={styles.metricItem}>
                  <span>Katılımcı sayısı</span>
                  <strong>{formatMetric(ongoingMetrics.participantCount)}</strong>
                </div>
                <div className={styles.metricItem}>
                  <span>Toplam spin</span>
                  <strong>{formatMetric(ongoingMetrics.spinCount)}</strong>
                </div>
                <div className={styles.metricItem}>
                  <span>Toplam bilet</span>
                  <strong>{formatMetric(ongoingMetrics.ticketCount)}</strong>
                </div>
                <div className={styles.metricItem}>
                  <span>Kazanan sayısı</span>
                  <strong>{formatMetric(ongoingMetrics.winnerCount)}</strong>
                </div>
                <div className={styles.metricItem}>
                  <span>Ön çekiliş</span>
                  <strong>{ongoingCampaign ? (ongoingCampaign.has_draw_preview ? "Var" : "Yok") : "-"}</strong>
                </div>
              </div>

              <div className={styles.campaignActions}>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => navigateTo(`${CAMPAIGNS_ROUTE}/${ongoingCampaignId}`)}
                  disabled={!ongoingCampaignId}
                >
                  Detay
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => navigateTo(`${CAMPAIGNS_ROUTE}/${ongoingCampaignId}/duzenle`)}
                  disabled={!ongoingCampaignId}
                >
                  Düzenle
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => navigateTo(RESULT_ROUTE)}
                  disabled={!ongoingCampaign}
                >
                  Çekilişi Sonuçlandır
                </button>
              </div>
            </>
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>İstatistikler</h2>
          </div>
          <div className={styles.metricGrid}>
            {stats.map((stat) => (
              <div className={styles.metricItem} key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      {isStartModalOpen ? (
        <div className={styles.modalBackdrop} role="presentation" onClick={() => setIsStartModalOpen(false)}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="start-campaign-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 id="start-campaign-title">Yeni Çekiliş Başlat</h2>
              <button
                className={styles.iconButton}
                type="button"
                onClick={() => setIsStartModalOpen(false)}
                disabled={isStarting}
                aria-label="Kapat"
              >
                ×
              </button>
            </div>

            <form className={styles.form} onSubmit={handleStartCampaign}>
              <div className={styles.field}>
                <label htmlFor="campaign-name">Kampanya adı</label>
                <input
                  id="campaign-name"
                  name="name"
                  type="text"
                  value={formValues.name}
                  onChange={handleInputChange}
                  disabled={isStarting}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="campaign-description">Açıklama</label>
                <textarea
                  id="campaign-description"
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  disabled={isStarting}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="campaign-ends-at">Bitiş tarihi</label>
                <input
                  id="campaign-ends-at"
                  name="endsAt"
                  type="datetime-local"
                  value={formValues.endsAt}
                  onChange={handleInputChange}
                  required
                  disabled={isStarting}
                />
                <p className={styles.helperText}>Bitiş tarihi çekiliş başlatılırken backend'e gönderilir.</p>
              </div>

              <div className={styles.modalActions}>
                <button className="btn btn-secondary" type="button" onClick={() => setIsStartModalOpen(false)} disabled={isStarting}>
                  Vazgeç
                </button>
                <button className="btn btn-primary" type="submit" disabled={isStarting}>
                  {isStarting ? "Başlatılıyor..." : "Başlat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default HaftalikUygulamaDashboardPage;
