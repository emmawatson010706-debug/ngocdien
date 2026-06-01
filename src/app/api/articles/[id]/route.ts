import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getCurrentAdmin, sanitizeRichHtml } from '@/lib/security';
import { toSlug } from '@/lib/utils';

function cleanPayload(body: Record<string, any>) {
  const payload: Record<string, any> = {};
  const allowed = ['title','slug','excerpt','content','thumbnail_url','category_id','author_name','source_note','editor_name','document_type','tags','is_featured','is_published','published_at'];
  for (const key of allowed) if (key in body) payload[key] = body[key];

  if ('title' in payload) payload.title = String(payload.title ?? '').trim();
  if ('slug' in payload || payload.title) payload.slug = String(payload.slug || toSlug(payload.title)).trim();
  if ('excerpt' in payload) payload.excerpt = payload.excerpt ? String(payload.excerpt).trim() : null;
  if ('content' in payload) payload.content = sanitizeRichHtml(payload.content ?? '');
  if ('thumbnail_url' in payload) payload.thumbnail_url = payload.thumbnail_url || null;
  if ('category_id' in payload) payload.category_id = payload.category_id || null;
  if ('author_name' in payload) payload.author_name = payload.author_name ? String(payload.author_name).trim() : 'Ban biên tập';
  if ('source_note' in payload) payload.source_note = payload.source_note ? String(payload.source_note).trim() : null;
  if ('editor_name' in payload) payload.editor_name = payload.editor_name ? String(payload.editor_name).trim() : null;
  if ('document_type' in payload) payload.document_type = payload.document_type ? String(payload.document_type).trim() : null;
  if ('tags' in payload) payload.tags = Array.isArray(payload.tags) ? payload.tags.map(String).map(t => t.trim()).filter(Boolean) : [];
  if ('is_published' in payload) {
    payload.is_published = !!payload.is_published;
    payload.published_at = payload.is_published ? (payload.published_at ?? new Date().toISOString()) : null;
  }
  if ('is_featured' in payload) payload.is_featured = !!payload.is_featured;
  return payload;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin.isAdmin) return NextResponse.json({ error: 'Bạn không có quyền sửa bài viết.' }, { status: 403 });

  const body = await req.json();
  const payload = cleanPayload(body);
  if ('title' in payload && !payload.title) return NextResponse.json({ error: 'Vui lòng nhập tiêu đề bài viết.' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('articles')
    .update(payload)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  return PUT(req, ctx);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin.isAdmin) return NextResponse.json({ error: 'Bạn không có quyền xóa bài viết.' }, { status: 403 });

  const { error } = await supabaseAdmin.from('articles').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
