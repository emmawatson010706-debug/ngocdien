'use client';
import { useState, useEffect, useRef } from 'react';
import type { Podcast } from '@/types/database';
import { formatDuration } from '@/lib/utils';

// ─── WEATHER ───────────────────────────────────────────────
export function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch('/api/weather')
      .then(r => r.ok ? r.json() : null)
      .then(data => data && setWeather(data))
      .catch(() => {});
  }, []);

  const cur   = weather?.list?.[0];
  const temp  = cur ? Math.round(cur.main.temp) : 28;
  const desc  = cur?.weather?.[0]?.description ?? 'Có mây nhẹ';
  const humi  = cur?.main?.humidity ?? 80;
  const wind  = cur ? Math.round(cur.wind.speed * 3.6) : 14;
  const icon  = cur ? `https://openweathermap.org/img/wn/${cur.weather[0].icon}@2x.png` : null;

  const days = weather?.list?.filter((_: any, i: number) => i % 8 === 0).slice(0, 5) ?? [];

  return (
    <div className="rounded-xl overflow-hidden mb-5 text-white"
      style={{ background: 'linear-gradient(135deg,#1D4ED8,#2563EB)' }}>
      <div className="px-4 py-3 text-[11px] font-bold font-sans tracking-widest opacity-75">
        🌤 THỜI TIẾT HƯNG NGUYÊN
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-6xl leading-none">
            {icon ? <img src={icon} alt={desc} className="w-16 h-16" /> : '⛅'}
          </div>
          <div>
            <div className="text-5xl font-black leading-none" style={{ fontFamily: "'Source Sans 3',sans-serif" }}>
              {temp}°C
            </div>
            <div className="text-sm opacity-80 mt-1 font-sans capitalize">{desc}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-t border-white/20 mb-3">
          {[['Độ ẩm', `${humi}%`], ['Gió', `${wind} km/h`], ['Tầm nhìn', '10 km']].map(([l,v]) => (
            <div key={l} className="text-center">
              <div className="font-bold text-sm">{v}</div>
              <div className="text-[10px] opacity-60 font-sans mt-0.5">{l}</div>
            </div>
          ))}
        </div>

        {days.length > 0 && (
          <div className="flex gap-1.5">
            {days.map((d: any, i: number) => {
              const date = new Date(d.dt * 1000);
              const dow  = ['CN','T2','T3','T4','T5','T6','T7'][date.getDay()];
              return (
                <div key={i} className="flex-1 bg-white/10 rounded-md py-2 text-center font-sans">
                  <div className="text-[10px] opacity-65">{dow}</div>
                  <div className="font-bold text-sm mt-1">{Math.round(d.main.temp)}°</div>
                </div>
              );
            })}
          </div>
        )}
        {!days.length && (
          <div className="flex gap-1.5">
            {['T2','T3','T4','T5','T6'].map((d,i) => (
              <div key={i} className="flex-1 bg-white/10 rounded-md py-2 text-center font-sans">
                <div className="text-[10px] opacity-65">{d}</div>
                <div className="font-bold text-sm mt-1">{[29,31,27,25,28][i]}°</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PODCAST ───────────────────────────────────────────────
export function PodcastWidget({ podcasts }: { podcasts: Podcast[] }) {
  const [active, setActive]   = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pod = podcasts[active];

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
  }, [active]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    playing ? a.pause() : a.play();
    setPlaying(!playing);
  };

  const onTimeUpdate = () => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    setProgress((a.currentTime / a.duration) * 100);
  };

  if (!podcasts.length) return (
    <div className="bg-white border border-[#E8DDD0] rounded-xl p-5 mb-5 text-center">
      <div className="text-3xl mb-2">🎙</div>
      <p className="text-sm font-sans text-gray-500">Chưa có podcast nào</p>
    </div>
  );

  return (
    <div className="bg-white border border-[#E8DDD0] rounded-xl overflow-hidden mb-5">
      <div className="bg-[#1C1C1C] px-4 py-2.5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gold dot-pulse" />
        <span className="text-white text-[13px] font-bold font-sans tracking-wider">🎙 PODCAST</span>
      </div>

      {pod && (
        <>
          <audio ref={audioRef} src={pod.audio_url} onTimeUpdate={onTimeUpdate}
            onEnded={() => setPlaying(false)} />

          <div className="p-4">
            {/* Current episode */}
            <div className="flex gap-3 items-center mb-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#1C1C1C] to-[#333] shrink-0
                flex items-center justify-center text-2xl overflow-hidden">
                {pod.cover_url
                  ? <img src={pod.cover_url} alt={pod.title} className="w-full h-full object-cover" />
                  : '🎙'}
              </div>
              <div>
                <div className="text-[10px] text-red font-bold font-sans tracking-wider mb-0.5">
                  TẬP {pod.episode_no ?? active + 1} • {playing ? '▶ ĐANG PHÁT' : 'DỪNG'}
                </div>
                <div className="font-sans text-[13px] font-bold text-ink leading-snug line-clamp-2">
                  {pod.title}
                </div>
                {pod.duration_sec && (
                  <div className="text-[11px] text-gray-400 font-sans mt-0.5">
                    {formatDuration(pod.duration_sec)}
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-3">
              <div className="h-1.5 bg-gray-100 rounded-full cursor-pointer"
                onClick={e => {
                  const a = audioRef.current;
                  if (!a) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  a.currentTime = ((e.clientX - rect.left) / rect.width) * a.duration;
                }}>
                <div className="h-full bg-red rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-5">
              <button onClick={() => setActive(a => (a - 1 + podcasts.length) % podcasts.length)}
                className="text-gray-400 hover:text-ink text-xl transition-colors">⏮</button>
              <button onClick={togglePlay}
                className="w-11 h-11 rounded-full bg-red flex items-center justify-center
                  text-white text-lg hover:bg-red-dark transition-colors">
                {playing ? '⏸' : '▶'}
              </button>
              <button onClick={() => setActive(a => (a + 1) % podcasts.length)}
                className="text-gray-400 hover:text-ink text-xl transition-colors">⏭</button>
            </div>

            {/* Episode list */}
            {podcasts.length > 1 && (
              <div className="mt-4 pt-3 border-t border-[#F0EBE3]">
                <div className="text-[10px] font-bold text-gray-400 font-sans tracking-wider mb-2">TẬP KHÁC</div>
                <div className="space-y-0">
                  {podcasts.filter((_, i) => i !== active).slice(0, 3).map((p, i) => (
                    <button key={i} onClick={() => setActive(podcasts.indexOf(p))}
                      className="w-full flex gap-2 items-start py-2 border-b border-gray-50 text-left
                        hover:bg-cream transition-colors group">
                      <span className="text-red text-sm mt-0.5">▶</span>
                      <span className="text-xs font-sans text-gray-600 group-hover:text-red transition-colors line-clamp-2">
                        {p.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── COMMUNITY ─────────────────────────────────────────────
export function CommunityWidget({
  zaloLink = '#',
  facebookLink = '#',
}: { zaloLink?: string; facebookLink?: string }) {
  return (
    <div className="bg-white border border-[#E8DDD0] rounded-xl overflow-hidden mb-5">
      <div className="bg-[#0057B8] px-4 py-2.5 text-white text-[13px] font-bold font-sans tracking-wider">
        🤝 CỘNG ĐỒNG NGỌC ĐIỀN
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { icon: '💬', name: 'Zalo', color: '#0057B8', href: zaloLink, members: '248 thành viên' },
            { icon: '📘', name: 'Facebook', color: '#1877F2', href: facebookLink, members: '512 thành viên' },
          ].map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener"
              className="rounded-lg py-4 px-2 text-center text-white flex flex-col items-center gap-1
                hover:opacity-85 transition-opacity"
              style={{ background: s.color }}>
              <span className="text-3xl">{s.icon}</span>
              <span className="font-bold text-sm font-sans">{s.name}</span>
              <span className="text-[11px] opacity-80">{s.members}</span>
            </a>
          ))}
        </div>
        {/* QR */}
        <div className="bg-cream rounded-lg p-4 text-center">
          <div className="w-24 h-24 mx-auto bg-white border-2 border-gray-200 rounded-lg
            flex flex-col items-center justify-center gap-1.5">
            <span className="text-3xl">📱</span>
            <span className="text-[9px] text-gray-400 font-sans">QR Code</span>
          </div>
          <p className="text-xs text-gray-500 font-sans mt-3">Quét mã để tham gia nhóm Zalo Ngọc Điền</p>
        </div>
      </div>
    </div>
  );
}

// ─── FEEDBACK CTA ───────────────────────────────────────────
export function FeedbackWidget() {
  const items = [
    { label: '📝 Gửi bài viết', href: '/gop-y?type=gui_bai', color: '#B45309' },
    { label: '💡 Góp ý – Kiến nghị', href: '/gop-y?type=gop_y', color: '#0891B2' },
    { label: '📣 Phản ánh sự việc', href: '/gop-y?type=phan_anh', color: '#DC2626' },
  ];
  return (
    <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FFFBF0] border border-[#FCD34D]
      rounded-xl p-4 mb-5">
      <h3 className="font-display text-base font-bold text-[#92400E] mb-1">✉️ GÓP Ý & GỬI BÀI</h3>
      <p className="text-xs text-gray-600 font-sans leading-relaxed mb-3">
        Gửi bài viết, góp ý, phản ánh hoặc kiến nghị về xóm tại đây.
      </p>
      <div className="space-y-2">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className="flex items-center gap-2 w-full bg-white border rounded-md px-3 py-2
              text-[13px] font-bold font-sans hover:opacity-80 transition-opacity"
            style={{ borderColor: `${item.color}30`, color: item.color }}>
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
