import { NavItem } from '@/types';

export const instructorDashboardTabs: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Overview',
    value: 'overview',
    icon: 'LayoutGrid',
  },
  {
    href: '/dashboard',
    label: 'Engagement',
    value: 'engagement',
    icon: 'HeartHandshake',
  },
  {
    href: '/dashboard',
    label: 'Performance',
    value: 'performance',
    icon: 'LineChart',
  },
  {
    href: '/dashboard',
    label: 'Comparison',
    value: 'comparison',
    icon: 'BarChart2',
  },
  {
    href: '/dashboard',
    label: 'Analytics',
    value: 'analytics',
    icon: 'Presentation',
  },
  { href: '/dashboard', label: 'Insights', value: 'insights', icon: 'Eye' },
];

export const instructorStudentsTabs: NavItem[] = [
  {
    href: '/dashboard/students',
    label: 'Overview',
    value: 'overview',
    icon: 'LayoutGrid',
  },
  {
    href: '/dashboard/students',
    label: 'All Students',
    value: 'all-students',
    icon: 'Users',
  },
  {
    href: '/dashboard/students',
    label: 'Student Profiles',
    value: 'student-profiles',
    icon: 'UserSquare',
  },
  {
    href: '/dashboard/students',
    label: 'Analytics',
    value: 'analytics',
    icon: 'BarChart2',
  },
  {
    href: '/dashboard/students',
    label: 'Activity',
    value: 'activity',
    icon: 'Activity',
  },
];

export const settingsNavItems: NavItem[] = [
  {
    href: '/settings/profile',
    label: 'My Account',
    value: 'profile',
    icon: 'User',
  },
  {
    href: '/settings/security',
    label: 'Security',
    value: 'security',
    icon: 'Shield',
  },
  {
    href: '/settings/notifications',
    label: 'Notifications',
    value: 'notifications',
    icon: 'Bell',
  },
];

export const adminNavItems: NavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    value: 'dashboard',
    icon: 'LayoutGrid',
  },
  { href: '/admin/users', label: 'Users', value: 'users', icon: 'Users' },
  {
    href: '/admin/courses',
    label: 'Courses',
    value: 'courses',
    icon: 'BookOpenCheck',
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    value: 'categories',
    icon: 'FolderKanban',
  },
];

export const publicNavItems: NavItem[] = [
  { href: '/courses', label: 'Courses', value: 'courses', icon: 'BookOpen' },
  { href: '/blog', label: 'Blog', value: 'blog', icon: 'FileText' },
  { href: '/about', label: 'About', value: 'about', icon: 'Info' },
];

export const instructorNavItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    value: 'dashboard',
    icon: 'LayoutGrid',
  },
  {
    href: '/dashboard/instructor/courses',
    label: 'My Courses',
    value: 'courses',
    icon: 'BookCopy',
  },
  {
    href: '/dashboard/students',
    label: 'Students',
    value: 'students',
    icon: 'Users',
  },
  {
    href: '/dashboard/instructor/analytics',
    label: 'Analytics',
    value: 'analytics',
    icon: 'LineChart',
  },
  {
    href: '/dashboard/instructor/communication',
    label: 'Communication',
    value: 'communication',
    icon: 'MessageSquare',
  },
  {
    href: '/dashboard/instructor/schedule',
    label: 'Schedule',
    value: 'schedule',
    icon: 'Calendar',
  },
  {
    href: '/dashboard/instructor/certificates',
    label: 'Certificates',
    value: 'certificates',
    icon: 'Award',
  },
];
