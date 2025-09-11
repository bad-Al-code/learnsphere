'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Mic, Plus, Send, Smile } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { getChatAttachmentUploadUrl } from '../../api/media.api';

interface MessageInputProps {
  recipientName: string;
  onSend: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
  conversationId: string;
  senderId: string;
}

export function MessageInput({
  recipientName,
  onSend,
  onTyping,
  conversationId,
  senderId,
}: MessageInputProps) {
  const [messageContent, setMessageContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = (text: string) => {
    setMessageContent(text);
    onTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  const handleSend = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    onTyping(false);

    if (messageContent.trim()) {
      onSend(messageContent);
      setMessageContent('');
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast.info(`Uploading ${file.name}...`);

    try {
      const { signedUrl } = await getChatAttachmentUploadUrl(
        file.name,
        conversationId,
        senderId
      );

      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) throw new Error('Upload failed.');

      toast.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      toast.error('File upload failed.');
      console.error(error);
    }
  };

  return (
    <div className="border-t p-2">
      <div className="relative">
        <Input
          placeholder={`Message ${recipientName}...`}
          className="h-12 border-0 px-2 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={messageContent}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach File</TooltipContent>
          </Tooltip>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />{' '}
          <Button variant="ghost" size="icon">
            <Smile className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Mic className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="default" onClick={handleSend}>
            <Send className="-ml-1 h-4 w-4 rotate-45" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MessageInputSkeleton() {
  return (
    <div className="border-t p-4">
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
