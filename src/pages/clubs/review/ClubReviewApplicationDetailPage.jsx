import { useCallback, useEffect, useMemo, useState } from "react";
import {
  approveApplication,
  clearClubReviewSession,
  getApplicationDetail,
  getReviewMe,
  rejectApplication,
  resetApplicationRejection,
} from "../../../services/clubReviewService";
import ClubReviewConfirmModal from "./components/ClubReviewConfirmModal";
import ClubReviewRejectModal from "./components/ClubReviewRejectModal";
import ClubReviewStatusBadge from "./components/ClubReviewStatusBadge";
import styles from "./ClubReviewApplicationDetailPage.module.css";

const APPLICATIONS_ROUTE = "/kulup-onay/basvurular";
const LOGIN_ROUTE = "/kulup-onay/giris";
const STATUS_LABELS = {
  PENDING: "Beklemede",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
  CANCELLED: "İptal Edildi",
};

function formatDate(value, onlyDate = false) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(onlyDate
      ? {}
      : {
          hour: "2-digit",
          minute: "2-digit",
        }),
  }).format(date);
}

function normalizePhotoUrl(value) {
  if (!value) return "";

  try {
    return new URL(value, "https://ktt.everionai.com").toString();
  } catch {
    return "";
  }
}

function normalizeSocialLinks(application) {
  return [
    { label: "Instagram", url: application?.instagram_url },
    { label: "Web sitesi", url: application?.website_url },
    { label: "Facebook", url: application?.facebook_url },
    { label: "X", url: application?.x_url },
  ].filter((item) => item.url && `${item.url}`.trim() !== "");
}

function getApplicantText(application) {
  const applicant = application?.applicant;
  const firstName = applicant?.first_name || "";
  const lastName = applicant?.last_name || "";
  const fullNameFromParts = `${firstName} ${lastName}`.trim();

  return applicant?.full_name || fullNameFromParts || applicant?.email || "-";
}

