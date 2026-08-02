import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  confirmGiveawayDraw,
  getGiveawayCampaign,
  listGiveawayCampaigns,
  listGiveawayParticipants,
  previewGiveawayDraw,
} from "../../../services/wheelGiveawayWebService";
import "../../../styles/cekilis-yayin.css";

/** KVKK: canlı yayında tam ad gösterilmez. "Ahmet Yılmaz" -> "Ahmet Y." */
export function maskName(fullName) {
  const raw = (fullName || "").trim();
  if (!raw || raw === "-") return "Katılımcı";

  const parts = raw.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    const word = parts[0];
    if (word.length <= 3) return word;
    return `${word.slice(0, 3)}${"*".repeat(Math.min(4, word.length - 3))}`;
  }

  const first = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toLocaleUpperCase("tr-TR");
  return `${first} ${lastInitial}.`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("tr-TR").format(Number(value) || 0);
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}

export default function HaftalikUygulamaYayinPage({ onNavigate }) {
  const [campaign, setCampaign] = useState(null);
  const [winners, setWinners] = useState([]);
  const [namePool, setNamePool] = useState([]);
  const [stats, setStats] = useState({ people: 0, tickets: 0 });

  const [revealedCount, setRevealedCount] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [rollName, setRollName] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [showOperator, setShowOperator] = useState(true);

  const rollTimer = useRef(null);
  const stageRef = useRef(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // En son "closed" kampanyayı bul (çekilişe hazır olan)
      const list = normalizeArray(await listGiveawayCampaigns());
      const target =
        list.find((c) => c.status === "closed") ||
        list.find((c) => c.status === "drawn") ||
        list[0];

      if (!target) {
        setError("Çekilişe uygun kampanya bulunamadı.");
        setLoading(false);
        return;
      }

      const detail = await getGiveawayCampaign(target.id);
      setCampaign(detail || target);
      setConfirmed((detail || target).status === "drawn");

      // Katılımcılar: sayaçlar + animasyon isim havuzu
      try {
        const participants = normalizeArray(await listGiveawayParticipants(target.id));
        const people = participants.length;
        const tickets = participants.reduce(
          (sum, p) => sum + (Number(p.ticket_count ?? p.total_tickets) || 0),
          0,
        );
        setStats({ people, tickets });
        setNamePool(
          participants
            .slice(0, 120)
            .map((p) =>
              maskName(p.user?.full_name || p.user?.username || p.user_name || ""),
            )
            .filter(Boolean),
        );
      } catch {
        /* katılımcı listesi alınamazsa sahne yine çalışır */
      }

      // Yalnızca panelde HAZIRLANMIŞ ön çekiliş gösterilir; bu ekran asla yeni
      // çekiliş oluşturmaz (kazara sonuç üretmeyi önlemek için).
      if ((detail || target).has_draw_preview) {
        const preview = await previewGiveawayDraw(target.id);
        setWinners(normalizeArray(preview?.winners_preview));
      }
    } catch (err) {
      setError(err?.message || "Veriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    return () => {
      if (rollTimer.current) clearTimeout(rollTimer.current);
    };
  }, [loadAll]);

  const currentWinner = winners[revealedCount] || null;
  const allRevealed = winners.length > 0 && revealedCount >= winners.length;

  const revealNext = useCallback(() => {
    if (rolling || !currentWinner) return;
    setRolling(true);

    const pool = namePool.length ? namePool : ["Katılımcı", "Sürücü", "Motorcu"];
    let elapsed = 0;
    let delay = 55;

    const tick = () => {
      setRollName(pool[Math.floor(Math.random() * pool.length)]);
      elapsed += delay;
      if (elapsed > 1800) delay += 45; // yavaşlama
      if (elapsed > 3400) {
        setRolling(false);
        setRevealedCount((n) => n + 1);
        return;
      }
      rollTimer.current = setTimeout(tick, delay);
    };

    tick();
  }, [rolling, currentWinner, namePool]);

  const handleConfirm = useCallback(async () => {
    if (!campaign || busy) return;
    setBusy("confirm");
    setError("");
    try {
      await confirmGiveawayDraw(campaign.id);
      setConfirmed(true);
    } catch (err) {
      setError(err?.message || "Sonuç onaylanamadı.");
    } finally {
      setBusy("");
    }
  }, [campaign, busy]);

  const toggleFullscreen = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      el.requestFullscreen?.();
    }
  }, []);

  const revealedList = useMemo(() => winners.slice(0, revealedCount), [winners, revealedCount]);

  return (
    <div className="yayin-stage" ref={stageRef}>
      <div className="yayin-bg" aria-hidden="true" />

      <header className="yayin-head">
        <span className="yayin-eyebrow">ZAYFIX ÇEKİLİŞİ</span>
        <h1 className="yayin-title">{campaign?.name || "Çark Çekilişi"}</h1>
        <div className="yayin-stats">
          <div className="yayin-stat">
            <span className="v">{formatNumber(stats.people)}</span>
            <span className="l">Katılımcı</span>
          </div>
          <div className="yayin-stat">
            <span className="v">{formatNumber(stats.tickets)}</span>
            <span className="l">Toplam Bilet</span>
          </div>
          <div className="yayin-stat">
            <span className="v">{winners.length || "—"}</span>
            <span className="l">Ödül</span>
          </div>
        </div>
      </header>

      <main className="yayin-main">
        {loading ? (
          <p className="yayin-info">Yükleniyor…</p>
        ) : error ? (
          <p className="yayin-error">{error}</p>
        ) : winners.length === 0 ? (
          <p className="yayin-info">
            Ön çekiliş hazır değil. Panelden ön çekilişi hazırlayın, sonra bu ekranı yenileyin.
          </p>
        ) : rolling ? (
          <div className="yayin-card is-rolling">
            <span className="yayin-prize">{currentWinner?.prize_name}</span>
            <span className="yayin-name rolling">{rollName || "…"}</span>
            <span className="yayin-sub">çekiliyor…</span>
          </div>
        ) : revealedCount > 0 ? (
          <div className="yayin-card is-winner">
            <span className="yayin-prize">{winners[revealedCount - 1]?.prize_name}</span>
            <span className="yayin-name">{maskName(winners[revealedCount - 1]?.user_name)}</span>
            <span className="yayin-sub">
              {formatNumber(winners[revealedCount - 1]?.ticket_count_at_draw)} bilet ile kazandı
            </span>
            {allRevealed ? (
              <span className="yayin-done-note">
                {confirmed
                  ? "🎉 Çekiliş tamamlandı — sonuç onaylandı, kazananlara bildirildi."
                  : "🎉 Çekiliş tamamlandı"}
              </span>
            ) : null}
            <div className="yayin-confetti" aria-hidden="true">
              {["🎉", "✨", "🎊", "⭐", "🎉", "✨"].map((e, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.12}s` }}>
                  {e}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="yayin-card is-idle">
            <span className="yayin-prize">{currentWinner?.prize_name}</span>
            <span className="yayin-name muted">? ? ?</span>
            <span className="yayin-sub">Kazananı açmak için hazır</span>
          </div>
        )}

        {revealedList.length > 1 ? (
          <ul className="yayin-list">
            {revealedList.slice(0, -1).map((w, i) => (
              <li key={`${w.user_id}-${i}`}>
                <span className="p">{w.prize_name}</span>
                <span className="n">{maskName(w.user_name)}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </main>

      {showOperator ? (
        <footer className="yayin-ops">
          <div className="yayin-ops-left">
            <button type="button" className="yayin-btn ghost" onClick={() => onNavigate?.("/panel/cekilis/haftalik-uygulama")}>
              ← Panel
            </button>
            <button type="button" className="yayin-btn ghost" onClick={loadAll}>
              Yenile
            </button>
            <button type="button" className="yayin-btn ghost" onClick={toggleFullscreen}>
              Tam ekran
            </button>
            <button type="button" className="yayin-btn ghost" onClick={() => setShowOperator(false)}>
              Kontrolleri gizle
            </button>
          </div>

          <div className="yayin-ops-right">
            <span className="yayin-progress">
              {revealedCount}/{winners.length || 0} açıldı
            </span>
            {!allRevealed ? (
              <button
                type="button"
                className="yayin-btn primary"
                onClick={revealNext}
                disabled={rolling || winners.length === 0}
              >
                {rolling ? "Çekiliyor…" : "KAZANANI AÇ"}
              </button>
            ) : !confirmed ? (
              <button
                type="button"
                className="yayin-btn confirm"
                onClick={handleConfirm}
                disabled={busy === "confirm"}
              >
                {busy === "confirm" ? "Onaylanıyor…" : "SONUCU ONAYLA (e-posta gider)"}
              </button>
            ) : (
              <span className="yayin-confirmed">✓ Onaylandı</span>
            )}
          </div>
        </footer>
      ) : (
        <button type="button" className="yayin-show-ops" onClick={() => setShowOperator(true)}>
          ⚙
        </button>
      )}
    </div>
  );
}
