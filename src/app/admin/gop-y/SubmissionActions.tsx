'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

type Status = 'pending'|'reviewed'|'resolved'|'rejected';

export default function SubmissionActions({
  id, status, content, subject, senderName
}: { id:string; status:Status; content:string; subject:string|null; senderName:string|null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = async (newStatus: Status) => {
    setLoading(true);
    await supabase.from('submissions').update({ status: newStatus }).eq('id', id);
    setLoading(false);
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="text-xs font-bold text-blue-600 hover:underline font-sans">
        Xem chi tiết
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="font-display font-bold text-lg">Chi tiết góp ý</h3>
              {senderName && <p className="text-sm text-gray-500 font-sans mt-0.5">Từ: {senderName}</p>}
            </div>
            <div className="px-6 py-5">
              {subject && (
                <p className="font-bold font-sans mb-2 text-ink">{subject}</p>
              )}
              <div className="bg-cream rounded-lg p-4 text-sm font-sans leading-relaxed text-gray-700
                max-h-48 overflow-y-auto whitespace-pre-wrap">
                {content}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2">
              <button onClick={() => update('reviewed')} disabled={loading}
                className="text-xs font-bold font-sans px-3 py-2 rounded-lg bg-blue-50 text-blue-700
                  hover:bg-blue-100 transition-colors disabled:opacity-50">
                👁 Đánh dấu đã xem
              </button>
              <button onClick={() => update('resolved')} disabled={loading}
                className="text-xs font-bold font-sans px-3 py-2 rounded-lg bg-green-50 text-green-700
                  hover:bg-green-100 transition-colors disabled:opacity-50">
                ✅ Đã xử lý
              </button>
              <button onClick={() => update('rejected')} disabled={loading}
                className="text-xs font-bold font-sans px-3 py-2 rounded-lg bg-red/10 text-red
                  hover:bg-red/20 transition-colors disabled:opacity-50">
                ❌ Từ chối
              </button>
              <button onClick={() => setOpen(false)}
                className="ml-auto text-xs font-bold font-sans px-3 py-2 rounded-lg
                  bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
