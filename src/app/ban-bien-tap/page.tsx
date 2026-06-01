import type { Metadata } from 'next';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';

export const metadata: Metadata = {
  title: 'Ban biên tập & Quy chế đăng bài | Ngọc Điền',
  description: 'Giới thiệu Ban biên tập, quy chế đăng bài và nguyên tắc kiểm chứng tư liệu của Cổng thông tin Xóm Ngọc Điền.',
};

export default function BanBienTapPage() {
  return (
    <PublicLayout>
      <main className="max-w-[900px] mx-auto px-4 py-10">
        <p className="text-red text-xs font-bold tracking-[3px] uppercase font-sans mb-3">Minh bạch tư liệu</p>
        <h1 className="font-display text-3xl md:text-4xl font-black leading-tight mb-5">Ban biên tập & Quy chế đăng bài</h1>
        <div className="prose prose-neutral max-w-none font-sans leading-relaxed bg-white border border-[#E8DDD0] rounded-2xl p-6 md:p-8">
          <h2>1. Tôn chỉ hoạt động</h2>
          <p>Cổng thông tin Xóm Ngọc Điền là không gian lưu giữ, giới thiệu và kết nối các nguồn tư liệu về lịch sử, văn hóa, con người, di tích, lễ hội và đời sống cộng đồng của quê hương.</p>
          <h2>2. Nguyên tắc kiểm chứng tư liệu</h2>
          <ul>
            <li>Ưu tiên tài liệu có nguồn gốc rõ ràng: văn bản, ảnh, gia phả, sách, lời kể nhân chứng có đối chiếu.</li>
            <li>Không khẳng định tuyệt đối các chi tiết chưa đủ căn cứ; trường hợp cần thiết sẽ ghi rõ là tư liệu đang tiếp tục xác minh.</li>
            <li>Tôn trọng sự thật lịch sử, đời sống riêng tư, truyền thống dòng họ và sự đoàn kết trong cộng đồng.</li>
          </ul>
          <h2>3. Quy chế đăng bài</h2>
          <p>Bài viết gửi về cần có họ tên người gửi, nội dung rõ ràng, nếu có ảnh hoặc tài liệu kèm theo cần ghi nguồn. Ban biên tập có quyền biên tập tiêu đề, chính tả, bố cục và cách diễn đạt nhưng không làm sai lệch nội dung cốt lõi.</p>
          <h2>4. Đính chính và bổ sung</h2>
          <p>Khi phát hiện thông tin thiếu, sai hoặc cần bổ sung, bà con gửi góp ý để Ban biên tập đối chiếu và cập nhật công khai.</p>
          <p><Link href="/gop-y?type=gop_y" className="text-red font-bold hover:underline">Gửi góp ý / đính chính tư liệu →</Link></p>
        </div>
      </main>
    </PublicLayout>
  );
}
