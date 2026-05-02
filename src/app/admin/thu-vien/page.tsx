'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function LibraryPage() {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Bơm thẳng file vào thư mục thu-vien trong két sắt media của Supabase
    const ext = file.name.split('.').pop();
    const path = `thu-vien/${Date.now()}_${file.name.replace(/\s+/g, '-')}`;

    const { error } = await supabase.storage.from('media').upload(path, file);
    
    if (error) {
      alert('❌ Lỗi tải lên: ' + error.message);
    } else {
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      setFiles(prev => [data.publicUrl, ...prev]);
      alert('🎉 Tải lên thành công! Anh có thể copy link bên dưới để chèn vào bài viết.');
    }
    setUploading(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-black">📚 Thư viện File & Hình ảnh</h1>
        <p className="text-sm text-gray-500 mt-1">Nơi lưu trữ PDF, tài liệu, hình ảnh dùng chung cho các bài viết.</p>
      </div>
      
      {/* Khu vực kéo thả / Chọn file */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-red/30 rounded-lg cursor-pointer bg-red/5 hover:bg-red/10 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <span className="text-4xl mb-3">{uploading ? '⏳' : '📤'}</span>
            <p className="text-sm text-gray-700 font-bold font-sans">
              {uploading ? 'Đang bơm file vào két sắt...' : 'Click để chọn file tải lên'}
            </p>
            <p className="text-xs text-gray-500 mt-2 font-sans">Hỗ trợ: PDF, JPG, PNG, DOCX...</p>
          </div>
          <input type="file" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {/* Danh sách file vừa úp */}
      {files.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold font-sans mb-4 text-ink">Các file vừa tải lên:</h3>
          <div className="space-y-3">
            {files.map((url, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <a href={url} target="_blank" className="text-sm font-sans text-blue-600 truncate max-w-[70%] hover:underline">
                  {url}
                </a>
                <button 
                  onClick={() => navigator.clipboard.writeText(url)} 
                  className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-100 font-bold transition-colors shadow-sm">
                  📋 Copy Link
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}