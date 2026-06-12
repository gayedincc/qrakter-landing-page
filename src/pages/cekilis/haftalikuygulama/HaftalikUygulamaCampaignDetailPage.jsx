import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GIVEAWAY_CAMPAIGN_STATUS_LABELS,
  closeGiveawayCampaign,
  getGiveawayCampaign,
  listCampaignPrizes,
  listCampaignSegments,
  listGiveawayParticipants,
  listGiveawayWinners,
} from "../../../services/wheelGiveawayWebService";
import WeeklyGiveawaySubNav from "./components/WeeklyGiveawaySubNav";
import styles from "./HaftalikUygulamaCampaignsPage.module.css";

const CAMPAIGNS_ROUTE = "/panel/cekilis/haftalik-uygulama/cekilisler";
const RESULT_ROUTE = "/panel/cekilis/haftalik-uygulama/sonuclandir";
const PARTICIPANT_PAGE_SIZE_OPTIONS = [25, 50, 100];

function normalizeCollection(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.results)) return value.data.results;
  return [];
}

function getCampaignId(campaign) {
  return campaign?.id ?? campaign?.pk;
}

function getUserId(item) {
  return item?.user_id ?? item?.user?.id ?? item?.user?.pk ?? item?.id ?? "-";
}

function getUserName(item) {
  return item?.user_name || item?.user?.full_name || item?.user?.username || item?.display_name || "-";
}

function getUserEmail(item) {
  return item?.user_email || item?.user?.email || "-";
}

function getUserPhone(item) {
  return item?.user_phone_number || item?.user?.phone_number || item?.telefon || "-";
}

function getParticipantSearchText(item) {
  return [
    item?.user_id,
    item?.id,
    item?.user?.id,
    item?.user_name,
    item?.display_name,
    item?.full_name,
    item?.user?.full_name,
    item?.user?.username,
    item?.user_email,
    item?.email,
    item?.user?.email,
    item?.user_phone_number,
    item?.phone_number,
    item?.user?.phone_number,
  ]
    .filter((value) => value !== null && value !== undefined)
    .join(" ")
    .toLocaleLowerCase("tr-TR");
}

function getCampaignName(campaign) {
  return campaign?.name || campaign?.title || campaign?.campaign_name || `Kampanya #${getCampaignId(campaign) || "-"}`;
}

function getItemId(item) {
  return item?.id ?? item?.pk ?? "-";
}

function getPrizeName(item) {
  return item?.name || item?.title || item?.prize_name || item?.label || "-";
}

function getSegmentLabel(item) {
  return item?.label || item?.name || item?.title || item?.text || "-";
}

function getDisplayValue(value) {
  return value === null || value === undefined || value === "" ? "-" : value;
}

function formatBoolean(value) {
  if (value === true) return "Aktif";
  if (value === false) return "Pasif";
  return "-";
}

