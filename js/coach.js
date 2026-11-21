// Entrenador: analiza el historial y propone ajustes y rutinas nuevas.
// Reglas de docs/INVESTIGACION-ENTRENAMIENTO.md §3. Cada aviso lleva su nivel de evidencia:
//   strong   → consenso fuerte (ACSM, OMS…)
//   moderate → evidencia moderada (metaanálisis)
//   heuristic→ orientativo: heurística razonable, sin umbral publicado

import { EXERCISES, PATTERNS } from './data.js';
import { MUSCLES, exerciseMuscles } from './muscles.js';
import { addDays, daysBetween } from './dates.js';
import * as store from './storage.js';

export const EVIDENCE = {
  strong: { icon: '🟢', label: 'Consenso' },
  moderate: { icon: '🟡', label: 'Evidencia moderada' },
  heuristic: { icon: '🟠', label: 'Orientativo' },
};

/** Grupos que deben trabajarse al menos 2 días por semana (Garber et al. 2011; OMS 2020). */
export const MAJOR_MUSCLES = ['pectoral', 'dorsal', 'deltoides', 'cuadriceps', 'isquiotibiales', 'gluteos', 'abdomen'];

/** Niveles de volumen semanal (series efectivas por músculo). */
export const VOLUME_LEVELS = [
  { id: 'deficit', label: 'Déficit (< 4)' },
  { id: 'low', label: 'Bajo (4-6)' },
  { id: 'ok', label: 'Adecuado (6-16)' },
  { id: 'high', label: 'Alto (16-22)' },
  { id: 'excess', label: 'Muy alto (> 22)' },
];
export function volumeLevel(sets) {
  if (sets < 4) return 'deficit';
  if (sets < 6) return 'low';
  if (sets <= 16) return 'ok';
  return sets <= 22 ? 'high' : 'excess';
}

export const CARDIO_TARGET = [150, 300]; // min/semana de actividad moderada (OMS 2020)
const MET_MODERATE = 3;
const MET_VIGOROUS = 6;

export const PROPOSAL_WEEKS = 6;
export const MAX_WEEKS = 12;
const STAGNANT_SESSIONS = 4;
const HARD_EXERCISES = 3;
const MAX_CHANGES = 2;
// Equilibrio (§3.3): tracción/empuje < 0,8 es desequilibrio; 0,8-1,5, equilibrado.
const PULL_PUSH_MIN = 0.8;
const MIN_PUSH_SETS = 6;

// ---------- Utilidades ----------

const inWindow = (today, days) => {
  const from = addDays(today, -(days - 1));
  return store.sortedSessions().filter((s) => s.date >= from && s.date <= today);
};
const doneCount = (s, exId) => store.doneSets(s.exercises[exId]).length;
const musclesOf = (exId) => exerciseMuscles(EXERCISES[exId]);

/** Series efectivas por músculo de una lista de sesiones (principal ×1, secundario ×0,5). */
function muscleSets(sessions) {
  const out = Object.fromEntries(Object.keys(MUSCLES).map((id) => [id, 0]));
  sessions.forEach((s) => Object.keys(s.exercises).forEach((exId) => {
    const n = EXERCISES[exId] ? doneCount(s, exId) : 0;
    if (!n) return;
    const { primary, secondary } = musclesOf(exId);
    primary.forEach((m) => (out[m] += n));
    secondary.forEach((m) => (out[m] += n * 0.5));
  }));
  return out;
}

// ---------- Volumen, frecuencia y equilibrio ----------

/** Series efectivas por músculo en los últimos 7 días. */
export const weeklyVolume = (today) => muscleSets(inWindow(today, 7));

/** Días de los últimos 7 en que cada músculo recibió al menos 1 serie efectiva. */
export function weeklyFrequency(today) {
  const out = Object.fromEntries(Object.keys(MUSCLES).map((id) => [id, 0]));
  inWindow(today, 7).forEach((s) => {
    Object.entries(muscleSets([s])).forEach(([m, n]) => {
      if (n >= 1) out[m] += 1;
    });
  });
  return out;
}

/** Series de torso de tracción/empuje y de pierna/torso en los últimos 14 días. */
export function balance(today) {
  const t = { push: 0, pull: 0, upper: 0, lower: 0 };
  inWindow(today, 14).forEach((s) => Object.keys(s.exercises).forEach((exId) => {
    const p = PATTERNS[EXERCISES[exId]?.pattern];
    const n = p ? doneCount(s, exId) : 0;
    if (!n) return;
    if (p.side === 'empuje') t.push += n;
    if (p.side === 'traccion') t.pull += n;
    if (p.region === 'torso') t.upper += n;
    if (p.region === 'pierna') t.lower += n;
  }));
  return {
    ...t,
    pullPush: t.push ? t.pull / t.push : null,
    lowerUpper: t.upper ? t.lower / t.upper : null,
  };
}

