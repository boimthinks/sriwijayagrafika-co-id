import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const files = [
  'https://sriwijayagrafika.co.id/wp-content/themes/seofication/images/section_img.jpg',
  'https://sriwijayagrafika.co.id/wp-content/themes/seofication/images/footer-image.jpg',
  'https://sriwijayagrafika.co.id/wp-content/themes/seofication/css/font-awesome-4.7.0/fonts/fontawesome-webfont.eot',
  'https://sriwijayagrafika.co.id/wp-content/themes/seofication/images/search-icon.png',
  'https://sriwijayagrafika.co.id/wp-content/themes/seofication/images/slider_img.jpg'
];

async function download(url) {
  try {
    const parsed = new URL(url);
    const targetPath = path.join(PUBLIC_DIR, parsed.pathname);
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Status ${res.status} for ${url}`);
      return;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(targetPath, buf);
    console.log(`Successfully downloaded: ${parsed.pathname}`);
  } catch (err) {
    console.error(`Error ${url}:`, err.message);
  }
}

async function run() {
  for (const f of files) {
    await download(f);
  }
}

run();
