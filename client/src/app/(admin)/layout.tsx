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
    <div className="container mx-auto space-y-6 py-6">
      <div className="gap-6 md:grid md:grid-cols-12 lg:grid-cols-12">
        <aside className="md:col-span-3 lg:col-span-2">
          <SidebarNav type="admin" />
        </aside>
        <main className="md:col-span-9">{children}</main>
      </div>
    </div>
  );
}
