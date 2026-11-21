# IvanGym – App web de gimnasio (móvil, GitHub Pages)

## Problema
Iván (novato) necesita una web móvil, sin backend, desplegable en github.io, que:
- Muestre la rutina prescrita (3 días: L/X/V) con nombre, músculos, GIF y vídeo de YouTube por ejercicio.
- Registre los días que va al gimnasio, el peso/reps por serie de cada máquina (Matrix) y cardio opcional.
- Permita ver la progresión de pesos.

## Rutina (fuente: docs/*.pdf + 3 collages GIF, uno por día, cuadrícula 3×2)
- **Rutina 1**: Jalón unilateral 3×12 · Extensión cuádriceps 3×12 · Press militar 3×12 · Prensa 3×12 · Extensión tríceps (polea) 3×12 · Zancadas traseras 3×10
- **Rutina 2**: Press pecho 3×12 · Curl femoral sentado 3×12 · Remo unilateral Dorian 3×10 · Hiperextensiones 3×15 · Curl bíceps 3×15 · Elevaciones laterales 3×15
- **Rutina 3**: Thruster 3×15 · Aperturas 3×12 · Belt Squat 3×12 · Crunch abdominal 4×15 · Extensión tríceps (máquina) 3×12 · Jalón al pecho 3×12
- M/J: descanso activo (caminar); S: estiramientos. Descanso 1–2' entre series, 3' entre ejercicios, cerca del fallo.

## Decisiones
- **Sin build**: HTML/CSS/JS plano (ES modules), GitHub Pages "Deploy from branch" (master, raíz). Se elimina webpack/node_modules/package-lock; `.nojekyll`. Actualizar AGENTS.md y README con cómo probar en local (`python3 -m http.server`).
- **Datos**: localStorage + exportar/importar JSON (copia de seguridad).
- **Registro por serie** (peso + reps), UI sencilla: filas pre-rellenadas con las series/reps prescritas y el último peso usado; botones +/− (2,5 kg) y check de serie hecha.
- **Vídeos**: un vídeo concreto por ejercicio (priorizar tutoriales Matrix Fitness si existen; si no, buen tutorial en español), URL editable desde la app (se guarda en localStorage).
- **GIFs**: recortar cada collage en 6 GIFs animados individuales (Python + Pillow), optimizados de tamaño, en `img/exercises/`.
- **PWA ligera**: manifest + service worker para funcionar offline en el gimnasio e "instalar" en pantalla de inicio.
- Idioma: español. Diseño mobile-first, modo claro, botones grandes.

## Días flexibles
Las rutinas del PDF (L/X/V) se tratan como **Rutina 1, 2 y 3** (sin mencionar ningún día de la semana en la app), **no ligadas al día de la semana**: Iván puede ir cualquier día. La app **sugiere la siguiente rutina de la rotación** (la siguiente a la última completada), pero se puede elegir cualquiera.

Cualquier día se puede registrar además (o en lugar de rutina) **otras actividades**:
- Cardio en el gimnasio: elíptica, bicicleta, escaleras, cinta, remo.
- Fuera del gimnasio: andar, correr, bici exterior, nadar, estiramientos, otra (texto libre).
- Campos: tipo, minutos, distancia opcional (km), nota opcional.
Consejo en pantalla: se recomienda dejar ~1 día de descanso activo (andar/estirar) entre días de fuerza.

## Mensaje motivador de bienvenida
Al abrir la app se muestra un mensaje motivador (banner en "Hoy", que se puede cerrar), elegido al azar de una lista (~40 frases en `js/data.js`) sin repetir el último. Frases personalizadas para Iván: profesor de Ingeniería Informática y papá de Pablo (5 años). Mezcla de tonos:
- Paternidad: energía para jugar con Pablo, ser su ejemplo, "Pablo necesita un papá fuerte para subirse a hombros".
- Guiños informáticos: "cada serie es un commit", "refactoriza tu cuerpo", "sin tests no hay progreso: registra tus pesos", "hoy compilas músculo".
- Novato/constancia: la constancia vence a la intensidad, ir aunque sea un poco.
- Contextuales cuando proceda: racha de días de esta semana, días desde la última visita ("¡Pablo y tus alumnos te echaban de menos en el gym!"), récord personal reciente.

## Pantallas (navegación inferior con hash routing)
1. **Hoy**: fecha de hoy; tarjeta "Rutina sugerida" (selector 1/2/3) y botón "Registrar actividad". Tarjetas de ejercicio: GIF, nombre, músculos (principal/secundarios), series×reps, botón "Ver vídeo", registro de series. Sección **Actividades** (cardio opcional / andar / etc.). Botón "Terminar sesión". Recordatorio de descansos y de cerca del fallo.
2. **Historial**: calendario mensual con días marcados por tipo (fuerza / solo actividad); al tocar un día, detalle (y editar/añadir registros de días pasados).
3. **Progreso**: por ejercicio, lista de últimas sesiones y gráfico simple (SVG propio, sin librerías) del peso máximo. Tarjeta **«Últimos 7 días»** del entrenador (ver abajo).
4. **Ajustes**: gestionar rutinas, exportar/importar JSON, editar URLs de vídeos, créditos, borrar datos.
5. **Rutinas** (`#/rutinas`, desde Ajustes): propuestas de cambio pendientes, lista de rutinas (activas y retiradas) y editor (`#/rutinas/<id>`, `#/rutinas/nueva`): nombre, nombre corto, descripción, color, activa, ejercicios (cambiar por otro del catálogo agrupado por patrón de movimiento, series, reps, orden) y mapa de los músculos que cubre.

