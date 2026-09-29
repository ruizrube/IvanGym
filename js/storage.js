// Persistencia en localStorage + exportar/importar JSON.

const KEY = 'ivangym:v1';
const QUOTE_KEY = 'ivangym:lastQuote';

const empty = () => ({ sessions: [], videoOverrides: {} });

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? normalize(JSON.parse(raw)) : empty();
  } catch {
    return empty();
  }
}

function normalize(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.sessions)) {
    throw new Error('Formato no válido');
  }
  return {
    sessions: data.sessions
      .filter((s) => s && /^\d{4}-\d{2}-\d{2}$/.test(s.date))
      .map((s) => ({
        id: s.id || uid(),
        date: s.date,
        routine: [1, 2, 3].includes(s.routine) ? s.routine : null,
        exercises: s.exercises && typeof s.exercises === 'object' ? s.exercises : {},
        activities: Array.isArray(s.activities) ? s.activities : [],
        finished: Boolean(s.finished),
      })),
    videoOverrides: data.videoOverrides && typeof data.videoOverrides === 'object' ? data.videoOverrides : {},
  };
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function sortedSessions() {
  return [...state.sessions].sort((a, b) => a.date.localeCompare(b.date));
}

export function getSession(date) {
  return state.sessions.find((s) => s.date === date) || null;
}

export function ensureSession(date) {
  let s = getSession(date);
  if (!s) {
    s = { id: uid(), date, routine: null, exercises: {}, activities: [], finished: false };
    state.sessions.push(s);
  }
  return s;
}

export function removeSessionIfEmpty(date) {
  const s = getSession(date);
  if (s && !s.routine && !s.activities.length && !Object.keys(s.exercises).length) {
    state.sessions = state.sessions.filter((x) => x !== s);
  }
}

export function doneSets(sets) {
  return (sets || []).filter((x) => x.done);
}

export function hasStrength(session) {
  return Object.values(session.exercises).some((sets) => doneSets(sets).length > 0);
}

/** Sesiones anteriores a `beforeDate` con alguna serie hecha del ejercicio (más reciente primero). */
export function exerciseHistory(exId, beforeDate = '9999-99-99') {
  return sortedSessions()
    .filter((s) => s.date < beforeDate && doneSets(s.exercises[exId]).length)
    .reverse()
    .map((s) => ({ date: s.date, sets: doneSets(s.exercises[exId]) }));
}

export function lastSetsFor(exId, beforeDate) {
  const [last] = exerciseHistory(exId, beforeDate);
  return last ? last.sets : null;
}

export function maxKg(sets) {
  return sets.length ? Math.max(...sets.map((x) => Number(x.kg) || 0)) : 0;
}

export function getVideo(exId, fallback) {
  return state.videoOverrides[exId] || fallback;
}

export function hasVideoOverride(exId) {
  return Boolean(state.videoOverrides[exId]);
}

export function setVideo(exId, url) {
  if (url) state.videoOverrides[exId] = url;
  else delete state.videoOverrides[exId];
  save();
}

export function exportJSON() {
  return JSON.stringify({ app: 'IvanGym', version: 1, exportedAt: new Date().toISOString(), ...state }, null, 2);
}

export function importJSON(text) {
  state = normalize(JSON.parse(text));
  save();
}

export function clearAll() {
  state = empty();
  save();
}

export function getLastQuote() {
  return Number(localStorage.getItem(QUOTE_KEY) ?? -1);
}

export function setLastQuote(i) {
  localStorage.setItem(QUOTE_KEY, String(i));
}
