import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const allowed: string[] = ['gop_y', 'phan_anh', 'kien_nghi', 'gui_bai'];
  if (!allowed.includes(body.type)) {
    return NextResponse.json({ error: 'Invalid submission type' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from('submissions').insert([{
    type:        body.type,
    sender_name: body.sender_name ?? null,
    email:       body.email ?? null,
    phone:       body.phone ?? null,
    subject:     body.subject ?? null,
    content:     body.content,
    attachment:  body.attachment ?? null,
  }]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}
