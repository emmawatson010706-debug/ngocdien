import { createServerSupabase } from './server';
import type { Article, Category, Person, Podcast } from '@/types/database';
import { mergeCategories } from '@/lib/siteDefaults';

// ─── ARTICLES ──────────────────────────────────────────────

export async function getFeaturedArticles(): Promise<Article[]> {
  const sb = createServerSupabase();
  const { data } = await sb
    .from('featured_articles')
    .select('*')
    .limit(5);
  return (data ?? []) as Article[];
}

export async function getLatestArticles(limit = 10): Promise<Article[]> {
  const sb = createServerSupabase();
  const { data } = await sb
    .from('published_articles_with_category')
    .select('*')
    .limit(limit);
  return (data ?? []) as Article[];
}

export async function getArticlesByCategory(
  categorySlug: string,
  limit = 20
): Promise<Article[]> {
  const sb = createServerSupabase();
  const { data } = await sb
    .from('published_articles_with_category')
    .select('*')
    .eq('category_slug', categorySlug)
    .limit(limit);
  return (data ?? []) as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const sb = createServerSupabase();
  const { data } = await sb
    .from('published_articles_with_category')
    .select('*')
    .eq('slug', slug)
    .single();
  return data as Article | null;
}

export async function incrementViewCount(id: string) {
  const sb = createServerSupabase();
  await sb.rpc('increment_views', { article_id: id });
}


export async function getAllPublishedArticles(limit = 80): Promise<Article[]> {
  const sb = createServerSupabase();
  const { data } = await sb
    .from('published_articles_with_category')
    .select('*')
    .limit(limit);
  return (data ?? []) as Article[];
}

export async function searchPublishedArticles(params: {
  q?: string;
  categorySlug?: string;
  year?: string;
  limit?: number;
}): Promise<Article[]> {
  const sb = createServerSupabase();
  let query = sb
    .from('published_articles_with_category')
    .select('*')
    .limit(params.limit ?? 80);

  if (params.categorySlug) query = query.eq('category_slug', params.categorySlug);
  if (params.q) query = query.or(`title.ilike.%${params.q}%,excerpt.ilike.%${params.q}%`);
  if (params.year && /^\d{4}$/.test(params.year)) {
    query = query
      .gte('published_at', `${params.year}-01-01`)
      .lt('published_at', `${Number(params.year) + 1}-01-01`);
  }

  const { data } = await query;
  return (data ?? []) as Article[];
}

// ─── CATEGORIES ────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const sb = createServerSupabase();
  const { data } = await sb
    .from('categories')
    .select('*')
    .order('sort_order');

  // Luôn có danh mục mặc định để các đường dẫn công khai như /di-tich,
  // /tieng-lang không bị 404 nếu CSDL Supabase chưa seed đủ categories.
  return mergeCategories((data ?? []) as Category[]);
}

// ─── PEOPLE ────────────────────────────────────────────────

export async function getPeopleByType(type: string): Promise<Person[]> {
  const sb = createServerSupabase();
  const { data } = await sb
    .from('people')
    .select('*')
    .eq('type', type)
    .order('sort_order');
  return (data ?? []) as Person[];
}


export async function getAllPeople(): Promise<Person[]> {
  const sb = createServerSupabase();
  const { data } = await sb
    .from('people')
    .select('*')
    .order('sort_order');
  return (data ?? []) as Person[];
}

// ─── PODCASTS ──────────────────────────────────────────────

export async function getPublishedPodcasts(limit = 10): Promise<Podcast[]> {
  const sb = createServerSupabase();
  const { data } = await sb
    .from('podcasts')
    .select('*')
    .eq('is_published', true)
    .order('episode_no', { ascending: false })
    .limit(limit);
  return (data ?? []) as Podcast[];
}

// ─── SETTINGS ──────────────────────────────────────────────

export async function getSetting(key: string): Promise<string | null> {
  const sb = createServerSupabase();
  const { data } = await sb
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();
  return data?.value ?? null;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const sb = createServerSupabase();
  const { data } = await sb.from('settings').select('key, value');
  return Object.fromEntries(((data ?? []) as Array<{ key: string; value: string | null }>).map((r) => [r.key, r.value ?? '']));
}
