import styles from "../HaftalikUygulamaPage.module.css";

function ColumnHeader({ label, field }) {
  return (
    <span className={styles.tableHeaderLabel}>
      <span>{label}</span>
      <small>{field}</small>
    </span>
  );
}

function DrawPreviewTable({ previewWinners }) {
  const hasPreviewRows = previewWinners.length > 0;

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.kicker}>Ön Çekiliş</p>
          <h2>Ön çekiliş adayları</h2>
        </div>
      </div>

      <p className={styles.noticeText}>
        Ön çekiliş sonucu oluşturuldu. Bu liste henüz kesinleşmedi. Onay verildiğinde kazananlar
        kesinleşir ve mail gönderimi başlatılır.
      </p>

      {hasPreviewRows ? (
        <div className={styles.tableScroll}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th><ColumnHeader label="Kazanan Adayı" field="user_name" /></th>
                <th><ColumnHeader label="E-posta" field="user_email" /></th>
                <th><ColumnHeader label="Ödül" field="prize_name" /></th>
                <th><ColumnHeader label="Çekilişteki Bilet Sayısı" field="ticket_count_at_draw" /></th>
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
          Ön çekiliş sonucu oluşturulmuş görünüyor. Aday listesini yeniden görüntülemek için backend
          tarafında ayrı bir önizleme listeleme endpointi gerekir.
        </p>
      )}
    </section>
  );
}

export default DrawPreviewTable;
