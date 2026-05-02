import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { toSlug } from '@/lib/utils';

// GET /api/articles?category=slug&limit=10&search=query
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const limit    = parseInt(searchParams.get('limit') ?? '20');
  const search   = searchParams.get('search');

  let query = supabaseAdmin
    .from('published_articles_with_category')
    .select('*')
    .limit(limit);

  if (category) query = query.eq('category_slug', category);
  if (search)   query = query.textSearch('title', search, { type: 'websearch' });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/articles (admin only)
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

  const payload = {
    ...body,
    slug: body.slug || toSlug(body.title),
    published_at: body.is_published ? new Date().toISOString() : null,
  };

  const { data, error } = await supabaseAdmin.from('articles').insert([payload]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
