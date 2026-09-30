// Datos estáticos: ejercicios, rutinas, actividades y frases motivadoras.

// Datos de Iván para estimar calorías (kcal ≈ MET × kg × horas).
export const PROFILE = { weightKg: 101, heightM: 1.88 };

const yt = (id) => `https://www.youtube.com/watch?v=${id}`;

/*
 * Catálogo de ejercicios. La clave es el id (kebab-case) y se usa en las rutinas,
 * en los datos guardados y en el GIF: img/exercises/<id>.gif (o el campo `gif`).
 *   name, primary[], secondary[], tip, video  → obligatorios
 *     video  → vídeo de técnica / buenas prácticas del ejercicio
 *   matrix → vídeo oficial de Matrix Fitness de esa máquina (solo si existe)
 *   note  → aclaración opcional (p. ej. «Peso = cada mancuerna»)
 *   step  → salto de peso en kg (por defecto WEIGHT_STEP = 2,5)
 *   gif   → ruta del GIF si no sigue el patrón anterior
 * No cambies el id de un ejercicio ya usado: se perdería su historial.
 */
export const EXERCISES = {
  'jalon-unilateral': {
    name: 'Jalón unilateral',
    primary: ['Dorsal ancho'],
    secondary: ['Bíceps', 'Romboides', 'Deltoides posterior'],
    tip: 'Pecho alto y lleva el codo hacia la cadera, sin girar el tronco.',
    video: yt('qUmBAKXevS4'),
  },
  'extension-cuadriceps': {
    name: 'Extensión de cuádriceps',
    primary: ['Cuádriceps'],
    secondary: [],
    tip: 'Rodilla alineada con el eje de la máquina; aguanta 1" arriba y baja controlando. Peso moderado: es un ejercicio exigente para la rodilla.',
    video: yt('WCLgQ2xGaQg'),
    matrix: yt('J-Y-Z0EU9Ic'),
  },
  'press-militar': {
    name: 'Press militar (máquina)',
    primary: ['Deltoides anterior y medio'],
    secondary: ['Tríceps', 'Trapecio'],
    tip: 'Espalda pegada al respaldo y sin arquear la zona lumbar.',
    video: yt('A20O8ZMn190'),
    matrix: yt('4rb9oFNdXmM'),
  },
  prensa: {
    name: 'Prensa de piernas',
    primary: ['Cuádriceps', 'Glúteos'],
    secondary: ['Isquiotibiales', 'Gemelos'],
    tip: 'No bloquees las rodillas arriba ni despegues la cadera del respaldo abajo (protege la zona lumbar).',
    video: yt('7NsEZu68ses'),
    matrix: yt('7xwQsPFpbBo'),
    step: 5,
  },
  'extension-triceps-polea': {
    name: 'Extensión de tríceps en polea',
    primary: ['Tríceps'],
    secondary: ['Antebrazo'],
    tip: 'Codos pegados al cuerpo y quietos; solo se mueve el antebrazo.',
    video: yt('HAS8uy73HqM'),
  },
  'zancadas-traseras': {
    name: 'Zancadas traseras',
    primary: ['Glúteos', 'Cuádriceps'],
    secondary: ['Isquiotibiales', 'Core'],
    tip: 'Paso atrás largo, tronco erguido y la rodilla de atrás casi roza el suelo.',
    video: yt('2-ihOQEaFJw'),
    step: 2,
    note: 'Reps por pierna. Peso = cada mancuerna (0 = peso corporal). Empieza sin mancuernas: tu propio peso ya es buena carga.',
  },
  'press-pecho': {
    name: 'Press de pecho (máquina)',
    primary: ['Pectoral'],
    secondary: ['Tríceps', 'Deltoides anterior'],
    tip: 'Asiento a la altura de las asas a mitad del pecho; escápulas juntas.',
    video: yt('N7DjfGB8-xY'),
    matrix: yt('-hwHlnTZ0Bs'),
  },
  'curl-femoral': {
    name: 'Curl femoral sentado',
    primary: ['Isquiotibiales'],
    secondary: ['Gemelos'],
    tip: 'Ajusta el rodillo sobre los tobillos y baja despacio.',
    video: yt('JZtH3nYax5s'),
    matrix: yt('KnVkCUh6of8'),
  },
  'remo-dorian': {
    name: 'Remo unilateral Dorian',
    primary: ['Dorsal ancho', 'Romboides'],
    secondary: ['Bíceps', 'Deltoides posterior', 'Trapecio'],
    tip: 'Tira con el codo hacia la cadera, sin tirones ni rotar el tronco.',
    video: yt('hMMMaKAHt-o'),
  },
  hiperextensiones: {
    name: 'Hiperextensiones (máquina)',
    primary: ['Lumbares'],
    secondary: ['Glúteos', 'Isquiotibiales'],
    tip: 'Movimiento lento; no sobrepases la línea recta del cuerpo al subir. Mejor sin peso extra al principio.',
    video: yt('c_I1ZLuWP6Q'),
    matrix: yt('NiRL6br-Ll8'),
  },
  'curl-biceps': {
    name: 'Curl de bíceps',
    primary: ['Bíceps'],
    secondary: ['Braquial', 'Antebrazo'],
    tip: 'Codos fijos junto al cuerpo; sin balancear la espalda.',
    video: yt('qERAhN-qpaU'),
    step: 1,
    note: 'Peso = cada mancuerna.',
  },
  'elevaciones-laterales': {
    name: 'Elevaciones laterales',
    primary: ['Deltoides medio'],
    secondary: ['Trapecio'],
    tip: 'Sube hasta la altura de los hombros con los codos ligeramente flexionados.',
    video: yt('hgLpdwMtEEs'),
    step: 1,
    note: 'Peso = cada mancuerna.',
  },
  thruster: {
    name: 'Thruster',
    primary: ['Cuádriceps', 'Glúteos', 'Hombros'],
    secondary: ['Tríceps', 'Core'],
    tip: 'Sentadilla y, al subir, aprovecha el impulso para empujar sobre la cabeza. Empieza ligero: mueve mucho cuerpo y dispara las pulsaciones.',
    video: yt('NepZAvDeOwc'),
    step: 2,
    note: 'Peso = cada mancuerna.',
  },
  aperturas: {
    name: 'Aperturas (contractor)',
    primary: ['Pectoral'],
    secondary: ['Deltoides anterior'],
    tip: 'Codos ligeramente flexionados; junta las manos apretando el pecho.',
    video: yt('U5lV7oPW3CA'),
    matrix: yt('yc-C53652hg'),
  },
  'belt-squat': {
    name: 'Belt Squat',
    primary: ['Cuádriceps', 'Glúteos'],
    secondary: ['Aductores', 'Isquiotibiales'],
    tip: 'Tronco erguido, baja hasta que los muslos queden paralelos al suelo.',
    video: yt('jdRfKAnssDY'),
    matrix: yt('tY26yuax9VY'),
    step: 5,
  },
  'crunch-abdominal': {
    name: 'Crunch abdominal (máquina)',
    primary: ['Recto abdominal'],
    secondary: ['Oblicuos'],
    tip: 'Enrolla la columna; la fuerza sale del abdomen, no de los brazos.',
    video: yt('ih6WDODbY24'),
    matrix: yt('8AxUa3XlBzM'),
  },
  'extension-triceps-maquina': {
    name: 'Extensión de tríceps (máquina)',
    primary: ['Tríceps'],
    secondary: [],
    tip: 'Codos apoyados y alineados con el eje; extiende del todo sin rebotes.',
    video: yt('RDGZcBxTE74'),
    matrix: yt('LdUln0rrWA8'),
  },
  'jalon-pecho': {
    name: 'Jalón al pecho',
    primary: ['Dorsal ancho'],
    secondary: ['Bíceps', 'Romboides', 'Deltoides posterior'],
    tip: 'Baja la barra a la parte alta del pecho, sin echarte hacia atrás.',
    video: yt('72q0tKij5uU'),
    matrix: yt('SjeQawDt5V0'),
  },
};

