import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://www.ngocdien.info.vn';
const outputPath = path.resolve('public/sitemap.xml');

const today = new Date().toISOString().split('T')[0];

const urls = [
  '/',
  '/gioi-thieu',
  '/loa-xom',
  '/nguoi-ngoc-dien',
  '/lich-su-xom-ngoc-dien',
  '/tieng-lang',
  '/di-tich',
  '/le-hoi',
  '/thu-vien',
  '/chuyen-doi-so',
  '/gop-y-gui-bai',
  '/tieng-lang/chieu-ve-tren-xom-cu',
  '/loa-xom/ky-niem-50-nam-ngay-giai-phong-mien-nam',
  '/loa-xom/thong-bao-lich-hop-chi-bo-thang-5-2025',
  '/nguoi-ngoc-dien/me-viet-nam-anh-hung',
  '/nguoi-ngoc-dien/danh-sach-liet-sy-xom-ngoc-dien',
  '/lich-su-xom-ngoc-dien/ngoc-dien-vung-dat-dia-linh-nhan-kiet-ben-dong-song-lam',
  '/di-tich/den-ngoc-dien',
  '/di-tich/gieng-lang',
  '/le-hoi/le-hoi-den',
  '/le-hoi/le-hoi-gieng-dau-nam',
  '/thu-vien/huong-uoc-xom-ngoc-dien-1883'
];

const uniqueUrls = [...new Set(urls)];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls
  .map((route) => {
    const loc = `${SITE_URL}${route}`;
    const priority = route === '/' ? '1.0' : route.split('/').length <= 2 ? '0.8' : '0.7';
    const changefreq = route === '/' ? 'weekly' : 'monthly';

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;

fs.writeFileSync(outputPath, xml, 'utf8');

console.log(`Generated sitemap with ${uniqueUrls.length} URLs: ${outputPath}`);