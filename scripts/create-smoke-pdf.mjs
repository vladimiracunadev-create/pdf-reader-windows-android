/** Crea un PDF sintético sin datos privados para validaciones manuales del lector. */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve(process.argv[2] || 'reports/smoke/pdf-reader-smoke.pdf');
const pageCount = Math.min(2000, Math.max(1, Number.parseInt(process.argv[3] || '1', 10) || 1));
const fontObject = 3 + pageCount * 2;
const pageReferences = [];
const pageObjects = [];
for (let page = 1; page <= pageCount; page += 1) {
  const pageObject = 3 + (page - 1) * 2;
  const contentObject = pageObject + 1;
  pageReferences.push(`${pageObject} 0 R`);
  const stream = [
    'BT',
    '/F1 24 Tf',
    '72 720 Td',
    `(PDF Reader - pagina ${page} de ${pageCount}) Tj`,
    '0 -38 Td',
    '/F1 13 Tf',
    `(Documento local para comprobar renderizado, navegacion y busqueda. token-${page}) Tj`,
    'ET',
  ].join('\n');
  pageObjects.push(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObject} 0 R >> >> /Contents ${contentObject} 0 R >>`,
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  );
}
const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  `<< /Type /Pages /Kids [${pageReferences.join(' ')}] /Count ${pageCount} >>`,
  ...pageObjects,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
];

let pdf = '%PDF-1.4\n';
const offsets = [0];
for (let index = 0; index < objects.length; index += 1) {
  offsets.push(Buffer.byteLength(pdf));
  pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
}
const xref = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += '0000000000 65535 f \n';
for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, pdf);
console.log(output);
