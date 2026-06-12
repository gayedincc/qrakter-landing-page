import { useCallback, useEffect, useState } from "react";
import {
  createCampaignPrize,
  createCampaignSegment,
  deleteCampaignPrize,
  deleteCampaignSegment,
  getGiveawayCampaign,
  listCampaignPrizes,
  listCampaignSegments,
  updateCampaignPrize,
  updateCampaignSegment,
  updateGiveawayCampaign,
} from "../../../services/wheelGiveawayWebService";
import WeeklyGiveawaySubNav from "./components/WeeklyGiveawaySubNav";
import styles from "./HaftalikUygulamaCampaignsPage.module.css";

const CAMPAIGNS_ROUTE = "/panel/cekilis/haftalik-uygulama/cekilisler";
const END_DATE_FIELDS = ["ends_at", "end_date", "finish_at"];
const LOCKED_STATUSES = ["drawn", "archived"];

const EMPTY_PRIZE_FORM = {
  name: "",
  description: "",
  quantity: "1",
  display_order: "0",
  is_active: true,
};

const EMPTY_SEGMENT_FORM = {
  label: "",
  ticket_count: "0",
  probability_weight: "1",
  display_order: "0",
  is_active: true,
};

function normalizeCollection(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.results)) return value.data.results;
  return [];
}

function getCampaignId(campaign) {
  return campaign?.id ?? campaign?.pk;
}

function getItemId(item) {
  return item?.id ?? item?.pk ?? null;
}

function getCampaignName(campaign) {
  return campaign?.name || campaign?.title || campaign?.campaign_name || `Kampanya #${getCampaignId(campaign) || "-"}`;
}

function findEndDateField(campaign) {
  if (!campaign || typeof campaign !== "object") {
    return null;
  }

  return END_DATE_FIELDS.find((field) => Object.prototype.hasOwnProperty.call(campaign, field)) || null;
}

