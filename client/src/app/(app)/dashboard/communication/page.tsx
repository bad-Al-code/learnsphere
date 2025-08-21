'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Mail, Megaphone, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AnnouncementsPage,
  AnnouncementsPageSkeleton,
} from './announcements/announcement-page';
import { ComposePage, ComposePageSkeleton } from './compose/compose-page';
import { MessagesPage, MessagesPageSkeleton } from './messages/mesage-page';

function TemplatesPage() {
  return <div className="p-4">Templates Page Content</div>;
}

export default function CommunicationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const renderSkeleton = () => {
    switch (activeTab) {
      case 'messages':
        return <MessagesPageSkeleton />;
      case 'announcements':
        return <AnnouncementsPageSkeleton />;
      case 'compose':
        return <ComposePageSkeleton />;
      default:
        return <AnnouncementsPageSkeleton />;
    }
  };

  return (
    <div className="">
      <Tabs defaultValue="messages" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages">
            <Mail className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="compose">
            <Pencil className="h-4 w-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <Megaphone className="h-4 w-4" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <div className="">
          {isLoading ? (
            renderSkeleton()
          ) : (
            <>
              <TabsContent value="messages">
                <MessagesPage />
              </TabsContent>
              <TabsContent value="compose">
                <ComposePage />
              </TabsContent>
              <TabsContent value="announcements">
                <AnnouncementsPage />
              </TabsContent>
              <TabsContent value="templates">
                <TemplatesPage />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}
