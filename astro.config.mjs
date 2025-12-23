// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel/server';
import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  output: "server",
  adapter: vercel(),
  integrations: [],
  site: "https://kiafa-one.vercel.app",
  env: {
    schema: {
      APIFY_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      GOOGLE_MAPS_PLACE_URL: envField.string({ context: 'server', access: 'public' }),
      CRON_SECRET: envField.string({ context: 'server', access: 'secret'  }),
    },
  },
});