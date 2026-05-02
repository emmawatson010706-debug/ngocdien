// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-center">
      <div>
        <div className="font-display text-[120px] font-black text-red/10 leading-none select-none">404</div>
        <h1 className="font-display text-3xl font-black -mt-6 mb-3">Không tìm thấy trang</h1>
        <p className="text-gray-500 font-sans mb-7 max-w-sm mx-auto">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link href="/" className="btn-primary inline-block">← Về trang chủ</Link>
      </div>
    </div>
  );
}
