import Link from "next/link";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { supabase } from "@/lib/supabase/client";

// 🔥 1. SƠ ĐỒ GIA PHẢ: Dạy cho máy biết mục Cha gồm những mục Con nào
const CATEGORY_TREE: Record<string, string[]> = {
  'tin-tuc': ['tin-tuc', 'thong-bao', 'su-kien'],
  'nguoi-ngoc-dien': ['nguoi-ngoc-dien', 'nguoi-ngoc-dien-chung', 'me-vnah', 'liet-sy', 'anh-hung', 'dang-vien'],
  'lich-su': ['lich-su'],
  'tieng-lang': ['tieng-lang', 'tan-van', 'tho', 'kham-pha', 'goc-nhin-thang', 'podcast'],
  'di-tich': ['di-tich', 'den', 'gieng'],
  'le-hoi': ['le-hoi', 'le-hoi-den', 'le-hoi-xom', 'le-hoi-gieng'],
  'thu-vien': ['thu-vien', 'huong-uoc', 'dang-bo']
};

// 🔥 2. TRANG TRÍ MẶT TIỀN: Tên và Icon của các mục Cha
const PARENT_INFO: Record<string, { label: string, icon: string }> = {
  'tin-tuc': { label: 'TIN TỨC', icon: '📰' },
  'nguoi-ngoc-dien': { label: 'NGƯỜI NGỌC ĐIỀN', icon: '👥' },
  'lich-su': { label: 'LỊCH SỬ', icon: '📜' },
  'tieng-lang': { label: 'TIẾNG LÀNG', icon: '✍️' },
  'di-tich': { label: 'DI TÍCH', icon: '🏛️' },
  'le-hoi': { label: 'LỄ HỘI', icon: '🎊' },
  'thu-vien': { label: 'THƯ VIỆN', icon: '📚' }
};

// 🔥 3. NHÃN DÁN CHO BÀI VIẾT (Ví dụ bài thuộc Tản văn thì dán nhãn "Tản văn")
const CAT_LABELS: Record<string, string> = {
  'tin-tuc': 'Tin tức', 'thong-bao': 'Thông báo', 'su-kien': 'Sự kiện',
  'nguoi-ngoc-dien': 'Người Ngọc Điền', 'nguoi-ngoc-dien-chung': 'Giới thiệu chung', 'me-vnah': 'Mẹ VNAH', 'liet-sy': 'Liệt sỹ', 'anh-hung': 'Anh hùng', 'dang-vien': 'Đảng viên',
  'tieng-lang': 'Tiếng làng', 'tan-van': 'Tản văn', 'tho': 'Thơ', 'kham-pha': 'Khám phá', 'goc-nhin-thang': 'Góc nhìn', 'podcast': 'Podcast',
  'di-tich': 'Di tích', 'den': 'Đền Ngọc Điền', 'gieng': 'Giếng làng',
  'le-hoi': 'Lễ hội', 'le-hoi-den': 'Lễ hội Đền', 'le-hoi-xom': 'Lễ hội Xóm', 'le-hoi-gieng': 'Lễ hội Giếng',
  'thu-vien': 'Thư viện', 'huong-uoc': 'Hương ước 1883', 'dang-bo': 'Đảng bộ'
};

