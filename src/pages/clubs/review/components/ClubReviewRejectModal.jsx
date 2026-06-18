import { useState } from "react";
import styles from "../ClubReviewApplicationDetailPage.module.css";

function ClubReviewRejectModal({ isSubmitting, onClose, onSubmit }) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!rejectionReason.trim()) {
      setErrorMessage("Red nedeni zorunludur.");
      return;
    }

    onSubmit(rejectionReason.trim());
  };

  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={handleClose}>
      <form
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="club-review-reject-title"
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.kicker}>Başvuruyu Reddet</p>
            <h2 id="club-review-reject-title">Red nedeni girin</h2>
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

        <label className={styles.rejectField} htmlFor="club-review-rejection-reason">
          <span>Red nedeni</span>
          <textarea
            id="club-review-rejection-reason"
            value={rejectionReason}
            disabled={isSubmitting}
            onChange={(event) => {
              setRejectionReason(event.target.value);
              setErrorMessage("");
            }}
            placeholder="Başvurunun neden reddedildiğini yazın."
          />
        </label>

        {errorMessage ? (
          <p className={styles.errorBanner} role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className={styles.modalActions}>
          <button className="btn btn-secondary" type="button" disabled={isSubmitting} onClick={handleClose}>
            Vazgeç
          </button>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "İşleniyor..." : "Reddet"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClubReviewRejectModal;
