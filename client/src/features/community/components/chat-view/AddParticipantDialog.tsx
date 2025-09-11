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
import { getInitials } from '@/lib/utils';
import { Search, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useUserSearch } from '../../hooks/useUserSearch';
import { UserSearchResult } from '../../types';
import { SearchSkeleton } from '../common/SearchSkeleton';

interface AddParticipantDialogProps {
  onAddParticipant: (userId: string) => void;
  existingParticipantIds: string[];
}

export function AddParticipantDialog({
  onAddParticipant,
  existingParticipantIds,
}: AddParticipantDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const { data, isLoading } = useUserSearch(debouncedSearchTerm);

  const handleSelect = (user: UserSearchResult) => {
    onAddParticipant(user.userId);
    setIsOpen(false);
  };

  const filteredResults = data?.results.filter(
    (user) => !existingParticipantIds.includes(user.userId)
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search for a user..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
          {isLoading && <SearchSkeleton />}

          {filteredResults?.map((user) => (
            <div
              key={user.userId}
              onClick={() => handleSelect(user)}
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
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
