import { getCollection } from 'astro:content';

export async function GET() {
  const locations = await getCollection('locations');
  const today = new Date().toISOString().split('T')[0];

  const locationUrls = locations.map(location => `
  <url>
    <loc>https://kiafadestapaciones.com.ar/${location.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kiafadestapaciones.com.ar/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>${locationUrls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600, s-maxage=3600'
    },
  });
}