import { NavItem } from '@/types';
import {
  Bell,
  BookCopy,
  BookOpen,
  BookOpenCheck,
  FileText,
  FolderKanban,
  Info,
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

export const publicNavItems = [
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/blog', label: 'Blog', icon: FileText },
  { href: '/about', label: 'About', icon: Info },
];

export default publicNavItems;

export const instructorNavItems: NavItem[] = [
  {
    href: '/dashboard',
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
];