/** ¿La tracción va claramente por detrás del empuje? */
const pushHeavy = (bal) => bal.pullPush !== null && bal.push >= MIN_PUSH_SETS && bal.pullPush < PULL_PUSH_MIN;

// ---------- Estancamiento, parón y fatiga ----------

/** Mejor marca de una sesión: kg máximos y repeticiones con ese peso. */
function best(sets) {
  const kg = store.maxKg(sets);
  const reps = Math.max(...sets.filter((x) => (Number(x.kg) || 0) === kg).map((x) => Number(x.reps) || 0));
  return { kg, reps };
}

/**
 * ¿Lleva 4 sesiones seguidas sin mejorar ni kg ni repeticiones?
 * Si la última se valoró 😎 no cuenta: le falta carga, no está estancado (la progresión ya sube el peso).
 * Heurística propia (§3.5): no hay una definición validada de estancamiento.
 */
export function isStagnant(exId, date) {
  const hist = store.exerciseHistory(exId, date).slice(0, STAGNANT_SESSIONS).reverse();
  if (hist.length < STAGNANT_SESSIONS || hist.at(-1).feel === 'easy') return false;
  const ref = best(hist[0].sets);
  return hist.slice(1).every((h) => {
    const b = best(h.sets);
    return b.kg < ref.kg || (b.kg === ref.kg && b.reps <= ref.reps);
  });
}

/**
 * Factor de carga tras un parón en ese ejercicio (§3.6, heurística sin respaldo cuantitativo):
 * ≥ 14 días → −10 %; ≥ 28 días → −20 % y conviene un reinicio progresivo.
 */
export function detraining(lastDate, date) {
  const days = daysBetween(lastDate, date);
  if (days >= 28) return { days, factor: 0.8, restart: true };
  if (days >= 14) return { days, factor: 0.9, restart: false };
  return null;
}

/** Ejercicios valorados 😣 en los últimos 14 días; con 3 o más distintos conviene una semana de descarga. */
export function fatigue(today) {
  const hard = new Set();
  inWindow(today, 14).forEach((s) => Object.entries(s.feel || {}).forEach(([exId, f]) => {
    if (f === 'hard' && EXERCISES[exId]) hard.add(exId);
  }));
  return { exercises: [...hard], deload: hard.size >= HARD_EXERCISES };
}

// ---------- Cardio frente a la recomendación de la OMS ----------

/** Minutos de actividad aeróbica de los últimos 7 días; los vigorosos cuentan doble (OMS 2020). */
export function cardioWeek(today, metOf) {
  const out = { moderate: 0, vigorous: 0 };
  inWindow(today, 7).forEach((s) => s.activities.forEach((a) => {
    const met = metOf(a);
    const min = Number(a.minutes) || 0;
    if (met >= MET_VIGOROUS) out.vigorous += min;
    else if (met >= MET_MODERATE) out.moderate += min;
  }));
  return { ...out, equivalent: out.moderate + out.vigorous * 2, target: CARDIO_TARGET };
}

// ---------- Avisos ----------

