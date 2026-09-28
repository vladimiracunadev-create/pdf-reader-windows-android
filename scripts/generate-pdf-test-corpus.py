"""Generate deterministic PDF fixtures used by the end-to-end reader audit.

The generated directory is disposable evidence. Source fixtures that require a
real external producer (Chromium and Microsoft Word) are added by the Node
orchestrator in generate-pdf-test-corpus.mjs.
"""

from __future__ import annotations

import hashlib
import json
import random
import shutil
from pathlib import Path

from PIL import Image, ImageDraw
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, NumberObject
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A3, A4, LETTER, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / ".qa" / "pdf-corpus"
TMP = ROOT / "tmp" / "pdfs" / "corpus"


def pdf_canvas(path: Path, pagesize=A4, title="PDF Reader QA") -> canvas.Canvas:
    result = canvas.Canvas(str(path), pagesize=pagesize, invariant=1, pageCompression=1)
    result.setTitle(title)
    result.setAuthor("PDF Reader QA")
    result.setSubject("Reproducible PDF reader fixture")
    result.setKeywords("pdf reader qa regression")
    return result


def heading(c: canvas.Canvas, text: str, page: int, pagesize=A4) -> None:
    width, height = pagesize
    c.setFillColor(HexColor("#18243a"))
    c.setFont("Helvetica-Bold", 20)
    c.drawString(48, height - 62, text)
    c.setFont("Helvetica", 11)
    c.drawString(48, height - 84, f"Página {page} · marcador QA-PDF-{page:04d}")


def make_single_page() -> Path:
    path = OUT / "01-single-page-selectable.pdf"
    c = pdf_canvas(path, title="Una página con texto seleccionable")
    heading(c, "PDF de una sola página", 1)
    c.setFont("Helvetica", 13)
    c.drawString(48, 690, "Texto seleccionable: ALFA BETA GAMMA. Enlace y metadatos verificables.")
    c.linkURL("https://example.com/pdf-reader-qa", (48, 650, 310, 670), relative=0)
    c.setFillColor(HexColor("#3157d5"))
    c.drawString(48, 654, "Abrir enlace de prueba (example.com)")
    c.save()
    return path


def make_multipage() -> Path:
    path = OUT / "02-multipage-text-images.pdf"
    c = pdf_canvas(path, title="Doce páginas con texto e imágenes")
    for page in range(1, 13):
        heading(c, "Documento multipágina mixto", page)
        c.setFillColor(HexColor("#3157d5" if page % 2 else "#ef8354"))
        c.rect(48, 450, 220 + page * 8, 150, fill=1, stroke=0)
        c.setFillColor(HexColor("#18243a"))
        c.setFont("Helvetica", 12)
        c.drawString(48, 410, f"Contenido único de la página {page}: BUSQUEDA-{page:02d}.")
        c.drawString(48, 388, "Combina texto extraíble, formas vectoriales y navegación multipágina.")
        c.showPage()
    c.save()
    return path


def make_many_pages() -> Path:
    path = OUT / "03-many-pages-1000.pdf"
    c = pdf_canvas(path, title="Mil páginas ligeras")
    for page in range(1, 1001):
        c.setFont("Helvetica-Bold", 18)
        c.drawString(54, 780, f"Página {page} de 1000")
        c.setFont("Helvetica", 10)
        c.drawString(54, 758, f"Marcador MANY-{page:04d}; prueba de límites, miniaturas y salto directo.")
        c.showPage()
    c.save()
    return path


def raster_card(size: tuple[int, int], label: str, seed: int) -> Image.Image:
    rng = random.Random(seed)
    image = Image.new("RGB", size, (244, 246, 250))
    draw = ImageDraw.Draw(image)
    for _ in range(240):
        x = rng.randrange(size[0])
        y = rng.randrange(size[1])
        shade = rng.randrange(120, 225)
        draw.line((x, y, min(size[0], x + rng.randrange(30, 240)), y), fill=(shade, shade, shade), width=2)
    draw.rectangle((80, 80, size[0] - 80, size[1] - 80), outline=(35, 55, 90), width=8)
    draw.text((120, 130), label, fill=(20, 30, 50))
    return image


