# IvanGym 🏋️

App web móvil (sin backend) para seguir la rutina de gimnasio de Iván, registrar pesos por serie y ver la progresión.

- **Hoy**: rutina sugerida (rotación 1 → 2 → 3, sin atarse al día de la semana), ejercicios con GIF, músculos, vídeo y registro de series (kg + reps). Actividades opcionales (cardio, andar, estirar…). Estimación de kcal quemadas (para 101 kg). Mensaje motivador al abrir.
- **Historial**: calendario mensual; toca un día para ver o editar su registro.
- **Progreso**: días por semana y gráfico del peso máximo por ejercicio.
- **Ajustes**: exportar/importar JSON, cambiar vídeos, borrar datos.

Los datos se guardan en el `localStorage` del navegador. Funciona sin conexión y se puede añadir a la pantalla de inicio.

## Probar en local

```sh
python3 -m http.server 8000
```

Abre http://localhost:8000 (en el móvil, usa la IP del ordenador en la misma red).

## Publicar en GitHub Pages

Settings → Pages → *Deploy from a branch* → `master` / `(root)`. No hay paso de build.

## GIFs de los ejercicios

Se generan recortando los collages de `docs/` (requiere Pillow):

```sh
python3 tools/crop_gifs.py
```
