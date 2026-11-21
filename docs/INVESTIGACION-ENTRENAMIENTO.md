# Investigación: pautas basadas en evidencia para entrenamiento de fuerza en gimnasio

> Documento de referencia para IvanGym (PWA sin backend, JS puro). Su objetivo es servir de base
> de reglas para que la app proponga rutinas nuevas y ajustes de carga a partir del histórico del
> usuario. Población objetivo: adulto sano, nivel principiante-intermedio, con objetivos de salud
> general, hipertrofia/fuerza y composición corporal.
>
> Fecha de elaboración: noviembre de 2026. Todas las afirmaciones están citadas. Cuando no fue
> posible verificar una fuente o una cifra contra el documento original, se indica explícitamente
> en el texto y se recoge también en la sección 5 ("Limitaciones y lagunas de evidencia").

## Cómo leer este documento

- Cada recomendación incluye un **nivel de confianza/consenso**:
  - 🟢 **Consenso fuerte**: posición oficial de un organismo (OMS, ACSM, HHS) o resultado
    replicado en varios metaanálisis independientes.
  - 🟡 **Evidencia moderada**: un metaanálisis o ECA de buena calidad, pero con matices,
    intervalos de confianza amplios o resultados mixtos.
  - 🟠 **Heurística razonable**: práctica extendida y coherente con los principios generales de
    la literatura, pero sin un estudio específico que la valide de forma directa y cuantitativa.
  - ⚪ **No verificado**: cifra o fuente que se buscó explícitamente y no se pudo confirmar contra
    el documento original; se indica qué se intentó y por qué no se pudo confirmar.
- Las citas usan el formato: Autores. "Título". *Revista*, Año;Volumen(Número):Páginas.
  DOI/URL/PMID. La bibliografía completa está en la sección 6.
- Todas las búsquedas se hicieron sobre abstracts y documentos primarios en inglés (PubMed/Europe
  PMC, páginas oficiales de editoriales y organismos); la síntesis y las reglas se presentan en
  español de España.

## 1. Resumen ejecutivo

- La fuerza debe entrenarse **≥2 días/semana**, trabajando todos los grandes grupos musculares,
  como mínimo para obtener beneficios de salud general (🟢 OMS 2020; HHS 2018; Garber et al. 2011).
- Para adultos sanos principiante/intermedio, **2-4 sesiones/semana de cuerpo completo o rutinas
  con alta frecuencia por grupo muscular** son preferibles a programas de 1 sesión/semana por
  músculo (🟢 ACSM 2009; 🟡 Schoenfeld et al. 2019).
- El **volumen semanal (nº de series efectivas por grupo muscular)** es la variable con relación
  dosis-respuesta más sólida con la hipertrofia: cada serie semanal adicional aporta en promedio
  ~0,37 % más de ganancia muscular, con mejores resultados a partir de **≥10 series/semana** en la
  literatura revisada, aunque con rendimientos decrecientes y mayor incertidumbre en el extremo
  alto (🟡 Schoenfeld et al. 2017; 🟡 Pelland et al. 2025/2026).
- **La frecuencia por sí misma no es determinante** si el volumen semanal total se mantiene
  igual: lo importante es el volumen acumulado, y repartirlo en más sesiones es sobre todo una
  estrategia para poder manejarlo con buena calidad (🟡 Schoenfeld et al. 2019).
- **Cargas bajas (~30-60 % 1RM) y cargas altas (>60-80 % 1RM) producen hipertrofia similar si las
  series se acercan al fallo**; para ganancias máximas de fuerza dinámica (1RM), las cargas altas
  son superiores (🟡 Schoenfeld et al. 2017; 🟡 Currier et al. 2023).
- **No es necesario entrenar sistemáticamente al fallo muscular absoluto.** Dejar 1-3 repeticiones
  en reserva (RIR) es suficiente para el desarrollo de fuerza (el RIR apenas influye en la
  ganancia de fuerza) y aporta solo una ventaja pequeña/trivial en hipertrofia frente a quedarse
  cerca sin llegar al fallo (🟡 Refalo et al. 2023; 🟡 Robinson et al. 2024).
- **Descanso entre series:** 2-5 minutos para ejercicios multiarticulares pesados orientados a
  fuerza; 1-2 minutos es razonable para hipertrofia con cargas moderadas, pudiendo acortarse en
  ejercicios monoarticulares (🟢 ACSM 2009; 🟡 Grgic et al. 2018; 🟡 Schoenfeld et al. 2016).
- **Progresión de carga:** incrementar peso un 2-10 % (en la práctica, el salto mínimo del
  equipo, p. ej. 2,5 kg) cuando se completan todas las series en el extremo superior del rango de
  repeticiones objetivo con margen de reserva (🟢 ACSM 2009; principio de doble progresión, 🟠
  heurística ampliamente usada y coherente con la literatura de RIR).
- **Rango de movimiento completo** produce mayor fuerza e hipertrofia (especialmente en tren
  inferior) que el rango parcial (🟡 Pallarés et al. 2021).
- **El orden de ejercicios importa principalmente para el ejercicio prioritario**: debe colocarse
  al principio de la sesión, sea multiarticular o monoarticular, grande o pequeño (🟡
  Spineti/Simão et al. 2010).
- **La periodización (variar sistemáticamente volumen/intensidad) mejora la ganancia de fuerza
  frente a programas no periodizados**, especialmente en sujetos ya entrenados, con ventaja del
  modelo ondulante sobre el lineal; en hipertrofia la diferencia es mínima (🟡 Moesgaard et al.
  2022; 🟡 Williams et al. 2017).
- **No existe un estudio que defina de forma validada "cuántas semanas sin progreso = estancamiento"
  ni que demuestre que las descargas (deload) "rompen" un estancamiento ya instaurado**: es
  terreno mayoritariamente heurístico (⚪/🟠, ver limitaciones).
- **Proteína:** para maximizar las ganancias de masa magra inducidas por el entrenamiento de
  fuerza, el beneficio de una mayor ingesta proteica se agota en torno a **~1,6 g/kg/día** (cifra
  exacta verificada: 1,62 g/kg/día); por encima no hay ganancias adicionales demostradas (🟢
  Morton et al. 2018).
- **Sueño:** dormir **≥7 horas por noche** de forma regular es la recomendación de consenso para
  la salud y el rendimiento; dormir menos se asocia a peor rendimiento y recuperación (🟢
  consenso AASM/SRS 2015).
- **Entrenamiento concurrente (fuerza + cardio):** el cardio de alto volumen/frecuencia, en
  especial de impacto tipo carrera, puede interferir con las ganancias de fuerza e hipertrofia;
  el cardio de bajo impacto (p. ej. bicicleta) no mostró ese efecto negativo significativo en el
  metaanálisis revisado (🟡 Wilson et al. 2012).

## 2. Variables de entrenamiento

### 2.1 Frecuencia por grupo muscular y sesiones/semana

| Recomendación | Población | Nivel | Fuente |
|---|---|---|---|
| ≥2 días/semana trabajando todos los grandes grupos musculares | Adulto sano, salud general | 🟢 Consenso fuerte | OMS 2020 (Bull et al. 2020); HHS 2018; Garber et al. 2011 |
| 2-3 días/semana, no consecutivos para el mismo grupo muscular | Adulto sano, salud general | 🟢 Consenso fuerte | Garber et al. 2011 |
| Principiante: 2-3 días/semana de cuerpo completo | Principiante | 🟢 Consenso fuerte | ACSM/Ratamess et al. 2009 |
| Intermedio: 3-4 días/semana (rutinas divididas posibles) | Intermedio | 🟢 Consenso fuerte | ACSM/Ratamess et al. 2009 |
| Avanzado: 4-5 (hasta 4-6) días/semana con repartos por grupo muscular | Avanzado | 🟢 Consenso fuerte | ACSM/Ratamess et al. 2009 |
| A volumen semanal igual, no hay diferencia significativa en hipertrofia entre entrenar un músculo 1x/semana o ≥2x/semana | General | 🟡 Evidencia moderada | Schoenfeld, Grgic, Krieger 2019 |
| Mejor combinación de prescripción identificada para fuerza: 3 sesiones/semana por grupo muscular; para hipertrofia: 2 sesiones/semana | General | 🟡 Evidencia moderada | Currier et al. 2023 (BJSM) |
| La frecuencia sí predice mejoras de fuerza con rendimientos decrecientes; su efecto sobre hipertrofia es prácticamente nulo una vez descontado el volumen | General | 🟡 Evidencia moderada | Pelland et al. 2025/2026 |

