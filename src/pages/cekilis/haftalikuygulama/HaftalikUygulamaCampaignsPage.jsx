import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GIVEAWAY_CAMPAIGN_STATUS_LABELS,
  listGiveawayCampaigns,
} from "../../../services/wheelGiveawayWebService";
import WeeklyGiveawaySubNav from "./components/WeeklyGiveawaySubNav";
import styles from "./HaftalikUygulamaCampaignsPage.module.css";

const DASHBOARD_ROUTE = "/panel/cekilis/haftalik-uygulama";
const CAMPAIGN_BASE_ROUTE = "/panel/cekilis/haftalik-uygulama/cekilisler";

const STATUS_FILTERS = [
  { label: "Tümü", value: "all" },
  { label: "Aktif", value: "active" },
  { label: "Kapalı", value: "closed" },
  { label: "Çekiliş Yapıldı", value: "drawn" },
  { label: "Arşivlendi", value: "archived" },
  { label: "Hazırlık", value: "draft" },
];

const PARTICIPANT_COUNT_KEYS = ["participant_count", "total_participants", "participants_count"];
const SPIN_COUNT_KEYS = ["spin_count", "total_spins", "total_spin_count"];
const WINNER_COUNT_KEYS = ["winner_count", "winners_count"];

function normalizeCollection(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.results)) return value.data.results;
  return [];
}

function getNumberValue(source, keys) {
  for (const key of keys) {
    const value = source?.[key];
    const numberValue = Number(value);

    if (value !== null && value !== undefined && value !== "" && Number.isFinite(numberValue)) {
      return numberValue;
    }
  }

  return null;
}

function getCampaignId(campaign) {
  return campaign?.id ?? campaign?.pk;
}

function getCampaignName(campaign) {
  return campaign?.name || campaign?.title || campaign?.campaign_name || `Kampanya #${getCampaignId(campaign) || "-"}`;
}

function getCampaignDescription(campaign) {
  return campaign?.description || campaign?.summary || "";
}

function formatMetric(value) {
  return value === null || value === undefined ? "-" : `${value}`;
}

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

function getStatusClass(status) {
  if (status === "active") return styles.statusBadgeActive;
  if (status === "closed") return styles.statusBadgeClosed;
  if (status === "archived" || status === "draft") return styles.statusBadgeMuted;
  return "";
}

function StatusBadge({ status }) {
  return (
    <span className={`${styles.statusBadge} ${getStatusClass(status)}`}>
      {GIVEAWAY_CAMPAIGN_STATUS_LABELS[status] || status || "-"}
    </span>
  );
}

function HaftalikUygulamaCampaignsPage({ onNavigate }) {
  const [campaigns, setCampaigns] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const filteredCampaigns = useMemo(() => {
    if (activeFilter === "all") {
      return campaigns;
    }

    return campaigns.filter((campaign) => campaign.status === activeFilter);
  }, [activeFilter, campaigns]);

  const navigateTo = (path) => {
    if (typeof onNavigate === "function") {
      onNavigate(path);
      return;
    }

    window.location.assign(path);
  };

  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await listGiveawayCampaigns();
      setCampaigns(normalizeCollection(response));
    } catch (error) {
      setErrorMessage(error?.message || "Çekilişler şu anda yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  return (
    <section className="section">
      <div className={`container ${styles.pageShell}`}>
        <div className={styles.pageHeader}>
          <div>
            <p className="eyebrow">Haftalık Uygulama Çekilişi</p>
            <h1>Çekilişler</h1>
            <p>Aktif, kapalı, tamamlanan ve arşivlenen tüm haftalık uygulama çekilişlerini görüntüleyin.</p>
          </div>

          <button className="btn btn-secondary" type="button" onClick={() => navigateTo(DASHBOARD_ROUTE)}>
            ← Haftalık Çekiliş Paneline Dön
          </button>
        </div>

        <WeeklyGiveawaySubNav onNavigate={onNavigate} />

        {errorMessage ? (
          <div className={styles.errorBanner} role="alert">
            {errorMessage}
          </div>
        ) : null}

        <section className={styles.panel}>
          <div className={styles.filterBar} role="toolbar" aria-label="Durum filtresi">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                className={`${styles.filterButton} ${activeFilter === filter.value ? styles.filterButtonActive : ""}`}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className={styles.loadingText}>Çekilişler yükleniyor...</p>
          ) : filteredCampaigns.length ? (
            <div className={`${styles.tableScroll} ${styles.campaignTableWrap}`}>
              <table className={`${styles.dataTable} ${styles.campaignTable}`}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Çekiliş</th>
                    <th>Durum</th>
                    <th>Tarih</th>
                    <th>Katılımcı</th>
                    <th>Spin</th>
                    <th>Kazanan</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((campaign) => {
                    const campaignId = getCampaignId(campaign);
                    const isActive = campaign.status === "active";
                    const campaignDescription = getCampaignDescription(campaign);

                    return (
                      <tr key={campaignId}>
                        <td data-label="ID" className={styles.idCell}>
                          {campaignId || "-"}
                        </td>
                        <td data-label="Çekiliş">
                          <div className={styles.campaignCell}>
                            <strong>{getCampaignName(campaign)}</strong>
                            <span>ID: {campaignId || "-"}</span>
                            {campaignDescription ? <p>{campaignDescription}</p> : null}
                          </div>
                        </td>
                        <td data-label="Durum">
                          <StatusBadge status={campaign.status} />
                        </td>
                        <td data-label="Tarih">
                          <div className={styles.dateStack}>
                            <span>
                              <strong>Başlangıç:</strong>{" "}
                              {formatDate(campaign.created_at || campaign.activated_at || campaign.starts_at)}
                            </span>
                            <span>
                              <strong>Bitiş:</strong>{" "}
                              {formatDate(campaign.ends_at || campaign.end_date || campaign.finish_at)}
                            </span>
                            <span>
                              <strong>Çekiliş:</strong> {formatDate(campaign.drawn_at)}
                            </span>
                          </div>
                        </td>
                        <td data-label="Katılımcı" className={styles.metricCell}>
                          {formatMetric(getNumberValue(campaign, PARTICIPANT_COUNT_KEYS))}
                        </td>
                        <td data-label="Spin" className={styles.metricCell}>
                          {formatMetric(getNumberValue(campaign, SPIN_COUNT_KEYS))}
                        </td>
                        <td data-label="Kazanan" className={styles.metricCell}>
                          {formatMetric(getNumberValue(campaign, WINNER_COUNT_KEYS))}
                        </td>
                        <td data-label="İşlemler">
                          <div className={styles.rowActions}>
                            {isActive ? (
                              <button
                                className="btn btn-secondary"
                                type="button"
                                onClick={() => navigateTo(`${CAMPAIGN_BASE_ROUTE}/${campaignId}/duzenle`)}
                                disabled={!campaignId}
                              >
                                Düzenle
                              </button>
                            ) : (
                              <button
                                className="btn btn-secondary"
                                type="button"
                                onClick={() => navigateTo(`${CAMPAIGN_BASE_ROUTE}/${campaignId}`)}
                                disabled={!campaignId}
                              >
                                Detay
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <strong>Gösterilecek çekiliş bulunmuyor.</strong>
              <p>Seçili filtrede kampanya yok.</p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default HaftalikUygulamaCampaignsPage;
