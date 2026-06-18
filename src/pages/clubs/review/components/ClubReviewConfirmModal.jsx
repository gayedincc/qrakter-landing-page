import styles from "../ClubReviewApplicationDetailPage.module.css";

function ClubReviewConfirmModal({
  title = "İşlem Onayı",
  description,
  confirmLabel = "Onayla",
  isSubmitting,
  onClose,
  onConfirm,
}) {
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={handleClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="club-review-confirm-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.kicker}>Kulüp Başvuru Onayı</p>
            <h2 id="club-review-confirm-title">{title}</h2>
          </div>
          <button
            className={styles.iconButton}
            type="button"
            aria-label="Kapat"
            disabled={isSubmitting}
            onClick={handleClose}
          >
            ×
          </button>
        </div>

        <p className={styles.modalDescription}>{description}</p>

        <div className={styles.modalActions}>
          <button className="btn btn-secondary" type="button" disabled={isSubmitting} onClick={handleClose}>
            Vazgeç
          </button>
          <button className="btn btn-primary" type="button" disabled={isSubmitting} onClick={onConfirm}>
            {isSubmitting ? "İşleniyor..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClubReviewConfirmModal;
