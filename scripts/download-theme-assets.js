import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const urls = [
  'https://sriwijayagrafika.co.id/wp-content/themes/seofication/css/bootstrap.min.css',
  'https://sriwijayagrafika.co.id/wp-content/themes/seofication/css/font-awesome-4.7.0/css/font-awesome.min.css',
  'https://sriwijayagrafika.co.id/wp-content/themes/seofication/css/font-awesome-4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0',
  'https://sriwijayagrafika.co.id/wp-content/themes/seofication/css/font-awesome-4.7.0/fonts/fontawesome-webfont.woff?v=4.7.0',
  'https://sriwijayagrafika.co.id/wp-content/themes/seofication/css/font-awesome-4.7.0/fonts/fontawesome-webfont.ttf?v=4.7.0',
  'https://sriwijayagrafika.co.id/wp-content/themes/seofication/css/font-awesome-4.7.0/fonts/fontawesome-webfont.svg?v=4.7.0',
  'https://sriwijayagrafika.co.id/wp-content/themes/seofication/style.css',
  'https://sriwijayagrafika.co.id/wp-content/themes/seofication/js/bootstrap.min.js',
  'https://sriwijayagrafika.co.id/wp-content/plugins/click-to-chat-for-whatsapp/new/inc/assets/css/main.css',
  'https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/cropped-SRIWIJAYA-GRAFIKA-1-32x32.jpg',
  'https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/cropped-SRIWIJAYA-GRAFIKA-1-192x192.jpg',
  'https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/cropped-SRIWIJAYA-GRAFIKA-1-180x180.jpg',
  'https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/cropped-SRIWIJAYA-GRAFIKA-1-270x270.jpg',
];

async function downloadFile(url, targetPath) {
  try {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Could not download ${url}: ${res.status}`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(targetPath, buffer);
    console.log(`Saved: ${targetPath}`);
    return true;
  } catch (e) {
    console.error(`Error ${url}:`, e.message);
    return false;
  }
}

async function run() {
  for (const u of urls) {
    const parsed = new URL(u);
    const targetPath = path.join(PUBLIC_DIR, parsed.pathname);
    await downloadFile(u, targetPath);
  }
}

run();
