import { formatTime } from '@/lib/utils';
import { ChatInput, ChatInputSkeleton } from './_components/chat-input';
import { ChatMessage, ChatMessageSkeleton } from './_components/chat-message';

export default function TestPage() {
  const currentDate = new Date();
  const currentSeconds = currentDate.getSeconds();
  const timestamp = formatTime(currentSeconds);

  return (
    <div className="flex flex-col gap-2 rounded-xl border-2 p-8 shadow-lg">
      <div className="space-y-4">
        {/* <ConversationList /> */}
        <ChatMessage
          message={{
            author: {
              name: 'Meow',
            },
            content: 'Meow Meow',
            id: '1',
            timestamp: timestamp,
          }}
        />
        <ChatInput />
      </div>

      <ChatMessageSkeleton />
      <ChatInputSkeleton />
      {/* <ConversationListSkeleton /> */}
    </div>
  );
}
