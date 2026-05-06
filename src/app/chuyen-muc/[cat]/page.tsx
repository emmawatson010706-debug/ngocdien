import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 🔥 TỪ ĐIỂN GIA PHẢ: HỖ TRỢ VÔ HẠN ĐỜI (MẸ - CON - CHÁU - CHẮT)
const ALL_CATEGORIES = [
  // MẸ: TIN TỨC
  { id: 'tin-tuc', parent: null, label: 'Tin tức', icon: '📰' },
  { id: 'thong-bao', parent: 'tin-tuc', label: 'Thông báo' },
  { id: 'su-kien', parent: 'tin-tuc', label: 'Sự kiện' },

  // MẸ: NGƯỜI NGỌC ĐIỀN
  { id: 'nguoi-ngoc-dien', parent: null, label: 'Người Ngọc Điền', icon: '👥' },
  { id: 'nguoi-ngoc-dien-chung', parent: 'nguoi-ngoc-dien', label: 'Giới thiệu chung' },
  { id: 'me-vnah', parent: 'nguoi-ngoc-dien', label: 'Mẹ VNAH' },
  { id: 'liet-sy', parent: 'nguoi-ngoc-dien', label: 'Liệt sỹ' },
  { id: 'anh-hung', parent: 'nguoi-ngoc-dien', label: 'Anh hùng' },
  { id: 'dang-vien', parent: 'nguoi-ngoc-dien', label: 'Đảng viên' },

  // MẸ: TIẾNG LÀNG
  { id: 'tieng-lang', parent: null, label: 'Tiếng làng', icon: '✍️' },
  { id: 'tan-van', parent: 'tieng-lang', label: 'Tản văn' },
  { id: 'tan-man', parent: 'tieng-lang', label: 'Tản mạn' },
  { id: 'tho', parent: 'tieng-lang', label: 'Thơ' }, 
  { id: 'kham-pha', parent: 'tieng-lang', label: 'Khám phá' },
  { id: 'goc-nhin-thang', parent: 'tieng-lang', label: 'Góc nhìn thẳng' },
  { id: 'podcast', parent: 'tieng-lang', label: 'Podcast' },

  // MẸ: DI TÍCH
  { id: 'di-tich', parent: null, label: 'Di tích', icon: '🏛️' },
  { id: 'den', parent: 'di-tich', label: 'Đền Ngọc Điền' },
  { id: 'gieng', parent: 'di-tich', label: 'Giếng làng' },

  // MẸ: LỄ HỘI
  { id: 'le-hoi', parent: null, label: 'Lễ hội', icon: '🎊' },
  { id: 'le-hoi-den', parent: 'le-hoi', label: 'Lễ hội Đền' },
  { id: 'le-hoi-xom', parent: 'le-hoi', label: 'Lễ hội Xóm' },
  { id: 'le-hoi-gieng', parent: 'le-hoi', label: 'Lễ hội Giếng' },

  // MẸ: THƯ VIỆN
  { id: 'thu-vien', parent: null, label: 'Thư viện', icon: '📚' },
  { id: 'huong-uoc', parent: 'thu-vien', label: 'Hương ước' },
  { id: 'dang-bo', parent: 'thu-vien', label: 'Đảng bộ' }

  // 💡 NẾU SAU NÀY ANH CÓ TRANG CHÁU, CHỈ CẦN THÊM VÀO ĐÂY
  // Ví dụ: { id: 'tho-luc-bat', parent: 'tho', label: 'Thơ Lục Bát' }
];

// Hàm đệ quy tìm TẤT CẢ các đời con cháu
function getDescendants(parentId: string): string[] {
  const children = ALL_CATEGORIES.filter(c => c.parent === parentId).map(c => c.id);
  let all = [...children];
  for (const child of children) {
    all = [...all, ...getDescendants(child)];
  }
  return all;
}

// Hàm đệ quy tìm Mẹ cao nhất để lấy Icon
function getRootParent(id: string): any {
  const node = ALL_CATEGORIES.find(c => c.id === id);
  if (!node) return null;
  if (!node.parent) return node;
  return getRootParent(node.parent);
}