/*
 * Rutinas. Para añadir una nueva, copia un bloque y cambia:
 *   id          → número entero NUEVO y único (nunca reutilices uno antiguo)
 *   name        → 'Rutina N'
 *   short       → nombre corto (cabe en un botón: ~16 caracteres)
 *   description → qué se trabaja, en una frase
 *   color       → color del distintivo y del calendario
 *   exercises   → { id: <clave de EXERCISES>, sets, reps }
 * Para retirar una rutina sin perder su historial, pon `active: false`
 * (deja de sugerirse y de aparecer para elegir, pero se sigue viendo en el historial).
 * La sugerencia rota por las rutinas activas en el orden de este array.
 */
export const ROUTINES = [
  {
    id: 1,
    name: 'Rutina 1',
    short: 'Pierna y hombro',
    color: '#339af0',
    description: 'Cuádriceps y glúteos (prensa, extensión, zancadas), con hombro, dorsal y tríceps.',
    exercises: [
      { id: 'jalon-unilateral', sets: 3, reps: 12 },
      { id: 'extension-cuadriceps', sets: 3, reps: 12 },
      { id: 'press-militar', sets: 3, reps: 12 },
      { id: 'prensa', sets: 3, reps: 12 },
      { id: 'extension-triceps-polea', sets: 3, reps: 12 },
      { id: 'zancadas-traseras', sets: 3, reps: 10 },
    ],
  },
  {
    id: 2,
    name: 'Rutina 2',
    short: 'Torso y femoral',
    color: '#9775fa',
    description: 'Pecho y espalda, parte trasera de la pierna y lumbares, más bíceps y hombro.',
    exercises: [
      { id: 'press-pecho', sets: 3, reps: 12 },
      { id: 'curl-femoral', sets: 3, reps: 12 },
      { id: 'remo-dorian', sets: 3, reps: 10 },
      { id: 'hiperextensiones', sets: 3, reps: 15 },
      { id: 'curl-biceps', sets: 3, reps: 15 },
      { id: 'elevaciones-laterales', sets: 3, reps: 15 },
    ],
  },
  {
    id: 3,
    name: 'Rutina 3',
    short: 'Global y core',
    color: '#ff6b6b',
    description: 'Ejercicios globales que suben pulsaciones (thruster, belt squat), pecho, dorsal, tríceps y abdomen.',
    exercises: [
      { id: 'thruster', sets: 3, reps: 15 },
      { id: 'aperturas', sets: 3, reps: 12 },
      { id: 'belt-squat', sets: 3, reps: 12 },
      { id: 'crunch-abdominal', sets: 4, reps: 15 },
      { id: 'extension-triceps-maquina', sets: 3, reps: 12 },
      { id: 'jalon-pecho', sets: 3, reps: 12 },
    ],
  },
];

