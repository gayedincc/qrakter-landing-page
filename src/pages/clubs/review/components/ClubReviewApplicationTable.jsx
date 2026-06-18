import ClubReviewStatusBadge from "./ClubReviewStatusBadge";
import styles from "../ClubReviewApplicationsPage.module.css";

function getApplicationId(application) {
  return application?.id ?? application?.pk ?? application?.uuid;
}

function getValue(source, keys) {
  for (const key of keys) {
    const value = source?.[key];

    if (value !== undefined && value !== null && `${value}`.trim() !== "") {
      return value;
    }
  }

  return "";
}

function getClubName(application) {
  return getValue(application, ["club_name", "name", "title"]) || "-";
}

function getPresidentName(application) {
  return getValue(application, ["president_name", "chairman_name", "leader_name"]) || "-";
}

function getPhone(application) {
  return getValue(application, ["phone", "phone_number", "contact_phone"]) || "-";
}

function getLocation(application) {
  const city = getValue(application, ["city", "city_name"]);
  const district = getValue(application, ["district", "district_name"]);

  if (city && district) return `${city}/${district}`;
  return city || district || "-";
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function ClubReviewApplicationTable({ applications, isLoading, onOpenDetail }) {
  if (isLoading) {
    return <p className={styles.loadingText}>Başvurular yükleniyor...</p>;
  }

  if (!applications.length) {
    return (
      <div className={styles.emptyState}>
        <strong>Gösterilecek başvuru bulunamadı.</strong>
      </div>
    );
  }

  return (
    <>
      <div className={styles.tableScroll}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Kulüp Adı</th>
              <th>Başkan</th>
              <th>Telefon</th>
              <th>Şehir/İlçe</th>
              <th>Durum</th>
              <th>Oluşturulma Tarihi</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => {
              const applicationId = getApplicationId(application);

              return (
                <tr key={applicationId || getClubName(application)}>
                  <td data-label="Kulüp Adı">
                    <strong className={styles.clubName}>{getClubName(application)}</strong>
                  </td>
                  <td data-label="Başkan">{getPresidentName(application)}</td>
                  <td data-label="Telefon">{getPhone(application)}</td>
                  <td data-label="Şehir/İlçe">{getLocation(application)}</td>
                  <td data-label="Durum">
                    <ClubReviewStatusBadge status={application?.status} />
                  </td>
                  <td data-label="Oluşturulma Tarihi">{formatDate(application?.created_at)}</td>
                  <td data-label="İşlem">
                    <button
                      className={`btn btn-secondary ${styles.detailButton}`}
                      type="button"
                      disabled={!applicationId}
                      onClick={() => onOpenDetail(applicationId)}
                    >
                      Detay
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.mobileApplicationList}>
        {applications.map((application) => {
          const applicationId = getApplicationId(application);

          return (
            <article className={styles.mobileApplicationCard} key={applicationId || getClubName(application)}>
              <div className={styles.mobileCardHeader}>
                <h2>{getClubName(application)}</h2>
                <ClubReviewStatusBadge status={application?.status} />
              </div>
              <div className={styles.mobileCardMeta}>
                <span>Başkan: {getPresidentName(application)}</span>
                <span>Telefon: {getPhone(application)}</span>
                <span>{getLocation(application)}</span>
                <span>{formatDate(application?.created_at)}</span>
              </div>
              <button
                className={`btn btn-secondary ${styles.detailButton}`}
                type="button"
                disabled={!applicationId}
                onClick={() => onOpenDetail(applicationId)}
              >
                Detay
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}

export default ClubReviewApplicationTable;