function toDateTimeInputValue(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function toIsoDateValue(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function toNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function getDisplayValue(value) {
  return value === null || value === undefined || value === "" ? "-" : value;
}

function formatBoolean(value) {
  if (value === true) return "Aktif";
  if (value === false) return "Pasif";
  return "-";
}

function getPrizeName(prize) {
  return prize?.name || prize?.title || prize?.prize_name || "-";
}

function getSegmentLabel(segment) {
  return segment?.label || segment?.name || segment?.title || "-";
}

function ResourceTable({ columns, emptyMessage, items, renderRow }) {
  if (!items.length) {
    return (
      <div className={styles.emptyState}>
        <strong>{emptyMessage}</strong>
      </div>
    );
  }

  return (
    <div className={styles.tableScroll}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>{items.map(renderRow)}</tbody>
      </table>
    </div>
  );
}

function HaftalikUygulamaCampaignEditPage({ campaignId, onNavigate }) {
  const [campaign, setCampaign] = useState(null);
  const [campaignPrizes, setCampaignPrizes] = useState([]);
  const [campaignSegments, setCampaignSegments] = useState([]);
  const [endDateField, setEndDateField] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    endsAt: "",
  });
  const [modalState, setModalState] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingCampaign, setIsSavingCampaign] = useState(false);
  const [isModalSaving, setIsModalSaving] = useState(false);
  const [deletingResourceId, setDeletingResourceId] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isResourceEditingLocked = LOCKED_STATUSES.includes(campaign?.status);
  const prizeForm = modalState?.type === "prize" ? modalState.form : EMPTY_PRIZE_FORM;
  const segmentForm = modalState?.type === "segment" ? modalState.form : EMPTY_SEGMENT_FORM;
  const isPrizeModal = modalState?.type === "prize";
  const isSegmentModal = modalState?.type === "segment";
  const modalTitle =
    modalState?.type === "prize"
      ? modalState.mode === "edit"
        ? "Hediyeyi Düzenle"
        : "Yeni Hediye Ekle"
      : modalState?.mode === "edit"
        ? "Çark Dilimini Düzenle"
        : "Yeni Çark Dilimi Ekle";

  const navigateTo = (path) => {
    if (typeof onNavigate === "function") {
      onNavigate(path);
      return;
    }

    window.location.assign(path);
  };

  const reloadPrizes = useCallback(async () => {
    const nextPrizes = await listCampaignPrizes(campaignId);
    setCampaignPrizes(normalizeCollection(nextPrizes));
  }, [campaignId]);

  const reloadSegments = useCallback(async () => {
    const nextSegments = await listCampaignSegments(campaignId);
    setCampaignSegments(normalizeCollection(nextSegments));
  }, [campaignId]);

  const loadCampaign = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [nextCampaign, nextPrizes, nextSegments] = await Promise.all([
        getGiveawayCampaign(campaignId),
        listCampaignPrizes(campaignId),
        listCampaignSegments(campaignId),
      ]);
      const nextEndDateField = findEndDateField(nextCampaign);

      setCampaign(nextCampaign);
      setCampaignPrizes(normalizeCollection(nextPrizes));
      setCampaignSegments(normalizeCollection(nextSegments));
      setEndDateField(nextEndDateField);
      setFormValues({
        name: getCampaignName(nextCampaign),
        description: nextCampaign?.description || "",
        endsAt: nextEndDateField ? toDateTimeInputValue(nextCampaign[nextEndDateField]) : "",
      });
    } catch (error) {
      setErrorMessage(error?.message || "Çekiliş bilgileri şu anda yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleModalFieldChange = (event) => {
    const { checked, name, type, value } = event.target;

    setModalState((currentState) => ({
      ...currentState,
      form: {
        ...currentState.form,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleCampaignSubmit = async (event) => {
    event.preventDefault();

    const name = formValues.name.trim();

    if (!name) {
      setErrorMessage("Kampanya adı zorunludur.");
      return;
    }

    const payload = {
      name,
      description: formValues.description.trim(),
    };

    if (endDateField) {
      if (formValues.endsAt) {
        const endDateValue = toIsoDateValue(formValues.endsAt);

        if (!endDateValue) {
          setErrorMessage("Bitiş tarihi geçerli bir tarih olmalıdır.");
          return;
        }

        payload[endDateField] = endDateValue;
      }
    }

    setIsSavingCampaign(true);
    setErrorMessage("");
    setToastMessage("");

    try {
      const updatedCampaign = await updateGiveawayCampaign(campaignId, payload);
      setCampaign(updatedCampaign || campaign);
      setToastMessage("Çekiliş bilgileri güncellendi.");
      await loadCampaign();
    } catch (error) {
      setErrorMessage(error?.message || "Çekiliş şu anda güncellenemedi.");
    } finally {
      setIsSavingCampaign(false);
    }
  };

  const closeModal = () => {
    if (isModalSaving) return;
    setModalState(null);
    setModalError("");
  };

  const openPrizeModal = (prize = null) => {
    if (isResourceEditingLocked) return;

    setModalError("");
    setModalState({
      type: "prize",
      mode: prize ? "edit" : "create",
      item: prize,
      form: prize
        ? {
            name: prize?.name || "",
            description: prize?.description || "",
            quantity: `${prize?.quantity ?? 1}`,
            display_order: `${prize?.display_order ?? 0}`,
            is_active: prize?.is_active !== false,
          }
        : { ...EMPTY_PRIZE_FORM },
    });
  };

  const openSegmentModal = (segment = null) => {
    if (isResourceEditingLocked) return;

    setModalError("");
    setModalState({
      type: "segment",
      mode: segment ? "edit" : "create",
      item: segment,
      form: segment
        ? {
            label: segment?.label || "",
            ticket_count: `${segment?.ticket_count ?? 0}`,
            probability_weight: `${segment?.probability_weight ?? 1}`,
            display_order: `${segment?.display_order ?? 0}`,
            is_active: segment?.is_active !== false,
          }
        : { ...EMPTY_SEGMENT_FORM },
    });
  };

  const buildPrizePayload = () => {
    const name = prizeForm.name.trim();
    const quantity = toNumber(prizeForm.quantity, NaN);
    const displayOrder = toNumber(prizeForm.display_order, NaN);

    if (!name) {
      throw new Error("Hediye adı boş olamaz.");
    }

    if (!Number.isFinite(quantity) || quantity < 1) {
      throw new Error("Adet en az 1 olmalıdır.");
    }

    if (!Number.isFinite(displayOrder)) {
      throw new Error("Sıra sayısal olmalıdır.");
    }

    return {
      name,
      description: prizeForm.description.trim(),
      quantity,
      display_order: displayOrder,
      is_active: prizeForm.is_active,
    };
  };

  const buildSegmentPayload = () => {
    const label = segmentForm.label.trim();
    const ticketCount = toNumber(segmentForm.ticket_count, NaN);
    const probabilityWeight = toNumber(segmentForm.probability_weight, NaN);
    const displayOrder = toNumber(segmentForm.display_order, NaN);

    if (!label) {
      throw new Error("Dilim etiketi boş olamaz.");
    }

    if (!Number.isFinite(ticketCount) || ticketCount < 0) {
      throw new Error("Bilet sayısı en az 0 olmalıdır.");
    }

    if (!Number.isFinite(probabilityWeight) || probabilityWeight < 0) {
      throw new Error("Olasılık ağırlığı en az 0 olmalıdır.");
    }

    if (!Number.isFinite(displayOrder)) {
      throw new Error("Sıra sayısal olmalıdır.");
    }

    return {
      label,
      ticket_count: ticketCount,
      probability_weight: probabilityWeight,
      display_order: displayOrder,
      is_active: segmentForm.is_active,
    };
  };

  const handleResourceModalSubmit = async (event) => {
    event.preventDefault();

    if (!modalState || isResourceEditingLocked) return;

    setIsModalSaving(true);
    setModalError("");
    setErrorMessage("");
    setToastMessage("");

    try {
      if (modalState.type === "prize") {
        const payload = buildPrizePayload();

        if (modalState.mode === "edit") {
          await updateCampaignPrize(getItemId(modalState.item), payload);
          setToastMessage("Hediye güncellendi.");
        } else {
          await createCampaignPrize(campaignId, payload);
          setToastMessage("Hediye eklendi.");
        }

        await reloadPrizes();
      }

      if (modalState.type === "segment") {
        const payload = buildSegmentPayload();

        if (modalState.mode === "edit") {
          await updateCampaignSegment(getItemId(modalState.item), payload);
          setToastMessage("Çark dilimi güncellendi.");
        } else {
          await createCampaignSegment(campaignId, payload);
          setToastMessage("Çark dilimi eklendi.");
        }

        await reloadSegments();
      }

      setModalState(null);
      setModalError("");
    } catch (error) {
      setModalError(error?.message || "İşlem şu anda tamamlanamadı.");
    } finally {
      setIsModalSaving(false);
    }
  };

  const handleDeletePrize = async (prizeId) => {
    if (isResourceEditingLocked || !prizeId) return;

    if (!window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
      return;
    }

    setDeletingResourceId(`prize-${prizeId}`);
    setErrorMessage("");
    setToastMessage("");

    try {
      await deleteCampaignPrize(prizeId);
      setToastMessage("Hediye silindi.");
      await reloadPrizes();
    } catch (error) {
      setErrorMessage(error?.message || "Hediye şu anda silinemedi.");
    } finally {
      setDeletingResourceId("");
    }
  };

  const handleDeleteSegment = async (segmentId) => {
    if (isResourceEditingLocked || !segmentId) return;

    if (!window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
      return;
    }

    setDeletingResourceId(`segment-${segmentId}`);
    setErrorMessage("");
    setToastMessage("");

    try {
      await deleteCampaignSegment(segmentId);
      setToastMessage("Çark dilimi silindi.");
      await reloadSegments();
    } catch (error) {
      setErrorMessage(error?.message || "Çark dilimi şu anda silinemedi.");
    } finally {
      setDeletingResourceId("");
    }
  };

  return (
    <section className="section">
      <div className={`container ${styles.pageShell}`}>
        <div className={styles.pageHeader}>
          <div>
            <p className="eyebrow">Haftalık Uygulama Çekilişi</p>
            <h1>Çekiliş Düzenle</h1>
            <p>{campaign ? getCampaignName(campaign) : `Kampanya #${campaignId}`}</p>
          </div>

          <div className={styles.headerActions}>
            <button className="btn btn-secondary" type="button" onClick={() => navigateTo(CAMPAIGNS_ROUTE)}>
              ← Çekilişlere Dön
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => navigateTo(`${CAMPAIGNS_ROUTE}/${campaignId}`)}>
              Detay
            </button>
          </div>
        </div>

        <WeeklyGiveawaySubNav onNavigate={onNavigate} />

        {toastMessage ? (
          <div className={styles.toast} role="status">
            {toastMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className={styles.errorBanner} role="alert">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <section className={styles.panel}>
            <p className={styles.loadingText}>Çekiliş bilgileri yükleniyor...</p>
          </section>
        ) : !campaign ? (
          <section className={styles.panel}>
            <div className={styles.emptyState}>
              <strong>Çekiliş bilgileri bulunamadı.</strong>
            </div>
          </section>
        ) : (
          <>
            <section className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Kampanya Bilgileri</h2>
                </div>
              </div>

              <form onSubmit={handleCampaignSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label htmlFor="campaign-name">Kampanya adı</label>
                    <input
                      id="campaign-name"
                      name="name"
                      type="text"
                      value={formValues.name}
                      onChange={handleInputChange}
                      disabled={isSavingCampaign}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="campaign-ends-at">Bitiş tarihi</label>
                    <input
                      id="campaign-ends-at"
                      name="endsAt"
                      type="datetime-local"
                      value={formValues.endsAt}
                      onChange={handleInputChange}
                      disabled={isSavingCampaign || !endDateField}
                    />
                  </div>

                  <div className={`${styles.field} ${styles.fieldWide}`}>
                    <label htmlFor="campaign-description">Açıklama</label>
                    <textarea
                      id="campaign-description"
                      name="description"
                      value={formValues.description}
                      onChange={handleInputChange}
                      disabled={isSavingCampaign}
                    />
                  </div>
                </div>

                {!endDateField ? (
                  <div className={styles.notice}>
                    Bu kampanya response'unda bitiş tarihi alanı bulunmadığı için tarih güncellemesi gönderilmeyecek.
                  </div>
                ) : null}

                <div className={styles.actions}>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => navigateTo(`${CAMPAIGNS_ROUTE}/${campaignId}`)}
                    disabled={isSavingCampaign}
                  >
                    Vazgeç
                  </button>
                  <button className="btn btn-primary" type="submit" disabled={isSavingCampaign}>
                    {isSavingCampaign ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
              </form>
            </section>

            {isResourceEditingLocked ? (
              <div className={styles.notice}>
                Tamamlanmış veya arşivlenmiş çekilişlerde hediye ve çark dilimleri düzenlenemez.
              </div>
            ) : null}

            <section className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Kampanya Hediyeleri</h2>
                </div>
                {!isResourceEditingLocked ? (
                  <button className="btn btn-primary" type="button" onClick={() => openPrizeModal()}>
                    + Hediye Ekle
                  </button>
                ) : null}
              </div>

              <ResourceTable
                emptyMessage="Bu kampanyaya ait hediye bulunmuyor."
                items={campaignPrizes}
                columns={["Sıra", "Hediye Adı", "Açıklama", "Adet", "Aktif/Pasif", "İşlemler"]}
                renderRow={(prize, index) => {
                  const prizeId = getItemId(prize);

                  return (
                    <tr key={prizeId || `prize-${index}`}>
                      <td>{getDisplayValue(prize.display_order)}</td>
                      <td>{getPrizeName(prize)}</td>
                      <td>{getDisplayValue(prize.description)}</td>
                      <td>{getDisplayValue(prize.quantity)}</td>
                      <td>{formatBoolean(prize.is_active)}</td>
                      <td>
                        <div className={styles.compactActions}>
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={() => openPrizeModal(prize)}
                            disabled={isResourceEditingLocked || !prizeId}
                          >
                            Düzenle
                          </button>
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={() => handleDeletePrize(prizeId)}
                            disabled={isResourceEditingLocked || !prizeId || deletingResourceId === `prize-${prizeId}`}
                          >
                            {deletingResourceId === `prize-${prizeId}` ? "Siliniyor..." : "Sil"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }}
              />
            </section>

            <section className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Kampanya Çark Dilimleri</h2>
                </div>
                {!isResourceEditingLocked ? (
                  <button className="btn btn-primary" type="button" onClick={() => openSegmentModal()}>
                    + Dilim Ekle
                  </button>
                ) : null}
              </div>

              <ResourceTable
                emptyMessage="Bu kampanyaya ait çark dilimi bulunmuyor."
                items={campaignSegments}
                columns={["Sıra", "Dilim Etiketi", "Bilet Sayısı", "Olasılık Ağırlığı", "Aktif/Pasif", "İşlemler"]}
                renderRow={(segment, index) => {
                  const segmentId = getItemId(segment);

                  return (
                    <tr key={segmentId || `segment-${index}`}>
                      <td>{getDisplayValue(segment.display_order)}</td>
                      <td>{getSegmentLabel(segment)}</td>
                      <td>{getDisplayValue(segment.ticket_count)}</td>
                      <td>{getDisplayValue(segment.probability_weight)}</td>
                      <td>{formatBoolean(segment.is_active)}</td>
                      <td>
                        <div className={styles.compactActions}>
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={() => openSegmentModal(segment)}
                            disabled={isResourceEditingLocked || !segmentId}
                          >
                            Düzenle
                          </button>
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={() => handleDeleteSegment(segmentId)}
                            disabled={isResourceEditingLocked || !segmentId || deletingResourceId === `segment-${segmentId}`}
                          >
                            {deletingResourceId === `segment-${segmentId}` ? "Siliniyor..." : "Sil"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }}
              />
            </section>
          </>
        )}
      </div>

      {modalState ? (
        <div className={styles.modalBackdrop} role="presentation" onClick={closeModal}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="campaign-resource-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 id="campaign-resource-modal-title">{modalTitle}</h2>
              <button
                className={styles.iconButton}
                type="button"
                onClick={closeModal}
                disabled={isModalSaving}
                aria-label="Kapat"
              >
                ×
              </button>
            </div>

            {modalError ? (
              <div className={styles.errorBanner} role="alert">
                {modalError}
              </div>
            ) : null}

            <form onSubmit={handleResourceModalSubmit}>
              <div className={styles.formGrid}>
                {isPrizeModal ? (
                  <>
                    <div className={styles.field}>
                      <label htmlFor="campaign-prize-name">Hediye adı</label>
                      <input
                        id="campaign-prize-name"
                        name="name"
                        type="text"
                        value={prizeForm.name}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="campaign-prize-quantity">Adet</label>
                      <input
                        id="campaign-prize-quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={prizeForm.quantity}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                    </div>
                    <div className={`${styles.field} ${styles.fieldWide}`}>
                      <label htmlFor="campaign-prize-description">Açıklama</label>
                      <textarea
                        id="campaign-prize-description"
                        name="description"
                        value={prizeForm.description}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="campaign-prize-order">Sıra</label>
                      <input
                        id="campaign-prize-order"
                        name="display_order"
                        type="number"
                        value={prizeForm.display_order}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                    </div>
                    <label className={styles.checkRow}>
                      <input
                        name="is_active"
                        type="checkbox"
                        checked={prizeForm.is_active}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                      <span>Aktif mi?</span>
                    </label>
                  </>
                ) : null}

                {isSegmentModal ? (
                  <>
                    <div className={styles.field}>
                      <label htmlFor="campaign-segment-label">Dilim etiketi</label>
                      <input
                        id="campaign-segment-label"
                        name="label"
                        type="text"
                        value={segmentForm.label}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="campaign-segment-ticket-count">Bilet sayısı</label>
                      <input
                        id="campaign-segment-ticket-count"
                        name="ticket_count"
                        type="number"
                        min="0"
                        value={segmentForm.ticket_count}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="campaign-segment-weight">Olasılık ağırlığı</label>
                      <input
                        id="campaign-segment-weight"
                        name="probability_weight"
                        type="number"
                        min="0"
                        step="any"
                        value={segmentForm.probability_weight}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="campaign-segment-order">Sıra</label>
                      <input
                        id="campaign-segment-order"
                        name="display_order"
                        type="number"
                        value={segmentForm.display_order}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                    </div>
                    <label className={styles.checkRow}>
                      <input
                        name="is_active"
                        type="checkbox"
                        checked={segmentForm.is_active}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                      <span>Aktif mi?</span>
                    </label>
                  </>
                ) : null}
              </div>

              <div className={styles.actions}>
                <button className="btn btn-secondary" type="button" onClick={closeModal} disabled={isModalSaving}>
                  Vazgeç
                </button>
                <button className="btn btn-primary" type="submit" disabled={isModalSaving}>
                  {isModalSaving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default HaftalikUygulamaCampaignEditPage;
