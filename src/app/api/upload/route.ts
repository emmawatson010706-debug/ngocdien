import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getCurrentAdmin } from '@/lib/security';

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_BUCKETS = new Set(['media', 'documents', 'podcasts']);
const ALLOWED_MIME = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/pdf',
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
]);

function safePart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9/_-]/g, '').replace(/\/+/g, '/').replace(/^\/+/, '').slice(0, 80) || 'uploads';
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin.isAdmin) return NextResponse.json({ error: 'Bạn không có quyền upload file.' }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const requestedBucket = String(formData.get('bucket') || 'media');
  const bucket = ALLOWED_BUCKETS.has(requestedBucket) ? requestedBucket : 'media';
  const folder = safePart(String(formData.get('folder') || 'uploads'));

  if (!file) return NextResponse.json({ error: 'Chưa có file upload.' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File vượt quá giới hạn 8MB.' }, { status: 413 });
  if (!ALLOWED_MIME.has(file.type)) return NextResponse.json({ error: `Định dạng ${file.type || 'không xác định'} chưa được phép upload.` }, { status: 415 });

  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const filename = `${folder}/${Date.now()}_${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(filename);

  await supabaseAdmin.from('media').insert([{
    filename: file.name,
    url: publicUrl,
    mime_type: file.type,
    size_bytes: file.size,
    uploaded_by: admin.user?.id ?? null,
  }]);

  return NextResponse.json({ url: publicUrl, filename, bucket });
}
