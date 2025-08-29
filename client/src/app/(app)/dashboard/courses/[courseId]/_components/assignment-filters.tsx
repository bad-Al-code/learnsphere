'use client';

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

type ModuleOption = { label: string; value: string };

interface AssignmentFiltersProps {
  moduleOptions: ModuleOption[];
}

export function AssignmentFilters({ moduleOptions }: AssignmentFiltersProps) {
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
    const newUrl = `${pathname}?${params.toString()}`;
    // Using router.push to trigger re-render of the Server Component
    router.push(newUrl);
  };

  const handleSearchOnChange = useDebouncedCallback((term: string) => {
    handleFilterChange('q', term);
  }, 500);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full gap-2 sm:max-w-md">
        <div className="relative flex-grow">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search assignments..."
            onChange={(e) => handleSearchOnChange(e.target.value)}
            defaultValue={searchParams.get('q') || ''}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Select
          onValueChange={(value) => handleFilterChange('status', value)}
          defaultValue={searchParams.get('status') || 'all'}
        >
          <SelectTrigger className="w-auto min-w-[140px] justify-between">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => handleFilterChange('moduleId', value)}
          defaultValue={searchParams.get('moduleId') || 'all'}
        >
          <SelectTrigger className="w-auto min-w-[160px] justify-between">
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {moduleOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
