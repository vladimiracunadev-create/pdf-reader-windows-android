"""Genera PDF reproducibles desde docs/system-documentation/*.md.

Uso canónico: pnpm docs:pdf
Dependencia: reportlab. Los Markdown siguen siendo la fuente de verdad.
"""

from __future__ import annotations

import html
import re
import sys
from pathlib import Path
from textwrap import wrap

try:
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_CENTER, TA_LEFT
    from reportlab.lib.pagesizes import A4, landscape
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import mm
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.platypus import (
        BaseDocTemplate,
        Frame,
        ListFlowable,
        ListItem,
        PageTemplate,
        Paragraph,
        Preformatted,
        Spacer,
        Table,
        TableStyle,
    )
except ModuleNotFoundError as error:
    raise SystemExit(
        "Falta reportlab. Instálalo en el Python activo y ejecuta `pnpm docs:pdf`."
    ) from error


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "system-documentation"
OUTPUT = SOURCE / "pdf"
VERSION = "0.3.1"
COMMIT = "e22b730"
ANALYSIS_DATE = "2026-09-24"


def register_fonts() -> tuple[str, str, str]:
    candidates = [
        (
            Path("C:/Windows/Fonts/arial.ttf"),
            Path("C:/Windows/Fonts/arialbd.ttf"),
            Path("C:/Windows/Fonts/consola.ttf"),
        ),
        (
            Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
            Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
            Path("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"),
        ),
    ]
    for regular, bold, mono in candidates:
        if all(path.exists() for path in (regular, bold, mono)):
            pdfmetrics.registerFont(TTFont("DocRegular", str(regular)))
            pdfmetrics.registerFont(TTFont("DocBold", str(bold)))
            pdfmetrics.registerFont(TTFont("DocMono", str(mono)))
            pdfmetrics.registerFontFamily(
                "DocRegular", normal="DocRegular", bold="DocBold"
            )
            return "DocRegular", "DocBold", "DocMono"
    return "Helvetica", "Helvetica-Bold", "Courier"


FONT, FONT_BOLD, FONT_MONO = register_fonts()


def inline_markup(value: str) -> str:
    value = html.escape(value.strip(), quote=True)
    value = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        lambda match: f'<link href="{html.escape(match.group(2), quote=True)}" color="#3157d5">{match.group(1)}</link>',
        value,
    )
    value = re.sub(r"`([^`]+)`", rf'<font name="{FONT_MONO}" color="#23345d">\1</font>', value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", value)
    return value


def styles_for(page_width: float):
    base = getSampleStyleSheet()
    body_size = 9.2 if page_width > A4[0] else 9.5
    return {
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName=FONT_BOLD,
            fontSize=23,
            leading=27,
            textColor=colors.HexColor("#17213a"),
            alignment=TA_LEFT,
            spaceAfter=9,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#526078"),
            spaceAfter=12,
        ),
        "h1": ParagraphStyle(
            "H1", parent=base["Heading1"], fontName=FONT_BOLD, fontSize=16,
            leading=20, textColor=colors.HexColor("#2446a8"), spaceBefore=12, spaceAfter=7,
        ),
        "h2": ParagraphStyle(
            "H2", parent=base["Heading2"], fontName=FONT_BOLD, fontSize=12.5,
            leading=16, textColor=colors.HexColor("#17213a"), spaceBefore=10, spaceAfter=5,
        ),
        "h3": ParagraphStyle(
            "H3", parent=base["Heading3"], fontName=FONT_BOLD, fontSize=10.5,
            leading=14, textColor=colors.HexColor("#3157d5"), spaceBefore=8, spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "Body", parent=base["BodyText"], fontName=FONT, fontSize=body_size,
            leading=body_size * 1.45, textColor=colors.HexColor("#1f2937"), spaceAfter=6,
        ),
        "small": ParagraphStyle(
            "Small", parent=base["BodyText"], fontName=FONT, fontSize=7.3,
            leading=9.2, textColor=colors.HexColor("#263247"),
        ),
        "toc": ParagraphStyle(
            "TOC", parent=base["BodyText"], fontName=FONT, fontSize=8.4,
            leading=11, leftIndent=5 * mm, textColor=colors.HexColor("#35415a"),
        ),
    }