def make_scanned() -> Path:
    image_path = TMP / "scan.png"
    raster_card((1654, 2339), "SCAN-ONLY-IMAGE", 7).save(image_path, optimize=True)
    path = OUT / "04-scanned-no-text-layer.pdf"
    c = pdf_canvas(path, title="Escaneado sin capa de texto")
    c.drawImage(str(image_path), 0, 0, width=A4[0], height=A4[1])
    c.save()
    return path


def make_images_only() -> Path:
    path = OUT / "05-images-only.pdf"
    c = pdf_canvas(path, title="Documento compuesto por imágenes")
    for page in range(1, 6):
        image = raster_card((1200, 900), f"IMAGE-PAGE-{page}", page)
        c.drawImage(ImageReader(image), 30, 165, width=535, height=401)
        c.showPage()
    c.save()
    return path


def make_varied_sizes() -> Path:
    path = OUT / "06-varied-page-sizes.pdf"
    sizes = [A4, LETTER, A3, (360, 720)]
    c = pdf_canvas(path, pagesize=sizes[0], title="Tamaños de página diferentes")
    for page, size in enumerate(sizes, 1):
        c.setPageSize(size)
        heading(c, f"Tamaño {int(size[0])} × {int(size[1])} pt", page, size)
        c.showPage()
    c.save()
    return path


def make_landscape() -> Path:
    size = landscape(A4)
    path = OUT / "07-landscape.pdf"
    c = pdf_canvas(path, pagesize=size, title="Orientación horizontal")
    heading(c, "Documento horizontal", 1, size)
    c.setFont("Helvetica", 14)
    c.drawString(48, size[1] - 120, "LANDSCAPE-SEARCHABLE")
    c.save()
    return path


def make_mixed_rotated() -> Path:
    base = TMP / "mixed-base.pdf"
    c = pdf_canvas(base, title="Orientaciones mezcladas y páginas rotadas")
    for page, size in enumerate([A4, landscape(A4), A4, landscape(A4)], 1):
        c.setPageSize(size)
        heading(c, f"Orientación {'horizontal' if size[0] > size[1] else 'vertical'}", page, size)
        c.showPage()
    c.save()
    reader = PdfReader(base)
    writer = PdfWriter()
    for index, page in enumerate(reader.pages):
        if index == 2:
            page[NameObject("/Rotate")] = NumberObject(90)
        if index == 3:
            page[NameObject("/Rotate")] = NumberObject(270)
        writer.add_page(page)
    writer.add_metadata({"/Title": "Orientaciones y rotaciones mezcladas", "/Author": "PDF Reader QA"})
    path = OUT / "08-mixed-orientation-rotated.pdf"
    with path.open("wb") as stream:
        writer.write(stream)
    return path


def noise_image(path: Path, seed: int) -> None:
    rng = random.Random(seed)
    size = (3000, 3000)
    image = Image.frombytes("RGB", size, rng.randbytes(size[0] * size[1] * 3))
    image.save(path, "JPEG", quality=97, subsampling=0, optimize=False)


def make_heavy() -> Path:
    images = []
    for index in range(3):
        image_path = TMP / f"noise-{index}.jpg"
        noise_image(image_path, 9100 + index)
        images.append(image_path)
    path = OUT / "09-heavy-over-24mb.pdf"
    c = pdf_canvas(path, title="PDF pesado")
    for image_path in images:
        c.drawImage(str(image_path), 0, 0, width=A4[0], height=A4[1])
        c.showPage()
    c.save()
    return path


