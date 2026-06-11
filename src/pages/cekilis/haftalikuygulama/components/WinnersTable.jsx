import styles from "../HaftalikUygulamaPage.module.css";

function ColumnHeader({ label, field }) {
  return (
    <span className={styles.tableHeaderLabel}>
      <span>{label}</span>
      <small>{field}</small>
    </span>
  );
}

function WinnersTable({ winners, formatDate }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.kicker}>Kazananlar</p>
          <h2>Kazananlar tablosu</h2>
        </div>
      </div>

      {winners.length === 0 ? (
        <p className={styles.emptyText}>Henüz kazanan bulunmuyor.</p>
      ) : (
        <div className={styles.tableScroll}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th><ColumnHeader label="Kazanan" field="user_name" /></th>
                <th><ColumnHeader label="E-posta" field="user_email" /></th>
                <th><ColumnHeader label="Telefon" field="user_phone_number" /></th>
                <th><ColumnHeader label="Ödül" field="prize_name" /></th>
                <th><ColumnHeader label="Çekilişteki Bilet Sayısı" field="ticket_count_at_draw" /></th>
                <th><ColumnHeader label="Çekiliş Tarihi" field="drawn_at" /></th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner) => (
                <tr key={winner.id}>
                  <td>{winner.user_name}</td>
                  <td>{winner.user_email}</td>
                  <td>{winner.user_phone_number}</td>
                  <td>{winner.prize_name}</td>
                  <td>{winner.ticket_count_at_draw}</td>
                  <td>{formatDate(winner.drawn_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default WinnersTable;