/** Avisos del estado actual del entrenamiento, ordenados por importancia. */
export function alerts(today, metOf) {
  const out = [];
  const trained = store.sortedSessions().some((s) => s.date <= today && store.hasStrength(s));
  if (!trained) return out;
  const vol = weeklyVolume(today);
  const freq = weeklyFrequency(today);
  const fat = fatigue(today);
  if (fat.deload) {
    out.push({
      kind: 'warn',
      text: `Has marcado 😣 ${fat.exercises.length} ejercicios en 2 semanas: plantéate una semana de descarga (−10-20 % de carga o de series).`,
      evidence: 'moderate',
      source: 'Pancar et al. 2026; Rogerson et al. 2024',
    });
  }
  const low = MAJOR_MUSCLES.filter((m) => vol[m] < 4);
  if (low.length) {
    out.push({
      kind: 'info',
      text: `Poco volumen esta semana en ${low.map((m) => MUSCLES[m].name.toLowerCase()).join(', ')} (menos de 4 series).`,
      evidence: 'moderate',
      source: 'Schoenfeld et al. 2017',
    });
  }
  const excess = Object.keys(vol).filter((m) => vol[m] > 22);
  if (excess.length) {
    out.push({
      kind: 'warn',
      text: `Mucho volumen esta semana en ${excess.map((m) => MUSCLES[m].name.toLowerCase()).join(', ')} (más de 22 series): vigila la fatiga.`,
      evidence: 'heuristic',
      source: 'Pelland et al. 2025',
    });
  }
  const rare = MAJOR_MUSCLES.filter((m) => freq[m] < 2 && !low.includes(m));
  if (rare.length) {
    out.push({
      kind: 'info',
      text: `Solo 1 día esta semana para ${rare.map((m) => MUSCLES[m].name.toLowerCase()).join(', ')}: lo ideal es al menos 2.`,
      evidence: 'strong',
      source: 'Garber et al. 2011; OMS 2020',
    });
  }
  const bal = balance(today);
  if (pushHeavy(bal)) {
    out.push({
      kind: 'info',
      text: 'Haces bastante más empuje que tracción: prioriza remos y jalones.',
      evidence: 'heuristic',
      source: 'Garber et al. 2011',
    });
  }
  if (bal.lowerUpper !== null && bal.upper >= 6 && bal.lowerUpper < 0.5) {
    out.push({
      kind: 'info',
      text: 'Las piernas van por detrás del torso: refuerza sentadilla, prensa o zancadas.',
      evidence: 'heuristic',
      source: 'Garber et al. 2011',
    });
  }
  const cardio = cardioWeek(today, metOf);
  if (cardio.equivalent < CARDIO_TARGET[0]) {
    out.push({
      kind: 'info',
      text: `Cardio esta semana: ${cardio.equivalent} de 150 min recomendados (los minutos intensos cuentan doble).`,
      evidence: 'strong',
      source: 'OMS 2020',
    });
  }
  return out;
}

// ---------- Propuestas de rutina ----------

const weeksSince = (date, today) => Math.floor(daysBetween(date, today) / 7);

/** Ejercicios usados alguna vez en el historial. */
const usedExercises = () => new Set(store.sortedSessions().flatMap((s) => Object.keys(s.exercises)));

const patternOf = (exId) => PATTERNS[EXERCISES[exId]?.pattern];

/** Interés de un ejercicio nuevo: trabaja músculos con poco volumen y aún no se ha probado. */
function freshness(id, { deficit, used }) {
  const { primary, secondary } = musclesOf(id);
  return primary.filter((m) => deficit.includes(m)).length * 2
    + secondary.filter((m) => deficit.includes(m)).length
    + (used.has(id) ? 0 : 0.5);
}

/** Mejor alternativa del mismo patrón que no esté ya en las rutinas activas; prioriza músculos con déficit. */
function alternative(exId, ctx) {
  const pattern = EXERCISES[exId].pattern;
  return Object.keys(EXERCISES)
    .filter((id) => id !== exId && EXERCISES[id].pattern === pattern && !ctx.taken.has(id))
    .sort((a, b) => freshness(b, ctx) - freshness(a, ctx) || a.localeCompare(b))[0] || null;
}

/** Motivos para renovar una rutina (vacío si no toca). */
function triggers(routine, today) {
  const weeks = weeksSince(routine.since, today);
  const used = store.sortedSessions().some((s) => s.routine === routine.id && s.date >= routine.since && store.hasStrength(s));
  const stagnant = routine.exercises.map((p) => p.id).filter((id) => isStagnant(id, addDays(today, 1)));
  const reasons = [];
  if (stagnant.length >= 2) {
    reasons.push({
      text: `${stagnant.length} ejercicios llevan ${STAGNANT_SESSIONS} sesiones sin progresar.`,
      evidence: 'heuristic',
      source: 'Heurística propia; Pallarés et al. 2021',
    });
  }
  if (used && weeks > MAX_WEEKS) {
    reasons.push({
      text: `Llevas ${weeks} semanas con esta versión de la rutina: toca variar el estímulo.`,
      evidence: 'heuristic',
      source: 'Williams et al. 2017; Moesgaard et al. 2022',
    });
  } else if (used && weeks >= PROPOSAL_WEEKS) {
    reasons.push({
      text: `Llevas ${weeks} semanas con esta versión de la rutina: es buen momento para una variante.`,
      evidence: 'heuristic',
      source: 'Williams et al. 2017; Moesgaard et al. 2022',
    });
  }
  return { reasons, stagnant };
}

/** Ejercicios que conviene cambiar, por prioridad: primero los estancados y luego los de músculos más trabajados. */
function swapCandidates(routine, stagnant, vol) {
  const load = (id) => musclesOf(id).primary.reduce((a, m) => a + vol[m], 0);
  const rest = routine.exercises.map((p) => p.id).filter((id) => !stagnant.includes(id))
    .sort((a, b) => load(b) - load(a));
  return [...stagnant, ...rest];
}

