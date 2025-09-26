import { ChatInterface } from '@/features/community';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages',
};

export default function MessagesPage() {
  return (
    <div className="my-0">
      <ChatInterface />
      {/* <MessagesSkeleton /> */}
    </div>
  );
}
