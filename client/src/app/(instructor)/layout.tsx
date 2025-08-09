import { SidebarNav } from '@/components/layout/sidebar-nav';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCurrentUser } from '../(auth)/actions';

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || !['instructor', 'admin'].includes(user.role)) {
    redirect('/');
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="gap-6 md:grid md:grid-cols-12 lg:grid-cols-12">
        <aside className="mb-4 md:col-span-2 md:mb-0 lg:col-span-2">
          <SidebarNav type="instructor" />
        </aside>
        <main className="md:col-span-9">{children}</main>
      </div>
    </div>
  );
}
