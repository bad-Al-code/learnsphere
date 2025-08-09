import { NavItem } from '@/types';
import {
  Bell,
  BookOpenCheck,
  FolderKanban,
  LayoutGrid,
  Shield,
  User,
  Users,
} from 'lucide-react';

export const settingsNavItems: NavItem[] = [
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

export const adminNavItems: NavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    value: 'dashboard',
    icon: LayoutGrid,
  },
  {
    href: '/admin/users',
    label: 'Users',
    value: 'users',
    icon: Users,
  },
  {
    href: '/admin/courses',
    label: 'Courses',
    value: 'courses',
    icon: BookOpenCheck,
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    value: 'categories',
    icon: FolderKanban,
  },
];
