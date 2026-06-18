import styles from "../ClubReviewApplicationsPage.module.css";

const CLUB_REVIEW_STATUS_LABELS = {
  PENDING: "Beklemede",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
  CANCELLED: "İptal Edildi",
};

function getStatusClass(status) {
  if (status === "APPROVED") return styles.statusApproved;
  if (status === "REJECTED") return styles.statusRejected;
  if (status === "CANCELLED") return styles.statusCancelled;
  return styles.statusPending;
}

function ClubReviewStatusBadge({ status }) {
  const normalizedStatus = `${status || ""}`.toUpperCase();

  return (
    <span className={`${styles.statusBadge} ${getStatusClass(normalizedStatus)}`}>
      {CLUB_REVIEW_STATUS_LABELS[normalizedStatus] || status || "-"}
    </span>
  );
}

export default ClubReviewStatusBadge;