**Lectura para IvanGym:** la estructura de 3 rutinas rotativas de cuerpo completo, con ~1 día de
descanso entre sesiones de fuerza, encaja con el marco ACSM para principiante/intermedio (2-4
sesiones/semana de cuerpo completo) y, si el usuario entrena 3 veces por semana con descanso
intermedio, cada grupo muscular recibe de forma natural 2-3 estímulos semanales, en línea con la
combinación mejor valorada por Currier et al. (2023).

### 2.2 Volumen (series efectivas semanales por músculo)

| Recomendación cuantitativa | Nivel | Fuente |
|---|---|---|
| Relación dosis-respuesta: cada serie semanal adicional por grupo muscular ≈ +0,37 % de ganancia de masa muscular (coeficiente de regresión del tamaño del efecto) | 🟡 Evidencia moderada | Schoenfeld, Ogborn, Krieger 2017 |
| Categorías de volumen analizadas: <5, 5-9 y ≥10 series/semana/músculo; tendencia a mayor hipertrofia con ≥10 series, aunque la comparación por categorías no alcanzó significación estadística estricta (p = 0,074) | 🟡 Evidencia moderada (matizada) | Schoenfeld, Ogborn, Krieger 2017 |
| Más volumen semanal sigue asociándose a más fuerza e hipertrofia, pero con rendimientos decrecientes claramente más marcados en fuerza que en hipertrofia | 🟡 Evidencia moderada | Pelland et al. 2025/2026 (67 estudios, n=2058) |
| Principiante (ACSM): 1-3 series por ejercicio | 🟢 Consenso fuerte | ACSM/Ratamess et al. 2009 |
| Población mayor (orientativo, no extrapolable sin matices a adulto joven/medio): 2-3 series por ejercicio, 1-2 ejercicios multiarticulares por grupo muscular mayor | 🟢 Consenso fuerte (para su población) | Fragala et al. 2019 (NSCA, específico de personas mayores) |

**Rangos operativos propuestos para IvanGym** (traducción práctica de lo anterior, no un umbral
único de ningún estudio):

- Principiante: **6-10 series efectivas/semana/músculo**.
- Intermedio: **10-16 series efectivas/semana/músculo**, pudiendo llegar a 20 en músculos
  rezagados sin señales de fatiga excesiva.
- Por encima de ~20-22 series/semana/músculo la evidencia de beneficio adicional es escasa y el
  riesgo de fatiga/interferencia con la recuperación aumenta (🟠 heurística basada en el patrón de
  rendimientos decrecientes de Pelland et al. 2025/2026, no un umbral exacto publicado).

**Contabilización de series de músculos secundarios:** Pelland et al. (2025/2026) comprobaron que
clasificar las series como "directas" (peso 1,0), "fraccionales" (peso 0,5) o "indirectas" (peso
0) según la especificidad del ejercicio para el músculo evaluado ofrecía el mejor ajuste
estadístico del conjunto de modelos probados. Esto respalda directamente la regla operativa de
IvanGym de contar las series donde el músculo es **secundario** como **0,5 series efectivas**, y
las series donde es **primario** como **1,0** (🟡 evidencia moderada, metodología validada
estadísticamente en ese metaanálisis, aunque no es una "regla oficial" universal).

### 2.3 Intensidad/carga y rango de repeticiones

| Recomendación | Nivel | Fuente |
|---|---|---|
| Hipertrofia: zona de referencia 6-12RM (60-80 % 1RM aprox.) | 🟢 Consenso fuerte | ACSM/Ratamess et al. 2009 |
| Fuerza máxima: cargas ≥85 % 1RM (≤6RM) | 🟢 Consenso fuerte | ACSM/Ratamess et al. 2009 |
| Resistencia muscular: cargas ≤67 % 1RM (>15 repeticiones) | 🟢 Consenso fuerte | ACSM/Ratamess et al. 2009 |
| Cargas bajas (≤60 % 1RM) y cargas altas (>60 % 1RM) producen ganancias de hipertrofia equivalentes si ambas se llevan cerca del fallo; las cargas altas son superiores para 1RM dinámico; sin diferencia en fuerza isométrica | 🟡 Evidencia moderada | Schoenfeld, Grgic, Ogborn, Krieger 2017 |
| Para maximizar fuerza, la carga alta (>80 % 1RM) fue la variable más determinante en el metaanálisis de red | 🟡 Evidencia moderada | Currier et al. 2023 |
| Para hipertrofia, todas las combinaciones de carga/volumen/frecuencia analizadas produjeron ganancias comparables, sin un "ganador" claro | 🟡 Evidencia moderada | Currier et al. 2023 |

> **Nota de verificación:** no se encontró en los abstracts revisados un umbral explícito de
> "~30 % de 1RM" como límite mínimo para la equivalencia hipertrófica; el metaanálisis de
> Schoenfeld et al. 2017 compara concretamente ≤60 % vs. >60 % de 1RM, ambos con series al fallo.

**Lectura para IvanGym:** el rango **10-15 repeticiones** que usan las rutinas actuales cae en la
transición entre la zona de hipertrofia clásica (6-12RM) y la de resistencia muscular, y
corresponde aproximadamente a cargas del 60-70 % de 1RM. Esto es coherente con el hallazgo de que,
cerca del fallo, cargas moderadas-bajas consiguen hipertrofia equivalente a cargas más altas, y
resulta especialmente práctico en máquinas (mayor seguridad para principiantes/intermedios sin
necesidad de spotter). Para quienes prioricen más la ganancia de fuerza máxima, la evidencia
apoyaría añadir fases o ejercicios con rangos más bajos (6-10 reps, cargas más altas).

### 2.4 Proximidad al fallo (RIR)

| Recomendación | Nivel | Fuente |
|---|---|---|
| Escala RIR-RPE: RPE 10 = 0 repeticiones en reserva (fallo); RPE 9 = 1 RIR; RPE 8 = 2 RIR; RPE 7 = 3 RIR; RPE 6 = 4+ RIR | 🟡 Evidencia moderada (tabla ampliamente citada; no confirmada letra por letra desde el abstract, requeriría texto completo) | Helms, Cronin, Storey, Zourdos 2016 |
| La escala basada en RIR tiene validez razonable: fuerte correlación inversa entre velocidad de la barra y RPE autoinformado (r = -0,88 en experimentados; r = -0,77 en novatos); los experimentados son más precisos cerca de su 1RM real | 🟡 Evidencia moderada | Zourdos et al. 2016 |
| Entrenar al fallo vs. no al fallo: ventaja pequeña/trivial para hipertrofia (tamaño de efecto 0,19; IC95% 0,00-0,37; p=0,045); sin ventaja significativa cuando se compara solo "fallo muscular momentáneo" frente a no-fallo en el análisis más estricto (ES=0,12; p=0,343) | 🟡 Evidencia moderada | Refalo, Helms, Trexler, Hamilton, Fyfe 2023 |
| Para fuerza, la relación con el RIR es prácticamente nula (los intervalos de confianza de las pendientes incluyen el cero en todos los modelos); para hipertrofia, cuanto más cerca del fallo, mayor crecimiento muscular (pendientes negativas, IC que excluyen el cero) | 🟡 Evidencia moderada | Robinson, Pelland et al. 2024 |

**Lectura para IvanGym:** la valoración subjetiva de la app ('hard' / 'ok' / 'easy') se puede
mapear de forma razonable sobre la escala RIR así:

- `hard` (no llegué o perdí técnica) ≈ **RIR 0** (fallo muscular o técnico).
- `ok` (llegué apurado) ≈ **RIR 1-2**.
- `easy` (me sobraban 2+ reps) ≈ **RIR ≥3**.

Dado que entrenar sistemáticamente al fallo absoluto no aporta ventajas claras y consistentes
(Refalo et al. 2023) y que el RIR apenas influye en la ganancia de fuerza (Robinson et al. 2024),
lo razonable es que la mayoría de series terminen en `ok` (RIR 1-2) y reservar `hard` (RIR 0) para,
como mucho, la última serie de un ejercicio y no en todas las sesiones, equilibrando estímulo y
fatiga/recuperación.

### 2.5 Descanso entre series y entre ejercicios

| Recomendación | Nivel | Fuente |
|---|---|---|
| Fuerza máxima (cargas pesadas): 3-5 minutos entre series | 🟢 Consenso fuerte | ACSM/Ratamess et al. 2009 |
| Hipertrofia: 1-2 minutos entre series | 🟢 Consenso fuerte | ACSM/Ratamess et al. 2009 |
| Resistencia muscular: <90 s (hasta 30 s) | 🟢 Consenso fuerte | ACSM/Ratamess et al. 2009 |
| 3 minutos de descanso produjo mayores ganancias de fuerza (1RM en sentadilla y press banca) y de grosor muscular (cuádriceps) que 1 minuto, en hombres entrenados, en 8 semanas | 🟡 Evidencia moderada (un ECA) | Schoenfeld et al. 2016 (JSCR) |
| En sujetos entrenados en fuerza se necesitan descansos >2 minutos para maximizar ganancias de fuerza; en sujetos no entrenados, 60-120 s son suficientes | 🟡 Evidencia moderada | Grgic, Schoenfeld, Skrepnik, Davies, Mikulic 2018 (revisión sistemática, 23 estudios) |

