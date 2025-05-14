// generate-manifest.mjs
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const APP_URL = process.env.APP_URL;

if (!APP_URL) {
  console.error('❌ APP_URL 環境變數未設定');
  process.exit(1);
}

const template = await readFile(join(process.cwd(), 'manifest.template.xml'), 'utf-8');
const output = template.replace(/{{APP_URL}}/g, APP_URL);
await writeFile(join(process.cwd(), 'manifest.xml'), output);

console.log(`✅ 已產生 manifest.xml (URL: ${APP_URL})`);
