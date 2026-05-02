import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import slugify from 'slugify';

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: vi });
  } catch {
    return '';
  }
}

export function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: vi });
  } catch {
    return '';
  }
}

export function toSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, locale: 'vi' });
}

export function truncate(text: string, length = 120): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '…';
}

export function getOgImageUrl(thumbnailUrl: string | null): string {
  return thumbnailUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL}/og-default.jpg`;
}

export function buildShareUrl(slug: string): string {
  return `${process.env.NEXT_PUBLIC_SITE_URL}/bai-viet/${slug}`;
}

export function facebookShareUrl(pageUrl: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
}

export function zaloShareUrl(pageUrl: string): string {
  return `https://zalo.me/share/article?url=${encodeURIComponent(pageUrl)}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
