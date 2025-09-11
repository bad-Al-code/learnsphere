'use client';

import { Button } from '@/components/ui/button';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
}

export function ReactionPicker({ onSelect }: ReactionPickerProps) {
  return (
    <div className="bg-secondary flex gap-1 rounded-full p-1 dark:bg-black/70">
      {EMOJIS.map((emoji) => (
        <Button
          key={emoji}
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-black/20"
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
}
