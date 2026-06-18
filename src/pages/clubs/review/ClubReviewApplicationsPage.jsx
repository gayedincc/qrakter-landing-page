import { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearClubReviewSession,
  getApplications,
  getReviewMe,
} from "../../../services/clubReviewService";
import ClubReviewApplicationTable from "./components/ClubReviewApplicationTable";
import styles from "./ClubReviewApplicationsPage.module.css";

const DETAIL_BASE_ROUTE = "/kulup-onay/basvurular";
const LOGIN_ROUTE = "/kulup-onay/giris";
const PAGE_SIZE = 20;

const STATUS_FILTERS = [
  { label: "Tümü", value: "" },
  { label: "Beklemede", value: "PENDING" },
  { label: "Onaylandı", value: "APPROVED" },
  { label: "Reddedildi", value: "REJECTED" },
];

function normalizeCollection(response) {
  if (Array.isArray(response)) {
    return {
      results: response,
      count: response.length,
      next: null,
      previous: null,
    };
  }

  if (Array.isArray(response?.results)) {
    return {
      results: response.results,
      count: Number(response.count ?? response.results.length),
      next: response.next,
      previous: response.previous,
    };
  }

  if (Array.isArray(response?.data?.results)) {
    return {
      results: response.data.results,
      count: Number(response.data.count ?? response.data.results.length),
      next: response.data.next,
      previous: response.data.previous,
    };
  }

  if (Array.isArray(response?.data)) {
    return {
      results: response.data,
      count: Number(response.count ?? response.data.length),
      next: response.next,
      previous: response.previous,
    };
  }

  return {
    results: [],
    count: 0,
    next: null,
    previous: null,
  };
}

function ClubReviewApplicationsPage({ onNavigate }) {
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / PAGE_SIZE)), [totalCount]);

  const navigateTo = (path) => {
    if (typeof onNavigate === "function") {
      onNavigate(path);
      return;
    }

    window.location.assign(path);
  };

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await getReviewMe();
      const response = await getApplications({
        status,
        search: submittedSearch,
        page,
        page_size: PAGE_SIZE,
      });
      const normalized = normalizeCollection(response);

      setApplications(normalized.results);
      setTotalCount(normalized.count);
      setHasNextPage(Boolean(normalized.next) || page < Math.ceil(normalized.count / PAGE_SIZE));
      setHasPreviousPage(Boolean(normalized.previous) || page > 1);
    } catch (error) {
      setErrorMessage(error?.message || "Başvurular şu anda yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  }, [page, status, submittedSearch]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSubmittedSearch(search.trim());
  };

  const handleStatusChange = (nextStatus) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const handleLogout = () => {
    clearClubReviewSession();
    navigateTo(LOGIN_ROUTE);
  };

  return (
    <section className={styles.reviewSection}>
      <div className={styles.pageShell}>
        <div className={styles.pageHeader}>
          <div>
            <p className="eyebrow">Kulüp Başvuru Onay Paneli</p>
            <h1>Başvurular</h1>
            <p>Kulüp başvurularını durumuna göre izleyin, arayın ve detayına geçerek değerlendirin.</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={handleLogout}>
            Çıkış Yap
          </button>
        </div>

        {errorMessage ? (
          <div className={styles.errorBanner} role="alert">
            {errorMessage}
          </div>
        ) : null}

        <section className={styles.panel}>
          <div className={styles.toolbar}>
            <div className={styles.filterBar} role="toolbar" aria-label="Durum filtresi">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.value || "all"}
                  className={`${styles.filterButton} ${status === filter.value ? styles.filterButtonActive : ""}`}
                  type="button"
                  onClick={() => handleStatusChange(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
              <label className={styles.searchLabel} htmlFor="club-review-search">
                Başvuru ara
              </label>
              <input
                id="club-review-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Kulüp, başkan veya telefon"
              />
              <button className="btn btn-secondary" type="submit">
                Ara
              </button>
            </form>
          </div>

          <ClubReviewApplicationTable
            applications={applications}
            isLoading={isLoading}
            onOpenDetail={(id) => navigateTo(`${DETAIL_BASE_ROUTE}/${encodeURIComponent(id)}`)}
          />

          <div className={styles.paginationBar}>
            <span>
              Toplam {totalCount} başvuru · Sayfa {Math.min(page, totalPages)} / {totalPages}
            </span>
            <div className={styles.paginationActions}>
              <button
                className="btn btn-secondary"
                type="button"
                disabled={isLoading || !hasPreviousPage}
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              >
                Önceki
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                disabled={isLoading || !hasNextPage}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Sonraki
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default ClubReviewApplicationsPage;