> **No verificado:** no se localizó ningún estudio de "Singer et al. 2024" sobre intervalos de
> descanso en PubMed ni en los repositorios de preprints accesibles; no se incluye ninguna cifra
> atribuida a esa fuente.

**Lectura para IvanGym:** el consejo actual de la app (1-2 minutos) es adecuado para el rango de
10-15 repeticiones con objetivo de hipertrofia/composición corporal. Para ejercicios
multiarticulares pesados (prensa, zancadas, press militar, belt squat) conviene tender a la parte
alta de ese rango (2 min) o incluso 2-3 min si el usuario progresa hacia cargas más altas o rangos
de repeticiones más bajos; para monoarticulares (curl bíceps, extensión tríceps, elevaciones
laterales) 60-90 s es razonable.

### 2.6 Selección y orden de ejercicios

| Recomendación | Nivel | Fuente |
|---|---|---|
| Secuenciar grupos musculares grandes antes que pequeños y ejercicios multiarticulares antes que monoarticulares dentro de la sesión | 🟢 Consenso fuerte | ACSM/Ratamess et al. 2009 |
| El ejercicio prioritario para los objetivos del programa debe colocarse al principio de la sesión, sea multiarticular o monoarticular, de grupo muscular grande o pequeño: en el estudio, el volumen muscular de tríceps aumentó más cuando ese ejercicio se hizo primero, mientras que el de bíceps no mostró diferencia según el orden | 🟡 Evidencia moderada (un ECA, 12 semanas) | Spineti, de Salles, Rhea, Lavigne, Matta, Miranda, Fernandes, Simão 2010 |
| Trabajar todos los grandes grupos musculares (cobertura muscular) como mínimo 2-3 días/semana | 🟢 Consenso fuerte | Garber et al. 2011; OMS 2020 |

**Lectura para IvanGym:** la recomendación operativa combinada es: (1) mantener el principio
general de "grande antes que pequeño, multiarticular antes que monoarticular" como orden por
defecto dentro de cada rutina (ya reflejado en los ejemplos de rutina de la app, p. ej. jalón o
prensa antes que curl de bíceps o extensión de tríceps); y (2) cuando se detecte un músculo
rezagado en volumen o progreso, adelantar su ejercicio principal al inicio de la sesión en lugar
de dejarlo para el final, siguiendo el hallazgo de Spineti/Simão et al. (2010). El equilibrio
empuje/tracción de tren superior y la cobertura de patrones de movimiento (sentadilla, bisagra de
cadera, empuje horizontal/vertical, tracción horizontal/vertical, core) no tienen un metaanálisis
específico de "ratio óptimo", pero son coherentes con el principio general de cobertura muscular
completa de Garber et al. (2011) y con la prevención de descompensaciones (ver también NICE NG59
sobre mantenerse activo de forma equilibrada, sección 2.9 y 4). Se trata por tanto de una
**heurística razonable (🟠)**, no de un hallazgo cuantitativo directo.

### 2.7 Tempo y rango de movimiento (ROM)

| Recomendación | Nivel | Fuente |
|---|---|---|
| El rango de movimiento completo produce mayor fuerza (tamaño de efecto ES=0,56; p=0,004) e hipertrofia de tren inferior (ES=0,88; p=0,027) que el rango parcial; no hay diferencia significativa en arquitectura muscular (grosor, ángulo de pennación, longitud fascicular) entre ROM completo y parcial | 🟡 Evidencia moderada (16 estudios) | Pallarés, Hernández-Belmonte, Martínez-Cava, Vetrovsky, Steffl, Courel-Ibáñez 2021 |
| Entrenar en posiciones de longitud muscular larga podría producir mayor crecimiento longitudinal del músculo que entrenar en longitud corta, pero la evidencia es mixta y limitada (8 estudios, n=120) | 🟠 Heurística razonable / evidencia limitada | Wolf, Korakakis, Roberts, Plotkin, Franchi, Contreras, Henselmans, Larsen, Schoenfeld 2025 |

> **Aclaración sobre fuentes solicitadas:** no se localizó un estudio "Wolf et al. 2023" sobre
> "rango de movimiento parcial vs. completo" con ese título exacto. El hallazgo más próximo por
> autoría y temática es Wolf et al. 2025, centrado específicamente en el concepto de
> entrenamiento en longitudes musculares largas vs. cortas (un concepto relacionado pero distinto
> del contraste ROM completo/parcial). Se reporta aquí con esa salvedad explícita.

**Lectura para IvanGym:** dado que la mayoría de ejercicios de las rutinas son en máquina
(jalón, prensa, extensión de cuádriceps, extensión de tríceps en polea, press de pecho en
máquina, etc.), es razonable que la app recomiende de forma explícita **completar el recorrido
articular que permite cada máquina** (sin bloquear ni cortar el movimiento) como buena práctica
por defecto, en línea con el beneficio de fuerza e hipertrofia del ROM completo. No se dispone de
datos de tempo (velocidad de ejecución) específicos y cuantificados en los metaanálisis
revisados; el control de la fase excéntrica (evitar dejar caer el peso) es una práctica extendida
y razonable (🟠), coherente con la seguridad articular, pero no se ha encontrado en esta
investigación un metaanálisis que cuantifique un tempo óptimo en segundos.

### 2.8 Progresión de carga

| Recomendación | Nivel | Fuente |
|---|---|---|
| Incrementar la carga entre un 2 % y un 10 % cuando el sujeto puede completar el número de repeticiones objetivo con 1-2 repeticiones de margen adicionales en el entrenamiento previo (sobrecarga progresiva) | 🟢 Consenso fuerte | ACSM/Ratamess et al. 2009 |
| El volumen semanal predice de forma consistente mayores ganancias de fuerza e hipertrofia, con rendimientos decrecientes | 🟡 Evidencia moderada | Pelland et al. 2025/2026 |
| La "doble progresión" (primero aumentar repeticiones dentro de un rango objetivo hasta el límite superior, después aumentar carga y volver al límite inferior del rango) es una técnica extendida en la práctica de fuerza y conceptualmente coherente con el principio de sobrecarga progresiva de ACSM, aunque no se ha identificado un metaanálisis específico que la valide como técnica superior a otras formas de progresión de carga | 🟠 Heurística razonable | Coherente con ACSM/Ratamess et al. 2009; sin metaanálisis específico localizado |

**Lectura para IvanGym:** esta es la variable más directamente traducible a reglas automáticas
porque la app ya registra kg, repeticiones y la valoración subjetiva por serie/ejercicio. La
regla de doble progresión (ver sección 3.1) usa precisamente esos tres campos: solo se sube el
peso (+2,5 kg, o el step del ejercicio) cuando se han completado todas las series en el límite
superior del rango de repeticiones (15) con una valoración `easy` o `ok`, siguiendo el espíritu
del incremento del 2-10 % de ACSM (un salto de 2,5 kg sobre cargas típicas de máquina de 50-100 kg
está habitualmente dentro de ese rango porcentual; en cargas más bajas, como mancuernas de 8-15
kg, el step propio del material puede representar un porcentaje mayor, por lo que conviene
permitir un step configurable por ejercicio, tal como ya contempla la app).

### 2.9 Periodización y descargas (deload)

