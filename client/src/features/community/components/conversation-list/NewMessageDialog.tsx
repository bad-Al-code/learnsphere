'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getInitials } from '@/lib/utils';
import { MessageSquarePlus, Search } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useCreateConversation } from '../../hooks/useCreateConversation';
import { useUserSearch } from '../../hooks/useUserSearch';
import { Conversation, UserSearchResult } from '../../types';

interface NewMessageDialogProps {
  onConversationCreated: (conversation: Conversation) => void;
}

export function NewMessageDialog({
  onConversationCreated,
}: NewMessageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const { data, isLoading, isError } = useUserSearch(debouncedSearchTerm);

  const createConversationMutation = useCreateConversation(
    (newConversation) => {
      onConversationCreated(newConversation);
      setIsOpen(false);
    }
  );

  const handleUserSelect = (user: UserSearchResult) => {
    createConversationMutation.mutate(user.userId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <MessageSquarePlus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>New Message</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new conversation</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search for a user to message..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
          {isLoading && <p>Searching...</p>}
          {isError && (
            <p className="text-destructive">Failed to search users.</p>
          )}
          {data?.results.map((user: UserSearchResult) => (
            <div
              key={user.userId}
              onClick={() => handleUserSelect(user)}
              className="hover:bg-muted flex cursor-pointer items-center gap-3 rounded-md p-2"
            >
              <Avatar>
                <AvatarImage src={user.avatarUrls?.small} />
                <AvatarFallback>
                  {getInitials(`${user.firstName} ${user.lastName}`)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-muted-foreground text-sm">
                  {user.headline || 'No headline'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
