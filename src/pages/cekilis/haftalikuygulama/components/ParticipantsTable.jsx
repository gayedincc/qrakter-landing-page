import styles from "../HaftalikUygulamaPage.module.css";

function ColumnHeader({ label, field }) {
  return (
    <span className={styles.tableHeaderLabel}>
      <span>{label}</span>
      <small>{field}</small>
    </span>
  );
}

function ParticipantsTable({ participants, formatDate }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.kicker}>Katılımcılar</p>
          <h2>Katılımcılar tablosu</h2>
        </div>
      </div>

      {participants.length === 0 ? (
        <p className={styles.emptyText}>Bu kampanyada henüz katılımcı yok.</p>
      ) : (
        <div className={styles.tableScroll}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th><ColumnHeader label="Kullanıcı" field="user_name" /></th>
                <th><ColumnHeader label="E-posta" field="user_email" /></th>
                <th><ColumnHeader label="Telefon" field="user_phone_number" /></th>
                <th><ColumnHeader label="Toplam Bilet" field="total_tickets" /></th>
                <th><ColumnHeader label="Spin Sayısı" field="spin_count" /></th>
                <th><ColumnHeader label="Son Çevirme Tarihi" field="last_spin_at" /></th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr key={participant.id}>
                  <td>{participant.user_name}</td>
                  <td>{participant.user_email}</td>
                  <td>{participant.user_phone_number}</td>
                  <td>{participant.total_tickets}</td>
                  <td>{participant.spin_count}</td>
                  <td>{formatDate(participant.last_spin_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ParticipantsTable;
