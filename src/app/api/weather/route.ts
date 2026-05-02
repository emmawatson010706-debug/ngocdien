import { NextResponse } from 'next/server';

export async function GET() {
  const key  = process.env.NEXT_PUBLIC_OWM_API_KEY;
  const city = process.env.NEXT_PUBLIC_OWM_CITY ?? '1568574';

  if (!key) {
    return NextResponse.json({ error: 'No API key configured' }, { status: 503 });
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?id=${city}&appid=${key}&units=metric&lang=vi&cnt=5`,
    { next: { revalidate: 1800 } } // cache 30 min
  );

  if (!res.ok) return NextResponse.json({ error: 'Weather API error' }, { status: 502 });
  const data = await res.json();
  return NextResponse.json(data);
}
