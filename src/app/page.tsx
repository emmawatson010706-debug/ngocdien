"use client"
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase/client';
/* ═══════════════════════════════════════════
   DỮ LIỆU
═══════════════════════════════════════════ */
const CATS = [
  { slug:"tin-tuc",         label:"Tin tức",               icon:"📰" },
  { slug:"nguoi-ngoc-dien", label:"Người Ngọc Điền",       icon:"👥" },
  { slug:"lich-su",         label:"Lịch sử Xóm Ngọc Điền",icon:"📜" },
  { slug:"tieng-lang",      label:"Tiếng làng",             icon:"✍️" },
  { slug:"di-tich",         label:"Di tích",               icon:"🏛️" },
  { slug:"le-hoi",          label:"Lễ hội",                icon:"🎊" },
  { slug:"thu-vien",        label:"Thư viện",              icon:"📚" },
  { slug:"chuyen-doi-so",   label:"Chuyển đổi số",         icon:"💻" },
  { slug:"gop-y",           label:"Góp ý & Gửi bài",      icon:"✉️" },
];
const SUBS = {
  "tin-tuc":["Thông báo","Sự kiện"],
  "nguoi-ngoc-dien":["Mẹ Việt Nam Anh hùng","Liệt sỹ","Anh hùng lao động Cao Lục","Đảng viên đầu tiên"],
  "tieng-lang":["Tản văn","Thơ","Khám phá","Góc nhìn thẳng","Podcast"],
  "di-tich":["Đền Ngọc Điền","Giếng làng"],
  "le-hoi":["Lễ hội đền","Lễ hội xóm","Lễ hội giếng"],
  "thu-vien":["Hương ước 1883"],
  "chuyen-doi-so":["Dịch vụ công","Hướng dẫn VNeID","Cổng thông tin","Bản đồ số"],
  "gop-y":["Góp ý","Phản ánh","Kiến nghị","Gửi bài"],
};
const SLIDES = [
  { title:"Lễ hội truyền thống Đền Ngọc Điền 2025 thu hút hàng nghìn người dân về tham dự",
    cat:"Lễ hội", desc:"Suốt 3 ngày từ 15 đến 17 tháng 3 âm lịch, Đền Ngọc Điền tràn ngập tiếng trống hội và hương khói. Lễ rước kiệu uy nghiêm, màn hát ví dặm ngân vang cùng trò chơi dân gian đặc sắc đã kéo hàng nghìn con dân về hội tụ — một năm nữa quê hương sống lại trong hồn thiêng cội nguồn.",
    img:"https://picsum.photos/seed/nd_s1/1200/600" },
  { title:"Kỷ niệm 50 năm ngày Giải phóng miền Nam: Xóm Ngọc Điền tri ân các anh hùng liệt sĩ",
    cat:"Sự kiện", desc:"Lễ dâng hương trang nghiêm tại Đài tưởng niệm đã quy tụ cán bộ và hàng trăm người dân. Từng nén hương thắp lên là lời hứa với 42 người con anh dũng đã ngã xuống — Ngọc Điền mãi ghi nhớ công ơn các anh.",
    img:"https://picsum.photos/seed/nd_s2/1200/600" },
  { title:"Hương ước 1883 – Tài sản văn hóa quý giá hơn 140 năm của người dân Ngọc Điền",
    cat:"Lịch sử", desc:"Được lập từ năm 1883, bản hương ước vẫn còn lưu giữ gần như nguyên vẹn — điều hiếm thấy. Tài liệu phản chiếu nền văn minh làng xã, luật tục tiến bộ và đạo lý làm người của cha ông Ngọc Điền thuở xưa.",
    img:"https://picsum.photos/seed/nd_s3/1200/600" },
  { title:"Giếng làng Ngọc Điền: Chứng nhân lịch sử qua bao thế hệ người dân",
    cat:"Di tích", desc:"Hơn 200 năm hiện diện giữa lòng xóm, giếng làng không chỉ là nguồn nước sinh hoạt mà là ký ức chung của bao thế hệ, chứng kiến tiếng cười trẻ thơ và sức sống bền bỉ của cả cộng đồng.",
    img:"https://picsum.photos/seed/nd_s4/1200/600" },
  { title:"Ra mắt Series Podcast: Câu chuyện những Mẹ Việt Nam Anh hùng ở Ngọc Điền",
    cat:"Podcast", desc:"Bốn bà mẹ, bốn cuộc đời — cùng chung một điều: đã trao những điều quý nhất vì Tổ quốc. Series ghi lại từng câu chuyện đời thực để thế hệ hôm nay lắng nghe và trân trọng hơn nền hòa bình đang sống.",
    img:"https://picsum.photos/seed/nd_s5/1200/600" },
];
const ARTS = [
  { id:1,slug:"le-hoi-den-2025",   title:"Lễ hội Đền Ngọc Điền 2025",               cat:"le-hoi",        date:"25/04/2025", img:"https://picsum.photos/seed/a1nd/400/220", excerpt:"Lễ hội kéo dài 3 ngày với nhiều hoạt động văn hóa truyền thống đặc sắc." },
  { id:2,slug:"ky-niem-30-4",      title:"Kỷ niệm 50 năm ngày Giải phóng miền Nam",cat:"tin-tuc",       date:"24/04/2025", img:"https://picsum.photos/seed/a2nd/400/220", excerpt:"Lễ dâng hương trang nghiêm tại Đài tưởng niệm liệt sỹ xóm." },
  { id:3,slug:"huong-uoc-1883",    title:"Hương ước 1883 – Tài sản văn hóa 140 năm",cat:"thu-vien",      date:"22/04/2025", img:"https://picsum.photos/seed/a3nd/400/220", excerpt:"Bản hương ước cổ nhất còn lưu giữ nguyên vẹn qua hơn 140 năm." },
  { id:4,slug:"gieng-lang",        title:"Giếng làng – Chứng nhân lịch sử",        cat:"di-tich",       date:"20/04/2025", img:"https://picsum.photos/seed/a4nd/400/220", excerpt:"Hơn 200 năm tuổi, giếng làng là không gian văn hóa gắn kết cộng đồng." },
  { id:5,slug:"chieu-ve-xom-cu",   title:"Chiều về trên xóm cũ",                    cat:"tieng-lang",    date:"18/04/2025", img:"https://picsum.photos/seed/a5nd/400/220", excerpt:"Những ký ức tuổi thơ ùa về trong chiều tà trên con đường làng quen thuộc." },
  { id:6,slug:"thong-bao-hop",     title:"Thông báo lịch họp chi bộ tháng 5/2025", cat:"tin-tuc",       date:"17/04/2025", img:"https://picsum.photos/seed/a6nd/400/220", excerpt:"Mời toàn thể đảng viên tham dự họp chi bộ định kỳ tháng 5." },
];