export const ACTIVITY_TYPES = [
  { id: 'eliptica', label: 'Elíptica', icon: '🌀', met: 5.0, group: 'Cardio en el gimnasio' },
  { id: 'bicicleta', label: 'Bicicleta estática', icon: '🚲', met: 6.8, group: 'Cardio en el gimnasio' },
  { id: 'escaleras', label: 'Escaleras', icon: '🪜', met: 9.0, group: 'Cardio en el gimnasio' },
  { id: 'cinta', label: 'Cinta', icon: '🏃', met: 5.0, bySpeed: true, group: 'Cardio en el gimnasio' },
  { id: 'remo', label: 'Remo', icon: '🚣', met: 7.0, group: 'Cardio en el gimnasio' },
  { id: 'andar', label: 'Andar', icon: '🚶', met: 3.5, bySpeed: true, group: 'Fuera del gimnasio' },
  { id: 'correr', label: 'Correr', icon: '🏃‍♂️', met: 8.3, bySpeed: true, group: 'Fuera del gimnasio' },
  { id: 'bici', label: 'Bici exterior', icon: '🚴', met: 7.5, group: 'Fuera del gimnasio' },
  { id: 'nadar', label: 'Nadar', icon: '🏊', met: 6.0, group: 'Fuera del gimnasio' },
  { id: 'estiramientos', label: 'Estiramientos', icon: '🧘', met: 2.3, group: 'Fuera del gimnasio' },
  { id: 'otra', label: 'Otra', icon: '✨', met: 4.0, group: 'Fuera del gimnasio' },
];

// Salto de peso por defecto (máquinas). Cada ejercicio puede definir su `step` (p. ej. mancuernas).
export const WEIGHT_STEP = 2.5;

// Valoración de cada ejercicio al terminarlo; decide el peso de la próxima vez.
export const FEELINGS = [
  { id: 'hard', icon: '😣', label: 'Duro', help: 'No llegué o perdí la técnica' },
  { id: 'ok', icon: '💪', label: 'Justo', help: 'Llegué, pero apurado' },
  { id: 'easy', icon: '😎', label: 'Fácil', help: 'Me sobraban 2+ reps' },
];

