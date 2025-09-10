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
import { Search, Users, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { useCreateGroupConversation } from '../../hooks/useCreateGroupConversation';
import { useUserSearch } from '../../hooks/useUserSearch';
import { Conversation, UserSearchResult } from '../../types';

interface NewGroupDialogProps {
  onConversationCreated: (conversation: Conversation) => void;
}

export function NewGroupDialog({ onConversationCreated }: NewGroupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([]);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const { data, isLoading } = useUserSearch(debouncedSearchTerm);

  const createGroupMutation = useCreateGroupConversation((newConversation) => {
    onConversationCreated(newConversation);
    setIsOpen(false);
  });

  const handleUserSelect = (user: UserSearchResult) => {
    if (!selectedUsers.some((su) => su.userId === user.userId)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
    setSearchTerm('');
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.userId !== userId));
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast.error('Please provide a group name.');
      return;
    }
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one other member.');
      return;
    }
    const participantIds = selectedUsers.map((u) => u.userId);
    createGroupMutation.mutate({ name: groupName, participantIds });
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setSearchTerm('');
      setSelectedUsers([]);
      setGroupName('');
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Users className="h-5 w-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>New Group</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new group</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm font-medium">Group Name</label>
          <Input
            placeholder="Enter Group Name..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 rounded-md border p-2">
            {selectedUsers.map((user) => (
              <div
                key={user.userId}
                className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-sm"
              >
                <span>{user.firstName}</span>
                <button
                  onClick={() => handleUserRemove(user.userId)}
                  className="hover:bg-muted-foreground/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search to add people..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
          {isLoading && <p>Searching...</p>}
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
        <Button
          onClick={handleCreateGroup}
          disabled={createGroupMutation.isPending}
        >
          {createGroupMutation.isPending ? 'Creating...' : 'Create Group Chat'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
