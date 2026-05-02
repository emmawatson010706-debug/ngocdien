import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Ticker from '@/components/layout/Ticker';

const TICKER_ITEMS = [
  '🔴 Lễ hội Đền Ngọc Điền 2025 khai mạc ngày 15/5',
  '🔴 Ra mắt website Cổng thông tin điện tử Xóm Ngọc Điền',
  '🔴 Thông báo họp chi bộ ngày 28/4/2025',
  '🔴 Khánh thành nhà văn hóa xóm sau nâng cấp toàn diện',
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Ticker items={TICKER_ITEMS} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
