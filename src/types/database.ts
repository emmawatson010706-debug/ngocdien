export type PersonType = 'me_vnah' | 'liet_sy' | 'anh_hung' | 'dang_vien' | 'other';
export type SubmissionType = 'gop_y' | 'phan_anh' | 'kien_nghi' | 'gui_bai';
export type SubmissionStatus = 'pending' | 'reviewed' | 'resolved' | 'rejected';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  icon: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  thumbnail_url: string | null;
  category_id: string | null;
  author_name: string;
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // joined
  category_name?: string;
  category_slug?: string;
  category_icon?: string;
}

export interface Person {
  id: string;
  full_name: string;
  type: PersonType;
  image_url: string | null;
  birth_year: number | null;
  death_year: number | null;
  hometown: string | null;
  biography: string | null;
  sort_order: number;
  created_at: string;
}

export interface Podcast {
  id: string;
  title: string;
  description: string | null;
  audio_url: string;
  cover_url: string | null;
  duration_sec: number | null;
  episode_no: number | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface Submission {
  id: string;
  type: SubmissionType;
  sender_name: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  content: string;
  attachment: string | null;
  status: SubmissionStatus;
  admin_note: string | null;
  created_at: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  created_at: string;
}
