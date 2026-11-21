// Datos estáticos: ejercicios, rutinas, actividades y frases motivadoras.

// Datos de Iván para estimar calorías (kcal ≈ MET × kg × horas).
export const PROFILE = { weightKg: 101, heightM: 1.88 };

const yt = (id) => `https://www.youtube.com/watch?v=${id}`;

/*
 * Patrones de movimiento (docs/INVESTIGACION-ENTRENAMIENTO.md §3). El entrenador propone
 * cambiar un ejercicio por otro del mismo patrón; solo si falta tracción cambia uno de empuje
 * repetido por otro de tracción.
 *   region → 'torso' | 'pierna' | 'core' | 'global' (equilibrio torso/pierna)
 *   side   → 'empuje' | 'traccion' en el torso (equilibrio empuje/tracción)
 */
export const PATTERNS = {
  'empuje-horizontal': { name: 'Empuje horizontal', region: 'torso', side: 'empuje' },
  'aperturas-pecho': { name: 'Aperturas de pecho', region: 'torso', side: 'empuje' },
  'empuje-vertical': { name: 'Empuje vertical', region: 'torso', side: 'empuje' },
  'hombro-lateral': { name: 'Hombro lateral', region: 'torso' },
  triceps: { name: 'Tríceps', region: 'torso', side: 'empuje' },
  'traccion-horizontal': { name: 'Tracción horizontal (remo)', region: 'torso', side: 'traccion' },
  'traccion-vertical': { name: 'Tracción vertical (jalón)', region: 'torso', side: 'traccion' },
  'hombro-posterior': { name: 'Hombro posterior', region: 'torso', side: 'traccion' },
  biceps: { name: 'Bíceps', region: 'torso', side: 'traccion' },
  rodilla: { name: 'Dominante de rodilla (sentadilla)', region: 'pierna' },
  cadera: { name: 'Dominante de cadera (bisagra)', region: 'pierna' },
  'extension-rodilla': { name: 'Extensión de rodilla', region: 'pierna' },
  'flexion-rodilla': { name: 'Flexión de rodilla', region: 'pierna' },
  aductores: { name: 'Aductores', region: 'pierna' },
  abductores: { name: 'Abductores', region: 'pierna' },
  gemelos: { name: 'Gemelos', region: 'pierna' },
  core: { name: 'Core', region: 'core' },
  global: { name: 'Global (cuerpo entero)', region: 'global' },
};

/*
 * Catálogo de ejercicios. La clave es el id (kebab-case) y se usa en las rutinas,
 * en los datos guardados y en el GIF: img/exercises/<id>.gif (o el campo `gif`).
 *   name, primary[], secondary[], tip, video, pattern  → obligatorios
 *     video   → vídeo de técnica / buenas prácticas del ejercicio
 *     pattern → clave de PATTERNS
 *   matrix → vídeo oficial de Matrix Fitness de esa máquina (solo si existe)
 *   note  → aclaración opcional (p. ej. «Peso = cada mancuerna»)
 *   step  → salto de peso en kg (por defecto WEIGHT_STEP = 2,5)
 *   gif   → ruta del GIF si no sigue el patrón anterior
 *   src   → id en free-exercise-db (dominio público) del que tools/fetch_gifs.py genera el GIF
 * No cambies el id de un ejercicio ya usado: se perdería su historial.
 */
