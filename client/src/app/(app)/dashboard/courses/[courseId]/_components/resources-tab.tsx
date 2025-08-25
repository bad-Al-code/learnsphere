'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Download,
  FileText,
  Link as LinkIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { AddResourceForm, FormDialog } from './course-modal';

type ResourceType = 'PDF' | 'Link' | 'Video' | 'Document';

interface Resource {
  name: string;
  type: ResourceType;
  downloads: number;
  added: string;
}

interface ResourcesTabProps {
  data?: Resource[];
}

const placeholderData: Resource[] = [
  {
    name: 'Syllabus_Fall_2024.pdf',
    type: 'PDF',
    downloads: 128,
    added: 'July 1, 2024',
  },
  {
    name: 'Introductory Video',
    type: 'Video',
    downloads: 256,
    added: 'July 2, 2024',
  },
  {
    name: 'External Reading: Chapter 1',
    type: 'Link',
    downloads: 98,
    added: 'July 5, 2024',
  },
  {
    name: 'Lecture_Notes_Week_1.docx',
    type: 'Document',
    downloads: 150,
    added: 'July 8, 2024',
  },
];

export function ResourcesTab({ data = placeholderData }: ResourcesTabProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">Course Resources</h2>
          <p className="text-muted-foreground">
            Manage downloadable materials and external links for students
          </p>
        </div>

        <FormDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              Add Resource
            </Button>
          }
          title="Add New Resource"
          description="Upload a file or add a link for students to access"
          form={<AddResourceForm />}
          footer={<Button>Add Resource</Button>}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Resources</CardTitle>
          <CardDescription>
            Files, links, and materials for student reference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((resource) => (
                  <TableRow key={resource.name}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {resource.type === 'Link' ? (
                          <LinkIcon className="text-muted-foreground h-4 w-4" />
                        ) : (
                          <FileText className="text-muted-foreground h-4 w-4" />
                        )}
                        {resource.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{resource.type}</Badge>
                    </TableCell>
                    <TableCell>{resource.downloads.toLocaleString()}</TableCell>
                    <TableCell>{resource.added}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="stroke-destructive h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <h3 className="font-semibold">No resources added yet.</h3>
                    <p className="text-muted-foreground">
                      Click "Add Resource" to upload your first file or link.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function ResourcesTabSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-32" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
