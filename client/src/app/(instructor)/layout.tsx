import { redirect } from 'next/navigation';
import React from 'react';
import { getCurrentUser } from '../(auth)/actions';
import { InstructorSidebar } from './_components/instructor-sidebar';
import { InstructorTabs } from './_components/instructor-tabs';

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
      {/* Mobile Tabs */}
      <div className="block md:hidden">
        <InstructorTabs />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden gap-6 md:grid md:grid-cols-12 lg:grid-cols-12">
        <aside className="md:col-span-2 lg:col-span-2">
          <InstructorSidebar />
        </aside>
        <main className="md:col-span-9">{children}</main>
      </div>

      {/* Mobile content area */}
      <div className="block md:hidden">{children}</div>
    </div>
  );
}
