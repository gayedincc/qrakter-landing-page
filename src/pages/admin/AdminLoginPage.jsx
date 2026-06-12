import { useEffect, useState } from "react";
import { loginAdmin } from "../../services/adminAuthService";
import {
  getAdminAccessToken,
  getStoredAdminUser,
  isAdminUser,
} from "../../utils/adminAuth";
import styles from "./AdminLoginPage.module.css";

function AdminLoginPage({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getAdminAccessToken() && isAdminUser(getStoredAdminUser())) {
      onLoginSuccess?.();
    }
  }, [onLoginSuccess]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!identifier.trim() || !password) {
      setErrorMessage("E-posta/telefon ve şifre zorunludur.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await loginAdmin(identifier, password);
      onLoginSuccess?.();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Giriş şu anda tamamlanamadı.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <p className="eyebrow">QRakter Panel</p>
          <h1>Admin Girişi</h1>
          <p>Çekiliş operasyon paneline devam etmek için giriş yapın.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="admin-identifier">E-posta veya telefon</label>
            <input
              id="admin-identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(event) => {
                setIdentifier(event.target.value);
                setErrorMessage("");
              }}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="admin-password">Şifre</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrorMessage("");
              }}
              disabled={isSubmitting}
            />
          </div>

          {errorMessage ? (
            <p className={styles.error} role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button className="btn btn-primary full-width" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLoginPage;
