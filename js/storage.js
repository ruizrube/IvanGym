// Persistencia en localStorage + exportar/importar JSON.

import { EXERCISES, ROUTINES } from './data.js';
import { todayStr as today } from './dates.js';

const KEY = 'ivangym:v1';
const QUOTE_KEY = 'ivangym:lastQuote';

export const NOTE_MAX = 200;
export const ROUTINE_LIMITS = { sets: [1, 10], reps: [1, 50], short: 20, description: 160 };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const COLOR_RE = /^#[0-9a-f]{6}$/i;

const empty = () => withRoutines({ sessions: [], videoOverrides: {}, notes: {} });

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
  return withRoutines({
    sessions: data.sessions
      .filter((s) => s && DATE_RE.test(s.date))
      .map((s) => ({
        id: s.id || uid(),
        date: s.date,
        routine: Number.isInteger(s.routine) && s.routine > 0 ? s.routine : null,
        exercises: s.exercises && typeof s.exercises === 'object' ? s.exercises : {},
        activities: Array.isArray(s.activities) ? s.activities : [],
        feel: s.feel && typeof s.feel === 'object' ? s.feel : {},
        finished: Boolean(s.finished),
      })),
    videoOverrides: data.videoOverrides && typeof data.videoOverrides === 'object' ? data.videoOverrides : {},
    notes: normalizeNotes(data.notes),
  }, data.routines);
}

/** Añade las rutinas guardadas (validadas) o, si no hay, las de data.js como punto de partida. */
function withRoutines(base, routines) {
  const valid = Array.isArray(routines) ? routines.map(cleanRoutine).filter(Boolean) : [];
  const unique = valid.filter((r, i) => valid.findIndex((x) => x.id === r.id) === i);
  base.routines = unique.length ? unique : seedRoutines(base.sessions);
  return base;
}

function seedRoutines(sessions) {
  return ROUTINES.map((r) => {
    const first = sessions.filter((s) => s.routine === r.id).map((s) => s.date).sort()[0];
    return cleanRoutine({ ...r, since: first || today() });
  });
}

function clampInt(v, [min, max], def) {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
}

function cleanText(v, max) {
  return typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '';
}

function cleanRoutine(r) {
  if (!r || !Number.isInteger(r.id) || r.id <= 0) return null;
  const exercises = (Array.isArray(r.exercises) ? r.exercises : [])
    .filter((e) => e && EXERCISES[e.id])
    .filter((e, i, all) => all.findIndex((x) => x.id === e.id) === i)
    .map((e) => ({
      id: e.id,
      sets: clampInt(e.sets, ROUTINE_LIMITS.sets, 3),
      reps: clampInt(e.reps, ROUTINE_LIMITS.reps, 12),
    }));
  const name = cleanText(r.name, 40) || `Rutina ${r.id}`;
  return {
    id: r.id,
    name,
    short: cleanText(r.short, ROUTINE_LIMITS.short) || name,
    description: cleanText(r.description, ROUTINE_LIMITS.description),
    color: COLOR_RE.test(r.color) ? r.color : '#868e96',
    exercises,
    active: r.active !== false,
    since: DATE_RE.test(r.since) ? r.since : today(),
    ...(DATE_RE.test(r.snoozeUntil) ? { snoozeUntil: r.snoozeUntil } : {}),
  };
}

function normalizeNotes(notes) {
  if (!notes || typeof notes !== 'object') return {};
  return Object.fromEntries(Object.entries(notes)
    .filter(([, v]) => typeof v === 'string' && v.trim())
    .map(([k, v]) => [k, cleanNote(v)]));
}

function cleanNote(text) {
  return text.replace(/\s+/g, ' ').trim().slice(0, NOTE_MAX);
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
    s = { id: uid(), date, routine: null, exercises: {}, activities: [], feel: {}, finished: false };
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
    .map((s) => ({ date: s.date, sets: doneSets(s.exercises[exId]), feel: s.feel?.[exId] || null }));
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

/** Nota fija del ejercicio (p. ej. dónde está la máquina en el gimnasio). */
export function getNote(exId) {
  return state.notes[exId] || '';
}

export function setNote(exId, text) {
  const note = cleanNote(text);
  if (note) state.notes[exId] = note;
  else delete state.notes[exId];
  save();
  return note;
}

/** Todas las rutinas (también las retiradas), en el orden en que se sugieren. */
export function getRoutines() {
  return state.routines;
}

export function activeRoutines() {
  return state.routines.filter((r) => r.active);
}

export function routineById(id) {
  return state.routines.find((r) => r.id === id) || null;
}

/** Id nuevo: nunca reutiliza uno ya usado en rutinas ni en el historial. */
export function nextRoutineId() {
  const used = [...state.routines.map((r) => r.id), ...state.sessions.map((s) => s.routine || 0)];
  return Math.max(0, ...used) + 1;
}

/** Crea o actualiza una rutina. Si cambia el conjunto de ejercicios, reinicia `since` (fecha de la versión actual). */
export function saveRoutine(data) {
  const prev = routineById(data.id);
  const ids = (list) => (list || []).map((e) => e.id).sort().join();
  const sameExercises = prev && ids(prev.exercises) === ids(data.exercises);
  const routine = cleanRoutine({
    ...prev,
    ...data,
    id: prev ? prev.id : nextRoutineId(),
    since: sameExercises ? prev.since : today(),
  });
  if (!routine) throw new Error('Rutina no válida');
  if (!sameExercises) delete routine.snoozeUntil;
  if (prev) state.routines[state.routines.indexOf(prev)] = routine;
  else state.routines.push(routine);
  save();
  return routine;
}

export function snoozeRoutine(id, until) {
  const r = routineById(id);
  if (!r || !DATE_RE.test(until)) return;
  r.snoozeUntil = until;
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
