'use client';

export default function BreakingTicker({ items }: { items: string[] }) {
  const text = items.join('          ✦          ');
  return (
    <div className="bg-red flex items-center h-9 overflow-hidden">
      <div className="bg-[#7F1D1D] px-4 h-full flex items-center shrink-0
        text-white text-[11px] font-bold font-sans tracking-[1px]">
        TIN MỚI
      </div>
      <div className="flex-1 overflow-hidden">
        <span className="ticker-inner inline-block whitespace-nowrap text-white text-[13px] font-sans px-6">
          {text}&nbsp;&nbsp;&nbsp;&nbsp;{text}
        </span>
      </div>
    </div>
  );
}
