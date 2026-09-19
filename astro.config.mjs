// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';


// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [icon()],
  site: "https://kiafadestapaciones.com.ar",
  env: {
    schema: {
      APIFY_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      GOOGLE_MAPS_PLACE_URL: envField.string({ context: 'server', access: 'public' }),
      CRON_SECRET: envField.string({ context: 'server', access: 'secret'  }),
    },
  },
});