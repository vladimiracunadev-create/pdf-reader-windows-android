import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve(process.argv[2] || 'reports/smoke/pdf-reader-smoke.pdf');
const stream = [
  'BT',
  '/F1 24 Tf',
  '72 720 Td',
  '(PDF Reader v0.1.0) Tj',
  '0 -38 Td',
  '/F1 13 Tf',
  '(Documento local para comprobar renderizado y busqueda.) Tj',
  'ET',
].join('\n');
const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
  `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
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
