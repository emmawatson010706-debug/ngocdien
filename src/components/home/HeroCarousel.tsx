'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/types/database';
import { formatDate, facebookShareUrl, zaloShareUrl, buildShareUrl } from '@/lib/utils';

export default function HeroCarousel({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState(0);
  const slides = articles.slice(0, 5);

  const next = useCallback(() => setActive(a => (a + 1) % slides.length), [slides.length]);
  const prev = () => setActive(a => (a - 1 + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  if (!slides.length) return null;
  const s = slides[active];

  return (
    <div className="relative overflow-hidden bg-black" style={{ height: 'clamp(300px,55vw,500px)' }}>
      {slides.map((slide, i) => (
        <div key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {slide.thumbnail_url && (
            <Image src={slide.thumbnail_url} alt={slide.title} fill className="object-cover" priority={i === 0} />
          )}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.25) 55%, rgba(0,0,0,.05) 100%)' }} />
        </div>
      ))}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-14 md:pb-10">
        <div className="max-w-[1180px] mx-auto px-4">
          {s.category_name && (
            <span className="tag bg-red mb-3 inline-block">{s.category_name}</span>
          )}
          <Link href={`/bai-viet/${s.slug}`}>
            <h1 className="font-display text-[clamp(17px,3vw,29px)] font-black text-white leading-snug
              drop-shadow-lg max-w-[820px] hover:text-yellow-100 transition-colors">
              {s.title}
            </h1>
          </Link>
          {s.excerpt && (
            <p className="text-white/75 text-sm font-sans mt-2 max-w-lg leading-relaxed hidden md:block">
              {s.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {s.published_at && (
              <span className="text-[#FBBF24] text-xs font-sans">🕐 {formatDate(s.published_at)}</span>
            )}
            <Link href={`/bai-viet/${s.slug}`}
              className="bg-red text-white text-[13px] font-sans font-bold px-4 py-1.5 rounded
                hover:bg-red-dark transition-colors">
              Đọc bài →
            </Link>
            <a href={facebookShareUrl(buildShareUrl(s.slug))} target="_blank" rel="noopener"
              className="bg-white/15 border border-white/25 text-white text-xs font-sans px-3 py-1.5
                rounded hover:bg-white/25 transition-colors">
              📘 Facebook
            </a>
            <a href={zaloShareUrl(buildShareUrl(s.slug))} target="_blank" rel="noopener"
              className="bg-white/15 border border-white/25 text-white text-xs font-sans px-3 py-1.5
                rounded hover:bg-white/25 transition-colors">
              💬 Zalo
            </a>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={prev} aria-label="Trước"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full
          bg-black/40 border border-white/20 text-white text-2xl flex items-center justify-center
          hover:bg-black/60 transition-colors">‹</button>
      <button onClick={next} aria-label="Tiếp"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full
          bg-black/40 border border-white/20 text-white text-2xl flex items-center justify-center
          hover:bg-black/60 transition-colors">›</button>

      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-gold' : 'w-2 bg-white/40'}`} />
        ))}
      </div>

      {/* Thumbnail strip desktop */}
      <div className="absolute bottom-0 right-0 z-20 hidden lg:flex gap-0.5">
        {slides.slice(1, 4).map((slide, i) => (
          <button key={i} onClick={() => setActive(i + 1)}
            className="w-[110px] h-[64px] overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
            {slide.thumbnail_url && (
              <Image src={slide.thumbnail_url} alt={slide.title} width={110} height={64} className="object-cover w-full h-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