function numberOrZero(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
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

function CampaignItemsTable({ emptyMessage, footer, headerMeta, headerTools, items, title, columns, renderRow }) {
  return (
    <section className={styles.panel}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>{title}</h2>
          {headerMeta ? <p>{headerMeta}</p> : null}
        </div>
        {headerTools || null}
      </div>

      {items.length ? (
        <div className={styles.tableScroll}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>{items.map(renderRow)}</tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <strong>{emptyMessage}</strong>
        </div>
      )}
      {footer ? <div className={styles.tableFooter}>{footer}</div> : null}
    </section>
  );
}

function HaftalikUygulamaCampaignDetailPage({ campaignId, onNavigate }) {
  const [campaign, setCampaign] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [campaignPrizes, setCampaignPrizes] = useState([]);
  const [campaignSegments, setCampaignSegments] = useState([]);
  const [participantSearchInput, setParticipantSearchInput] = useState("");
  const [participantSearchTerm, setParticipantSearchTerm] = useState("");
  const [participantPage, setParticipantPage] = useState(1);
  const [participantPageSize, setParticipantPageSize] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const metrics = useMemo(() => {
    const totalSpins = participants.reduce((sum, item) => {
      return sum + numberOrZero(item.spin_count || item.total_spins);
    }, 0);
    const totalTickets = participants.reduce((sum, item) => {
      return sum + numberOrZero(item.total_tickets || item.ticket_count);
    }, 0);

    return {
      totalParticipants: participants.length,
      totalSpins,
      totalTickets,
      winnerCount: winners.length,
    };
  }, [participants, winners]);

  const filteredParticipants = useMemo(() => {
    const normalizedTerm = participantSearchTerm.trim().toLocaleLowerCase("tr-TR");

    if (!normalizedTerm) {
      return participants;
    }

    return participants.filter((participant) => {
      return getParticipantSearchText(participant).includes(normalizedTerm);
    });
  }, [participantSearchTerm, participants]);

  const participantPageCount = Math.max(1, Math.ceil(filteredParticipants.length / participantPageSize));
  const paginatedParticipants = useMemo(() => {
    const startIndex = (participantPage - 1) * participantPageSize;

    return filteredParticipants.slice(startIndex, startIndex + participantPageSize);
  }, [filteredParticipants, participantPage, participantPageSize]);
  const participantCountMeta = participantSearchTerm
    ? `Toplam: ${participants.length} katılımcı | Gösterilen: ${filteredParticipants.length}`
    : `Toplam: ${participants.length} katılımcı`;

  const navigateTo = (path) => {
    if (typeof onNavigate === "function") {
      onNavigate(path);
      return;
    }

    window.location.assign(path);
  };

  const loadDetail = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [nextCampaign, nextParticipants, nextWinners, nextPrizes, nextSegments] = await Promise.all([
        getGiveawayCampaign(campaignId),
        listGiveawayParticipants(campaignId),
        listGiveawayWinners(campaignId),
        listCampaignPrizes(campaignId),
        listCampaignSegments(campaignId),
      ]);

      setCampaign(nextCampaign);
      setParticipants(normalizeCollection(nextParticipants));
      setWinners(normalizeCollection(nextWinners));
      setCampaignPrizes(normalizeCollection(nextPrizes));
      setCampaignSegments(normalizeCollection(nextSegments));
    } catch (error) {
      setErrorMessage(error?.message || "Çekiliş detayı şu anda yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    setParticipantPage((currentPage) => Math.min(currentPage, participantPageCount));
  }, [participantPageCount]);

  const handleCloseCampaign = async () => {
    if (
      !window.confirm(
        "Bu çekilişi kapatmak istediğinize emin misiniz? Kapattıktan sonra kullanıcılar çark çeviremez."
      )
    ) {
      return;
    }

    setIsClosing(true);
    setErrorMessage("");
    setToastMessage("");

    try {
      await closeGiveawayCampaign(campaignId);
      setToastMessage("Çekiliş kapatıldı.");
      await loadDetail();
    } catch (error) {
      setErrorMessage(error?.message || "Çekiliş şu anda kapatılamadı.");
    } finally {
      setIsClosing(false);
    }
  };

  const handleParticipantSearch = (event) => {
    event.preventDefault();
    setParticipantSearchTerm(participantSearchInput);
    setParticipantPage(1);
  };

  const handleClearParticipantSearch = () => {
    setParticipantSearchInput("");
    setParticipantSearchTerm("");
    setParticipantPage(1);
  };

  const handleParticipantPageSizeChange = (event) => {
    setParticipantPageSize(Number(event.target.value));
    setParticipantPage(1);
  };

  return (
    <section className="section">
      <div className={`container ${styles.pageShell}`}>
        <div className={styles.pageHeader}>
          <div>
            <p className="eyebrow">Haftalık Uygulama Çekilişi</p>
            <h1>Çekiliş Detayı</h1>
            <p>{campaign ? getCampaignName(campaign) : `Kampanya #${campaignId}`}</p>
          </div>

          <div className={styles.headerActions}>
            <button className="btn btn-secondary" type="button" onClick={() => navigateTo(CAMPAIGNS_ROUTE)}>
              ← Çekilişlere Dön
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => navigateTo(`${CAMPAIGNS_ROUTE}/${campaignId}/duzenle`)}>
              Düzenle
            </button>
            <button className="btn btn-primary" type="button" onClick={() => navigateTo(RESULT_ROUTE)}>
              Çekilişi Sonuçlandır
            </button>
            {campaign?.status === "active" ? (
              <button className="btn btn-secondary" type="button" onClick={handleCloseCampaign} disabled={isClosing}>
                {isClosing ? "Kapatılıyor..." : "Çekilişi Kapat"}
              </button>
            ) : null}
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

        {isLoading ? (
          <section className={styles.panel}>
            <p className={styles.loadingText}>Çekiliş detayı yükleniyor...</p>
          </section>
        ) : campaign ? (
          <>
            <section className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Özet</h2>
                </div>
                <StatusBadge status={campaign.status} />
              </div>

              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span>Kampanya adı</span>
                  <strong>{getCampaignName(campaign)}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Açıklama</span>
                  <strong>{campaign.description || "Açıklama bulunmuyor."}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Durum</span>
                  <strong>{GIVEAWAY_CAMPAIGN_STATUS_LABELS[campaign.status] || campaign.status || "-"}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Oluşturulma tarihi</span>
                  <strong>{formatDate(campaign.created_at)}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Aktif olma tarihi</span>
                  <strong>{formatDate(campaign.activated_at || campaign.starts_at)}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Bitiş tarihi</span>
                  <strong>{formatDate(campaign.ends_at || campaign.end_date || campaign.finish_at)}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Kapanış tarihi</span>
                  <strong>{formatDate(campaign.closed_at)}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Çekiliş tarihi</span>
                  <strong>{formatDate(campaign.drawn_at)}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Ön çekiliş</span>
                  <strong>{campaign.has_draw_preview ? "Var" : "Yok"}</strong>
                </div>
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Metrikler</h2>
                </div>
              </div>
              <div className={styles.metricGrid}>
                <div className={styles.metricItem}>
                  <span>Toplam katılımcı</span>
                  <strong>{metrics.totalParticipants}</strong>
                </div>
                <div className={styles.metricItem}>
                  <span>Toplam spin</span>
                  <strong>{metrics.totalSpins}</strong>
                </div>
                <div className={styles.metricItem}>
                  <span>Toplam bilet</span>
                  <strong>{metrics.totalTickets}</strong>
                </div>
                <div className={styles.metricItem}>
                  <span>Kazanan sayısı</span>
                  <strong>{metrics.winnerCount}</strong>
                </div>
              </div>
            </section>

            <CampaignItemsTable
              title="Katılımcılar"
              emptyMessage={participants.length ? "Arama kriterine uygun katılımcı bulunamadı." : "Bu kampanyada henüz katılımcı yok."}
              headerTools={
                <div className={styles.tableHeaderTools}>
                  <span className={styles.countBadge}>{participantCountMeta}</span>
                  <form className={styles.tableControls} onSubmit={handleParticipantSearch}>
                    <input
                      type="search"
                      value={participantSearchInput}
                      onChange={(event) => setParticipantSearchInput(event.target.value)}
                      placeholder="Kullanıcı adı, user id, e-posta veya telefon ara"
                    />
                    <button className="btn btn-secondary" type="submit">
                      Ara
                    </button>
                    <button className="btn btn-secondary" type="button" onClick={handleClearParticipantSearch}>
                      Temizle
                    </button>
                  </form>
                </div>
              }
              footer={
                <div className={styles.paginationBar}>
                  <label>
                    Sayfa boyutu
                    <select value={participantPageSize} onChange={handleParticipantPageSizeChange}>
                      {PARTICIPANT_PAGE_SIZE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <span>
                    Sayfa {participantPage} / {participantPageCount}
                  </span>
                  <div className={styles.paginationActions}>
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => setParticipantPage((currentPage) => Math.max(1, currentPage - 1))}
                      disabled={participantPage <= 1}
                    >
                      Önceki
                    </button>
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => setParticipantPage((currentPage) => Math.min(participantPageCount, currentPage + 1))}
                      disabled={participantPage >= participantPageCount}
                    >
                      Sonraki
                    </button>
                  </div>
                </div>
              }
              items={paginatedParticipants}
              columns={["User ID", "Ad Soyad", "Email", "Telefon", "Toplam Bilet", "Spin Sayısı", "Son Spin Tarihi"]}
              renderRow={(item, index) => (
                <tr key={item.id ?? `${getUserId(item)}-${index}`}>
                  <td>{getUserId(item)}</td>
                  <td>{getUserName(item)}</td>
                  <td>{getUserEmail(item)}</td>
                  <td>{getUserPhone(item)}</td>
                  <td>{item.total_tickets ?? item.ticket_count ?? 0}</td>
                  <td>{item.spin_count ?? item.total_spins ?? 0}</td>
                  <td>{formatDate(item.last_ticket_awarded_at || item.last_spin_at)}</td>
                </tr>
              )}
            />

            <CampaignItemsTable
              title="Kazananlar"
              emptyMessage="Henüz kazanan bulunmuyor."
              items={winners}
              columns={["User ID", "Ad Soyad", "Email", "Telefon", "Hediye", "Bilet Sayısı", "Çekiliş Tarihi"]}
              renderRow={(item, index) => (
                <tr key={item.id ?? `${getUserId(item)}-${index}`}>
                  <td>{getUserId(item)}</td>
                  <td>{getUserName(item)}</td>
                  <td>{getUserEmail(item)}</td>
                  <td>{getUserPhone(item)}</td>
                  <td>{item.prize_name || item.prize?.name || "-"}</td>
                  <td>{item.ticket_count_at_draw ?? 0}</td>
                  <td>{formatDate(item.drawn_at)}</td>
                </tr>
              )}
            />

            <CampaignItemsTable
              title="Hediyeler"
              emptyMessage="Bu kampanyaya ait hediye bulunmuyor."
              items={campaignPrizes}
              columns={["Sıra", "Hediye Adı", "Açıklama", "Adet", "Verilen Adet", "Aktif/Pasif"]}
              renderRow={(item, index) => (
                <tr key={getItemId(item) !== "-" ? getItemId(item) : `prize-${index}`}>
                  <td>{getDisplayValue(item.display_order)}</td>
                  <td>{getPrizeName(item)}</td>
                  <td>{getDisplayValue(item.description)}</td>
                  <td>{getDisplayValue(item.quantity)}</td>
                  <td>{getDisplayValue(item.awarded_count)}</td>
                  <td>{formatBoolean(item.is_active)}</td>
                </tr>
              )}
            />

            <CampaignItemsTable
              title="Çark Dilimleri"
              emptyMessage="Bu kampanyaya ait çark dilimi bulunmuyor."
              items={campaignSegments}
              columns={["Sıra", "Dilim", "Bilet Sayısı", "Olasılık Ağırlığı", "Aktif/Pasif"]}
              renderRow={(item, index) => (
                <tr key={getItemId(item) !== "-" ? getItemId(item) : `segment-${index}`}>
                  <td>{getDisplayValue(item.display_order)}</td>
                  <td>{getSegmentLabel(item)}</td>
                  <td>{getDisplayValue(item.ticket_count)}</td>
                  <td>{getDisplayValue(item.probability_weight)}</td>
                  <td>{formatBoolean(item.is_active)}</td>
                </tr>
              )}
            />
          </>
        ) : null}
      </div>
    </section>
  );
}

export default HaftalikUygulamaCampaignDetailPage;