/* ═══════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;0,900;1,400&family=Be+Vietnam+Pro:wght@400;600;700;900&display=swap');

  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Be Vietnam Pro', system-ui, -apple-system, sans-serif;background:#FEF9F2;color:#1C1C1C;overflow-x:hidden}

  /* ticker */
  @keyframes ndtick{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  .nd-ticker{display:flex;animation:ndtick 38s linear infinite;will-change:transform}

  /* hero slide */
  .nd-slide{position:absolute;inset:0;opacity:0;transition:opacity .7s ease;pointer-events:none}
  .nd-slide.on{opacity:1;pointer-events:auto}

  /* hamburger menu */
  .nd-menu{
    position:fixed;top:0;right:0;width:310px;max-width:100%;height:100%;
    background:#181818;z-index:901;flex-direction:column;overflow-y:auto;
    transform:translateX(100%);transition:transform .25s ease;display:flex;
  }
  .nd-menu.open{transform:translateX(0)}

  /* main layout */
  .nd-layout{display:grid;grid-template-columns:1fr 288px;gap:20px;padding-top:20px;align-items:start}
  @media(max-width:840px){.nd-layout{grid-template-columns:1fr}}

  /* sidebar grid on mobile */
  .nd-sidebar{display:flex;flex-direction:column;gap:14px}
  @media(max-width:840px){.nd-sidebar{display:grid;grid-template-columns:1fr 1fr;gap:14px}}
  @media(max-width:480px){.nd-sidebar{grid-template-columns:1fr}}

  /* 2-col grid */
  .nd-g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  @media(max-width:480px){.nd-g2{grid-template-columns:1fr}}

  /* 4-col grid */
  .nd-g4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  @media(max-width:580px){.nd-g4{grid-template-columns:1fr 1fr}}

  /* lich su split */
  .nd-ls{display:grid;grid-template-columns:1fr 1fr;border-radius:8px;overflow:hidden;border:1px solid #F3DDB5}
  @media(max-width:500px){.nd-ls{grid-template-columns:1fr}}
  .nd-ls-img{overflow:hidden;min-height:140px}
  @media(max-width:500px){.nd-ls-img{display:none}}

  /* di tich + le hoi split */
  .nd-split{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  @media(max-width:500px){.nd-split{grid-template-columns:1fr}}

  /* section heading */
  .nd-sh{border-bottom:3px solid #B91C1C;padding-bottom:10px;margin-bottom:16px}
  .nd-sh-row{display:flex;align-items:center;gap:10px}
  .nd-sh-icon{width:32px;height:32px;border-radius:4px;display:flex;align-items:center;
    justify-content:center;font-size:16px;flex-shrink:0;color:#fff}
  .nd-sh-title{font-family:'Lora', serif;font-size:clamp(14px,3vw,18px);font-weight:900;flex:1;line-height:1.2}
  .nd-sh-more{background:none;border:none;font-size:12px;font-weight:700;cursor:pointer;
    white-space:nowrap;flex-shrink:0;padding:2px 0 2px 8px}

  /* article list hover */
  .nd-ali{border-bottom:1px solid #EDE5D8;cursor:pointer;transition:background .1s;padding:10px 4px}
  .nd-ali:hover{background:#FFF5E4}

  /* card hover */
  .nd-card{background:#fff;border-radius:8px;overflow:hidden;border:1px solid #E8DDD0;
    cursor:pointer;transition:box-shadow .15s}
  .nd-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.1)}

  /* desktop nav scrollbar hide */
  .nd-dnav{display:flex;overflow-x:auto;scrollbar-width:none}
  .nd-dnav::-webkit-scrollbar{display:none}

  /* admin sidebar */
  .nd-asb{width:210px;background:#1C1C1C;color:#fff;display:flex;flex-direction:column;
    position:fixed;top:0;left:0;height:100%;z-index:50}
  .nd-amain{margin-left:210px;flex:1;display:flex;flex-direction:column;min-height:100vh}
  @media(max-width:640px){
    .nd-asb{transform:translateX(-100%);transition:transform .25s}
    .nd-asb.open{transform:translateX(0)}
    .nd-amain{margin-left:0}
  }

  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:#C8942B44;border-radius:2px}
`;

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
const Tag = ({ label, color="#B91C1C" }: { label: string, color?: string }) => ( 
  <span style={{ background:color, color:"#fff", fontSize:9, fontWeight:700,
    letterSpacing:".8px", padding:"2px 7px", borderRadius:2,
    textTransform:"uppercase", display:"inline-block" }}>{label}</span>
);

function SecHead({ icon, title, color="#B91C1C", onMore }: { icon: any, title: string, color?: string, onMore?: any }) {
  return (
    <div className="nd-sh" style={{ borderBottomColor:color }}>
      <div className="nd-sh-row">
        <div className="nd-sh-icon" style={{ background:color }}>{icon}</div>
        <h2 className="nd-sh-title">{title}</h2>
        {onMore && (
          <button className="nd-sh-more" style={{ color }} onClick={onMore}>
            Xem tất cả →
          </button>
        )}
      </div>
    </div>
  );
}

function ACard({ a, onClick }: { a: any, onClick?: any }) {
  return (
    <div className="nd-card" onClick={() => onClick(a)}>
      <img src={a.img} alt={a.title} style={{ width:"100%", height:140, objectFit:"cover", display:"block" }} />
      <div style={{ padding:"10px 12px" }}>
        <div style={{ display:"flex", gap:6, marginBottom:6 }}>
          <Tag label={a.cat} /><span style={{ fontSize:11, color:"#aaa" }}>{a.date}</span>
        </div>
        <p style={{ fontWeight:700, fontSize:13.5, lineHeight:1.5 }}>{a.title}</p>
        <p style={{ fontSize:12, color:"#666", marginTop:4, lineHeight:1.6 }}>{a.excerpt}</p>
      </div>
    </div>
  );
}

const BtnRed = ({ children, onClick, style={} }: { children?: any, onClick?: any, style?: any }) => (
  <button onClick={onClick} style={{ background:"#B91C1C", color:"#fff", border:"none",
    borderRadius:5, padding:"8px 18px", fontWeight:700, cursor:"pointer",
    fontSize:13, ...style }}>{children}</button>
);

/* ═══════════════════════════════════════════
   HEADER
═══════════════════════════════════════════ */
function Header({ setNav }: { setNav?: any }) {
  const [open, setOpen] = useState(false);
  const [exp, setExp]   = useState<number | null>(null);

  const go = (page: any, extra: any = {}) => {
    setNav({ page, ...extra });
    setOpen(false);
    setExp(null);
    window.scrollTo(0, 0);
  };

  return (
    <>

      {/* top bar */}
      <div style={{ background:"#FFF8EE", borderBottom:"1px solid #EAE0D0", padding:"4px 0" }}>
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 16px",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:11, color:"#999" }}>
            📅 {new Date().toLocaleDateString("vi-VN",{ weekday:"long", year:"numeric", month:"long", day:"numeric" })}
          </span>
          <div style={{ display:"flex", gap:14 }}>
            {/* THÊM NÚT TÌM KIẾM Ở ĐÂY */}
            <button onClick={() => go("search")} style={{ background:"none", border:"none", color:"#B91C1C", fontSize:12, fontWeight:900, cursor:"pointer" }}>🔍 Tìm kiếm</button>
            
            <button onClick={() => go("category",{ cat:"gop-y" })} style={{ background:"none", border:"none", color:"#B91C1C", fontSize:11, fontWeight:700, cursor:"pointer" }}>🔔 Gửi bài</button>
            <button onClick={() => go("admin-login")} style={{ background:"none", border:"none", color:"#777", fontSize:11, cursor:"pointer" }}>⚙ Quản trị</button>
          </div>
        </div>
      </div>

      {/* main header */}
      <header style={{ background:"linear-gradient(180deg,#9B1B14,#B91C1C)",
        position:"sticky", top:0, zIndex:200, boxShadow:"0 2px 12px rgba(0,0,0,.3)" }}>
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 16px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            position:"relative", padding:"11px 0" }}>
            <button onClick={() => go("home")}
              style={{ background:"none", border:"none", cursor:"pointer", textAlign:"center" }}>
              {/* LOGO CHÍNH THỨC (ĐÃ ÉP CÂN BỤC TRẮNG) */}
          <div style={{ background: "#fff", padding: "5px 14px", borderRadius: "8px", display: "inline-block", boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
            <img 
              src="/logo.png" 
              alt="Cổng thông tin Xóm Ngọc Điền" 
              style={{ height: "42px", width: "auto", display: "block", objectFit: "contain" }} 
            />
          </div>
            </button>
            {/* hamburger */}
            <button onClick={() => setOpen(true)}
              style={{ position:"absolute", right:0, background:"rgba(255,255,255,.12)",
                border:"1px solid rgba(255,255,255,.2)", borderRadius:6,
                width:36, height:36, cursor:"pointer", display:"flex",
                flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5 }}>
              {[0,1,2].map(i=><span key={i} style={{ width:18,height:2,background:"#fff",
                borderRadius:1,display:"block" }}/>)}
            </button>
          </div>
        </div>

        {/* desktop nav */}
        <div style={{ background:"rgba(0,0,0,.18)", borderTop:"1px solid rgba(255,255,255,.08)" }}>
          <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 16px" }}>
            <nav className="nd-dnav">
              {CATS.map(c => (
                <button key={c.slug} onClick={() => go("category",{ cat:c.slug })}
                  style={{ background:"none", border:"none", color:"rgba(255,255,255,.88)",
                    fontSize:10.5, fontWeight:700, letterSpacing:".6px",
                    padding:"8px 10px", cursor:"pointer", whiteSpace:"nowrap" }}
                  onMouseEnter={e=>(e.target as any).style.color="#FBBF24"}
                  onMouseLeave={e=>(e.target as any).style.color="rgba(255,255,255,.88)"}>
                  {c.label.toUpperCase()}
                </button>
              ))}
              <button onClick={() => go("admin-login")}
                style={{ background:"none", border:"none", color:"#F87171",
                  fontSize:10.5, fontWeight:700, padding:"8px 10px", cursor:"pointer" }}>
                ⚙ QUẢN TRỊ
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* overlay */}
      {open && <div onClick={() => setOpen(false)} style={{ position:"fixed", inset:0,
        background:"rgba(0,0,0,.52)", zIndex:900 }}/>}

      {/* side menu */}
      <nav className={`nd-menu${open?" open":""}`}>
        <div style={{ background:"#B91C1C", padding:"13px 14px",
          display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:"'Lora', serif", fontSize:17, fontWeight:900, color:"#fff" }}>NGỌC ĐIỀN</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,.55)", marginTop:2, letterSpacing:"1.5px" }}>
              CỔNG THÔNG TIN ĐIỆN TỬ
            </div>
          </div>
          <button onClick={() => setOpen(false)}
            style={{ background:"rgba(255,255,255,.15)", border:"none",
              borderRadius:"50%", width:30, height:30, color:"#fff",
              fontSize:14, cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ flex:1, overflowY:"auto" }}>
          <button onClick={() => go("home")} style={{ width:"100%", textAlign:"left",
            padding:"10px 14px", background:"none", border:"none",
            borderBottom:"1px solid #242424", color:"#F0F0F0",
            cursor:"pointer", fontWeight:700, fontSize:12 }}>
            🏡 &nbsp;TRANG CHỦ
          </button>

          {CATS.map((cat: any, i: any) => (
                <div key={cat.slug}>
                  <button onClick={() => {
                    if ((SUBS as any)[cat.slug]) setExp(exp===i?null:i);
                    else go("category",{ cat:cat.slug });
                  }} style={{ width:"100%", textAlign:"left", padding:"10px 14px",
                    background:"none", border:"none", borderBottom:"1px solid #242424",
                    color:"#F0F0F0", cursor:"pointer", fontWeight:700, fontSize:12,
                    display:"flex", justifyContent:"space-between" }}>
                    <span>{cat.icon} &nbsp;{cat.label.toUpperCase()}</span>
                    {(SUBS as any)[cat.slug] && (
                      <span style={{ opacity:.5, display:"inline-block",
                        transform:exp===i?"rotate(90deg)":"none", transition:"transform .2s" }}>›</span>
                    )}
                  </button>
                  {exp===i && (SUBS as any)[cat.slug]?.map((sub: any, j: any) => (
                    <button key={j} onClick={() => go("category",{ cat:cat.slug, sub })}
                      style={{ width:"100%", textAlign:"left", padding:"8px 14px 8px 38px",
                        background:"rgba(0,0,0,.2)", border:"none",
                        borderBottom:"1px solid #1e1e1e",
                        color:"#C8942B", cursor:"pointer", fontSize:12.5 }}>
                      ― {sub}
                    </button>
                  ))}
                </div>
              ))}

          <button onClick={() => go("admin-login")}
            style={{ width:"100%", textAlign:"left", padding:"10px 14px",
              background:"rgba(185,28,28,.15)", border:"none",
              borderTop:"1px solid rgba(185,28,28,.3)",
              color:"#F87171", cursor:"pointer", fontWeight:700, fontSize:12 }}>
            ⚙ &nbsp;QUẢN TRỊ HỆ THỐNG
          </button>
        </div>

        <div style={{ padding:"12px 14px", background:"rgba(0,0,0,.3)",
          fontSize:11.5, color:"#888", lineHeight:1.9 }}>
          📧 tinnhanhonline247@gmail.com<br/>
          📞 0914 58 75 75<br/>
          <span style={{ color:"#C8942B", fontWeight:700 }}>⚡ Phát triển bởi Thái Lão</span>
        </div>
      </nav>
    </>
  );
}

/* ═══════════════════════════════════════════
   TICKER
═══════════════════════════════════════════ */
function Ticker() {
  const latestNews = [...ARTS]
    .filter(a => a.cat === "tin-tuc")
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);
  
  const t = latestNews.length > 0 
    ? latestNews.map(a => `🔴 ${a.title}`).join("  ✦  ") + "  ✦  "
    : "🔴 Đang cập nhật tin tức mới nhất...  ✦  ";

  return (
    <div style={{ background: "#B91C1C", height: 34, display: "flex", overflow: "hidden" }}>
      {/* Ô chữ TIN MỚI - Ép cứng không cho co lại */}
      <div style={{ 
        background: "#7F1D1D", padding: "0 14px", display: "flex", alignItems: "center", 
        fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "1px", 
        flexShrink: 0, borderRight: "2px solid rgba(255,255,255,.15)" 
      }}>
        TIN MỚI
      </div>

      {/* Phần chữ chạy - Cấm tuyệt đối rớt dòng */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div className="nd-ticker" style={{ 
          whiteSpace: "nowrap", 
          fontSize: 12.5, 
          color: "#fff",
          display: "flex",
          flexWrap: "nowrap" 
        }}>
          <span style={{ paddingRight: 40, flexShrink: 0 }}>{t}</span>
          <span style={{ paddingRight: 40, flexShrink: 0 }}>{t}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HERO
═══════════════════════════════════════════ */
function Hero({ setNav }: { setNav?: any }) {
  const heroArts = [...ARTS]
    .filter(a => a.cat !== "tin-tuc")
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);
  
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (heroArts.length === 0) return;
    const t = setInterval(() => setIdx(i => (i+1) % heroArts.length), 5500);
    return () => clearInterval(t);
  }, [heroArts.length]);
  
  const s = heroArts[idx];
  if (!s) return null;

  const catLabel = CATS.find(c => c.slug === s.cat)?.label || s.cat;

  return (
    <div style={{ position:"relative", height:"clamp(400px,58vw,540px)",
      overflow:"hidden", background:"#111" }}>
      {heroArts.map((sl,i) => (
        <div key={i} className={`nd-slide${i===idx?" on":""}`}>
          <img src={sl.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
        </div>
      ))}
      <div style={{ position:"absolute", inset:0,
        background:"linear-gradient(to top,rgba(0,0,0,.92) 0%,rgba(0,0,0,.55) 40%,rgba(0,0,0,.08) 80%)" }}/>

      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
        justifyContent:"flex-end", paddingBottom:"clamp(70px,13vw,120px)", zIndex:5 }}>
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 20px", width:"100%" }}>
          <Tag label={catLabel}/>&nbsp;
          <h1 style={{ fontFamily:"'Lora', serif", fontSize:"clamp(17px,2.8vw,27px)",
            fontWeight:900, color:"#fff", lineHeight:1.42, maxWidth:800,
            textShadow:"0 2px 12px rgba(0,0,0,.7)", margin:"10px 0 12px" }}>
            {s.title}
          </h1>
          <p style={{ color:"rgba(255,255,255,.78)", fontSize:"clamp(12px,1.4vw,14px)",
            maxWidth:700, lineHeight:1.8 }}>{s.excerpt}</p>
        </div>
      </div>

      <div style={{ position:"absolute", bottom:18, left:0, right:80,
        display:"flex", justifyContent:"center", gap:6, zIndex:10 }}>
        {heroArts.map((_,i) => (
          <button key={i} onClick={()=>setIdx(i)} style={{ width:i===idx?24:7, height:7,
            borderRadius:4, border:"none", padding:0, cursor:"pointer",
            background:i===idx?"#C8942B":"rgba(255,255,255,.38)", transition:"all .3s" }}/>
        ))}
      </div>
      
      <button 
        onClick={() => {
          setNav({ page: "article", article: s });
          window.scrollTo(0,0);
        }}
        style={{ position:"absolute", bottom:16, right:20, zIndex:10,
        background:"rgba(155,27,20,.82)", color:"#fff", border:"1px solid rgba(255,255,255,.2)",
        borderRadius:4, padding:"5px 13px", fontSize:11, fontWeight:700, cursor:"pointer" }}>
        Đọc bài →
      </button>
    </div>
  );
}
/* ═══════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════ */
function Sidebar({ setNav }: { setNav?: any }) {
  const [isPlay, setIsPlay] = useState(false);

  return (
    <>
      {/* Thời tiết */}
      <div style={{ background:"linear-gradient(135deg,#1D4ED8,#2563EB)",
        borderRadius:10, padding:16, color:"#fff" }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px",
          opacity:.7, marginBottom:12 }}>🌤 THỜI TIẾT HƯNG NGUYÊN</div>
        <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:46 }}>⛅</span>
          <div>
            <div style={{ fontSize:40, fontWeight:900, lineHeight:1 }}>28°C</div>
            <div style={{ fontSize:12.5, opacity:.8, marginTop:4 }}>Nhiều mây, mưa nhỏ</div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)",
          gap:6, paddingTop:10, borderTop:"1px solid rgba(255,255,255,.2)", marginBottom:10 }}>
          {[["Độ ẩm","82%"],["Gió","12 km/h"],["Tầm nhìn","10 km"]].map(([l,v])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{v}</div>
              <div style={{ fontSize:9.5, opacity:.6 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:5 }}>
          {[["T2","29°"],["T3","31°"],["T4","27°"],["T5","25°"],["T6","28°"]].map(([d,t],i)=>(
            <div key={i} style={{ flex:1, textAlign:"center", background:"rgba(255,255,255,.12)",
              borderRadius:5, padding:"5px 0" }}>
              <div style={{ fontSize:9.5, opacity:.65 }}>{d}</div>
              <div style={{ fontWeight:700, fontSize:12 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Podcast */}
      <div style={{ background:"#fff", border:"1px solid #E8DDD0", borderRadius:10, overflow:"hidden" }}>
        <div style={{ background:"#1C1C1C", padding:"9px 13px",
          display:"flex", gap:7, alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:7, alignItems:"center" }}>
            <span style={{ width:7, height:7, borderRadius:"50%",
              background:"#C8942B", display:"inline-block" }}/>
            <span style={{ color:"#fff", fontSize:12.5, fontWeight:700 }}>🎙 PODCAST</span>
          </div>
          <button onClick={() => setNav({ page:"category", cat:"tieng-lang" })}
            style={{ background:"none", border:"1px solid rgba(255,255,255,.25)",
              color:"#C8942B", fontSize:10.5, fontWeight:700, cursor:"pointer",
              borderRadius:4, padding:"2px 8px" }}>
            Xem tất cả →
          </button>
        </div>
        <div style={{ padding:14 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
            <div style={{ width:50, height:50, background:"#1C1C1C", borderRadius:8,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:22, flexShrink:0 }}>🎙</div>
            <div>
              <div style={{ fontSize:9.5, color:"#B91C1C", fontWeight:700 }}>TẬP 1</div>
              <p style={{ fontSize:12.5, fontWeight:700, lineHeight:1.4, marginTop:2 }}>
                Câu chuyện Mẹ Việt Nam Anh hùng
              </p>
              <div style={{ fontSize:10.5, color:"#aaa", marginTop:2 }}>24:35 phút</div>
            </div>
          </div>
          <div style={{ height:4, background:"#eee", borderRadius:4, marginBottom:4 }}>
            <div style={{ width:"35%", height:"100%", background:"#B91C1C", borderRadius:4 }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between",
            fontSize:10, color:"#aaa", marginBottom:10 }}>
            <span>8:36</span><span>24:35</span>
          </div>
          
          {/* NÚT PLAY/PAUSE ĐÃ ĐƯỢC CHỈNH CHUẨN */}
          <div style={{ display:"flex", justifyContent:"center", gap:16, marginBottom:12 }}>
            {["⏮", isPlay ? "⏸" : "▶", "⏭"].map((ic,i)=>(
              <button key={i} 
                onClick={() => { if (i === 1) setIsPlay(!isPlay); }}
                style={{ border:"none",
                background:i===1?"#B91C1C":"none",
                color:i===1?"#fff":"#333",
                width:i===1?38:undefined, height:i===1?38:undefined,
                borderRadius:i===1?"50%":undefined,
                cursor:"pointer", fontSize:i===1?15:19,
                display:"flex", alignItems:"center", justifyContent:"center" }}>{ic}</button>
            ))}
          </div>

          <button onClick={() => setNav({ page:"category", cat:"tieng-lang" })}
            style={{ width:"100%", background:"#1C1C1C", color:"#C8942B", border:"none",
              borderRadius:7, padding:"8px", fontSize:12.5, fontWeight:700,
              cursor:"pointer" }}>
            Nghe thêm các tập khác →
          </button>
        </div>
      </div>

      {/* Cộng đồng */}
      <div style={{ background:"#fff", border:"1px solid #E8DDD0", borderRadius:10, overflow:"hidden" }}>
        <div style={{ background:"#0057B8", padding:"9px 13px",
          color:"#fff", fontSize:12.5, fontWeight:700 }}>🤝 CỘNG ĐỒNG NGỌC ĐIỀN</div>
        <div style={{ padding:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <a href="https://zalo.me/g/i8vuebonziplqy2c06ux" target="_blank" rel="noopener"
              style={{ background:"#0057B8", color:"#fff", borderRadius:8,
                padding:"12px 6px", textAlign:"center", textDecoration:"none", display:"block" }}>
              <div style={{ fontSize:24 }}>💬</div>
              <div style={{ fontSize:13, fontWeight:700, marginTop:4 }}>Zalo</div>
              <div style={{ fontSize:10.5, opacity:.8, marginTop:2 }}>Nhóm cộng đồng</div>
            </a>
            <a href="https://www.facebook.com/share/1BFnoXVtDB/" target="_blank" rel="noopener"
              style={{ background:"#1877F2", color:"#fff", borderRadius:8,
                padding:"12px 6px", textAlign:"center", textDecoration:"none", display:"block" }}>
              <div style={{ fontSize:24 }}>📘</div>
              <div style={{ fontSize:13, fontWeight:700, marginTop:4 }}>Facebook</div>
              <div style={{ fontSize:10.5, opacity:.8, marginTop:2 }}>Trang Ngọc Điền</div>
            </a>
          </div>
          <a href="https://maps.app.goo.gl/gnWBNeAbnu7XK8N67" target="_blank" rel="noopener"
            style={{ display:"flex", alignItems:"center", gap:10, background:"#F9FAFB",
              border:"1px solid #E5E7EB", borderRadius:8, padding:"10px 12px",
              textDecoration:"none", color:"#374151" }}>
            <div style={{ width:36, height:36, background:"#EA4335", borderRadius:8,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, flexShrink:0 }}>📍</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700 }}>Bản đồ Xóm Ngọc Điền</div>
              <div style={{ fontSize:11, color:"#888", marginTop:2 }}>Xem trên Google Maps →</div>
            </div>
          </a>
        </div>
      </div>

      {/* Góp ý */}
      <div style={{ background:"linear-gradient(135deg,#FEF3C7,#FFFBF0)",
        border:"1px solid #FCD34D", borderRadius:10, padding:14 }}>
        <h3 style={{ fontFamily:"'Lora', serif", fontSize:15, fontWeight:700,
          color:"#92400E", marginBottom:8 }}>✉️ GÓP Ý & GỬI BÀI</h3>
        <p style={{ fontSize:12.5, color:"#666", lineHeight:1.7, marginBottom:10 }}>
          Bà con gửi bài viết, góp ý, phản ánh hoặc kiến nghị về xóm tại đây.
        </p>
        {[
          ["📝 Gửi bài viết","#B45309"],
          ["💡 Góp ý – Kiến nghị","#0891B2"],
          ["📣 Phản ánh","#DC2626"]
        ].map(([l,c])=>(
          <button key={l}
            onClick={() => setNav({ page:"category", cat:"gop-y" })}
            style={{ display:"block", width:"100%", background:"#fff",
              border:`1px solid ${c}22`, color:c, padding:"8px 12px", borderRadius:5,
              cursor:"pointer", fontSize:12.5, fontWeight:700,
              textAlign:"left", marginBottom:7 }}>
            {l}
          </button>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   HOME
═══════════════════════════════════════════ */
function Home({ setNav }: { setNav?: any }) {
  const go = (cat: any) => { setNav({ page:"category", cat }); window.scrollTo(0,0); };
  const goArt = (a: any) => { setNav({ page:"article", article:a }); window.scrollTo(0,0); };
  const C = { maxWidth:1160, margin:"0 auto", padding:"0 16px" };

  return (
    <div style={C}>
      <div className="nd-layout">
        <div>

          {/* TIN TỨC */}
          <section style={{ marginBottom:26 }}>
            <SecHead icon="📰" title="TIN TỨC" onMore={() => go("tin-tuc")} />
            {ARTS.filter(a=>a.cat==="tin-tuc").map(a=>(
              <div key={a.id} className="nd-ali" onClick={() => goArt(a)}
                style={{ display:"flex", gap:10 }}>
                <img src={a.img} alt="" style={{ width:78, height:54, objectFit:"cover",
                  borderRadius:5, flexShrink:0 }}/>
                <div>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4 }}>
                    <Tag label="Tin tức"/><span style={{ fontSize:11, color:"#aaa" }}>{a.date}</span>
                  </div>
                  <p style={{ fontWeight:700, fontSize:13.5, lineHeight:1.5 }}>{a.title}</p>
                </div>
              </div>
            ))}
          </section>

          {/* NGƯỜI NGỌC ĐIỀN */}
          <section style={{ marginBottom:26 }}>
            <SecHead icon="👥" title="NGƯỜI NGỌC ĐIỀN" color="#7C3AED"
              onMore={() => go("nguoi-ngoc-dien")}/>
            <div className="nd-g2">
              <div onClick={() => go("nguoi-ngoc-dien")} style={{ background:"linear-gradient(135deg,#FEF2F2,#FFF7ED)",
                border:"1px solid #FECACA", borderRadius:8, padding:14, cursor:"pointer" }}>
                <div style={{ fontSize:10, color:"#B91C1C", fontWeight:700,
                  letterSpacing:".8px", marginBottom:6 }}>🌺 MẸ VIỆT NAM ANH HÙNG</div>
                <div style={{ fontFamily:"'Lora', serif", fontSize:16, fontWeight:700 }}>
                  4 bà mẹ anh hùng
                </div>
                <p style={{ fontSize:12, color:"#666", marginTop:5, lineHeight:1.6 }}>
                  Những người lặng thầm hy sinh vì độc lập Tổ quốc.
                </p>
                <div style={{ color:"#B91C1C", fontSize:12, fontWeight:700, marginTop:8 }}>
                  Xem chi tiết →
                </div>
              </div>
              <div onClick={() => go("nguoi-ngoc-dien")} style={{ background:"linear-gradient(135deg,#1C1C1C,#2d2d2d)",
                borderRadius:8, padding:14, cursor:"pointer" }}>
                <div style={{ fontSize:46, fontWeight:900, color:"#C8942B", lineHeight:1 }}>42</div>
                <div style={{ fontSize:9, color:"#aaa", letterSpacing:"2px", marginTop:2 }}>LIỆT SỸ</div>
                <p style={{ fontFamily:"'Lora', serif", fontSize:14, fontWeight:700,
                  color:"#fff", marginTop:6 }}>Danh sách Liệt sỹ Xóm Ngọc Điền</p>
                <div style={{ color:"#C8942B", fontSize:12, fontWeight:700, marginTop:8 }}>
                  Xem danh sách →
                </div>
              </div>
            </div>
          </section>

          {/* LỊCH SỬ */}
          <section style={{ marginBottom:26 }}>
            <SecHead icon="📜" title="LỊCH SỬ XÓM NGỌC ĐIỀN" color="#92400E"
              onMore={() => go("lich-su")}/>
            <div className="nd-ls">
              <div style={{ padding:18, background:"linear-gradient(135deg,#FEF7E8,#FFFBF5)" }}>
                <h3 style={{ fontFamily:"'Lora', serif", fontSize:16, fontWeight:700,
                  lineHeight:1.45, borderLeft:"4px solid #B45309",
                  paddingLeft:10, marginBottom:10 }}>
                  Ngọc Điền – Vùng đất địa linh nhân kiệt bên dòng sông Lam
                </h3>
                <p style={{ fontSize:12.5, color:"#555", lineHeight:1.85, textAlign:"justify" }}>
                  Xóm Ngọc Điền có lịch sử hơn 300 năm hình thành và phát triển, gắn liền với những biến cố lịch sử trọng đại của đất nước...
                </p>
                <BtnRed onClick={() => go("lich-su")} style={{ marginTop:12, fontSize:12 }}>
                  Đọc lịch sử đầy đủ →
                </BtnRed>
              </div>
              <div className="nd-ls-img">
                <img src="https://picsum.photos/seed/lsnd/500/280" alt=""
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
              </div>
            </div>
          </section>

          {/* TIẾNG LÀNG */}
          <section style={{ marginBottom:26 }}>
            <SecHead icon="✍️" title="TIẾNG LÀNG" color="#0891B2"
              onMore={() => go("tieng-lang")}/>
            <div className="nd-g2">
              {ARTS.filter(a=>a.cat==="tieng-lang").slice(0,2).map(a=>(
                <ACard key={a.id} a={a} onClick={goArt}/>
              ))}
            </div>
          </section>

          {/* DI TÍCH + LỄ HỘI */}
          <section style={{ marginBottom:26 }}>
            <div className="nd-split">
              {[{slug:"di-tich",icon:"🏛️",label:"DI TÍCH",color:"#065F46",
                 items:[{n:"Đền Ngọc Điền",img:"https://picsum.photos/seed/dend/200/120"},
                        {n:"Giếng làng",img:"https://picsum.photos/seed/giennd/200/120"}]},
                {slug:"le-hoi",icon:"🎊",label:"LỄ HỘI",color:"#DC2626",
                 items:[{n:"Lễ hội Đền (15-17/3 âm)",img:"https://picsum.photos/seed/lh1/200/120"},
                        {n:"Lễ hội Giếng đầu năm",img:"https://picsum.photos/seed/lh2/200/120"}]}
              ].map(col=>(
                <div key={col.slug}>
                  <SecHead icon={col.icon} title={col.label} color={col.color}
                    onMore={() => go(col.slug)}/>
                  {col.items.map((it,i)=>(
                    <div key={i} onClick={() => go(col.slug)}
                      style={{ display:"flex", gap:10, marginBottom:10, cursor:"pointer" }}
                      onMouseEnter={e=>e.currentTarget.style.opacity=".8"}
                      onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                      <img src={it.img} alt="" style={{ width:82, height:58,
                        objectFit:"cover", borderRadius:5, flexShrink:0 }}/>
                      <p style={{ fontWeight:700, fontSize:13, lineHeight:1.4 }}>{it.n}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* CHUYỂN ĐỔI SỐ */}
          <section style={{ marginBottom:26 }}>
            <SecHead icon="💻" title="CHUYỂN ĐỔI SỐ" color="#1D4ED8"/>
            <div className="nd-g4">
              {[{ic:"🏛️",n:"Dịch vụ công",c:"#1D4ED8",url:"https://dichvucong.gov.vn"},
                {ic:"🪪",n:"VNeID",c:"#065F46",url:"https://vneid.gov.vn"},
                {ic:"🌐",n:"Cổng tỉnh NA",c:"#7C3AED",url:"https://nghean.gov.vn"},
                {ic:"🗺️",n:"Bản đồ số",c:"#B45309",url:"https://maps.app.goo.gl/gnWBNeAbnu7XK8N67"}
              ].map(s=>(
                <a key={s.n} href={s.url} target="_blank" rel="noopener"
                  style={{ background:"#fff", border:`1px solid ${s.c}20`,
                    borderTop:`4px solid ${s.c}`, borderRadius:8, padding:"14px 8px",
                    textAlign:"center", textDecoration:"none", display:"block",
                    transition:"box-shadow .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,.1)"}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow=""}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{s.ic}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:s.c }}>{s.n}</div>
                </a>
              ))}
            </div>
          </section>

          {/* THƯ VIỆN */}
          <section style={{ marginBottom:26 }}>
            <SecHead icon="📚" title="THƯ VIỆN" color="#7C3AED"
              onMore={() => go("thu-vien")}/>
            <div onClick={() => go("thu-vien")}
              style={{ display:"flex", borderRadius:10, overflow:"hidden",
                border:"1px solid #F3DDB5", cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.1)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow=""}>
              <div style={{ background:"#92400E", color:"#fff", padding:"20px 16px",
                display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", gap:4, minWidth:82, flexShrink:0 }}>
                <div style={{ fontSize:32 }}>📜</div>
                <div style={{ fontSize:18, fontWeight:900 }}>1883</div>
                <div style={{ fontSize:8.5, letterSpacing:"1px", opacity:.75 }}>HƯƠNG ƯỚC</div>
              </div>
              <div style={{ padding:"16px 20px", flex:1,
                background:"linear-gradient(135deg,#FEF7E4,#FFFBF2)" }}>
                <h3 style={{ fontFamily:"'Lora', serif", fontSize:16, fontWeight:900,
                  color:"#92400E", marginBottom:8 }}>Hương ước Xóm Ngọc Điền năm 1883</h3>
                <p style={{ fontSize:13, color:"#555", lineHeight:1.75 }}>
                  Bản hương ước lập từ năm 1883, lưu giữ nguyên vẹn qua 140 năm — tài sản văn hóa vô giá phản ánh luật tục và đạo lý của cha ông.
                </p>
              </div>
            </div>
          </section>

          {/* CỘNG ĐỒNG */}
          <section style={{ marginBottom:26 }}>
            <SecHead icon="🤝" title="CỘNG ĐỒNG NGỌC ĐIỀN" color="#0057B8"/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
              <a href="https://zalo.me/g/i8vuebonziplqy2c06ux" target="_blank" rel="noopener"
                style={{ background:"#0057B8", color:"#fff", borderRadius:10,
                  padding:"18px 12px", textAlign:"center", textDecoration:"none",
                  display:"block", transition:"opacity .15s" }}
                onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <div style={{ fontSize:32 }}>💬</div>
                <div style={{ fontSize:14, fontWeight:700, marginTop:8 }}>Nhóm Zalo</div>
                <div style={{ fontSize:11.5, opacity:.8, marginTop:4 }}>Cộng đồng Ngọc Điền</div>
                <div style={{ fontSize:10.5, opacity:.65, marginTop:3 }}>Bấm để tham gia →</div>
              </a>
              <a href="https://www.facebook.com/share/1BFnoXVtDB/" target="_blank" rel="noopener"
                style={{ background:"#1877F2", color:"#fff", borderRadius:10,
                  padding:"18px 12px", textAlign:"center", textDecoration:"none",
                  display:"block", transition:"opacity .15s" }}
                onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <div style={{ fontSize:32 }}>📘</div>
                <div style={{ fontSize:14, fontWeight:700, marginTop:8 }}>Facebook</div>
                <div style={{ fontSize:11.5, opacity:.8, marginTop:4 }}>Trang Xóm Ngọc Điền</div>
                <div style={{ fontSize:10.5, opacity:.65, marginTop:3 }}>Bấm để theo dõi →</div>
              </a>
              <a href="https://maps.app.goo.gl/gnWBNeAbnu7XK8N67" target="_blank" rel="noopener"
                style={{ background:"#EA4335", color:"#fff", borderRadius:10,
                  padding:"18px 12px", textAlign:"center", textDecoration:"none",
                  display:"block", transition:"opacity .15s" }}
                onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <div style={{ fontSize:32 }}>📍</div>
                <div style={{ fontSize:14, fontWeight:700, marginTop:8 }}>Bản đồ</div>
                <div style={{ fontSize:11.5, opacity:.8, marginTop:4 }}>Xóm Ngọc Điền</div>
                <div style={{ fontSize:10.5, opacity:.65, marginTop:3 }}>Xem Google Maps →</div>
              </a>
            </div>
          </section>

          {/* GÓP Ý & GỬI BÀI */}
          <section style={{ marginBottom:26 }}>
            <SecHead icon="✉️" title="GÓP Ý & GỬI BÀI" color="#B45309"
              onMore={() => go("gop-y")}/>
            <div style={{ background:"linear-gradient(135deg,#FEF3C7,#FFFBF0)",
              border:"1px solid #FCD34D", borderRadius:12, padding:"20px 22px",
              display:"flex", gap:20, alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ flex:1, minWidth:200 }}>
                <p style={{ fontSize:13.5, color:"#444", lineHeight:1.8, marginBottom:14 }}>
                  Bà con có bài viết, ý kiến đóng góp, phản ánh sự việc hoặc kiến nghị về xóm —
                  hãy gửi tới Ban quản trị qua form bên dưới.
                </p>
                <div style={{ display:"flex", gap:8 }}>
                  <a href="tel:0914587575"
                    style={{ background:"#0057B8", color:"#fff", borderRadius:7,
                      padding:"8px 14px", textDecoration:"none", fontSize:13,
                      fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                    💬 Zalo: 0914 587 575
                  </a>
                </div>
              </div>
              <button onClick={() => go("gop-y")}
                style={{ background:"#B45309", color:"#fff", border:"none",
                  borderRadius:8, padding:"12px 22px", fontSize:14, fontWeight:700,
                  cursor:"pointer", flexShrink:0 }}>
                ✉️ Vào trang gửi bài →
              </button>
            </div>
          </section>

        </div>

        <div className="nd-sidebar"><Sidebar setNav={setNav}/></div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   GÓP Ý & GỬI BÀI PAGE
═══════════════════════════════════════════ */
function GopYPage() {
  const [type,    setType]    = useState("gop_y");
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [done,    setDone]    = useState(false);
  const [err,     setErr]     = useState("");

  const EMAIL = "tinnhanhonline@mail.com";
  const ZALO  = "0914587575";

  const TYPES = [
    { id:"gop_y",     label:"💡 Góp ý",        color:"#0891B2" },
    { id:"phan_anh",  label:"📣 Phản ánh",      color:"#DC2626" },
    { id:"kien_nghi", label:"📋 Kiến nghị",     color:"#7C3AED" },
    { id:"gui_bai",   label:"📝 Gửi bài viết",  color:"#B45309" },
  ];
  const cur = TYPES.find(t => t.id === type);

  // Tạo nội dung sẵn để nhúng vào mailto href
  const mailBody = `Loại: ${cur?.label || 'Góp ý'}%0AHọ tên: ${encodeURIComponent(name || "(không điền)")}%0AĐiện thoại: ${encodeURIComponent(phone || "(không điền)")}%0A%0ANội dung:%0A${encodeURIComponent(content)}`;
  const mailSubject = encodeURIComponent(`[Ngọc Điền] ${subject || cur?.label || 'Góp ý'}`);
  const mailHref = `mailto:${EMAIL}?subject=${mailSubject}&body=${mailBody}`;
  const zaloHref = `https://zalo.me/${ZALO}`;

  const handleSend = () => {
    if (!content.trim()) {
      setErr("Vui lòng nhập nội dung trước khi gửi.");
      return;
    }
    setErr("");
    setDone(true);   // chỉ đổi state, không gọi window.open
  };

  const reset = () => {
    setDone(false); setErr("");
    setName(""); setPhone(""); setSubject(""); setContent(""); setType("gop_y");
  };

  /* ── MÀN HÌNH THÀNH CÔNG ── */
  if (done) return (
    <div style={{ maxWidth:560, margin:"40px auto", padding:"0 16px 60px" }}>
      <div style={{ background:"#fff", borderRadius:16,
        boxShadow:"0 4px 24px rgba(0,0,0,.08)", overflow:"hidden", textAlign:"center" }}>

        <div style={{ background:"linear-gradient(135deg,#16A34A,#22C55E)", padding:"32px 20px" }}>
          <div style={{ fontSize:60 }}>✅</div>
          <h2 style={{ fontFamily:"'Lora', serif", fontSize:22, fontWeight:900,
            color:"#fff", marginTop:8 }}>Thông tin đã sẵn sàng!</h2>
          <p style={{ color:"rgba(255,255,255,.85)", fontSize:13.5, marginTop:6 }}>
            Bây giờ bà con chọn cách gửi bên dưới
          </p>
        </div>

        <div style={{ padding:"28px 24px" }}>
          <p style={{ fontSize:14, color:"#374151", lineHeight:1.8, marginBottom:20 }}>
            Cảm ơn <strong>{name || "bà con"}</strong> đã soạn <strong>{cur?.label || "góp ý"}</strong>.<br/>
            Vui lòng bấm một trong hai nút bên dưới để gửi tới Ban quản trị:
          </p>

          {/* Nút gửi Email – thẻ <a> thuần */}
          <a href={mailHref}
            style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              background:"#1C1C1C", color:"#fff", borderRadius:10, padding:"14px 20px",
              textDecoration:"none", fontSize:15, fontWeight:700, marginBottom:12 }}>
            <span style={{ fontSize:22 }}>📧</span>
            Gửi qua Email
            <span style={{ fontSize:11, opacity:.7, fontWeight:400 }}>({EMAIL})</span>
          </a>

          {/* Nút mở Zalo – thẻ <a> thuần */}
          <a href={zaloHref} target="_blank" rel="noopener"
            style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              background:"#0057B8", color:"#fff", borderRadius:10, padding:"14px 20px",
              textDecoration:"none", fontSize:15, fontWeight:700, marginBottom:20 }}>
            <span style={{ fontSize:22 }}>💬</span>
            Nhắn Zalo cho Admin
            <span style={{ fontSize:11, opacity:.7, fontWeight:400 }}>({ZALO})</span>
          </a>

          {/* Nội dung tóm tắt để bà con copy thủ công nếu cần */}
          <div style={{ background:"#F9FAFB", border:"1px solid #E5E7EB",
            borderRadius:8, padding:"14px 16px", textAlign:"left", marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#888", letterSpacing:"1px",
              textTransform:"uppercase", marginBottom:8 }}>Nội dung bà con vừa soạn:</div>
            <div style={{ fontSize:13, color:"#374151", lineHeight:1.75, whiteSpace:"pre-wrap",
              wordBreak:"break-word" }}>
              <strong>Loại:</strong> {cur?.label || "Góp ý"}{"\n"}
              {name && <><strong>Họ tên:</strong> {name}{"\n"}</>}
              {phone && <><strong>SĐT:</strong> {phone}{"\n"}</>}
              {subject && <><strong>Tiêu đề:</strong> {subject}{"\n"}</>}
              <strong>Nội dung:</strong> {content}
            </div>
          </div>

          <p style={{ fontSize:12, color:"#aaa", lineHeight:1.7, marginBottom:20 }}>
            💡 Nếu ứng dụng không tự mở, bà con có thể sao chép nội dung trên rồi gửi trực tiếp tới:<br/>
            📧 <strong>{EMAIL}</strong> &nbsp;|&nbsp; 💬 Zalo: <strong>{ZALO}</strong>
          </p>

          <button onClick={reset}
            style={{ background:"#B91C1C", color:"#fff", border:"none", borderRadius:8,
              padding:"10px 28px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
            ← Soạn nội dung khác
          </button>
        </div>
      </div>
    </div>
  );

  /* ── FORM ── */
  const INP = { width:"100%", border:"1px solid #E5E7EB", borderRadius:7,
    padding:"9px 12px", fontSize:13, outline:"none",
    boxSizing:"border-box", background:"#fff" };

  return (
    <div style={{ maxWidth:640, margin:"0 auto", padding:"24px 16px 60px" }}>

      {/* Banner */}
      <div style={{ background:"linear-gradient(135deg,#9B1B14,#B91C1C)", color:"#fff",
        borderRadius:12, padding:"20px 22px", marginBottom:22,
        display:"flex", alignItems:"center", gap:14 }}>
        <span style={{ fontSize:34 }}>✉️</span>
        <div>
          <h1 style={{ fontFamily:"'Lora', serif", fontSize:21, fontWeight:900 }}>
            Góp ý & Gửi bài
          </h1>
          <p style={{ opacity:.75, fontSize:12.5, marginTop:3 }}>
            Gửi bài viết, góp ý, phản ánh tới Ban quản trị Xóm Ngọc Điền
          </p>
        </div>
      </div>

      {/* Liên hệ nhanh */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        <a href={`tel:${ZALO}`}
          style={{ background:"#0057B8", color:"#fff", borderRadius:10,
            padding:"13px 14px", textDecoration:"none",
            display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:26 }}>💬</span>
          <div>
            <div style={{ fontSize:9.5, opacity:.7, letterSpacing:"1px" }}>ZALO / GỌI ĐIỆN</div>
            <div style={{ fontWeight:900, fontSize:15, marginTop:1 }}>{ZALO}</div>
          </div>
        </a>
        <a href={`mailto:${EMAIL}`}
          style={{ background:"#1C1C1C", color:"#fff", borderRadius:10,
            padding:"13px 14px", textDecoration:"none",
            display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:26 }}>📧</span>
          <div>
            <div style={{ fontSize:9.5, opacity:.7, letterSpacing:"1px" }}>EMAIL</div>
            <div style={{ fontWeight:700, fontSize:12, marginTop:1, wordBreak:"break-all" }}>{EMAIL}</div>
          </div>
        </a>
      </div>

      {/* Form card */}
      <div style={{ background:"#fff", borderRadius:12,
        boxShadow:"0 2px 16px rgba(0,0,0,.07)" }}>

        {/* Loại yêu cầu */}
        <div style={{ padding:"18px 20px", borderBottom:"1px solid #F3F4F6" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#888",
            letterSpacing:"1px", textTransform:"uppercase", marginBottom:10 }}>Loại yêu cầu</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {TYPES.map(t => (
              <button key={t.id} onClick={() => setType(t.id)}
                style={{ padding:"9px 10px", borderRadius:8, border:"2px solid",
                  borderColor: type===t.id ? t.color : "#E5E7EB",
                  background:  type===t.id ? t.color+"18" : "#FAFAFA",
                  color:       type===t.id ? t.color : "#555",
                  fontWeight:700, fontSize:12.5, cursor:"pointer", textAlign:"left" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Người gửi */}
        <div style={{ padding:"18px 20px", borderBottom:"1px solid #F3F4F6" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#888",
            letterSpacing:"1px", textTransform:"uppercase", marginBottom:10 }}>
            Thông tin người gửi &nbsp;
            <span style={{ color:"#bbb", fontWeight:400, textTransform:"none" }}>(không bắt buộc)</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label style={{ display:"block", fontSize:12, color:"#666", marginBottom:4 }}>Họ và tên</label>
              <input value={name} onChange={e=>setName(e.target.value)}
                placeholder="Nguyễn Văn A" style={INP as any}/>
            </div>
            <div>
              <label style={{ display:"block", fontSize:12, color:"#666", marginBottom:4 }}>Số điện thoại</label>
              <input value={phone} onChange={e=>setPhone(e.target.value)}
                placeholder="0912 345 678" type="tel" style={INP as any}/>
            </div>
          </div>
        </div>

        {/* Nội dung */}
        <div style={{ padding:"18px 20px" }}>
          <div style={{ marginBottom:12 }}>
            <label style={{ display:"block", fontSize:12, color:"#666", marginBottom:4 }}>Tiêu đề</label>
            <input value={subject} onChange={e=>setSubject(e.target.value)}
              placeholder={type==="gui_bai" ? "Tên bài viết..." : "Tiêu đề ngắn gọn..."}
              style={INP as any}/>
          </div>
          <div>
            <label style={{ display:"block", fontSize:12, color:"#666", marginBottom:4 }}>
              Nội dung <span style={{ color:"#B91C1C" }}>*</span>
            </label>
            <textarea value={content}
              onChange={e=>{ setContent(e.target.value); setErr(""); }}
              rows={6}
              placeholder={type==="gui_bai"
                ? "Dán nội dung bài viết vào đây, hoặc mô tả ngắn để ban biên tập liên hệ..."
                : "Trình bày chi tiết góp ý, phản ánh hoặc kiến nghị của bà con..."}
              style={{ ...INP, resize:"vertical", lineHeight:1.7,
                border:`1px solid ${err?"#B91C1C":"#E5E7EB"}` } as any}/>
          </div>

          {err && (
            <div style={{ background:"#FEE2E2", border:"1px solid #FECACA",
              borderRadius:7, padding:"8px 14px", marginTop:10,
              color:"#B91C1C", fontSize:13 }}>⚠️ {err}</div>
          )}

          {/* NÚT GỬI – onClick chỉ gọi setState */}
          <button onClick={handleSend}
            style={{ width:"100%", marginTop:18, background:"#B91C1C", color:"#fff",
              border:"none", borderRadius:8, padding:"13px", fontSize:15,
              fontWeight:700, cursor:"pointer", letterSpacing:".3px" }}>
            Tiếp tục gửi →
          </button>
          <p style={{ fontSize:11.5, color:"#aaa", textAlign:"center", marginTop:8 }}>
            Bước tiếp theo sẽ cho phép bà con chọn gửi qua Email hoặc Zalo
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CATPAGE
═══════════════════════════════════════════ */
function CatPage({ cat, sub, setNav }: { cat?: any, sub?: any, setNav?: any }) {
  const [arts, setArts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const limit = 6;

  if (cat === "gop-y") return <GopYPage />;

  useEffect(() => {
    setArts([]); setPage(0); setHasMore(false);
    fetchCat(0);
  }, [cat, sub]);

  const fetchCat = async (pageNum: any) => {
    setLoading(true);

    const slugMap: any = {
      "Thơ": ["tho", "thơ"],
      "Tản văn": ["tan-van", "tản văn"],
      "Khám phá": ["kham-pha"],
      "Góc nhìn thẳng": ["goc-nhin-thang"],
      "Podcast": ["podcast"],
      "Mẹ Việt Nam Anh hùng": ["me-vnah"],
      "Liệt sỹ": ["liet-sy"],
      "Anh hùng lao động Cao Lục": ["anh-hung"],
      "Đảng viên đầu tiên": ["dang-vien"],
      "Đền Ngọc Điền": ["den", "đền"],
      "Giếng làng": ["gieng", "giếng"],
      "Lễ hội đền": ["le-hoi-den"],
      "Lễ hội xóm": ["le-hoi-xom"],
      "Lễ hội giếng": ["le-hoi-gieng"],
      "Hương ước 1883": ["huong-uoc"],
      "Thông báo": ["thong-bao"],
      "Sự kiện": ["su-kien"]
    };

    const treeMap: any = {
      "tieng-lang": ["tieng-lang", "tho", "thơ", "tan-van", "tản văn", "kham-pha", "goc-nhin-thang", "podcast"],
      "nguoi-ngoc-dien": ["nguoi-ngoc-dien", "me-vnah", "liet-sy", "anh-hung", "dang-vien"],
      "di-tich": ["di-tich", "den", "đền", "gieng", "giếng"],
      "le-hoi": ["le-hoi", "le-hoi-den", "le-hoi-xom", "le-hoi-gieng"],
      "thu-vien": ["thu-vien", "huong-uoc", "dang-bo"],
      "tin-tuc": ["tin-tuc", "thong-bao", "su-kien"]
    };

    let searchIds = [];
    if (sub) {
      searchIds = slugMap[sub] || [sub];
    } else {
      searchIds = treeMap[cat] || [cat];
    }

    const { data } = await supabase
      .from('articles')
      .select('*')
      .in('cat', searchIds)
      .order('id', { ascending: false })
      .range(pageNum * limit, (pageNum + 1) * limit - 1);
      
    if (data) {
      setArts(prev => pageNum === 0 ? data : [...prev, ...data]);
      setHasMore(data.length === limit);
      setPage(pageNum + 1);
    }
    setLoading(false);
  };

  const info = CATS.find(c => c.slug === cat) || { label: cat, icon: "📄" };
  const goArt = (a: any) => { setNav({ page: "article", article: a }); window.scrollTo(0,0); };
  const subList = (SUBS as any)[cat] || [];

  return (
    <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 16px" }}>
      <div style={{ background:"linear-gradient(135deg,#9B1B14,#B91C1C)", color:"#fff", borderRadius:"0 0 12px 12px", padding:"22px 20px", marginBottom:22, display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ width:50, height:50, background:"rgba(255,255,255,.15)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{info.icon}</div>
        <div>
          <h1 style={{ fontFamily:"'Lora', serif", fontSize:22, fontWeight:900 }}>{sub ? sub.toUpperCase() : info.label.toUpperCase()}</h1>
          <p style={{ opacity:.7, fontSize:12, marginTop:3 }}>Chuyên mục nội dung</p>
        </div>
      </div>

      {subList.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:25, paddingBottom:15, borderBottom:"1px solid #E8DDD0" }}>
          <button onClick={() => setNav({ page: "category", cat: cat, sub: "" })}
            style={{ padding:"6px 15px", borderRadius:20, fontSize:13, fontWeight:600, border:"none", cursor:"pointer",
            background: !sub ? "#B91C1C" : "#fff", color: !sub ? "#fff" : "#666", boxShadow: !sub ? "none" : "0 1px 3px rgba(0,0,0,0.1)" }}>
            Tất cả
          </button>
          {subList.map((sItem: string) => (
            <button key={sItem} onClick={() => setNav({ page: "category", cat: cat, sub: sItem })}
              style={{ padding:"6px 15px", borderRadius:20, fontSize:13, fontWeight:600, border:"none", cursor:"pointer",
              background: sub === sItem ? "#B91C1C" : "#fff", color: sub === sItem ? "#fff" : "#666", boxShadow: sub === sItem ? "none" : "0 1px 3px rgba(0,0,0,0.1)" }}>
              {sItem}
            </button>
          ))}
        </div>
      )}

      {arts.length > 0 ? (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
            {arts.map(a=><ACard key={a.id} a={a} onClick={goArt}/>)}
          </div>
          {hasMore && (
            <div style={{ textAlign:"center", marginTop:35, marginBottom:40 }}>
              <button onClick={() => fetchCat(page)} disabled={loading} style={{ background:"#fff", border:"2px solid #B91C1C", color:"#B91C1C", padding:"10px 28px", borderRadius:30, fontWeight:900, cursor:"pointer" }}>
                {loading ? "⏳ Đang tải..." : "↓ Tải thêm bài viết"}
              </button>
            </div>
          )}
        </>
      ) : !loading ? (
        <div style={{ background:"#fff", border:"2px dashed #E8DDD0", borderRadius:12, padding:"60px 20px", textAlign:"center" }}>
          <div style={{ fontSize:44, marginBottom:12 }}>{info.icon}</div>
          <h2 style={{ fontFamily:"'Lora', serif", fontSize:18, fontWeight:700, marginBottom:8 }}>Chưa có bài viết</h2>
        </div>
      ) : (
        <p style={{textAlign:'center', color:'#888'}}>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}
/* ═══════════════════════════════════════════
   ARTICLE PAGE (HIỂN THỊ NỘI DUNG THẬT & UX ĐỌC)
═══════════════════════════════════════════ */
function ArtPage({ article: a, setNav }: { article?: any, setNav?: any }) {
  const url = `https://ngocdien.info.vn/bai-viet/${a.slug}`;
  const defaultImg = "https://picsum.photos/seed/" + (a.id || 1) + "nd/800/440";
  
  // UX 1: Quản lý nút Tăng/Giảm cỡ chữ (Mặc định cỡ 15px)
  const [fSize, setFSize] = useState(15);
  
  // UX 2: Tự động tính thời gian đọc (Giả định tốc độ đọc 200 từ/phút)
  const textContent = a.content ? a.content.replace(/<[^>]*>?/gm, '') : (a.excerpt || '');
  const wordCount = textContent.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 16px" }}>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"22px 0" }}>
        
        {/* Breadcrumb (Đường dẫn) */}
        <div style={{ display:"flex", gap:6, fontSize:12, color:"#aaa", marginBottom:14, flexWrap:"wrap" }}>
          <button onClick={() => setNav({ page:"home" })} style={{ background:"none", border:"none", color:"#B91C1C", cursor:"pointer", fontSize:12 }}>Trang chủ</button>
          <span>›</span>
          <button onClick={() => setNav({ page:"category", cat:a.cat })} style={{ background:"none", border:"none", color:"#B91C1C", cursor:"pointer", fontSize:12 }}>
            {CATS.find(c=>c.slug===a.cat)?.label||a.cat}
          </button>
          <span>›</span>
          <span style={{ color:"#555" }}>{a.title}</span>
        </div>
        
        <Tag label={a.cat}/>
        <h1 style={{ fontFamily:"'Lora', serif", fontSize:"clamp(20px,4vw,30px)", fontWeight:900, lineHeight:1.38, margin:"12px 0" }}>{a.title}</h1>
        
        {/* THANH CÔNG CỤ ĐỌC (MỚI THÊM) */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #EAE0D0", paddingBottom:12, marginBottom:16, flexWrap:"wrap", gap:10 }}>
          
          <p style={{ color:"#aaa", fontSize:12.5, margin:0 }}>
            ✍️ Ban biên tập &nbsp;·&nbsp; 📅 {a.date} &nbsp;·&nbsp; <span style={{color:"#0891B2", fontWeight:700}}>⏱️ Đọc {readTime} phút</span>
          </p>
          
          {/* Bộ điều khiển cỡ chữ cho người lớn tuổi */}
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"#FFFBF5", padding:"4px 8px", borderRadius:6, border:"1px solid #E8DDD0" }}>
            <span style={{ fontSize:10, color:"#888", fontWeight:700, letterSpacing:"1px" }}>CỠ CHỮ:</span>
            <button 
              onClick={() => setFSize(s => Math.max(14, s - 2))} 
              style={{ border:"1px solid #E5E7EB", background:"#fff", width:26, height:26, borderRadius:4, cursor:"pointer", fontWeight:900, color:"#555", transition:"all 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#B91C1C"} onMouseLeave={e=>e.currentTarget.style.borderColor="#E5E7EB"}
            >A-</button>
            <span style={{ fontSize:13, fontWeight:700, width:18, textAlign:"center", color:"#1C1C1C" }}>{fSize}</span>
            <button 
              onClick={() => setFSize(s => Math.min(26, s + 2))} 
              style={{ border:"1px solid #E5E7EB", background:"#fff", width:26, height:26, borderRadius:4, cursor:"pointer", fontWeight:900, color:"#555", transition:"all 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#B91C1C"} onMouseLeave={e=>e.currentTarget.style.borderColor="#E5E7EB"}
            >A+</button>
          </div>

        </div>
        
        <img src={a.img || defaultImg} alt={a.title} style={{ width:"100%", borderRadius:10, marginBottom:20, display:"block", maxHeight:450, objectFit:'cover' }}/>
        
        {/* NỘI DUNG BÀI VIẾT TỰ ĐỘNG THAY ĐỔI CỠ CHỮ */}
        <div 
          style={{ 
            fontSize: fSize, // Gắn biến cỡ chữ vào đây
            lineHeight: 1.85, 
            color: "#333", 
            marginTop: 24,
            transition: "font-size 0.3s ease" // Hiệu ứng phóng to thu nhỏ mượt mà
          }}
          dangerouslySetInnerHTML={{ __html: a.content || a.excerpt || "<p>Chưa có nội dung chi tiết.</p>" }}
        />
        
        <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:30, padding:"14px 0", borderTop:"1px solid #EDE5D8", borderBottom:"1px solid #EDE5D8" }}>
          <span style={{ fontSize:12, fontWeight:700, color:"#888" }}>CHIA SẺ BÀI VIẾT:</span>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" style={{ background:"#1877F2", color:"#fff", borderRadius:5, padding:"6px 14px", fontSize:12.5, fontWeight:700, textDecoration:"none" }}>📘 Facebook</a>
          <a href={`https://zalo.me/share/article?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" style={{ background:"#0057B8", color:"#fff", borderRadius:5, padding:"6px 14px", fontSize:12.5, fontWeight:700, textDecoration:"none" }}>💬 Zalo</a>
        </div>
        
        <BtnRed onClick={() => { setNav({ page:"home" }); window.scrollTo(0,0); }} style={{ marginTop:20 }}>← Quay lại Trang chủ</BtnRed>
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */
function Footer({ setNav }: { setNav?: any }) {
  const go = (page: any, extra: any = {}) => { setNav({ page, ...extra }); window.scrollTo(0,0); };
  const ql = [["Trang chủ","home"],["Tin tức","cat","tin-tuc"],["Lịch sử xóm","cat","lich-su"],
              ["Tiếng làng","cat","tieng-lang"],["Di tích","cat","di-tich"],
              ["Lễ hội","cat","le-hoi"],["Góp ý & Gửi bài","cat","gop-y"],["Quản trị","admin-login"]];
  return (
    <footer style={{ background:"#181818", color:"#fff", marginTop:40 }}>
      <div style={{ height:4, background:"#B91C1C" }}/>
      <div style={{ height:2, background:"#C8942B" }}/>
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"30px 16px 0" }}>
        <div style={{ display:"flex", gap:40, flexWrap:"wrap",
          paddingBottom:24, borderBottom:"1px solid #262626" }}>
          <div style={{ minWidth:220, maxWidth:280 }}>
            {/* LOGO CHÍNH THỨC Ở CHÂN TRANG (ĐÃ THU NHỎ) */}
          <div style={{ background: "#fff", padding: "4px 10px", borderRadius: "6px", display: "inline-block", marginBottom: "12px" }}>
            <img 
              src="/logo.png" 
              alt="Xóm Ngọc Điền" 
              style={{ height: "32px", width: "auto", display: "block", objectFit: "contain" }} 
            />
          </div>
            <p style={{ color:"#9CA3AF", fontSize:12.5, lineHeight:1.8, marginTop:12 }}>
              Cổng thông tin điện tử Xóm Ngọc Điền, Hưng Nguyên, Nghệ An.
            </p>
            <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:6 }}>
              <a href="mailto:tinnhanhonline247@gmail.com" style={{ color:"#B0B7C3",
                fontSize:13, textDecoration:"none", display:"flex", gap:7 }}>
                <span style={{ color:"#C8942B" }}>📧</span> tinnhanhonline247@gmail.com
              </a>
              <a href="tel:0914587575" style={{ color:"#B0B7C3",
                fontSize:13, textDecoration:"none", display:"flex", gap:7 }}>
                <span style={{ color:"#C8942B" }}>📞</span> 0914 58 75 75
              </a>
            </div>
          </div>
          <div style={{ flex:1, minWidth:220 }}>
            <div style={{ color:"#C8942B", fontSize:10, fontWeight:700, letterSpacing:"2px",
              textTransform:"uppercase", borderBottom:"1px solid #2e2e2e",
              paddingBottom:8, marginBottom:12 }}>DANH MỤC NHANH</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"2px 0" }}>
              {ql.map(([label,type,cat])=>(
                <button key={label} onClick={()=>{
                  if (type==="cat") go("category",{cat});
                  else go(type);
                }} style={{ background:"none", border:"none", color:"#9CA3AF",
                  fontSize:12.5, cursor:"pointer", whiteSpace:"nowrap",
                  padding:"3px 14px 3px 0", display:"flex", gap:5, alignItems:"center" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#C8942B"}
                  onMouseLeave={e=>e.currentTarget.style.color="#9CA3AF"}>
                  <span style={{ color:"#444", fontSize:10 }}>›</span>{label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          flexWrap:"wrap", gap:8, padding:"13px 0" }}>
          <span style={{ fontSize:11.5, color:"#4B5563" }}>
            © 2025 Xóm Ngọc Điền, Hưng Nguyên, Nghệ An · Bảo lưu mọi quyền
          </span>
          <span style={{ fontSize:11.5, color:"#C8942B", fontWeight:700 }}>⚡ Phát triển bởi Thái Lão</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   ADMIN LOGIN  ← KHÔNG CÓ SYNTAX ERROR
═══════════════════════════════════════════ */
function AdminLogin({ setNav }: { setNav?: any }) {
  const [pw, setPw]   = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const doLogin = () => {
    if (busy) return;
    if (!pw.trim()) { setErr("Vui lòng nhập mật khẩu"); return; }
    setBusy(true);
    setErr("");
    // So sánh mật khẩu trực tiếp, không dùng setTimeout để tránh sandbox chặn
    if (pw === "NgocDien@2025") {
      setNav({ page:"admin" });
    } else {
      setErr("❌ Sai mật khẩu. Hãy thử lại.");
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh",
      background:"linear-gradient(135deg,#9B1B14,#B91C1C)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:380,
        boxShadow:"0 20px 60px rgba(0,0,0,.35)", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:"#1C1C1C", padding:"22px", textAlign:"center" }}>
          <div style={{ fontFamily:"'Lora', serif", fontSize:22, fontWeight:900,
            color:"#fff", letterSpacing:"3px" }}>NGỌC ĐIỀN</div>
          <div style={{ color:"#C8942B", fontSize:10, letterSpacing:"3px",
            marginTop:5, fontStyle:"italic" }}>QUẢN TRỊ HỆ THỐNG</div>
        </div>

        {/* Body – KHÔNG dùng <form> */}
        <div style={{ padding:"28px" }}>
          <h2 style={{ fontFamily:"'Lora', serif", fontSize:20,
            textAlign:"center", marginBottom:22 }}>Đăng nhập</h2>

          {/* Email – readonly */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888",
              letterSpacing:"1px", textTransform:"uppercase", marginBottom:5 }}>Email</label>
            <input
              readOnly
              value="admin@ngocdien.info.vn"
              style={{ width:"100%", border:"1px solid #E5E7EB", borderRadius:7,
                padding:"9px 12px", fontSize:13, background:"#F9FAFB",
                color:"#666", boxSizing:"border-box" }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888",
              letterSpacing:"1px", textTransform:"uppercase", marginBottom:5 }}>Mật khẩu</label>
            <input
              type="password"
              value={pw}
              autoFocus
              placeholder="Nhập mật khẩu..."
              onChange={e => { setPw(e.target.value); setErr(""); }}
              onKeyDown={e => { if (e.key === "Enter") doLogin(); }}
              style={{ width:"100%",
                border:`2px solid ${err ? "#B91C1C" : "#E5E7EB"}`,
                borderRadius:7, padding:"9px 12px", fontSize:13, outline:"none",
                boxSizing:"border-box", transition:"border-color .2s" }}
            />
          </div>

          {/* Error */}
          {err && (
            <div style={{ background:"#FEE2E2", border:"1px solid #FECACA",
              borderRadius:7, padding:"9px 14px", marginBottom:14,
              color:"#B91C1C", fontSize:13, textAlign:"center" }}>
              {err}
            </div>
          )}

          {/* Login button – onClick trực tiếp, không qua form submit */}
          <button
            onClick={doLogin}
            style={{ width:"100%", background:"#B91C1C", color:"#fff",
              border:"none", padding:"12px", fontSize:15, fontWeight:700,
              borderRadius:8, cursor:"pointer", letterSpacing:".3px" }}>
            Đăng nhập →
          </button>

          {/* Hint */}
          <div style={{ background:"#F9FAFB", border:"1px solid #E5E7EB",
            borderRadius:7, padding:"10px 14px", marginTop:14, fontSize:12, color:"#888" }}>
            🔑 Mật khẩu: <strong style={{ color:"#1C1C1C" }}>NgocDien@2025</strong>
          </div>

          <button
            onClick={() => setNav({ page:"home" })}
            style={{ display:"block", width:"100%", marginTop:12,
              background:"none", border:"none", color:"#aaa",
              cursor:"pointer", fontSize:12.5, padding:"6px" }}>
            ← Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ADMIN PANEL
═══════════════════════════════════════════ */
const ATABS = [
  {id:"dash",     label:"Tổng quan",  icon:"📊"},
  {id:"articles", label:"Bài viết",   icon:"📝"},
  {id:"people",   label:"Người ND",   icon:"👥"},
  {id:"podcast",  label:"Podcast",    icon:"🎙"},
  {id:"feedback", label:"Góp ý",      icon:"✉️"},
  {id:"settings", label:"Cài đặt",    icon:"⚙️"},
];
const FI = { display:"block",width:"100%",border:"1px solid #E5E7EB",borderRadius:7,
  padding:"9px 12px",fontSize:13,outline:"none",background:"#fff",boxSizing:"border-box" };
const FL = { display:"block",fontSize:11,fontWeight:700,color:"#6B7280",
  letterSpacing:"1px",textTransform:"uppercase",marginBottom:5 };

function AdminPanel({ setNav }: { setNav?: any }) {
  const [tab,  setTab]  = useState("dash");
  const [mOpen,setMOpen] = useState(false);

  return (
    <div style={{ minHeight:"100vh", background:"#F3F4F6", display:"flex" }}>
      {mOpen && <div onClick={()=>setMOpen(false)} style={{ position:"fixed",inset:0,
        background:"rgba(0,0,0,.5)",zIndex:40 }}/>}
      <aside className={`nd-asb${mOpen?" open":""}`}>
        <div style={{ padding:"16px 14px", borderBottom:"1px solid #2a2a2a" }}>
          <div style={{ fontFamily:"'Lora', serif",fontSize:16,fontWeight:900,letterSpacing:"2px" }}>
            NGỌC ĐIỀN
          </div>
          <div style={{ color:"#C8942B",fontSize:9,letterSpacing:"2px",marginTop:3 }}>QUẢN TRỊ</div>
        </div>
        <nav style={{ flex:1, paddingTop:6 }}>
          {ATABS.map(t=>(
            <button key={t.id} onClick={()=>{ setTab(t.id); setMOpen(false); }}
              style={{ width:"100%",textAlign:"left",padding:"10px 14px",
                background:tab===t.id?"#B91C1C":"none",border:"none",
                color:tab===t.id?"#fff":"#C9CDD6",
                fontSize:13,fontWeight:600,cursor:"pointer",
                display:"flex",alignItems:"center",gap:9 }}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:"12px 14px",borderTop:"1px solid #2a2a2a" }}>
          <button onClick={()=>setNav({ page:"home" })}
            style={{ width:"100%",background:"rgba(255,255,255,.07)",border:"none",
              color:"#ccc",padding:"7px",borderRadius:6,cursor:"pointer",fontSize:12 }}>
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      <div className="nd-amain">
        <div style={{ background:"#fff",borderBottom:"1px solid #E5E7EB",
          padding:"12px 24px",display:"flex",alignItems:"center",
          position:"sticky",top:0,zIndex:30 }}>
          <button onClick={()=>setMOpen(true)} style={{ background:"none",border:"none",
            fontSize:20,cursor:"pointer",marginRight:12 }}>☰</button>
          <h2 style={{ fontFamily:"'Lora', serif",fontSize:17,fontWeight:700,flex:1 }}>
            {ATABS.find(t=>t.id===tab)?.icon} {ATABS.find(t=>t.id===tab)?.label}
          </h2>
          <button onClick={()=>{ setNav({ page:"home" }); window.scrollTo(0,0); }}
            style={{ background:"none",border:"none",color:"#B91C1C",
              fontSize:12.5,fontWeight:700,cursor:"pointer" }}>
            ← Xem website
          </button>
        </div>
        <div style={{ flex:1,padding:"22px 24px",overflowY:"auto" }}>
          {tab==="dash"     && <ADash setTab={setTab}/>}
          {tab==="articles" && <AArts/>}
          {tab==="people"   && <APeople/>}
          {tab==="podcast"  && <APod/>}
          {tab==="feedback" && <AFB/>}
          {tab==="settings" && <ASet/>}
        </div>
      </div>
    </div>
  );
}

function ADash({ setTab }: { setTab?: any }) {
  const cards=[
    {icon:"📝",label:"Bài viết",val:6,sub:"bài",t:"articles",c:"#B91C1C"},
    {icon:"👥",label:"Người ND",val:0,sub:"hồ sơ",t:"people",c:"#7C3AED"},
    {icon:"🎙",label:"Podcast",val:0,sub:"tập",t:"podcast",c:"#0891B2"},
    {icon:"✉️",label:"Góp ý mới",val:3,sub:"chờ",t:"feedback",c:"#D97706"},
  ];
  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
        gap:12,marginBottom:22 }}>
        {cards.map(c=>(
          <button key={c.t} onClick={()=>setTab(c.t)}
            style={{ background:"#fff",border:"none",borderTop:`4px solid ${c.c}`,
              borderRadius:10,padding:"16px",textAlign:"left",cursor:"pointer",
              boxShadow:"0 1px 4px rgba(0,0,0,.07)" }}>
            <div style={{ fontSize:26,marginBottom:6 }}>{c.icon}</div>
            <div style={{ fontSize:30,fontWeight:900,color:c.c,lineHeight:1 }}>{c.val}</div>
            <div style={{ fontSize:11,color:"#9CA3AF",marginTop:2 }}>{c.sub}</div>
            <div style={{ fontSize:13,fontWeight:700,color:"#374151",marginTop:4 }}>{c.label}</div>
          </button>
        ))}
      </div>
      <div style={{ background:"#fff",borderRadius:10,padding:"18px 20px",
        boxShadow:"0 1px 4px rgba(0,0,0,.07)" }}>
        <h3 style={{ fontFamily:"'Lora', serif",fontSize:16,fontWeight:700,marginBottom:12 }}>
          📋 Hướng dẫn nhanh
        </h3>
        {["📝 Bài viết → Tạo mới → điền nội dung → Đăng ngay",
          "⭐ Tick Nổi bật để bài hiện ở Carousel trang chủ (tối đa 5)",
          "👥 Người ND → Thêm Mẹ VNAH, Liệt sỹ, Anh hùng lao động",
          "🎙 Podcast → Upload MP3 → điền số tập → Xuất bản",
          "✉️ Góp ý: Xem phản hồi từ người dân, đánh dấu đã xử lý",
          "⚙️ Cài đặt: sửa thông tin liên hệ, link Zalo, Facebook"
        ].map((t,i)=>(
          <div key={i} style={{ fontSize:13,color:"#6B7280",lineHeight:1.7,
            padding:"5px 0",borderBottom:"1px solid #F9FAFB" }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ADMIN: QUẢN LÝ BÀI VIẾT (ĐÃ KẾT NỐI SUPABASE THỰC)
═══════════════════════════════════════════ */
function AArts() {
  const [list, setList] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null); 
  const [isSaving, setIsSaving] = useState(false);
  
  const initForm = {
    title: "", slug: "", excerpt: "", content: "", status: "published",
    cat: "", author: "Ban biên tập", featured: false, img: "", video: "", audio: ""
  };
  const [form, setForm] = useState(initForm);

  // Danh sách chuyên mục chuẩn xác để lưu thẳng vào Supabase
  const ADMIN_OPTIONS = [
    { val: "tin-tuc", lbl: "Tin tức" }, { val: "thong-bao", lbl: "— Thông báo" }, { val: "su-kien", lbl: "— Sự kiện" },
    { val: "nguoi-ngoc-dien", lbl: "Người Ngọc Điền" }, { val: "me-vnah", lbl: "— Mẹ VNAH" }, { val: "liet-sy", lbl: "— Liệt sỹ" }, { val: "anh-hung", lbl: "— Anh hùng" }, { val: "dang-vien", lbl: "— Đảng viên" },
    { val: "tieng-lang", lbl: "Tiếng làng" }, { val: "tan-van", lbl: "— Tản văn" }, { val: "tho", lbl: "— Thơ" }, { val: "kham-pha", lbl: "— Khám phá" }, { val: "goc-nhin-thang", lbl: "— Góc nhìn" }, { val: "podcast", lbl: "— Podcast" },
    { val: "di-tich", lbl: "Di tích" }, { val: "den", lbl: "— Đền Ngọc Điền" }, { val: "gieng", lbl: "— Giếng làng" },
    { val: "le-hoi", lbl: "Lễ hội" }, { val: "le-hoi-den", lbl: "— Lễ hội Đền" }, { val: "le-hoi-xom", lbl: "— Lễ hội Xóm" }, { val: "le-hoi-gieng", lbl: "— Lễ hội Giếng" },
    { val: "thu-vien", lbl: "Thư viện" }, { val: "huong-uoc", lbl: "— Hương ước" }, { val: "dang-bo", lbl: "— Đảng bộ" }
  ];

  // 1. Tự động lấy tất cả bài viết từ Supabase khi mở Quản trị
  const loadAdminArts = async () => {
    const { data } = await supabase.from('articles').select('*').order('id', { ascending: false });
    if (data) setList(data);
  };

  useEffect(() => {
    loadAdminArts();
  }, []);

  // 2. Lưu hoặc Sửa bài viết thẳng vào Supabase
  const handleSave = async () => {
    if (!form.title || !form.slug || !form.cat) {
      alert("Vui lòng điền đủ Tiêu đề, Slug và Chọn chuyên mục!");
      return;
    }
    setIsSaving(true);
    
    const payload = {
      title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content,
      status: form.status, cat: form.cat, author: form.author, featured: form.featured,
      img: form.img || "https://picsum.photos/seed/"+Date.now()+"/400/220",
      video: form.video, audio: form.audio,
      date: new Date().toLocaleDateString("vi-VN")
    };
    
    if (editId) {
      const { error } = await supabase.from('articles').update(payload).eq('id', editId);
      if (error) alert("Lỗi khi sửa: " + error.message);
      else alert("Cập nhật thành công!");
    } else {
      const { error } = await supabase.from('articles').insert([payload]);
      if (error) alert("Lỗi khi thêm mới: " + error.message);
      else alert("Thêm bài viết thành công!");
    }
    
    await loadAdminArts(); // Load lại ngay sau khi lưu
    setForm(initForm); setEditId(null); setShow(false); setIsSaving(false);
  };

  // 3. Chuẩn bị dữ liệu khi bấm nút Sửa
  const handleEdit = (article: any) => {
    setForm({
      title: article.title || "", slug: article.slug || "", excerpt: article.excerpt || "",
      content: article.content || "", status: article.status || "published",
      cat: article.cat || "", author: article.author || "Ban biên tập",
      featured: article.featured || false, img: article.img || "",
      video: article.video || "", audio: article.audio || ""
    });
    setEditId(article.id);
    setShow(true);
  };

  // 4. Xóa bài viết vĩnh viễn khỏi Supabase
  const handleDelete = async (id: any) => { 
    if(confirm("Bác có chắc chắn muốn xóa bài viết này khỏi hệ thống không? Hành động này không thể hoàn tác!")) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) alert("Lỗi khi xóa: " + error.message);
      else {
        alert("Đã xóa bài viết!");
        await loadAdminArts();
      }
    }
  };

  const mockUpload = (type: any) => { alert(`Tính năng này cần thiết lập Supabase Storage.`); };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16, alignItems:"center" }}>
        <span style={{ fontSize:13, color:"#888", fontWeight:700 }}>Tổng số: {list.length} bài viết</span>
        {!show && (
          <button onClick={() => { setForm(initForm); setEditId(null); setShow(true); }} 
            style={{ background:"#B91C1C", color:"#fff", border:"none", borderRadius:7, 
              padding:"9px 18px", fontWeight:700, cursor:"pointer", fontSize:13 }}>
            + Tạo bài viết mới
          </button>
        )}
      </div>

      {show && (
        <div style={{ background:"#FFFBF5", borderRadius:12, padding:"24px 20px", marginBottom:20, border:"1px solid #E8DDD0", boxShadow:"0 4px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, borderBottom:"2px solid #B91C1C", paddingBottom:12 }}>
            <h2 style={{ fontFamily:"'Lora', serif", fontSize:22, fontWeight:900, color:"#1C1C1C", margin:0 }}>
              {editId ? "Chỉnh sửa bài viết" : "Bài viết mới"}
            </h2>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShow(false)} style={{ background:"#F3F4F6", border:"1px solid #E5E7EB", padding:"8px 16px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:700, color:"#4B5563" }}>
                Hủy
              </button>
              <button onClick={handleSave} disabled={isSaving} style={{ background:"#B91C1C", color:"#fff", border:"none", padding:"8px 24px", borderRadius:7, fontWeight:700, cursor:"pointer", fontSize:13 }}>
                {isSaving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div><label style={FL}>Tiêu đề *</label><input value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} style={FI as any} /></div>
            <div><label style={FL}>Slug (URL) *</label><input value={form.slug} onChange={e=>setForm(f=>({...f, slug:e.target.value}))} placeholder="vi-du-tieu-de-khong-dau" style={FI as any} /></div>
            <div><label style={FL}>Mô tả ngắn (hiện trên thẻ + share)</label><textarea value={form.excerpt} onChange={e=>setForm(f=>({...f, excerpt:e.target.value}))} rows={3} style={{ ...FI, resize:"vertical" } as any} /></div>
            <div><label style={FL}>Nội dung (HTML hỗ trợ)</label><textarea value={form.content} onChange={e=>setForm(f=>({...f, content:e.target.value}))} rows={10} style={{ ...FI, resize:"vertical" } as any} /></div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div>
                <label style={FL}>Trạng thái</label>
                <select value={form.status} onChange={e=>setForm(f=>({...f, status:e.target.value}))} style={FI as any}>
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                </select>
              </div>
              <div>
                <label style={FL}>Chuyên mục *</label>
                <select value={form.cat} onChange={e=>setForm(f=>({...f, cat:e.target.value}))} style={FI as any}>
                  <option value="">— Chọn chuyên mục —</option>
                  {ADMIN_OPTIONS.map(c => (
                    <option key={c.val} value={c.val} style={{ fontWeight: c.lbl.startsWith("—") ? "normal" : "bold" }}>{c.lbl}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, alignItems:"center" }}>
              <div><label style={FL}>Tác giả</label><input value={form.author} onChange={e=>setForm(f=>({...f, author:e.target.value}))} style={FI as any} /></div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:18 }}>
                <input type="checkbox" id="featured" checked={form.featured} onChange={e=>setForm(f=>({...f, featured:e.target.checked}))} style={{ width:16, height:16 }} />
                <label htmlFor="featured" style={{ fontSize:13, fontWeight:700, color:"#374151", cursor:"pointer" }}>Đánh dấu nổi bật</label>
              </div>
            </div>

            <hr style={{ border:"none", borderTop:"1px dashed #D1D5DB", margin:"8px 0" }}/>

            <div>
              <label style={FL}>Ảnh đại diện (URL)</label>
              <input value={form.img} onChange={e=>setForm(f=>({...f, img:e.target.value}))} placeholder="https://..." style={{ ...FI, marginBottom:6 } as any} />
            </div>
            <div>
              <label style={FL}>Video (URL nhúng)</label>
              <input value={form.video} onChange={e=>setForm(f=>({...f, video:e.target.value}))} placeholder="https://www.youtube.com/embed/..." style={FI as any} />
            </div>
            <div>
              <label style={FL}>Audio / Podcast (URL)</label>
              <input value={form.audio} onChange={e=>setForm(f=>({...f, audio:e.target.value}))} placeholder="https://..." style={{ ...FI, marginBottom:6 } as any} />
            </div>
          </div>
        </div>
      )}

      {/* Danh sách bài viết tải từ Supabase */}
      <div style={{ background:"#fff", borderRadius:10, overflow:"hidden", border:"1px solid #E5E7EB", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
        {list.map((a, i) => (
          <div key={a.id} style={{ display:"flex", gap:14, alignItems:"center", padding:"12px 16px", borderBottom: i < list.length - 1 ? "1px solid #F3F4F6" : "none", background: a.id === editId ? "#FEF2F2" : "#fff" }}>
            <img src={a.img || '/logo.png'} alt="" style={{ width:60, height:42, objectFit:"cover", borderRadius:6, flexShrink:0, border:"1px solid #eee" }}/>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontWeight:700, fontSize:13.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"#111" }}>
                {a.title} {(a as any).featured && <span style={{ color:"#EAB308", marginLeft:4 }}>★</span>}
              </p>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:4 }}>
                <span style={{ fontSize:11, color:"#6B7280", fontWeight:"bold" }}>
                  {ADMIN_OPTIONS.find(opt => opt.val === a.cat)?.lbl.replace("— ", "") || a.cat}
                </span>
                <span style={{ fontSize:10, color:"#D1D5DB" }}>|</span>
                <span style={{ fontSize:11, color:"#6B7280" }}>{a.date}</span>
              </div>
            </div>
            <span style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:12, background: (a as any).status === 'draft' ? "#F3F4F6" : "#D1FAE5", color: (a as any).status === 'draft' ? "#4B5563" : "#065F46", flexShrink:0 }}>
              {(a as any).status === 'draft' ? "Nháp" : "Đã đăng"}
            </span>
            <div style={{ display:"flex", gap:8, flexShrink:0, marginLeft:10 }}>
              <button onClick={() => handleEdit(a)} style={{ background:"#F3F4F6", border:"none", color:"#374151", padding:"6px 12px", borderRadius:5, cursor:"pointer", fontSize:12, fontWeight:700 }}>
                ✏️ Sửa
              </button>
              <button onClick={() => handleDelete(a.id)} style={{ background:"#FEE2E2", border:"none", color:"#B91C1C", padding:"6px 12px", borderRadius:5, cursor:"pointer", fontSize:12, fontWeight:700 }}>
                🗑 Xóa
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div style={{ padding:"40px 20px", textAlign:"center", color:"#9CA3AF", fontSize:13 }}>
            Chưa có bài viết nào trong CSDL Supabase.
          </div>
        )}
      </div>
    </div>
  );
}
function APeople() {
  const tabs=[
    {id:"me_vnah",label:"Mẹ VNAH",icon:"🌺",c:"#B91C1C"},
    {id:"liet_sy",label:"Liệt sỹ",icon:"🕯",c:"#1C1C1C"},
    {id:"anh_hung",label:"Anh hùng",icon:"🏅",c:"#065F46"},
    {id:"dang_vien",label:"Đảng viên đầu tiên",icon:"⭐",c:"#1D4ED8"},
  ];
  const [tab,setTab]=useState("me_vnah");
  const [list,setList]=useState<any[]>([]);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({name:"",birth:"",death:"",note:""});
  const cur=tabs.find(t=>t.id===tab);
  const add=()=>{
    if(!form.name) return;
    setList((l: any[]) => [...l,{id:Date.now(),...form,type:tab}]);
    setForm({name:"",birth:"",death:"",note:""});setShow(false);
  };
  return (
    <div>
      <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:16 }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ padding:"6px 14px",borderRadius:18,border:"2px solid",
              borderColor:tab===t.id?t.c:"#E5E7EB",
              background:tab===t.id?t.c:"#fff",
              color:tab===t.id?"#fff":"#374151",
              fontSize:12.5,fontWeight:700,cursor:"pointer" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:12 }}>
        <button onClick={()=>setShow(!show)} style={{ background: cur!.c, color:"#fff",
          border:"none",borderRadius:7,padding:"8px 16px",fontWeight:700,
          cursor:"pointer",fontSize:13 }}>
          + Thêm {cur!.label}
        </button>
      </div>
      {show && (
        <div style={{ background:"#fff",borderRadius:10,padding:16,marginBottom:14,border:"1px solid #E5E7EB" }}>
          <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10,marginBottom:10 }}>
            <div><label style={FL}>Họ và tên *</label>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                placeholder="Nguyễn Thị Hoa" style={FI as any}/></div>
            <div><label style={FL}>Năm sinh</label>
              <input value={form.birth} onChange={e=>setForm(f=>({...f,birth:e.target.value}))}
                placeholder="1920" style={FI as any}/></div>
            <div><label style={FL}>Năm mất</label>
              <input value={form.death} onChange={e=>setForm(f=>({...f,death:e.target.value}))}
                placeholder="1975" style={FI as any}/></div>
          </div>
          <div style={{ marginBottom:10 }}>
            <label style={FL}>Ghi chú</label>
            <input value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}
              placeholder="Quê quán, thành tích..." style={FI as any}/>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={add} style={{ background: cur!.c, color:"#fff", border:"none",
              padding:"8px 18px",borderRadius:7,fontWeight:700,cursor:"pointer",fontSize:13 }}>
              💾 Lưu
            </button>
            <button onClick={()=>setShow(false)} style={{ background:"#F3F4F6",border:"none",
              padding:"8px 14px",borderRadius:7,cursor:"pointer",fontSize:13 }}>Hủy</button>
          </div>
        </div>
      )}
      {list.filter((p: any)=> p.type === tab).length === 0 ? (
        <div style={{ background:"#fff",borderRadius:10,padding:"48px",
          textAlign:"center",border:"2px dashed #E5E7EB" }}>
          <div style={{ fontSize:40,marginBottom:10 }}>{cur!.icon}</div>
          <p style={{ color:"#9CA3AF",fontSize:13 }}>Chưa có {cur!.label}. Nhấn + Thêm.</p>
        </div>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12 }}>
          {list.filter(p=>p.type===tab).map(p=>(
            <div key={p.id} style={{ background:"#fff",borderRadius:10,overflow:"hidden",border:"1px solid #E5E7EB" }}>
              <div style={{ height:80,background:`${cur!.c}15`,display:"flex",
                alignItems:"center",justifyContent:"center",fontSize:32 }}>{cur!.icon}</div>
              <div style={{ padding:"10px 12px" }}>
                <p style={{ fontWeight:700,fontSize:12.5,lineHeight:1.4 }}>{p.name}</p>
                {(p.birth||p.death)&&<p style={{ fontSize:11,color:"#aaa" }}>{p.birth||"?"}–{p.death||"?"}</p>}
                <button onClick={()=>setList(l=>l.filter(x=>x.id!==p.id))}
                  style={{ marginTop:6,fontSize:11,color:"#B91C1C",
                    background:"none",border:"none",cursor:"pointer",fontWeight:700 }}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function APod() {
  const [list,setList]=useState<any[]>([]);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({title:"",ep:"",desc:""});
  const add=()=>{
    if(!form.title) return;
    setList(l=>[...l,{id:Date.now(),...form,pub:false}]);
    setForm({title:"",ep:"",desc:""});setShow(false);
  };
  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
        <span style={{ fontSize:13,color:"#888" }}>{list.length} tập</span>
        <button onClick={()=>setShow(!show)} style={{ background:"#0891B2",color:"#fff",
          border:"none",borderRadius:7,padding:"8px 16px",fontWeight:700,cursor:"pointer",fontSize:13 }}>
          + Thêm tập mới
        </button>
      </div>
      {show && (
        <div style={{ background:"#fff",borderRadius:10,padding:16,marginBottom:14,border:"1px solid #E5E7EB" }}>
          <div style={{ display:"grid",gridTemplateColumns:"3fr 1fr",gap:10,marginBottom:10 }}>
            <div><label style={FL}>Tiêu đề *</label>
              <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
                placeholder="Câu chuyện Mẹ Việt Nam Anh hùng" style={FI as any}/></div>
            <div><label style={FL}>Số tập</label>
              <input value={form.ep} onChange={e=>setForm(f=>({...f,ep:e.target.value}))}
                type="number" placeholder="1" style={FI as any}/></div>
          </div>
          <div style={{ border:"2px dashed #D1D5DB",borderRadius:8,padding:14,
            textAlign:"center",background:"#FAFAFA",marginBottom:10 }}>
            <div style={{ fontSize:24,marginBottom:4 }}>🎵</div>
            <p style={{ fontSize:12,color:"#9CA3AF" }}>Kéo thả hoặc click để chọn file MP3</p>
          </div>
          <div style={{ marginBottom:10 }}>
            <label style={FL}>Mô tả</label>
            <input value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}
              placeholder="Tóm tắt nội dung..." style={FI as any}/>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={add} style={{ background:"#0891B2",color:"#fff",border:"none",
              padding:"8px 18px",borderRadius:7,fontWeight:700,cursor:"pointer",fontSize:13 }}>
              💾 Lưu
            </button>
            <button onClick={()=>setShow(false)} style={{ background:"#F3F4F6",border:"none",
              padding:"8px 14px",borderRadius:7,cursor:"pointer",fontSize:13 }}>Hủy</button>
          </div>
        </div>
      )}
      {list.length===0 ? (
        <div style={{ background:"#fff",borderRadius:10,padding:"48px",
          textAlign:"center",border:"2px dashed #E5E7EB" }}>
          <div style={{ fontSize:40,marginBottom:10 }}>🎙</div>
          <p style={{ color:"#9CA3AF",fontSize:13 }}>Chưa có podcast. Nhấn + Thêm.</p>
        </div>
      ) : list.map(p=>(
        <div key={p.id} style={{ background:"#fff",borderRadius:10,padding:"12px 16px",
          marginBottom:8,display:"flex",gap:12,alignItems:"center" }}>
          <div style={{ width:42,height:42,background:"#1C1C1C",borderRadius:8,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>🎙</div>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:700,fontSize:13 }}>{p.ep?`Tập ${p.ep} – `:""}{p.title}</p>
            {p.desc&&<p style={{ fontSize:11.5,color:"#aaa",marginTop:2 }}>{p.desc}</p>}
          </div>
          <button onClick={()=>setList(l=>l.map(x=>x.id===p.id?{...x,pub:!x.pub}:x))}
            style={{ fontSize:12,fontWeight:700,background:"none",border:"none",
              color:"#0891B2",cursor:"pointer" }}>
            {p.pub?"Ẩn":"Xuất bản"}
          </button>
        </div>
      ))}
    </div>
  );
}

function AFB() {
  const [list,setList]=useState([
    {id:1,type:"Góp ý",name:"Nguyễn Văn An",content:"Đề nghị sửa lại đường vào xóm bị lún nhiều chỗ.",status:"pending",date:"26/04"},
    {id:2,type:"Gửi bài",name:"Trần Thị Lan",content:"Gửi bài thơ về giếng làng – kính mong đăng tải.",status:"pending",date:"25/04"},
    {id:3,type:"Kiến nghị",name:"Lê Văn Bình",content:"Kiến nghị lắp thêm đèn đường khu vực cuối xóm.",status:"reviewed",date:"24/04"},
  ]);
  const [det,setDet]=useState<any>(null);
  const sc: any ={pending:"#D97706",reviewed:"#0891B2",resolved:"#16A34A",rejected:"#DC2626"};
  const sl: any ={pending:"⏳ Chờ",reviewed:"👁 Đã xem",resolved:"✅ Xử lý",rejected:"❌ Từ chối"};
  return (
    <div>
      <div style={{ background:"#fff",borderRadius:10,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,.07)" }}>
        {list.map((fb,i)=>(
          <div key={fb.id} style={{ display:"flex",gap:12,alignItems:"center",
            padding:"11px 16px",borderBottom:i<list.length-1?"1px solid #F3F4F6":"none" }}>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ fontWeight:700,fontSize:13 }}>{fb.name}
                <span style={{ fontWeight:400,color:"#aaa",fontSize:11 }}> · {fb.type} · {fb.date}</span>
              </p>
              <p style={{ fontSize:12,color:"#666",overflow:"hidden",
                textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:2 }}>{fb.content}</p>
            </div>
            <span style={{ fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:10,
              background:`${sc[fb.status]}15`,color:sc[fb.status],flexShrink:0 }}>
              {sl[fb.status]}
            </span>
            <button onClick={()=>setDet(fb)} style={{ fontSize:12,fontWeight:700,
              color:"#0891B2",background:"none",border:"none",cursor:"pointer",flexShrink:0 }}>
              Xem
            </button>
          </div>
        ))}
      </div>
      {det && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",
          zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
          <div style={{ background:"#fff",borderRadius:14,width:"100%",maxWidth:460,
            boxShadow:"0 20px 60px rgba(0,0,0,.25)" }}>
            <div style={{ padding:"16px 20px",borderBottom:"1px solid #E5E7EB",
              display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <h3 style={{ fontFamily:"'Lora', serif",fontSize:16,fontWeight:700 }}>
                {det.type} – {det.name}
              </h3>
              <button onClick={()=>setDet(null)} style={{ background:"none",border:"none",
                fontSize:20,cursor:"pointer",color:"#888" }}>✕</button>
            </div>
            <div style={{ padding:"14px 20px" }}>
              <p style={{ fontSize:13,color:"#374151",lineHeight:1.8,
                background:"#F9FAFB",padding:12,borderRadius:8 }}>{det.content}</p>
            </div>
            <div style={{ padding:"12px 20px 18px",display:"flex",gap:8,flexWrap:"wrap" }}>
              {["reviewed","resolved","rejected"].map(s=>(
                <button key={s} onClick={()=>{
                  setList(l=>l.map(x=>x.id===det.id?{...x,status:s}:x));setDet(null);
                }} style={{ padding:"6px 14px",borderRadius:7,border:"none",cursor:"pointer",
                  fontSize:12.5,fontWeight:700,background:`${sc[s]}15`,color:sc[s] }}>
                  {sl[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ASet() {
  const [s,setS]=useState<any>({
    site_name:"Xóm Ngọc Điền",tagline:"Hồn quê trong dòng chảy số",
    email:"tinnhanhonline247@gmail.com",phone:"0914 58 75 75",
    zalo:"",facebook:"",
  });
  const [ok,setOk]=useState(false);
  const save=()=>{ setOk(true); setTimeout(()=>setOk(false),2500); };
  const fields: any[] = [
    {k:"site_name",l:"Tên website"},{k:"tagline",l:"Tagline"},
    {k:"email",l:"Email",t:"email"},{k:"phone",l:"Số điện thoại"},
    {k:"zalo",l:"Link Zalo",t:"url"},{k:"facebook",l:"Link Facebook",t:"url"},
  ];
  return (
    <div style={{ maxWidth:560 }}>
      <div style={{ background:"#fff",borderRadius:10,overflow:"hidden",
        boxShadow:"0 1px 4px rgba(0,0,0,.07)",marginBottom:14 }}>
        {fields.map((f,i)=>(
          <div key={f.k} style={{ padding:"13px 18px",
            borderBottom:i<fields.length-1?"1px solid #F3F4F6":"none" }}>
            <label style={FL}>{f.l}</label>
            <input type={f.t||"text"} value={s[f.k]}
              onChange={e=>setS((x: any)=>({...x,[f.k]:e.target.value}))} style={FI as any}/>
          </div>
        ))}
      </div>
      <button onClick={save} style={{ background:ok?"#16A34A":"#B91C1C",color:"#fff",
        border:"none",padding:"10px 24px",borderRadius:8,fontSize:14,
        fontWeight:700,cursor:"pointer",transition:"background .3s" }}>
        {ok?"✅ Đã lưu!":"💾 Lưu cài đặt"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEARCH PAGE (TRANG TÌM KIẾM ĐỘNG)
═══════════════════════════════════════════ */
function SearchPage({ setNav }: { setNav?: any }) {
  const [query, setQuery] = useState("");
  const [arts, setArts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searched, setSearched] = useState(false);
  const limit = 6; 

  const doSearch = async (isLoadMore = false) => {
    if (!query.trim() && !isLoadMore) return;
    setLoading(true);
    const currentPage = isLoadMore ? page : 0;
    
    // Supabase ILIKE giúp tìm kiếm không phân biệt hoa thường
    const { data } = await supabase.from('articles').select('*')
      .ilike('title', `%${query}%`).order('id', { ascending: false })
      .range(currentPage * limit, (currentPage + 1) * limit - 1);

    if (data) {
      setArts(prev => isLoadMore ? [...prev, ...data] : data);
      setHasMore(data.length === limit);
      setPage(currentPage + 1);
      if (!isLoadMore) setSearched(true);
    }
    setLoading(false);
  };

  const goArt = (a: any) => { setNav({ page:"article", article:a }); window.scrollTo(0,0); };

  return (
    <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 16px", minHeight: "50vh" }}>
      <div style={{ background:"linear-gradient(135deg,#9B1B14,#B91C1C)", color:"#fff", borderRadius:"0 0 12px 12px", padding:"30px 20px", marginBottom:30, textAlign:"center", boxShadow:"0 4px 15px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontFamily:"'Lora', serif", fontSize:26, fontWeight:900, marginBottom:16 }}>🔍 Tra cứu bài viết</h1>
        <div style={{ display:"flex", maxWidth:600, margin:"0 auto", gap:8 }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && doSearch()} placeholder="Nhập tên bài viết, sự kiện..." style={{ flex:1, padding:"12px 16px", borderRadius:8, border:"none", fontSize:15, outline:"none", color:"#333" }} />
          <button onClick={() => doSearch()} style={{ background:"#FBBF24", color:"#92400E", border:"none", padding:"0 24px", borderRadius:8, fontWeight:900, cursor:"pointer", fontSize:15 }}>
            TÌM
          </button>
        </div>
      </div>

      {loading && arts.length === 0 && <p style={{textAlign:"center", color:"#888"}}>Đang lục lọi trong két sắt...</p>}
      
      {searched && arts.length === 0 && !loading && (
        <div style={{ textAlign:"center", padding:"40px 20px" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
          <p style={{ color:"#666", fontSize:15 }}>Không tìm thấy bài viết nào có tên "<strong>{query}</strong>"</p>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
        {arts.map(a=><ACard key={a.id} a={a} onClick={goArt}/>)}
      </div>

      {hasMore && (
        <div style={{ textAlign:"center", marginTop:35, marginBottom:40 }}>
          <button onClick={() => doSearch(true)} disabled={loading} style={{ background:"#fff", border:"2px solid #B91C1C", color:"#B91C1C", padding:"10px 28px", borderRadius:30, fontWeight:900, cursor:"pointer" }}>
            {loading ? "⏳ Đang tải..." : "↓ Tải thêm kết quả"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP ROOT 
═══════════════════════════════════════════ */
export default function App() {
  const [nav, setNav] = useState({ page:"home", cat: "", sub: "", article: null });
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    const fetchArts = async () => {
      const { data } = await supabase.from('articles').select('*').order('id', { ascending: false });
      if (data && data.length > 0) {
        ARTS.length = 0; 
        ARTS.push(...(data as any[]));
      }
      setDbLoaded(true); 
    };
    fetchArts();
  }, []);

  if (nav.page === "admin-login" || nav.page === "admin") {
    window.location.href = '/admin';
    return <div style={{padding:50, textAlign:'center'}}>Đang chuyển hướng...</div>;
  }

  return (
    <div style={{ minHeight:"100vh", background:"#FEF9F2", fontFamily:"system-ui,-apple-system,sans-serif", color:"#1C1C1C" }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Header setNav={setNav}/>
      <Ticker/>
      {nav.page === "home" && <><Hero setNav={setNav}/><Home setNav={setNav}/></>}
      {nav.page === "category" && <CatPage cat={nav.cat} sub={nav.sub} setNav={setNav}/>}
      {nav.page === "article"  && <ArtPage article={nav.article} setNav={setNav}/>}
      {nav.page === "search"   && <SearchPage setNav={setNav}/>}
      <Footer setNav={setNav}/>
    </div>
  );
}