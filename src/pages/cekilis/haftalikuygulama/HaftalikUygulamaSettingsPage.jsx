import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createDefaultPrize,
  createDefaultSegment,
  deleteDefaultPrize,
  deleteDefaultSegment,
  getWheelGiveawaySettings,
  listDefaultPrizes,
  listDefaultSegments,
  updateDefaultPrize,
  updateDefaultSegment,
  updateWheelGiveawaySettings,
} from "../../../services/wheelGiveawayWebService";
import WeeklyGiveawaySubNav from "./components/WeeklyGiveawaySubNav";
import styles from "./HaftalikUygulamaSettingsPage.module.css";

const DASHBOARD_ROUTE = "/panel/cekilis/haftalik-uygulama";

const TABS = [
  { id: "general", label: "Genel Ayarlar" },
  { id: "prizes", label: "Varsayılan Hediyeler" },
  { id: "segments", label: "Varsayılan Çark Dilimleri" },
];

const DEFAULT_SETTINGS_FORM = {
  is_home_widget_visible: false,
  is_system_enabled: false,
  home_widget_title: "",
  home_widget_description: "",
  last_winners_popup_enabled: false,
  last_winners_popup_title: "",
  last_winners_popup_message: "",
  default_campaign_name_prefix: "",
  daily_normal_spin_limit: "1",
};

const DEFAULT_PRIZE_FORM = {
  name: "",
  description: "",
  quantity: "1",
  display_order: "1",
  is_active: true,
};

const DEFAULT_SEGMENT_FORM = {
  label: "",
  ticket_count: "0",
  probability_weight: "1",
  display_order: "1",
  is_active: true,
};

function normalizeCollection(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.results)) return value.data.results;
  return [];
}

function getFriendlyErrorMessage(error) {
  return error?.message || "İşlem şu anda tamamlanamadı.";
}

function toNumber(value, fallback = 0) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function normalizeSettingsForm(data) {
  return {
    is_home_widget_visible: Boolean(data?.is_home_widget_visible),
    is_system_enabled: Boolean(data?.is_system_enabled),
    home_widget_title: data?.home_widget_title || "",
    home_widget_description: data?.home_widget_description || "",
    last_winners_popup_enabled: Boolean(data?.last_winners_popup_enabled),
    last_winners_popup_title: data?.last_winners_popup_title || "",
    last_winners_popup_message: data?.last_winners_popup_message || "",
    default_campaign_name_prefix: data?.default_campaign_name_prefix || "",
    daily_normal_spin_limit: String(data?.daily_normal_spin_limit ?? 1),
  };
}

function getItemId(item) {
  return item?.id ?? item?.pk;
}