// Giao diện 1 thẻ bài viết thu gọn
function ACard({ a }: { a: any }) {
  return (
    <Link href={`/bai-viet/${a.slug}`} 
      style={{ background:"#fff", borderRadius:8, overflow:"hidden", border:"1px solid #E8DDD0", 
        textDecoration:"none", color:"inherit", display:"block", transition:"box-shadow .15s" }}>
      {/* Rút ảnh từ Supabase, nếu mất ảnh thì thay bằng logo mặc định */}
      <img src={a.img || '/logo.png'} alt={a.title} style={{ width:"100%", height:140, objectFit:"cover", display:"block" }} />
      <div style={{ padding:"10px 12px" }}>
        <div style={{ display:"flex", gap:6, marginBottom:6 }}>
          <span style={{ background:"#B91C1C", color:"#fff", fontSize:9, fontWeight:700, 
            letterSpacing:".8px", padding:"2px 7px", borderRadius:2, textTransform:"uppercase" }}>
            {CAT_LABELS[a.cat] || a.cat}
          </span>
          <span style={{ fontSize:11, color:"#aaa" }}>{a.date}</span>
        </div>
        <p style={{ fontWeight:700, fontSize:13.5, lineHeight:1.5 }}>{a.title}</p>
        <p style={{ fontSize:12, color:"#666", marginTop:4, lineHeight:1.6, 
          display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {a.excerpt}
        </p>
      </div>
    </Link>
  );
}

// Bật chế độ async để gọi dữ liệu từ Supabase
export default async function CategoryPage({ params }: { params: any }) {
  // Bắt đúng cái tên đường link đang truy cập (ví dụ: tieng-lang)
  const currentCat = params?.slug || params?.cat || "";
  
  const categoryInfo = PARENT_INFO[currentCat] || { 
    label: currentCat.replace("-", " "), 
    icon: "📄" 
  };
  
  // 👉 PHÉP THUẬT NẰM Ở ĐÂY: Dò trong Gia phả, nếu là mục Cha thì lấy danh sách tất cả các mục Con
  const familyIds = CATEGORY_TREE[currentCat] || [currentCat];

  // 👉 HÚT DỮ LIỆU TỪ SUPABASE: Lấy TẤT CẢ bài viết có mã chuyên mục nằm trong danh sách familyIds
  const { data } = await supabase
    .from('articles')
    .select('*')
    .in('cat', familyIds)
    .order('id', { ascending: false });
    
  const arts = data || [];

  return (
    <div style={{ minHeight:"100vh", background:"#FEF9F2", fontFamily:"system-ui,-apple-system,sans-serif", color:"#1C1C1C" }}>
      <Header />
      
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 16px", minHeight: "60vh" }}>
        {/* Banner Chuyên mục */}
        <div style={{ background:"linear-gradient(135deg,#9B1B14,#B91C1C)", color:"#fff",
          borderRadius:"0 0 12px 12px", padding:"22px 20px", marginBottom:22,
          display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:50, height:50, background:"rgba(255,255,255,.15)",
            borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24 }}>{categoryInfo.icon}</div>
          <div>
            <h1 style={{ fontFamily:"'Lora', serif", fontSize:22, fontWeight:900 }}>
              {categoryInfo.label?.toUpperCase()}
            </h1>
            <p style={{ opacity:.7, fontSize:12, marginTop:3 }}>
              {arts.length > 0 ? `${arts.length} bài viết` : "Chuyên mục nội dung"}
            </p>
          </div>
        </div>

        {/* Danh sách bài viết */}
        {arts.length > 0 ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
            {arts.map((a: any) => <ACard key={a.id} a={a} />)}
          </div>
        ) : (
          <div style={{ background:"#fff", border:"2px dashed #E8DDD0", borderRadius:12,
            padding:"60px 20px", textAlign:"center" }}>
            <div style={{ fontSize:44, marginBottom:12 }}>{categoryInfo.icon}</div>
            <h2 style={{ fontFamily:"'Lora', serif", fontSize:18, fontWeight:700, marginBottom:8 }}>
              Chưa có bài viết
            </h2>
            <p style={{ color:"#888", fontSize:13, marginBottom:16 }}>
              Ban biên tập đang cập nhật nội dung cho chuyên mục này.
            </p>
            <Link href="/" style={{ display:"inline-block", background:"#B91C1C", color:"#fff", 
              textDecoration:"none", padding:"8px 18px", borderRadius:5, fontWeight:700, fontSize:13 }}>
              ← Về trang chủ
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}