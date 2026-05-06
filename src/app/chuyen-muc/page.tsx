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

const PARENT_INFO: Record<string, { label: string, icon: string }> = {
  'tin-tuc': { label: 'TIN TỨC', icon: '📰' },
  'nguoi-ngoc-dien': { label: 'NGƯỜI NGỌC ĐIỀN', icon: '👥' },
  'lich-su': { label: 'LỊCH SỬ', icon: '📜' },
  'tieng-lang': { label: 'TIẾNG LÀNG', icon: '✍️' },
  'di-tich': { label: 'DI TÍCH', icon: '🏛️' },
  'le-hoi': { label: 'LỄ HỘI', icon: '🎊' },
  'thu-vien': { label: 'THƯ VIỆN', icon: '📚' }
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
  const rawCat = params?.cat || "";
  let currentCat = decodeURIComponent(rawCat).toLowerCase().replace(/^[—\-\s]+/, '').trim(); 
  
  // 1. Tìm mục Cha để hiện Sub-menu
  let parentKey = currentCat;
  for (const [parent, children] of Object.entries(CATEGORY_TREE)) {
    if (children.includes(currentCat)) {
      parentKey = parent;
      break;
    }
  }

  // 2. Lấy danh sách con để hiện các nút bấm
  const subCategories = CATEGORY_TREE[parentKey] || [];
  
  // 3. Logic lấy bài viết
  const searchIds = CATEGORY_TREE[currentCat] ? CATEGORY_TREE[currentCat] : [currentCat];
  if (currentCat === 'thơ' || currentCat === 'tho') searchIds.push('tho', 'thơ');

  const { data: arts } = await supabase
    .from('articles')
    .select('*')
    .in('cat', searchIds)
    .order('id', { ascending: false });

  const artsList = arts || [];
  const categoryInfo = PARENT_INFO[parentKey] || { label: 'CHUYÊN MỤC', icon: '📄' };

  return (
    <div style={{ minHeight:"100vh", background:"#FEF9F2", color:"#1C1C1C" }}>
      <Header />
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 16px" }}>
        
        {/* Banner Chuyên mục */}
        <div style={{ background:"linear-gradient(135deg,#9B1B14,#B91C1C)", color:"#fff",
          borderRadius:"0 0 12px 12px", padding:"30px 20px", marginBottom:20,
          display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:32 }}>{categoryInfo.icon}</div>
          <div>
            <h1 style={{ fontSize:24, fontWeight:900 }}>{categoryInfo.label?.toUpperCase()}</h1>
            <p style={{ opacity:.7, fontSize:13 }}>{artsList.length} bài viết nội dung</p>
          </div>
        </div>

        {/* 🔥 THANH DANH MỤC CON (Mới bổ sung theo ý anh) */}
        {subCategories.length > 1 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:25, paddingBottom:15, borderBottom:"1px solid #E8DDD0" }}>
            <Link href={`/chuyen-muc/${parentKey}`} 
              style={{ padding:"6px 15px", borderRadius:20, fontSize:13, fontWeight:600, textDecoration:"none",
              background: currentCat === parentKey ? "#B91C1C" : "#fff",
              color: currentCat === parentKey ? "#fff" : "#666",
              border: "1px solid" + (currentCat === parentKey ? "#B91C1C" : "#E8DDD0") }}>
              Tất cả
            </Link>
            {subCategories.map(sub => (
              <Link href={`/chuyen-muc/${sub}`} key={sub}
                style={{ padding:"6px 15px", borderRadius:20, fontSize:13, fontWeight:600, textDecoration:"none",
                background: currentCat === sub ? "#B91C1C" : "#fff",
                color: currentCat === sub ? "#fff" : "#666",
                border: "1px solid" + (currentCat === sub ? "#B91C1C" : "#E8DDD0") }}>
                {CAT_LABELS[sub] || sub}
              </Link>
            ))}
          </div>
        )}

        {/* Danh sách bài viết */}
        {artsList.length > 0 ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:20 }}>
            {artsList.map((a: any) => (
              <Link href={`/bai-viet/${a.slug}`} key={a.id} style={{ textDecoration:"none", color:"inherit" }}>
                <div style={{ background:"#fff", borderRadius:8, overflow:"hidden", border:"1px solid #E8DDD0" }}>
                  <img src={a.img || '/logo.png'} style={{ width:"100%", height:160, objectFit:"cover" }} />
                  <div style={{ padding:15 }}>
                    <span style={{ color:"#B91C1C", fontSize:10, fontWeight:800, textTransform:"uppercase" }}>
                        {CAT_LABELS[a.cat] || a.cat}
                    </span>
                    <h3 style={{ fontSize:15, marginTop:6, fontWeight:700, lineHeight:1.4 }}>{a.title}</h3>
                    <p style={{ fontSize:12, color:"#666", marginTop:8, lineHeight:1.5 }} className="line-clamp-2">
                        {a.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"100px 0", border:"2px dashed #E8DDD0", borderRadius:12 }}>
            <p>Hiện chưa có bài viết nào trong mục này.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}