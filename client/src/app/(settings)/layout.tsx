import { getCurrentUser } from '@/app/(auth)/actions';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { NavItem } from '@/types';
import { Bell, Shield, User } from 'lucide-react';
import { redirect } from 'next/navigation';

const settingsNavItems: NavItem[] = [
  {
    href: '/settings/profile',
    label: 'My Account',
    value: 'profile',
    icon: User,
  },
  {
    href: '/settings/security',
    label: 'Security',
    value: 'security',
    icon: Shield,
  },
  {
    href: '/settings/notifications',
    label: 'Notifications',
    value: 'notifications',
    icon: Bell,
  },
];

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-4 md:py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <h2 className="mb-4 text-lg font-semibold">Settings</h2>
          <SidebarNav type="settings" />
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