export default async function CategoryPage({ params }: { params: any }) {
  // 1. GỌT URL SẠCH SẼ (Tránh lỗi dấu gạch ngang từ Header)
  const rawCat = params?.cat || "";
  const currentCat = decodeURIComponent(rawCat).toLowerCase().replace(/^[—\-\s]+/, '').trim(); 
  
  // 2. TÌM THÔNG TIN NODE HIỆN TẠI VÀ NODE MẸ
  const currentNode = ALL_CATEGORIES.find(c => c.id === currentCat) || { id: currentCat, parent: null, label: currentCat, icon: '📄' };
  const rootNode = getRootParent(currentCat) || currentNode;

  // 3. LOGIC HIỂN THỊ MENU CON SIÊU THÔNG MINH
  // - Nếu mục này CÓ con -> Hiện các con của nó
  // - Nếu mục này KHÔNG CÓ con -> Hiện các anh em của nó (để giữ menu không bị biến mất)
  let subCategories = ALL_CATEGORIES.filter(c => c.parent === currentCat);
  if (subCategories.length === 0 && currentNode.parent) {
    subCategories = ALL_CATEGORIES.filter(c => c.parent === currentNode.parent);
  }
  
  // 4. LẤY BÀI VIẾT: GOM CỦA MỤC HIỆN TẠI VÀ TOÀN BỘ CON CHÁU BÊN DƯỚI
  let rawSearchIds = [currentCat, ...getDescendants(currentCat)];
  
  // Xử lý bù trừ lỗi gõ tiếng Việt có/không dấu trong database
  const aliases: Record<string, string[]> = {
    'tho': ['tho', 'thơ'], 'thơ': ['tho', 'thơ'],
    'tan-van': ['tan-van', 'tản văn'], 'tản văn': ['tan-van', 'tản văn']
  };
  let searchIds: string[] = [];
  rawSearchIds.forEach(id => {
    if (aliases[id]) searchIds.push(...aliases[id]);
    else searchIds.push(id);
  });

  // 5. TRUY VẤN
  const { data: arts } = await supabase
    .from('articles')
    .select('*')
    .in('cat', searchIds)
    .order('id', { ascending: false });

  const artsList = arts || [];

  return (
    <div style={{ minHeight:"100vh", background:"#FEF9F2", color:"#1C1C1C" }}>
      <Header />
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 16px" }}>
        
        {/* Banner Đỏ */}
        <div style={{ background:"linear-gradient(135deg,#9B1B14,#B91C1C)", color:"#fff",
          borderRadius:"0 0 12px 12px", padding:"30px 20px", marginBottom:20,
          display:"flex", alignItems:"center", gap:16, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize:32 }}>{rootNode.icon || '📄'}</div>
          <div>
            <h1 style={{ fontSize:24, fontWeight:900, textTransform:"uppercase" }}>{currentNode.label}</h1>
            <p style={{ opacity:.8, fontSize:13, marginTop:4 }}>{artsList.length} bài viết trong mục này</p>
          </div>
        </div>

        {/* Thanh Menu Nút bấm (Tự động thích ứng theo Tầng) */}
        {subCategories.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:25, paddingBottom:15, borderBottom:"1px solid #E8DDD0" }}>
            
            {/* Nút quay lại mục Mẹ nếu đang ở mục Con/Cháu */}
            {currentNode.parent && (
              <Link href={`/chuyen-muc/${currentNode.parent}`} 
                style={{ padding:"6px 15px", borderRadius:20, fontSize:13, fontWeight:600, textDecoration:"none",
                background: "#fff", color: "#666", border: "1px solid #E8DDD0" }}>
                ← Quay lại
              </Link>
            )}

            {subCategories.map(sub => (
              <Link href={`/chuyen-muc/${sub.id}`} key={sub.id}
                style={{ padding:"6px 15px", borderRadius:20, fontSize:13, fontWeight:600, textDecoration:"none",
                background: currentCat === sub.id ? "#B91C1C" : "#fff",
                color: currentCat === sub.id ? "#fff" : "#666",
                border: "1px solid " + (currentCat === sub.id ? "#B91C1C" : "#E8DDD0") }}>
                {sub.label}
              </Link>
            ))}
          </div>
        )}

        {/* Danh sách bài viết */}
        {artsList.length > 0 ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:22 }}>
            {artsList.map((a: any) => {
              // Tìm nhãn xịn để hiển thị
              const displayLabel = ALL_CATEGORIES.find(c => c.id === a.cat)?.label || a.cat;
              return (
                <Link href={`/bai-viet/${a.slug}`} key={a.id} style={{ textDecoration:"none", color:"inherit" }}>
                  <div style={{ background:"#fff", borderRadius:10, overflow:"hidden", border:"1px solid #E8DDD0", transition:"transform 0.2s" }}>
                    <img src={a.img || '/logo.png'} style={{ width:"100%", height:170, objectFit:"cover" }} />
                    <div style={{ padding:15 }}>
                      <span style={{ color:"#B91C1C", fontSize:10, fontWeight:800, textTransform:"uppercase" }}>
                          {displayLabel}
                      </span>
                      <h3 style={{ fontSize:15, marginTop:7, fontWeight:700, lineHeight:1.4 }}>{a.title}</h3>
                      <p style={{ fontSize:12, color:"#666", marginTop:8, lineHeight:1.5 }} className="line-clamp-2">
                          {a.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"100px 0", border:"2px dashed #E8DDD0", borderRadius:12 }}>
            <p style={{ color:"#888" }}>Chưa có bài viết nào trong chuyên mục <b>{currentNode.label}</b>.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}