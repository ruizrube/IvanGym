import {
  ACTIVITY_TYPES, EXERCISES, FEELINGS, MIN_PER_EXERCISE, MIN_PER_SET, PATTERNS, PROFILE, QUOTES, ROUTINES, STRENGTH_MET, TIPS, WEIGHT_STEP,
} from './data.js';
import {
  bodyMap, exerciseMuscles, MUSCLES, unknownMuscles, viewsOf,
} from './muscles.js';
import * as store from './storage.js';
import * as coach from './coach.js';
import {
  addDays, daysBetween, pad, parseDate, toDateStr, todayStr, weekStart,
} from './dates.js';

const view = document.getElementById('view');
const dialog = document.getElementById('dialog');
const toastEl = document.getElementById('toast');

// ---------- Utilidades ----------

const fmtDate = (s, opts = { weekday: 'long', day: 'numeric', month: 'long' }) =>
  parseDate(s).toLocaleDateString('es-ES', opts);
const fmtShort = (s) => fmtDate(s, { day: 'numeric', month: 'short' });
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fmtNum = (n) => (Number(n) || 0).toLocaleString('es-ES', { maximumFractionDigits: 2 });
const parseNum = (v) => {
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const { routineById, activeRoutines } = store;
/** Atributo style con el color de la rutina (lo usan .badge, .chip y el calendario). */
const rStyle = (id) => {
  const c = routineById(id)?.color;
  return c ? ` style="--rc: ${c}"` : '';
};
const activityType = (id) => ACTIVITY_TYPES.find((a) => a.id === id) || ACTIVITY_TYPES.at(-1);
const gifFor = (exId) => EXERCISES[exId]?.gif || `img/exercises/${exId}.gif`;
const GIF_FALLBACK = `onerror="this.onerror=null;this.src='icon.svg'"`;
const hasContent = (s) => Boolean(s) && (store.hasStrength(s) || s.activities.length > 0);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
// ---------- Calorías estimadas (kcal ≈ MET × kg × horas) ----------

const kcal = (met, minutes) => met * PROFILE.weightKg * (minutes / 60);
/** Andar/correr/cinta: si hay km, el MET se estima por la velocidad. */
function activityMet(a) {
  const t = activityType(a.type);
  const kmh = a.km && a.minutes ? a.km / (a.minutes / 60) : 0;
  if (!t.bySpeed || !kmh) return t.met;
  return kmh < 7 ? Math.max(2.5, 0.9 * kmh - 1) : 0.95 * kmh + 0.8;
}
const activityKcal = (a) => kcal(activityMet(a), Number(a.minutes) || 0);
function strengthKcal(s) {
  const worked = Object.values(s.exercises).map((rows) => store.doneSets(rows).length).filter(Boolean);
  const minutes = worked.reduce((a, n) => a + n * MIN_PER_SET, 0) + worked.length * MIN_PER_EXERCISE;
  return kcal(STRENGTH_MET, minutes);
}
const sessionKcal = (s) => strengthKcal(s) + s.activities.reduce((a, x) => a + activityKcal(x), 0);
const fmtKcal = (n) => `≈ ${Math.round(n).toLocaleString('es-ES')} kcal`;

const setsSummary = (sets) => sets.map((x) => `${fmtNum(x.kg)}×${x.reps}`).join(' · ');

function toast(msg, ms = 2600) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => toastEl.classList.remove('show'), ms);
}

function openDialog(html, onSubmit) {
  dialog.innerHTML = html;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  const form = dialog.querySelector('form');
  if (form && onSubmit) {
    form.addEventListener('submit', (e) => {
      if (e.submitter?.value === 'cancel') return;
      e.preventDefault();
      if (onSubmit(new FormData(form)) !== false) dialog.close();
    });
  }
}

dialog.addEventListener('click', (e) => {
  const tab = e.target.closest('[data-video-kind]');
  if (tab) return videoDialog(tab.dataset.ex, tab.dataset.videoKind);
  const muscle = e.target.closest('[data-muscle]');
  if (muscle) return muscleDialog(muscle.dataset.muscle);
  if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
});
dialog.addEventListener('close', () => {
  dialog.innerHTML = '';
});

