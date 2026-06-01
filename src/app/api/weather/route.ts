import { NextResponse } from 'next/server';

function fallbackWeather() {
  const now = Math.floor(Date.now() / 1000);
  const temps = [28, 29, 30, 28, 27];
  return {
    configured: false,
    source: 'fallback',
    city: { name: 'Hưng Nguyên' },
    list: temps.map((temp, index) => ({
      dt: now + index * 86400,
      main: { temp, humidity: 80 },
      weather: [{ description: 'Dữ liệu tham khảo', icon: '02d' }],
      wind: { speed: 3.8 },
      visibility: 10000,
    })),
  };
}

export async function GET() {
  const key = process.env.OWM_API_KEY;
  const city = process.env.OWM_CITY ?? '1568574';

  // Không trả 503 khi thiếu key để tránh log đỏ trong môi trường dev/Vercel.
  // Widget vẫn hiển thị dữ liệu tham khảo, còn dữ liệu thật sẽ chạy khi cấu hình OWM_API_KEY.
  if (!key) {
    return NextResponse.json(fallbackWeather(), { status: 200 });
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?id=${city}&appid=${key}&units=metric&lang=vi&cnt=40`,
      { next: { revalidate: 1800 } }
    );

    if (!res.ok) {
      return NextResponse.json({ ...fallbackWeather(), configured: true, source: 'fallback_after_api_error' }, { status: 200 });
    }

    return NextResponse.json({ configured: true, source: 'openweathermap', ...(await res.json()) });
  } catch {
    return NextResponse.json({ ...fallbackWeather(), configured: true, source: 'fallback_after_network_error' }, { status: 200 });
  }
}
