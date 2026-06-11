import styles from "../HaftalikUygulamaPage.module.css";

const MODAL_CONTENT = {
  start: {
    title: "Yeni çekiliş başlatılsın mı?",
    description: "Bu işlem varsayılan ödül ve çark dilimlerinden yeni bir aktif kampanya oluşturur.",
    confirmLabel: "Onayla",
  },
  close: {
    title: "Aktif kampanya kapatılsın mı?",
    description:
      "Kampanya kapatıldıktan sonra kullanıcılar bu kampanya için çark çeviremez. Sonrasında çekiliş sonucunu önizleyebilirsiniz.",
    confirmLabel: "Onayla",
  },
  preview: {
    title: "Çekiliş sonucu önizlensin mi?",
    description:
      "Bu işlem kazanan adaylarını oluşturur. Bu aşamada kazananlar kesinleşmez ve mail gönderilmez.",
    confirmLabel: "Onayla",
  },
  refresh: {
    title: "Ön sonucu yenilemek istiyor musunuz?",
    description:
      "Mevcut ön çekiliş sonucu iptal edilecek ve yeni bir kazanan adayı listesi oluşturulacaktır.",
    confirmLabel: "Onayla",
  },
  cancel: {
    title: "Ön çekiliş sonucu iptal edilsin mi?",
    description: "Mevcut ön çekiliş sonucu silinecek. Kampanya kapalı durumda kalmaya devam eder.",
    confirmLabel: "Onayla",
  },
  confirm: {
    title: "Çekilişi onaylıyor musunuz?",
    description:
      "Bu sonucu onaylarsanız kazananlar kesinleşecek ve listedeki kişilere e-posta gönderilecektir. Bu işlem geri alınamaz.",
    confirmLabel: "Onayla ve Mail Gönder",
  },
};

function ConfirmActionModal({ action, isLoading, previewWinners, onClose, onConfirm }) {
  if (!action) return null;

  const content = MODAL_CONTENT[action];
  const shouldShowPreview = action === "confirm" || action === "refresh" || action === "cancel";
  const hasPreviewRows = previewWinners.length > 0;
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={handleClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-action-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.kicker}>İşlem Onayı</p>
            <h2 id="confirm-action-title">{content.title}</h2>
          </div>
          <button
            className={styles.iconButton}
            type="button"
            aria-label="Kapat"
            disabled={isLoading}
            onClick={handleClose}
          >
            ×
          </button>
        </div>

        <p className={styles.modalDescription}>{content.description}</p>

        {shouldShowPreview && (
          <div className={styles.modalPreview}>
            <h3>Ön çekiliş adayları</h3>
            {hasPreviewRows ? (
              <div className={styles.tableScroll}>
                <table className={styles.compactTable}>
                  <thead>
                    <tr>
                      <th>Kazanan</th>
                      <th>E-posta</th>
                      <th>Ödül</th>
                      <th>Bilet Sayısı</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewWinners.map((winner) => (
                      <tr key={`${winner.user_id}-${winner.prize_id}`}>
                        <td>{winner.user_name}</td>
                        <td>{winner.user_email}</td>
                        <td>{winner.prize_name}</td>
                        <td>{winner.ticket_count_at_draw}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.emptyText}>
                Ön çekiliş aday listesi bu oturumda yüklü değil.
              </p>
            )}
          </div>
        )}

        <div className={styles.modalActions}>
          <button className="btn btn-secondary" type="button" disabled={isLoading} onClick={handleClose}>
            Vazgeç
          </button>
          <button className="btn btn-primary" type="button" disabled={isLoading} onClick={onConfirm}>
            {isLoading ? "İşleniyor..." : content.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmActionModal;