function DetailItem({ label, value }) {
  return (
    <div className={styles.detailItem}>
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

function ClubReviewApplicationDetailPage({ applicationId, onNavigate }) {
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const status = `${application?.status || ""}`.toUpperCase();
  const clubName = application?.club_name || "-";
  const presidentName = application?.president_name || "-";
  const phoneNumber = application?.phone_number || "-";
  const category = application?.category_display || "-";
  const foundedDate = formatDate(application?.founded_date, true);
  const city = application?.city || "-";
  const district = application?.district || "-";
  const address = application?.address || "-";
  const statusText = application?.status_display || STATUS_LABELS[status] || application?.status || "-";
  const rejectionReason = application?.rejection_reason || "-";
  const createdAt = formatDate(application?.created_at);
  const updatedAt = formatDate(application?.updated_at);
  const reviewedAt = formatDate(application?.reviewed_at);
  const createdClubName = application?.created_club?.name || "-";
  const socialLinks = useMemo(() => normalizeSocialLinks(application), [application]);
  const photoUrl = normalizePhotoUrl(application?.photo_url || application?.photo);

  const canApproveOrReject = status === "PENDING";
  const canResetRejection = status === "REJECTED";
  const hasReviewAction = canApproveOrReject || canResetRejection;

  const navigateTo = (path) => {
    if (typeof onNavigate === "function") {
      onNavigate(path);
      return;
    }

    window.location.assign(path);
  };

  const handleLogout = () => {
    clearClubReviewSession();
    navigateTo(LOGIN_ROUTE);
  };

  const loadApplication = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    setEmptyMessage("");

    try {
      await getReviewMe();
      const response = await getApplicationDetail(applicationId);
      setApplication(response?.data || response);
    } catch (error) {
      const message = error?.message || "";
      const normalizedMessage = message.toLocaleLowerCase("tr-TR");

      setApplication(null);

      if (
        normalizedMessage.includes("bulunamad") ||
        normalizedMessage.includes("not found") ||
        normalizedMessage.includes("404")
      ) {
        setEmptyMessage("Başvuru bulunamadı veya işlem kapsamından çıkarılmış.");
      } else {
        setErrorMessage(message || "Başvuru detayı şu anda yüklenemedi.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    loadApplication();
  }, [loadApplication]);

  const runAction = async (action, successMessage) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setToastMessage("");

    try {
      await action();
      setConfirmAction(null);
      setIsRejectModalOpen(false);
      setToastMessage(successMessage);
      await loadApplication();
    } catch (error) {
      setErrorMessage(error?.message || "İşlem şu anda tamamlanamadı.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmModalContent = {
    approve: {
      title: "Başvuru onaylansın mı?",
      description: "Bu kulüp başvurusunu onaylamak istediğinize emin misiniz?",
      confirmLabel: "Onayla",
      onConfirm: () => runAction(() => approveApplication(applicationId), "Başvuru onaylandı."),
    },
    reset: {
      title: "Red kararı geri alınsın mı?",
      description: "Bu başvuruyu tekrar bekleyen duruma almak istediğinize emin misiniz?",
      confirmLabel: "Reddi Geri Al",
      onConfirm: () => runAction(() => resetApplicationRejection(applicationId), "Red kararı geri alındı."),
    },
  }[confirmAction];

  return (
    <section className={styles.reviewSection}>
      <div className={styles.pageShell}>
        <div className={styles.pageHeader}>
          <div>
            <p className="eyebrow">Kulüp Başvuru Onay Paneli</p>
            <h1>{application?.club_name || "Başvuru detayı"}</h1>
          </div>
          <div className={styles.headerActions}>
            {application ? <ClubReviewStatusBadge status={application.status} /> : null}
            <button className="btn btn-secondary" type="button" onClick={() => navigateTo(APPLICATIONS_ROUTE)}>
              ← Başvurulara Dön
            </button>
            <button className="btn btn-secondary" type="button" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>
        </div>

        {errorMessage ? (
          <div className={styles.errorBanner} role="alert">
            {errorMessage}
          </div>
        ) : null}

        {toastMessage ? <div className={styles.toast}>{toastMessage}</div> : null}

        {isLoading ? (
          <p className={styles.loadingText}>Başvuru detayı yükleniyor...</p>
        ) : application ? (
          <>
            <section className={styles.contentGrid}>
              <div className={styles.panel}>
                <div className={styles.sectionHeader}>
                  <h2>Başvuru Bilgileri</h2>
                </div>

                <div className={styles.detailGrid}>
                  <DetailItem label="Kulüp adı" value={clubName} />
                  <DetailItem label="Başkan adı" value={presidentName} />
                  <DetailItem label="Telefon" value={phoneNumber} />
                  <DetailItem label="Kategori" value={category} />
                  <DetailItem label="Kuruluş tarihi" value={foundedDate} />
                  <DetailItem label="Şehir" value={city} />
                  <DetailItem label="İlçe" value={district} />
                  <DetailItem label="Adres" value={address} />
                  <DetailItem
                    label="Başvuran kullanıcı"
                    value={getApplicantText(application)}
                  />
                  <DetailItem label="Durum" value={statusText} />
                  <DetailItem label="Red nedeni" value={rejectionReason} />
                  <DetailItem label="Oluşturulma tarihi" value={createdAt} />
                  <DetailItem label="Güncellenme tarihi" value={updatedAt} />
                  <DetailItem label="Değerlendirilme tarihi" value={reviewedAt} />
                  <DetailItem label="Oluşturulan kulüp" value={createdClubName} />
                </div>

                <div className={styles.aboutBox}>
                  <span>Hakkımızda</span>
                  <p>{application?.about || "-"}</p>
                </div>
              </div>

              <aside className={styles.sidePanel}>
                {hasReviewAction ? (
                  <div className={styles.actionPanel}>
                    <h2>İşlem</h2>
                    {canApproveOrReject ? (
                      <div className={styles.actions}>
                        <button className="btn btn-primary" type="button" onClick={() => setConfirmAction("approve")}>
                          Onayla
                        </button>
                        <button className="btn btn-secondary" type="button" onClick={() => setIsRejectModalOpen(true)}>
                          Reddet
                        </button>
                      </div>
                    ) : (
                      <button className="btn btn-secondary full-width" type="button" onClick={() => setConfirmAction("reset")}>
                        Reddi Geri Al
                      </button>
                    )}
                  </div>
                ) : null}

                <div className={styles.photoBox}>
                  {photoUrl ? <img src={photoUrl} alt="Kulüp fotoğrafı" /> : <span>Fotoğraf yok</span>}
                </div>

                <div className={styles.socialBox}>
                  <h2>Sosyal medya / Web</h2>
                  {socialLinks.length ? (
                    <div className={styles.linkList}>
                      {socialLinks.map((item) => (
                        <a key={item.label} href={item.url} target="_blank" rel="noreferrer">
                          {item.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p>Link girilmemiş.</p>
                  )}
                </div>
              </aside>
            </section>
          </>
        ) : (
          <div className={styles.emptyState}>
            <strong>{emptyMessage || "Başvuru bulunamadı veya işlem kapsamından çıkarılmış."}</strong>
          </div>
        )}
      </div>

      {confirmModalContent ? (
        <ClubReviewConfirmModal
          title={confirmModalContent.title}
          description={confirmModalContent.description}
          confirmLabel={confirmModalContent.confirmLabel}
          isSubmitting={isSubmitting}
          onClose={() => setConfirmAction(null)}
          onConfirm={confirmModalContent.onConfirm}
        />
      ) : null}

      {isRejectModalOpen ? (
        <ClubReviewRejectModal
          isSubmitting={isSubmitting}
          onClose={() => setIsRejectModalOpen(false)}
          onSubmit={(rejectionReason) =>
            runAction(() => rejectApplication(applicationId, rejectionReason), "Başvuru reddedildi.")
          }
        />
      ) : null}
    </section>
  );
}

export default ClubReviewApplicationDetailPage;
