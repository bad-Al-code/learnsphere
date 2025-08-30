'use client';

import React from 'react';
import { SidebarNav } from '../(app)/_components/sidebar-nav';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-0 md:py-0">
      <div className="grid grid-cols-1 gap-0 md:grid-cols-4 lg:grid-cols-5">
        <aside className="md:col-span-1">
          <div className="hidden md:block">
            <div className="fixed flex flex-col gap-6">
              <SidebarNav type="student" />
              <div className="mb-4">
                <p className="text-muted-foreground text-xs uppercase">
                  Customize
                </p>
                <SidebarNav type="student-customize" />
              </div>
            </div>
          </div>
        </aside>
        <main className="md:col-span-3 lg:col-span-4">{children}</main>
      </div>
    </div>
  );
}
