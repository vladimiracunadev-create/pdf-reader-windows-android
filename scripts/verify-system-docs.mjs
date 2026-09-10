/** Verifica estructura, enlaces, UTF-8, tablas y equivalencia PDF del dossier del sistema. */
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'docs', 'system-documentation');
const pdfDirectory = path.join(source, 'pdf');
const markdown = (await readdir(source)).filter(name => name.endsWith('.md')).sort();
if (markdown.length !== 20) throw new Error(`Se esperaban 20 Markdown y existen ${markdown.length}`);

const decoder = new TextDecoder('utf-8', { fatal: true });
const suspicious = [
  String.fromCodePoint(0xfffd),
  String.fromCodePoint(0xc3),
  String.fromCodePoint(0xc2),
  String.fromCodePoint(0xe2, 0x20ac),
  String.fromCodePoint(0xf0, 0x178),
];

for (const name of markdown) {
  const markdownPath = path.join(source, name);
  const text = decoder.decode(await readFile(markdownPath));
  if (text.trim().length < 500) throw new Error(`${name} no contiene documentación suficiente`);
  if (suspicious.some(marker => text.includes(marker))) throw new Error(`${name} contiene posible mojibake`);

  let expectedColumns = null;
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    if (line.trim().startsWith('|')) {
      const columns = line.trim().replace(/^\||\|$/g, '').split('|').length;
      if (expectedColumns === null) expectedColumns = columns;
      else if (columns !== expectedColumns) throw new Error(`${name}:${index + 1} tiene ${columns} columnas; se esperaban ${expectedColumns}`);
    } else expectedColumns = null;
  }

  for (const match of text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, '');
    if (/^(https?:\/\/|mailto:|#)/.test(target)) continue;
    const relative = target.split('#')[0];
    if (!relative) continue;
    const resolved = path.resolve(path.dirname(markdownPath), relative);
    if (!resolved.startsWith(root)) throw new Error(`${name} enlaza fuera del repositorio: ${target}`);
    await access(resolved);
  }

  const pdfPath = path.join(pdfDirectory, `${path.parse(name).name}.pdf`);
  const pdf = await readFile(pdfPath);
  if (pdf.length < 10_000 || pdf.subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new Error(`${path.basename(pdfPath)} no es un PDF generado válido`);
  }
}

const readme = decoder.decode(await readFile(path.join(root, 'README.md')));
if (!readme.includes('docs/system-documentation/README.md')) throw new Error('README no enlaza la documentación integral');
console.log('Documentación integral: 20 Markdown, 20 PDF, enlaces, tablas y UTF-8 OK');
