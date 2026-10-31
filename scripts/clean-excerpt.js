import fs from 'node:fs';
import path from 'node:path';

for (const rel of ['src/data/normalized_posts.json', 'src/data/normalized_pages.json']) {
  const p = path.resolve(rel);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const item of data) {
    if (item.excerpt) {
      item.excerpt = item.excerpt.replace(/<p\s+class="link-more">[\s\S]*?<\/p>/gi, '').trim();
    }
  }
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Cleaned excerpt in ${rel}`);
}