function StatusBadge({ isActive }) {
  return (
    <span className={`${styles.statusBadge} ${isActive ? "" : styles.statusBadgeMuted}`}>
      {isActive ? "Aktif" : "Pasif"}
    </span>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className={styles.emptyState}>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

function HaftalikUygulamaSettingsPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("general");
  const [settingsForm, setSettingsForm] = useState(DEFAULT_SETTINGS_FORM);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);
  const [isSettingsSaving, setIsSettingsSaving] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [isPrizesLoading, setIsPrizesLoading] = useState(false);
  const [hasLoadedPrizes, setHasLoadedPrizes] = useState(false);
  const [segments, setSegments] = useState([]);
  const [isSegmentsLoading, setIsSegmentsLoading] = useState(false);
  const [hasLoadedSegments, setHasLoadedSegments] = useState(false);
  const [modalState, setModalState] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isModalSaving, setIsModalSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const prizeForm = modalState?.type === "prize" ? modalState.form : DEFAULT_PRIZE_FORM;
  const segmentForm = modalState?.type === "segment" ? modalState.form : DEFAULT_SEGMENT_FORM;
  const isPrizeModal = modalState?.type === "prize";
  const isSegmentModal = modalState?.type === "segment";
  const modalTitle = useMemo(() => {
    if (!modalState) return "";
    if (modalState.type === "prize") {
      return modalState.mode === "edit" ? "Varsayılan Hediyeyi Düzenle" : "Yeni Hediye Ekle";
    }
    return modalState.mode === "edit" ? "Varsayılan Çark Dilimini Düzenle" : "Yeni Dilim Ekle";
  }, [modalState]);

  const navigateTo = (path) => {
    if (typeof onNavigate === "function") {
      onNavigate(path);
      return;
    }

    window.location.assign(path);
  };

  const loadSettings = useCallback(async () => {
    setIsSettingsLoading(true);
    setErrorMessage("");

    try {
      const settings = await getWheelGiveawaySettings();
      setSettingsForm(normalizeSettingsForm(settings));
      setHasLoadedSettings(true);
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setIsSettingsLoading(false);
    }
  }, []);

  const loadPrizes = useCallback(async () => {
    setIsPrizesLoading(true);
    setErrorMessage("");

    try {
      const response = await listDefaultPrizes();
      setPrizes(normalizeCollection(response));
      setHasLoadedPrizes(true);
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setIsPrizesLoading(false);
    }
  }, []);

  const loadSegments = useCallback(async () => {
    setIsSegmentsLoading(true);
    setErrorMessage("");

    try {
      const response = await listDefaultSegments();
      setSegments(normalizeCollection(response));
      setHasLoadedSegments(true);
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setIsSegmentsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "general" && !hasLoadedSettings) {
      loadSettings();
    }

    if (activeTab === "prizes" && !hasLoadedPrizes) {
      loadPrizes();
    }

    if (activeTab === "segments" && !hasLoadedSegments) {
      loadSegments();
    }
  }, [activeTab, hasLoadedPrizes, hasLoadedSegments, hasLoadedSettings, loadPrizes, loadSegments, loadSettings]);

  const handleSettingsChange = (event) => {
    const { checked, name, type, value } = event.target;

    setSettingsForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();

    const dailyNormalSpinLimit = Number(settingsForm.daily_normal_spin_limit);

    if (
      settingsForm.daily_normal_spin_limit === "" ||
      !Number.isInteger(dailyNormalSpinLimit) ||
      dailyNormalSpinLimit < 1 ||
      dailyNormalSpinLimit > 10
    ) {
      setErrorMessage("Günlük normal spin limiti 1 ile 10 arasında bir tam sayı olmalıdır.");
      setToastMessage("");
      return;
    }

    setIsSettingsSaving(true);
    setErrorMessage("");
    setToastMessage("");

    try {
      await updateWheelGiveawaySettings({
        ...settingsForm,
        daily_normal_spin_limit: dailyNormalSpinLimit,
      });
      setToastMessage("Ayarlar kaydedildi.");
      await loadSettings();
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setIsSettingsSaving(false);
    }
  };

  const openPrizeModal = (item = null) => {
    setModalError("");
    setModalState({
      type: "prize",
      mode: item ? "edit" : "create",
      item,
      form: item
        ? {
            name: item.name || "",
            description: item.description || "",
            quantity: `${item.quantity ?? 1}`,
            display_order: `${item.display_order ?? 1}`,
            is_active: item.is_active !== false,
          }
        : DEFAULT_PRIZE_FORM,
    });
  };

  const openSegmentModal = (item = null) => {
    setModalError("");
    setModalState({
      type: "segment",
      mode: item ? "edit" : "create",
      item,
      form: item
        ? {
            label: item.label || "",
            ticket_count: `${item.ticket_count ?? 0}`,
            probability_weight: `${item.probability_weight ?? 1}`,
            display_order: `${item.display_order ?? 1}`,
            is_active: item.is_active !== false,
          }
        : DEFAULT_SEGMENT_FORM,
    });
  };

  const closeModal = () => {
    if (isModalSaving) return;
    setModalState(null);
    setModalError("");
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

  const handleModalSubmit = async (event) => {
    event.preventDefault();

    if (!modalState) return;

    setModalError("");
    setErrorMessage("");
    setToastMessage("");
    setIsModalSaving(true);

    try {
      if (modalState.type === "prize") {
        const payload = buildPrizePayload();

        if (modalState.mode === "edit") {
          await updateDefaultPrize(getItemId(modalState.item), payload);
          setToastMessage("Varsayılan hediye güncellendi.");
        } else {
          await createDefaultPrize(payload);
          setToastMessage("Varsayılan hediye eklendi.");
        }

        await loadPrizes();
      }

      if (modalState.type === "segment") {
        const payload = buildSegmentPayload();

        if (modalState.mode === "edit") {
          await updateDefaultSegment(getItemId(modalState.item), payload);
          setToastMessage("Varsayılan çark dilimi güncellendi.");
        } else {
          await createDefaultSegment(payload);
          setToastMessage("Varsayılan çark dilimi eklendi.");
        }

        await loadSegments();
      }

      setModalState(null);
      setModalError("");
    } catch (error) {
      setModalError(getFriendlyErrorMessage(error));
    } finally {
      setIsModalSaving(false);
    }
  };

  const handleDeletePrize = async (item) => {
    if (!window.confirm("Bu varsayılan hediyeyi silmek istediğinize emin misiniz?")) {
      return;
    }

    setErrorMessage("");
    setToastMessage("");

    try {
      await deleteDefaultPrize(getItemId(item));
      setToastMessage("Varsayılan hediye silindi.");
      await loadPrizes();
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
    }
  };

  const handleDeleteSegment = async (item) => {
    if (!window.confirm("Bu varsayılan çark dilimini silmek istediğinize emin misiniz?")) {
      return;
    }

    setErrorMessage("");
    setToastMessage("");

    try {
      await deleteDefaultSegment(getItemId(item));
      setToastMessage("Varsayılan çark dilimi silindi.");
      await loadSegments();
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
    }
  };

  return (
    <section className="section">
      <div className={`container ${styles.pageShell}`}>
        <div className={styles.pageHeader}>
          <div>
            <p className="eyebrow">Haftalık Uygulama Çekilişi</p>
            <h1>Çekiliş Ayarları</h1>
            <p>
              Haftalık uygulama çekilişinin genel görünürlüğünü, varsayılan hediyelerini ve çark
              dilimlerini yönetin.
            </p>
          </div>

          <button className="btn btn-secondary" type="button" onClick={() => navigateTo(DASHBOARD_ROUTE)}>
            ← Haftalık Çekiliş Paneline Dön
          </button>
        </div>

        <WeeklyGiveawaySubNav onNavigate={onNavigate} />

        <div className={styles.tabs} role="tablist" aria-label="Çekiliş ayarları">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ""}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setErrorMessage("");
                setToastMessage("");
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

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

        {activeTab === "general" ? (
          <section className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Genel Ayarlar</h2>
                <p>Ana sayfa görünürlüğünü, sistem durumunu ve kazanan popup metinlerini yönetin.</p>
              </div>
            </div>

            {isSettingsLoading ? (
              <p className={styles.loadingText}>Ayarlar yükleniyor...</p>
            ) : (
              <form onSubmit={handleSettingsSubmit}>
                <div className={styles.formGrid}>
                  <label className={styles.checkRow}>
                    <input
                      name="is_home_widget_visible"
                      type="checkbox"
                      checked={settingsForm.is_home_widget_visible}
                      onChange={handleSettingsChange}
                    />
                    <span>Ana sayfa çekiliş kartı görünsün mü?</span>
                  </label>

                  <label className={styles.checkRow}>
                    <input
                      name="is_system_enabled"
                      type="checkbox"
                      checked={settingsForm.is_system_enabled}
                      onChange={handleSettingsChange}
                    />
                    <span>Çark sistemi aktif mi?</span>
                  </label>

                  <div className={styles.field}>
                    <label htmlFor="home-widget-title">Ana sayfa kart başlığı</label>
                    <input
                      id="home-widget-title"
                      name="home_widget_title"
                      type="text"
                      value={settingsForm.home_widget_title}
                      onChange={handleSettingsChange}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="campaign-prefix">Varsayılan kampanya adı prefix'i</label>
                    <input
                      id="campaign-prefix"
                      name="default_campaign_name_prefix"
                      type="text"
                      value={settingsForm.default_campaign_name_prefix}
                      onChange={handleSettingsChange}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="daily-normal-spin-limit">Günlük Normal Spin Limiti</label>
                    <input
                      id="daily-normal-spin-limit"
                      name="daily_normal_spin_limit"
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      value={settingsForm.daily_normal_spin_limit}
                      onChange={handleSettingsChange}
                      required
                    />
                  </div>

                  <div className={`${styles.field} ${styles.fieldWide}`}>
                    <label htmlFor="home-widget-description">Ana sayfa kart açıklaması</label>
                    <textarea
                      id="home-widget-description"
                      name="home_widget_description"
                      value={settingsForm.home_widget_description}
                      onChange={handleSettingsChange}
                    />
                  </div>

                  <label className={styles.checkRow}>
                    <input
                      name="last_winners_popup_enabled"
                      type="checkbox"
                      checked={settingsForm.last_winners_popup_enabled}
                      onChange={handleSettingsChange}
                    />
                    <span>Kazanan popup aktif mi?</span>
                  </label>

                  <div className={styles.field}>
                    <label htmlFor="popup-title">Popup başlığı</label>
                    <input
                      id="popup-title"
                      name="last_winners_popup_title"
                      type="text"
                      value={settingsForm.last_winners_popup_title}
                      onChange={handleSettingsChange}
                    />
                  </div>

                  <div className={`${styles.field} ${styles.fieldWide}`}>
                    <label htmlFor="popup-message">Popup açıklaması</label>
                    <textarea
                      id="popup-message"
                      name="last_winners_popup_message"
                      value={settingsForm.last_winners_popup_message}
                      onChange={handleSettingsChange}
                    />
                  </div>
                </div>

                <div className={styles.actions}>
                  <button className="btn btn-primary" type="submit" disabled={isSettingsSaving}>
                    {isSettingsSaving ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
              </form>
            )}
          </section>
        ) : null}

        {activeTab === "prizes" ? (
          <section className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Varsayılan Hediyeler</h2>
                <p>Yeni kampanya açılırken snapshot olarak kopyalanacak hediyeleri yönetin.</p>
              </div>
              <button className="btn btn-primary" type="button" onClick={() => openPrizeModal()}>
                + Yeni Hediye Ekle
              </button>
            </div>

            {isPrizesLoading ? (
              <p className={styles.loadingText}>Varsayılan hediyeler yükleniyor...</p>
            ) : prizes.length ? (
              <div className={styles.tableScroll}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Sıra</th>
                      <th>Hediye Adı</th>
                      <th>Açıklama</th>
                      <th>Adet</th>
                      <th>Aktif/Pasif</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prizes.map((item) => (
                      <tr key={getItemId(item)}>
                        <td>{item.display_order ?? "-"}</td>
                        <td>{item.name || "-"}</td>
                        <td>{item.description || "-"}</td>
                        <td>{item.quantity ?? "-"}</td>
                        <td>
                          <StatusBadge isActive={item.is_active !== false} />
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button className="btn btn-secondary" type="button" onClick={() => openPrizeModal(item)}>
                              Düzenle
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={() => handleDeletePrize(item)}>
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="Henüz varsayılan hediye eklenmemiş."
                description="Yeni çekiliş başlatmadan önce en az bir aktif hediye ekleyin."
              />
            )}
          </section>
        ) : null}

        {activeTab === "segments" ? (
          <section className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Varsayılan Çark Dilimleri</h2>
                <p>Yeni kampanya açıldığında kullanılacak çark segmentlerini yönetin.</p>
              </div>
              <button className="btn btn-primary" type="button" onClick={() => openSegmentModal()}>
                + Yeni Dilim Ekle
              </button>
            </div>

            {isSegmentsLoading ? (
              <p className={styles.loadingText}>Varsayılan çark dilimleri yükleniyor...</p>
            ) : segments.length ? (
              <div className={styles.tableScroll}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Sıra</th>
                      <th>Dilim Etiketi</th>
                      <th>Bilet Sayısı</th>
                      <th>Olasılık Ağırlığı</th>
                      <th>Aktif/Pasif</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segments.map((item) => (
                      <tr key={getItemId(item)}>
                        <td>{item.display_order ?? "-"}</td>
                        <td>{item.label || "-"}</td>
                        <td>{item.ticket_count ?? "-"}</td>
                        <td>{item.probability_weight ?? "-"}</td>
                        <td>
                          <StatusBadge isActive={item.is_active !== false} />
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button className="btn btn-secondary" type="button" onClick={() => openSegmentModal(item)}>
                              Düzenle
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={() => handleDeleteSegment(item)}>
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="Henüz varsayılan çark dilimi eklenmemiş."
                description="Yeni çekiliş başlatmadan önce en az bir aktif dilim ekleyin."
              />
            )}
          </section>
        ) : null}
      </div>

      {modalState ? (
        <div className={styles.modalBackdrop} role="presentation" onClick={closeModal}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 id="settings-modal-title">{modalTitle}</h2>
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

            <form onSubmit={handleModalSubmit}>
              <div className={styles.formGrid}>
                {isPrizeModal ? (
                  <>
                    <div className={styles.field}>
                      <label htmlFor="prize-name">Hediye adı</label>
                      <input
                        id="prize-name"
                        name="name"
                        type="text"
                        value={prizeForm.name}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="prize-quantity">Adet</label>
                      <input
                        id="prize-quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={prizeForm.quantity}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                    </div>
                    <div className={`${styles.field} ${styles.fieldWide}`}>
                      <label htmlFor="prize-description">Açıklama</label>
                      <textarea
                        id="prize-description"
                        name="description"
                        value={prizeForm.description}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="prize-order">Sıra</label>
                      <input
                        id="prize-order"
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
                      <label htmlFor="segment-label">Dilim etiketi</label>
                      <input
                        id="segment-label"
                        name="label"
                        type="text"
                        value={segmentForm.label}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="segment-ticket-count">Bilet sayısı</label>
                      <input
                        id="segment-ticket-count"
                        name="ticket_count"
                        type="number"
                        min="0"
                        value={segmentForm.ticket_count}
                        onChange={handleModalFieldChange}
                        disabled={isModalSaving}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="segment-weight">Olasılık ağırlığı</label>
                      <input
                        id="segment-weight"
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
                      <label htmlFor="segment-order">Sıra</label>
                      <input
                        id="segment-order"
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

export default HaftalikUygulamaSettingsPage;
