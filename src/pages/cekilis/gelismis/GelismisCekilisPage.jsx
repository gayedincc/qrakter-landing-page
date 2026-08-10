import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getRaffleMeta,
  listRaffles,
  createRaffle,
  getRaffle,
  updateRaffle,
  deleteRaffle,
  addCriterion,
  deleteCriterion,
  addPrize,
  deletePrize,
  previewPool,
  buildPool,
  getEntries,
  searchUsers,
  addManualEntry,
  deleteEntry,
  drawRaffle,
  getWinners,
} from "../../../services/raffleService";
import "../../../styles/cekilis-gelismis.css";

const STATUS_LABEL = { draft: "Taslak", pool_ready: "Havuz Hazır", drawn: "Çekildi" };

/** Kriter tipine göre boş parametre şablonu */
function emptyParams(type) {
  switch (type) {
    case "city_coord": return { provinces: [], source: "any" };
    case "city_license": return { cities: [] };
    case "date_joined": return { start: "", end: "" };
    case "club": return { any_club: false, club_ids: [] };
    case "field_filled": return { fields: [] };
    case "activity": return { min_tickets: "", active_days: "", played_minigame: false };
    case "profile_complete": return {};
    default: return {};
  }
}

function criterionSummary(c, meta) {
  const p = c.params || {};
  switch (c.criterion_type) {
    case "city_coord": return `İller: ${(p.provinces || []).join(", ") || "-"} (${p.source || "any"})`;
    case "city_license": return `Ehliyet ili: ${(p.cities || []).join(", ") || "-"}`;
    case "date_joined": return `Kayıt: ${p.start || "…"} – ${p.end || "…"}`;
    case "club": {
      if (p.any_club) return "Herhangi bir kulübe üye";
      const names = (p.club_ids || []).map((id) => (meta?.clubs || []).find((k) => k.id === id)?.name || id);
      return `Kulüp: ${names.join(", ") || "-"}`;
    }
    case "field_filled": return `Dolu alan: ${(p.fields || []).join(", ") || "-"}`;
    case "activity": {
      const bits = [];
      if (p.min_tickets) bits.push(`≥${p.min_tickets} bilet`);
      if (p.active_days) bits.push(`son ${p.active_days} gün aktif`);
      if (p.played_minigame) bits.push("oyun oynamış");
      return bits.join(" · ") || "Aktiflik";
    }
    case "profile_complete": return "Profil/çekiliş uygunluğu";
    default: return c.criterion_type;
  }
}

