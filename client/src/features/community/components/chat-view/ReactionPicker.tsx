'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
}

export function ReactionPicker({ onSelect }: ReactionPickerProps) {
  return (
    <div className="bg-background rounded-xl shadow-lg">
      <Picker
        data={data}
        onEmojiSelect={(emoji: any) => onSelect(emoji.native)}
        previewPosition="none"
        skinTonePosition="none"
        navPosition="none"
      />
    </div>
  );
}
