import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/security';
import AdminSidebar from './AdminSidebar';

export const metadata = { title: 'Quáº£n trá»‹ | Ngá»c Äiá»n' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin.user) redirect('/admin-login');
  if (!admin.isAdmin) redirect('/admin-login?error=not-admin');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar email={admin.user.email ?? ''} />
      <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
    </div>
  );
}
