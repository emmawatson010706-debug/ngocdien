import ArticleEditor from '@/components/admin/ArticleEditor';

export default function NewArticlePage() {
  // Danh sách toàn bộ mục mẹ và mục con
  const fullCategories = [
    { id: 'tin-tuc', name: 'Tin tức', icon: '📰' },
    { id: 'thong-bao', name: '— Thông báo', icon: '' },
    { id: 'su-kien', name: '— Sự kiện', icon: '' },
    
    { id: 'nguoi-ngoc-dien', name: 'Người Ngọc Điền', icon: '👥' },
    
    { id: 'lich-su', name: 'Lịch sử Xóm Ngọc Điền', icon: '📜' },
    
    { id: 'tieng-lang', name: 'Tiếng làng', icon: '✍️' },
    { id: 'tan-van', name: '— Tản văn', icon: '' },
    { id: 'tho', name: '— Thơ', icon: '' },
    { id: 'kham-pha', name: '— Khám phá', icon: '' },
    { id: 'goc-nhin-thang', name: '— Góc nhìn thẳng', icon: '' },
    
    { id: 'di-tich', name: 'Di tích', icon: '🏛️' },
    { id: 'den-ngoc-dien', name: '— Đền Ngọc Điền', icon: '' },
    { id: 'gieng-lang', name: '— Giếng làng', icon: '' },
    
    { id: 'le-hoi', name: 'Lễ hội', icon: '🎊' },
    { id: 'le-hoi-den', name: '— Lễ hội đền', icon: '' },
    { id: 'le-hoi-xom', name: '— Lễ hội xóm', icon: '' },
    { id: 'le-hoi-gieng', name: '— Lễ hội giếng', icon: '' },
    
    { id: 'thu-vien', name: 'Thư viện', icon: '📚' },
    { id: 'huong-uoc-1883', name: '— Hương ước 1883', icon: '' },
    
    { id: 'chuyen-doi-so', name: 'Chuyển đổi số', icon: '💻' },
    { id: 'dich-vu-cong', name: '— Dịch vụ công', icon: '' },
    { id: 'huong-dan-vneid', name: '— Hướng dẫn VNeID', icon: '' },
  ];

  return (
    <div className="p-2">
      <ArticleEditor categories={fullCategories as any} />
    </div>
  );
}