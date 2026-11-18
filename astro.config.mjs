// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// TODO: keep in sync with SITE_URL in src/lib/siteMeta.ts — update both
// once a custom domain is bought or the Vercel project is renamed.
const SITE_URL = 'https://lechoneriachanchoellechon.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), sitemap()],

  // Disable dev toolbar to prevent SendBeforeConnectError HMR race condition
  devToolbar: {
    enabled: false
  }
});
