import { useCallback, useEffect, useMemo, useState } from "react";
import CampaignStatusCard from "./components/CampaignStatusCard";
import GiveawayActionPanel from "./components/GiveawayActionPanel";
import ParticipantsTable from "./components/ParticipantsTable";
import DrawPreviewTable from "./components/DrawPreviewTable";
import WinnersTable from "./components/WinnersTable";
import ConfirmActionModal from "./components/ConfirmActionModal";
import WeeklyGiveawaySubNav from "./components/WeeklyGiveawaySubNav";
import styles from "./HaftalikUygulamaPage.module.css";
import {
  cancelGiveawayDrawPreview,
  closeGiveawayCampaign,
  confirmGiveawayDraw,
  listGiveawayCampaigns,
  listGiveawayParticipants,
  listGiveawayWinners,
  previewGiveawayDraw,
  refreshGiveawayDrawPreview,
  startGiveawayCampaignFromDefaults,
} from "../../../services/wheelGiveawayWebService";

const DASHBOARD_ROUTE = "/panel/cekilis/haftalik-uygulama";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function selectCampaign(campaigns) {
  const activeCampaign = campaigns.find((campaign) => campaign.status === "active");
  const closedCampaign = campaigns.find((campaign) => campaign.status === "closed");
  const latestDrawnCampaign = campaigns.find(
    (campaign) => campaign.status === "drawn" || campaign.status === "archived"
  );

  return activeCampaign || closedCampaign || latestDrawnCampaign || null;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeParticipant(participant) {
  return {
    ...participant,
    user_name: participant.user?.full_name || participant.user?.username || participant.user_name || "-",
    user_email: participant.user?.email || participant.user_email || "-",
    user_phone_number: participant.user?.phone_number || participant.user_phone_number || "-",
    total_tickets: participant.ticket_count ?? participant.total_tickets ?? 0,
    spin_count: participant.spin_count ?? 0,
    last_spin_at: participant.last_ticket_awarded_at || participant.last_spin_at || null,
  };
}

function normalizeWinner(winner) {
  return {
    id: winner.id,
    campaign: winner.campaign,
    user_name: winner.user_name || winner.user?.full_name || winner.user?.username || "-",
    user_email: winner.user_email || winner.user?.email || "-",
    user_phone_number: winner.user_phone_number || winner.user?.phone_number || "-",
    prize_name: winner.prize_name || winner.prize?.name || "-",
    ticket_count_at_draw: winner.ticket_count_at_draw ?? 0,
    drawn_at: winner.drawn_at,
  };
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

function HaftalikUygulamaPage({ onNavigate }) {
  const [campaigns, setCampaigns] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [previewWinners, setPreviewWinners] = useState([]);
  const [winners, setWinners] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [activeAction, setActiveAction] = useState(null);
  const [actionLoading, setActionLoading] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const campaign = useMemo(() => selectCampaign(campaigns), [campaigns]);
  const showPreviewTable = campaign?.status === "closed" && campaign.has_draw_preview;
  const showWinnersTable = campaign?.status === "drawn" || campaign?.status === "archived";
  const showParticipantsTable = campaign?.status === "active" || campaign?.status === "closed";

  const loadDashboard = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) {
        setIsInitialLoading(true);
      }

      setDataError("");

      try {
        const nextCampaigns = normalizeArray(await listGiveawayCampaigns());
        const nextCampaign = selectCampaign(nextCampaigns);

        setCampaigns(nextCampaigns);

        if (nextCampaign?.status === "active" || nextCampaign?.status === "closed") {
          const nextParticipants = normalizeArray(await listGiveawayParticipants(nextCampaign.id));
          setParticipants(nextParticipants.map(normalizeParticipant));
        } else {
          setParticipants([]);
        }

        if (nextCampaign?.status === "drawn" || nextCampaign?.status === "archived") {
          const nextWinners = normalizeArray(await listGiveawayWinners(nextCampaign.id));
          setWinners(nextWinners.map(normalizeWinner));
        } else {
          setWinners([]);
        }

        if (nextCampaign?.status !== "closed" || !nextCampaign.has_draw_preview) {
          setPreviewWinners([]);
        }
      } catch (error) {
        setDataError(getFriendlyErrorMessage(error));
      } finally {
        setIsInitialLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const navigateTo = (path) => {
    if (typeof onNavigate === "function") {
      onNavigate(path);
      return;
    }

    window.location.assign(path);
  };

  const handleConfirm = async () => {
    if (!activeAction) return;

    setActionLoading(activeAction);
    setDataError("");
    setToastMessage("");

    try {
      if (activeAction === "start") {
        await startGiveawayCampaignFromDefaults({});
        setToastMessage("Yeni çekiliş başlatıldı.");
      }

      if (activeAction === "close") {
        await closeGiveawayCampaign(campaign.id);
        setToastMessage("Aktif kampanya kapatıldı.");
      }

      if (activeAction === "preview") {
        const response = await previewGiveawayDraw(campaign.id);
        setPreviewWinners(normalizeArray(response?.winners_preview));
        setToastMessage("Ön çekiliş sonucu oluşturuldu.");
      }

      if (activeAction === "refresh") {
        const response = await refreshGiveawayDrawPreview(campaign.id);
        setPreviewWinners(normalizeArray(response?.winners_preview));
        setToastMessage("Ön çekiliş sonucu yenilendi.");
      }

      if (activeAction === "cancel") {
        const response = await cancelGiveawayDrawPreview(campaign.id);
        setPreviewWinners([]);
        setToastMessage(response?.message || "Ön çekiliş sonucu iptal edildi.");
      }

      if (activeAction === "confirm") {
        const response = await confirmGiveawayDraw(campaign.id);
        setPreviewWinners([]);

        if ((response?.email_summary?.failed_count ?? 0) > 0) {
          setToastMessage("Çekiliş sonucu onaylandı. Ancak bazı e-postalar gönderilemedi.");
        } else {
          setToastMessage("Çekiliş sonucu onaylandı. Kazananlara e-posta gönderimi başlatıldı.");
        }
      }

      setActiveAction(null);
      await loadDashboard({ silent: true });
    } catch (error) {
      setDataError(getFriendlyErrorMessage(error));
    } finally {
      setActionLoading("");
    }
  };

  return (
    <section className="section">
      <div className={`container ${styles.pageShell}`}>
        <div className={styles.pageHeader}>
          <div>
            <p className="eyebrow">QRakter Çekiliş</p>
            <h1>Çekiliş Sonuçlandırma</h1>
            <p>
              Aktif çekilişi kapatın, ön çekiliş sonucunu oluşturun ve sonucu onaylayarak
              kazananlara e-posta gönderimini başlatın.
            </p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => navigateTo(DASHBOARD_ROUTE)}>
            ← Haftalık Çekiliş Paneline Dön
          </button>
        </div>

        <WeeklyGiveawaySubNav onNavigate={onNavigate} />

        {toastMessage && (
          <div className={styles.toast} role="status">
            {toastMessage}
          </div>
        )}

        {dataError && (
          <div className={styles.errorBanner} role="alert">
            {dataError}
          </div>
        )}

        {isInitialLoading ? (
          <section className={styles.panel}>
            <p className={styles.loadingText}>Çekiliş paneli yükleniyor...</p>
          </section>
        ) : (
          <>
            <div className={styles.dashboardGrid}>
              <CampaignStatusCard campaign={campaign} formatDate={formatDate} />
              <GiveawayActionPanel
                campaign={campaign}
                actionLoading={actionLoading}
                onAction={setActiveAction}
              />
            </div>

            {showParticipantsTable && (
              <ParticipantsTable participants={participants} formatDate={formatDate} />
            )}

            {showPreviewTable && <DrawPreviewTable previewWinners={previewWinners} />}

            {showWinnersTable && <WinnersTable winners={winners} formatDate={formatDate} />}
          </>
        )}
      </div>

      <ConfirmActionModal
        action={activeAction}
        isLoading={Boolean(actionLoading)}
        previewWinners={previewWinners}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
      />
    </section>
  );
}

export default HaftalikUygulamaPage;
