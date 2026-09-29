#!/usr/bin/env python3
"""Recorta los 3 collages GIF (cuadrícula 3x2) en 18 GIFs animados individuales.

Uso: python3 tools/crop_gifs.py  (requiere Pillow)
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs"
OUT = ROOT / "img" / "exercises"

# Interior de los marcos dorados medido sobre los frames (400x500).
COLS = [(14, 130), (142, 259), (271, 388)]
ROWS = [(91, 258), (286, 455)]

COLLAGES = {
    "WhatsApp GIF 2026-09-27 at 10.25.07.gif": [
        "jalon-unilateral", "extension-cuadriceps", "press-militar",
        "prensa", "extension-triceps-polea", "zancadas-traseras",
    ],
    "WhatsApp GIF 2026-09-27 at 10.25.14.gif": [
        "press-pecho", "curl-femoral", "remo-dorian",
        "hiperextensiones", "curl-biceps", "elevaciones-laterales",
    ],
    "WhatsApp GIF 2026-09-27 at 10.25.22.gif": [
        "thruster", "aperturas", "belt-squat",
        "crunch-abdominal", "extension-triceps-maquina", "jalon-pecho",
    ],
}

FRAME_STEP = 3  # conserva 1 de cada 3 frames para reducir tamaño


def crop_collage(path, names):
    src = Image.open(path)
    frames, durations = [], []
    for i in range(src.n_frames):
        src.seek(i)
        if i % FRAME_STEP == 0:
            frame = src.convert("RGB")
            frame.info.clear()
            frames.append(frame)
            durations.append(src.info.get("duration", 60) * FRAME_STEP)
    boxes = [(x0, y0, x1, y1) for (y0, y1) in ROWS for (x0, x1) in COLS]
    for name, box in zip(names, boxes):
        crops = [f.crop(box) for f in frames]
        # Paleta común para todos los frames: los deltas entre frames son mínimos.
        palette = crops[len(crops) // 2].quantize(colors=64, method=Image.Quantize.MEDIANCUT)
        cells = [c.quantize(palette=palette, dither=Image.Dither.NONE) for c in crops]
        for c in cells:
            c.info.clear()
        dest = OUT / f"{name}.gif"
        cells[0].save(dest, save_all=True, append_images=cells[1:], duration=durations,
                      loop=0, optimize=True, disposal=1)
        print(f"{dest.relative_to(ROOT)}  {dest.stat().st_size // 1024} KB")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for file, names in COLLAGES.items():
        crop_collage(SRC / file, names)


if __name__ == "__main__":
    main()
