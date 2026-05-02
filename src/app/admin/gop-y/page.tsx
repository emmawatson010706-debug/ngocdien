import { createServerSupabase } from '@/lib/supabase/server';
import SubmissionActions from './SubmissionActions';
import { formatDate } from '@/lib/utils';

const TYPE_LABELS: Record<string, string> = {
  gop_y:'💡 Góp ý', phan_anh:'📣 Phản ánh', kien_nghi:'📋 Kiến nghị', gui_bai:'📝 Gửi bài',
};
const STATUS_LABELS: Record<string, { label:string; color:string }> = {
  pending:  { label:'⏳ Chờ', color:'#D97706' },
  reviewed: { label:'👁 Đã xem', color:'#0891B2' },
  resolved: { label:'✅ Đã xử lý', color:'#16A34A' },
  rejected: { label:'❌ Từ chối', color:'#DC2626' },
};

export const dynamic = 'force-dynamic';

export default async function AdminGopYPage() {
  const sb = createServerSupabase();
  const { data: subs } = await sb
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  const pending = subs?.filter(s => s.status === 'pending').length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-black">✉️ Góp ý & Gửi bài</h1>
          <p className="text-sm text-gray-500 font-sans mt-0.5">
            {subs?.length ?? 0} tổng &nbsp;·&nbsp;
            <span className="text-orange-500 font-bold">{pending} chờ xử lý</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm font-sans">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Loại','Người gửi','Tiêu đề','Ngày gửi','Trạng thái',''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subs?.map(s => {
              const st = STATUS_LABELS[s.status] ?? STATUS_LABELS.pending;
              return (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-bold font-sans">
                      {TYPE_LABELS[s.type] ?? s.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{s.sender_name ?? '—'}</p>
                    <p className="text-xs text-gray-400">{s.email ?? s.phone ?? ''}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[240px]">
                    <p className="font-semibold line-clamp-1">{s.subject ?? '(không có tiêu đề)'}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{s.content}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {formatDate(s.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-gray-100"
                      style={{ color: st.color }}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <SubmissionActions id={s.id} status={s.status} content={s.content}
                      subject={s.subject} senderName={s.sender_name} />
                  </td>
                </tr>
              );
            })}
            {!subs?.length && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                Chưa có góp ý nào từ người dân.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
