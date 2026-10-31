import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const BASE_URL = 'https://sriwijayagrafika.co.id';
const DATA_DIR = path.join(ROOT_DIR, 'src', 'data');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

async function fetchAllPages(endpoint) {
  let page = 1;
  const allResults = [];
  while (true) {
    const url = `${BASE_URL}/wp-json/wp/v2/${endpoint}?per_page=100&page=${page}`;
    console.log(`Fetching ${url}...`);
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 400 || res.status === 404) {
        // End of pages
        break;
      }
      console.error(`Failed ${url}: ${res.status} ${res.statusText}`);
      break;
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    allResults.push(...data);
    const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
    console.log(`  Fetched page ${page} of ${totalPages} (${data.length} items)`);
    if (page >= totalPages) break;
    page++;
  }
  return allResults;
}

async function downloadFile(url, targetPath) {
  try {
    if (fs.existsSync(targetPath)) return true;
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Could not download ${url}: ${res.status}`);
      return false;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(targetPath, buffer);
    return true;
  } catch (err) {
    console.warn(`Error downloading ${url}:`, err.message);
    return false;
  }
}

async function run() {
  console.log('--- 1. Fetching Categories ---');
  const categories = await fetchAllPages('categories');
  fs.writeFileSync(path.join(DATA_DIR, 'categories.json'), JSON.stringify(categories, null, 2));
  console.log(`Total Categories: ${categories.length}`);

  const categoryMap = new Map();
  for (const cat of categories) {
    categoryMap.set(cat.id, cat);
  }

  console.log('--- 2. Fetching Tags ---');
  const tags = await fetchAllPages('tags');
  fs.writeFileSync(path.join(DATA_DIR, 'tags.json'), JSON.stringify(tags, null, 2));
  console.log(`Total Tags: ${tags.length}`);

  const tagMap = new Map();
  for (const t of tags) {
    tagMap.set(t.id, t);
  }

  console.log('--- 3. Fetching Static Pages ---');
  const pages = await fetchAllPages('pages');
  fs.writeFileSync(path.join(DATA_DIR, 'pages.json'), JSON.stringify(pages, null, 2));
  console.log(`Total Pages: ${pages.length}`);

  console.log('--- 4. Fetching Posts ---');
  const posts = await fetchAllPages('posts');
  fs.writeFileSync(path.join(DATA_DIR, 'posts.json'), JSON.stringify(posts, null, 2));
  console.log(`Total Posts: ${posts.length}`);

  console.log('--- 5. Fetching Media Items ---');
  const media = await fetchAllPages('media');
  fs.writeFileSync(path.join(DATA_DIR, 'media.json'), JSON.stringify(media, null, 2));
  console.log(`Total Media: ${media.length}`);

  const mediaMap = new Map();
  for (const m of media) {
    mediaMap.set(m.id, m);
  }

  // Collect all image URLs to download locally
  console.log('--- 6. Extracting Image URLs & Downloading Assets ---');
  const imageUrls = new Set();

  for (const m of media) {
    if (m.source_url) imageUrls.add(m.source_url);
    if (m.media_details && m.media_details.sizes) {
      for (const sizeKey of Object.keys(m.media_details.sizes)) {
        const s = m.media_details.sizes[sizeKey];
        if (s && s.source_url) imageUrls.add(s.source_url);
      }
    }
  }

  // Also scan content for any images
  const contentRegex = /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|gif|webp|svg|ico)/gi;
  for (const item of [...posts, ...pages]) {
    const rawContent = (item.content && item.content.rendered) || '';
    const matches = rawContent.match(contentRegex) || [];
    for (const match of matches) {
      if (match.includes('sriwijayagrafika.co.id')) {
        imageUrls.add(match);
      }
    }
  }

  // Common site assets
  imageUrls.add('https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/SG-LOGO.png');
  imageUrls.add('https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/cropped-SRIWIJAYA-GRAFIKA-1-32x32.jpg');
  imageUrls.add('https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/cropped-SRIWIJAYA-GRAFIKA-1-192x192.jpg');
  imageUrls.add('https://sriwijayagrafika.co.id/wp-content/uploads/2020/09/sriwijaya-grafika-jasa-advertising-palembang.jpg');
  imageUrls.add('https://sriwijayagrafika.co.id/wp-content/uploads/2020/09/JPEG-SRIWIJAYA-GRAFIKA.jpg');
  imageUrls.add('https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/PLAKAT.png');
  imageUrls.add('https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/hruf-timbul.png');
  imageUrls.add('https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/neon.png');
  imageUrls.add('https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/pnt.png');
  imageUrls.add('https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/icon-cetak.png');
  imageUrls.add('https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/acrilic.png');
  imageUrls.add('https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/booth.png');
  imageUrls.add('https://sriwijayagrafika.co.id/wp-content/uploads/2020/08/pl-1.png');

  console.log(`Found ${imageUrls.size} unique images/assets to download.`);

  let downloadedCount = 0;
  const urlList = Array.from(imageUrls);
  const CONCURRENCY = 8;
  
  for (let i = 0; i < urlList.length; i += CONCURRENCY) {
    const batch = urlList.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async (imgUrl) => {
      try {
        const parsed = new URL(imgUrl);
        const relPath = parsed.pathname.startsWith('/') ? parsed.pathname.slice(1) : parsed.pathname;
        const targetPath = path.join(PUBLIC_DIR, relPath);
        const ok = await downloadFile(imgUrl, targetPath);
        if (ok) downloadedCount++;
      } catch (e) {
        console.warn(`Invalid URL: ${imgUrl}`);
      }
    }));
    if (downloadedCount % 100 === 0 || i + CONCURRENCY >= urlList.length) {
      console.log(`  Downloaded / verified ${downloadedCount} / ${urlList.length} assets...`);
    }
  }

  console.log(`Done downloading ${downloadedCount} assets!`);

  // Build clean normalized posts data
  console.log('--- 7. Building Normalized Post & Page Datasets ---');
  const normalizedPosts = posts.map(p => {
    const featuredMedia = mediaMap.get(p.featured_media);
    const postCats = (p.categories || []).map(cid => categoryMap.get(cid)).filter(Boolean);
    const postTags = (p.tags || []).map(tid => tagMap.get(tid)).filter(Boolean);

    return {
      id: p.id,
      date: p.date,
      modified: p.modified,
      slug: p.slug,
      title: p.title?.rendered || '',
      content: p.content?.rendered || '',
      excerpt: p.excerpt?.rendered || '',
      featured_image: featuredMedia ? featuredMedia.source_url : null,
      categories: postCats.map(c => ({ id: c.id, name: c.name, slug: c.slug })),
      tags: postTags.map(t => ({ id: t.id, name: t.name, slug: t.slug })),
      author: p.author
    };
  });
  fs.writeFileSync(path.join(DATA_DIR, 'normalized_posts.json'), JSON.stringify(normalizedPosts, null, 2));

  const normalizedPages = pages.map(p => {
    const featuredMedia = mediaMap.get(p.featured_media);
    return {
      id: p.id,
      date: p.date,
      modified: p.modified,
      slug: p.slug,
      title: p.title?.rendered || '',
      content: p.content?.rendered || '',
      excerpt: p.excerpt?.rendered || '',
      featured_image: featuredMedia ? featuredMedia.source_url : null
    };
  });
  fs.writeFileSync(path.join(DATA_DIR, 'normalized_pages.json'), JSON.stringify(normalizedPages, null, 2));

  console.log('Data migration complete! Ready for Astro.');
}

run().catch(console.error);
