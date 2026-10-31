import fs from 'node:fs';

const posts = JSON.parse(fs.readFileSync('src/data/normalized_posts.json', 'utf8'));
const pages = JSON.parse(fs.readFileSync('src/data/normalized_pages.json', 'utf8'));

const allItems = [
  ...posts.map(p => ({ ...p, itemType: 'Artikel' })),
  ...pages.map(p => ({ ...p, itemType: 'Halaman Statis' }))
];

const linkRegex = /<a\s+[^>]*href=[\"']([^\"']+)[\"'][^>]*>([\s\S]*?)<\/a>/gi;

const allLinks = [];

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
          allLinks.push({
            type: item.itemType,
            title: item.title,
            slug: item.slug,
            domain: u.hostname,
            href,
            anchorText: anchorText || '(tanpa teks)',
            fullTag
          });
        } catch (e) {}
      }
    }
  }
}

for (let i = 0; i < allLinks.length; i++) {
  const l = allLinks[i];
  console.log(`${i + 1}. [${l.domain}] "${l.anchorText}" -> ${l.href} | Page: ${l.slug}`);
}