| Recomendación | Nivel | Fuente |
|---|---|---|
| El entrenamiento periodizado (variación planificada de volumen/intensidad) produce mayor ganancia de fuerza (1RM) que el no periodizado: ES=0,43 (IC95% 0,27-0,58; p<0,001) en 81 tamaños de efecto de 18 estudios; el modelo ondulante fue el más favorable; las mejoras fueron mayores en sujetos no entrenados | 🟡 Evidencia moderada | Williams, Tolusso, Fedewa, Esco 2017 |
| Con volumen equiparado, el entrenamiento periodizado mejora el 1RM frente al no periodizado (ES=0,31; IC95% 0,04-0,57; p=0,02), sin diferencia en hipertrofia (ES=0,13; p=0,27); la periodización ondulante supera a la lineal en 1RM (ES=0,31; p=0,04), con ventaja mayor en sujetos ya entrenados (ES=0,61; p=0,05) que en no entrenados (sin diferencia significativa) | 🟡 Evidencia moderada | Moesgaard, Beck, Christiansen, Aagaard, Lundbye-Jensen 2022 |
| Reducir volumen y frecuencia de entrenamiento en semanas concretas (deload) no perjudicó las ganancias de grosor muscular ni de fuerza (10RM) en un diseño intra-sujeto de 8 semanas con hombres no entrenados, sin interacción significativa tiempo×condición | 🟡 Evidencia moderada (un ECA, sujetos no entrenados, corto plazo) | Pancar, Ilhan, Darendeli, Karaca, Ikidag, Tasdogan, Ulema, Alkhamees, Al-Mhanna, Batrakoulis 2026 |
| El deload es una práctica común y extendida entre deportistas de fuerza/físico competitivos (encuesta descriptiva, n=246) | 🟠 Heurística razonable (evidencia descriptiva, no causal) | Rogerson, Nolan, Androulakis Korakakis, Immonen, Wolf, Bell 2024 |

> **Aclaración importante sobre "Moesgaard et al. 2022" y "deload":** no existe, hasta donde se ha
> podido verificar, ningún artículo de Moesgaard et al. (2022 o cualquier otro año) dedicado
> específicamente a semanas de descarga; el estudio real de Moesgaard et al. (2022) trata sobre
> **periodización general** con volumen equiparado. Se reporta aquí junto con las fuentes más
> próximas sobre deload que sí se han podido verificar (Pancar et al. 2026 y Rogerson et al.
> 2024), dejando constancia explícita de que ninguna de las dos demuestra que una descarga
> "rompa" un estancamiento ya instaurado: solo muestran que reducir volumen/frecuencia
> puntualmente no perjudica el progreso, y que la práctica es habitual entre deportistas
> experimentados.

**Lectura para IvanGym:** para el perfil principiante-intermedio de la app, la periodización no
necesita ser explícita/manual: la "doble progresión" dentro de un rango de repeticiones ya aporta
variación natural de intensidad. Donde sí es razonable una intervención activa es en la
**descarga periódica** (reducir volumen o carga durante una semana cada varias semanas) como
estrategia preventiva de fatiga acumulada, apoyándose en que la evidencia disponible indica que no
perjudica el progreso (Pancar et al. 2026) y es práctica extendida entre deportistas (Rogerson et
al. 2024), aunque se trata de una **heurística razonable (🟠)** más que de una regla con fuerte
respaldo causal específico para "romper" estancamientos.

### 2.10 Calentamiento

| Recomendación | Nivel | Fuente |
|---|---|---|
| El calentamiento mejoró el rendimiento en el 79 % de los criterios de medida examinados en 32 estudios de alta calidad metodológica (escala PEDro media 7,6/10); poca evidencia de que sea perjudicial | 🟡 Evidencia moderada | Fradkin, Zazryn, Smoliga 2010 |
| Existen mecanismos fisiológicos bien descritos que explican el beneficio del calentamiento (temperatura muscular, conducción nerviosa, potenciación post-activación) | 🟡 Evidencia moderada (revisiones mecanicistas) | Bishop 2003; McGowan, Pyne, Thompson, Rattray 2015 |
| Secuenciar dentro de la sesión ejercicios de mayor a menor intensidad relativa (relacionado con el concepto de series de aproximación) | 🟢 Consenso fuerte (cualitativo) | ACSM/Ratamess et al. 2009 |

> **No verificado:** no se ha localizado, en los documentos primarios revisados, una cifra
> concreta y consensuada de "minutos recomendados de calentamiento" ni un protocolo exacto de
> series de aproximación (porcentajes de carga) respaldado por una cita verificable con DOI. Las
> cifras de "5-10 minutos" que usa actualmente la app son una **práctica extendida y razonable
> (🟠)**, coherente con la evidencia general de que el calentamiento mejora el rendimiento, pero no
> se ha podido confirmar como una recomendación cuantitativa oficial textual de ACSM o NSCA en
> esta investigación.

**Lectura para IvanGym:** mantener el calentamiento general de 5-10 minutos (cardio suave +
movilidad) que ya recomienda la app es razonable, y se puede reforzar con 1-2 series de
aproximación con carga creciente en el primer ejercicio multiarticular de cada rutina antes de las
series "a tope" contabilizadas como series efectivas, especialmente útil para ejercicios como
prensa, zancadas o belt squat.

### 2.11 Combinación con cardio (efecto interferencia y orden)

| Recomendación | Nivel | Fuente |
|---|---|---|
| El entrenamiento concurrente (fuerza + cardio) no mostró, en conjunto, diferencias significativas frente al entrenamiento de fuerza solo en ganancias de fuerza e hipertrofia en el metaanálisis global (21 estudios) | 🟡 Evidencia moderada | Wilson, Marin, Rhea, Wilson, Loenneke, Anderson 2012 |
| Cuando el modo de cardio fue carrera (running), sí se observaron decrementos significativos en ganancias de hipertrofia/fuerza de tren inferior; con cicloergómetro no se observó ese efecto negativo | 🟡 Evidencia moderada | Wilson et al. 2012 |
| Se encontró una correlación negativa entre la frecuencia y duración del entrenamiento de cardio concurrente y la magnitud de las ganancias de fuerza/hipertrofia (a más cardio, menor ganancia) | 🟡 Evidencia moderada | Wilson et al. 2012 |
| La interferencia molecular aguda (señalización AMPK vs. mTOR) descrita en modelos animales/celulares no se traduce de forma clara y consistente en estudios en humanos | 🟡 Evidencia moderada (revisión narrativa) | Fyfe, Bishop, Stepto 2014 |

> **No verificado cuantitativamente:** no se ha encontrado, en los documentos primarios
> revisados, un dato cuantitativo específico sobre si separar las sesiones de fuerza y cardio en
> distintos momentos del día, o hacer primero la fuerza y después el cardio en la misma sesión,
> mitiga el efecto interferencia. La recomendación de "cardio de bajo impacto" y de ubicar el
> cardio después de la fuerza (o en sesiones/días separados cuando sea posible) es una
> **heurística razonable (🟠)**, coherente con el hallazgo de que la carrera de alto volumen
> interfiere más que el cicloergómetro, pero no una cifra ni un orden validado directamente.

**Lectura para IvanGym:** como la app ya registra actividades extra de cardio (duración y MET),
la recomendación operativa es: priorizar actividades de bajo impacto (caminar, bicicleta elíptica)
sobre carrera de alto volumen cuando el objetivo principal sea la ganancia de fuerza/hipertrofia,
y evitar que el volumen semanal de cardio de alta duración/frecuencia crezca de forma descontrolada
en paralelo a las fases de mayor volumen de fuerza, sin que ello implique eliminar el cardio (que
sigue siendo necesario para la salud cardiovascular, ver 2.12).

### 2.12 Recuperación: sueño y proteína

| Recomendación | Nivel | Fuente |
|---|---|---|
| Dormir ≥7 horas por noche de forma regular en adultos, para una salud óptima; dormir <7h se asocia de forma consistente a peores resultados de salud | 🟢 Consenso fuerte (consenso de 12 sociedades científicas) | Consenso AASM/SRS, Watson, Badr, Belenky et al. 2015 |
| Más de 9 horas por noche puede ser apropiado en ciertos grupos (jóvenes, enfermedad, recuperación de déficit de sueño) pero no se recomienda de forma generalizada | 🟢 Consenso fuerte | Consenso AASM/SRS 2015 |
| La ingesta de proteína por encima de ~1,62 g/kg/día no produjo ganancias adicionales de masa libre de grasa inducidas por entrenamiento de fuerza, en un metaanálisis de dosis-respuesta de 49 estudios (1863 participantes) | 🟢 Consenso fuerte (metaanálisis de referencia en el área) | Morton, Murphy, McKellar, Schoenfeld, Henselmans, Helms, Aragon, Devries, Banfield, Krieger, Phillips 2018 |

**Lectura para IvanGym:** aunque la app no registra directamente proteína ni sueño, el informe
puede sustentar un consejo informativo breve en la interfaz (no una regla automática de ajuste de
carga): recomendar de forma general **~1,6 g de proteína/kg de peso corporal/día** como referencia
práctica razonable, y **dormir al menos 7 horas** la mayoría de las noches, como condiciones de
base para que el estímulo de entrenamiento se traduzca en progreso. No se recomienda que la app
intente ajustar cargas en función del sueño o la proteína porque no registra esos datos.

### 2.13 Adherencia

