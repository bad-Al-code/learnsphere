import { redirect } from 'next/navigation';
import { getCurrentUser } from '../(auth)/actions';
import { Sidebar } from './_components/sidebar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (!['instructor', 'admin'].includes(user.role)) {
    redirect('/');
  }

  return (
    <div className="container mx-auto py-0 pb-4 md:py-0">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
        <aside className="md:col-span-1">
          <Sidebar />
        </aside>
        <main className="md:col-span-3 lg:col-span-4">{children}</main>
      </div>
    </div>
  );
}