/** Datos comunes a las propuestas de todas las rutinas. `taken` crece con cada cambio propuesto. */
function proposalContext(today) {
  const vol = weeklyVolume(today);
  return {
    vol,
    deficit: Object.keys(vol).filter((m) => ['deficit', 'low'].includes(volumeLevel(vol[m]))),
    taken: new Set(store.activeRoutines().flatMap((r) => r.exercises.map((p) => p.id))),
    used: usedExercises(),
  };
}

/**
 * Cambio de patrón para reequilibrar empuje/tracción (§3.3, orientativo), o null si no hace falta.
 * Si la tracción va por detrás, cambia un ejercicio de empuje cuyo patrón ya cubre otro ejercicio de
 * las rutinas activas por uno de tracción, priorizando los patrones de tracción que no se hacen.
 * Se calcula una sola vez para todas las rutinas, para no quitar el mismo patrón en dos a la vez.
 */
function rebalanceSwap(today, routines, ctx) {
  const bal = balance(today);
  if (!pushHeavy(bal)) return null;
  const all = store.activeRoutines().flatMap((r) => r.exercises.map((p) => p.id));
  const covered = (id) => all.filter((x) => EXERCISES[x]?.pattern === EXERCISES[id].pattern).length;
  const sideCount = (r, side) => r.exercises.filter((p) => patternOf(p.id)?.side === side).length;
  const load = (id) => musclesOf(id).primary.reduce((a, m) => a + ctx.vol[m], 0);
  const from = routines
    .map((r) => ({
      routine: r,
      imbalance: sideCount(r, 'empuje') - sideCount(r, 'traccion'),
      exId: r.exercises.map((p) => p.id)
        .filter((id) => patternOf(id)?.side === 'empuje' && covered(id) >= 2)
        .sort((a, b) => load(b) - load(a))[0],
    }))
    .filter((x) => x.exId)
    .sort((a, b) => b.imbalance - a.imbalance)[0];
  if (!from) return null;
  const score = (id) => (covered(id) ? 0 : 4) + freshness(id, ctx);
  const to = Object.keys(EXERCISES)
    .filter((id) => patternOf(id)?.side === 'traccion' && !ctx.taken.has(id))
    .sort((a, b) => score(b) - score(a) || a.localeCompare(b))[0];
  if (!to) return null;
  return {
    routine: from.routine.id,
    from: from.exId,
    to,
    why: `Haces más empuje que tracción (${bal.push} series frente a ${bal.pull} en 2 semanas) y ya tienes otro ejercicio de ${patternOf(from.exId).name.toLowerCase()}: cámbialo por uno de ${patternOf(to).name.toLowerCase()}.`,
  };
}

/** Variante de una rutina con motivos para renovarse: 1-2 cambios; mantiene series y repeticiones. */
function buildProposal({ routine, reasons, stagnant }, ctx, fix) {
  const changes = fix ? [{ from: fix.from, to: fix.to, why: fix.why }] : [];
  for (const exId of swapCandidates(routine, stagnant, ctx.vol)) {
    if (changes.length >= MAX_CHANGES) break;
    if (changes.some((c) => c.from === exId)) continue;
    const to = alternative(exId, ctx);
    if (!to) continue;
    ctx.taken.add(to);
    changes.push({
      from: exId,
      to,
      why: stagnant.includes(exId)
        ? 'Estancado: una variante del mismo movimiento ofrece un estímulo nuevo.'
        : `Variante del mismo patrón (${patternOf(exId).name.toLowerCase()}).`,
    });
  }
  if (!changes.length) return null;
  const exercises = routine.exercises.map((p) => {
    const c = changes.find((x) => x.from === p.id);
    return c ? { ...p, id: c.to } : p;
  });
  return { routine, reasons, changes, exercises };
}

/**
 * Propuestas de variante de las rutinas activas que toca renovar (y no están pospuestas).
 * Cambian ejercicios por otros del mismo patrón y, si falta tracción, uno de empuje por otro de tracción.
 */
export function routineProposals(today) {
  const pending = store.activeRoutines()
    .filter((r) => !(r.snoozeUntil && r.snoozeUntil > today))
    .map((r) => ({ routine: r, ...triggers(r, today) }))
    .filter((t) => t.reasons.length);
  const ctx = proposalContext(today);
  const fix = rebalanceSwap(today, pending.map((t) => t.routine), ctx);
  if (fix) ctx.taken.add(fix.to);
  return pending.map((t) => buildProposal(t, ctx, fix?.routine === t.routine.id ? fix : null)).filter(Boolean);
}
