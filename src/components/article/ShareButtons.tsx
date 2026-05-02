'use client';
import { facebookShareUrl, zaloShareUrl, buildShareUrl } from '@/lib/utils';

export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const url = buildShareUrl(slug);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    alert('Đã sao chép link!');
  };

  return (
    <div className="flex flex-wrap items-center gap-2 my-6 py-4 border-t border-b border-[#EDE5D8]">
      <span className="text-xs font-sans font-bold text-gray-500 uppercase tracking-widest mr-1">Chia sẻ:</span>

      <a href={facebookShareUrl(url)} target="_blank" rel="noopener"
        className="flex items-center gap-1.5 bg-[#1877F2] text-white text-xs font-sans font-bold
          px-3 py-2 rounded hover:opacity-85 transition-opacity">
        📘 Facebook
      </a>

      <a href={zaloShareUrl(url)} target="_blank" rel="noopener"
        className="flex items-center gap-1.5 bg-[#0057B8] text-white text-xs font-sans font-bold
          px-3 py-2 rounded hover:opacity-85 transition-opacity">
        💬 Zalo
      </a>

      <button onClick={copyLink}
        className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-sans font-bold
          px-3 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-200">
        🔗 Sao chép link
      </button>
    </div>
  );
}
