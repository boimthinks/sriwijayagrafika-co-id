import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sriwijayagrafika.co.id',
  trailingSlash: 'always',
  integrations: [sitemap()]
});
