import fs from 'node:fs';
import path from 'node:path';

export interface Category {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface Post {
  id: number;
  date: string;
  modified: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  categories: Category[];
  tags: Tag[];
  author: number;
}

export interface StaticPage {
  id: number;
  date: string;
  modified: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
}

function cleanContentUrls(html: string): string {
  if (!html) return '';
  let cleaned = html
    .replace(/https?:\/\/sriwijayagrafika\.co\.id\/wp-content\//g, '/wp-content/')
    .replace(/https?:\/\/sriwijayagrafika\.co\.id\//g, '/')
    .replace(/https?:\/\/sriwijayagrafika\.co\.id(?=["'\s>])/g, '/');

  // Strip external links from content (unwrap <a> to inner content)
  cleaned = cleaned.replace(/<a\s+[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (match, href, innerHtml) => {
    if (href.includes('sriwijayagrafika.co.id')) return match;
    return innerHtml;
  });

  return cleaned;
}

function cleanExcerpt(html: string): string {
  if (!html) return '';
  return cleanContentUrls(html)
    .replace(/<p\s+class="link-more">[\s\S]*?<\/p>/gi, '')
    .trim();
}

let cachedPosts: Post[] | null = null;
let cachedPages: StaticPage[] | null = null;
let cachedCategories: Category[] | null = null;
let cachedTags: Tag[] | null = null;

export function getAllPosts(): Post[] {
  if (cachedPosts) return cachedPosts;
  const p = path.resolve(process.cwd(), 'src/data/normalized_posts.json');
  const data: Post[] = JSON.parse(fs.readFileSync(p, 'utf8'));
  cachedPosts = data.map(post => ({
    ...post,
    content: cleanContentUrls(post.content),
    excerpt: cleanExcerpt(post.excerpt),
    featured_image: post.featured_image ? post.featured_image.replace(/https:\/\/sriwijayagrafika\.co\.id\/wp-content\//, '/wp-content/') : null
  }));
  return cachedPosts;
}

export function getAllPages(): StaticPage[] {
  if (cachedPages) return cachedPages;
  const p = path.resolve(process.cwd(), 'src/data/normalized_pages.json');
  const data: StaticPage[] = JSON.parse(fs.readFileSync(p, 'utf8'));
  cachedPages = data.map(page => ({
    ...page,
    content: cleanContentUrls(page.content),
    excerpt: cleanExcerpt(page.excerpt),
    featured_image: page.featured_image ? page.featured_image.replace(/https:\/\/sriwijayagrafika\.co\.id\/wp-content\//, '/wp-content/') : null
  }));
  return cachedPages;
}

export function getAllCategories(): Category[] {
  if (cachedCategories) return cachedCategories;
  const p = path.resolve(process.cwd(), 'src/data/categories.json');
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  // Filter out empty or numeric categories
  cachedCategories = data
    .filter((c: any) => c.count > 0 && isNaN(Number(c.slug)))
    .map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c.count
    }));
  return cachedCategories;
}

export function getAllTags(): Tag[] {
  if (cachedTags) return cachedTags;
  const p = path.resolve(process.cwd(), 'src/data/tags.json');
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  cachedTags = data.map((t: any) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    count: t.count
  }));
  return cachedTags;
}

export function getRecentPosts(limit = 5): Post[] {
  return getAllPosts().slice(0, limit);
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
