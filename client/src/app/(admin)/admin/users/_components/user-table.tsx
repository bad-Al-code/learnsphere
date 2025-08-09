'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

type UserSearchResult = {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  status: string;
};

interface UserTableProps {
  users: UserSearchResult[];
  totalPages: number;
}

export function UserTable({ users, totalPages }: UserTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentStatus = searchParams.get('status');

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const performSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearchOnChange = useDebouncedCallback(performSearch, 300);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const term = formData.get('query') as string;
    performSearch(term);
  };

  return (
    <div className="space-y-4">
      {currentStatus && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Filtering by status:</span>
          <Badge variant="secondary">{currentStatus}</Badge>
          <Button asChild variant="link" className="h-auto p-0">
            <Link href="/admin/users">Clear filter</Link>
          </Button>
        </div>
      )}

      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            name="query"
            placeholder="Search by name..."
            onChange={(e) => handleSearchOnChange(e.target.value)}
            defaultValue={searchParams.get('query') || ''}
            className="pl-8"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell className="font-medium">
                  {user.firstName || 'N/A'} {user.lastName || ''}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === 'active' || user.status === 'instructor'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.userId}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(createPageURL(currentPage - 1))}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(createPageURL(currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