def split_table_row(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def max_table_columns(lines: list[str]) -> int:
    return max(
        (len(split_table_row(line)) for line in lines if line.strip().startswith("|")),
        default=0,
    )


def header_footer(canvas, doc, title: str):
    canvas.saveState()
    width, height = doc.pagesize
    canvas.setStrokeColor(colors.HexColor("#d9e0ef"))
    canvas.line(doc.leftMargin, height - 15 * mm, width - doc.rightMargin, height - 15 * mm)
    canvas.setFont(FONT, 7.5)
    canvas.setFillColor(colors.HexColor("#667085"))
    canvas.drawString(doc.leftMargin, height - 11.5 * mm, "PDF Reader - Documentación del sistema")
    canvas.drawRightString(width - doc.rightMargin, height - 11.5 * mm, f"v{VERSION} - {title[:58]}")
    canvas.line(doc.leftMargin, 13 * mm, width - doc.rightMargin, 13 * mm)
    canvas.drawString(doc.leftMargin, 9 * mm, f"Análisis {ANALYSIS_DATE} - commit {COMMIT}")
    canvas.drawRightString(width - doc.rightMargin, 9 * mm, f"Página {doc.page}")
    canvas.restoreState()


def build_story(lines: list[str], style, usable_width: float):
    story = []
    first_title = next((line[2:].strip() for line in lines if line.startswith("# ")), "Documento")
    story.append(Paragraph(inline_markup(first_title), style["title"]))
    story.append(
        Paragraph(
            f"PDF Reader v{VERSION} &nbsp;&nbsp;|&nbsp;&nbsp; Análisis {ANALYSIS_DATE} &nbsp;&nbsp;|&nbsp;&nbsp; Commit {COMMIT}",
            style["subtitle"],
        )
    )
    headings = [line[3:].strip() for line in lines if line.startswith("## ")]
    if len(headings) >= 5:
        story.append(Paragraph("Contenido", style["h2"]))
        for heading in headings:
            story.append(Paragraph(f"• {inline_markup(heading)}", style["toc"]))
        story.append(Spacer(1, 5 * mm))

    paragraph: list[str] = []
    code: list[str] = []
    in_code = False
    code_language = ""
    index = 0

    def flush_paragraph():
        if paragraph:
            story.append(Paragraph(inline_markup(" ".join(paragraph)), style["body"]))
            paragraph.clear()

    while index < len(lines):
        raw = lines[index].rstrip()
        stripped = raw.strip()
        if raw.startswith("# "):
            index += 1
            continue
        if stripped.startswith("```"):
            flush_paragraph()
            if not in_code:
                in_code = True
                code_language = stripped[3:].strip()
                code = []
            else:
                label = "Diagrama Mermaid" if code_language == "mermaid" else "Bloque de código"
                story.append(Paragraph(label, style["h3"]))
                wrapped = []
                for code_line in code:
                    wrapped.extend(wrap(code_line, width=105, subsequent_indent="  ") or [""])
                story.append(
                    Preformatted(
                        "\n".join(wrapped),
                        ParagraphStyle(
                            "Code", fontName=FONT_MONO, fontSize=7.1, leading=9.1,
                            leftIndent=4 * mm, rightIndent=4 * mm, spaceAfter=6,
                            backColor=colors.HexColor("#f4f6fb"), borderPadding=6,
                            textColor=colors.HexColor("#17213a"),
                        ),
                    )
                )
                in_code = False
            index += 1
            continue
        if in_code:
            code.append(raw)
            index += 1
            continue
        if stripped.startswith("|") and index + 1 < len(lines) and re.match(r"^\s*\|?\s*:?-+", lines[index + 1]):
            flush_paragraph()
            table_lines = [raw]
            index += 2
            while index < len(lines) and lines[index].strip().startswith("|"):
                table_lines.append(lines[index])
                index += 1
            rows = [[Paragraph(inline_markup(cell), style["small"]) for cell in split_table_row(line)] for line in table_lines]
            columns = len(rows[0])
            widths = [usable_width / columns] * columns
            table = Table(rows, colWidths=widths, repeatRows=1, hAlign="LEFT")
            table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eaf0ff")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#17213a")),
                ("FONTNAME", (0, 0), (-1, 0), FONT_BOLD),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#cbd5e1")),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]))
            story.extend([table, Spacer(1, 3 * mm)])
            continue
        if raw.startswith("## "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(raw[3:]), style["h1"]))
        elif raw.startswith("### "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(raw[4:]), style["h2"]))
        elif re.match(r"^[-*] ", stripped):
            flush_paragraph()
            items = []
            while index < len(lines) and re.match(r"^\s*[-*] ", lines[index]):
                text = re.sub(r"^\s*[-*] ", "", lines[index].strip())
                items.append(ListItem(Paragraph(inline_markup(text), style["body"]), leftIndent=4 * mm))
                index += 1
            story.append(ListFlowable(items, bulletType="bullet", leftIndent=6 * mm, bulletFontName=FONT))
            continue
        elif re.match(r"^\d+\. ", stripped):
            flush_paragraph()
            items = []
            while index < len(lines) and re.match(r"^\d+\. ", lines[index].strip()):
                text = re.sub(r"^\d+\. ", "", lines[index].strip())
                items.append(ListItem(Paragraph(inline_markup(text), style["body"]), leftIndent=4 * mm))
                index += 1
            story.append(ListFlowable(items, bulletType="1", leftIndent=7 * mm, bulletFontName=FONT))
            continue
        elif stripped.startswith("> "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(stripped[2:]), ParagraphStyle(
                "Quote", parent=style["body"], leftIndent=7 * mm,
                borderColor=colors.HexColor("#3157d5"), borderWidth=1,
                borderPadding=5, backColor=colors.HexColor("#f5f7ff"),
            )))
        elif not stripped:
            flush_paragraph()
        else:
            paragraph.append(stripped)
        index += 1
    flush_paragraph()
    return first_title, story


