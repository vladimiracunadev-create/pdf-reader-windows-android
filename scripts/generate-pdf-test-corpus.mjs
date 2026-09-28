/** Orchestrates PDF fixtures that require native Chromium or external provenance. */
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const out = path.join(root, '.qa', 'pdf-corpus');
const temporary = path.join(root, 'tmp', 'pdfs', 'corpus');
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const bundledPython = 'C:\\Users\\vbav\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe';
const wordFixture = {
  url: 'https://raw.githubusercontent.com/developer0hye/office2pdf/main/tests/golden_mocks/business/expected/docx/05_technical_manual_en.pdf',
  sha256: '4d3d40276d9ec443f97369cddd349804a759caf194fce9570e5ad405ed7ad95a',
  source: 'developer0hye/office2pdf tests/golden_mocks/business/expected/docx; README identifies native Microsoft Word PDF exports',
};

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${command} terminó con código ${code}`)));
  });
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

let python = process.env.PDF_QA_PYTHON || 'python';
if (!process.env.PDF_QA_PYTHON && process.platform === 'win32') {
  try { await access(bundledPython); python = bundledPython; } catch {}
}
await run(python, ['scripts/generate-pdf-test-corpus.py']);
await mkdir(temporary, { recursive: true });

const htmlPath = path.join(temporary, 'browser-source.html');
await writeFile(htmlPath, `<!doctype html><meta charset="utf-8"><title>Browser PDF fixture</title>
<style>@page{size:A4;margin:20mm}body{font:16px system-ui;color:#18243a}h1{color:#3157d5}.card{border:3px solid #3157d5;padding:24px}</style>
<h1>PDF generado desde navegador</h1><div class="card"><p>BROWSER-PRINT-SEARCHABLE</p><p>Chromium imprime este HTML local mediante su flujo real de Print to PDF.</p><a href="https://example.com/browser-pdf">Enlace externo</a></div>`, 'utf8');
const browserPdf = path.join(out, '15-browser-generated.pdf');
await run(edge, ['--headless', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${browserPdf}`, pathToFileURL(htmlPath).href]);
for (let attempt = 0; attempt < 100; attempt++) {
  try { await access(browserPdf); break; } catch {
    if (attempt === 99) throw new Error('Edge terminó sin producir el PDF de navegador');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

const response = await fetch(wordFixture.url);
if (!response.ok) throw new Error(`No se pudo descargar el fixture Word: HTTP ${response.status}`);
const wordBytes = Buffer.from(await response.arrayBuffer());
const wordHash = sha256(wordBytes);
if (wordFixture.sha256 !== 'PENDING' && wordHash !== wordFixture.sha256) {
  throw new Error(`El fixture Word cambió: esperado ${wordFixture.sha256}, obtenido ${wordHash}`);
}
const wordPdf = path.join(out, '16-word-native-export.pdf');
await writeFile(wordPdf, wordBytes);

const generatedManifestPath = path.join(out, 'manifest.generated.json');
const manifest = JSON.parse(await readFile(generatedManifestPath, 'utf8'));
for (const [file, category, provenance] of [
  [browserPdf, 'browser-generated', `Microsoft Edge ${process.platform} headless print-to-pdf`],
  [wordPdf, 'word-generated', wordFixture.source],
]) {
  const bytes = await readFile(file);
  manifest.files.push({ file: path.basename(file), bytes: bytes.length, sha256: sha256(bytes), category, provenance });
}
manifest.generatedAt = new Date().toISOString();
await writeFile(path.join(out, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Corpus PDF: ${manifest.files.length} archivos en ${path.relative(root, out)}`);
console.log(`WORD_FIXTURE_SHA256=${wordHash}`);
