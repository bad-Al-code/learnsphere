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

export const courseEditorTabs: NavItem[] = [
  {
    value: 'overview',
    label: 'Overview',
    icon: 'LayoutDashboard',
    href: '/dashboard/courses',
  },
  { value: 'content', label: 'Content', icon: 'ListChecks', href: '/content' },
  {
    value: 'assignments',
    label: 'Assignments',
    icon: 'FileText',
    href: '/dashboard/courses',
  },
  {
    value: 'resources',
    label: 'Resources',
    icon: 'File',
    href: '/dashboard/courses',
  },
  {
    value: 'analytics',
    label: 'Analytics',
    icon: 'AreaChart',
    href: '/dashboard/courses',
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: 'Settings',
    href: '/dashboard/courses',
  },
];

export const lessonEditorTabs: NavItem[] = [
  { value: 'content', label: 'Content', icon: 'FileText', href: '#' },
  { value: 'analytics', label: 'Analytics', icon: 'BarChart2', href: '#' },
  { value: 'students', label: 'Students', icon: 'Users', href: '#' },
  { value: 'comments', label: 'Comments', icon: 'MessageSquare', href: '#' },
  { value: 'settings', label: 'Settings', icon: 'Settings', href: '#' },
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

export const instructorAnalyticsTabs: NavItem[] = [
  {
    href: '/dashboard/analytics',
    label: 'Overview',
    value: 'overview',
    icon: 'LayoutGrid',
  },
  {
    href: '/dashboard/analytics',
    label: 'Course Analysis',
    value: 'course-analysis',
    icon: 'BookOpen',
  },
  {
    href: '/dashboard/analytics',
    label: 'Student Performance',
    value: 'student-performance',
    icon: 'GraduationCap',
  },
  {
    href: '/dashboard/analytics',
    label: 'Engagement',
    value: 'engagement',
    icon: 'HeartHandshake',
  },
  {
    href: '/dashboard/analytics',
    label: 'Reports',
    value: 'reports',
    icon: 'FileBarChart',
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
    href: '/dashboard/courses',
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
    href: '/dashboard/analytics',
    label: 'Analytics',
    value: 'analytics',
    icon: 'LineChart',
  },
  {
    href: '/dashboard/communication',
    label: 'Communication',
    value: 'communication',
    icon: 'MessageSquare',
  },
  {
    href: '/dashboard/schedule',
    label: 'Schedule',
    value: 'schedule',
    icon: 'Calendar',
  },
  {
    href: '/dashboard/certificates',
    label: 'Certificates',
    value: 'certificates',
    icon: 'Award',
  },
];

export const communicationTabs: NavItem[] = [
  { value: 'messages', label: 'Messages', icon: 'Mail', href: '#' },
  { value: 'compose', label: 'Compose', icon: 'Pencil', href: '#' },
  {
    value: 'announcements',
    label: 'Announcements',
    icon: 'Megaphone',
    href: '#',
  },
  { value: 'templates', label: 'Templates', icon: 'FileText', href: '#' },
];

export const studentNavItems: NavItem[] = [
  {
    href: '/student',
    label: 'Dashboard',
    value: 'dashboard',
    icon: 'LayoutGrid',
  },
  {
    href: '/student/my-courses',
    label: 'My Courses',
    value: 'my-courses',
    icon: 'BookCopy',
  },
  {
    href: '/student/assignments',
    label: 'Assignments',
    value: 'assignments',
    icon: 'FileText',
  },
  {
    href: '/student/grades',
    label: 'Grades & Progress',
    value: 'grades',
    icon: 'GraduationCap',
  },
  {
    href: '/student/analytics',
    label: 'Analytics',
    value: 'analytics',
    icon: 'LineChart',
  },
  {
    href: '/student/certificates',
    label: 'Certificates',
    value: 'certificates',
    icon: 'Award',
  },
  {
    href: '/student/ai-tools',
    label: 'AI Tools',
    value: 'ai-tools',
    icon: 'Brain',
  },
  {
    href: '/student/messages',
    label: 'Messages',
    value: 'messages',
    icon: 'MessageSquare',
  },
  {
    href: '/student/community',
    label: 'Community',
    value: 'community',
    icon: 'Users',
  },
];

export const studentCustomizeNavItems: NavItem[] = [
  {
    href: '/student/integrations',
    label: 'Integrations',
    value: 'integrations',
    icon: 'Workflow',
  },
  {
    href: '/student/personalization',
    label: 'Personalization',
    value: 'personalization',
    icon: 'Palette',
  },
];