def make_high_resolution() -> Path:
    width, height = 6000, 8000
    image = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(image)
    for y in range(0, height, 40):
        color = (20 + (y // 40) % 180, 55, 145)
        draw.line((0, y, width, y), fill=color, width=3)
    draw.text((200, 200), "HIGH-RESOLUTION-6000x8000", fill=(0, 0, 0))
    image_path = TMP / "high-resolution.jpg"
    image.save(image_path, "JPEG", quality=88, optimize=True)
    path = OUT / "10-high-resolution-image.pdf"
    c = pdf_canvas(path, title="Imagen de alta resolución")
    c.drawImage(str(image_path), 0, 0, width=A4[0], height=A4[1])
    c.save()
    return path


def make_links() -> Path:
    path = OUT / "11-links-and-metadata.pdf"
    c = pdf_canvas(path, title="Enlaces y metadatos")
    heading(c, "Enlaces externos e internos", 1)
    c.bookmarkPage("start")
    c.setFillColor(HexColor("#3157d5"))
    c.drawString(48, 700, "Enlace externo example.com")
    c.linkURL("https://example.com/reader-link", (48, 694, 240, 714), relative=0)
    c.drawString(48, 660, "Ir a la segunda página")
    c.linkRect("", "second", (48, 654, 220, 674), relative=0)
    c.showPage()
    c.bookmarkPage("second")
    heading(c, "Destino del enlace interno", 2)
    c.save()
    return path


def make_embedded_font() -> Path:
    font_path = Path("C:/Windows/Fonts/arial.ttf")
    if not font_path.exists():
        raise RuntimeError("No se encontró C:/Windows/Fonts/arial.ttf para el fixture de fuente embebida")
    pdfmetrics.registerFont(TTFont("QAEmbeddedArial", str(font_path)))
    path = OUT / "12-embedded-font.pdf"
    c = pdf_canvas(path, title="Fuente TrueType embebida")
    c.setFont("QAEmbeddedArial", 18)
    c.drawString(48, 760, "Fuente embebida: áéíóú ñ Ñ — QA-EMBEDDED-FONT")
    c.setFont("QAEmbeddedArial", 11)
    c.drawString(48, 730, "Este texto debe ser seleccionable y conservar sus glifos.")
    c.save()
    return path


def make_encrypted() -> Path:
    source = make_single_page()
    reader = PdfReader(source)
    writer = PdfWriter()
    writer.append_pages_from_reader(reader)
    writer.encrypt("qa-password")
    path = OUT / "13-password-protected.pdf"
    with path.open("wb") as stream:
        writer.write(stream)
    return path


def make_recoverable_invalid() -> Path:
    source = OUT / "02-multipage-text-images.pdf"
    path = OUT / "14-recoverable-trailing-garbage.pdf"
    shutil.copyfile(source, path)
    with path.open("ab") as stream:
        stream.write(b"\nGARBAGE-AFTER-EOF-SAFE-QA\x00\x01\x02")
    return path


def describe(path: Path) -> dict:
    reader = PdfReader(path, strict=False)
    encrypted = reader.is_encrypted
    pages = None if encrypted else len(reader.pages)
    return {
        "file": path.name,
        "bytes": path.stat().st_size,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "pages": pages,
        "encrypted": encrypted,
    }


def main() -> int:
    shutil.rmtree(OUT, ignore_errors=True)
    shutil.rmtree(TMP, ignore_errors=True)
    OUT.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)
    generated = [
        make_single_page(),
        make_multipage(),
        make_many_pages(),
        make_scanned(),
        make_images_only(),
        make_varied_sizes(),
        make_landscape(),
        make_mixed_rotated(),
        make_heavy(),
        make_high_resolution(),
        make_links(),
        make_embedded_font(),
        make_encrypted(),
        make_recoverable_invalid(),
    ]
    manifest = {"schemaVersion": 1, "generator": Path(__file__).name, "files": [describe(path) for path in generated]}
    (OUT / "manifest.generated.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(manifest, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
