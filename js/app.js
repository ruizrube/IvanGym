import {
  ACTIVITY_TYPES, EXERCISES, MIN_PER_EXERCISE, MIN_PER_SET, PROFILE, QUOTES, ROUTINES, STRENGTH_MET, TIPS, WEIGHT_STEP,
} from './data.js';
import * as store from './storage.js';

const view = document.getElementById('view');
const dialog = document.getElementById('dialog');
const toastEl = document.getElementById('toast');

// ---------- Utilidades ----------

const pad = (n) => String(n).padStart(2, '0');
const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayStr = () => toDateStr(new Date());
const parseDate = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (s, n) => {
  const d = parseDate(s);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
};
const daysBetween = (a, b) => Math.round((parseDate(b) - parseDate(a)) / 86400000);
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
const routineById = (id) => ROUTINES.find((r) => r.id === id);
const activityType = (id) => ACTIVITY_TYPES.find((a) => a.id === id) || ACTIVITY_TYPES.at(-1);
const gifFor = (exId) => `img/exercises/${exId}.gif`;
const weekStart = (s) => {
  const d = parseDate(s);
  return addDays(s, -((d.getDay() + 6) % 7));
};
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
  dialog.showModal();
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
  return last ? (last.routine % 3) + 1 : 1;
}

function initRows(exId, presc, date) {
  const last = store.lastSetsFor(exId, date) || [];
  return Array.from({ length: presc.sets }, (_, i) => ({
    kg: (last[i] || last.at(-1))?.kg ?? 0,
    reps: presc.reps,
    done: false,
  }));
}

