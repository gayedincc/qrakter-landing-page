import { useEffect, useState } from "react";
import {
  getReviewMe,
  hasClubReviewAccess,
  loginClubReview,
} from "../../../services/clubReviewService";
import styles from "./ClubReviewLoginPage.module.css";

function ClubReviewLoginPage({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkExistingSession = async () => {
      if (!hasClubReviewAccess()) {
        if (isMounted) {
          setIsCheckingSession(false);
        }
        return;
      }

      try {
        await getReviewMe();
        onLoginSuccess?.();
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Oturum süreniz doldu. Lütfen tekrar giriş yapın.",
          );
          setIsCheckingSession(false);
        }
      }
    };

    checkExistingSession();

    return () => {
      isMounted = false;
    };
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
      await loginClubReview(identifier, password);
      onLoginSuccess?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Giriş işlemi şu anda tamamlanamadı.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.kicker}>Zayfix Operasyon</p>
          <h1>Kulüp Başvuru Onay Paneli</h1>
          <p>Bekleyen kulüp başvurularını incelemek ve kararları kayıt altına almak için giriş yapın.</p>
        </div>

        <form className={styles.loginBox} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <h2>Yetkili Girişi</h2>
            <p>Bu alan yalnızca kulüp başvurularını değerlendirme yetkisi olan kullanıcılar içindir.</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="club-review-identifier">E-posta veya telefon</label>
            <input
              id="club-review-identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              disabled={isSubmitting || isCheckingSession}
              onChange={(event) => {
                setIdentifier(event.target.value);
                setErrorMessage("");
              }}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="club-review-password">Şifre</label>
            <input
              id="club-review-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              disabled={isSubmitting || isCheckingSession}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrorMessage("");
              }}
            />
          </div>

          {errorMessage ? (
            <p className={styles.error} role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button className="btn btn-primary full-width" type="submit" disabled={isSubmitting || isCheckingSession}>
            {isCheckingSession ? "Oturum kontrol ediliyor..." : isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ClubReviewLoginPage;