export const EXERCISES = {
  'jalon-unilateral': {
    name: 'Jalón unilateral',
    primary: ['Dorsal ancho'],
    secondary: ['Bíceps', 'Romboides', 'Deltoides posterior'],
    tip: 'Pecho alto y lleva el codo hacia la cadera, sin girar el tronco.',
    video: yt('qUmBAKXevS4'),
    pattern: 'traccion-vertical',
  },
  'extension-cuadriceps': {
    name: 'Extensión de cuádriceps',
    primary: ['Cuádriceps'],
    secondary: [],
    tip: 'Rodilla alineada con el eje de la máquina; aguanta 1" arriba y baja controlando. Peso moderado: es un ejercicio exigente para la rodilla.',
    video: yt('WCLgQ2xGaQg'),
    matrix: yt('J-Y-Z0EU9Ic'),
    pattern: 'extension-rodilla',
  },
  'press-militar': {
    name: 'Press militar (máquina)',
    primary: ['Deltoides anterior y medio'],
    secondary: ['Tríceps', 'Trapecio'],
    tip: 'Espalda pegada al respaldo y sin arquear la zona lumbar.',
    video: yt('A20O8ZMn190'),
    matrix: yt('4rb9oFNdXmM'),
    pattern: 'empuje-vertical',
  },
  prensa: {
    name: 'Prensa de piernas',
    primary: ['Cuádriceps', 'Glúteos'],
    secondary: ['Isquiotibiales', 'Gemelos'],
    tip: 'No bloquees las rodillas arriba ni despegues la cadera del respaldo abajo (protege la zona lumbar).',
    video: yt('7NsEZu68ses'),
    matrix: yt('7xwQsPFpbBo'),
    step: 5,
    pattern: 'rodilla',
  },
  'extension-triceps-polea': {
    name: 'Extensión de tríceps en polea',
    primary: ['Tríceps'],
    secondary: ['Antebrazo'],
    tip: 'Codos pegados al cuerpo y quietos; solo se mueve el antebrazo.',
    video: yt('HAS8uy73HqM'),
    pattern: 'triceps',
  },
  'zancadas-traseras': {
    name: 'Zancadas traseras',
    primary: ['Glúteos', 'Cuádriceps'],
    secondary: ['Isquiotibiales', 'Core'],
    tip: 'Paso atrás largo, tronco erguido y la rodilla de atrás casi roza el suelo.',
    video: yt('2-ihOQEaFJw'),
    step: 2,
    note: 'Reps por pierna. Peso = cada mancuerna (0 = peso corporal). Empieza sin mancuernas: tu propio peso ya es buena carga.',
    pattern: 'rodilla',
  },
  'press-pecho': {
    name: 'Press de pecho (máquina)',
    primary: ['Pectoral'],
    secondary: ['Tríceps', 'Deltoides anterior'],
    tip: 'Asiento a la altura de las asas a mitad del pecho; escápulas juntas.',
    video: yt('N7DjfGB8-xY'),
    matrix: yt('-hwHlnTZ0Bs'),
    pattern: 'empuje-horizontal',
  },
  'curl-femoral': {
    name: 'Curl femoral sentado',
    primary: ['Isquiotibiales'],
    secondary: ['Gemelos'],
    tip: 'Ajusta el rodillo sobre los tobillos y baja despacio.',
    video: yt('JZtH3nYax5s'),
    matrix: yt('KnVkCUh6of8'),
    pattern: 'flexion-rodilla',
  },
  'remo-dorian': {
    name: 'Remo unilateral Dorian',
    primary: ['Dorsal ancho', 'Romboides'],
    secondary: ['Bíceps', 'Deltoides posterior', 'Trapecio'],
    tip: 'Tira con el codo hacia la cadera, sin tirones ni rotar el tronco.',
    video: yt('hMMMaKAHt-o'),
    pattern: 'traccion-horizontal',
  },
  hiperextensiones: {
    name: 'Hiperextensiones (máquina)',
    primary: ['Lumbares'],
    secondary: ['Glúteos', 'Isquiotibiales'],
    tip: 'Movimiento lento; no sobrepases la línea recta del cuerpo al subir. Mejor sin peso extra al principio.',
    video: yt('c_I1ZLuWP6Q'),
    matrix: yt('NiRL6br-Ll8'),
    pattern: 'cadera',
  },
  'curl-biceps': {
    name: 'Curl de bíceps',
    primary: ['Bíceps'],
    secondary: ['Braquial', 'Antebrazo'],
    tip: 'Codos fijos junto al cuerpo; sin balancear la espalda.',
    video: yt('qERAhN-qpaU'),
    step: 1,
    note: 'Peso = cada mancuerna.',
    pattern: 'biceps',
  },
  'elevaciones-laterales': {
    name: 'Elevaciones laterales',
    primary: ['Deltoides medio'],
    secondary: ['Trapecio'],
    tip: 'Sube hasta la altura de los hombros con los codos ligeramente flexionados.',
    video: yt('hgLpdwMtEEs'),
    step: 1,
    note: 'Peso = cada mancuerna.',
    pattern: 'hombro-lateral',
  },
  thruster: {
    name: 'Thruster',
    primary: ['Cuádriceps', 'Glúteos', 'Hombros'],
    secondary: ['Tríceps', 'Core'],
    tip: 'Sentadilla y, al subir, aprovecha el impulso para empujar sobre la cabeza. Empieza ligero: mueve mucho cuerpo y dispara las pulsaciones.',
    video: yt('NepZAvDeOwc'),
    step: 2,
    note: 'Peso = cada mancuerna.',
    pattern: 'global',
  },
  aperturas: {
    name: 'Aperturas (contractor)',
    primary: ['Pectoral'],
    secondary: ['Deltoides anterior'],
    tip: 'Codos ligeramente flexionados; junta las manos apretando el pecho.',
    video: yt('U5lV7oPW3CA'),
    matrix: yt('yc-C53652hg'),
    pattern: 'aperturas-pecho',
  },
  'belt-squat': {
    name: 'Belt Squat',
    primary: ['Cuádriceps', 'Glúteos'],
    secondary: ['Aductores', 'Isquiotibiales'],
    tip: 'Tronco erguido, baja hasta que los muslos queden paralelos al suelo.',
    video: yt('jdRfKAnssDY'),
    matrix: yt('tY26yuax9VY'),
    step: 5,
    pattern: 'rodilla',
  },
  'crunch-abdominal': {
    name: 'Crunch abdominal (máquina)',
    primary: ['Recto abdominal'],
    secondary: ['Oblicuos'],
    tip: 'Enrolla la columna; la fuerza sale del abdomen, no de los brazos.',
    video: yt('ih6WDODbY24'),
    matrix: yt('8AxUa3XlBzM'),
    pattern: 'core',
  },
  'extension-triceps-maquina': {
    name: 'Extensión de tríceps (máquina)',
    primary: ['Tríceps'],
    secondary: [],
    tip: 'Codos apoyados y alineados con el eje; extiende del todo sin rebotes.',
    video: yt('RDGZcBxTE74'),
    matrix: yt('LdUln0rrWA8'),
    pattern: 'triceps',
  },
  'jalon-pecho': {
    name: 'Jalón al pecho',
    primary: ['Dorsal ancho'],
    secondary: ['Bíceps', 'Romboides', 'Deltoides posterior'],
    tip: 'Baja la barra a la parte alta del pecho, sin echarte hacia atrás.',
    video: yt('72q0tKij5uU'),
    matrix: yt('SjeQawDt5V0'),
    pattern: 'traccion-vertical',
  },

  // Alternativas para variar las rutinas (GIF de free-exercise-db, dominio público).
  'press-inclinado-mancuernas': {
    name: 'Press inclinado con mancuernas',
    primary: ['Pectoral'],
    secondary: ['Deltoides anterior', 'Tríceps'],
    tip: 'Banco a 30-45°, escápulas juntas y baja las mancuernas hasta la altura del pecho, codos a unos 45° del tronco.',
    video: yt('MkMf308jXww'),
    step: 2,
    note: 'Peso = cada mancuerna.',
    pattern: 'empuje-horizontal',
    src: 'Incline_Dumbbell_Press',
  },
  'cruce-poleas': {
    name: 'Cruce de poleas',
    primary: ['Pectoral'],
    secondary: ['Deltoides anterior'],
    tip: 'Un pie adelantado, codos algo flexionados y fijos; junta las manos delante del pecho sin encoger los hombros.',
    video: yt('W7Nc-p7wR4Q'),
    pattern: 'aperturas-pecho',
    src: 'Cable_Crossover',
  },
  'press-hombro-mancuernas': {
    name: 'Press de hombro con mancuernas',
    primary: ['Deltoides anterior y medio'],
    secondary: ['Tríceps', 'Trapecio'],
    tip: 'Sentado con respaldo, abdomen firme; sube sin chocar las mancuernas y baja hasta la altura de las orejas.',
    video: yt('GELRUlUSxeI'),
    step: 2,
    note: 'Peso = cada mancuerna.',
    pattern: 'empuje-vertical',
    src: 'Dumbbell_Shoulder_Press',
  },
  'elevaciones-laterales-polea': {
    name: 'Elevación lateral en polea',
    primary: ['Deltoides medio'],
    secondary: ['Trapecio'],
    tip: 'Polea baja, un brazo cada vez; sube hasta la altura del hombro sin inclinar el tronco.',
    video: yt('gjUrYfNU1-M'),
    step: 1,
    note: 'Peso por brazo.',
    pattern: 'hombro-lateral',
    src: 'Cable_Seated_Lateral_Raise',
  },
  'extension-triceps-cuerda': {
    name: 'Extensión de tríceps sobre la cabeza (cuerda)',
    primary: ['Tríceps'],
    secondary: [],
    tip: 'De espaldas a la polea, codos apuntando al frente y quietos; estira los brazos del todo y separa la cuerda al final.',
    video: yt('Z8Qmv4ByV14'),
    pattern: 'triceps',
    src: 'Cable_Rope_Overhead_Triceps_Extension',
  },
  'remo-polea-baja': {
    name: 'Remo sentado en polea',
    primary: ['Dorsal ancho', 'Romboides'],
    secondary: ['Bíceps', 'Deltoides posterior', 'Trapecio'],
    tip: 'Espalda recta y pecho alto; tira hacia el ombligo juntando las escápulas, sin balancear el tronco.',
    video: yt('JtTusrYzAos'),
    pattern: 'traccion-horizontal',
    src: 'Seated_Cable_Rows',
  },
  'remo-maquina': {
    name: 'Remo en máquina',
    primary: ['Dorsal ancho', 'Romboides'],
    secondary: ['Bíceps', 'Deltoides posterior', 'Trapecio'],
    tip: 'Pecho apoyado en el soporte; tira con los codos hacia atrás y aguanta 1" juntando las escápulas.',
    video: yt('FOusO8JMU3Q'),
    pattern: 'traccion-horizontal',
    src: 'Leverage_Iso_Row',
  },
  'jalon-agarre-estrecho': {
    name: 'Jalón con agarre estrecho',
    primary: ['Dorsal ancho'],
    secondary: ['Bíceps', 'Romboides'],
    tip: 'Agarre neutro (triángulo), pecho alto; lleva el asa a la parte alta del pecho con los codos pegados.',
    video: yt('VUJYixXx5I8'),
    pattern: 'traccion-vertical',
    src: 'Close-Grip_Front_Lat_Pulldown',
  },
  'face-pull': {
    name: 'Face pull',
    primary: ['Deltoides posterior'],
    secondary: ['Trapecio', 'Romboides'],
    tip: 'Polea a la altura de la cara; tira de la cuerda hacia los ojos separando las manos y con los codos altos.',
    video: yt('X-xCQ1gh-kA'),
    pattern: 'hombro-posterior',
    src: 'Face_Pull',
  },
  'pajaro-maquina': {
    name: 'Pájaro en máquina',
    primary: ['Deltoides posterior'],
    secondary: ['Romboides', 'Trapecio'],
    tip: 'Pecho contra el respaldo del contractor y brazos casi estirados; abre hacia atrás sin encoger los hombros.',
    video: yt('NTJpVVa6zLo'),
    pattern: 'hombro-posterior',
    src: 'Reverse_Machine_Flyes',
  },
  'curl-martillo': {
    name: 'Curl martillo',
    primary: ['Bíceps', 'Braquial'],
    secondary: ['Antebrazo'],
    tip: 'Palmas mirándose durante todo el recorrido; codos quietos junto al cuerpo.',
    video: yt('znTSJ_2zJN0'),
    step: 1,
    note: 'Peso = cada mancuerna.',
    pattern: 'biceps',
    src: 'Hammer_Curls',
  },
  'sentadilla-goblet': {
    name: 'Sentadilla goblet',
    primary: ['Cuádriceps', 'Glúteos'],
    secondary: ['Aductores', 'Core'],
    tip: 'Mancuerna pegada al pecho, pies algo más abiertos que la cadera; baja con el tronco erguido y las rodillas en la línea de los pies.',
    video: yt('dB3TCDQFUtQ'),
    step: 2,
    pattern: 'rodilla',
    src: 'Goblet_Squat',
  },
  'subida-cajon': {
    name: 'Subida al cajón',
    primary: ['Cuádriceps', 'Glúteos'],
    secondary: ['Isquiotibiales', 'Core'],
    tip: 'Cajón bajo al principio; apoya todo el pie arriba y empuja con esa pierna, sin impulsarte con la de abajo.',
    video: yt('E88WpLYnnSk'),
    step: 2,
    note: 'Reps por pierna. Peso = cada mancuerna (0 = peso corporal).',
    pattern: 'rodilla',
    src: 'Dumbbell_Step_Ups',
  },
  'hip-thrust': {
    name: 'Hip thrust',
    primary: ['Glúteos'],
    secondary: ['Isquiotibiales'],
    tip: 'Espalda alta apoyada en el banco y barbilla al pecho; sube la cadera hasta alinearla con el tronco sin arquear la zona lumbar.',
    video: yt('3SHkXmrQtxQ'),
    step: 5,
    pattern: 'cadera',
    src: 'Barbell_Hip_Thrust',
  },
  'peso-muerto-rumano': {
    name: 'Peso muerto rumano con mancuernas',
    primary: ['Isquiotibiales', 'Glúteos'],
    secondary: ['Lumbares'],
    tip: 'Rodillas algo flexionadas y espalda neutra; lleva la cadera atrás deslizando las mancuernas por los muslos hasta notar estiramiento.',
    video: yt('yxLk9X5C7RU'),
    step: 2,
    note: 'Peso = cada mancuerna.',
    pattern: 'cadera',
    src: 'Stiff-Legged_Dumbbell_Deadlift',
  },
  'curl-femoral-tumbado': {
    name: 'Curl femoral tumbado',
    primary: ['Isquiotibiales'],
    secondary: ['Gemelos'],
    tip: 'Cadera pegada al banco; sube los talones hacia los glúteos y baja despacio.',
    video: yt('9xbBr5Ytl8c'),
    pattern: 'flexion-rodilla',
    src: 'Lying_Leg_Curls',
  },
  'aductores-maquina': {
    name: 'Aductores (máquina)',
    primary: ['Aductores'],
    secondary: [],
    tip: 'Espalda apoyada; junta las piernas con control y vuelve despacio sin dejar caer el peso.',
    video: yt('O7co9-r7a6M'),
    pattern: 'aductores',
    src: 'Thigh_Adductor',
  },
  'abductores-maquina': {
    name: 'Abductores (máquina)',
    primary: ['Glúteos'],
    secondary: [],
    tip: 'Espalda apoyada; abre las piernas empujando con la parte externa de las rodillas y vuelve controlando.',
    video: yt('-g5AF8wA740'),
    pattern: 'abductores',
    src: 'Thigh_Abductor',
  },
  'gemelos-sentado': {
    name: 'Gemelos sentado (máquina)',
    primary: ['Gemelos'],
    secondary: [],
    tip: 'Baja el talón todo lo posible, aguanta 1" y sube de puntillas sin rebotes.',
    video: yt('rfkYC-mbQus'),
    pattern: 'gemelos',
    src: 'Seated_Calf_Raise',
  },
  plancha: {
    name: 'Plancha',
    primary: ['Recto abdominal'],
    secondary: ['Oblicuos', 'Lumbares', 'Hombros'],
    tip: 'Codos bajo los hombros y cuerpo en línea recta; aprieta glúteos y abdomen sin hundir la cadera.',
    video: yt('zfY5XXa26ug'),
    note: 'Reps = segundos aguantando. Peso 0.',
    pattern: 'core',
    src: 'Plank',
  },
  'plancha-lateral': {
    name: 'Plancha lateral',
    primary: ['Oblicuos'],
    secondary: ['Recto abdominal', 'Glúteos'],
    tip: 'Codo bajo el hombro y cuerpo recto de la cabeza a los pies; empieza con las rodillas apoyadas si cuesta.',
    video: yt('euvthEjjuio'),
    note: 'Reps = segundos por lado. Peso 0.',
    pattern: 'core',
    src: 'Side_Bridge',
  },
  'press-pallof': {
    name: 'Press Pallof',
    primary: ['Oblicuos'],
    secondary: ['Recto abdominal'],
    tip: 'De lado a la polea, estira los brazos al frente y aguanta sin dejar que el tronco gire.',
    video: yt('W8Yf1uyUnoM'),
    note: 'Reps por lado.',
    pattern: 'core',
    src: 'Pallof_Press',
  },
  'dead-bug': {
    name: 'Dead bug (bicho muerto)',
    primary: ['Recto abdominal'],
    secondary: ['Oblicuos'],
    tip: 'Tumbado boca arriba con la zona lumbar pegada al suelo; estira brazo y pierna contrarios despacio sin despegarla.',
    video: yt('0JFVLaTLzHg'),
    note: 'Reps por lado. Peso 0.',
    pattern: 'core',
    src: 'Dead_Bug',
  },
};

