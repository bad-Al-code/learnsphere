import { getCurrentUser } from '@/app/(auth)/actions';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="container mx-auto py-4 md:py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <SidebarNav type="admin" />
        </aside>

        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
