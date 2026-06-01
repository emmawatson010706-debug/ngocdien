import type { Category } from '@/types/database';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'default-tin-tuc',
    name: 'Tin tức',
    slug: 'tin-tuc',
    parent_id: null,
    icon: '📰',
    description: 'Tin tức, thông báo và các hoạt động mới của xóm Ngọc Điền.',
    sort_order: 10,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'default-tieng-lang',
    name: 'Tiếng làng',
    slug: 'tieng-lang',
    parent_id: null,
    icon: '✍️',
    description: 'Tản văn, ký ức, tiếng nói và cảm nhận của người Ngọc Điền.',
    sort_order: 20,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'default-lich-su',
    name: 'Lịch sử',
    slug: 'lich-su',
    parent_id: null,
    icon: '📜',
    description: 'Tư liệu lịch sử, địa danh, hương ước và quá trình hình thành làng.',
    sort_order: 30,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'default-di-tich',
    name: 'Di tích',
    slug: 'di-tich',
    parent_id: null,
    icon: '🏛️',
    description: 'Đền Ngọc Điền, giếng làng và các dấu tích văn hóa - tín ngưỡng.',
    sort_order: 40,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'default-le-hoi',
    name: 'Lễ hội',
    slug: 'le-hoi',
    parent_id: null,
    icon: '🎊',
    description: 'Lễ hội, ngày giỗ, sinh hoạt văn hóa và sự kiện cộng đồng.',
    sort_order: 50,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'default-thu-vien',
    name: 'Thư viện',
    slug: 'thu-vien',
    parent_id: null,
    icon: '📚',
    description: 'Tư liệu, ảnh cũ, văn bản, gia phả, hương ước và ký ức làng.',
    sort_order: 60,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'default-chuyen-doi-so',
    name: 'Chuyển đổi số',
    slug: 'chuyen-doi-so',
    parent_id: null,
    icon: '💻',
    description: 'Liên kết dịch vụ công, VNeID, bản đồ số và tiện ích trực tuyến.',
    sort_order: 70,
    created_at: new Date(0).toISOString(),
  },
];

export function mergeCategories(dbCategories: Category[]): Category[] {
  const bySlug = new Map<string, Category>();
  for (const item of DEFAULT_CATEGORIES) bySlug.set(item.slug, item);
  for (const item of dbCategories) bySlug.set(item.slug, item);
  return [...bySlug.values()].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export function getDefaultCategory(slug: string): Category | undefined {
  return DEFAULT_CATEGORIES.find((item) => item.slug === slug);
}
