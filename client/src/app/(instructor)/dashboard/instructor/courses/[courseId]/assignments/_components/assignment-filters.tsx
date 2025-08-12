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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

type ModuleOption = { label: string; value: string };

interface AssignmentFiltersProps {
  moduleOptions: ModuleOption[];
}

export function AssignmentFilters({ moduleOptions }: AssignmentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  const handleSearchSubmit = () => {
    handleFilterChange('q', searchTerm);
  };

  return (
    <div className="mb-4 flex flex-col gap-4">
      <div className="flex w-full gap-2 sm:max-w-md">
        <Input
          placeholder="Search assignments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchSubmit();
          }}
        />
        <Button onClick={handleSearchSubmit}>Search</Button>
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