// Pesas con descansos (Compendium of Physical Activities: 3,5 moderado – 6 vigoroso). Algo conservador.
export const STRENGTH_MET = 4.0;
// Duración estimada de la fuerza: serie + descanso, y cambio entre ejercicios.
export const MIN_PER_SET = 2.5;
export const MIN_PER_EXERCISE = 1.5;

export const TIPS = [
  'Descansa 1–2 min entre series y 3 min entre ejercicios.',
  'Quédate cerca del fallo: llega a las repeticiones, pero que te cueste.',
  'Al acabar cada ejercicio, valora cómo te fue (😣 💪 😎): la app te propondrá el peso de la próxima vez.',
  'Deja ~1 día de descanso activo (andar, estirar) entre días de fuerza.',
  'Calienta 5–10 min en elíptica o bici antes de las pesas: rodillas y espalda lo agradecen.',
  'Para el cardio, mejor bajo impacto (elíptica, bici, cinta andando con inclinación) que correr: cuida las rodillas.',
  'Espalda neutra siempre: si notas la zona lumbar, baja el peso antes que perder la técnica.',
];

export const QUOTES = [
  // Paternidad
  'Pablo necesita un papá fuerte para subirse a hombros. ¡A por ello!',
  'Cada serie de hoy son más minutos jugando con Pablo sin cansarte.',
  'Pablo aprende más de lo que haces que de lo que dices. Hoy le enseñas constancia.',
  'Un día Pablo querrá echarte una carrera. Que no te pille en el sofá.',
  'Entrena hoy para poder cargar con Pablo… y con su mochila del cole.',
  'Los superhéroes de Pablo tienen músculos. Tú también puedes.',
  'Papá fuerte, papá feliz. Pablo lo nota.',
  'Hoy no tienes que ganar a nadie: solo ser un poco mejor que ayer, como le dices a Pablo.',
  'Con 5 años, Pablo tiene energía infinita. Tu turno de recargar la tuya.',
  'Que el parque con Pablo sea el calentamiento, no la sesión entera.',
  // Guiños informáticos
  'Cada serie es un commit. Hoy toca hacer push.',
  'Refactoriza tu cuerpo: pequeñas mejoras, integración continua.',
  'Sin tests no hay progreso: registra tus pesos.',
  'Hoy compilas músculo. Warnings permitidos, errores no.',
  'git commit -m "otra sesión más" && git push --force-de-voluntad',
  'Tu cuerpo es legacy code: se mejora poco a poco, sin romper nada.',
  'Deploy diario de salud. Uptime: 100 %.',
  'El descanso entre series es tu garbage collector. Respétalo.',
  'O(1): lo que cuesta ir hoy. O(n): lo que ganas a largo plazo.',
  'while (vivo) { entrenar(); descansar(); repetir(); }',
  'Menos bugs en la espalda, más features en los brazos.',
  'Hoy eres tu propio product owner: prioriza tu salud en el sprint.',
  'Ni Stack Overflow puede hacer las sentadillas por ti.',
  'Tus alumnos depuran código; tú depuras la técnica de cada repetición.',
  'Pull request aprobado: fuerza +1.',
  'La constancia es como la cobertura de tests: cuanto más alta, más confianza.',
  'Hoy no hay merge conflicts: solo tú contra la pereza. Gana tú.',
  // Novato / constancia
  'La constancia vence a la intensidad. Ir hoy ya es ganar.',
  'Aunque sea un poco: 20 minutos cuentan más que 0.',
  'Nadie empieza siendo fuerte. Se empieza empezando.',
  'La técnica primero, el peso después.',
  'Hoy no se trata de motivación, sino de costumbre.',
  'Los resultados llegan a los que no se saltan los días aburridos.',
  'Cada kilo que subes en la prensa se nota subiendo escaleras.',
  'No compitas con nadie del gimnasio. Compite con el Iván de la semana pasada.',
  'Un mal entrenamiento es mejor que ningún entrenamiento.',
  'Pequeños pasos, grandes cambios. Paso a paso, como en un algoritmo.',
  'Cerca del fallo, lejos de la excusa.',
  'Bebe agua, respira hondo y a por la primera serie.',
  'Dentro de un año darás gracias por haber empezado hoy.',
];
