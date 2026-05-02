import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const formData  = await req.formData();
  const file      = formData.get('file') as File;
  const bucket    = (formData.get('bucket') as string) || 'media';
  const folder    = (formData.get('folder') as string) || 'uploads';

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const ext      = file.name.split('.').pop();
  const filename = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer   = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filename, buffer, { contentType: file.type, upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(filename);

  // Save to media table
  await supabaseAdmin.from('media').insert([{
    filename: file.name,
    url:      publicUrl,
    mime_type:file.type,
    size_bytes:file.size,
  }]);

  return NextResponse.json({ url: publicUrl, filename });
}