| Recomendación | Nivel | Fuente |
|---|---|---|
| La motivación autónoma/intrínseca (hacer ejercicio porque se disfruta o se valora, no solo por presión externa) predice mejor la adherencia a largo plazo a programas de actividad física | 🟡 Evidencia moderada (revisión sistemática de 66 estudios sobre teoría de la autodeterminación) | Teixeira, Carraça, Markland, Silva, Ryan 2012 |

> **Matiz importante:** Teixeira et al. (2012) es una revisión sobre actividad física y pérdida de
> peso en general, **no específica de entrenamiento de fuerza**. Su aplicación a IvanGym es una
> **extrapolación razonable (🟠)**, no un hallazgo literal sobre adherencia a rutinas de fuerza en
> gimnasio.

**Lectura para IvanGym:** dado que la app ya registra el histórico completo de sesiones, puede
fomentar la adherencia mostrando progreso tangible (rachas de sesiones, mejoras de carga/reps a lo
largo del tiempo) y facilitando la elección/variedad de ejercicios dentro de patrones equivalentes,
en lugar de imponer rigidez total, en línea con el principio general de que la motivación autónoma
favorece la continuidad (aplicado aquí de forma heurística).

### 2.14 Estancamiento (plateau)

> **Hueco de evidencia confirmado:** no se ha localizado en la literatura revisada una definición
> operacional validada de "estancamiento" (p. ej., "X sesiones sin progreso en carga o
> repeticiones constituye un plateau"). El concepto se usa de forma extendida en la práctica del
> entrenamiento de fuerza, pero no se ha encontrado un estudio que lo defina y valide
> cuantitativamente como tal. Las estrategias con algún respaldo indirecto son la periodización
> ondulante (Moesgaard et al. 2022, sobre periodización general, no específicamente sobre
> "romper" estancamientos) y el deload (Pancar et al. 2026, Rogerson et al. 2024, ver 2.9).

**Lectura para IvanGym:** la regla de detección de estancamiento que se propone en la sección 3
(p. ej., "N sesiones consecutivas sin incremento de carga ni de repeticiones en un ejercicio") es,
por tanto, una **heurística propia del motor de recomendaciones (🟠)**, razonable y coherente con
la lógica de sobrecarga progresiva de ACSM (2009), pero sin un estudio específico que valide el
umbral numérico exacto. Debe documentarse como tal dentro de la propia app si en el futuro se
expone al usuario.

## 3. Reglas operativas para el motor de recomendaciones de la app

> Esta sección traduce la evidencia de la sección 2 en reglas concretas tipo si/entonces,
> expresadas sobre los campos que la app ya registra: `kg`, `reps`, `done` por serie; `feel`
> (`hard`/`ok`/`easy`) por ejercicio; `fecha`; `rutina`; `músculos primarios/secundarios` por
> ejercicio; actividades extra de cardio (`duración`, `MET`). Cada regla indica su respaldo y si
> es consenso fuerte, evidencia moderada o heurística razonable (usando los mismos símbolos de la
> sección 2).

### 3.1 Ajuste de carga según `feel` y repeticiones logradas (doble progresión)

Se aplica por ejercicio, comparando la sesión más reciente completada (`done=true` en todas las
series) frente al rango de repeticiones objetivo de la rutina (en el caso actual de IvanGym,
10-15 reps) y el step de peso configurado para ese ejercicio (por defecto 2,5 kg).

| Condición (sobre la última sesión del ejercicio) | Acción propuesta | Respaldo |
|---|---|---|
| Todas las series `done=true`, reps = límite superior del rango (15) en todas las series, y `feel` = `easy` | Subir carga: `kg_nuevo = kg_actual + step` (p. ej. +2,5 kg); si se sube, bajar el objetivo de reps al límite inferior del rango (10) para la siguiente sesión | 🟢 ACSM 2009 (sobrecarga progresiva, +2-10 %); 🟠 patrón de doble progresión |
| Todas las series `done=true`, reps = límite superior del rango (15) en todas las series, y `feel` = `ok` | Subir carga igual que el caso anterior (se valora que, aunque fue exigente, se completó el techo del rango) | 🟢 ACSM 2009; 🟠 doble progresión |
| Todas las series `done=true`, reps dentro del rango pero por debajo del límite superior (10-14), `feel` = `ok` o `easy` | Mantener la misma carga; el objetivo de la siguiente sesión es aumentar reps hasta llegar a 15 antes de subir peso | 🟠 doble progresión (coherente con ACSM 2009) |
| Alguna serie `done=false` (no completada) o reps por debajo del mínimo del rango (<10), o `feel` = `hard` de forma sostenida (ver regla de 2 sesiones consecutivas) | Mantener la carga en la siguiente sesión; no subir peso | 🟠 heurística razonable |
| `feel` = `hard` en 2 sesiones consecutivas del mismo ejercicio | Bajar la carga un 5-10 % en la siguiente sesión | 🟠 heurística razonable (sin metaanálisis específico, pero coherente con el principio de ajustar la carga a la capacidad real de recuperación) |

### 3.2 Cálculo de volumen semanal por músculo y alertas de déficit/exceso

Para cada músculo, se suman las series efectivas de los últimos 7 días naturales, ponderando cada
serie completada (`done=true`) según si el músculo es primario (peso 1,0) o secundario (peso 0,5)
en ese ejercicio.

```
volumen_semanal(músculo) = Σ series_done(ejercicio) × peso_músculo(ejercicio, músculo)
  donde peso_músculo = 1,0 si es músculo primario del ejercicio
                       0,5 si es músculo secundario del ejercicio
```

| Condición | Alerta/acción | Respaldo |
|---|---|---|
| `volumen_semanal(músculo) < 4` series efectivas en los últimos 7 días | Alerta de **déficit de volumen**: sugerir añadir un ejercicio o serie adicional que incluya ese músculo | 🟡 evidencia moderada (zona inferior del rango dosis-respuesta de Schoenfeld et al. 2017; umbral de 4 fijado como heurística operativa, no un valor publicado literal) |
| `4 ≤ volumen_semanal(músculo) < 6` | Zona límite para principiante; sin alerta pero candidato a prioridad en la próxima rutina | 🟢 ACSM 2009 (1-3 series/ejercicio); 🟡 Schoenfeld et al. 2017 |
| `6 ≤ volumen_semanal(músculo) ≤ 16` | Rango adecuado principiante/intermedio; sin alerta | 🟡 Schoenfeld et al. 2017; 🟡 Pelland et al. 2025/2026 |
| `16 < volumen_semanal(músculo) ≤ 22` | Rango alto, aceptable en intermedio si no hay `feel=hard` repetido ni estancamiento; vigilar fatiga | 🟡 Pelland et al. 2025/2026 (rendimientos decrecientes) |
| `volumen_semanal(músculo) > 22` | Alerta de **posible exceso/fatiga**, especialmente si coincide con `feel=hard` repetido en ejercicios de ese músculo: sugerir reducir series o espaciar más la frecuencia | 🟠 heurística razonable (umbral exacto no publicado; basado en el patrón de rendimientos decrecientes) |

### 3.3 Frecuencia mínima por músculo y equilibrio empuje/tracción, tren superior/inferior

| Condición | Alerta/acción | Respaldo |
|---|---|---|
| Un músculo mayor (pecho, espalda, cuádriceps, isquiosurales, glúteos, hombro, core) recibe 0 o 1 sesión efectiva (con al menos 1 serie completada) en los últimos 7 días | Alerta de **frecuencia insuficiente**: sugerir incluirlo en la próxima rutina/sesión | 🟢 Garber et al. 2011; OMS 2020 (≥2 días/semana, todos los grandes grupos musculares) |
| Un músculo mayor recibe ≥2 sesiones efectivas en los últimos 7 días | Sin alerta de frecuencia | 🟢 Garber et al. 2011; 🟡 Currier et al. 2023 |
| Ratio `series_tracción_tren_superior : series_empuje_tren_superior` en los últimos 14 días < 0,8 | Alerta de **desequilibrio empuje/tracción**: sugerir priorizar ejercicios de tracción (remo, jalón) en próximas sesiones | 🟠 heurística razonable (sin metaanálisis de ratio óptimo; coherente con cobertura muscular completa de Garber et al. 2011) |
| Ratio `series_tracción_tren_superior : series_empuje_tren_superior` entre 0,8 y 1,5 | Rango considerado equilibrado; sin alerta | 🟠 heurística razonable |
| Ratio `series_tren_inferior : series_tren_superior` en los últimos 14 días < 0,5 | Alerta de **déficit de tren inferior**: sugerir reforzar sentadilla/prensa/zancadas/belt squat | 🟠 heurística razonable (cobertura muscular completa, Garber et al. 2011) |

### 3.4 Criterios para proponer una rutina nueva

| Condición | Acción propuesta | Qué mantener | Qué cambiar | Respaldo |
|---|---|---|---|---|
| Han pasado 6-8 semanas desde la última renovación de alguna de las 3 rutinas, sin alertas de déficit/exceso de volumen activas | Proponer una variante de la rutina | Estructura general (cuerpo completo, ~6 ejercicios), patrones de movimiento cubiertos, frecuencia semanal, rango de reps predominante (10-15) | 1-2 ejercicios por variantes del mismo patrón/músculo (p. ej. cambiar prensa por sentadilla en máquina, o remo por jalón con agarre distinto); reordenar para priorizar el músculo con menor volumen relativo acumulado | 🟠 heurística razonable (periodicidad de 6-8 semanas no corresponde a un umbral publicado específico; el principio de variación se apoya en 🟡 Williams et al. 2017 y 🟡 Moesgaard et al. 2022 sobre beneficios de variar el estímulo) |
| Se detecta estancamiento confirmado (ver 3.5) en 2 o más ejercicios de una misma rutina | Proponer rutina nueva antes de las 6-8 semanas, con cambio de variante de ejercicio y/o rango de reps en los ejercicios afectados | Resto de la estructura | Ejercicios/rango de reps de los músculos estancados; considerar una semana de descarga previa | 🟠 heurística razonable; 🟡 Pancar et al. 2026 y 🟡 Rogerson et al. 2024 para la descarga |
| El usuario lleva >12 semanas con la misma rutina sin ninguna renovación | Forzar sugerencia de variante, aunque no haya alertas | — | Al menos 1-2 ejercicios | 🟠 heurística razonable (ninguna fuente fija un máximo de semanas; se basa en el principio general de variación periódica) |
| Ya toca proponer una variante (filas anteriores) y hay alerta de desequilibrio empuje/tracción (3.3, ratio < 0,8) | Uno de los 1-2 cambios pasa un ejercicio de empuje cuyo patrón ya cubre otro ejercicio de las rutinas activas (p. ej. un segundo ejercicio de tríceps) a uno de tracción, priorizando patrones de tracción no cubiertos (p. ej. hombro posterior). Se aplica en una sola rutina (la de más ejercicios de empuje respecto a tracción) | Todos los patrones de empuje siguen cubiertos | Un ejercicio de empuje repetido por uno de tracción | 🟠 heurística razonable (mismo respaldo que el ratio de 3.3) |

### 3.5 Detección de estancamiento

> Como se señala en 2.14, no existe una definición validada de "estancamiento" en la literatura
> revisada: la regla siguiente es una **heurística propia del motor de recomendaciones (🟠)**,
> coherente con el principio de sobrecarga progresiva (🟢 ACSM 2009) pero sin validación
> cuantitativa directa.

| Condición | Acción propuesta | Respaldo |
|---|---|---|
| ≥4 sesiones consecutivas del mismo ejercicio sin incremento de `kg` ni de `reps` máximas logradas (y sin que el usuario haya bajado el rango objetivo) | Marcar el ejercicio como **estancado** | 🟠 heurística propia |
| La última de esas sesiones se valoró `feel=easy` (sobraban 2+ reps) | **No** marcarlo como estancado: falta carga, no capacidad de progresar; la regla de progresión ya propone subir el peso | 🟠 heurística propia |
| Ejercicio marcado como estancado | Sugerir, por este orden: (1) cambiar a una variante del mismo patrón/músculo; (2) cambiar el rango de repeticiones objetivo (p. ej. bajar a 6-10 reps con más carga, o subir a 15-20 con menos carga); (3) si coincide con `feel=hard` repetido en varios ejercicios, proponer una semana de descarga (reducir volumen o carga un 10-20 % durante 1 semana) antes de reintentar progresar | 🟡 Pallarés et al. 2021 (variar demanda); 🟡 Schoenfeld et al. 2017 (equivalencia de cargas); 🟡 Pancar et al. 2026 (descarga no perjudica) |

### 3.6 Detección de inactividad y regreso tras un parón

| Condición | Acción propuesta | Respaldo |
|---|---|---|
| Han pasado ≥14 días naturales desde la última sesión registrada | Al reanudar, reducir la carga de partida de cada ejercicio un 10-20 % respecto a la última carga registrada, y plantear el límite inferior del rango de repeticiones objetivo | ⚪ **No verificado**: no se ha localizado en esta investigación un estudio que cuantifique la pérdida de fuerza/rendimiento en función de los días exactos de desentrenamiento en población principiante-intermedio con este perfil. El umbral de 14 días y el porcentaje de reducción (10-20 %) son una **heurística propia**, razonable por prudencia (riesgo de agujetas/lesión al retomar con la carga previa) pero sin respaldo cuantitativo directo. Se declara como laguna de evidencia en la sección 5 |
| Han pasado ≥28 días naturales desde la última sesión | Tratar como reinicio: ofrecer de nuevo una fase inicial tipo "principiante" (volumen en la zona 6-10 series/semana/músculo, progresión más conservadora) durante 1-2 semanas antes de retomar el volumen previo | ⚪ No verificado (mismo motivo que la regla anterior; umbral y porcentaje fijados por prudencia, no por evidencia específica) |

## 4. Seguridad y señales de alarma

> Esta sección no constituye consejo médico ni diagnóstico. Su objetivo es recoger, de forma
> general, cuándo la evidencia y el consenso clínico aconsejan precaución o consultar a un
> profesional sanitario antes de continuar con normalidad el entrenamiento de fuerza.

- **Dolor agudo, súbito o que aumenta durante el ejercicio** (especialmente en zona lumbar,
  rodilla u hombro): detener el ejercicio que lo provoca. Las guías de práctica clínica sobre
  dolor lumbar recomiendan, en general, **mantenerse activo y evitar el reposo prolongado en
  cama**, y consideran el ejercicio (incluido el ejercicio de fuerza supervisado) como parte del
  manejo del dolor lumbar persistente, pero no sustituyen la valoración individual de un
  profesional sanitario cuando el dolor es intenso, irradia, o se acompaña de síntomas
  neurológicos (🟢 NICE NG59, guía de práctica clínica sobre dolor lumbar y ciática).
- **Pérdida de técnica bajo carga** (la razón por la que la app marca una serie como `hard` puede
  ser "perder técnica", no solo "no llegar"): si esto ocurre de forma repetida en un ejercicio,
  la recomendación es **bajar la carga o el rango de repeticiones**, no insistir con la misma
  carga, independientemente de si eso retrasa la progresión (🟠 heurística de seguridad razonable,
  coherente con los principios generales de prescripción de ACSM 2009).
- **Mareo, dolor torácico, falta de aire desproporcionada o palpitaciones** durante el esfuerzo:
  detener el ejercicio inmediatamente y buscar valoración médica; estos síntomas están fuera del
  alcance de las reglas de ajuste de carga de esta investigación.
- **Síntomas articulares persistentes** (hinchazón, bloqueo articular, dolor que persiste más de
  unos días tras el ejercicio): se recomienda reducir temporalmente el volumen/carga sobre esa
  articulación y consultar a un profesional si no mejora, en lugar de que el sistema de
  recomendaciones automatice un "descanso completo" sin supervisión.
- **Mantenerse activo en general es más seguro que el reposo prolongado** para la salud
  musculoesquelética en población general sana, según el consenso de las guías revisadas (🟢 OMS
  2020; 🟢 NICE NG59 para dolor lumbar específicamente), pero esto no exime de valorar
  individualmente cualquier dolor agudo o señal de alarma.
- **Población con condiciones médicas preexistentes** (cardiovasculares, metabólicas,
  musculoesqueléticas no resueltas, embarazo, etc.): esta investigación se centra en el adulto
  sano; estas poblaciones requieren adaptaciones específicas que quedan fuera del alcance de este
  documento y de las reglas de la app, y deben consultar a un profesional antes de iniciar o
  modificar un programa de fuerza.
- La app, al ser una PWA sin supervisión profesional, **no debe presentar sus reglas de ajuste de
  carga como sustituto de la valoración de un fisioterapeuta, médico o entrenador cualificado**
  cuando aparezcan señales de alarma; su función es únicamente orientar el ajuste rutinario de
  carga/volumen en ausencia de dolor o síntomas de alarma.

## 5. Limitaciones y lagunas de evidencia

Esta sección recoge, de forma centralizada, las fuentes y cifras que el usuario pidió verificar
explícitamente y que **no se han podido confirmar** tal como se describían, además de otras
lagunas relevantes detectadas durante la investigación:

- **Singer et al. 2024 (intervalos de descanso entre series):** no se ha localizado ningún
  artículo con esa autoría y año sobre esta temática en PubMed/Europe PMC. Las recomendaciones de
  descanso entre series de este documento se basan en Schoenfeld et al. (2016) y en la revisión
  sistemática de Grgic et al. (2018).
- **Wolf et al. 2023 (rango de movimiento):** no se ha localizado un artículo con ese año y
  temática exacta. Se ha usado en su lugar Wolf et al. (2025), que trata un concepto relacionado
  pero distinto (entrenamiento en longitudes musculares largas vs. cortas), declarando la
  discrepancia explícitamente en la sección 2.7. El contraste específico "ROM completo vs.
  parcial" está respaldado por Pallarés et al. (2021).
- **Moesgaard et al. 2022 como estudio "de deload":** el artículo real de Moesgaard et al. (2022)
  trata sobre periodización general (comparación periodizado vs. no periodizado, lineal vs.
  ondulante), no sobre semanas de descarga específicamente. Para deload se han usado Pancar et
  al. (2026) y Rogerson et al. (2024), con las limitaciones señaladas en 2.9 (evidencia a corto
  plazo, en sujetos no entrenados en el primer caso, y descriptiva/no causal en el segundo).
- **ACSM's Guidelines for Exercise Testing and Prescription (11ª/12ª ed.):** solo se han podido
  confirmar metadatos editoriales (editor, estructura general); no se ha podido acceder al texto
  completo de los capítulos de prescripción de fuerza para verificar cifras concretas más allá de
  las ya recogidas en el position stand de Ratamess et al. (2009), que sigue vigente como
  referencia oficial citable de ACSM para este documento.
- **NSCA Essentials of Strength Training and Conditioning (manual, Haff & Triplett):** igualmente,
  solo se han podido confirmar datos editoriales a través de citas de terceros; no se ha
  verificado contenido interno específico (tablas, rangos) directamente contra el texto original
  en esta investigación.
- **Tabla exacta RIR-RPE de Helms et al. (2016):** la correspondencia RPE10=RIR0 … RPE6=RIR4+ es
  ampliamente citada en la literatura y la práctica, pero no se ha podido confirmar palabra por
  palabra contra el texto completo del artículo original (solo contra el abstract y referencias
  secundarias), por lo que se marca con confianza media en lugar de alta.
- **Minutos exactos de calentamiento:** no se ha encontrado una cifra oficial y verificable con
  DOI de "minutos recomendados de calentamiento" atribuible a ACSM o NSCA. La pauta de 5-10
  minutos que usa la app se presenta como práctica razonable no contradicha por la evidencia
  (Fradkin et al. 2010), pero no como una cifra oficial citable de un organismo concreto.
- **Definición operacional de "estancamiento" (plateau):** no existe, hasta donde se ha podido
  verificar, un estudio que defina y valide cuantitativamente cuántas sesiones sin progreso
  constituyen un estancamiento, ni que demuestre que una descarga "rompe" un estancamiento ya
  instaurado. Las reglas de la sección 3.5 son heurísticas propias.
- **Umbrales de inactividad/desentrenamiento (14 y 28 días) y porcentaje de reducción de carga al
  volver (10-20 %):** no se ha localizado, en el alcance de esta investigación, un estudio que
  cuantifique la pérdida de rendimiento en función de los días exactos sin entrenar en población
  principiante-intermedio sana. Son umbrales propios, fijados por prudencia.
- **Orden fuerza-antes-que-cardio y separación de sesiones para minimizar la interferencia:** la
  evidencia revisada (Wilson et al. 2012) compara modos de cardio (carrera vs. bicicleta) y
  volumen/frecuencia de cardio, pero no aporta datos cuantitativos directos sobre el orden dentro
  de una misma sesión ni sobre separar las sesiones en el tiempo.
- **Ratios óptimos de equilibrio empuje/tracción y tren superior/inferior:** no se ha encontrado
  un metaanálisis que establezca un ratio cuantitativo óptimo entre volumen de tracción y empuje,
  ni entre tren superior e inferior; los rangos propuestos en la sección 3.3 son heurísticos.
- **Extrapolación de poblaciones:** varias fuentes de alta calidad citadas en este documento se
  refieren a poblaciones específicas que no coinciden exactamente con el perfil
  principiante-intermedio sano de IvanGym: Fragala et al. (2019) es específico de personas
  mayores; Teixeira et al. (2012) trata adherencia a la actividad física en general (no al
  entrenamiento de fuerza específicamente); varios estudios de periodización (Williams et al.
  2017; Moesgaard et al. 2022) muestran efectos más marcados en sujetos ya entrenados que en
  principiantes. Estas extrapolaciones se han señalado explícitamente donde corresponde.
- **Heterogeneidad metodológica:** los metaanálisis de volumen/frecuencia citados combinan
  estudios con duraciones, poblaciones y métodos de medición de hipertrofia muy distintos
  (pliegues cutáneos, ecografía, resonancia magnética), lo que limita la precisión de las cifras
  exactas de dosis-respuesta (p. ej., el 0,37 % por serie de Schoenfeld et al. 2017 es una media
  de regresión con incertidumbre considerable, no una constante biológica exacta).
- **Ausencia de ensayos controlados aleatorizados sobre el propio motor de recomendaciones:**
  este documento traduce evidencia general a reglas operativas para IvanGym, pero ninguna de las
  reglas de la sección 3 ha sido validada específicamente como conjunto (como algoritmo completo)
  en un estudio; son una síntesis razonada, no una intervención ya probada como tal.

## 6. Bibliografía

> Listado alfabético por primer autor. Se indica el DOI y/o PMID verificado cuando se pudo
> confirmar contra la fuente primaria (abstract o documento oficial completo); se marca "solo
> metadatos editoriales" cuando no se pudo acceder al contenido interno verificable.

1. Bishop D. "Warm up I: potential mechanisms and the effects of passive warm up on exercise
   performance". *Sports Medicine*, 2003;33(6):439-454. DOI: 10.2165/00007256-200333060-00005.
2. Bull FC, Al-Ansari SS, Biddle S, et al. "World Health Organization 2020 guidelines on physical
   activity and sedentary behaviour". *British Journal of Sports Medicine*, 2020;54(24):1451-1462.
   DOI: 10.1136/bjsports-2020-102955. PMID: 33239350.
3. Currier BS, Mcleod JC, Banfield L, et al. "Resistance training prescription for muscle strength
   and hypertrophy in healthy adults: a systematic review and Bayesian network meta-analysis".
   *British Journal of Sports Medicine*, 2023;57(18):1211-1220. DOI: 10.1136/bjsports-2023-106807.
   PMID: 37414459.
4. Fradkin AJ, Zazryn TR, Smoliga JM. "Effects of warming-up on physical performance: a
   systematic review with meta-analysis". *Journal of Strength and Conditioning Research*,
   2010;24(1):140-148. DOI: 10.1519/JSC.0b013e3181c643a0. PMID: 19996770.
5. Fragala MS, Cadore EL, Dorgo S, et al. "Resistance Training for Older Adults: Position
   Statement From the National Strength and Conditioning Association". *Journal of Strength and
   Conditioning Research*, 2019;33(8):2019-2052. DOI: 10.1519/JSC.0000000000003230.
   PMID: 31343601.
6. Fyfe JJ, Bishop DJ, Stepto NK. "Interference between concurrent resistance and endurance
   exercise: molecular bases and the role of individual training variables". *Sports Medicine*,
   2014;44(6):743-762. DOI: 10.1007/s40279-014-0162-1. PMID: 24728927.
7. Garber CE, Blissmer B, Deschenes MR, et al. "American College of Sports Medicine position
   stand: Quantity and quality of exercise for developing and maintaining cardiorespiratory,
   musculoskeletal, and neuromotor fitness in apparently healthy adults". *Medicine & Science in
   Sports & Exercise*, 2011;43(7):1334-1359. DOI: 10.1249/MSS.0b013e318213fefb.
   PMID: 21694556.
8. Grgic J, Schoenfeld BJ, Skrepnik M, Davies TB, Mikulic P. "Effects of Rest Interval Duration in
   Resistance Training on Measures of Muscular Strength: A Systematic Review". *Sports Medicine*,
   2018;48(1):137-151. DOI: 10.1007/s40279-017-0788-x. PMID: 28933024.
9. Haff GG, Triplett NT (eds.). *Essentials of Strength Training and Conditioning*, 4th edition.
   National Strength and Conditioning Association / Human Kinetics, 2016. ISBN 978-1-4925-0162-6.
   (Solo metadatos editoriales verificados; contenido interno no verificado en esta
   investigación.)
10. Helms ER, Cronin J, Storey A, Zourdos MC. "Application of the Repetitions in Reserve-Based
    Rating of Perceived Exertion Scale for Resistance Training". *Strength and Conditioning
    Journal*, 2016;38(4):42-49. DOI: 10.1519/SSC.0000000000000218. PMID: 27531969.
11. McGowan CJ, Pyne DB, Thompson KG, Rattray B. "Warm-Up Strategies for Sport and Exercise:
    Mechanisms and Applications". *Sports Medicine*, 2015;45(11):1523-1546.
    DOI: 10.1007/s40279-015-0376-x. PMID: 26400696.
12. Moesgaard L, Beck MM, Christiansen L, Aagaard P, Lundbye-Jensen J. "Effects of Periodization
    on Strength and Muscle Hypertrophy in Volume-Equated Resistance Training Programs: A
    Systematic Review and Meta-analysis". *Sports Medicine*, 2022;52(7):1647-1666.
    DOI: 10.1007/s40279-021-01636-1. PMID: 35044672.
13. Morton RW, Murphy KT, McKellar SR, et al. "A systematic review, meta-analysis and
    meta-regression of the effect of protein supplementation on resistance training-induced gains
    in muscle mass and strength in healthy adults". *British Journal of Sports Medicine*,
    2018;52(6):376-384. DOI: 10.1136/bjsports-2017-097608. PMID: 28698222.
14. National Institute for Health and Care Excellence (NICE). "Low back pain and sciatica in over
    16s: assessment and management" (NG59), 2016, revisado/vigente. URL:
    https://www.nice.org.uk/guidance/ng59.
15. Pallarés JG, Hernández-Belmonte A, Martínez-Cava A, Vetrovsky T, Steffl M, Courel-Ibáñez J.
    "Effects of range of motion on resistance training adaptations: A systematic review and
    meta-analysis". *Scandinavian Journal of Medicine & Science in Sports*, 2021;31(10):1866-1881.
    DOI: 10.1111/sms.14006. PMID: 34170576.
16. Pancar Z, Ilhan EC, Darendeli A, et al. "Effects of planned deload weeks on muscular
    adaptations during an 8-week resistance training program in untrained individuals".
    *Scientific Reports*, 2026;16: artículo 40612. DOI: 10.1038/s41598-026-40612-5.
    PMID: 41730991.
17. Pelland JC, Remmert JF, Robinson ZP, et al. "Exploring the Volume-Load Dose Response
    Relationship: Effects on Muscle Hypertrophy and Strength, and a Conceptual Model for
    Interpretation". *Sports Medicine*, 2026;56(2):481-505. DOI: 10.1007/s40279-025-02344-w.
    PMID: 41343037.
18. Ratamess NA, Alvar BA, Evetoch TK, et al. (American College of Sports Medicine). "American
    College of Sports Medicine position stand. Progression models in resistance training for
    healthy adults". *Medicine & Science in Sports & Exercise*, 2009;41(3):687-708.
    DOI: 10.1249/MSS.0b013e3181915670. PMID: 19204579.
19. Refalo MC, Helms ER, Trexler ET, Hamilton DL, Fyfe JJ. "Influence of Resistance Training
    Proximity-to-Failure on Skeletal Muscle Hypertrophy: A Systematic Review with
    Meta-analysis". *Sports Medicine*, 2023;53(3):649-665. DOI: 10.1007/s40279-022-01784-y.
    PMID: 36334240.
20. Robinson ZP, Pelland JC, Remmert JF, et al. "Exploring the Dose-Response Relationship Between
    Estimated Resistance Training Proximity to Failure, Strength Gain, and Muscle Hypertrophy: A
    Series of Meta-Regressions". *Sports Medicine*, 2024;54(9):2209-2231.
    DOI: 10.1007/s40279-024-02069-2. PMID: 38970765.
21. Rogerson D, Nolan Z, Androulakis Korakakis P, Immonen V, Wolf M, Bell L. "Deload Practices in
    Strength and Physique Sports: A Cross-Sectional Survey". *Sports Medicine - Open*,
    2024;10(1):40. DOI: 10.1186/s40798-024-00691-y. PMID: 38499934.
22. Schoenfeld BJ, Contreras B, Krieger J, et al. "Resistance Training Volume Enhances Muscle
    Hypertrophy but Not Strength in Trained Men". *Medicine & Science in Sports & Exercise*,
    2016;48(12):2605-2613. DOI: 10.1519/JSC.0000000000001272. PMID: 26605807. (Referencia del
    estudio de intervalos de descanso de 1 frente a 3 minutos.)
23. Schoenfeld BJ, Ogborn D, Krieger JW. "Dose-response relationship between weekly resistance
    training volume and increases in muscle mass: A systematic review and meta-analysis".
    *Journal of Sports Sciences*, 2017;35(11):1073-1082. DOI: 10.1080/02640414.2016.1210197.
    PMID: 27433992.
24. Schoenfeld BJ, Grgic J, Krieger J. "How many times per week should a muscle be trained to
    maximize muscle hypertrophy? A systematic review and meta-analysis of studies examining the
    effects of resistance training frequency". *Journal of Sports Sciences*, 2019;37(11):1286-1295.
    DOI: 10.1080/02640414.2018.1555906. PMID: 30558493.
25. Schoenfeld BJ, Grgic J, Ogborn D, Krieger JW. "Strength and Hypertrophy Adaptations Between
    Low- vs. High-Load Resistance Training: A Systematic Review and Meta-analysis". *Journal of
    Strength and Conditioning Research*, 2017;31(12):3508-3523.
    DOI: 10.1519/JSC.0000000000002200. PMID: 28834797.
26. Spineti J, de Salles BF, Rhea MR, et al. "Influence of exercise order on maximum strength and
    muscle thickness in untrained men". *Journal of Strength and Conditioning Research*,
    2010;24(11):2962-2969. DOI: 10.1519/JSC.0b013e3181e2e19b. PMID: 20938358.
27. Teixeira PJ, Carraça EV, Markland D, Silva MN, Ryan RM. "Exercise, physical activity, and
    self-determination theory: a systematic review". *International Journal of Behavioral
    Nutrition and Physical Activity*, 2012;9:78. DOI: 10.1186/1479-5868-9-78. PMID: 22726453.
28. U.S. Department of Health and Human Services (HHS). *Physical Activity Guidelines for
    Americans*, 2nd edition, 2018. URL:
    https://health.gov/sites/default/files/2019-09/Physical_Activity_Guidelines_2nd_edition.pdf.
29. Watson NF, Badr MS, Belenky G, et al. "Recommended Amount of Sleep for a Healthy Adult: A
    Joint Consensus Statement of the American Academy of Sleep Medicine and Sleep Research
    Society". *Sleep*, 2015;38(6):843-844. DOI: 10.5665/sleep.4716. PMID: 26039963.
30. Williams TD, Tolusso DV, Fedewa MV, Esco MR. "Comparison of Periodized and Non-Periodized
    Resistance Training on Maximal Strength: A Meta-Analysis". *Sports Medicine*,
    2017;47(10):2083-2100. DOI: 10.1007/s40279-017-0734-y. PMID: 28497285.
31. Wilson JM, Marin PJ, Rhea MR, Wilson SM, Loenneke JP, Anderson JC. "Concurrent training: a
    meta-analysis examining interference of aerobic and resistance exercise". *Journal of
    Strength and Conditioning Research*, 2012;26(8):2293-2307.
    DOI: 10.1519/JSC.0b013e31823a3e2d. PMID: 22002517.
32. Wolf M, Korakakis V, Roberts J, Plotkin D, Franchi M, Contreras B, Henselmans M, Larsen AE,
    Schoenfeld BJ. "The influence of resistance training at long versus short muscle lengths on
    muscle size: a systematic review". *Sports Medicine and Health Science*, 2025. DOI:
    10.1016/j.smhs.2025.03.001. PMID: 41646176. (Ver aclaración en 2.7 sobre su correspondencia
    parcial con la fuente "Wolf et al. 2023" solicitada originalmente.)
33. Zourdos MC, Klemp A, Dolan C, et al. "Novel Resistance Training-Specific Rating of Perceived
    Exertion Scale Measuring Repetitions in Reserve". *Journal of Strength and Conditioning
    Research*, 2016;30(1):267-275. DOI: 10.1519/JSC.0000000000001049. PMID: 26049792.

**Nota sobre fuentes no incluidas con cita verificable:** "Singer et al. 2024" (intervalos de
descanso) no aparece en esta bibliografía por no haberse podido localizar; tampoco se incluye una
edición específica de *ACSM's Guidelines for Exercise Testing and Prescription* (11ª/12ª ed.) con
página o capítulo citable, al no haberse podido verificar su contenido interno más allá de los
metadatos editoriales generales. Ver sección 5 para el detalle completo.