export default function GelismisCekilisPage({ onNavigate }) {
  const [meta, setMeta] = useState(null);
  const [raffles, setRaffles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [raffle, setRaffle] = useState(null);
  const [entries, setEntries] = useState([]);
  const [winners, setWinners] = useState([]);
  const [previewCount, setPreviewCount] = useState(null);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Yeni çekiliş formu
  const [newName, setNewName] = useState("");

  // Kriter formu
  const [critType, setCritType] = useState("city_coord");
  const [critParams, setCritParams] = useState(emptyParams("city_coord"));

  // Ödül formu
  const [prizeName, setPrizeName] = useState("");
  const [prizeQty, setPrizeQty] = useState(1);

  // Manuel arama
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };
  const fail = (e) => setError(e?.message || "İşlem başarısız.");

  const loadRaffles = useCallback(async () => {
    try { setRaffles(await listRaffles() || []); } catch (e) { fail(e); }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [m] = await Promise.all([getRaffleMeta()]);
        setMeta(m);
        await loadRaffles();
      } catch (e) { fail(e); } finally { setLoading(false); }
    })();
  }, [loadRaffles]);

  const loadDetail = useCallback(async (id) => {
    setError("");
    try {
      const [r, entsRes, winsRes] = await Promise.all([
        getRaffle(id),
        getEntries(id).catch(() => ({ entries: [] })),
        getWinners(id).catch(() => ({ groups: [] })),
      ]);
      setRaffle(r);
      setEntries(entsRes?.entries || []);
      // Backend kazananları ödül bazında gruplar; tablo için düzleştiriyoruz.
      setWinners(
        (winsRes?.groups || []).flatMap((g) =>
          (g.winners || []).map((w) => ({ ...w, prize_name: w.prize_name || g.prize_name })),
        ),
      );
      setPreviewCount(null);
    } catch (e) { fail(e); }
  }, []);

  useEffect(() => { if (selectedId) loadDetail(selectedId); }, [selectedId, loadDetail]);

  const handleCreate = async () => {
    if (!newName.trim() || busy) return;
    setBusy("create"); setError("");
    try {
      const r = await createRaffle({ name: newName.trim(), chance_model: "equal", criteria_logic: "and" });
      setNewName(""); await loadRaffles(); setSelectedId(r.id);
      showToast("Çekiliş oluşturuldu");
    } catch (e) { fail(e); } finally { setBusy(""); }
  };

  const handleUpdateField = async (patch) => {
    if (!raffle) return;
    try { const r = await updateRaffle(raffle.id, patch); setRaffle(r); loadRaffles(); }
    catch (e) { fail(e); }
  };

  const handleDeleteRaffle = async (id) => {
    if (!window.confirm("Bu çekilişi silmek istediğine emin misin?")) return;
    try {
      await deleteRaffle(id);
      if (selectedId === id) { setSelectedId(null); setRaffle(null); }
      await loadRaffles(); showToast("Silindi");
    } catch (e) { fail(e); }
  };

  const handleAddCriterion = async () => {
    if (!raffle || busy) return;
    setBusy("crit"); setError("");
    try {
      await addCriterion(raffle.id, { criterion_type: critType, params: critParams });
      setCritParams(emptyParams(critType));
      await loadDetail(raffle.id);
      showToast("Kriter eklendi");
    } catch (e) { fail(e); } finally { setBusy(""); }
  };

  const handleDeleteCriterion = async (cid) => {
    try { await deleteCriterion(raffle.id, cid); await loadDetail(raffle.id); } catch (e) { fail(e); }
  };

  const handlePreview = async () => {
    if (!raffle) return;
    setBusy("preview"); setError("");
    try { const r = await previewPool(raffle.id); setPreviewCount(r.count); } catch (e) { fail(e); } finally { setBusy(""); }
  };

  const handleBuildPool = async () => {
    if (!raffle || busy) return;
    setBusy("pool"); setError("");
    try {
      const r = await buildPool(raffle.id);
      await loadDetail(raffle.id);
      showToast(`Havuz hazır: ${r.entry_count} katılımcı`);
    } catch (e) { fail(e); } finally { setBusy(""); }
  };

  const handleAddPrize = async () => {
    if (!raffle || !prizeName.trim() || busy) return;
    setBusy("prize"); setError("");
    try {
      await addPrize(raffle.id, { name: prizeName.trim(), quantity: Number(prizeQty) || 1 });
      setPrizeName(""); setPrizeQty(1); await loadDetail(raffle.id);
    } catch (e) { fail(e); } finally { setBusy(""); }
  };

  const handleDeletePrize = async (pid) => {
    try { await deletePrize(raffle.id, pid); await loadDetail(raffle.id); } catch (e) { fail(e); }
  };

  const handleSearch = async () => {
    if (!searchQ.trim()) return;
    setBusy("search"); setError("");
    try { setSearchResults(await searchUsers(searchQ.trim()) || []); } catch (e) { fail(e); } finally { setBusy(""); }
  };

  const handleAddManual = async (userId) => {
    try { await addManualEntry(raffle.id, userId); await loadDetail(raffle.id); showToast("Katılımcı eklendi"); }
    catch (e) { fail(e); }
  };

  const handleDeleteEntry = async (entryId) => {
    try { await deleteEntry(raffle.id, entryId); await loadDetail(raffle.id); } catch (e) { fail(e); }
  };

  const handleDraw = async () => {
    if (!raffle || busy) return;
    if (!window.confirm("Çekilişi yapmak istediğine emin misin? Kazananlar belirlenecek.")) return;
    setBusy("draw"); setError("");
    try {
      await drawRaffle(raffle.id);
      await loadDetail(raffle.id);
      showToast("Çekiliş tamamlandı");
    } catch (e) { fail(e); } finally { setBusy(""); }
  };

  const isDraft = raffle?.status === "draft";
  const poolReady = raffle?.status === "pool_ready";
  const drawn = raffle?.status === "drawn";
  const manualEntries = useMemo(() => entries.filter((e) => e.source === "manual"), [entries]);

  return (
    <div className="rf-wrap">
      <header className="rf-head">
        <button className="rf-back" onClick={() => onNavigate?.("/panel/cekilis")}>← Çekiliş menüsü</button>
        <h1>Gelişmiş Çekiliş</h1>
        <p>Kriterlerle katılımcı havuzu oluştur, ödülleri tanımla, çekilişi yap.</p>
      </header>

      {error ? <div className="rf-error">{error} <button onClick={() => setError("")}>×</button></div> : null}
      {toast ? <div className="rf-toast">{toast}</div> : null}

      <div className="rf-layout">
        {/* Sol: çekiliş listesi */}
        <aside className="rf-list">
          <div className="rf-new">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Yeni çekiliş adı" />
            <button className="rf-btn primary" onClick={handleCreate} disabled={busy === "create"}>Oluştur</button>
          </div>
          {loading ? <p className="rf-muted">Yükleniyor…</p> : null}
          {raffles.map((r) => (
            <button
              key={r.id}
              className={`rf-item ${selectedId === r.id ? "active" : ""}`}
              onClick={() => setSelectedId(r.id)}
            >
              <span className="rf-item-name">{r.name}</span>
              <span className={`rf-badge s-${r.status}`}>{STATUS_LABEL[r.status] || r.status}</span>
            </button>
          ))}
          {!loading && raffles.length === 0 ? <p className="rf-muted">Henüz çekiliş yok.</p> : null}
        </aside>

        {/* Sağ: detay */}
        <main className="rf-detail">
          {!raffle ? (
            <p className="rf-muted rf-empty">Soldan bir çekiliş seç veya yeni oluştur.</p>
          ) : (
            <>
              <div className="rf-detail-head">
                <div>
                  <h2>{raffle.name}</h2>
                  <span className={`rf-badge s-${raffle.status}`}>{STATUS_LABEL[raffle.status]}</span>
                  <span className="rf-count">{raffle.entry_count} katılımcı</span>
                </div>
                <button className="rf-btn danger ghost" onClick={() => handleDeleteRaffle(raffle.id)}>Sil</button>
              </div>

              {/* Ayarlar */}
              <section className="rf-card">
                <h3>Ayarlar</h3>
                <div className="rf-row">
                  <label>Şans modeli</label>
                  <select
                    value={raffle.chance_model}
                    disabled={!isDraft}
                    onChange={(e) => handleUpdateField({ chance_model: e.target.value })}
                  >
                    {(meta?.chance_models || []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="rf-row">
                  <label>Kriter mantığı</label>
                  <select
                    value={raffle.criteria_logic}
                    disabled={!isDraft}
                    onChange={(e) => handleUpdateField({ criteria_logic: e.target.value })}
                  >
                    {(meta?.criteria_logics || []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                {!isDraft ? <p className="rf-note">Havuz oluşturulduktan sonra ayarlar kilitlenir.</p> : null}
              </section>

              {/* Kriterler */}
              <section className="rf-card">
                <h3>Kriterler ({raffle.criteria_logic === "and" ? "hepsi birlikte" : "herhangi biri"})</h3>
                <ul className="rf-chips">
                  {raffle.criteria.map((c) => (
                    <li key={c.id} className="rf-chip">
                      <span>{criterionSummary(c, meta)}</span>
                      {isDraft ? <button onClick={() => handleDeleteCriterion(c.id)}>×</button> : null}
                    </li>
                  ))}
                  {raffle.criteria.length === 0 ? <li className="rf-muted">Kriter yok — tüm kullanıcılar havuza girer.</li> : null}
                </ul>

                {isDraft ? (
                  <div className="rf-crit-form">
                    <select value={critType} onChange={(e) => { setCritType(e.target.value); setCritParams(emptyParams(e.target.value)); }}>
                      {(meta?.criterion_types || []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <CriterionParams type={critType} params={critParams} setParams={setCritParams} meta={meta} />
                    <button className="rf-btn" onClick={handleAddCriterion} disabled={busy === "crit"}>+ Kriter ekle</button>
                  </div>
                ) : null}

                <div className="rf-preview">
                  <button className="rf-btn ghost" onClick={handlePreview} disabled={busy === "preview"}>
                    {busy === "preview" ? "Hesaplanıyor…" : "Katılımcıyı önizle"}
                  </button>
                  {previewCount != null ? <span className="rf-preview-count">{previewCount} kişi kriterlere uyuyor</span> : null}
                </div>
              </section>

              {/* Ödüller */}
              <section className="rf-card">
                <h3>Ödüller</h3>
                <ul className="rf-prizes">
                  {raffle.prizes.map((p) => (
                    <li key={p.id}>
                      <span>{p.name} <em>×{p.quantity}</em></span>
                      {!drawn ? <button onClick={() => handleDeletePrize(p.id)}>×</button> : null}
                    </li>
                  ))}
                  {raffle.prizes.length === 0 ? <li className="rf-muted">Ödül eklenmemiş.</li> : null}
                </ul>
                {!drawn ? (
                  <div className="rf-prize-form">
                    <input value={prizeName} onChange={(e) => setPrizeName(e.target.value)} placeholder="Ödül adı" />
                    <input type="number" min="1" value={prizeQty} onChange={(e) => setPrizeQty(e.target.value)} className="rf-qty" />
                    <button className="rf-btn" onClick={handleAddPrize} disabled={busy === "prize"}>+ Ödül</button>
                  </div>
                ) : null}
              </section>

              {/* Havuz + manuel */}
              <section className="rf-card">
                <h3>Katılımcı Havuzu</h3>
                {isDraft ? (
                  <button className="rf-btn primary" onClick={handleBuildPool} disabled={busy === "pool"}>
                    {busy === "pool" ? "Oluşturuluyor…" : "Havuzu oluştur (kriterlerden)"}
                  </button>
                ) : (
                  <p className="rf-note">Havuz oluşturuldu: {raffle.entry_count} katılımcı{drawn ? " (çekiliş yapıldı)" : ""}.</p>
                )}

                {!drawn ? (
                  <div className="rf-manual">
                    <div className="rf-manual-search">
                      <input
                        value={searchQ}
                        onChange={(e) => setSearchQ(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Manuel ekle: ad / e-posta / telefon ara"
                      />
                      <button className="rf-btn ghost" onClick={handleSearch} disabled={busy === "search"}>Ara</button>
                    </div>
                    {searchResults.length > 0 ? (
                      <ul className="rf-search-results">
                        {searchResults.map((u) => (
                          <li key={u.id}>
                            <span>{u.name || u.email || u.phone || `#${u.id}`}</span>
                            <button className="rf-btn tiny" onClick={() => handleAddManual(u.id)}>Ekle</button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {manualEntries.length > 0 ? (
                      <div className="rf-manual-list">
                        <span className="rf-muted">Manuel eklenenler:</span>
                        {manualEntries.map((e) => (
                          <span key={e.id} className="rf-chip">
                            {e.display_name || `#${e.user}`}
                            <button onClick={() => handleDeleteEntry(e.id)}>×</button>
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </section>

              {/* Çekiliş + sonuç */}
              <section className="rf-card">
                <h3>Çekiliş</h3>
                {poolReady ? (
                  <button className="rf-btn primary big" onClick={handleDraw} disabled={busy === "draw"}>
                    {busy === "draw" ? "Çekiliyor…" : "🎲 Çekilişi Yap"}
                  </button>
                ) : isDraft ? (
                  <p className="rf-note">Önce havuzu oluştur.</p>
                ) : null}

                {winners.length > 0 ? (
                  <div className="rf-winners">
                    <h4>Kazananlar — Ödül Eşleştirmesi</h4>
                    <div className="rf-tbl-wrap">
                      <table>
                        <thead><tr><th>Ödül</th><th>Kazanan</th><th>Şehir</th><th>Tip</th></tr></thead>
                        <tbody>
                          {winners.map((w) => (
                            <tr key={w.id}>
                              <td>{w.prize_name}</td>
                              <td>{w.display_name || `#${w.user}`}</td>
                              <td>{w.city || "-"}</td>
                              <td>{w.is_backup ? <span className="rf-badge s-draft">Yedek</span> : <span className="rf-badge s-drawn">Asil</span>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/** Kriter tipine göre parametre girişleri */
function CriterionParams({ type, params, setParams, meta }) {
  const set = (patch) => setParams({ ...params, ...patch });
  const toggleIn = (key, val) => {
    const arr = params[key] || [];
    set({ [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] });
  };

  if (type === "city_coord") {
    return (
      <div className="rf-params">
        <MultiProvince provinces={meta?.provinces || []} selected={params.provinces || []} onToggle={(p) => toggleIn("provinces", p)} />
        <label className="rf-inline">
          Konum kaynağı:
          <select value={params.source || "any"} onChange={(e) => set({ source: e.target.value })}>
            <option value="any">Herhangi (giriş veya kayıt)</option>
            <option value="last_login">Son giriş konumu</option>
            <option value="signup">Kayıt konumu</option>
          </select>
        </label>
      </div>
    );
  }
  if (type === "city_license") {
    return <MultiProvince provinces={meta?.provinces || []} selected={params.cities || []} onToggle={(p) => toggleIn("cities", p)} />;
  }
  if (type === "date_joined") {
    return (
      <div className="rf-params rf-inline">
        <label>Başlangıç <input type="date" value={params.start || ""} onChange={(e) => set({ start: e.target.value })} /></label>
        <label>Bitiş <input type="date" value={params.end || ""} onChange={(e) => set({ end: e.target.value })} /></label>
      </div>
    );
  }
  if (type === "club") {
    return (
      <div className="rf-params">
        <label className="rf-inline">
          <input type="checkbox" checked={!!params.any_club} onChange={(e) => set({ any_club: e.target.checked, club_ids: [] })} />
          Herhangi bir kulübe üye
        </label>
        {!params.any_club ? (
          <div className="rf-multi">
            {(meta?.clubs || []).map((k) => (
              <label key={k.id} className={`rf-tag ${(params.club_ids || []).includes(k.id) ? "on" : ""}`}>
                <input type="checkbox" checked={(params.club_ids || []).includes(k.id)} onChange={() => toggleIn("club_ids", k.id)} />
                {k.name}{k.city ? ` (${k.city})` : ""}
              </label>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
  if (type === "field_filled") {
    return (
      <div className="rf-params rf-inline">
        {[["phone", "Telefon dolu"], ["name", "Ad-soyad dolu"], ["email", "E-posta dolu"]].map(([v, l]) => (
          <label key={v} className={`rf-tag ${(params.fields || []).includes(v) ? "on" : ""}`}>
            <input type="checkbox" checked={(params.fields || []).includes(v)} onChange={() => toggleIn("fields", v)} />{l}
          </label>
        ))}
      </div>
    );
  }
  if (type === "activity") {
    return (
      <div className="rf-params rf-inline">
        <label>Min. bilet <input type="number" min="0" value={params.min_tickets || ""} onChange={(e) => set({ min_tickets: e.target.value })} /></label>
        <label>Son N gün aktif <input type="number" min="0" value={params.active_days || ""} onChange={(e) => set({ active_days: e.target.value })} /></label>
        <label className="rf-tag"><input type="checkbox" checked={!!params.played_minigame} onChange={(e) => set({ played_minigame: e.target.checked })} />Oyun oynamış</label>
      </div>
    );
  }
  return <p className="rf-muted">Bu kriter için ek ayar gerekmez.</p>;
}

function MultiProvince({ provinces, selected, onToggle }) {
  const [q, setQ] = useState("");
  const shown = provinces.filter((p) => p.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr")));
  return (
    <div className="rf-prov">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="İl ara…" className="rf-prov-search" />
      {selected.length > 0 ? (
        <div className="rf-prov-selected">
          {selected.map((p) => <span key={p} className="rf-tag on" onClick={() => onToggle(p)}>{p} ×</span>)}
        </div>
      ) : null}
      <div className="rf-prov-grid">
        {shown.slice(0, 60).map((p) => (
          <button type="button" key={p} className={`rf-prov-item ${selected.includes(p) ? "on" : ""}`} onClick={() => onToggle(p)}>{p}</button>
        ))}
      </div>
    </div>
  );
}
