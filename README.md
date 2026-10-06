# IvanGym 🏋️

App web móvil (sin backend) para seguir la rutina de gimnasio de Iván, registrar pesos por serie y ver la progresión.

- **Hoy**: rutina sugerida (rotación por las rutinas activas, sin atarse al día de la semana), ejercicios con GIF, músculos, vídeos (técnica y, si existe, el oficial de Matrix) y registro de series (kg + reps). Cada ejercicio tiene una 📍 nota propia que se conserva entre sesiones (p. ej. dónde está la máquina en el gimnasio o cómo ajustarla). Al acabar cada ejercicio lo valoras (😣 Duro · 💪 Justo · 😎 Fácil) y la próxima vez propone el peso: sube si fue fácil o si fue justo dos veces seguidas, baja un 10 % tras dos sesiones duras, y si no, mantiene. Actividades opcionales (cardio, andar, estirar…). Estimación de kcal quemadas (para 101 kg). Mensaje motivador en una pantalla de bienvenida al abrir.
- **Historial**: calendario mensual; toca un día para ver o editar su registro.
- **Progreso**: días por semana y gráfico del peso máximo por ejercicio.
- **Músculos**: mapa del cuerpo (frente y espalda) con los nombres de los músculos; toca uno para ver dónde está, para qué sirve y con qué ejercicios lo trabajas. En cada ejercicio de **Hoy**, la mini figura resalta sus músculos (principal en rojo, secundario en rosa); tócala para verlos en grande.
- **Ajustes**: exportar/importar JSON, cambiar vídeos, borrar datos.

Los datos se guardan en el `localStorage` del navegador. Funciona sin conexión y se puede añadir a la pantalla de inicio.

## Añadir o cambiar rutinas

Se hace en el código, en `js/data.js`:

1. **Ejercicios nuevos**: añádelos a `EXERCISES` con un id en kebab-case (`name`, `primary`, `secondary` — los nombres de músculo deben existir como alias en `MUSCLES` de `js/muscles.js` —, `tip`, `video` = vídeo de técnica; opcionales `matrix` = vídeo oficial de Matrix Fitness de la máquina, `note`, `step`, `gif`).
2. **GIF**: guárdalo como `img/exercises/<id>.gif`. Si falta, se muestra el icono de la app.
3. **Rutina nueva**: añade un bloque a `ROUTINES` con un `id` entero nuevo (no reutilices ids antiguos), `name`, `short`, `description`, `color` y `exercises` (`{ id, sets, reps }`).
4. **Retirar una rutina** sin perder su historial: `active: false`.
5. Sube la `VERSION` de `sw.js` para que los móviles cojan el cambio.

La sugerencia rota por las rutinas activas en el orden del array. Si algo está mal (ids repetidos, ejercicios inexistentes o músculos sin grupo en el mapa), sale un error `[IvanGym]` en la consola del navegador.

## Probar en local

```sh
python3 -m http.server 8000
```

Abre http://localhost:8000 (en el móvil, usa la IP del ordenador en la misma red).

## Publicar en GitHub Pages

Settings → Pages → *Deploy from a branch* → `master` / `(root)`. No hay paso de build.

## Créditos

La figura del mapa muscular está adaptada de [react-body-highlighter](https://github.com/giavinh79/react-body-highlighter) (MIT, © 2020 GV79).

## GIFs de los ejercicios

Se generan recortando los collages de `docs/` (requiere Pillow):

```sh
python3 tools/crop_gifs.py
```
