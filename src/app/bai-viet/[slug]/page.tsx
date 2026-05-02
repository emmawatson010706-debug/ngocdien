import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import { ARTS, CATS } from "../../../data/mockData";

export default function ArticlePage({ params }: { params: { slug: string } }) {
  // Tìm bài viết tương ứng với đường link (slug)
  const article = ARTS.find(a => a.slug === params.slug);

  // Nếu bà con gõ sai link, chuyển hướng sang trang 404
  if (!article) {
    return notFound();
  }

  // Lấy tên chuyên mục
  const catLabel = CATS.find(c => c.slug === article.cat)?.label || article.cat;
  
  // Link bài viết để chia sẻ Zalo/Facebook
  const url = `https://ngocdien.info.vn/bai-viet/${article.slug}`;

  return (
    <div style={{ minHeight:"100vh", background:"#FEF9F2", fontFamily:"system-ui,-apple-system,sans-serif", color:"#1C1C1C" }}>
      <Header />
      
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 16px" }}>
        <div style={{ maxWidth:800, margin:"0 auto", padding:"22px 0" }}>
          
          {/* Thanh điều hướng (Breadcrumb) */}
          <div style={{ display:"flex", gap:6, fontSize:12, color:"#aaa", marginBottom:14, flexWrap:"wrap" }}>
            <Link href="/" style={{ textDecoration:"none", color:"#B91C1C", fontSize:12 }}>Trang chủ</Link>
            <span>›</span>
            <Link href={`/chuyen-muc/${article.cat}`} style={{ textDecoration:"none", color:"#B91C1C", fontSize:12 }}>
              {catLabel}
            </Link>
            <span>›</span>
            <span style={{ color:"#555" }}>{article.title}</span>
          </div>

          {/* Nhãn chuyên mục */}
          <span style={{ background:"#B91C1C", color:"#fff", fontSize:9, fontWeight:700,
            letterSpacing:".8px", padding:"2px 7px", borderRadius:2,
            textTransform:"uppercase", display:"inline-block" }}>{catLabel}</span>
          
          {/* Tiêu đề */}
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(20px,4vw,30px)",
            fontWeight:900, lineHeight:1.38, margin:"12px 0" }}>{article.title}</h1>
          <p style={{ color:"#aaa", fontSize:12.5, marginBottom:16 }}>
            ✍️ Ban biên tập &nbsp;·&nbsp; 📅 {article.date}
          </p>

          {/* Ảnh bìa */}
          <img src={article.img.replace("400/220","800/440")} alt={article.title}
            style={{ width:"100%", borderRadius:10, marginBottom:20, display:"block" }}/>
          
          {/* Đoạn mô tả (Excerpt) */}
          <p style={{ fontStyle:"italic", color:"#555", fontSize:14, lineHeight:1.85,
            borderLeft:"4px solid #C8942B", paddingLeft:14,
            background:"#FEF9EC", padding:"12px 14px",
            borderRadius:"0 8px 8px 0", marginBottom:20 }}>
            {article.excerpt}
          </p>

          {/* Nội dung bài viết */}
          <div style={{ fontSize:15, lineHeight:1.9, color:"#333" }}>
            <p>Đây là nội dung đầy đủ của bài viết. Khi kết nối Supabase, nội dung bài sẽ được lấy từ cơ sở dữ liệu và hiển thị tại đây với đầy đủ định dạng: tiêu đề, hình ảnh, video và đoạn văn.</p>
            <p style={{ marginTop:16 }}>Ban biên tập Xóm Ngọc Điền luôn nỗ lực cung cấp những thông tin chính xác, kịp thời về văn hóa, lịch sử và cộng đồng địa phương.</p>
          </div>

          {/* Cụm nút Chia sẻ */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:24,
            padding:"14px 0", borderTop:"1px solid #EDE5D8", borderBottom:"1px solid #EDE5D8" }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#888" }}>CHIA SẺ:</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ background:"#1877F2", color:"#fff", borderRadius:5,
                padding:"6px 14px", fontSize:12.5, fontWeight:700, textDecoration:"none" }}>
              📘 Facebook
            </a>
            <a href={`https://zalo.me/share/article?url=${encodeURIComponent(url)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ background:"#0057B8", color:"#fff", borderRadius:5,
                padding:"6px 14px", fontSize:12.5, fontWeight:700, textDecoration:"none" }}>
              💬 Zalo
            </a>
          </div>

          <Link href="/"
            style={{ display:"inline-block", marginTop:20, background:"#B91C1C", color:"#fff", border:"none",
            borderRadius:5, padding:"8px 18px", fontWeight:700, textDecoration:"none", fontSize:13 }}>
            ← Về trang chủ
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}