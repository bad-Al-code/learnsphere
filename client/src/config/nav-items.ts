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
    href: '/student/courses',
    label: 'My Courses',
    value: 'courses',
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

export const studentDashboardTabs: NavItem[] = [
  {
    href: '/student?tab=summary',
    label: 'Summary',
    value: 'summary',
    icon: 'LayoutGrid',
  },
  {
    href: '/student?tab=leaderboard',
    label: 'Leaderboard',
    value: 'leaderboard',
    icon: 'Trophy',
  },
  {
    href: '/student?tab=insights',
    label: 'Insights',
    value: 'insights',
    icon: 'Lightbulb',
  },
  {
    href: '/student?tab=notifications',
    label: 'Notifications',
    value: 'notifications',
    icon: 'Bell',
  },
  {
    href: '/student?tab=activity',
    label: 'Activity',
    value: 'activity',
    icon: 'Activity',
  },
];

export const studentCoursesTabs: NavItem[] = [
  { href: '#', label: 'Enrolled', value: 'enrolled', icon: 'BookOpenCheck' },
  { href: '#', label: 'Completed', value: 'completed', icon: 'CheckCircle' },
  { href: '#', label: 'Recommended', value: 'recommended', icon: 'Sparkles' },
  { href: '#', label: 'Modules', value: 'modules', icon: 'LayoutTemplate' },
  { href: '#', label: 'Assignments', value: 'assignments', icon: 'FileText' },
  { href: '#', label: 'Analytics', value: 'analytics', icon: 'LineChart' },
  { href: '#', label: 'Comparison', value: 'comparison', icon: 'BarChart2' },
  { href: '#', label: 'Materials', value: 'materials', icon: 'Folder' },
  { href: '#', label: 'Study Groups', value: 'study-groups', icon: 'Users' },
  {
    href: '#',
    label: 'Learning Path',
    value: 'learning-path',
    icon: 'Milestone',
  },
];

export const studentAssignmentsTabs: NavItem[] = [
  { href: '#', label: 'Upcoming', value: 'upcoming', icon: 'CalendarClock' },
  { href: '#', label: 'Submitted', value: 'submitted', icon: 'UploadCloud' },
  { href: '#', label: 'Drafts', value: 'drafts', icon: 'Save' },
  // { href: '#', label: 'AI Review', value: 'ai-review', icon: 'Bot' },
  { href: '#', label: 'Peer Review', value: 'peer-review', icon: 'Users' },
  { href: '#', label: 'Templates', value: 'templates', icon: 'ClipboardList' },
  {
    href: '#',
    label: 'Collaborative',
    value: 'collaborative',
    icon: 'Workflow',
  },
  { href: '#', label: 'Portfolio', value: 'portfolio', icon: 'Briefcase' },
  { href: '#', label: 'Analytics', value: 'analytics', icon: 'BarChart2' },
];

export const studentGradesTabs: NavItem[] = [
  { href: '#', label: 'Grades', value: 'grades', icon: 'Award' },
  { href: '#', label: 'Progress', value: 'progress', icon: 'TrendingUp' },
  // { href: '#', label: 'Comparison', value: 'comparison', icon: 'Users' },
  // { href: '#', label: 'Study Habits', value: 'study-habits', icon: 'BookOpen' },
  // { href: '#', label: 'AI Insights', value: 'ai-insights', icon: 'Lightbulb' },
  // { href: '#', label: 'Reports', value: 'reports', icon: 'FileBarChart' },
  { href: '#', label: 'Goals', value: 'goals', icon: 'Target' },
];

export const studentAnalyticsTabs: NavItem[] = [
  { href: '#', label: 'Performance', value: 'performance', icon: 'TrendingUp' },
  {
    href: '#',
    label: 'Engagement',
    value: 'engagement',
    icon: 'HeartHandshake',
  },
  { href: '#', label: 'AI Insights', value: 'ai-insights', icon: 'Lightbulb' },
];

export const studentCertificatesTabs: NavItem[] = [
  { href: '#', label: 'Certificates', value: 'certificates', icon: 'Award' },
  { href: '#', label: 'In Progress', value: 'in-progress', icon: 'Loader' },
  { href: '#', label: 'Achievements', value: 'achievements', icon: 'Trophy' },
  // {
  //   href: '#',
  //   label: 'Digital Badges',
  //   value: 'digital-badges',
  //   icon: 'Badge',
  // },
  // { href: '#', label: 'Portfolio', value: 'portfolio', icon: 'Briefcase' },
];

export const studentAiToolsTabs: NavItem[] = [
  { href: '#', label: 'AI Tutor', value: 'ai-tutor', icon: 'Bot' },
  { href: '#', label: 'Smart Notes', value: 'smart-notes', icon: 'FileText' },
  {
    href: '#',
    label: 'Writing Assistant',
    value: 'writing-assistant',
    icon: 'Pencil',
  },
  {
    href: '#',
    label: 'Flashcards',
    value: 'flashcards',
    icon: 'ClipboardList',
  },
  { href: '#', label: 'Voice Tutor', value: 'voice-tutor', icon: 'Mic' },
  { href: '#', label: 'Research', value: 'research', icon: 'Search' },
  { href: '#', label: 'Quiz', value: 'quiz', icon: 'HelpCircle' },
];

export const studentCommunityTabs: NavItem[] = [
  { href: '#', label: 'Chat', value: 'chat', icon: 'MessageSquare' },
  { href: '#', label: 'Study Rooms', value: 'study-rooms', icon: 'School' },
  { href: '#', label: 'Events', value: 'events', icon: 'Calendar' },
  {
    href: '#',
    label: 'Learning',
    value: 'learning',
    icon: 'GraduationCap',
  },
];

export const studentIntegrationsTabs: NavItem[] = [
  { href: '#', label: 'All Integrations', value: 'all', icon: 'Combine' },
  { href: '#', label: 'Connected', value: 'connected', icon: 'Link' },
  { href: '#', label: 'Available', value: 'available', icon: 'PlusCircle' },
];

export const studentPersonalizationTabs: NavItem[] = [
  { href: '#', label: 'Themes', value: 'themes', icon: 'Palette' },
  { href: '#', label: 'Layout', value: 'layout', icon: 'LayoutTemplate' },
  {
    href: '#',
    label: 'Preferences',
    value: 'preferences',
    icon: 'SlidersHorizontal',
  },
  {
    href: '#',
    label: 'Accessibility',
    value: 'accessibility',
    icon: 'Accessibility',
  },
];