/*
 * Rutinas de partida. Solo se usan la primera vez (o tras borrar los datos):
 * después las rutinas viven en el dispositivo (js/storage.js) y se editan en #/rutinas.
 *   id          → número entero único (nunca reutilices uno antiguo)
 *   name        → 'Rutina N'
 *   short       → nombre corto (cabe en un botón: ~16 caracteres)
 *   description → qué se trabaja, en una frase
 *   color       → color del distintivo y del calendario
 *   exercises   → { id: <clave de EXERCISES>, sets, reps }
 *   active      → false para retirarla sin perder su historial
 * La sugerencia rota por las rutinas activas en orden.
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
  'Descansa 1–2 min entre series; hasta 3 min en sentadilla, prensa o press pesados.',
  'Acaba cada serie dejando 1–3 repeticiones en reserva: no hace falta llegar al fallo.',
  'Al acabar cada ejercicio, valora cómo te fue (😣 💪 😎): la app te propondrá el peso de la próxima vez.',
  'Recorrido completo en cada repetición: da más fuerza y músculo que los movimientos a medias.',
  'Deja ~1 día de descanso activo (andar, estirar) entre días de fuerza.',
  'Calienta 5–10 min en elíptica o bici antes de las pesas: rodillas y espalda lo agradecen.',
  'Para el cardio, mejor bajo impacto (elíptica, bici, cinta andando con inclinación) que correr: cuida las rodillas.',
  'Espalda neutra siempre: si notas la zona lumbar, baja el peso antes que perder la técnica.',
  'Duerme 7 horas o más y toma proteína en cada comida (unos 1,6 g por kilo al día): ahí se gana el músculo.',
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
