import { ADD_REQUEST_BODY_API } from "./APIRequests";

const STORAGE_KEY = "hq_map31_telemetry_session_v1";

const nowIso = () => new Date().toISOString();

const uuid = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  // Fallback (not cryptographically strong, but fine for session correlation)
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

let session = null;
let buffer = [];
let flushTimer = null;
let inFlight = false;

const loadSession = () => {
  if (session) return session;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.sessionId) {
      session = parsed;
      return session;
    }
  } catch {
    // ignore
  }
  return null;
};

const saveSession = (s) => {
  session = s;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
};

export const map31Telemetry = {
  getSession: () => loadSession(),
  isActive: () => {
    const s = loadSession();
    return !!(s && s.sessionId);
  },

  startSession: (context = {}) => {
    const s = {
      sessionId: uuid(),
      mapId: 31,
      player: context.player || null,
      mapElementId: context.mapElementId ?? null,
      seriesId: context.seriesId ?? null,
      isMobile: context.isMobile ?? null,
      userAgent: context.userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : null),
      appVersion: context.appVersion ?? null,
      startedAt: nowIso(),
      endedAt: null,
      totalDurationMs: null,
    };
    saveSession(s);
    return s.sessionId;
  },

  // If createIfMissing=false, this will NOT start a new session (prevents logging outside Map 31).
  ensureSession: (context = {}, createIfMissing = true) => {
    const existing = loadSession();
    if (existing) {
      // best-effort enrich
      const enriched = {
        ...existing,
        player: context.player || existing.player,
        mapElementId: context.mapElementId ?? existing.mapElementId,
        seriesId: context.seriesId ?? existing.seriesId,
        isMobile: context.isMobile ?? existing.isMobile,
        userAgent: context.userAgent || existing.userAgent,
        appVersion: context.appVersion ?? existing.appVersion,
      };
      saveSession(enriched);
      return enriched.sessionId;
    }
    if (!createIfMissing) return null;
    return map31Telemetry.startSession(context);
  },

  endSession: ({ endedAt, totalDurationMs } = {}) => {
    const s = loadSession();
    if (!s) return;
    const ended = endedAt || nowIso();
    const updated = {
      ...s,
      endedAt: ended,
      totalDurationMs: typeof totalDurationMs === "number" ? totalDurationMs : s.totalDurationMs,
    };
    saveSession(updated);
  },

  track: (event) => {
    if (!event) return;
    const s = loadSession();
    // Only track if a Map31 session is already active.
    if (!s) return null;
    buffer.push({
      occurredAt: event.occurredAt || nowIso(),
      page: event.page,
      section: event.section,
      eventName: event.eventName,
      targetType: event.targetType || null,
      targetId: event.targetId || null,
      url: event.url || null,
      durationMs: typeof event.durationMs === "number" ? event.durationMs : null,
      metadata: event.metadata || null,
    });

    // Flush sooner for click-like events
    if (buffer.length >= 25) {
      map31Telemetry.flush();
    } else if (!flushTimer) {
      flushTimer = setTimeout(() => map31Telemetry.flush(), 8000);
    }

    return s;
  },

  flush: async () => {
    if (inFlight) return;
    const s = loadSession();
    if (!s) return;
    if (!buffer.length) return;

    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }

    const batch = buffer;
    buffer = [];
    inFlight = true;

    try {
      const payload = {
        sessionId: s.sessionId,
        player: s.player,
        mapId: 31,
        mapElementId: s.mapElementId,
        seriesId: s.seriesId,
        isMobile: s.isMobile,
        userAgent: s.userAgent,
        appVersion: s.appVersion,
        startedAt: s.startedAt,
        endedAt: s.endedAt,
        totalDurationMs: s.totalDurationMs,
        events: batch,
      };

      await ADD_REQUEST_BODY_API("Telemetry/Map31Events", payload, false);
    } catch {
      // Best-effort: re-queue (cap to avoid unbounded growth)
      buffer = [...batch, ...buffer].slice(0, 500);
    } finally {
      inFlight = false;
    }
  },
};

