import { memo, useEffect, useMemo, useRef, useState } from "react";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import cekilisZayfixImage from "../assets/cekilis-zayfix.png";
import {
  loadGiveawayParticipants,
  sendGiveawayTicket,
} from "../services/giveawayService";

const DRAW_PASSWORD = "qrakter2026";
const DRAW_DURATION = 20000;
const DRAW_VISIBLE_ROWS = 5;
const DRAW_FOCUS_SLOT = 2;
const DRAW_ITEM_HEIGHT = 60;
const DRAW_ITEM_GAP = 12;
const DRAW_ROW_PITCH = DRAW_ITEM_HEIGHT + DRAW_ITEM_GAP;
const DRAW_VIEWPORT_HEIGHT = DRAW_VISIBLE_ROWS * DRAW_ROW_PITCH - DRAW_ITEM_GAP;
const DRAW_BASE_RENDER_INDEX = 4;
const DRAW_RENDER_OFFSETS = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
const DRAW_EASING_POWER = 3.2;
const DRAW_REFERENCE_STEP_COUNT = 620;
const DRAW_INITIAL_SPIN_ROWS_PER_SECOND =
  DRAW_REFERENCE_STEP_COUNT / (DRAW_DURATION / 1000);

const PARTICIPANT_ITEM_HEIGHT = 56;
const PARTICIPANT_ITEM_GAP = 10;
const PARTICIPANT_ROW_PITCH = PARTICIPANT_ITEM_HEIGHT + PARTICIPANT_ITEM_GAP;
const PARTICIPANT_OVERSCAN = 4;

const FULL_CYCLE_MAX_PARTICIPANTS = 140;
const LARGE_LIST_WINDOW_SIZE = 960;
const LARGE_LIST_AFTER_WINNER_COUNT = 18;
const LARGE_LIST_MIN_PREROLL_STEPS = DRAW_REFERENCE_STEP_COUNT;

const DEFAULT_MAP_CENTER = {
  latitude: 41.0082,
  longitude: 29.0083,
};
const MAP_HEIGHT = 232;
const MAP_DEFAULT_ZOOM = 13;
const MAP_FOCUSED_ZOOM = 15;
const EMPTY_PARTICIPANTS_MESSAGE = "Henüz katılımcı yok";
const LOAD_PARTICIPANTS_MESSAGE = "Katılımcıları listelemek için butona basın";

const initialLocationState = {
  latitude: "",
  longitude: "",
  radius_km: "",
};

const confettiColors = ["#a1d95c", "#66bb6a", "#cdef8c", "#237c51", "#e8f7d1"];

const confettiPieces = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  color: confettiColors[index % confettiColors.length],
  delay: `${(index % 6) * 0.09}s`,
  duration: `${2.1 + (index % 4) * 0.34}s`,
  drift: `${(index % 2 === 0 ? -1 : 1) * (20 + (index % 5) * 7)}px`,
  left: `${6 + (index % 11) * 8.2}%`,
  rotate: `${(index % 2 === 0 ? -1 : 1) * (24 + index * 9)}deg`,
  size: `${10 + (index % 3) * 4}px`,
}));