def generate(source: Path) -> Path:
    lines = source.read_text(encoding="utf-8").splitlines()
    pagesize = landscape(A4) if max_table_columns(lines) > 5 else A4
    width, height = pagesize
    left = right = 17 * mm
    top = 20 * mm
    bottom = 17 * mm
    style = styles_for(width)
    title, story = build_story(lines, style, width - left - right)
    target = OUTPUT / f"{source.stem}.pdf"
    doc = BaseDocTemplate(
        str(target), pagesize=pagesize, leftMargin=left, rightMargin=right,
        topMargin=top, bottomMargin=bottom, title=title, author="PDF Reader project",
        subject="Documentación integral del sistema", invariant=1,
    )
    frame = Frame(left, bottom, width - left - right, height - top - bottom, id="normal")
    doc.addPageTemplates(PageTemplate(id="docs", frames=frame, onPage=lambda canvas, current: header_footer(canvas, current, title)))
    doc.build(story)
    return target


def main() -> int:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    sources = sorted(SOURCE.glob("*.md"))
    if len(sources) != 20:
        raise SystemExit(f"Se esperaban 20 Markdown fuente y se encontraron {len(sources)}.")
    generated = [generate(source) for source in sources]
    print(f"Generados {len(generated)} PDF en {OUTPUT.relative_to(ROOT)}")
    for path in generated:
        print(path.relative_to(ROOT))
    return 0


if __name__ == "__main__":
    sys.exit(main())
