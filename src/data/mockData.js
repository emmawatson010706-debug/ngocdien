/* ═══════════════════════════════════════════
   KHO DỮ LIỆU TẠM THỜI (Trước khi dùng Supabase)
═══════════════════════════════════════════ */

export const CATS = [
  { slug:"tin-tuc",         label:"Tin tức",               icon:"📰" },
  { slug:"nguoi-ngoc-dien", label:"Người Ngọc Điền",       icon:"👥" },
  { slug:"lich-su",         label:"Lịch sử Xóm Ngọc Điền", icon:"📜" },
  { slug:"tieng-lang",      label:"Tiếng làng",            icon:"✍️" },
  { slug:"di-tich",         label:"Di tích",               icon:"🏛️" },
  { slug:"le-hoi",          label:"Lễ hội",                icon:"🎊" },
  { slug:"thu-vien",        label:"Thư viện",              icon:"📚" },
  { slug:"chuyen-doi-so",   label:"Chuyển đổi số",         icon:"💻" },
  { slug:"gop-y",           label:"Góp ý & Gửi bài",       icon:"✉️" },
];

export const SUBS = {
  "tin-tuc":["Thông báo","Sự kiện"],
  "nguoi-ngoc-dien":["Mẹ Việt Nam Anh hùng","Liệt sỹ","Anh hùng lao động Cao Lục","Đảng viên đầu tiên"],
  "tieng-lang":["Tản văn","Thơ","Khám phá","Góc nhìn thẳng","Podcast"],
  "di-tich":["Đền Ngọc Điền","Giếng làng"],
  "le-hoi":["Lễ hội đền","Lễ hội xóm","Lễ hội giếng"],
  "thu-vien":["Hương ước 1883"],
  "chuyen-doi-so":["Dịch vụ công","Hướng dẫn VNeID","Cổng thông tin","Bản đồ số"],
  "gop-y":["Góp ý","Phản ánh","Kiến nghị","Gửi bài"],
};

export const ARTS = [
  { id:1,slug:"le-hoi-den-2025",   title:"Lễ hội Đền Ngọc Điền 2025",             cat:"le-hoi",      date:"25/04/2026", img:"https://picsum.photos/seed/a1nd/400/220", excerpt:"Lễ hội kéo dài 3 ngày với nhiều hoạt động văn hóa truyền thống đặc sắc." },
  { id:2,slug:"ky-niem-30-4",      title:"Kỷ niệm 50 năm ngày Giải phóng",        cat:"tin-tuc",     date:"24/04/2026", img:"https://picsum.photos/seed/a2nd/400/220", excerpt:"Lễ dâng hương trang nghiêm tại Đài tưởng niệm liệt sỹ xóm." },
  { id:3,slug:"huong-uoc-1883",    title:"Hương ước 1883 – Tài sản văn hóa",      cat:"thu-vien",    date:"22/04/2026", img:"https://picsum.photos/seed/a3nd/400/220", excerpt:"Bản hương ước cổ nhất còn lưu giữ nguyên vẹn qua hơn 140 năm." },
  { id:4,slug:"gieng-lang",        title:"Giếng làng – Chứng nhân lịch sử",       cat:"di-tich",     date:"20/04/2026", img:"https://picsum.photos/seed/a4nd/400/220", excerpt:"Hơn 200 năm tuổi, giếng làng là không gian văn hóa gắn kết cộng đồng." },
  { id:5,slug:"chieu-ve-xom-cu",   title:"Chiều về trên xóm cũ",                  cat:"tieng-lang",  date:"18/04/2026", img:"https://picsum.photos/seed/a5nd/400/220", excerpt:"Những ký ức tuổi thơ ùa về trong chiều tà trên con đường làng quen thuộc." },
  { id:6,slug:"thong-bao-hop",     title:"Thông báo lịch họp chi bộ",             cat:"tin-tuc",     date:"17/04/2026", img:"https://picsum.photos/seed/a6nd/400/220", excerpt:"Mời toàn thể đảng viên tham dự họp chi bộ định kỳ tháng 5." },
];