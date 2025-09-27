import { Skeleton } from '@/components/ui/skeleton';
import { studentCommunityTabs } from '@/config/nav-items';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { ChatTabSkeleton } from './_components/chat-tab';
import { CommunityTabs } from './_components/community-tabs';

interface Props {
  searchParams: { tab?: string; courseId?: string };
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const tab = searchParams.tab || 'Chat';

  const titles: Record<string, string> = {
    chat: 'Chats',
    'study-rooms': 'Study Rooms',
    projects: 'Projects',
    tutoring: 'Tutoring',
    events: 'Events',
    mentorship: 'Mentorship',
    leaderboard: 'Leaderboard',
    discussions: 'Discussions',
  };

  return {
    title: titles[tab] ?? 'Chat',
  };
}

export default function CommunityPage({ searchParams }: Props) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Community"
        description="Connect with classmates, instructors, and get AI assistance"
      />

      <Suspense fallback={<CommunityPageSkeleton />}>
        <CommunityTabs courseId={searchParams.courseId} />
      </Suspense>
    </div>
  );
}

function CommunityPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: studentCommunityTabs.length }).map(
            (_, index) => (
              <Skeleton key={index} className="h-10 flex-1" />
            )
          )}
        </div>
        <ChatTabSkeleton />
      </div>
    </div>
  );
}
