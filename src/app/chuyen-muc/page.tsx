import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GIA PHẢ CHUẨN
const CATEGORY_TREE: Record<string, string[]> = {
  'tin-tuc': ['tin-tuc', 'thong-bao', 'su-kien'],
  'nguoi-ngoc-dien': ['nguoi-ngoc-dien', 'nguoi-ngoc-dien-chung', 'me-vnah', 'liet-sy', 'anh-hung', 'dang-vien'],
  'lich-su': ['lich-su'],
  'tieng-lang': ['tieng-lang', 'tan-van', 'tan-man', 'tho', 'kham-pha', 'goc-nhin-thang', 'podcast', 'Thơ', 'Tản văn'],
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
  // 🛡️ 1. GIẢI MÃ VÀ GỌT SẠCH RÁC TRONG URL
  const rawCat = params?.cat || "";
  let currentCat = decodeURIComponent(rawCat).toLowerCase();
  
  // Xóa bỏ dấu gạch ngang (—), khoảng trắng ở đầu/cuối URL do trang trí menu gây ra
  currentCat = currentCat.replace(/^[—\-\s]+/, '').trim(); 

  let searchIds: string[] = [];
  
  // 🚩 2. KIỂM TRA XEM ĐANG Ở MỤC CHA HAY CON
  if (CATEGORY_TREE[currentCat]) {
    searchIds = CATEGORY_TREE[currentCat];
  } else {
    // Nếu là mục lẻ (như thơ, tho, tan-van...)
    searchIds = [currentCat];
    
    // Khớp thêm các biến thể để không bao giờ sót bài
    if (currentCat === 'thơ' || currentCat === 'tho') searchIds = ['tho', 'thơ'];
    if (currentCat === 'tản văn' || currentCat === 'tan-van') searchIds = ['tan-van', 'tản văn'];
  }

  const { data: arts } = await supabase
    .from('articles')
    .select('*')
    .in('cat', searchIds)
    .order('id', { ascending: false });

  const artsList = arts || [];
  
  // Lấy nhãn hiển thị cho đẹp
  const displayLabel = CAT_LABELS[currentCat] || currentCat.toUpperCase();

  return (
    <div className="min-h-screen bg-[#FEF9F2]">
      <Header />
      <div className="max-w-[1160px] mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-[#9B1B14] to-[#B91C1C] text-white rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-black font-lora m-0">{displayLabel}</h1>
          <p className="opacity-80 mt-2 text-sm">{artsList.length} bài viết được tìm thấy</p>
        </div>

        {artsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artsList.map((a: any) => (
              <Link href={`/bai-viet/${a.slug}`} key={a.id} className="no-underline group">
                <div className="bg-white rounded-lg overflow-hidden border border-[#E8DDD0] hover:shadow-xl transition-all">
                  <img src={a.img || '/logo.png'} className="w-full h-44 object-cover" alt={a.title} />
                  <div className="p-4">
                    <span className="text-[#B91C1C] text-[10px] font-extrabold uppercase tracking-wider">
                        {CAT_LABELS[a.cat] || a.cat}
                    </span>
                    <h3 className="text-[16px] font-bold mt-2 leading-snug group-hover:text-[#B91C1C]">
                        {a.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-3 line-clamp-2 leading-relaxed">
                        {a.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-[#E8DDD0]">
            <p className="text-gray-400 font-medium">Ban biên tập đang cập nhật nội dung cho mục {displayLabel}</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}