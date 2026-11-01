/** Verifica que el runtime distribuido (Electron) no tenga advisories publicados.
 *
 * `pnpm audit --prod` cubre el arbol de produccion, pero Electron vive en
 * devDependencies porque solo se usa para construir y ejecutar. El binario si
 * se distribuye dentro del instalador de Windows, asi que un advisory contra
 * Electron no aparecia en ningun gate. Este script cierra ese hueco.
 *
 * Consulta OSV.dev con la version exacta declarada en package.json.
 * Falla si hay advisories. Si la consulta no se puede completar por red,
 * avisa y no bloquea: el gate no debe volverse intermitente por un tercero.
 */
import { readFile } from 'node:fs/promises';

const pkg = JSON.parse(await readFile('package.json', 'utf8'));

/** Dependencias que se distribuyen dentro de un artefacto instalable. */
const runtime = [
  ['electron', pkg.devDependencies?.electron],
  ['pdfjs-dist', pkg.dependencies?.['pdfjs-dist']],
  ['@capacitor/core', pkg.dependencies?.['@capacitor/core']],
  ['@capacitor/share', pkg.dependencies?.['@capacitor/share']],
];

const query = async (name, version) => {
  const response = await fetch('https://api.osv.dev/v1/query', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ version, package: { name, ecosystem: 'npm' } }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`OSV respondio ${response.status}`);
  return (await response.json()).vulns ?? [];
};

const findings = [];
for (const [name, version] of runtime) {
  if (!version) throw new Error(`No se pudo leer la version de ${name} en package.json`);
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`${name} debe estar fijado a una version exacta: ${version}`);

  let vulns;
  try {
    vulns = await query(name, version);
  } catch (error) {
    console.warn(`AVISO: no se pudo consultar OSV.dev para ${name}@${version} (${error.message}). No se bloquea.`);
    continue;
  }

  if (vulns.length === 0) {
    console.log(`OK ${name}@${version}`);
    continue;
  }

  for (const vuln of vulns) {
    const severity = vuln.database_specific?.severity ?? 'DESCONOCIDA';
    const aliases = (vuln.aliases ?? []).join(' ');
    findings.push(`${name}@${version}: ${vuln.id} [${severity}] ${aliases} :: ${vuln.summary ?? ''}`);
  }
}

if (findings.length > 0) {
  console.error('\nEl runtime distribuido tiene advisories publicados:\n');
  for (const finding of findings) console.error(`  - ${finding}`);
  console.error('\nSube la dependencia afectada y registra el cambio en docs/security-updates.md.');
  process.exit(1);
}

console.log('Runtime distribuido sin advisories conocidos en OSV.dev.');
