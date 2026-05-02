"use client";

import React from "react";

// LỚP GIÁP 1: Dùng "props: any" để file bài viết truyền cái gì vào nó cũng nhận tuốt, không báo lỗi
export default function ShareButton(props: any) {
  const handleShare = async () => {
    // Chộp đúng đường link đang hiển thị trên điện thoại
    const currentUrl = window.location.href;

    // LỚP GIÁP 2: Dùng "as any" để ép TypeScript không được soi xét tính năng share của điện thoại
    const nav = navigator as any;

    if (nav.share) {
      try {
        await nav.share({
          title: props.title + " | Xóm Ngọc Điền",
          text: props.excerpt,
          url: currentUrl,
        });
      } catch (err) {
        console.log("Đã hủy chia sẻ");
      }
    } else {
      navigator.clipboard.writeText(currentUrl);
      alert("Đã copy đường link! Anh/chị có thể dán vào Zalo hoặc Facebook để chia sẻ.");
    }
  };

  return (
    <button onClick={handleShare}
      style={{ background:"#B91C1C", color:"#fff", border:"none", borderRadius:5,
      padding:"8px 16px", fontSize:14, fontWeight:"bold", cursor:"pointer",
      display:"flex", alignItems:"center", gap:6 }}>
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
      </svg>
      Bấm để Chia sẻ
    </button>
  );
}