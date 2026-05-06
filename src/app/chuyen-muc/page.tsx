import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CATEGORY_TREE: Record<string, string[]> = {
  'tin-tuc': ['tin-tuc', 'thong-bao', 'su-kien'],
  'nguoi-ngoc-dien': ['nguoi-ngoc-dien', 'nguoi-ngoc-dien-chung', 'me-vnah', 'liet-sy', 'anh-hung', 'dang-vien'],
  'lich-su': ['lich-su'],
  'tieng-lang': ['tieng-lang', 'tan-van', 'tan-man', 'tho', 'kham-pha', 'goc-nhin-thang', 'podcast'],
  'di-tich': ['di-tich', 'den', 'gieng'],
  'le-hoi': ['le-hoi', 'le-hoi-den', 'le-hoi-xom', 'le-hoi-gieng'],
  'thu-vien': ['thu-vien', 'huong-uoc', 'dang-bo']
};

const CAT_LABELS: Record<string, string> = {
  'tin-tuc': 'Tin tức', 'thong-bao': 'Thông báo', 'su-kien': 'Sự kiện',
  'nguoi-ngoc-dien': 'Người Ngọc Điền', 'nguoi-ngoc-dien-chung': 'Giới thiệu', 'me-vnah': 'Mẹ VNAH', 'liet-sy': 'Liệt sỹ', 'anh-hung': 'Anh hùng', 'dang-vien': 'Đảng viên',
  'tieng-lang': 'Tiếng làng', 'tan-van': 'Tản văn', 'tan-man': 'Tản mạn', 'tho': 'Thơ', 'kham-pha': 'Khám phá', 'goc-nhin-thang': 'Góc nhìn', 'podcast': 'Podcast',
  'di-tich': 'Di tích', 'den': 'Đền Ngọc Điền', 'gieng': 'Giếng làng',
  'le-hoi': 'Lễ hội', 'le-hoi-den': 'Lễ hội Đền', 'le-hoi-xom': 'Lễ hội Xóm', 'le-hoi-gieng': 'Lễ hội Giếng',
  'thu-vien': 'Thư viện', 'huong-uoc': 'Hương ước', 'dang-bo': 'Đảng bộ'
};

export default async function CategoryPage({ params }: { params: any }) {
  // 1. LẤY URL VÀ "GỌT SẠCH" TRANG TRÍ
  const rawCat = params?.cat || "";
  let currentCat = decodeURIComponent(rawCat).toLowerCase();
  
  // 🔥 BÙA MỚI: Xóa bỏ dấu gạch ngang dài (—) và khoảng trắng dư thừa
  currentCat = currentCat.replace(/^—\s*/, '').trim(); 
  
  let searchIds: string[] = [];
  
  // 2. KIỂM TRA GIA PHẢ
  if (CATEGORY_TREE[currentCat]) {
    searchIds = CATEGORY_TREE[currentCat];
  } else {
    searchIds = [currentCat];
    
    // Tự động khớp lỗi có dấu/không dấu cho các mục phổ biến
    if (currentCat === 'thơ' || currentCat === 'tho') searchIds = ['tho', 'thơ'];
    if (currentCat === 'tản văn' || currentCat === 'tan-van') searchIds = ['tan-van', 'tản văn'];
  }

  // 3. HÚT DỮ LIỆU
  const { data: arts } = await supabase
    .from('articles')
    .select('*')
    .in('cat', searchIds)
    .order('id', { ascending: false });

  const artsList = arts || [];
  const label = CAT_LABELS[currentCat] || currentCat.toUpperCase();

  return (
    <div style={{ minHeight:"100vh", background:"#FEF9F2" }}>
      <Header />
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"20px 16px" }}>
        
        <div style={{ background:"linear-gradient(135deg,#9B1B14,#B91C1C)", color:"#fff",
          borderRadius:12, padding:"30px", marginBottom:25 }}>
          <h1 style={{ fontSize:24, fontWeight:900, margin:0 }}>{label}</h1>
          <p style={{ opacity:.8, margin:"5px 0 0 0" }}>{artsList.length} bài viết</p>
        </div>

        {artsList.length > 0 ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
            {artsList.map((a: any) => (
              <Link href={`/bai-viet/${a.slug}`} key={a.id} style={{ textDecoration:"none", color:"inherit" }}>
                <div style={{ background:"#fff", borderRadius:8, overflow:"hidden", border:"1px solid #E8DDD0" }}>
                  <img src={a.img || '/logo.png'} style={{ width:"100%", height:160, objectFit:"cover" }} />
                  <div style={{ padding:15 }}>
                    <span style={{ color:"#B91C1C", fontSize:11, fontWeight:700 }}>
                        {CAT_LABELS[a.cat] || a.cat}
                    </span>
                    <h3 style={{ fontSize:15, marginTop:5, fontWeight:700 }}>{a.title}</h3>
                    <p style={{ fontSize:12, color:"#666", marginTop:5 }} className="line-clamp-2">{a.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"100px 0", border:"2px dashed #ccc", borderRadius:12 }}>
            <p>Không thấy bài viết nào cho mục <b>{label}</b>.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}