const LOCATION_MARKER_ICON = divIcon({
  className: "",
  html: `
    <span style="position:relative;display:block;width:24px;height:24px;">
      <span style="position:absolute;inset:0;border-radius:999px 999px 999px 0;transform:rotate(-45deg);background:linear-gradient(145deg, #cdef8c, #66bb6a);box-shadow:0 10px 22px rgba(46, 158, 104, 0.22);"></span>
      <span style="position:absolute;left:5px;top:5px;width:14px;height:14px;border-radius:999px;background:rgba(255, 255, 255, 0.92);"></span>
    </span>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

function getRadiusInMeters(radiusKm) {
  const numericRadius = Number(radiusKm);

  if (Number.isNaN(numericRadius) || numericRadius <= 0) {
    return 0;
  }

  return numericRadius * 1000;
}

function getParsedLocationPosition(location) {
  const latitudeText = location.latitude.trim();
  const longitudeText = location.longitude.trim();

  if (!latitudeText || !longitudeText) {
    return null;
  }

  const latitude = Number(latitudeText);
  const longitude = Number(longitudeText);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

function getParticipantName(participant) {
  if (!participant) {
    return "";
  }

  if (participant.display_name) {
    return participant.display_name;
  }

  return `${participant.ad ?? ""} ${participant.soyad ?? ""}`.trim();
}

function isParticipantMatchingWinner(participant, winner) {
  if (!participant || !winner) {
    return false;
  }

  return (
    participant.id === winner.user_id ||
    participant.id === winner.id ||
    getParticipantName(participant) === winner.display_name
  );
}

function normalizeCandidates(candidates) {
  if (!Array.isArray(candidates)) {
    return [];
  }

  return candidates.map((candidate, index) => ({
    ...candidate,
    id: candidate.id ?? candidate.user_id ?? `candidate-${index}`,
  }));
}

function getBaseDrawPosition(listLength) {
  return listLength > DRAW_BASE_RENDER_INDEX ? DRAW_BASE_RENDER_INDEX : 0;
}

function getDrawModeForLength(listLength) {
  return listLength <= FULL_CYCLE_MAX_PARTICIPANTS
    ? "full_cycle"
    : "winner_window";
}

function getWrappedParticipantAt(list, index) {
  if (!list.length) {
    return null;
  }

  return list[(index + list.length) % list.length];
}

function getClampedParticipantAt(list, index) {
  if (!list.length) {
    return null;
  }

  const clampedIndex = Math.max(0, Math.min(list.length - 1, index));
  return list[clampedIndex];
}

function getDisplayParticipant(list, index, shouldWrap) {
  if (shouldWrap) {
    return getWrappedParticipantAt(list, index);
  }

  return getClampedParticipantAt(list, index);
}

function buildLargeListWindow(participants, winnerIndex) {
  const windowSize = Math.min(participants.length, LARGE_LIST_WINDOW_SIZE);
  const afterWinnerCount = Math.min(
    LARGE_LIST_AFTER_WINNER_COUNT,
    Math.max(0, windowSize - 1),
  );
  const beforeWinnerCount = windowSize - afterWinnerCount - 1;

  const sequenceStart =
    (winnerIndex - beforeWinnerCount + participants.length) %
    participants.length;

  const sequence = Array.from({ length: windowSize }, (_, index) => {
    return participants[(sequenceStart + index) % participants.length];
  });

  const winnerSequenceIndex = beforeWinnerCount;
  const preRollSteps = Math.min(
    winnerSequenceIndex,
    Math.max(LARGE_LIST_MIN_PREROLL_STEPS, Math.floor(windowSize * 0.55)),
  );

  const startIndex = Math.max(0, winnerSequenceIndex - preRollSteps);

  return {
    sequence,
    startIndex,
    endIndex: winnerSequenceIndex,
  };
}

function getDrawEasedProgress(progress) {
  if (progress <= 0) {
    return 0;
  }

  if (progress >= 1) {
    return 1;
  }

  return 1 - Math.pow(1 - progress, DRAW_EASING_POWER);
}

function getMinimumDrawDistance(duration) {
  return Math.max(
    1,
    Math.ceil(
      (Math.max(duration, 0) / 1000) * DRAW_INITIAL_SPIN_ROWS_PER_SECOND,
    ),
  );
}

function getAlignedDrawDistance({
  listLength,
  targetIndex,
  startIndex,
  fractionalProgress = 0,
  minimumDistance = 0,
}) {
  if (!listLength) {
    return 0;
  }

  const wrappedStartIndex =
    ((startIndex % listLength) + listLength) % listLength;
  const distanceToTarget =
    (targetIndex - wrappedStartIndex + listLength) % listLength;
  let alignedDistance = distanceToTarget - fractionalProgress;

  if (alignedDistance < 0) {
    alignedDistance += listLength;
  }

  if (alignedDistance >= minimumDistance) {
    return alignedDistance;
  }

  const additionalCycles = Math.ceil(
    (minimumDistance - alignedDistance) / listLength,
  );

  return alignedDistance + additionalCycles * listLength;
}

function createWinnerParticipant(winner) {
  if (!winner) {
    return null;
  }

  return {
    id:
      winner.user_id ??
      winner.id ??
      `winner-${winner.winner_record_id ?? "record"}`,
    user_id: winner.user_id ?? winner.id ?? null,
    display_name: winner.display_name ?? "",
  };
}

function findWinnerIndexInParticipants(participants, winner) {
  if (!participants.length || !winner) {
    return -1;
  }

  return participants.findIndex((participant) => {
    return isParticipantMatchingWinner(participant, winner);
  });
}

function resolvePreloadedDrawResult(candidates, winner) {
  let nextParticipants = normalizeCandidates(candidates);
  let resolvedWinner = winner ?? null;
  let resolvedWinnerIndex = findWinnerIndexInParticipants(
    nextParticipants,
    resolvedWinner,
  );

  if (resolvedWinner && resolvedWinnerIndex === -1) {
    const winnerParticipant = createWinnerParticipant(resolvedWinner);

    if (winnerParticipant) {
      nextParticipants = [...nextParticipants, winnerParticipant];
      resolvedWinnerIndex = nextParticipants.length - 1;
      resolvedWinner = {
        ...resolvedWinner,
        id: resolvedWinner.id ?? winnerParticipant.id,
        user_id: resolvedWinner.user_id ?? winnerParticipant.user_id,
        display_name:
          resolvedWinner.display_name ?? winnerParticipant.display_name,
      };
    }
  }

  return {
    participants: nextParticipants,
    winner: resolvedWinner,
    winnerIndex: resolvedWinnerIndex,
  };
}

function getWinnerRecordId(response, winner) {
  return response?.winner_record_id ?? winner?.winner_record_id ?? null;
}

function getValidatedLocationPayload(location) {
  const latitudeText = location.latitude.trim();
  const longitudeText = location.longitude.trim();
  const radiusText = location.radius_km.trim();

  if (!latitudeText || !longitudeText || !radiusText) {
    return {
      error: "Konum ve yarıçap bilgisi gereklidir.",
      payload: null,
    };
  }

  const latitude = Number(latitudeText);
  const longitude = Number(longitudeText);
  const radiusKm = Number(radiusText);

  if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
    return {
      error: "Latitude değeri geçerli değil.",
      payload: null,
    };
  }

  if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
    return {
      error: "Longitude değeri geçerli değil.",
      payload: null,
    };
  }

  if (Number.isNaN(radiusKm) || radiusKm <= 0) {
    return {
      error: "Yarıçap değeri geçerli değil.",
      payload: null,
    };
  }

  return {
    error: "",
    payload: {
      latitude,
      longitude,
      radius_km: radiusKm,
    },
  };
}
function ConfettiBurst({ className = "" }) {
  return (
    <div className={`confetti-burst ${className}`.trim()} aria-hidden="true">
      {confettiPieces.map((piece) => (
        <span
          key={piece.id}
          className={`confetti-piece ${piece.id % 3 === 0 ? "is-circle" : piece.id % 3 === 1 ? "is-strip" : ""}`}
          style={{
            "--confetti-color": piece.color,
            "--confetti-delay": piece.delay,
            "--confetti-duration": piece.duration,
            "--confetti-drift": piece.drift,
            "--confetti-left": piece.left,
            "--confetti-rotate": piece.rotate,
            "--confetti-size": piece.size,
          }}
        />
      ))}
    </div>
  );
}

function LocationMapCenterSync({ center, shouldFocus }) {
  const map = useMap();

  useEffect(() => {
    if (!shouldFocus) {
      return;
    }

    map.flyTo([center.latitude, center.longitude], MAP_FOCUSED_ZOOM, {
      animate: true,
      duration: 0.7,
    });
  }, [center, map, shouldFocus]);

  return null;
}

function LocationMapEvents({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(
        {
          latitude: event.latlng.lat,
          longitude: event.latlng.lng,
        },
        false,
        "manual",
      );
    },
  });

  return null;
}

const LocationPickerMap = memo(function LocationPickerMap({
  center,
  selectedPosition,
  radiusKm,
  onSelect,
}) {
  const [hasTileError, setHasTileError] = useState(false);
  const radiusInMeters = getRadiusInMeters(radiusKm);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "1rem",
        border: "1px solid rgba(204, 229, 188, 0.95)",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 253, 241, 0.96))",
        boxShadow: "0 16px 30px rgba(46, 158, 104, 0.12)",
      }}
    >
      <MapContainer
        center={[center.latitude, center.longitude]}
        zoom={MAP_DEFAULT_ZOOM}
        scrollWheelZoom
        zoomControl={false}
        style={{
          height: `${MAP_HEIGHT}px`,
          width: "100%",
          background:
            "radial-gradient(circle at top, rgba(161, 217, 92, 0.18), rgba(255, 255, 255, 0.94) 72%)",
        }}
      >
        <LocationMapCenterSync
          center={center}
          shouldFocus={Boolean(selectedPosition)}
        />
        <LocationMapEvents onSelect={onSelect} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            load: () => setHasTileError(false),
            tileerror: () => setHasTileError(true),
          }}
        />

        {selectedPosition ? (
          <>
            <Marker
              position={[selectedPosition.latitude, selectedPosition.longitude]}
              icon={LOCATION_MARKER_ICON}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const { lat, lng } = event.target.getLatLng();

                  onSelect(
                    {
                      latitude: lat,
                      longitude: lng,
                    },
                    false,
                    "manual",
                  );
                },
              }}
            />

            {radiusInMeters ? (
              <Circle
                center={[selectedPosition.latitude, selectedPosition.longitude]}
                radius={radiusInMeters}
                pathOptions={{
                  color: "rgba(35, 124, 81, 0.45)",
                  fillColor: "rgba(161, 217, 92, 0.18)",
                  fillOpacity: 0.65,
                  weight: 1,
                }}
              />
            ) : null}
          </>
        ) : null}
      </MapContainer>

      {hasTileError ? (
        <div
          style={{
            position: "absolute",
            inset: "auto 0 0 0",
            padding: "0.65rem 0.8rem",
            background: "rgba(255, 255, 255, 0.92)",
            color: "#8c2f39",
            fontSize: "0.84rem",
            lineHeight: 1.45,
            borderTop: "1px solid rgba(204, 229, 188, 0.92)",
            pointerEvents: "none",
          }}
        >
          Harita yüklenemedi.
        </div>
      ) : null}
    </div>
  );
});
const DrawTrack = memo(function DrawTrack({
  participants,
  drawPosition,
  shouldWrap,
  isParticipantsLoading,
  emptyMessage,
}) {
  const currentBaseIndex = Math.floor(drawPosition);
  const fractionalProgress = drawPosition - currentBaseIndex;
  const drawTrackOffset =
    (DRAW_FOCUS_SLOT - DRAW_BASE_RENDER_INDEX - fractionalProgress) *
    DRAW_ROW_PITCH;

  const renderedEntries = useMemo(() => {
    if (!participants.length) {
      return [];
    }

    return DRAW_RENDER_OFFSETS.map((offset) => {
      const participant = getDisplayParticipant(
        participants,
        currentBaseIndex + offset,
        shouldWrap,
      );

      if (!participant) {
        return null;
      }

      const distance = Math.abs(offset - fractionalProgress);
      const emphasis = Math.max(0, 1 - distance / 3.25);
      const isFocus = distance < 0.55;

      return {
        id: participant.id ?? participant.telefon ?? `${offset}`,
        offset,
        participant,
        className: `draw-entry ${isFocus ? "is-focus" : ""} ${distance < 1.3 ? "is-adjacent" : ""}`,
        style: {
          opacity: 0.28 + emphasis * 0.72,
          transform: `scale(${0.94 + emphasis * 0.06})`,
        },
      };
    }).filter(Boolean);
  }, [participants, shouldWrap, currentBaseIndex, fractionalProgress]);

  if (!participants.length) {
    return (
      <div className="draw-track draw-track-placeholder">
        <div className="draw-entry is-focus is-placeholder">
          <span className="draw-entry-name">
            {isParticipantsLoading ? "Katılımcılar yükleniyor" : emptyMessage}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="draw-track"
      style={{ transform: `translate3d(0, ${drawTrackOffset}px, 0)` }}
    >
      {renderedEntries.map((entry) => (
        <div
          key={`${entry.id}-${entry.offset}`}
          className={entry.className}
          style={entry.style}
        >
          <span className="draw-entry-name">
            {getParticipantName(entry.participant)}
          </span>
        </div>
      ))}
    </div>
  );
});

const ParticipantPanel = memo(function ParticipantPanel({
  participants,
  isParticipantsLoading,
  hasLoadedParticipants,
  winnerIndex,
  emptyMessage,
}) {
  const viewportRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return undefined;
    }

    const syncViewportHeight = () => {
      setViewportHeight(viewport.clientHeight);
    };

    syncViewportHeight();

    const resizeObserver = new ResizeObserver(syncViewportHeight);
    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport || winnerIndex === null) {
      return;
    }

    const targetScrollTop = Math.max(
      0,
      winnerIndex * PARTICIPANT_ROW_PITCH -
        (viewport.clientHeight - PARTICIPANT_ITEM_HEIGHT) / 2,
    );

    viewport.scrollTo({
      top: targetScrollTop,
      behavior: "smooth",
    });
  }, [winnerIndex]);

  const totalHeight = participants.length
    ? participants.length * PARTICIPANT_ROW_PITCH - PARTICIPANT_ITEM_GAP
    : 0;

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / PARTICIPANT_ROW_PITCH) - PARTICIPANT_OVERSCAN,
  );

  const visibleCount = Math.max(
    1,
    Math.ceil(viewportHeight / PARTICIPANT_ROW_PITCH) +
      PARTICIPANT_OVERSCAN * 2,
  );

  const endIndex = Math.min(participants.length, startIndex + visibleCount);

  const visibleParticipants = useMemo(() => {
    return participants
      .slice(startIndex, endIndex)
      .map((participant, offset) => {
        const index = startIndex + offset;

        return {
          index,
          participant,
          isWinner: winnerIndex === index,
        };
      });
  }, [participants, startIndex, endIndex, winnerIndex]);

  return (
    <aside className="giveaway-panel participant-panel">
      <div className="participant-panel-head">
        <div>
          <p className="draw-status-label">Katılımcı Listesi</p>
          <h2>Katılımcılar</h2>
        </div>

        <span className="participant-note">
          {isParticipantsLoading
            ? "..."
            : hasLoadedParticipants
              ? `${participants.length} kişi`
              : "Bekliyor"}
        </span>
      </div>

      <div
        ref={viewportRef}
        className="participant-list"
        role="list"
        aria-busy={isParticipantsLoading}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        {participants.length ? (
          <div
            className="participant-list-spacer"
            style={{ height: `${Math.max(totalHeight, viewportHeight)}px` }}
          >
            {visibleParticipants.map(({ index, participant, isWinner }) => (
              <div
                key={participant.id ?? participant.telefon ?? index}
                className={`participant-item ${isWinner ? "is-winner" : ""}`}
                role="listitem"
                style={{
                  transform: `translate3d(0, ${index * PARTICIPANT_ROW_PITCH}px, 0)`,
                }}
              >
                <span className="participant-name">
                  {getParticipantName(participant)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="participant-empty">
            {isParticipantsLoading ? "Katılımcılar yükleniyor" : emptyMessage}
          </div>
        )}
      </div>
    </aside>
  );
});

function GiveawayPage() {
  const [password, setPassword] = useState("");
  const [accessError, setAccessError] = useState("");
  const [entryError, setEntryError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [location, setLocation] = useState(initialLocationState);
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
  const [isLocating, setIsLocating] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [participants, setParticipants] = useState([]);
  const [hasLoadedParticipants, setHasLoadedParticipants] = useState(false);
  const [isParticipantsLoading, setIsParticipantsLoading] = useState(false);
  const [participantsError, setParticipantsError] = useState("");
  const [preloadedWinner, setPreloadedWinner] = useState(null);
  const [preloadedWinnerIndex, setPreloadedWinnerIndex] = useState(null);
  const [isDrawReady, setIsDrawReady] = useState(false);

  const [animationParticipants, setAnimationParticipants] = useState([]);
  const [drawMode, setDrawMode] = useState("full_cycle");

  const [drawPosition, setDrawPosition] = useState(0);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [winnerRecordId, setWinnerRecordId] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [isTicketSent, setIsTicketSent] = useState(false);
  const [isSendingTicket, setIsSendingTicket] = useState(false);
  const [ticketError, setTicketError] = useState("");
  const [drawStatus, setDrawStatus] = useState(LOAD_PARTICIPANTS_MESSAGE);

  const animationFrameRef = useRef(0);
  const modalTimeoutRef = useRef(0);
  const hasRequestedInitialLocationRef = useRef(false);
  const manualLocationSelectionRef = useRef(false);

  const selectedPosition = getParsedLocationPosition(location);

  const activeDrawParticipants = animationParticipants.length
    ? animationParticipants
    : participants;

  const shouldWrapDrawTrack =
    drawMode === "full_cycle" ||
    activeDrawParticipants.length <= DRAW_RENDER_OFFSETS.length;
  const showLegacyDrawTrack = false;
  const showLegacyParticipantPanel = false;
  const currentBaseIndex = Math.floor(drawPosition);
  const fractionalProgress = drawPosition - currentBaseIndex;
  const winner =
    winnerIndex === null ? null : (participants[winnerIndex] ?? null);
  const panelEmptyMessage = hasLoadedParticipants
    ? EMPTY_PARTICIPANTS_MESSAGE
    : LOAD_PARTICIPANTS_MESSAGE;
  const heroTitle = !hasLoadedParticipants
    ? "Çekiliş birazdan başlayacak."
    : isDrawing
      ? "Çekiliş devam ediyor."
      : winner
        ? "Kazanan açıklandı."
        : isDrawReady
          ? "Çekiliş başlamak üzere."
          : participants.length
            ? "Katılımcılar hazır."
            : "Bu çekiliş için henüz katılımcı bulunmuyor.";
  const participantBadgeLabel = isParticipantsLoading
    ? "Yükleniyor"
    : hasLoadedParticipants
      ? `${participants.length} Katılımcı`
      : "Liste Bekliyor";

  const syncParticipantsToPanels = (nextParticipants) => {
    setParticipants(nextParticipants);
    setAnimationParticipants(nextParticipants);
    setDrawMode(getDrawModeForLength(nextParticipants.length));
    setDrawPosition(getBaseDrawPosition(nextParticipants.length));
  };

  const resetPreloadedDrawState = () => {
    syncParticipantsToPanels([]);
    setHasLoadedParticipants(false);
    setPreloadedWinner(null);
    setPreloadedWinnerIndex(null);
    setWinnerRecordId(null);
    setIsDrawReady(false);
    setDrawStatus(LOAD_PARTICIPANTS_MESSAGE);
  };

  const resetWinnerPresentation = () => {
    cancelAnimationFrame(animationFrameRef.current);
    window.clearTimeout(modalTimeoutRef.current);
    setWinnerIndex(null);
    setIsDrawing(false);
    setIsWinnerModalOpen(false);
    setIsTicketSent(false);
    setIsSendingTicket(false);
    setTicketError("");
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(modalTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isUnlocked || hasRequestedInitialLocationRef.current) {
      return undefined;
    }

    hasRequestedInitialLocationRef.current = true;

    if (!navigator.geolocation) {
      return undefined;
    }

    let isCancelled = false;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (isCancelled) {
          return;
        }

        if (manualLocationSelectionRef.current) {
          return;
        }

        const nextPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLocation((prev) => ({
          ...prev,
          latitude: nextPosition.latitude.toFixed(6),
          longitude: nextPosition.longitude.toFixed(6),
        }));
        setMapCenter(nextPosition);
        setLocationError("");
      },
      () => {
        if (isCancelled) {
          return;
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300000,
      },
    );

    return () => {
      isCancelled = true;
    };
  }, [isUnlocked]);

  useEffect(() => {
    if (!isWinnerModalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsWinnerModalOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isWinnerModalOpen]);

  const updateSelectedPosition = (
    nextPosition,
    shouldCenter,
    source = "manual",
  ) => {
    if (source === "auto" && manualLocationSelectionRef.current) {
      return;
    }

    if (source !== "auto") {
      manualLocationSelectionRef.current = true;
    }

    setLocation((prev) => ({
      ...prev,
      latitude: nextPosition.latitude.toFixed(6),
      longitude: nextPosition.longitude.toFixed(6),
    }));

    if (shouldCenter) {
      setMapCenter(nextPosition);
    }

    if (hasLoadedParticipants || preloadedWinner || isDrawReady) {
      resetPreloadedDrawState();
    }

    setLocationError("");
    setEntryError("");
    setParticipantsError("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setAccessError("");
    setEntryError("");
  };

  const handleRadiusChange = (event) => {
    setLocation((prev) => ({
      ...prev,
      radius_km: event.target.value,
    }));

    if (hasLoadedParticipants || preloadedWinner || isDrawReady) {
      resetPreloadedDrawState();
    }

    setLocationError("");
    setEntryError("");
    setParticipantsError("");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Konum alınamadı.");
      return;
    }

    setIsLocating(true);
    setLocationError("");
    setEntryError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        updateSelectedPosition(nextPosition, true, "current");
        setIsLocating(false);
      },
      () => {
        setLocationError("Konum alınamadı.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      },
    );
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (!password.trim()) {
      setAccessError("Şifre gereklidir.");
      return;
    }

    if (password.trim() !== DRAW_PASSWORD) {
      setAccessError("Şifre hatalı.");
      return;
    }

    const locationValidation = getValidatedLocationPayload(location);

    if (locationValidation.error) {
      setLocationError(locationValidation.error);
      return;
    }

    setAccessError("");
    setEntryError("");
    setLocationError("");
    setParticipantsError("");
    resetWinnerPresentation();
    resetPreloadedDrawState();
    setPassword("");
    setIsUnlocked(true);
  };

  const handleLoadParticipants = async () => {
    if (isParticipantsLoading || isDrawing) {
      return;
    }

    const locationValidation = getValidatedLocationPayload(location);

    if (locationValidation.error) {
      setParticipantsError(locationValidation.error);
      return;
    }

    setEntryError("");
    setParticipantsError("");
    resetWinnerPresentation();
    resetPreloadedDrawState();
    setIsParticipantsLoading(true);
    setDrawStatus("Katılımcılar hazırlanıyor");

    try {
      const response = await loadGiveawayParticipants(
        locationValidation.payload,
      );
      const winnerData = response?.winner ?? null;
      const {
        participants: nextParticipants,
        winner: resolvedWinner,
        winnerIndex: resolvedWinnerIndex,
      } = resolvePreloadedDrawResult(response?.candidates, winnerData);
      const nextWinnerRecordId = getWinnerRecordId(response, resolvedWinner);

      syncParticipantsToPanels(nextParticipants);
      setHasLoadedParticipants(true);
      setPreloadedWinner(resolvedWinner);
      setPreloadedWinnerIndex(
        resolvedWinnerIndex >= 0 ? resolvedWinnerIndex : null,
      );
      setWinnerRecordId(nextWinnerRecordId);

      if (!nextParticipants.length) {
        setIsDrawReady(false);
        setDrawStatus(EMPTY_PARTICIPANTS_MESSAGE);
        return;
      }

      if (!resolvedWinner || resolvedWinnerIndex === -1) {
        setIsDrawReady(false);
        setDrawStatus("Çekiliş şu anda başlatılamıyor");
        setParticipantsError("Çekiliş sonucu şu anda getirilemiyor.");
        return;
      }

      setIsDrawReady(true);
      setDrawStatus("Çekiliş başlamak üzere");
    } catch (error) {
      resetPreloadedDrawState();
      setDrawStatus("Katılımcılar yüklenemedi");
      setParticipantsError(
        error instanceof Error
          ? error.message
          : "Katılımcılar şu anda yüklenemedi.",
      );
    } finally {
      setIsParticipantsLoading(false);
    }
  };

  const handleStartDraw = () => {
    if (isDrawing || isParticipantsLoading) {
      return;
    }

    if (!hasLoadedParticipants) {
      setParticipantsError("Önce katılımcıları listeleyin.");
      return;
    }

    const currentParticipants = participants;

    if (!currentParticipants.length) {
      setIsDrawReady(false);
      setDrawStatus(EMPTY_PARTICIPANTS_MESSAGE);
      setParticipantsError("Bu çekiliş için henüz katılımcı bulunmuyor.");
      return;
    }

    if (!isDrawReady || !preloadedWinner) {
      setDrawStatus("Çekiliş şu anda başlatılamıyor");
      setParticipantsError(
        "Çekiliş şu anda yeniden hazırlanıyor. Lütfen tekrar deneyin.",
      );
      return;
    }

    const hasIndexedWinner =
      preloadedWinnerIndex !== null &&
      preloadedWinnerIndex >= 0 &&
      preloadedWinnerIndex < currentParticipants.length &&
      isParticipantMatchingWinner(
        currentParticipants[preloadedWinnerIndex],
        preloadedWinner,
      );
    const resolvedWinnerIndex = hasIndexedWinner
      ? preloadedWinnerIndex
      : findWinnerIndexInParticipants(currentParticipants, preloadedWinner);

    if (resolvedWinnerIndex === -1) {
      setIsDrawReady(false);
      setDrawStatus("Çekiliş şu anda başlatılamıyor");
      setParticipantsError(
        "Çekiliş sonucu şu anda gösterilemiyor. Lütfen tekrar deneyin.",
      );
      return;
    }

    setParticipantsError("");
    resetWinnerPresentation();

    const finalizeDraw = (resolvedWinnerIndex, finalPosition) => {
      setDrawPosition(Math.round(finalPosition));
      setWinnerIndex(resolvedWinnerIndex);
      setIsDrawing(false);
      setIsDrawReady(false);
      setDrawStatus("Kazanan açıklandı");

      modalTimeoutRef.current = window.setTimeout(() => {
        setIsWinnerModalOpen(true);
      }, 1000);
    };

    const startResolvedFullCycle = (nextParticipants, resolvedWinnerIndex) => {
      setAnimationParticipants(nextParticipants);
      setDrawMode("full_cycle");
      setIsDrawing(true);
      setDrawStatus("Çekiliş sürüyor");

      const startIndex = Math.floor(Math.random() * nextParticipants.length);
      const totalSteps = getAlignedDrawDistance({
        listLength: nextParticipants.length,
        targetIndex: resolvedWinnerIndex,
        startIndex,
        minimumDistance: getMinimumDrawDistance(DRAW_DURATION),
      });
      const endPosition = startIndex + totalSteps;
      const startTime = performance.now();

      setDrawPosition(startIndex);

      const animateFullCycle = (now) => {
        const progress = Math.min((now - startTime) / DRAW_DURATION, 1);
        const easedProgress = getDrawEasedProgress(progress);
        const currentPosition = startIndex + easedProgress * totalSteps;

        setDrawPosition(currentPosition);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateFullCycle);
          return;
        }

        finalizeDraw(resolvedWinnerIndex, endPosition);
      };

      animationFrameRef.current = requestAnimationFrame(animateFullCycle);
    };

    const startWinnerWindowAnimation = (
      nextParticipants,
      resolvedWinnerIndex,
    ) => {
      const largeListWindow = buildLargeListWindow(
        nextParticipants,
        resolvedWinnerIndex,
      );
      const startIndex = largeListWindow.startIndex;
      const endPosition = largeListWindow.endIndex;
      const totalSteps = endPosition - startIndex;
      const startTime = performance.now();

      setAnimationParticipants(largeListWindow.sequence);
      setDrawMode("winner_window");
      setDrawPosition(startIndex);
      setIsDrawing(true);
      setDrawStatus("Çekiliş sürüyor");

      const animate = (now) => {
        const progress = Math.min((now - startTime) / DRAW_DURATION, 1);
        const easedProgress = getDrawEasedProgress(progress);
        const currentPosition = startIndex + easedProgress * totalSteps;

        setDrawPosition(currentPosition);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        finalizeDraw(resolvedWinnerIndex, endPosition);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (currentParticipants.length <= FULL_CYCLE_MAX_PARTICIPANTS) {
      startResolvedFullCycle(currentParticipants, resolvedWinnerIndex);
      return;
    }

    startWinnerWindowAnimation(currentParticipants, resolvedWinnerIndex);
  };
  const handleCloseWinnerModal = () => {
    window.clearTimeout(modalTimeoutRef.current);
    setTicketError("");
    setIsWinnerModalOpen(false);
  };

  const handleSendTicket = async () => {
    if (!winnerRecordId) {
      setTicketError("Kazanan kaydı bulunamadı.");
      return;
    }

    setTicketError("");
    setIsSendingTicket(true);

    try {
      await sendGiveawayTicket(winnerRecordId);
      setIsTicketSent(true);
    } catch (error) {
      setTicketError(
        error instanceof Error ? error.message : "Bilet şu anda gönderilemedi.",
      );
    } finally {
      setIsSendingTicket(false);
    }
  };

  const primaryActionLabel = isParticipantsLoading
    ? "Katılımcılar Yükleniyor"
    : isDrawReady
      ? "Çekilişi Başlat"
      : hasLoadedParticipants
        ? "Katılımcıları Yeniden Listele"
        : "Katılımcıları Listele";
  const primaryActionHandler = isDrawReady
    ? handleStartDraw
    : handleLoadParticipants;
  const primaryActionDisabled =
    isParticipantsLoading || isDrawing || (isDrawReady && !participants.length);
  const helperText = participantsError
    ? hasLoadedParticipants
      ? "Çekiliş şu anda yeniden hazırlanıyor. Lütfen tekrar deneyin."
      : "Katılımcı listesi şu anda gösterilemiyor. Lütfen tekrar deneyin."
    : isParticipantsLoading
      ? "Katılımcı listesi hazırlanıyor. Lütfen bekleyin."
      : !hasLoadedParticipants
        ? "Katılımcıları görmek için listeyi hazırlayın."
        : !participants.length
          ? "Bu çekiliş için henüz uygun katılımcı bulunmuyor."
          : isDrawing
            ? "Çekiliş devam ediyor."
            : winner
              ? "Çekiliş tamamlandı."
              : isDrawReady
                ? "Çekiliş başlamaya hazır."
                : "Yeni çekiliş için katılımcı listesi yeniden hazırlanabilir.";

  if (!isUnlocked) {
    return (
      <section className="section giveaway-page">
        <div className="container lock-layout">
          <div className="lock-copy">
            <p className="eyebrow">Canlı Çekiliş</p>
            <h1>Çekiliş ekranına giriş yapın.</h1>
            <p className="section-copy">
              Mevcut konumunuzu kullanabilir veya haritadan seçim
              yapabilirsiniz. Şifrenizi ve yarıçap bilgisini girdikten sonra
              devam ederek çekiliş ekranına ulaşabilirsiniz.
            </p>
          </div>

          <div className="giveaway-panel">
            <div className="lock-card">
              <p className="lock-card-label">QRAKTER Çekiliş</p>
              <h2>Çekiliş Girişi</h2>

              <form className="lock-form" onSubmit={handlePasswordSubmit}>
                <label htmlFor="draw-password">Şifreyi girin</label>
                <input
                  id="draw-password"
                  name="draw-password"
                  type="password"
                  placeholder="Şifreyi girin"
                  autoComplete="off"
                  value={password}
                  onChange={handlePasswordChange}
                  aria-invalid={Boolean(accessError)}
                  aria-describedby={
                    accessError ? "draw-password-error" : undefined
                  }
                />

                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label htmlFor="draw-location-map">Konum</label>
                  <div id="draw-location-map">
                    <LocationPickerMap
                      center={mapCenter}
                      selectedPosition={selectedPosition}
                      radiusKm={location.radius_km}
                      onSelect={updateSelectedPosition}
                    />
                  </div>
                </div>

                <button
                  className="btn btn-secondary full-width"
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                >
                  {isLocating ? "Konum Alınıyor..." : "Mevcut Konumu Kullan"}
                </button>

                <label htmlFor="draw-radius">Yarıçap (km)</label>
                <input
                  id="draw-radius"
                  name="radius_km"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Yarıçap (km)"
                  autoComplete="off"
                  value={location.radius_km}
                  onChange={handleRadiusChange}
                  aria-invalid={Boolean(locationError)}
                  aria-describedby={
                    locationError ? "draw-location-error" : undefined
                  }
                />

                <button
                  className="btn btn-primary full-width"
                  type="submit"
                  disabled={isLocating}
                >
                  Devam Et
                </button>

                {accessError ? (
                  <p
                    id="draw-password-error"
                    className="error-message"
                    role="alert"
                  >
                    {accessError}
                  </p>
                ) : null}

                {locationError ? (
                  <p
                    id="draw-location-error"
                    className="error-message"
                    role="alert"
                  >
                    {locationError}
                  </p>
                ) : null}

                {entryError ? (
                  <p className="error-message" role="alert">
                    {entryError}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section giveaway-page">
      <div className="container giveaway-shell">
        <div className="giveaway-hero">
          <div>
            <p className="eyebrow">Canlı Çekiliş</p>
            <h1>{heroTitle}</h1>
          </div>

          <div className="giveaway-hero-actions">
            <span className="giveaway-badge">{participantBadgeLabel}</span>
            <a className="btn btn-secondary" href="/">
              Ana Sayfaya Dön
            </a>
          </div>
        </div>

        <div className="giveaway-grid">
          <div className="draw-panel-shell">
            <div className="draw-panel-mascot-outside" aria-hidden="true">
              <div className="draw-mascot-frame">
                <img src={cekilisZayfixImage} alt="" />
              </div>
            </div>

            <article className="giveaway-panel draw-panel">
              {winner ? (
                <ConfettiBurst
                  key={`draw-confetti-${winnerIndex}`}
                  className="draw-confetti-layer"
                />
              ) : null}

              <div className="draw-status-row">
                <div className="draw-status-copy">
                  <p className="draw-status-label">Çekiliş Durumu</p>
                  <h2>{drawStatus}</h2>

                  {winner && !isWinnerModalOpen ? (
                    <p className="draw-status-winner">
                      {getParticipantName(winner)}
                    </p>
                  ) : null}
                </div>

                <span
                  className={`draw-status-pill ${isDrawing ? "is-live" : winner ? "is-finished" : ""}`}
                >
                  {isParticipantsLoading
                    ? "Yükleniyor"
                    : isDrawing
                      ? "Çekiliş sürüyor"
                      : winner
                        ? "Tamamlandı"
                        : isDrawReady
                          ? "Hazır"
                          : "Bekliyor"}
                </span>
              </div>
              <div
                className="draw-window"
                aria-live="polite"
                style={{
                  "--draw-item-height": `${DRAW_ITEM_HEIGHT}px`,
                  "--draw-item-gap": `${DRAW_ITEM_GAP}px`,
                  "--draw-viewport-height": `${DRAW_VIEWPORT_HEIGHT}px`,
                  "--draw-selection-top": `${DRAW_FOCUS_SLOT * DRAW_ROW_PITCH}px`,
                }}
              >
                <div className="draw-track-viewport">
                  <div className="draw-selection-band" aria-hidden="true" />
                  <DrawTrack
                    participants={activeDrawParticipants}
                    drawPosition={drawPosition}
                    shouldWrap={shouldWrapDrawTrack}
                    isParticipantsLoading={isParticipantsLoading}
                    emptyMessage={panelEmptyMessage}
                  />

                  <div
                    className="draw-track"
                    aria-hidden="true"
                    style={{ display: "none" }}
                  >
                    {showLegacyDrawTrack ? (
                      DRAW_RENDER_OFFSETS.map((offset) => {
                        const participant = getDisplayParticipant(
                          activeDrawParticipants,
                          currentBaseIndex + offset,
                          shouldWrapDrawTrack,
                        );

                        if (!participant) {
                          return null;
                        }

                        const distance = Math.abs(offset - fractionalProgress);
                        const emphasis = Math.max(0, 1 - distance / 3.25);
                        const isFocus = distance < 0.55;

                        return (
                          <div
                            key={`${participant.id ?? participant.telefon}-${offset}`}
                            className={`draw-entry ${isFocus ? "is-focus" : ""} ${distance < 1.3 ? "is-adjacent" : ""}`}
                            style={{
                              opacity: 0.28 + emphasis * 0.72,
                              transform: `scale(${0.94 + emphasis * 0.06})`,
                              filter: `blur(${Math.min(1.15, distance * 0.34)}px)`,
                            }}
                          >
                            <span className="draw-entry-name">
                              {getParticipantName(participant)}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="draw-entry is-focus">
                        <span className="draw-entry-name">
                          {isParticipantsLoading
                            ? "Katılımcılar yükleniyor"
                            : panelEmptyMessage}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="draw-controls">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={primaryActionHandler}
                  disabled={primaryActionDisabled}
                >
                  {primaryActionLabel}
                </button>

                <p className="draw-helper">{helperText}</p>

                {participantsError ? (
                  <p className="error-message" role="alert">
                    {participantsError}
                  </p>
                ) : null}
              </div>
            </article>
          </div>

          {showLegacyParticipantPanel ? (
            <aside className="giveaway-panel participant-panel">
              <div className="participant-panel-head">
                <div>
                  <p className="draw-status-label">Katılımcı Listesi</p>
                  <h2>Katılımcılar</h2>
                </div>

                <span className="participant-note">
                  {isParticipantsLoading
                    ? "..."
                    : hasLoadedParticipants
                      ? `${participants.length} kişi`
                      : "Bekliyor"}
                </span>
              </div>

              <ol className="participant-list">
                {participants.map((participant, index) => {
                  const isWinner = winnerIndex === index;

                  return (
                    <li
                      key={participant.id ?? participant.telefon ?? index}
                      className={`participant-item ${isWinner ? "is-winner" : ""}`}
                    >
                      <span className="participant-name">
                        {getParticipantName(participant)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </aside>
          ) : (
            <ParticipantPanel
              participants={participants}
              isParticipantsLoading={isParticipantsLoading}
              hasLoadedParticipants={hasLoadedParticipants}
              winnerIndex={winnerIndex}
              emptyMessage={panelEmptyMessage}
            />
          )}
        </div>
      </div>

      {winner && isWinnerModalOpen ? (
        <div
          className="winner-modal-backdrop"
          role="presentation"
          onClick={handleCloseWinnerModal}
        >
          <div
            className="winner-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="winner-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <ConfettiBurst
              key={`modal-confetti-${winnerIndex}`}
              className="winner-modal-confetti"
            />

            <div className="winner-modal-content">
              <p className="winner-modal-eyebrow">Kazanan Açıklandı</p>
              <h2 id="winner-modal-title">{getParticipantName(winner)}</h2>

              <p className="winner-modal-copy">
                Çekiliş tamamlandı. Bilet gönder butonu ile şanslı kişiye
                hediyesini verebilirsiniz.
              </p>

              <div className="winner-modal-details">
                <div className="winner-modal-detail is-wide">
                  <span>Kazanan</span>
                  <strong>{getParticipantName(winner)}</strong>
                </div>
              </div>

              {isTicketSent ? (
                <div
                  className="winner-ticket-success"
                  role="status"
                  aria-live="polite"
                >
                  <span
                    className="winner-ticket-success-icon"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M9.55 16.6 5.4 12.45l1.4-1.4 2.75 2.75 7.65-7.65 1.4 1.4-9.05 9.05Z" />
                    </svg>
                  </span>

                  <div className="winner-ticket-success-copy">
                    <strong>Bilet başarıyla gönderildi</strong>
                    <p>Lütfen şanslı kişi e-postasını kontrol etsin.</p>
                  </div>
                </div>
              ) : null}

              {ticketError ? (
                <p className="error-message" role="alert">
                  {ticketError}
                </p>
              ) : null}

              <div className="winner-modal-actions">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={handleCloseWinnerModal}
                >
                  Kapat
                </button>

                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSendTicket}
                  disabled={isSendingTicket}
                >
                  {isSendingTicket ? "Gönderiliyor..." : "Bilet Gönder"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default GiveawayPage;
