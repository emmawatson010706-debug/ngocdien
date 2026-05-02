import Link from "next/link";
// Sửa lại đường dẫn Header, Footer (chỉ lùi 2 bước là tới src/components)
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

// KHÔNG gọi file mockData cũ nữa để tránh lỗi mất file. 
// Khai báo tạm dữ liệu rỗng ngay tại đây để qua vòng Build:
const CATS: any[] = [];
const ARTS: any[] = [];
const SUBS: any = {};

// Giao diện thẻ bài viết thu gọn
function ACard({ a }: { a: any }) {
  return (
    <Link href={`/bai-viet/${a.slug}`} 
      style={{ background:"#fff", borderRadius:8, overflow:"hidden", border:"1px solid #E8DDD0", 
        textDecoration:"none", color:"inherit", display:"block", transition:"box-shadow .15s" }}>
      <img src={a.img} alt={a.title} style={{ width:"100%", height:140, objectFit:"cover", display:"block" }} />
      <div style={{ padding:"10px 12px" }}>
        <div style={{ display:"flex", gap:6, marginBottom:6 }}>
          <span style={{ background:"#B91C1C", color:"#fff", fontSize:9, fontWeight:700, 
            letterSpacing:".8px", padding:"2px 7px", borderRadius:2, textTransform:"uppercase" }}>
            {CATS.find(c => c.slug === a.cat)?.label || a.cat}
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

export default function CategoryPage({ params }: { params: { cat: string } }) {
  const { cat } = params;
  
  // Lấy thông tin chuyên mục
  const info = CATS.find(c => c.slug === cat);
  // An toàn hơn khi cat bị undefined lúc build
  const categoryInfo = info || { label: cat ? cat.replace("-", " ") : "Chuyên mục", icon: "📄", slug: cat };
  
  // Lọc bài viết thuộc chuyên mục này
  const arts = ARTS.filter(a => a.cat === cat);
  
  // Lấy danh sách chuyên mục con (nếu có)
  const subs = SUBS[cat as keyof typeof SUBS];

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
            {/* Đã đồng bộ sang Font Lora */}
            <h1 style={{ fontFamily:"'Lora', serif", fontSize:22, fontWeight:900 }}>
              {categoryInfo.label?.toUpperCase()}
            </h1>
            <p style={{ opacity:.7, fontSize:12, marginTop:3 }}>
              {arts.length > 0 ? `${arts.length} bài viết` : "Chuyên mục nội dung"}
            </p>
          </div>
        </div>

        {/* Các chuyên mục con (Ví dụ: Thơ, Tản văn...) */}
        {subs && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:18 }}>
            {subs.map((sub: string) => (
              <span key={sub} style={{ background:"#fff", border:"1px solid #E8DDD0",
                borderRadius:18, padding:"4px 14px", fontSize:12.5,
                fontWeight:600, color:"#444", cursor:"pointer" }}>
                {sub}
              </span>
            ))}
          </div>
        )}

        {/* Danh sách bài viết */}
        {arts.length > 0 ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
            {arts.map(a => <ACard key={a.id} a={a} />)}
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