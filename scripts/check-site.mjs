import fs from 'fs';

const sitemapPath = 'public/sitemap.xml';

if (!fs.existsSync(sitemapPath)) {
  console.error(`Không tìm thấy file ${sitemapPath}. Hãy chạy: node scripts/generate-sitemap.mjs`);
  process.exit(1);
}

const xml = fs.readFileSync(sitemapPath, 'utf8');

const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

console.log(`Checking ${urls.length} URLs from sitemap...\n`);

let ok = 0;
let fail = 0;

for (const url of urls) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'NATA-Sitemap-Checker/1.0'
      }
    });

    if (res.ok) {
      console.log(`OK   ${res.status} ${url}`);
      ok++;
    } else {
      console.log(`FAIL ${res.status} ${url}`);
      fail++;
    }
  } catch (error) {
    console.log(`ERR      ${url}`);
    console.log(`         ${error.message}`);
    fail++;
  }
}

console.log('\nResult:');
console.log(`OK: ${ok}`);
console.log(`FAIL: ${fail}`);

if (fail > 0) {
  console.log('\nCó URL lỗi. Hãy sửa hoặc xóa các URL FAIL khỏi scripts/generate-sitemap.mjs rồi sinh lại sitemap.');
  process.exit(1);
}

console.log('\nTất cả URL trong sitemap đều truy cập được.');