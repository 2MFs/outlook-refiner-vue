// generate-manifest.js
const fs = require('fs');
const path = require('path');

const APP_URL = process.env.APP_URL;

if (!APP_URL) {
  console.error('❌ APP_URL 環境變數未設定');
  process.exit(1);
}

const template = fs.readFileSync(path.join(__dirname, 'manifest.template.xml'), 'utf-8');
const output = template.replace(/{{APP_URL}}/g, APP_URL);
fs.writeFileSync(path.join(__dirname, 'manifest.xml'), output);

console.log(`✅ 已產生 manifest.xml (URL: ${APP_URL})`);
