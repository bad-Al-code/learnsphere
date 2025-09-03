'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Resource } from '@/lib/schemas/course';
import { formatBytes } from '@/lib/utils';
import { Eye, EyeOff, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

interface ResourcesListProps {
  initialResources: Resource[];
  courseId: string;
}

export function ResourcesList({
  initialResources,
  courseId,
}: ResourcesListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialResources.length > 0 ? (
            initialResources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">{resource.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {resource.fileName}
                </TableCell>
                <TableCell>{formatBytes(resource.fileSize)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      resource.status === 'published' ? 'default' : 'secondary'
                    }
                  >
                    {resource.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        {resource.status === 'published' ? (
                          <>
                            <EyeOff className="h-4 w-4" /> Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" /> Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive hover:!text-destructive focus:!text-destructive">
                        <Trash2 className="text-destructive h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No resources found for this course.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
