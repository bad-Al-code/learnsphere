'use client';

import { PaginationControls } from '@/components/shared/pagination-controls';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Resource } from '@/lib/schemas/course';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { AddResourceModal } from './course-modal';
import { ResourcesList } from './resource-list';

interface ResourceDataClientProps {
  courseId: string;
  initialResources: Resource[];
  pagination: { totalPages: number };
}

export default function ResourceDataClient({
  courseId,
  initialResources,
  pagination,
}: ResourceDataClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Resources</CardTitle>
          <CardDescription>
            Manage downloadable materials and external links for students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResourcesList
            initialResources={initialResources}
            courseId={courseId}
          />
        </CardContent>
      </Card>

      <PaginationControls totalPages={pagination.totalPages} />

      <AddResourceModal
        courseId={courseId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
