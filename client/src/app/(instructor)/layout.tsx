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
    <div className="container mx-auto py-4 md:py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <SidebarNav type="instructor" />
        </aside>

        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
