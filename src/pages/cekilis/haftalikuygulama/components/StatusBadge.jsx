import styles from "../HaftalikUygulamaPage.module.css";

function StatusBadge({ children, tone = "neutral" }) {
  return (
    <span className={`${styles.statusBadge} ${styles[`statusBadge-${tone}`]}`}>
      {children}
    </span>
  );
}

export default StatusBadge;
