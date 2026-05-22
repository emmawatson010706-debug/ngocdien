import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://www.ngocdien.info.vn';
const outputPath = path.resolve('public/sitemap.xml');

const today = new Date().toISOString().split('T')[0];

const urls = [
  '/'
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((route) => {
    const loc = `${SITE_URL}${route}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;

fs.writeFileSync(outputPath, xml, 'utf8');

console.log(`Generated sitemap with ${urls.length} URLs: ${outputPath}`);