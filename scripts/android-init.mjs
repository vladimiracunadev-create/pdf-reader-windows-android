import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const capacitorCli = 'node_modules/@capacitor/cli/bin/capacitor';

if (!existsSync('android')) {
  const result = spawnSync(process.execPath, [capacitorCli, 'add', 'android'], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
} else {
  console.log('android/ ya existe.');
}

const patch = spawnSync(process.execPath, ['scripts/patch-android.mjs'], { stdio: 'inherit' });
if (patch.error) throw patch.error;
process.exit(patch.status || 0);
