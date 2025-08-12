'use client';

import { File, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type Resource = {
  id: string;
  title: string;
  fileUrl: string;
};

interface ResourcesManagerProps {
  initialResources: Resource[];
  courseId: string;
}

export function ResourcesManager({
  initialResources,
  courseId,
}: ResourcesManagerProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resources, setResources] = useState(initialResources);

  const onResourceCreated = (newResource: Resource) => {
    setResources((prev) => [...prev, newResource]);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Course Resources</h3>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </div>

      {resources.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No resources have been added yet.
        </p>
      ) : (
        <div className="space-y-2">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex w-full items-center rounded-md border p-3"
            >
              <File className="mr-2 h-4 w-4 flex-shrink-0" />
              <p className="line-clamp-1 flex-grow text-xs font-medium">
                {resource.title}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="p-4 text-center">Add Resource Modal placeholder</p>
    </div>
  );
}
