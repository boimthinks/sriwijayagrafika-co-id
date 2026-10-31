import fs from 'node:fs';
import path from 'node:path';

const posts = JSON.parse(fs.readFileSync('src/data/normalized_posts.json', 'utf8'));
const pages = JSON.parse(fs.readFileSync('src/data/normalized_pages.json', 'utf8'));

const allItems = [
  ...posts.map(p => ({ ...p, itemType: 'Artikel Post' })),
  ...pages.map(p => ({ ...p, itemType: 'Halaman Statis' }))
];

const linkRegex = /<a\s+[^>]*href=[\"']([^\"']+)[\"'][^>]*>([\s\S]*?)<\/a>/gi;

const allFoundLinks = [];

for (const item of allItems) {
  const content = item.content || '';
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const href = match[1];
    const rawInnerHtml = match[2];
    const anchorText = rawInnerHtml.replace(/<[^>]+>/g, '').trim();

    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (!href.includes('sriwijayagrafika.co.id')) {
        try {
          const u = new URL(href);
          allFoundLinks.push({
            itemType: item.itemType,
            id: item.id,
            title: item.title,
            slug: item.slug,
            domain: u.hostname,
            href,
            anchorText: anchorText || '(tanpa teks)',
            rawInnerHtml,
            fullTag
          });
        } catch (e) {
          // ignore invalid url
        }
      }
    }
  }
}

console.log(`Total external links found: ${allFoundLinks.length}`);

// Group by domain
const byDomain = {};
for (const l of allFoundLinks) {
  if (!byDomain[l.domain]) byDomain[l.domain] = [];
  byDomain[l.domain].push(l);
}

for (const [dom, list] of Object.entries(byDomain)) {
  console.log(`- ${dom}: ${list.length} tautan`);
}
