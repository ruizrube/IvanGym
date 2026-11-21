#!/usr/bin/env python3
"""Genera los GIF de los ejercicios con `src` en js/data.js a partir de free-exercise-db.

free-exercise-db (https://github.com/yuhonas/free-exercise-db) es de dominio público
(Unlicense). Cada ejercicio tiene dos fotos (posición inicial y final): se recorta una
ventana vertical sobre la persona, con la proporción de los GIF existentes, y se alternan.

Uso: python3 tools/fetch_gifs.py [--force]  (requiere Pillow)
"""
import io
import re
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "js" / "data.js"
OUT = ROOT / "img" / "exercises"
BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises"

SIZE = (232, 334)  # doble de 116x167 (proporción de .ex-gif) para verse nítido
FRAME_MS = 900
BG = (255, 255, 255)
MAX_RATIO = 1.0  # ancho máximo de la ventana respecto al alto de la foto


def sources():
    """Pares (id, src) de los ejercicios de data.js que declaran `src`."""
    text = DATA.read_text(encoding="utf-8")
    blocks = re.split(r"\n  (?='?[\w-]+'?: \{)", text)
    for block in blocks:
        head = re.match(r"'?([\w-]+)'?: \{", block)
        src = re.search(r"\n    src: '([^']+)'", block)
        if head and src:
            yield head.group(1), src.group(1)


def download(src, n):
    req = urllib.request.Request(f"{BASE}/{src}/{n}.jpg", headers={"User-Agent": "IvanGym"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return Image.open(io.BytesIO(r.read())).convert("RGB")


def crop_box(frames):
    """Ventana vertical centrada donde más cambia la imagen entre fotogramas.

    Las fotos son apaisadas y con fondo de gimnasio: lo que se mueve es la persona. La
    ventana tiene la proporción de SIZE; solo se ensancha (hasta MAX_RATIO, rellenando
    arriba y abajo) si hace falta para abarcar el 85 % del movimiento.
    """
    w, h = frames[0].size
    diff = ImageChops.difference(frames[0], frames[1]).convert("L")
    diff = diff.point(lambda v: v if v > 40 else 0)
    cols = list(diff.resize((w, 1), Image.BOX).getdata())
    total = sum(cols) or 1
    base = round(h * SIZE[0] / SIZE[1])
    win = base
    while True:
        energy = sum(cols[:win])
        best, best_x = energy, 0
        for x in range(1, w - win + 1):
            energy += cols[x + win - 1] - cols[x - 1]
            if energy > best:
                best, best_x = energy, x
        if best / total >= 0.85 or win >= min(w, round(h * MAX_RATIO)):
            return best_x, 0, best_x + win, h
        win = min(w, win + 20)


def fit(im, box):
    crop = im.crop(box)
    crop.thumbnail(SIZE, Image.LANCZOS)
    canvas = Image.new("RGB", SIZE, BG)
    canvas.paste(crop, ((SIZE[0] - crop.width) // 2, (SIZE[1] - crop.height) // 2))
    return canvas.convert("P", palette=Image.ADAPTIVE, colors=128)


def build(ex_id, src):
    frames = [download(src, n) for n in (0, 1)]
    box = crop_box(frames)
    gif = [fit(im, box) for im in frames]
    path = OUT / f"{ex_id}.gif"
    gif[0].save(path, save_all=True, append_images=gif[1:], duration=FRAME_MS, loop=0, optimize=True)
    return path


def main():
    force = "--force" in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    for ex_id, src in sources():
        path = OUT / f"{ex_id}.gif"
        if path.exists() and not force:
            print(f"= {path.name} (ya existe)")
            continue
        try:
            build(ex_id, src)
            print(f"+ {path.name} ({path.stat().st_size // 1024} KB) ← {src}")
        except Exception as err:  # noqa: BLE001 — se informa y se sigue con el resto
            print(f"! {ex_id}: {err}", file=sys.stderr)


if __name__ == "__main__":
    main()
