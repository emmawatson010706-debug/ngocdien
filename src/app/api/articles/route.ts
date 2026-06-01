import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getCurrentAdmin, sanitizeRichHtml } from '@/lib/security';
import { toSlug } from '@/lib/utils';

const ARTICLE_FIELDS = [
  'title', 'slug', 'excerpt', 'content', 'thumbnail_url', 'category_id',
  'author_name', 'source_note', 'editor_name', 'document_type', 'tags', 'is_published', 'is_featured', 'published_at'
];

function pickArticlePayload(body: Record<string, any>) {
  const clean: Record<string, any> = {};
  for (const key of ARTICLE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, key)) clean[key] = body[key];
  }

  clean.title = String(clean.title ?? '').trim();
  clean.slug = String(clean.slug || toSlug(clean.title)).trim();
  clean.excerpt = clean.excerpt ? String(clean.excerpt).trim() : null;
  clean.content = sanitizeRichHtml(clean.content ?? '');
  clean.thumbnail_url = clean.thumbnail_url || null;
  clean.category_id = clean.category_id || null;
  clean.author_name = clean.author_name ? String(clean.author_name).trim() : 'Ban biên tập';
  clean.source_note = clean.source_note ? String(clean.source_note).trim() : null;
  clean.editor_name = clean.editor_name ? String(clean.editor_name).trim() : null;
  clean.document_type = clean.document_type ? String(clean.document_type).trim() : null;
  clean.tags = Array.isArray(clean.tags) ? clean.tags.map(String).map(t => t.trim()).filter(Boolean) : [];
  clean.is_published = !!clean.is_published;
  clean.is_featured = !!clean.is_featured;
  clean.published_at = clean.is_published ? (clean.published_at ?? new Date().toISOString()) : null;

  return clean;
}

// GET /api/articles?category=slug&limit=10&search=query
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 50);
  const search = searchParams.get('search');

  let query = supabaseAdmin
    .from('published_articles_with_category')
    .select('*')
    .limit(Number.isFinite(limit) ? limit : 20);

  if (category) query = query.eq('category_slug', category);
  if (search) query = query.textSearch('title', search, { type: 'websearch' });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/articles (admin only)
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin.isAdmin) {
    return NextResponse.json({ error: 'Bạn không có quyền tạo bài viết.' }, { status: 403 });
  }

  const body = await req.json();
  const payload = pickArticlePayload(body);
  if (!payload.title) return NextResponse.json({ error: 'Vui lòng nhập tiêu đề bài viết.' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('articles')
    .insert([payload])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