function youtubeId(url) {
  const m = String(url).match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

// ---------- Lógica de dominio ----------

function suggestRoutine(date) {
  const last = store
    .sortedSessions()
    .filter((s) => s.date < date && s.routine && store.hasStrength(s))
    .at(-1);
  const active = activeRoutines();
  if (!active.length) return null;
  const i = last ? active.findIndex((r) => r.id === last.routine) : -1;
  return active[(i + 1) % active.length];
}

/** Ejercicios de un día: los guardados en la sesión, con la prescripción de su rutina o la deducida de las series. */
function dayExercises(s, routine) {
  return Object.entries(s?.exercises || {})
    .filter(([id]) => EXERCISES[id])
    .map(([id, rows]) => routine?.exercises.find((p) => p.id === id)
      || { id, sets: rows.length || 1, reps: Number(rows[0]?.reps) || 12 });
}

// ---------- Progresión de cargas ----------

const stepFor = (exId) => EXERCISES[exId]?.step || WEIGHT_STEP;
const feelById = (id) => FEELINGS.find((f) => f.id === id);
const roundTo = (n, step) => Math.round(n / step) * step;
/** ¿Hizo todas las series y repeticiones prescritas? */
const completed = (h, presc) => h.sets.length >= presc.sets && h.sets.every((x) => (Number(x.reps) || 0) >= presc.reps);

/**
 * Peso propuesto para hoy según las dos últimas sesiones del ejercicio:
 * 😎 + todo hecho → sube; 💪 dos veces seguidas con todo hecho (mismo peso) → sube;
 * 😣 dos veces seguidas → baja un 10 %; resto → mantiene.
 * Tras un parón en el ejercicio (≥ 14 días) baja un 10-20 % (coach.detraining).
 */
function suggestLoad(exId, presc, date) {
  const [last, prev] = store.exerciseHistory(exId, date);
  if (!last) return null;
  const step = stepFor(exId);
  const kg = store.maxKg(last.sets);
  const done = completed(last, presc);
  const sameKg = prev && store.maxKg(prev.sets) === kg;
  let action = 'keep';
  let reason;
  if (last.feel === 'easy' && done) {
    action = 'up';
    reason = 'la última vez te resultó fácil';
  } else if (last.feel === 'ok' && done && prev?.feel === 'ok' && completed(prev, presc) && sameKg) {
    action = 'up';
    reason = 'dos sesiones seguidas completas con este peso';
  } else if (last.feel === 'hard' && prev?.feel === 'hard') {
    action = 'down';
    reason = 'dos sesiones seguidas duras';
  } else if (!last.feel) {
    reason = done ? 'completaste todo, pero no lo valoraste' : 'no completaste todas las repeticiones';
  } else if (!done) {
    reason = 'no completaste todas las repeticiones';
  } else {
    reason = last.feel === 'ok' ? 'consolida este peso una sesión más' : 'aún te cuesta: consolida';
  }
  let target = action === 'up' ? kg + step : action === 'down' ? Math.max(0, roundTo(kg * 0.9, step)) : kg;
  const pause = coach.detraining(last.date, date);
  if (pause && action !== 'down' && kg > 0) {
    action = 'down';
    target = Math.max(0, roundTo(kg * pause.factor, step));
    reason = `llevas ${pause.days} días sin hacerlo${pause.restart ? ': reinicia con calma y sube poco a poco' : ''}`;
  }
  return { last, action, kg: target, reason };
}

function initRows(exId, presc, date) {
  const sug = suggestLoad(exId, presc, date);
  const last = sug?.last.sets || [];
  return Array.from({ length: presc.sets }, (_, i) => ({
    kg: sug && sug.action !== 'keep' ? sug.kg : (last[i] || last.at(-1))?.kg ?? 0,
    reps: presc.reps,
    done: false,
  }));
}

function setRoutine(date, routineId) {
  const s = store.ensureSession(date);
  s.routine = routineId;
  s.exercises = {};
  s.feel = {};
  s.finished = false;
  const r = routineById(routineId);
  if (r) r.exercises.forEach((p) => (s.exercises[p.id] = initRows(p.id, p, date)));
  store.removeSessionIfEmpty(date);
  store.save();
}

function previousBest(exId, date) {
  const hist = store.exerciseHistory(exId, date);
  return hist.length ? Math.max(...hist.map((h) => store.maxKg(h.sets))) : null;
}

function isRecord(exId, date, kg) {
  const best = previousBest(exId, date);
  return best !== null && kg > best;
}

function recentRecords(days = 7) {
  const since = addDays(todayStr(), -days);
  const out = [];
  Object.keys(EXERCISES).forEach((exId) => {
    let best = null;
    store.exerciseHistory(exId).reverse().forEach((h) => {
      const m = store.maxKg(h.sets);
      if (best !== null && m > best && h.date >= since) out.push({ exId, kg: m, date: h.date });
      best = best === null ? m : Math.max(best, m);
    });
  });
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

// ---------- Mensaje motivador ----------

function pickQuote() {
  const today = todayStr();
  const contextual = [];
  const prev = store.sortedSessions().filter((s) => s.date < today && hasContent(s)).at(-1);
  if (prev && !hasContent(store.getSession(today))) {
    const n = daysBetween(prev.date, today);
    if (n >= 4) contextual.push(`¡Pablo y tus alumnos te echaban de menos en el gym! Hace ${n} días de tu última visita. 💪`);
  }
  const ws = weekStart(today);
  const weekDays = store.sortedSessions().filter((s) => s.date >= ws && s.date <= today && hasContent(s)).length;
  if (weekDays >= 2) contextual.push(`Llevas ${weekDays} días activos esta semana. ¡Racha en modo producción! 🔥`);
  const rec = recentRecords().at(-1);
  if (rec) contextual.push(`Récord reciente en ${EXERCISES[rec.exId].name}: ${fmtNum(rec.kg)} kg. Pablo ya presume de papá. 🏆`);

  if (contextual.length && Math.random() < 0.6) return contextual[Math.floor(Math.random() * contextual.length)];
  const last = store.getLastQuote();
  let i;
  do i = Math.floor(Math.random() * QUOTES.length);
  while (i === last && QUOTES.length > 1);
  store.setLastQuote(i);
  return QUOTES[i];
}

// ---------- Vista: día (Hoy / día del historial) ----------

function renderDay(date) {
  const isToday = date === todayStr();
  const s = store.getSession(date);
  const routine = s?.routine ? routineById(s.routine) : null;
  const suggested = suggestRoutine(date);
  const yesterday = store.getSession(addDays(date, -1));
  const restHint =
    !routine && yesterday && store.hasStrength(yesterday)
      ? '<p class="hint">😌 Ayer hiciste fuerza: hoy puede ser buen día para descanso activo (andar, estirar).</p>'
      : '<p class="hint">Consejo: deja ~1 día de descanso activo (andar, estirar) entre días de fuerza.</p>';

  view.innerHTML = `
    <div class="page-head">
      ${isToday ? '<h2>Hoy</h2>' : `<a class="back" href="#/historial/${date.slice(0, 7)}">← Historial</a>`}
      <p class="muted">${cap(fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}</p>
    </div>

    <section class="card">
      ${routine ? `
        <div class="routine-title">
          <span class="badge"${rStyle(routine.id)}>${routine.id}</span>
          <div><h3>${esc(routine.short)}</h3><p class="routine-desc">${esc(routine.name)} · ${esc(routine.description)}</p></div>
        </div>` : suggested ? `
        <p class="eyebrow">Rutina sugerida</p>
        <button class="btn primary big" data-action="routine" data-id="${suggested.id}">
          Empezar ${esc(suggested.name)} · ${esc(suggested.short)}
        </button>
        <p class="muted small-text">${esc(suggested.description)}</p>
        <p class="muted small-text">O elige otra:</p>` : `
        <p class="muted">No tienes rutinas activas. <a href="#/rutinas">Crea o activa una</a>.</p>`}
      <div class="chips" role="group" aria-label="Elegir rutina">
        ${activeRoutines().map((r) => `
          <button class="chip ${routine?.id === r.id ? 'active' : ''}"${rStyle(r.id)} data-action="routine" data-id="${r.id}" aria-pressed="${routine?.id === r.id}">
            ${esc(r.short)}<small>${esc(r.name)}</small>
          </button>`).join('')}
        ${routine ? '<button class="chip" data-action="routine" data-id="0">Sin fuerza</button>' : ''}
      </div>
      ${restHint}
    </section>

    ${isToday ? coachBanner(date) : ''}

    ${routine ? `<section class="exercises">${dayExercises(s, routine).map((p, i) => exerciseCard(date, s, p, i)).join('')}</section>` : ''}

    <section class="card">
      <h3>Actividades</h3>
      ${s?.activities.length ? `<ul class="activities">${s.activities.map(activityItem).join('')}</ul>` : '<p class="muted">Cardio, andar, estirar… (opcional)</p>'}
      <button class="btn" data-action="add-activity">➕ Añadir actividad</button>
    </section>

    <section class="card tips">
      <h3>Recuerda</h3>
      <ul>${TIPS.map((t) => `<li>${t}</li>`).join('')}</ul>
    </section>

    ${s && (routine || s.activities.length) ? `
      <section class="finish">
        ${s.finished
          ? '<p class="done-msg">✅ Sesión terminada. ¡Buen trabajo!</p><button class="btn" data-action="reopen">Reabrir sesión</button>'
          : '<button class="btn primary big" data-action="finish">🏁 Terminar sesión</button>'}
      </section>` : ''}
  `;
  view.dataset.date = date;
}

/** Avisos del entrenador para el día de hoy: descarga y propuestas de rutina. */
function coachBanner(date) {
  const fat = coach.fatigue(date);
  const props = coach.routineProposals(date);
  if (!fat.deload && !props.length) return '';
  return `
    <section class="card coach-banner">
      ${fat.deload ? `<p>😮‍💨 Has marcado 😣 <strong>${fat.exercises.length} ejercicios</strong> en las dos últimas semanas. Plantéate una <strong>semana de descarga</strong>: baja un 10-20 % el peso o quita una serie. ${evidenceTag('moderate')}</p>` : ''}
      ${props.length ? `<p>🧭 Tienes ${props.length === 1 ? 'una propuesta' : `${props.length} propuestas`} para renovar ${props.map((p) => `<strong>${esc(p.routine.name)}</strong>`).join(', ')}.</p>
        <a class="btn small" href="#/rutinas">Ver propuesta${props.length === 1 ? '' : 's'}</a>` : ''}
    </section>`;
}

const evidenceTag = (level) => `<span class="evidence" title="${coach.EVIDENCE[level].label}">${coach.EVIDENCE[level].icon} ${coach.EVIDENCE[level].label}</span>`;

function exerciseCard(date, s, presc, idx) {
  const ex = EXERCISES[presc.id];
  const rows = s.exercises[presc.id] || [];
  const sug = suggestLoad(presc.id, presc, date);
  const hist = sug?.last;
  const feel = s.feel?.[presc.id];
  const arrow = { up: '⬆️ sube', keep: '➡️ mantén', down: '⬇️ baja' };
  const allDone = rows.length > 0 && rows.every((r) => r.done);
  return `
    <article class="card ex-card ${allDone ? 'complete' : ''}" data-ex="${presc.id}">
      <div class="ex-head">
        <button class="gif-btn" data-action="zoom" aria-label="Ampliar animación de ${esc(ex.name)}">
          <img class="ex-gif" src="${gifFor(presc.id)}" alt="${esc(ex.name)}" loading="lazy" width="116" height="167" ${GIF_FALLBACK}>
        </button>
        <div class="ex-info">
          <h3><span class="muted">${idx + 1}.</span> ${esc(ex.name)}</h3>
          <button class="muscles" data-action="muscles" aria-label="Ver músculos de ${esc(ex.name)} en el mapa">
            ${bodyMap(exerciseMuscles(ex))}
            <span><strong>${ex.primary.join(', ')}</strong>${ex.secondary.length ? `<br><span class="muted">${ex.secondary.join(', ')}</span>` : ''}</span>
          </button>
          <p class="presc">${presc.sets} × ${presc.reps}</p>
          <div class="video-btns">
            <button class="btn small" data-action="video" data-kind="tech">▶ Técnica</button>
            ${videoUrl(presc.id, 'matrix') ? '<button class="btn small" data-action="video" data-kind="matrix">▶ Matrix</button>' : ''}
          </div>
        </div>
      </div>
      <p class="ex-tip">💡 ${esc(ex.tip)}${ex.note ? `<br><span class="muted">${esc(ex.note)}</span>` : ''}</p>
      <label class="ex-note">
        <span aria-hidden="true">📍</span>
        <textarea data-note rows="1" maxlength="${store.NOTE_MAX}" enterkeyhint="done" autocomplete="off"
          placeholder="Dónde está la máquina, ajustes…"
          aria-label="Nota sobre ${esc(ex.name)} (ubicación de la máquina, ajustes…)">${esc(store.getNote(presc.id))}</textarea>
      </label>
      <p class="ex-last">${hist
        ? `Última vez (${fmtShort(hist.date)}): ${setsSummary(hist.sets)}${hist.feel ? ` · ${feelById(hist.feel).icon} ${feelById(hist.feel).label}` : ''}`
        : 'Primera vez: empieza con poco peso y buena técnica.'}</p>
      ${sug ? `<p class="ex-next next-${sug.action}">${date === todayStr() ? 'Hoy' : 'Propuesta'}: <strong>${fmtNum(sug.kg)} kg</strong> ${arrow[sug.action]} <span class="muted">· ${sug.reason}</span></p>` : ''}
      ${coach.isStagnant(presc.id, date) ? `<p class="ex-stuck">🟠 <strong>Estancado</strong>: 4 sesiones sin mejorar peso ni repeticiones. Prueba a cambiar el rango de repeticiones o a variar el ejercicio en <a href="#/rutinas">Rutinas</a>.</p>` : ''}
      <div class="sets">
        <div class="set-head"><span>#</span><span>kg</span><span>reps</span><span>hecha</span></div>
        ${rows.map((r, i) => setRow(r, i)).join('')}
      </div>
      <div class="set-tools">
        <button class="btn small ghost" data-action="remove-set" ${rows.length <= 1 ? 'disabled' : ''}>− Serie</button>
        <button class="btn small ghost" data-action="add-set">+ Serie</button>
      </div>
      <div class="feel" role="group" aria-label="¿Qué tal te ha ido?">
        <span class="feel-q">¿Qué tal?</span>
        ${FEELINGS.map((f) => `
          <button class="feel-btn ${f.id}" data-action="feel" data-v="${f.id}" aria-pressed="${feel === f.id}" title="${f.help}">
            <span aria-hidden="true">${f.icon}</span>${f.label}
          </button>`).join('')}
      </div>
    </article>`;
}

function setRow(r, i) {
  return `
    <div class="set-row ${r.done ? 'done' : ''}" data-i="${i}">
      <span class="set-n">${i + 1}</span>
      <div class="stepper">
        <button data-action="step" data-field="kg" data-d="-1" aria-label="Menos peso">−</button>
        <input data-field="kg" inputmode="decimal" value="${fmtNum(r.kg)}" aria-label="Kilos serie ${i + 1}">
        <button data-action="step" data-field="kg" data-d="1" aria-label="Más peso">+</button>
      </div>
      <div class="stepper">
        <button data-action="step" data-field="reps" data-d="-1" aria-label="Menos repeticiones">−</button>
        <input data-field="reps" inputmode="numeric" value="${r.reps}" aria-label="Repeticiones serie ${i + 1}">
        <button data-action="step" data-field="reps" data-d="1" aria-label="Más repeticiones">+</button>
      </div>
      <button class="check" data-action="toggle" aria-pressed="${r.done}" aria-label="Serie ${i + 1} hecha">✓</button>
    </div>`;
}

function activityItem(a, i) {
  const t = activityType(a.type);
  const parts = [a.minutes ? `${a.minutes} min` : '', a.km ? `${fmtNum(a.km)} km` : '', a.minutes ? fmtKcal(activityKcal(a)) : '']
    .filter(Boolean).join(' · ');
  return `
    <li data-i="${i}">
      <span class="act-icon" aria-hidden="true">${t.icon}</span>
      <div><strong>${esc(t.label)}</strong> ${parts ? `<span class="muted">${parts}</span>` : ''}${a.note ? `<br><small>${esc(a.note)}</small>` : ''}</div>
      <button class="icon-btn" data-action="remove-activity" aria-label="Borrar actividad">✕</button>
    </li>`;
}

function activityDialog(date) {
  const groups = [...new Set(ACTIVITY_TYPES.map((a) => a.group))];
  openDialog(
    `<form method="dialog" class="form">
      <h3>Registrar actividad</h3>
      <p class="muted">${cap(fmtDate(date))}</p>
      <label>Tipo
        <select name="type" required>
          ${groups.map((g) => `<optgroup label="${g}">${ACTIVITY_TYPES.filter((a) => a.group === g)
            .map((a) => `<option value="${a.id}">${a.icon} ${a.label}</option>`).join('')}</optgroup>`).join('')}
        </select>
      </label>
      <div class="row2">
        <label>Minutos<input name="minutes" type="number" inputmode="numeric" min="1" max="600" value="30" required></label>
        <label>Km (opcional)<input name="km" inputmode="decimal" placeholder="—"></label>
      </div>
      <label>Nota (opcional)<input name="note" maxlength="140" placeholder="Ritmo, sensaciones, qué actividad…"></label>
      <div class="actions">
        <button class="btn" value="cancel" formnovalidate>Cancelar</button>
        <button class="btn primary" value="ok">Guardar</button>
      </div>
    </form>`,
    (fd) => {
      const s = store.ensureSession(date);
      s.activities.push({
        type: fd.get('type'),
        minutes: Math.round(parseNum(fd.get('minutes'))),
        km: parseNum(fd.get('km')) || null,
        note: String(fd.get('note') || '').trim(),
      });
      store.save();
      toast('Actividad guardada 👍');
      render();
    },
  );
}

const VIDEO_KINDS = {
  tech: { label: 'Técnica', title: 'Técnica y buenas prácticas', field: 'video', key: (id) => id },
  matrix: { label: 'Matrix', title: 'Vídeo oficial Matrix', field: 'matrix', key: (id) => `${id}@matrix` },
};

function videoUrl(exId, kind) {
  const k = VIDEO_KINDS[kind];
  return store.getVideo(k.key(exId), EXERCISES[exId][k.field] || '');
}

function videoDialog(exId, kind = 'tech') {
  const ex = EXERCISES[exId];
  const url = videoUrl(exId, kind);
  const id = youtubeId(url);
  const other = kind === 'tech' ? 'matrix' : 'tech';
  const tabs = videoUrl(exId, other)
    ? `<div class="video-tabs">${Object.entries(VIDEO_KINDS).map(([k, v]) =>
      `<button class="btn small ${k === kind ? 'primary' : ''}" data-video-kind="${k}" data-ex="${exId}">${v.label}</button>`).join('')}</div>`
    : '';
  openDialog(`
    <div class="video-box">
      <h3>${esc(ex.name)} <small class="muted">${VIDEO_KINDS[kind].title}</small></h3>
      ${tabs}
      ${id ? `<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1" title="Vídeo: ${esc(ex.name)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>` : ''}
      <div class="actions">
        <a class="btn" href="${esc(url)}" target="_blank" rel="noopener">YouTube ↗</a>
        <button class="btn primary" data-close>Cerrar</button>
      </div>
    </div>`);
}

function zoomDialog(exId) {
  const ex = EXERCISES[exId];
  openDialog(`
    <div class="zoom-box" data-close>
      <img src="${gifFor(exId)}" alt="${esc(ex.name)}" ${GIF_FALLBACK}>
      <p>${esc(ex.name)} · <span class="muted">toca para cerrar</span></p>
    </div>`);
}

/** Mapa con los músculos que trabaja un ejercicio. */
function exerciseMusclesDialog(exId) {
  const ex = EXERCISES[exId];
  const m = exerciseMuscles(ex);
  const views = [...new Set([...m.primary, ...m.secondary].flatMap(viewsOf))];
  openDialog(`
    <h3>${esc(ex.name)}</h3>
    <p class="mu-legend"><span class="mu-dot pri"></span><strong>Principal:</strong> ${ex.primary.join(', ')}</p>
    ${ex.secondary.length ? `<p class="mu-legend"><span class="mu-dot sec"></span><strong>Secundario:</strong> ${ex.secondary.join(', ')}</p>` : ''}
    ${bodyMap({ ...m, labels: true, interactive: true }, ['front', 'back'].filter((v) => views.includes(v)))}
    <p class="muted small-text">Toca un músculo para ver qué es y con qué otros ejercicios lo trabajas.</p>
    <div class="actions"><button class="btn primary" data-close>Cerrar</button></div>`);
}

/** Ejercicios de las rutinas activas que trabajan un grupo muscular (principales primero). */
function exercisesFor(muscleId) {
  const ids = [...new Set(activeRoutines().flatMap((r) => r.exercises.map((p) => p.id)))];
  return ids.map((id) => {
    const m = exerciseMuscles(EXERCISES[id]);
    const role = m.primary.includes(muscleId) ? 'pri' : m.secondary.includes(muscleId) ? 'sec' : null;
    return role && { id, role, routines: activeRoutines().filter((r) => r.exercises.some((p) => p.id === id)) };
  }).filter(Boolean).sort((a, b) => (a.role === b.role ? 0 : a.role === 'pri' ? -1 : 1));
}

/** Ficha de un grupo muscular: dónde está, para qué sirve y con qué ejercicios se trabaja. */
function muscleDialog(muscleId) {
  const mu = MUSCLES[muscleId];
  if (!mu) return;
  const list = exercisesFor(muscleId);
  openDialog(`
    <h3>${esc(mu.name)}</h3>
    ${bodyMap({ primary: [muscleId] }, viewsOf(muscleId))}
    <p><strong>Dónde:</strong> ${esc(mu.where)}</p>
    <p><strong>Para qué sirve:</strong> ${esc(mu.use)}</p>
    <h4>Lo trabajas con</h4>
    ${list.length ? `<ul class="progress-list">${list.map((e) => `
      <li><a href="#/progreso/${e.id}">
        <img src="${gifFor(e.id)}" alt="" loading="lazy" width="40" height="58" ${GIF_FALLBACK}>
        <span class="name">${esc(EXERCISES[e.id].name)}<small class="muted"><span class="mu-dot ${e.role}"></span>${e.role === 'pri' ? 'Principal' : 'Secundario'}</small></span>
        <span class="mu-routines">${e.routines.map((r) => `<span class="badge"${rStyle(r.id)}>${r.id}</span>`).join('')}</span>
      </a></li>`).join('')}</ul>` : '<p class="muted">Ningún ejercicio de tus rutinas lo trabaja.</p>'}
    <div class="actions"><button class="btn primary" data-close>Cerrar</button></div>`);
}

function finishSession(date) {
  const s = store.getSession(date);
  if (!s) return;
  s.finished = true;
  store.save();
  let sets = 0;
  let volume = 0;
  const records = [];
  Object.entries(s.exercises).forEach(([exId, rows]) => {
    const done = store.doneSets(rows);
    sets += done.length;
    done.forEach((r) => (volume += (Number(r.kg) || 0) * (Number(r.reps) || 0)));
    if (done.length && isRecord(exId, date, store.maxKg(done))) records.push(EXERCISES[exId].name);
  });
  const minutes = s.activities.reduce((a, x) => a + (Number(x.minutes) || 0), 0);
  const unrated = Object.entries(s.exercises)
    .filter(([exId, rows]) => store.doneSets(rows).length && !s.feel?.[exId])
    .map(([exId]) => EXERCISES[exId].name);
  render();
  openDialog(`
    <div class="summary">
      <h3>🏁 ¡Sesión completada!</h3>
      <ul>
        ${sets ? `<li><strong>${sets}</strong> ${sets === 1 ? 'serie hecha' : 'series hechas'}</li><li><strong>${fmtNum(volume)}</strong> kg movidos en total</li>` : ''}
        ${minutes ? `<li><strong>${minutes}</strong> min de actividad</li>` : ''}
        ${sets || minutes ? `<li>🔥 <strong>${fmtKcal(sessionKcal(s))}</strong> quemadas (estimación para ${PROFILE.weightKg} kg)</li>` : ''}
        ${records.length ? `<li>🏆 Récord en: ${records.map(esc).join(', ')}</li>` : ''}
        ${unrated.length ? `<li>📝 Sin valorar (😣 💪 😎): ${unrated.map(esc).join(', ')}. Puedes hacerlo aún desde «Reabrir sesión».</li>` : ''}
        ${!sets && !minutes ? '<li>Hoy no has marcado series. ¡La próxima vez a por ellas!</li>' : ''}
      </ul>
      <p class="quote-inline">${esc(QUOTES[Math.floor(Math.random() * QUOTES.length)])}</p>
      <div class="actions"><button class="btn primary" data-close>¡Hecho!</button></div>
    </div>`);
}

// ---------- Vista: historial ----------

function renderHistory(month) {
  const today = todayStr();
  const [y, m] = month.split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const daysInMonth = new Date(y, m, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  const prevMonth = toDateStr(new Date(y, m - 2, 1)).slice(0, 7);
  const nextMonth = toDateStr(new Date(y, m, 1)).slice(0, 7);
  const monthSessions = store.sortedSessions().filter((s) => s.date.startsWith(month) && hasContent(s));
  const strengthDays = monthSessions.filter(store.hasStrength).length;
  const actMinutes = monthSessions.reduce((a, s) => a + s.activities.reduce((b, x) => b + (Number(x.minutes) || 0), 0), 0);
  const monthKcal = monthSessions.reduce((a, s) => a + sessionKcal(s), 0);

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push('<span class="cal-cell empty"></span>');
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${month}-${pad(d)}`;
    const s = store.getSession(date);
    const strength = s && store.hasStrength(s);
    const act = s && s.activities.length > 0;
    const cls = ['cal-cell', strength ? 'strength' : act ? 'activity' : '', date === today ? 'today' : ''].join(' ');
    const style = strength && s.routine ? rStyle(s.routine) : '';
    cells.push(date > today
      ? `<span class="${cls} future">${d}</span>`
      : `<a class="${cls}"${style} href="#/dia/${date}" aria-label="${fmtDate(date)}">${d}${strength && s.routine ? `<small>R${s.routine}</small>` : ''}${strength && act ? '<i class="dot"></i>' : ''}</a>`);
  }

  view.innerHTML = `
    <div class="page-head"><h2>Historial</h2></div>
    <section class="card">
      <div class="cal-nav">
        <a class="icon-btn" href="#/historial/${prevMonth}" aria-label="Mes anterior">‹</a>
        <strong>${cap(first.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }))}</strong>
        ${nextMonth <= today.slice(0, 7) ? `<a class="icon-btn" href="#/historial/${nextMonth}" aria-label="Mes siguiente">›</a>` : '<span class="icon-btn" aria-hidden="true"></span>'}
      </div>
      <div class="cal">
        ${['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => `<span class="cal-dow">${d}</span>`).join('')}
        ${cells.join('')}
      </div>
      <div class="legend">
        <span><i class="sw strength" style="background: linear-gradient(90deg, ${[...activeRoutines(), ...activeRoutines()].slice(0, Math.max(2, activeRoutines().length)).map((r) => r.color).join(', ')})"></i>Fuerza</span>
        <span><i class="sw activity"></i>Solo actividad</span>
        <span><i class="dot"></i>Fuerza + actividad</span>
      </div>
      <p class="muted">Toca un día para ver, editar o añadir registros.</p>
    </section>
    <section class="stats">
      <div class="stat"><strong>${strengthDays}</strong><span>días de fuerza</span></div>
      <div class="stat"><strong>${monthSessions.length}</strong><span>días activos</span></div>
      <div class="stat"><strong>${actMinutes}</strong><span>min actividad</span></div>
      <div class="stat"><strong>${Math.round(monthKcal).toLocaleString('es-ES')}</strong><span>kcal (aprox.)</span></div>
    </section>
    <section class="card">
      <h3>Registros del mes</h3>
      ${monthSessions.length ? `<ul class="session-list">${monthSessions.reverse().map(sessionSummary).join('')}</ul>` : '<p class="muted">Sin registros este mes.</p>'}
    </section>`;
}

function sessionSummary(s) {
  const r = s.routine && store.hasStrength(s) ? routineById(s.routine) : null;
  const sets = Object.values(s.exercises).reduce((a, rows) => a + store.doneSets(rows).length, 0);
  const acts = s.activities.map((a) => `${activityType(a.type).icon} ${a.minutes} min`).join(' ');
  return `
    <li><a href="#/dia/${s.date}">
      <span class="date">${cap(fmtDate(s.date, { weekday: 'short', day: 'numeric' }))}</span>
      <span>${r ? `<span class="badge"${rStyle(r.id)}>${r.id}</span> ${plural(sets, 'serie', 'series')}` : ''} ${acts} <small class="muted nowrap">${fmtKcal(sessionKcal(s))}</small></span>
    </a></li>`;
}

// ---------- Vista: progreso ----------

function renderProgress() {
  const today = todayStr();
  const all = store.sortedSessions().filter(hasContent);
  const strength = all.filter(store.hasStrength);
  const ws = weekStart(today);
  const thisWeek = all.filter((s) => s.date >= ws && s.date <= today).length;
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const start = addDays(ws, -7 * (7 - i));
    const end = addDays(start, 6);
    return { label: fmtShort(start), value: strength.filter((s) => s.date >= start && s.date <= end).length };
  });
  const inRoutines = new Set(store.getRoutines().flatMap((r) => r.exercises.map((p) => p.id)));
  const others = Object.keys(EXERCISES).filter((id) => !inRoutines.has(id) && store.exerciseHistory(id).length);

  view.innerHTML = `
    <div class="page-head"><h2>Progreso</h2></div>
    <section class="stats">
      <div class="stat"><strong>${strength.length}</strong><span>días de fuerza</span></div>
      <div class="stat"><strong>${thisWeek}</strong><span>días activos esta semana</span></div>
      <div class="stat"><strong>${all.length}</strong><span>días activos en total</span></div>
    </section>
    <section class="card">
      <h3>Días de fuerza por semana</h3>
      ${barChart(weeks)}
    </section>
    ${strength.length ? weekCard(today) : ''}
    ${store.getRoutines().filter((r) => r.active || r.exercises.some((p) => store.exerciseHistory(p.id).length)).map((r) => `
      <section class="card">
        <div class="routine-title"><span class="badge"${rStyle(r.id)}>${r.id}</span><div><h3>${esc(r.short)}${r.active ? '' : ' <small class="muted">(retirada)</small>'}</h3><p class="routine-desc">${esc(r.description)}</p></div></div>
        ${progressList(r.exercises.map((p) => p.id))}
      </section>`).join('')}
    ${others.length ? `
      <section class="card">
        <h3>Otros ejercicios con historial</h3>
        <p class="muted small-text">Ya no están en ninguna rutina, pero conservas sus marcas.</p>
        ${progressList(others)}
      </section>` : ''}`;
}

/** Análisis del entrenador de los últimos 7 días: volumen por músculo, avisos, equilibrio y cardio. */
function weekCard(today) {
  const vol = coach.weeklyVolume(today);
  const freq = coach.weeklyFrequency(today);
  const levels = Object.fromEntries(Object.entries(vol).map(([m, n]) => [m, coach.volumeLevel(n)]));
  const tips = coach.alerts(today, activityMet);
  const bal = coach.balance(today);
  const cardio = coach.cardioWeek(today, activityMet);
  const ratio = (v) => (v === null ? '—' : fmtNum(Math.round(v * 10) / 10));
  const pct = Math.min(100, Math.round((cardio.equivalent / cardio.target[0]) * 100));
  return `
    <section class="card week-card">
      <h3>Últimos 7 días</h3>
      <p class="muted small-text">Series efectivas por músculo (las de músculos secundarios cuentan la mitad). Lo recomendable para ganar fuerza y músculo es 6-16 series a la semana, repartidas en 2 días o más.</p>
      ${bodyMap({ levels })}
      <ul class="vol-legend">${coach.VOLUME_LEVELS.map((l) => `<li><span class="sw lv-${l.id}"></span>${l.label}</li>`).join('')}</ul>
      <details class="vol-detail">
        <summary>Detalle por músculo</summary>
        <ul>${coach.MAJOR_MUSCLES.map((m) => `
          <li><span>${esc(MUSCLES[m].name)}</span><span><strong>${fmtNum(vol[m])}</strong> series · ${plural(freq[m], 'día', 'días')}</span></li>`).join('')}</ul>
      </details>
      ${tips.length ? `<ul class="coach-alerts">${tips.map((t) => `
        <li class="${t.kind}">${esc(t.text)} ${evidenceTag(t.evidence)}<small class="muted"> · ${esc(t.source)}</small></li>`).join('')}</ul>`
        : '<p class="ok-msg">✅ Volumen, frecuencia y equilibrio dentro de lo recomendado.</p>'}
      <h4>Equilibrio (últimos 14 días)</h4>
      <p class="small-text">Tracción / empuje: <strong>${ratio(bal.pullPush)}</strong> <span class="muted">(${bal.pull} / ${bal.push} series; orientativo 0,8-1,5)</span><br>
        Pierna / torso: <strong>${ratio(bal.lowerUpper)}</strong> <span class="muted">(${bal.lower} / ${bal.upper} series; orientativo ≥ 0,5)</span></p>
      <h4>Cardio</h4>
      <div class="meter" role="img" aria-label="${cardio.equivalent} de ${cardio.target[0]} minutos"><span style="width:${pct}%"></span></div>
      <p class="small-text"><strong>${cardio.equivalent}</strong> de 150-300 min recomendados por la OMS <span class="muted">(${cardio.moderate} min moderados + ${cardio.vigorous} intensos, que cuentan doble)</span></p>
    </section>`;
}

function progressList(exIds) {
  return `<ul class="progress-list">
    ${exIds.map((id) => {
      const hist = store.exerciseHistory(id);
      const last = hist[0];
      const firstMax = hist.length ? store.maxKg(hist.at(-1).sets) : 0;
      const lastMax = last ? store.maxKg(last.sets) : 0;
      const diff = lastMax - firstMax;
      return `<li><a href="#/progreso/${id}">
        <img src="${gifFor(id)}" alt="" loading="lazy" width="40" height="58" ${GIF_FALLBACK}>
        <span class="name">${esc(EXERCISES[id].name)}<small class="muted">${last ? `${plural(hist.length, 'sesión', 'sesiones')} · última ${fmtShort(last.date)}` : 'Sin registros'}</small></span>
        <span class="kg">${last ? `${fmtNum(lastMax)} kg` : '—'}${diff > 0 ? `<small class="up">+${fmtNum(diff)}</small>` : ''}</span>
      </a></li>`;
    }).join('')}
  </ul>`;
}

function renderExerciseProgress(exId) {
  const ex = EXERCISES[exId];
  if (!ex) {
    navigate('#/progreso');
    return;
  }
  const hist = store.exerciseHistory(exId);
  const chrono = [...hist].reverse().slice(-20);
  const best = hist.length ? Math.max(...hist.map((h) => store.maxKg(h.sets))) : 0;

  view.innerHTML = `
    <div class="page-head"><a class="back" href="#/progreso">← Progreso</a><h2>${esc(ex.name)}</h2>
      <p class="muted">${ex.primary.join(', ')}${ex.secondary.length ? ` · ${ex.secondary.join(', ')}` : ''}</p></div>
    <section class="card">
      <h3>Peso máximo por sesión</h3>
      ${chrono.length ? lineChart(chrono.map((h) => ({ label: fmtShort(h.date), value: store.maxKg(h.sets) }))) : '<p class="muted">Aún no hay series registradas. ¡La primera marca la pones tú!</p>'}
      ${hist.length ? `<p>🏆 Mejor marca: <strong>${fmtNum(best)} kg</strong></p>` : ''}
    </section>
    <section class="card">
      <h3>Últimas sesiones</h3>
      ${hist.length ? `<ul class="session-list">${hist.slice(0, 15).map((h) => `
        <li><a href="#/dia/${h.date}"><span class="date">${cap(fmtDate(h.date, { weekday: 'short', day: 'numeric', month: 'short' }))}</span><span>${setsSummary(h.sets)}${h.feel ? ` ${feelById(h.feel).icon}` : ''}</span></a></li>`).join('')}</ul>` : '<p class="muted">Sin registros.</p>'}
    </section>`;
}

function lineChart(points) {
  const W = 340;
  const H = 180;
  const P = { l: 40, r: 14, t: 14, b: 28 };
  const vals = points.map((p) => p.value);
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  if (min === max) {
    min = Math.max(0, min - 5);
    max += 5;
  }
  const x = (i) => P.l + (points.length === 1 ? (W - P.l - P.r) / 2 : (i * (W - P.l - P.r)) / (points.length - 1));
  const y = (v) => P.t + (1 - (v - min) / (max - min)) * (H - P.t - P.b);
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  return `
    <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución del peso máximo">
      <line x1="${P.l}" y1="${y(max)}" x2="${W - P.r}" y2="${y(max)}" class="grid"/>
      <line x1="${P.l}" y1="${y(min)}" x2="${W - P.r}" y2="${y(min)}" class="grid"/>
      <text x="${P.l - 6}" y="${y(max) + 4}" text-anchor="end">${fmtNum(max)}</text>
      <text x="${P.l - 6}" y="${y(min) + 4}" text-anchor="end">${fmtNum(min)}</text>
      <path d="${path}" class="line"/>
      ${points.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.value)}" r="4"><title>${p.label}: ${fmtNum(p.value)} kg</title></circle>`).join('')}
      <text x="${x(0)}" y="${H - 8}" text-anchor="${points.length === 1 ? 'middle' : 'start'}">${points[0].label}</text>
      ${points.length > 1 ? `<text x="${x(points.length - 1)}" y="${H - 8}" text-anchor="end">${points.at(-1).label}</text>` : ''}
    </svg>`;
}

function barChart(items) {
  const W = 340;
  const H = 130;
  const P = { t: 16, b: 24 };
  const max = Math.max(3, ...items.map((b) => b.value));
  const bw = W / items.length;
  return `
    <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Días de fuerza por semana">
      ${items.map((b, i) => {
        const h = (b.value / max) * (H - P.t - P.b);
        const bx = i * bw + bw * 0.2;
        const by = H - P.b - h;
        return `<rect x="${bx}" y="${by}" width="${bw * 0.6}" height="${Math.max(h, 1)}" rx="4" class="${i === items.length - 1 ? 'bar current' : 'bar'}"/>
          ${b.value ? `<text x="${bx + bw * 0.3}" y="${by - 4}" text-anchor="middle">${b.value}</text>` : ''}
          ${i % 2 === 1 ? `<text x="${bx + bw * 0.3}" y="${H - 6}" text-anchor="middle" class="small">${b.label}</text>` : ''}`;
      }).join('')}
    </svg>`;
}

// ---------- Vista: músculos ----------

function renderMuscles() {
  const counts = Object.fromEntries(Object.keys(MUSCLES).map((id) => [id, exercisesFor(id)]));
  view.innerHTML = `
    <div class="page-head"><h2>Músculos</h2>
      <p class="muted">Toca un músculo para ver dónde está, para qué sirve y qué ejercicios de tus rutinas lo trabajan.</p></div>
    <section class="card">${bodyMap({ labels: true, interactive: true })}</section>
    <section class="card">
      <h3>Todos los músculos</h3>
      <ul class="muscle-list">
        ${Object.entries(MUSCLES).map(([id, m]) => {
          const pri = counts[id].filter((e) => e.role === 'pri').length;
          const n = counts[id].length;
          return `<li><button data-muscle="${id}"><span>${esc(m.name)}</span>
            <small class="muted">${n ? `${plural(n, 'ejercicio', 'ejercicios')}${pri ? ` · ${pri} principal${pri > 1 ? 'es' : ''}` : ''}` : 'Sin ejercicios'}</small></button></li>`;
        }).join('')}
      </ul>
    </section>`;
}

// ---------- Vista: rutinas ----------

const ROUTINE_COLORS = ['#339af0', '#9775fa', '#ff6b6b', '#20c997', '#fab005', '#f76707', '#e64980', '#868e96'];
const SNOOZE_DAYS = 14;
const NEW_EXERCISE = { sets: 3, reps: 12 };
/** Rutina en edición; se conserva entre renders del editor y se descarta al salir de él. */
let draft = null;

const weeksOn = (r) => Math.floor(daysBetween(r.since, todayStr()) / 7);

function renderRoutines() {
  const props = coach.routineProposals(todayStr());
  view.innerHTML = `
    <div class="page-head"><a class="back" href="#/ajustes">← Ajustes</a><h2>Rutinas</h2>
      <p class="muted">Las rutinas activas se sugieren por turnos cada día de fuerza.</p></div>
    ${props.map(proposalCard).join('')}
    <section class="card">
      <ul class="routine-list">${store.getRoutines().map((r) => `
        <li class="${r.active ? '' : 'retired'}"><a href="#/rutinas/${r.id}">
          <span class="badge"${rStyle(r.id)}>${r.id}</span>
          <span class="name">${esc(r.name)} · ${esc(r.short)}
            <small class="muted">${plural(r.exercises.length, 'ejercicio', 'ejercicios')} · ${r.active ? `versión desde ${fmtShort(r.since)} (${plural(weeksOn(r), 'semana', 'semanas')})` : 'retirada'}</small></span>
          <span class="go" aria-hidden="true">›</span></a></li>`).join('')}
      </ul>
      <a class="btn" href="#/rutinas/nueva">➕ Nueva rutina</a>
    </section>
    <section class="card tips">
      <h3>Cómo te propongo cambios</h3>
      <ul>
        <li>Trabaja cada grupo muscular al menos 2 días por semana. ${evidenceTag('strong')}</li>
        <li>Apunta a 6-16 series semanales por músculo; más volumen suma, pero cada vez menos. ${evidenceTag('moderate')}</li>
        <li>Variar el estímulo de forma planificada mejora la fuerza frente a repetir siempre lo mismo. ${evidenceTag('moderate')}</li>
        <li>Te propongo una variante a las ${coach.PROPOSAL_WEEKS} semanas de una versión, o antes si 2 ejercicios llevan 4 sesiones sin progresar. Cambio como mucho 2 ejercicios por otros del mismo movimiento y mantengo series y repeticiones. ${evidenceTag('heuristic')}</li>
        <li>Si haces bastante más empuje que tracción, uno de esos cambios pasa un ejercicio de empuje repetido (p. ej. tu segundo de tríceps) a uno de tracción. ${evidenceTag('heuristic')}</li>
      </ul>
      <p class="muted small-text">Fuentes: ACSM 2009; Garber et al. 2011; OMS 2020; Schoenfeld et al. 2017; Pelland et al. 2025; Williams et al. 2017; Moesgaard et al. 2022.</p>
    </section>`;
}

function proposalCard(p) {
  const r = p.routine;
  const exImg = (id) => `<img src="${gifFor(id)}" alt="" loading="lazy" width="40" height="58" ${GIF_FALLBACK}>`;
  return `
    <section class="card proposal" data-routine="${r.id}">
      <p class="eyebrow">Propuesta</p>
      <div class="routine-title"><span class="badge"${rStyle(r.id)}>${r.id}</span>
        <div><h3>Renovar ${esc(r.name)}</h3><p class="routine-desc">${esc(r.short)}</p></div></div>
      <ul class="coach-alerts">${p.reasons.map((x) => `
        <li>${esc(x.text)} ${evidenceTag(x.evidence)}<small class="muted"> · ${esc(x.source)}</small></li>`).join('')}</ul>
      <ul class="swap-list">${p.changes.map((c) => `
        <li>
          <div class="swap">
            <span class="swap-ex out">${exImg(c.from)}<span>${esc(EXERCISES[c.from].name)}</span></span>
            <span class="arrow" aria-label="se cambia por">→</span>
            <span class="swap-ex in">${exImg(c.to)}<span>${esc(EXERCISES[c.to].name)}</span></span>
          </div>
          <small class="muted">${esc(c.why)}</small>
        </li>`).join('')}</ul>
      <p class="muted small-text">Se mantienen las series y repeticiones. Al aceptar empieza una versión nueva de la rutina; tus marcas anteriores se conservan.</p>
      <div class="actions">
        <button class="btn primary" data-action="accept-proposal">✅ Aceptar</button>
        <button class="btn" data-action="edit-proposal">✏️ Editar antes</button>
        <button class="btn ghost" data-action="snooze-proposal">⏰ Posponer 2 semanas</button>
      </div>
    </section>`;
}

function newRoutineDraft() {
  const used = store.getRoutines().map((r) => r.color);
  return {
    id: null,
    name: '',
    short: '',
    description: '',
    color: ROUTINE_COLORS.find((c) => !used.includes(c)) || ROUTINE_COLORS.at(-1),
    active: true,
    exercises: [],
  };
}

function renderRoutineEditor(param) {
  const id = param === 'nueva' ? null : Number(param);
  const r = id === null ? null : routineById(id);
  if (id !== null && !r) {
    navigate('#/rutinas');
    return;
  }
  if (!draft || draft.id !== id) draft = r ? structuredClone(r) : newRoutineDraft();
  const used = new Set(draft.exercises.map((p) => p.id));
  const muscles = draft.exercises.map((p) => exerciseMuscles(EXERCISES[p.id]));
  const primary = [...new Set(muscles.flatMap((m) => m.primary))];
  const secondary = [...new Set(muscles.flatMap((m) => m.secondary))].filter((m) => !primary.includes(m));
  const missing = coach.MAJOR_MUSCLES.filter((m) => !primary.includes(m));
  view.innerHTML = `
    <div class="page-head"><a class="back" href="#/rutinas">← Rutinas</a>
      <h2>${r ? `Editar ${esc(r.name)}` : 'Nueva rutina'}</h2></div>
    <section class="card routine-form">
      <label>Nombre<input data-rfield="name" maxlength="40" value="${esc(draft.name)}" placeholder="Rutina ${id ?? store.nextRoutineId()}"></label>
      <label>Nombre corto<input data-rfield="short" maxlength="${store.ROUTINE_LIMITS.short}" value="${esc(draft.short)}" placeholder="Pecho y espalda"></label>
      <label>Descripción<textarea data-rfield="description" rows="2" maxlength="${store.ROUTINE_LIMITS.description}">${esc(draft.description)}</textarea></label>
      <div class="form-row">
        <label class="color-label">Color<input type="color" data-rfield="color" value="${draft.color}"></label>
        <label class="check-label"><input type="checkbox" data-rfield="active" ${draft.active ? 'checked' : ''}> Activa (se sugiere en «Hoy»)</label>
      </div>
    </section>
    <section class="card">
      <h3>Ejercicios</h3>
      ${draft.exercises.length ? `<ol class="edit-list">${draft.exercises.map((p, i) => editRow(p, i, used)).join('')}</ol>` : '<p class="muted">Añade al menos un ejercicio.</p>'}
      <label class="add-ex">➕ Añadir ejercicio${exerciseSelect('add', '', used)}</label>
    </section>
    ${draft.exercises.length ? `
      <section class="card">
        <h3>Músculos que trabaja</h3>
        ${bodyMap({ primary, secondary })}
        ${missing.length ? `<p class="small-text">Sin trabajo principal: ${missing.map((m) => esc(MUSCLES[m].name.toLowerCase())).join(', ')}. Si no los cubre otra rutina, añade algún ejercicio para ellos.</p>` : '<p class="ok-msg">✅ Cubre todos los grupos musculares principales.</p>'}
      </section>` : ''}
    <div class="actions form-actions">
      <button class="btn primary" data-action="save-routine">💾 Guardar</button>
      <a class="btn ghost" href="#/rutinas">Cancelar</a>
    </div>`;
}

function editRow(p, i, used) {
  const ex = EXERCISES[p.id];
  const [minSets, maxSets] = store.ROUTINE_LIMITS.sets;
  const [minReps, maxReps] = store.ROUTINE_LIMITS.reps;
  return `
    <li data-i="${i}">
      <img src="${gifFor(p.id)}" alt="" loading="lazy" width="40" height="58" ${GIF_FALLBACK}>
      <div class="edit-main">
        ${exerciseSelect('swap', p.id, used, `Ejercicio ${i + 1}`)}
        <div class="edit-nums">
          <label><input type="number" data-num="sets" inputmode="numeric" min="${minSets}" max="${maxSets}" value="${p.sets}" aria-label="Series de ${esc(ex.name)}"> series</label>
          <label>× <input type="number" data-num="reps" inputmode="numeric" min="${minReps}" max="${maxReps}" value="${p.reps}" aria-label="Repeticiones de ${esc(ex.name)}"> reps</label>
        </div>
      </div>
      <div class="edit-tools">
        <button class="btn small ghost" data-action="ex-up" ${i ? '' : 'disabled'} aria-label="Subir ${esc(ex.name)}">↑</button>
        <button class="btn small ghost" data-action="ex-down" ${i < draft.exercises.length - 1 ? '' : 'disabled'} aria-label="Bajar ${esc(ex.name)}">↓</button>
        <button class="btn small ghost" data-action="ex-remove" aria-label="Quitar ${esc(ex.name)}">✕</button>
      </div>
    </li>`;
}

/** Desplegable de ejercicios agrupados por patrón de movimiento (sin los ya usados en la rutina). */
function exerciseSelect(kind, current, used, label = 'Añadir ejercicio') {
  const groups = Object.entries(PATTERNS).map(([pid, pat]) => {
    const opts = Object.entries(EXERCISES)
      .filter(([id, e]) => e.pattern === pid && (id === current || !used.has(id)))
      .sort(([, a], [, b]) => a.name.localeCompare(b.name, 'es'))
      .map(([id, e]) => `<option value="${id}"${id === current ? ' selected' : ''}>${esc(e.name)}</option>`)
      .join('');
    return opts ? `<optgroup label="${esc(pat.name)}">${opts}</optgroup>` : '';
  }).join('');
  return `<select data-${kind} aria-label="${esc(label)}">${kind === 'add' ? '<option value="">Elige un ejercicio…</option>' : ''}${groups}</select>`;
}

function saveDraft() {
  if (!draft.exercises.length) {
    toast('Añade al menos un ejercicio');
    return;
  }
  const others = activeRoutines().filter((r) => r.id !== draft.id);
  if (!draft.active && !others.length && !confirm('No quedará ninguna rutina activa y «Hoy» no te sugerirá ninguna. ¿Guardar igualmente?')) return;
  const saved = store.saveRoutine(draft);
  draft = null;
  toast(`Rutina ${saved.name} guardada 💾`);
  precacheGifs();
  navigate('#/rutinas');
}

function proposalAction(action, routineId) {
  const p = coach.routineProposals(todayStr()).find((x) => x.routine.id === routineId);
  if (!p) return;
  if (action === 'accept-proposal') {
    store.saveRoutine({ id: routineId, exercises: p.exercises });
    toast(`${p.routine.name} renovada ✅ ¡A por la nueva versión!`);
    precacheGifs();
    render();
  } else if (action === 'edit-proposal') {
    draft = { ...structuredClone(p.routine), exercises: structuredClone(p.exercises) };
    navigate(`#/rutinas/${routineId}`);
  } else {
    store.snoozeRoutine(routineId, addDays(todayStr(), SNOOZE_DAYS));
    toast(`Te lo vuelvo a proponer en ${SNOOZE_DAYS} días ⏰`);
    render();
  }
}

/** Cambios del editor de rutinas: campos, ejercicios, series y repeticiones. */
function editDraft(input) {
  const i = Number(input.closest('[data-i]')?.dataset.i);
  if (input.dataset.rfield) {
    const k = input.dataset.rfield;
    draft[k] = k === 'active' ? input.checked : input.value;
    return false;
  }
  if ('num' in input.dataset) {
    const lim = store.ROUTINE_LIMITS[input.dataset.num];
    const n = Math.min(lim[1], Math.max(lim[0], Math.round(parseNum(input.value)) || lim[0]));
    draft.exercises[i][input.dataset.num] = n;
    input.value = n;
    return false;
  }
  if ('swap' in input.dataset) draft.exercises[i] = { ...draft.exercises[i], id: input.value };
  else if ('add' in input.dataset && input.value) draft.exercises.push({ id: input.value, ...NEW_EXERCISE });
  return true;
}

function moveExercise(action, i) {
  const list = draft.exercises;
  if (action === 'ex-remove') list.splice(i, 1);
  else {
    const j = action === 'ex-up' ? i - 1 : i + 1;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
  }
  render();
}

// ---------- Vista: ajustes ----------

function renderSettings() {
  view.innerHTML = `
    <div class="page-head"><h2>Ajustes</h2></div>
    <section class="card">
      <h3>Rutinas</h3>
      <p class="muted">Crea, edita o retira rutinas y revisa las propuestas de cambio basadas en tu historial.</p>
      ${(() => {
        const n = coach.routineProposals(todayStr()).length;
        return n ? `<p class="small-text">💡 ${plural(n, 'propuesta pendiente', 'propuestas pendientes')}</p>` : '';
      })()}
      <a class="btn primary" href="#/rutinas">📋 Gestionar rutinas</a>
    </section>
    <section class="card">
      <h3>Copia de seguridad</h3>
      <p class="muted">Los datos se guardan solo en este dispositivo. Exporta de vez en cuando para no perderlos.</p>
      <div class="actions">
        <button class="btn primary" data-action="export">⬇️ Exportar JSON</button>
        <label class="btn">⬆️ Importar JSON<input type="file" accept="application/json,.json" data-action="import" hidden></label>
      </div>
    </section>
    <section class="card">
      <h3>Vídeos de los ejercicios</h3>
      <p class="muted">Cada ejercicio tiene un vídeo de técnica y, si existe, el oficial de Matrix. Pega otro enlace de YouTube si prefieres otro vídeo; déjalo vacío para volver al original.</p>
      ${activeRoutines().map((r, ri, all) => `
        <h4><span class="badge"${rStyle(r.id)}>${r.id}</span> ${esc(r.short)}</h4>
        ${r.exercises.filter((p) => !all.slice(0, ri).some((o) => o.exercises.some((q) => q.id === p.id))).map((p) => {
          const ex = EXERCISES[p.id];
          return `<div class="video-field"><span>${esc(ex.name)}</span>
            ${Object.entries(VIDEO_KINDS).map(([k, v]) => {
              const custom = store.hasVideoOverride(v.key(p.id));
              const def = ex[v.field] || '';
              return `<label><small>${v.title}${custom ? ' <span class="up">(personalizado)</span>' : ''}</small>
                <input type="url" inputmode="url" data-video="${p.id}" data-kind="${k}" value="${esc(videoUrl(p.id, k))}" placeholder="${esc(def || 'Sin vídeo oficial')}"></label>`;
            }).join('')}
          </div>`;
        }).join('')}`).join('')}
    </section>
    <section class="card">
      <h3>Instalar en el móvil</h3>
      <p class="muted">iPhone (Safari): Compartir → «Añadir a pantalla de inicio». Android (Chrome): menú ⋮ → «Instalar aplicación». Funciona sin conexión en el gimnasio (los vídeos necesitan internet).</p>
    </section>
    <section class="card">
      <h3>Créditos</h3>
      <p class="muted small-text">Imágenes de los ejercicios alternativos: <a href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noopener">free-exercise-db</a> (dominio público, Unlicense). Mapa muscular adaptado de <a href="https://github.com/giavinh79/react-body-highlighter" target="_blank" rel="noopener">react-body-highlighter</a> (MIT). Las recomendaciones del entrenador se basan en ACSM, OMS y revisiones científicas citadas en cada aviso.</p>
    </section>
    <section class="card danger">
      <h3>Borrar datos</h3>
      <p class="muted">Elimina todas las sesiones, los vídeos personalizados y los cambios en las rutinas de este dispositivo.</p>
      <button class="btn danger" data-action="clear">🗑️ Borrar todo</button>
    </section>`;
}

function exportData() {
  const blob = new Blob([store.exportJSON()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ivangym-${todayStr()}.json`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('Copia exportada 💾');
}

async function importData(file) {
  if (!file) return;
  try {
    const text = await file.text();
    JSON.parse(text);
    if (!confirm('¿Reemplazar todos los datos actuales por los del archivo?')) return;
    store.importJSON(text);
    toast('Datos importados ✅');
    render();
  } catch (err) {
    toast(`No se pudo importar: ${err.message}`, 4000);
  }
}

// ---------- Eventos ----------

view.addEventListener('click', (e) => {
  const muscle = e.target.closest('[data-muscle]');
  if (muscle) return muscleDialog(muscle.dataset.muscle);
  const btn = e.target.closest('[data-action]');
  if (!btn || btn.tagName === 'INPUT') return;
  const date = view.dataset.date;
  const exId = btn.closest('[data-ex]')?.dataset.ex;
  const row = btn.closest('.set-row');
  const { action } = btn.dataset;

  switch (action) {
    case 'routine': {
      const id = Number(btn.dataset.id) || null;
      const s = store.getSession(date);
      if ((s?.routine ?? null) === id) return;
      if (s && store.hasStrength(s) && !confirm('Se borrarán las series registradas de la rutina actual. ¿Continuar?')) return;
      setRoutine(date, id);
      render();
      break;
    }
    case 'add-activity':
      activityDialog(date);
      break;
    case 'remove-activity': {
      const s = store.getSession(date);
      if (!s || !confirm('¿Borrar esta actividad?')) return;
      s.activities.splice(Number(btn.closest('li').dataset.i), 1);
      store.removeSessionIfEmpty(date);
      store.save();
      render();
      break;
    }
    case 'video':
      videoDialog(exId, btn.dataset.kind);
      break;
    case 'zoom':
      zoomDialog(exId);
      break;
    case 'muscles':
      exerciseMusclesDialog(exId);
      break;
    case 'step':
    case 'toggle':
      updateSet(date, exId, Number(row.dataset.i), row, action, btn);
      break;
    case 'feel': {
      const s = store.getSession(date);
      s.feel = s.feel || {};
      const v = s.feel[exId] === btn.dataset.v ? null : btn.dataset.v;
      if (v) s.feel[exId] = v;
      else delete s.feel[exId];
      store.save();
      btn.closest('.feel').querySelectorAll('.feel-btn').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === v));
      if (v) {
        const next = { easy: 'la próxima vez, más peso ⬆️', ok: 'mantén el peso; si repites, subirás', hard: 'la próxima vez, mismo peso' }[v];
        toast(`${feelById(v).icon} Anotado: ${next}`, 2400);
      }
      break;
    }
    case 'add-set':
    case 'remove-set': {
      const rows = store.getSession(date).exercises[exId];
      if (action === 'add-set') rows.push({ ...rows.at(-1), done: false });
      else if (rows.length > 1) rows.pop();
      store.save();
      render();
      break;
    }
    case 'finish':
      finishSession(date);
      break;
    case 'reopen':
      store.getSession(date).finished = false;
      store.save();
      render();
      break;
    case 'export':
      exportData();
      break;
    case 'clear':
      if (confirm('¿Seguro que quieres borrar TODOS los datos?') && confirm('Esta acción no se puede deshacer. ¿Borrar?')) {
        store.clearAll();
        toast('Datos borrados');
        render();
      }
      break;
    case 'accept-proposal':
    case 'edit-proposal':
    case 'snooze-proposal':
      proposalAction(action, Number(btn.closest('[data-routine]').dataset.routine));
      break;
    case 'ex-up':
    case 'ex-down':
    case 'ex-remove':
      moveExercise(action, Number(btn.closest('[data-i]').dataset.i));
      break;
    case 'save-routine':
      saveDraft();
      break;
    default:
  }
});

function updateSet(date, exId, i, rowEl, action, btn) {
  const s = store.getSession(date);
  const rows = s.exercises[exId];
  const r = rows[i];
  if (action === 'step') {
    const { field } = btn.dataset;
    const d = Number(btn.dataset.d);
    r[field] = field === 'kg' ? Math.max(0, parseNum(r.kg) + d * stepFor(exId)) : Math.max(0, (Number(r.reps) || 0) + d);
    rowEl.querySelector(`input[data-field="${field}"]`).value = field === 'kg' ? fmtNum(r.kg) : r.reps;
  } else {
    r.done = !r.done;
    rowEl.classList.toggle('done', r.done);
    btn.setAttribute('aria-pressed', r.done);
    if (r.done) {
      const kg = parseNum(r.kg);
      const firstAtThisKg = store.doneSets(rows).filter((x) => parseNum(x.kg) >= kg).length === 1;
      if (isRecord(exId, date, kg) && firstAtThisKg) toast(`🏆 ¡Récord en ${EXERCISES[exId].name}: ${fmtNum(kg)} kg!`);
      else toast('Serie hecha ✓ Descansa 1–2 min', 1800);
    }
    rowEl.closest('.ex-card').classList.toggle('complete', rows.every((x) => x.done));
    if (r.done && rows.every((x) => x.done) && !s.feel?.[exId]) {
      setTimeout(() => toast('¿Qué tal ese ejercicio? Valóralo abajo 😣 💪 😎', 3000), 1900);
    }
    const allDone = Object.values(s.exercises).every((rs) => rs.every((x) => x.done));
    if (r.done && allDone && !s.finished) setTimeout(() => toast('¡Todas las series hechas! Pulsa «Terminar sesión» 🏁', 3500), 5000);
  }
  store.save();
}

view.addEventListener('change', (e) => {
  const input = e.target;
  if (draft && input.closest('.routine-form, .edit-list, .add-ex')) {
    if (editDraft(input)) render();
    return;
  }
  if (input.dataset.action === 'import') {
    importData(input.files[0]);
    input.value = '';
    return;
  }
  if (input.dataset.video) {
    const exId = input.dataset.video;
    const k = VIDEO_KINDS[input.dataset.kind || 'tech'];
    const def = EXERCISES[exId][k.field] || '';
    const url = input.value.trim();
    if (url && !/^https?:\/\//.test(url)) {
      toast('Enlace no válido: debe empezar por https://');
      return;
    }
    store.setVideo(k.key(exId), url === def ? '' : url);
    toast(url && url !== def ? 'Vídeo guardado' : 'Vídeo original restaurado');
    render();
    return;
  }
  if ('note' in input.dataset) {
    const exId = input.closest('[data-ex]').dataset.ex;
    input.value = store.setNote(exId, input.value);
    toast(input.value ? 'Nota guardada 📍' : 'Nota borrada', 1800);
    return;
  }
  const { field } = input.dataset;
  if (!field) return;
  const row = input.closest('.set-row');
  const exId = input.closest('[data-ex]').dataset.ex;
  const r = store.getSession(view.dataset.date).exercises[exId][Number(row.dataset.i)];
  r[field] = field === 'kg' ? parseNum(input.value) : Math.round(parseNum(input.value));
  input.value = field === 'kg' ? fmtNum(r.kg) : r.reps;
  store.save();
});

view.addEventListener('input', (e) => {
  if (draft && e.target.matches('.routine-form [data-rfield]')) editDraft(e.target);
});

view.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.matches('[data-note]')) {
    e.preventDefault();
    e.target.blur();
  }
});

view.addEventListener('focusin', (e) => {
  if (e.target.matches('.stepper input')) e.target.select();
});

// ---------- Router ----------

function navigate(hash) {
  location.hash = hash;
}

function render() {
  const [route, param] = location.hash.replace(/^#\/?/, '').split('/');
  let tab = route || 'hoy';
  delete view.dataset.date;
  if (route !== 'rutinas' || !param) draft = null;
  switch (route) {
    case 'dia':
      if (/^\d{4}-\d{2}-\d{2}$/.test(param) && param <= todayStr()) {
        renderDay(param);
        tab = param === todayStr() ? 'hoy' : 'historial';
      } else navigate('#/historial');
      break;
    case 'historial':
      renderHistory(/^\d{4}-\d{2}$/.test(param) ? param : todayStr().slice(0, 7));
      break;
    case 'progreso':
      if (param) renderExerciseProgress(param);
      else renderProgress();
      break;
    case 'musculos':
      renderMuscles();
      break;
    case 'ajustes':
      renderSettings();
      break;
    case 'rutinas':
      tab = 'ajustes';
      if (param) renderRoutineEditor(param);
      else renderRoutines();
      break;
    default:
      tab = 'hoy';
      renderDay(todayStr());
  }
  document.querySelectorAll('.tabbar a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
  document.getElementById('topbar-date').textContent = cap(fmtDate(todayStr(), { weekday: 'short', day: 'numeric', month: 'short' }));
}

window.addEventListener('hashchange', () => {
  if (dialog.open) dialog.close();
  render();
  window.scrollTo(0, 0);
});

checkData();
render();
showSplash();
precacheGifs();

/** Avisa en consola de errores en data.js (catálogo y rutinas de partida). */
function checkData() {
  const ids = ROUTINES.map((r) => r.id);
  ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => console.error(`[IvanGym] id de rutina repetido: ${id}`));
  ROUTINES.forEach((r) => {
    if (!Number.isInteger(r.id) || r.id <= 0) console.error(`[IvanGym] id de rutina no válido: ${r.id}`);
    r.exercises.forEach((p) => {
      if (!EXERCISES[p.id]) console.error(`[IvanGym] la rutina ${r.id} usa un ejercicio que no existe: ${p.id}`);
    });
  });
  if (!ROUTINES.some((r) => r.active !== false)) console.error('[IvanGym] no hay ninguna rutina de partida activa');
  unknownMuscles(EXERCISES).forEach((n) => console.error(`[IvanGym] músculo sin grupo en js/muscles.js: ${n}`));
  Object.entries(EXERCISES).forEach(([id, e]) => {
    if (!PATTERNS[e.pattern]) console.error(`[IvanGym] el ejercicio ${id} no tiene un pattern válido: ${e.pattern}`);
  });
}

/** Guarda en caché los GIF de las rutinas activas para verlos sin conexión en el gimnasio. */
function precacheGifs() {
  if (!('caches' in window)) return;
  const urls = [...new Set(activeRoutines().flatMap((r) => r.exercises.map((p) => gifFor(p.id))))];
  caches.open('ivangym-gifs')
    .then((c) => Promise.all(urls.map((u) => c.match(u).then((hit) => hit || c.add(u).catch(() => {})))))
    .catch(() => {});
}

// ---------- Splash con mensaje motivador ----------

function showSplash() {
  const quote = pickQuote();
  const el = document.createElement('div');
  el.className = 'splash';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Mensaje motivador');
  el.innerHTML = `
    <div class="splash-box">
      <p class="brand">Ivan<span>Gym</span></p>
      <p class="splash-quote">${esc(quote)}</p>
      <p class="muted small-text">Toca para continuar</p>
    </div>`;
  document.body.append(el);
  const hide = () => {
    if (el.classList.contains('out')) return;
    el.classList.add('out');
    setTimeout(() => el.remove(), 400);
  };
  el.addEventListener('click', hide);
  setTimeout(hide, Math.min(5000, 2500 + quote.length * 25));
}

if ('serviceWorker' in navigator) {
  // Al activarse una versión nueva del service worker, recarga para ver los cambios al momento.
  const hadController = Boolean(navigator.serviceWorker.controller);
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !reloaded) {
      reloaded = true;
      location.reload();
    }
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
      .then((reg) => reg.update())
      .catch(() => {});
  });
}
