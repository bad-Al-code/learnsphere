'use client';

import { PaginationControls } from '@/components/shared/pagination-controls';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
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
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <CardTitle>Course Resources</CardTitle>
          <CardDescription>
            Manage downloadable materials and external links for students.
          </CardDescription>
          <CardAction>
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="h-4 w-4" />
              Add Resource
            </Button>
          </CardAction>
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
