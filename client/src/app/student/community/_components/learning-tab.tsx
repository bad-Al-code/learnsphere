'use client';

import { BookOpen, FolderKanban, Users } from 'lucide-react';
import { ProjectsTab } from './projects-tab';

import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useState } from 'react';
import { MentorshipTab, MentorshipTabSkeleton } from './mentorship-tab';
import { TutoringTab } from './tutoring-tab';

export function LearningTab() {
  const [activeTab, setActiveTab] = useState('mentorship');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="space-y-2">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="mentorship" className="flex-1 md:flex-none">
              <Users className="h-4 w-4" />
              Mentorship
            </TabsTrigger>
            <TabsTrigger value="tutoring" className="flex-1 md:flex-none">
              <BookOpen className="h-4 w-4" />
              Tutoring
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex-1 md:flex-none">
              <FolderKanban className="h-4 w-4" />
              Projects
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="mentorship" className="m-0">
          <MentorshipTab />
        </TabsContent>

        <TabsContent value="tutoring" className="m-0 space-y-3">
          <TutoringTab />
        </TabsContent>

        <TabsContent value="projects" className="m-0">
          <ProjectsTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export function LearningTabSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full md:w-80" />
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
      </div>
      <MentorshipTabSkeleton />
    </div>
  );
}
