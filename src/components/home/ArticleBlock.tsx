import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types/database';
import { formatDate, truncate } from '@/lib/utils';

export function ArticleCardHorizontal({ article }: { article: Article }) {
  return (
    <Link href={`/bai-viet/${article.slug}`}
      className="flex gap-3 py-3 border-b border-[#EDE5D8] hover:bg-[#FFF5E4]
        hover:px-2 transition-all duration-150 group">
      {article.thumbnail_url && (
        <div className="w-20 h-14 rounded overflow-hidden shrink-0">
          <Image src={article.thumbnail_url} alt={article.title} width={80} height={56}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {article.category_name && (
            <span className="tag text-[9px] px-1.5 py-0.5 rounded" style={{ background: '#B91C1C' }}>
              {article.category_name}
            </span>
          )}
          {article.published_at && (
            <span className="text-[11px] text-gray-400 font-sans">{formatDate(article.published_at)}</span>
          )}
        </div>
        <p className="font-serif text-[13.5px] font-bold leading-snug text-ink line-clamp-2
          group-hover:text-red transition-colors">
          {article.title}
        </p>
      </div>
    </Link>
  );
}

export function ArticleCardGrid({ article }: { article: Article }) {
  return (
    <Link href={`/bai-viet/${article.slug}`}
      className="block bg-white rounded-lg overflow-hidden border border-[#E8DDD0]
        hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group">
      {article.thumbnail_url && (
        <div className="aspect-[16/9] overflow-hidden">
          <Image src={article.thumbnail_url} alt={article.title} width={400} height={225}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="p-3.5">
        <div className="flex items-center gap-2 mb-2">
          {article.category_name && (
            <span className="tag text-[9px] px-1.5 py-0.5 rounded" style={{ background: '#0891B2' }}>
              {article.category_name}
            </span>
          )}
          {article.published_at && (
            <span className="text-[11px] text-gray-400 font-sans">{formatDate(article.published_at)}</span>
          )}
        </div>
        <h3 className="font-serif text-[13.5px] font-bold leading-snug text-ink line-clamp-2
          group-hover:text-red transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-xs text-gray-500 font-sans mt-1.5 line-clamp-2 leading-relaxed">
            {truncate(article.excerpt, 100)}
          </p>
        )}
      </div>
    </Link>
  );
}

interface SectionBlockProps {
  icon: string;
  title: string;
  color?: string;
  href?: string;
  children: React.ReactNode;
}

export function SectionBlock({ icon, title, color = '#B91C1C', href, children }: SectionBlockProps) {
  return (
    <section className="mb-8 slide-up">
      {/* Section header */}
      <div className="flex items-center gap-2.5 pb-3 mb-4" style={{ borderBottom: `3px solid ${color}` }}>
        <div className="w-9 h-9 rounded flex items-center justify-center text-lg shrink-0 text-white"
          style={{ background: color }}>
          {icon}
        </div>
        <h2 className="font-display text-xl font-black tracking-tight">{title}</h2>
        <div className="flex-1 h-px bg-[#E8DDD0]" />
        {href && (
          <a href={href} className="text-xs font-sans font-semibold whitespace-nowrap hover:underline"
            style={{ color }}>
            Xem tất cả →
          </a>
        )}
      </div>
      {children}
    </section>
  );
}
