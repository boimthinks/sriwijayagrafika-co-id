import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_DIR = path.resolve('public');
const POSTS_FILE = path.resolve('src/data/normalized_posts.json');
const PAGES_FILE = path.resolve('src/data/normalized_pages.json');

const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
const pages = JSON.parse(fs.readFileSync(PAGES_FILE, 'utf8'));

const missing = [];
const checked = new Set();

function checkAsset(urlOrPath) {
  if (!urlOrPath) return;
  if (checked.has(urlOrPath)) return;
  checked.add(urlOrPath);

  let localRel = urlOrPath;
  if (localRel.startsWith('http')) {
    try {
      const u = new URL(urlOrPath);
      if (!u.hostname.includes('sriwijayagrafika.co.id')) return;
      localRel = u.pathname;
    } catch {
      return;
    }
  }

  if (localRel.startsWith('/')) localRel = localRel.slice(1);
  const fullPath = path.join(PUBLIC_DIR, localRel);
  if (!fs.existsSync(fullPath)) {
    missing.push({ source: urlOrPath, localPath: fullPath });
  }
}

for (const item of [...posts, ...pages]) {
  if (item.featured_image) checkAsset(item.featured_image);
  const content = item.content || '';
  const imgMatches = content.match(/src=["']([^"']+)["']/g) || [];
  for (const m of imgMatches) {
    const src = m.replace(/src=["']/, '').replace(/["']$/, '');
    checkAsset(src);
  }
}

console.log(`Checked ${checked.size} referenced assets.`);
if (missing.length === 0) {
  console.log('All referenced assets exist locally!');
} else {
  console.log(`Missing ${missing.length} assets:`);
  missing.forEach(m => console.log(' -', m.source));
}
