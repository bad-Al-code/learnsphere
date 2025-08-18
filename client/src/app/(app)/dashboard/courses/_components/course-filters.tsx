'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function CourseFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchOnChange = useDebouncedCallback((term: string) => {
    handleFilterChange('query', term);
  }, 500);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-grow">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

        <Input
          placeholder="Search courses..."
          onChange={(e) => handleSearchOnChange(e.target.value)}
          defaultValue={searchParams.get('query') || ''}
          className="pl-9"
        />
      </div>

      <Select
        defaultValue={searchParams.get('status') || 'all'}
        onValueChange={(value) => handleFilterChange('status', value)}
      >
        <SelectTrigger className="w-full md:w-[150px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        onClick={() => router.push(pathname)}
        className="hidden md:inline-flex"
      >
        Clear Filters
      </Button>
    </div>
  );
}
