import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const openNextDir = resolve(projectRoot, '.open-next');
const distDir = resolve(projectRoot, 'dist');
const serverDir = resolve(distDir, 'server');

await rm(distDir, { recursive: true, force: true });
await mkdir(serverDir, { recursive: true });
await cp(openNextDir, serverDir, { recursive: true });
await cp(resolve(openNextDir, 'assets'), resolve(distDir, 'assets'), {
  recursive: true,
});
await rm(resolve(serverDir, 'assets'), { recursive: true, force: true });
await writeFile(
  resolve(serverDir, 'index.js'),
  "export * from './worker.js';\nexport { default } from './worker.js';\n",
  'utf8',
);
