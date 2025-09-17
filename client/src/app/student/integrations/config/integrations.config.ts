import { Calendar, Cloud, FileText, Mail, Slack } from 'lucide-react';
import React from 'react';

export type IntegrationProvider =
  | 'google_calendar'
  | 'outlook_calendar'
  | 'gmail'
  | 'google_drive'
  | 'dropbox'
  | 'canvas_lms'
  | 'blackboard_learn'
  | 'moodle'
  | 'slack'
  | 'notion';

export interface IntegrationDetails {
  provider: IntegrationProvider;
  name: string;
  icon: React.ElementType;
  description: string;
}

export const allIntegrations: IntegrationDetails[] = [
  {
    provider: 'google_calendar',
    name: 'Google Calendar',
    icon: Calendar,
    description:
      'Sync assignments and study sessions with your Google Calendar.',
  },
  {
    provider: 'outlook_calendar',
    name: 'Outlook Calendar',
    icon: Calendar,
    description: 'Integrate with Microsoft Outlook for seamless scheduling.',
  },
  {
    provider: 'gmail',
    name: 'Gmail',
    icon: Mail,
    description: 'Receive assignment notifications and updates via email.',
  },
  {
    provider: 'google_drive',
    name: 'Google Drive',
    icon: Cloud,
    description: 'Store and access your assignments and course materials.',
  },
  {
    provider: 'dropbox',
    name: 'Dropbox',
    icon: Cloud,
    description: 'Sync files and collaborate on projects.',
  },
  {
    provider: 'slack',
    name: 'Slack',
    icon: Slack,
    description: 'Get study group notifications and updates.',
  },
  {
    provider: 'notion',
    name: 'Notion',
    icon: FileText,
    description: 'Sync notes and study materials with Notion.',
  },
];

export const categories = {
  'Calendar & Scheduling': allIntegrations.filter((i) =>
    i.provider.includes('calendar')
  ),
  'Email & Notifications': allIntegrations.filter((i) =>
    i.provider.includes('gmail')
  ),
  'Cloud Storage': allIntegrations.filter(
    (i) => i.provider.includes('drive') || i.provider.includes('dropbox')
  ),
  Communication: allIntegrations.filter((i) => i.provider.includes('slack')),
  'Productivity Tools': allIntegrations.filter((i) =>
    i.provider.includes('notion')
  ),
};
