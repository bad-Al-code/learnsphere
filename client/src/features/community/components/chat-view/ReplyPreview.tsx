'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Message } from '../../types';

interface ReplyPreviewProps {
  message: Message;
  onCancel: () => void;
}

export function ReplyPreview({ message, onCancel }: ReplyPreviewProps) {
  return (
    <div className="bg-muted border-t p-2">
      <div className="bg-background/50 border-primary flex items-start justify-between rounded-md border-l-4 p-2">
        <div className="overflow-hidden">
          <p className="text-primary font-semibold">
            {message.sender?.name || 'User'}
          </p>

          <p className="text-muted-foreground truncate text-sm">
            {message.content}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
