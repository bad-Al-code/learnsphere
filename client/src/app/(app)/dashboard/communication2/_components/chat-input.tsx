'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ImagePlay, Paperclip, PlusCircle, Smile } from 'lucide-react';

export function ChatInput() {
  return (
    <div className="p-2 md:p-4">
      <div className="bg-muted relative rounded-lg">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-2 h-7 w-7 -translate-y-1/2 md:left-3 md:h-8 md:w-8"
        >
          <PlusCircle className="text-muted-foreground h-5 w-5" />
        </Button>
        <Textarea
          placeholder="Message #General"
          className="h-10 max-h-96 resize-none justify-center border-none bg-transparent py-2 pr-24 pl-10 shadow-none focus-visible:ring-0 md:pr-28 md:pl-12"
          rows={1}
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-0.5 md:right-3 md:gap-1">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 md:h-8 md:w-8"
                >
                  <ImagePlay className="text-muted-foreground h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>GIF</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 md:h-8 md:w-8"
                >
                  <Paperclip className="text-muted-foreground h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach File</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 md:h-8 md:w-8"
                >
                  <Smile className="text-muted-foreground h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Emoji</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export function ChatInputSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}