function setRoutine(date, routineId) {
  const s = store.ensureSession(date);
  s.routine = routineId;
  s.exercises = {};
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

let quote = null;
let quoteDismissed = false;

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
  const suggested = routineById(suggestRoutine(date));
  const yesterday = store.getSession(addDays(date, -1));
  const restHint =
    !routine && yesterday && store.hasStrength(yesterday)
      ? '<p class="hint">😌 Ayer hiciste fuerza: hoy puede ser buen día para descanso activo (andar, estirar).</p>'
      : '<p class="hint">Consejo: deja ~1 día de descanso activo (andar, estirar) entre días de fuerza.</p>';

  if (isToday && !quote) quote = pickQuote();

  view.innerHTML = `
    ${isToday && !quoteDismissed ? `
      <section class="quote" role="note">
        <p>${esc(quote)}</p>
        <button class="icon-btn" data-action="dismiss-quote" aria-label="Cerrar mensaje">✕</button>
      </section>` : ''}
    <div class="page-head">
      ${isToday ? '<h2>Hoy</h2>' : `<a class="back" href="#/historial/${date.slice(0, 7)}">← Historial</a>`}
      <p class="muted">${cap(fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}</p>
    </div>

    <section class="card">
      ${routine ? `
        <div class="routine-title">
          <span class="badge r${routine.id}">${routine.id}</span>
          <div><h3>${routine.name}</h3></div>
        </div>` : `
        <p class="eyebrow">Rutina sugerida</p>
        <button class="btn primary big" data-action="routine" data-id="${suggested.id}">
          Empezar ${suggested.name}
        </button>
        <p class="muted small-text">O elige otra:</p>`}
      <div class="chips" role="group" aria-label="Elegir rutina">
        ${ROUTINES.map((r) => `
          <button class="chip r${r.id} ${routine?.id === r.id ? 'active' : ''}" data-action="routine" data-id="${r.id}" aria-pressed="${routine?.id === r.id}">
            ${r.name}
          </button>`).join('')}
        ${routine ? '<button class="chip" data-action="routine" data-id="0">Sin fuerza</button>' : ''}
      </div>
      ${restHint}
      <button class="btn" data-action="add-activity">➕ Registrar actividad</button>
    </section>

    ${routine ? `<section class="exercises">${routine.exercises.map((p, i) => exerciseCard(date, s, p, i)).join('')}</section>` : ''}

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

function exerciseCard(date, s, presc, idx) {
  const ex = EXERCISES[presc.id];
  const rows = s.exercises[presc.id] || [];
  const hist = store.exerciseHistory(presc.id, date)[0];
  const allDone = rows.length > 0 && rows.every((r) => r.done);
  return `
    <article class="card ex-card ${allDone ? 'complete' : ''}" data-ex="${presc.id}">
      <div class="ex-head">
        <button class="gif-btn" data-action="zoom" aria-label="Ampliar animación de ${esc(ex.name)}">
          <img class="ex-gif" src="${gifFor(presc.id)}" alt="${esc(ex.name)}" loading="lazy" width="116" height="167">
        </button>
        <div class="ex-info">
          <h3><span class="muted">${idx + 1}.</span> ${esc(ex.name)}</h3>
          <p class="muscles"><strong>${ex.primary.join(', ')}</strong>${ex.secondary.length ? `<br><span class="muted">${ex.secondary.join(', ')}</span>` : ''}</p>
          <p class="presc">${presc.sets} × ${presc.reps}</p>
          <button class="btn small" data-action="video">▶ Ver vídeo</button>
        </div>
      </div>
      <p class="ex-tip">💡 ${esc(ex.tip)}${ex.note ? `<br><span class="muted">${esc(ex.note)}</span>` : ''}</p>
      <p class="ex-last">${hist ? `Última vez (${fmtShort(hist.date)}): ${setsSummary(hist.sets)}` : 'Primera vez: empieza con poco peso y buena técnica.'}</p>
      <div class="sets">
        <div class="set-head"><span>#</span><span>kg</span><span>reps</span><span>hecha</span></div>
        ${rows.map((r, i) => setRow(r, i)).join('')}
      </div>
      <div class="set-tools">
        <button class="btn small ghost" data-action="remove-set" ${rows.length <= 1 ? 'disabled' : ''}>− Serie</button>
        <button class="btn small ghost" data-action="add-set">+ Serie</button>
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

function videoDialog(exId) {
  const ex = EXERCISES[exId];
  const url = store.getVideo(exId, ex.video);
  const id = youtubeId(url);
  openDialog(`
    <div class="video-box">
      <h3>${esc(ex.name)}</h3>
      ${id ? `<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1" title="Vídeo: ${esc(ex.name)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>` : ''}
      <div class="actions">
        <a class="btn" href="${esc(url)}" target="_blank" rel="noopener">Abrir en YouTube ↗</a>
        <button class="btn primary" data-close>Cerrar</button>
      </div>
    </div>`);
}

function zoomDialog(exId) {
  const ex = EXERCISES[exId];
  openDialog(`
    <div class="zoom-box" data-close>
      <img src="${gifFor(exId)}" alt="${esc(ex.name)}">
      <p>${esc(ex.name)} · <span class="muted">toca para cerrar</span></p>
    </div>`);
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
  render();
  openDialog(`
    <div class="summary">
      <h3>🏁 ¡Sesión completada!</h3>
      <ul>
        ${sets ? `<li><strong>${sets}</strong> ${sets === 1 ? 'serie hecha' : 'series hechas'}</li><li><strong>${fmtNum(volume)}</strong> kg movidos en total</li>` : ''}
        ${minutes ? `<li><strong>${minutes}</strong> min de actividad</li>` : ''}
        ${sets || minutes ? `<li>🔥 <strong>${fmtKcal(sessionKcal(s))}</strong> quemadas (estimación para ${PROFILE.weightKg} kg)</li>` : ''}
        ${records.length ? `<li>🏆 Récord en: ${records.map(esc).join(', ')}</li>` : ''}
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
    const cls = ['cal-cell', strength ? `strength r${s.routine || 0}` : act ? 'activity' : '', date === today ? 'today' : ''].join(' ');
    cells.push(date > today
      ? `<span class="${cls} future">${d}</span>`
      : `<a class="${cls}" href="#/dia/${date}" aria-label="${fmtDate(date)}">${d}${strength && s.routine ? `<small>R${s.routine}</small>` : ''}${strength && act ? '<i class="dot"></i>' : ''}</a>`);
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
        <span><i class="sw strength"></i>Fuerza</span>
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
      <span>${r ? `<span class="badge r${r.id}">${r.id}</span> ${plural(sets, 'serie', 'series')}` : ''} ${acts} <small class="muted nowrap">${fmtKcal(sessionKcal(s))}</small></span>
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
    ${ROUTINES.map((r) => `
      <section class="card">
        <div class="routine-title"><span class="badge r${r.id}">${r.id}</span><div><h3>${r.name}</h3></div></div>
        <ul class="progress-list">
          ${r.exercises.map((p) => {
            const hist = store.exerciseHistory(p.id);
            const last = hist[0];
            const firstMax = hist.length ? store.maxKg(hist.at(-1).sets) : 0;
            const lastMax = last ? store.maxKg(last.sets) : 0;
            const diff = lastMax - firstMax;
            return `<li><a href="#/progreso/${p.id}">
              <img src="${gifFor(p.id)}" alt="" loading="lazy" width="40" height="58">
              <span class="name">${esc(EXERCISES[p.id].name)}<small class="muted">${last ? `${plural(hist.length, 'sesión', 'sesiones')} · última ${fmtShort(last.date)}` : 'Sin registros'}</small></span>
              <span class="kg">${last ? `${fmtNum(lastMax)} kg` : '—'}${diff > 0 ? `<small class="up">+${fmtNum(diff)}</small>` : ''}</span>
            </a></li>`;
          }).join('')}
        </ul>
      </section>`).join('')}`;
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
        <li><a href="#/dia/${h.date}"><span class="date">${cap(fmtDate(h.date, { weekday: 'short', day: 'numeric', month: 'short' }))}</span><span>${setsSummary(h.sets)}</span></a></li>`).join('')}</ul>` : '<p class="muted">Sin registros.</p>'}
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

// ---------- Vista: ajustes ----------

function renderSettings() {
  view.innerHTML = `
    <div class="page-head"><h2>Ajustes</h2></div>
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
      <p class="muted">Pega otro enlace de YouTube si prefieres otro vídeo. Déjalo vacío para volver al original.</p>
      ${ROUTINES.map((r) => `
        <h4><span class="badge r${r.id}">${r.id}</span> ${r.name}</h4>
        ${r.exercises.map((p) => {
          const ex = EXERCISES[p.id];
          const custom = store.hasVideoOverride(p.id);
          return `<label class="video-field">${esc(ex.name)}${custom ? ' <small class="up">(personalizado)</small>' : ''}
            <input type="url" inputmode="url" data-video="${p.id}" value="${esc(store.getVideo(p.id, ex.video))}" placeholder="${esc(ex.video)}">
          </label>`;
        }).join('')}`).join('')}
    </section>
    <section class="card">
      <h3>Instalar en el móvil</h3>
      <p class="muted">iPhone (Safari): Compartir → «Añadir a pantalla de inicio». Android (Chrome): menú ⋮ → «Instalar aplicación». Funciona sin conexión en el gimnasio (los vídeos necesitan internet).</p>
    </section>
    <section class="card danger">
      <h3>Borrar datos</h3>
      <p class="muted">Elimina todas las sesiones y vídeos personalizados de este dispositivo.</p>
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
  const btn = e.target.closest('[data-action]');
  if (!btn || btn.tagName === 'INPUT') return;
  const date = view.dataset.date;
  const exId = btn.closest('[data-ex]')?.dataset.ex;
  const row = btn.closest('.set-row');
  const { action } = btn.dataset;

  switch (action) {
    case 'dismiss-quote':
      quoteDismissed = true;
      btn.closest('.quote').remove();
      break;
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
      videoDialog(exId);
      break;
    case 'zoom':
      zoomDialog(exId);
      break;
    case 'step':
    case 'toggle':
      updateSet(date, exId, Number(row.dataset.i), row, action, btn);
      break;
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
    r[field] = field === 'kg' ? Math.max(0, parseNum(r.kg) + d * WEIGHT_STEP) : Math.max(0, (Number(r.reps) || 0) + d);
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
    const allDone = Object.values(s.exercises).every((rs) => rs.every((x) => x.done));
    if (r.done && allDone && !s.finished) setTimeout(() => toast('¡Todas las series hechas! Pulsa «Terminar sesión» 🏁', 3500), 1900);
  }
  store.save();
}

view.addEventListener('change', (e) => {
  const input = e.target;
  if (input.dataset.action === 'import') {
    importData(input.files[0]);
    input.value = '';
    return;
  }
  if (input.dataset.video) {
    const exId = input.dataset.video;
    const url = input.value.trim();
    if (url && !/^https?:\/\//.test(url)) {
      toast('Enlace no válido: debe empezar por https://');
      return;
    }
    store.setVideo(exId, url === EXERCISES[exId].video ? '' : url);
    toast(url && url !== EXERCISES[exId].video ? 'Vídeo guardado' : 'Vídeo original restaurado');
    render();
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
    case 'ajustes':
      renderSettings();
      break;
    default:
      tab = 'hoy';
      renderDay(todayStr());
  }
  document.querySelectorAll('.tabbar a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
  document.getElementById('topbar-date').textContent = cap(fmtDate(todayStr(), { weekday: 'short', day: 'numeric', month: 'short' }));
}

window.addEventListener('hashchange', () => {
  render();
  window.scrollTo(0, 0);
});

render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
