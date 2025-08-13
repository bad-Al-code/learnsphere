'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
  totalPages: number;
}

export function PaginationControls({ totalPages }: PaginationControlsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-0">
      <Button
        asChild={currentPage > 1}
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
      >
        {currentPage > 1 ? (
          <Link href={createPageURL(currentPage - 1)}>Previous</Link>
        ) : (
          <>Previous</>
        )}
      </Button>

      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        asChild={currentPage < totalPages}
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={createPageURL(currentPage + 1)}>Next</Link>
        ) : (
          <>Next</>
        )}
      </Button>
    </div>
  );
}
