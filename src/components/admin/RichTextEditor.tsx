"use client";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import CSS giao diện chuẩn của Quill

// Bí quyết cốt lõi: Tắt SSR để tránh lỗi khi Next.js render trên server
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false, 
  loading: () => <p style={{color: '#888', padding: 20}}>Đang tải bộ soạn thảo...</p> 
});

export default function RichTextEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  
  // Cấu hình thanh công cụ (Toolbar)
  const modules = {
    toolbar: [
      [{ 'header': [2, 3, 4, false] }], // Tiêu đề H2, H3...
      ['bold', 'italic', 'underline', 'strike'], // Định dạng chữ
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Danh sách
      [{ 'color': [] }, { 'background': [] }], // Màu chữ, màu nền
      ['link', 'image', 'video'], // Chèn liên kết, ảnh, video
      ['clean'] // Xóa format
    ],
  };

  return (
    <div className="admin-quill-container" style={{ background: '#fff', color: '#000', borderRadius: 8, overflow: 'hidden' }}>
      <ReactQuill 
        theme="snow" 
        value={value || ''} 
        onChange={onChange} 
        modules={modules}
        placeholder="Bắt đầu viết nội dung bài viết..."
      />
    </div>
  );
}