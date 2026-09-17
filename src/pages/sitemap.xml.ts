import { getCollection } from 'astro:content';

export async function GET() {
  const locations = await getCollection('locations');

  // <lastmod> is emitted only when the content file declares updatedAt.
  // Never fall back to the build date — a uniform "today" on every URL is
  // the original defect this fixes, not a legitimate substitute.
  const lastmodTag = (updatedAt: string | undefined) =>
    updatedAt ? `\n    <lastmod>${updatedAt}</lastmod>` : '';

  const locationUrls = locations.map(location => `
  <url>
    <loc>https://kiafadestapaciones.com.ar/${location.slug}</loc>${lastmodTag(location.data.updatedAt)}
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const homeLastmod = locations
    .map(location => location.data.updatedAt)
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kiafadestapaciones.com.ar/</loc>${lastmodTag(homeLastmod)}
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