## Estructura de archivos
- `index.html`, `css/style.css`, `js/app.js` (router + vistas), `js/data.js` (patrones, catálogo de ejercicios, rutinas de partida, consejos), `js/muscles.js` (músculos y mapa corporal), `js/coach.js` (entrenador), `js/dates.js` (fechas), `js/storage.js`, `sw.js`, `site.webmanifest`, `img/exercises/*.gif`, `tools/crop_gifs.py`, `tools/fetch_gifs.py`.

## Modelo de datos (localStorage `ivangym:v1`)
```
{ sessions: [{ id, date:'YYYY-MM-DD', routine: id|null, exercises:{ [exId]: [{kg, reps, done}] }, activities:[{type, minutes, km, note}], feel:{ [exId]: 'easy'|'ok'|'hard' }, finished }],
  routines: [{ id, name, short, description, color:'#rrggbb', exercises:[{id, sets, reps}], active, since:'YYYY-MM-DD', snoozeUntil? }],
  videoOverrides: { [exId]: url },
  notes: { [exId]: texto } }   // nota fija por ejercicio (p. ej. ubicación de la máquina), máx. 200 caracteres
```
Las rutinas se copian de `ROUTINES` (`js/data.js`) la primera vez (con `since` = primera sesión registrada de cada una); desde entonces son datos del usuario y viajan en la exportación. `since` es la fecha de la versión actual de la rutina: se reinicia al cambiar el conjunto de ejercicios (no al reordenarlos).

## Notas / riesgos
- Coordenadas de recorte de los collages a medir sobre los frames.
- Verificar URLs de YouTube (existencia) antes de fijarlas.
- Probar en viewport móvil y que la ruta base funcione bajo `/<repo>/` en github.io (rutas relativas).

## Perfil y calorías
Iván: 101 kg, 1,88 m (IMC ≈ 28,6). La app estima kcal ≈ MET × 101 kg × horas: por actividad (MET por tipo; andar/correr/cinta por velocidad si se indican km) y para la fuerza (MET 4, duración ≈ 2,5 min por serie + 1,5 min por ejercicio). Se muestra en cada actividad, en el resumen de la sesión y en el historial. Consejos orientados a cuidar rodillas y zona lumbar (calentar, cardio de bajo impacto, empezar ligero en zancadas, thruster, hiperextensiones y extensión de cuádriceps). Perfil en `PROFILE` de `js/data.js`.

## Progresión de cargas
Las series se rellenan con el peso de la última sesión del ejercicio. Tras cada ejercicio se valora con 😣 Duro / 💪 Justo / 😎 Fácil (`session.feel[exId]`). Regla para la siguiente vez (`suggestLoad` en `js/app.js`): 😎 con todas las series y reps → sube; 💪 dos sesiones seguidas completas con el mismo peso → sube; 😣 dos sesiones seguidas → baja 10 %; resto → mantiene. El salto depende del ejercicio (`step` en `js/data.js`: 1–2 kg mancuernas, 5 kg prensa/belt squat, 2,5 kg por defecto).

Desentrenamiento (heurística propia): si han pasado ≥14 días desde la última vez que se hizo el ejercicio, se propone bajar el peso un 10 %; con ≥28 días, un 20 % y reiniciar con calma.

## Entrenador (`js/coach.js`)
Analiza el historial con reglas de `docs/INVESTIGACION-ENTRENAMIENTO.md` (§3). Cada aviso muestra su nivel de evidencia (🟢 consenso, 🟡 evidencia moderada, 🟠 orientativo) y su fuente.
- **Volumen semanal por músculo** (últimos 7 días; series hechas, las de músculos secundarios cuentan ½): déficit < 4, bajo < 6, recomendado 6–16, alto ≤ 22, excesivo > 22. Mapa corporal coloreado y detalle por músculo principal.
- **Frecuencia**: aviso si un músculo principal se trabaja menos de 2 días por semana (OMS 2020, ACSM).
- **Equilibrio** (14 días): tracción/empuje ≥ 0,8 y pierna/torso ≥ 0,5 (orientativo).
- **Cardio**: minutos equivalentes (intensos ×2, MET ≥ 6) frente a 150–300 min/semana (OMS 2020).
- **Estancamiento**: 4 sesiones seguidas sin superar peso ni repeticiones → aviso en la tarjeta del ejercicio (heurística). No cuenta si la última se marcó 😎 (le falta carga, no está estancado).
- **Fatiga**: 3 o más ejercicios marcados 😣 en 14 días → sugerencia de semana de descarga en «Hoy».
- **Propuestas de rutina**: cuando la versión actual de una rutina lleva ≥ 6 semanas en uso (con un mensaje más firme a partir de 12) o tiene ≥ 2 ejercicios estancados, se propone cambiar como mucho 2 ejercicios (primero los estancados, luego los de músculos más trabajados) por otros del mismo patrón de movimiento que no estén en otras rutinas activas, priorizando los que trabajan músculos con volumen bajo y los aún no probados. Si además la tracción va por detrás del empuje (ratio < 0,8), uno de esos cambios pasa un ejercicio de empuje repetido en las rutinas activas a uno de tracción, priorizando patrones no cubiertos (p. ej. hombro posterior); se aplica en una sola rutina. Una alternativa propuesta en una rutina no se repite en otra. Series y reps se mantienen. Se puede aceptar (nueva versión), editar antes o posponer 2 semanas.
