import { NavItem } from '@/types';
import {
  BarChart2Icon,
  Bell,
  BookCopy,
  BookOpenCheck,
  FileText,
  FolderKanban,
  LayoutGrid,
  Settings2,
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

export const instructorNavItems: NavItem[] = [
  {
    href: '/dashboard/instructor',
    label: 'Dashboard',
    value: 'dashboard',
    icon: LayoutGrid,
  },
  {
    href: '/dashboard/instructor/courses',
    label: 'Courses',
    value: 'courses',
    icon: BookCopy,
  },
  {
    href: '/dashboard/instructor/assignments',
    label: 'Assignments',
    value: 'assignments',
    icon: FileText,
  },
  {
    href: '/dashboard/instructor/grades',
    label: 'Grades',
    value: 'grades',
    icon: BarChart2Icon,
  },
  {
    href: '/dashboard/instructor/settings',
    label: 'Settings',
    value: 'settings',
    icon: Settings2,
  },
];
