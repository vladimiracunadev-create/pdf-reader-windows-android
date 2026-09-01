import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

const manifestPath = 'android/app/src/main/AndroidManifest.xml';
const gradlePath = 'android/app/build.gradle';
const stringsPath = 'android/app/src/main/res/values/strings.xml';

if (![manifestPath, gradlePath, stringsPath].every(existsSync)) {
  console.error('Android no está generado por completo. Ejecuta pnpm android:init.');
  process.exit(2);
}

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(pkg.version)) throw new Error(`Versión SemVer no compatible: ${pkg.version}`);
const versionCode = Number(pkg.pdfReader?.androidVersionCode);
if (!Number.isInteger(versionCode) || versionCode < 1) throw new Error('Falta pdfReader.androidVersionCode válido en package.json');

let gradle = await readFile(gradlePath, 'utf8');
gradle = gradle
  .replace(/versionCode\s+\d+/, `versionCode ${versionCode}`)
  .replace(/versionName\s+"[^"]+"/, `versionName "${pkg.version}"`);
await writeFile(gradlePath, gradle);

let manifest = await readFile(manifestPath, 'utf8');
const forbidden = [
  'android.permission.INTERNET',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.MANAGE_EXTERNAL_STORAGE',
];
for (const permission of forbidden) {
  manifest = manifest.replace(new RegExp(`\\s*<uses-permission\\s+android:name="${permission.replaceAll('.', '\\.') }"\\s*/>`, 'g'), '');
}
await writeFile(manifestPath, manifest);

let strings = await readFile(stringsPath, 'utf8');
strings = strings
  .replace(/<string name="app_name">[^<]*<\/string>/, '<string name="app_name">PDF Reader</string>')
  .replace(/<string name="title_activity_main">[^<]*<\/string>/, '<string name="title_activity_main">PDF Reader</string>');
await writeFile(stringsPath, strings);

if (forbidden.some((permission) => manifest.includes(permission))) {
  throw new Error('El manifiesto Android todavía contiene permisos prohibidos.');
}

console.log(`Android listo: v${pkg.version} (${versionCode}), selector del sistema y cero permisos sensibles/de red/almacenamiento.`);
