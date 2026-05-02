import { createServerSupabase } from './server';
import { supabase as browserClient } from './client';
import type { Article, Category, Person, Podcast } from '@/types/database';

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
  await browserClient.rpc('increment_views', { article_id: id });
}

// ─── CATEGORIES ────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const sb = createServerSupabase();
  const { data } = await sb
    .from('categories')
    .select('*')
    .order('sort_order');
  return (data ?? []) as Category[];
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
  return Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value]));
}
