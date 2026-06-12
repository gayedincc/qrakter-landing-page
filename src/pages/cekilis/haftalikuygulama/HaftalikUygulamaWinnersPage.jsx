import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listGiveawayCampaigns,
  listGiveawayWinners,
} from "../../../services/wheelGiveawayWebService";
import WeeklyGiveawaySubNav from "./components/WeeklyGiveawaySubNav";
import styles from "./HaftalikUygulamaWinnersPage.module.css";

const DASHBOARD_ROUTE = "/panel/cekilis/haftalik-uygulama";
const COMPLETED_STATUSES = ["drawn", "archived"];

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

function getCampaignName(campaign) {
  return campaign?.name || campaign?.title || campaign?.campaign_name || `Kampanya #${getCampaignId(campaign) || "-"}`;
}

function getTimestamp(value) {
  const timestamp = new Date(value || 0).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortCompletedCampaigns(campaigns) {
  return campaigns
    .filter((campaign) => COMPLETED_STATUSES.includes(campaign.status))
    .sort((a, b) => {
      const aDate = getTimestamp(a.drawn_at || a.updated_at || a.created_at);
      const bDate = getTimestamp(b.drawn_at || b.updated_at || b.created_at);

      if (bDate !== aDate) return bDate - aDate;
      return Number(getCampaignId(b) || 0) - Number(getCampaignId(a) || 0);
    });
}

function formatDate(value) {
  if (!value || value === "-") return "-";

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

function getUserId(winner) {
  return winner?.user_id ?? winner?.user?.id ?? winner?.user?.pk ?? "-";
}

function getDisplayName(winner) {
  return (
    winner?.display_name ||
    winner?.user_name ||
    winner?.user?.full_name ||
    winner?.user?.username ||
    "-"
  );
}

function getUserEmail(winner) {
  return winner?.user_email || winner?.email || winner?.user?.email || "-";
}

function getUserPhone(winner) {
  return (
    winner?.user_phone_number ||
    winner?.phone_number ||
    winner?.user?.phone_number ||
    winner?.telefon ||
    "-"
  );
}

function normalizeWinner(winner, campaign) {
  return {
    id: winner?.id ?? winner?.pk ?? `${getCampaignId(campaign)}-${getUserId(winner)}-${winner?.prize_name || ""}`,
    campaign_id: getCampaignId(campaign),
    campaign_name: getCampaignName(campaign),
    campaign_status: campaign?.status || "-",
    campaign_drawn_at: campaign?.drawn_at || "-",
    user_id: getUserId(winner),
    display_name: getDisplayName(winner),
    user_email: getUserEmail(winner),
    user_phone_number: getUserPhone(winner),
    prize_name: winner?.prize_name || winner?.prize?.name || "-",
    ticket_count_at_draw: winner?.ticket_count_at_draw ?? winner?.ticket_count ?? "-",
    drawn_at: winner?.drawn_at || campaign?.drawn_at || "-",
  };
}

function includesSearchValue(value, query) {
  return `${value || ""}`.toLocaleLowerCase("tr-TR").includes(query);
}

function WinnersTable({ columns, emptyMessage, renderRow, winners }) {
  if (!winners.length) {
    return (
      <div className={styles.emptyState}>
        <strong>{emptyMessage}</strong>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>{winners.map(renderRow)}</tbody>
      </table>
    </div>
  );
}

function HaftalikUygulamaWinnersPage({ onNavigate }) {
  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [latestWinners, setLatestWinners] = useState([]);
  const [allWinners, setAllWinners] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [partialErrorMessage, setPartialErrorMessage] = useState("");

  const latestCompletedCampaign = completedCampaigns[0] || null;

  const filteredWinners = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("tr-TR");

    if (!query) {
      return allWinners;
    }

    return allWinners.filter((winner) => {
      return (
        includesSearchValue(winner.display_name, query) ||
        includesSearchValue(winner.prize_name, query) ||
        includesSearchValue(winner.campaign_name, query)
      );
    });
  }, [allWinners, searchQuery]);
  const winnerCountMeta = searchQuery.trim()
    ? `Toplam: ${allWinners.length} kazanan | Gösterilen: ${filteredWinners.length}`
    : `Toplam: ${allWinners.length} kazanan`;

  const navigateTo = (path) => {
    if (typeof onNavigate === "function") {
      onNavigate(path);
      return;
    }

    window.location.assign(path);
  };

  const loadWinners = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    setPartialErrorMessage("");

    try {
      const campaignResponse = await listGiveawayCampaigns();
      const nextCompletedCampaigns = sortCompletedCampaigns(normalizeCollection(campaignResponse));

      const winnerResults = await Promise.all(
        nextCompletedCampaigns.map(async (campaign) => {
          try {
            const winnersResponse = await listGiveawayWinners(getCampaignId(campaign));

            return {
              campaign,
              hasError: false,
              winners: normalizeCollection(winnersResponse).map((winner) => normalizeWinner(winner, campaign)),
            };
          } catch {
            return {
              campaign,
              hasError: true,
              winners: [],
            };
          }
        })
      );

      const failedCampaignCount = winnerResults.filter((result) => result.hasError).length;
      const nextLatestWinners = winnerResults[0]?.winners || [];
      const nextAllWinners = winnerResults.flatMap((result) => result.winners);

      setCompletedCampaigns(nextCompletedCampaigns);
      setLatestWinners(nextLatestWinners);
      setAllWinners(nextAllWinners);

      if (failedCampaignCount) {
        setPartialErrorMessage(`${failedCampaignCount} kampanyanın kazanan kayıtları şu anda yüklenemedi.`);
      }
    } catch (error) {
      setErrorMessage(error?.message || "Kazananlar şu anda yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWinners();
  }, [loadWinners]);

  return (
    <section className="section">
      <div className={`container ${styles.pageShell}`}>
        <div className={styles.pageHeader}>
          <div>
            <p className="eyebrow">Haftalık Uygulama Çekilişi</p>
            <h1>Kazananlar</h1>
            <p>Son tamamlanan çekilişin kazananlarını ve tüm geçmiş kazanan listesini görüntüleyin.</p>
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

        {partialErrorMessage ? (
          <div className={styles.warningBanner} role="status">
            {partialErrorMessage}
          </div>
        ) : null}

        <section className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Son Çekiliş Kazananları</h2>
              {latestCompletedCampaign ? (
                <p>
                  Kampanya: {getCampaignName(latestCompletedCampaign)} · Çekiliş Tarihi:{" "}
                  {formatDate(latestCompletedCampaign.drawn_at)} · Kazanan Sayısı: {latestWinners.length}
                </p>
              ) : null}
            </div>
          </div>

          {isLoading ? (
            <p className={styles.loadingText}>Kazananlar yükleniyor...</p>
          ) : !latestCompletedCampaign ? (
            <div className={styles.emptyState}>
              <strong>Henüz tamamlanan çekiliş bulunmuyor.</strong>
            </div>
          ) : (
            <WinnersTable
              emptyMessage="Bu çekiliş için kazanan kaydı bulunamadı."
              winners={latestWinners}
              columns={["User ID", "Kazanan", "E-posta", "Telefon", "Hediye", "Bilet", "Çekiliş Tarihi"]}
              renderRow={(winner) => (
                <tr key={winner.id}>
                  <td>{winner.user_id}</td>
                  <td>{winner.display_name}</td>
                  <td>{winner.user_email}</td>
                  <td>{winner.user_phone_number}</td>
                  <td>{winner.prize_name}</td>
                  <td>{winner.ticket_count_at_draw}</td>
                  <td>{formatDate(winner.drawn_at)}</td>
                </tr>
              )}
            />
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Tüm Kazananlar</h2>
              <p>Geçmiş tüm tamamlanan çekilişlerdeki kazanan kayıtları.</p>
            </div>

            <div className={styles.headerMetaGroup}>
              <span className={styles.countBadge}>{winnerCountMeta}</span>
              <label className={styles.searchField} htmlFor="winner-search">
                <span>Arama</span>
                <input
                  id="winner-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Kazanan, hediye veya çekiliş adı"
                />
              </label>
            </div>
          </div>

          {isLoading ? (
            <p className={styles.loadingText}>Tüm kazananlar yükleniyor...</p>
          ) : (
            <WinnersTable
              emptyMessage="Henüz kazanan kaydı bulunmuyor."
              winners={filteredWinners}
              columns={[
                "Çekiliş ID",
                "Çekiliş Adı",
                "Kazanan",
                "User ID",
                "E-posta",
                "Telefon",
                "Hediye",
                "Bilet",
                "Çekiliş Tarihi",
              ]}
              renderRow={(winner) => (
                <tr key={`${winner.campaign_id}-${winner.id}`}>
                  <td>{winner.campaign_id}</td>
                  <td>{winner.campaign_name}</td>
                  <td>{winner.display_name}</td>
                  <td>{winner.user_id}</td>
                  <td>{winner.user_email}</td>
                  <td>{winner.user_phone_number}</td>
                  <td>{winner.prize_name}</td>
                  <td>{winner.ticket_count_at_draw}</td>
                  <td>{formatDate(winner.drawn_at)}</td>
                </tr>
              )}
            />
          )}
        </section>
      </div>
    </section>
  );
}

export default HaftalikUygulamaWinnersPage;
