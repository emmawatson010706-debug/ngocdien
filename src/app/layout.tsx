import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ngocdien.info.vn'),
  title: { default: 'Xóm Ngọc Điền – Văn hóa · Lịch sử · Cộng đồng', template: '%s | Ngọc Điền' },
  description: 'Cổng thông tin điện tử Xóm Ngọc Điền, Hưng Nguyên, Nghệ An – lưu giữ và phát huy văn hóa, lịch sử địa phương.',
  keywords: ['Ngọc Điền', 'Hưng Nguyên', 'Nghệ An', 'văn hóa', 'lịch sử', 'cộng đồng'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Xóm Ngọc Điền',
    images: [{ url: '/og-ngocdien.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
