// Fechas locales en formato 'YYYY-MM-DD' (sin zonas horarias).

export const pad = (n) => String(n).padStart(2, '0');
export const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayStr = () => toDateStr(new Date());
export const parseDate = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (s, n) => {
  const d = parseDate(s);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
};
export const daysBetween = (a, b) => Math.round((parseDate(b) - parseDate(a)) / 86400000);
/** Lunes de la semana de `s`. */
export const weekStart = (s) => addDays(s, -((parseDate(s).getDay() + 6) % 7));
