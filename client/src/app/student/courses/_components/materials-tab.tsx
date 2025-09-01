'use client';

import {
  RichTextEditor,
  RichTextEditorSkeleton,
} from '@/components/text-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Archive,
  Bookmark,
  Cog,
  Download,
  FileText,
  Filter,
  Headphones,
  MonitorPlay,
  Presentation,
  Save,
  Search,
  Upload,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

type TMaterialType = 'PDF' | 'Video' | 'Presentation' | 'Audio';

type TMaterial = {
  id: string;
  title: string;
  course: string;
  type: TMaterialType;
  size: string;
  downloads: number;
};

type TNote = {
  id: string;
  title: string;
  coursePath: string;
  contentSnippet: string;
  tags: string[];
};

const materialsData: TMaterial[] = [
  {
    id: '1',
    title: 'React Hooks Cheat Sheet',
    course: 'React Fundamentals',
    type: 'PDF',
    size: '2.4 MB',
    downloads: 45,
  },
  {
    id: '2',
    title: 'Component Lifecycle Video',
    course: 'React Fundamentals',
    type: 'Video',
    size: '125 MB',
    downloads: 32,
  },
  {
    id: '3',
    title: 'Database Design Slides',
    course: 'Database Design',
    type: 'Presentation',
    size: '8.7 MB',
    downloads: 28,
  },
  {
    id: '4',
    title: 'SQL Practice Audio',
    course: 'Database Design',
    type: 'Audio',
    size: '45 MB',
    downloads: 16,
  },
];

const notesData: TNote[] = [
  {
    id: '1',
    title: 'React Hooks Best Practices',
    coursePath: 'React Fundamentals > Advanced Hooks',
    contentSnippet: 'Key takeaways from the useCallback and useMemo lessons...',
    tags: ['hooks', 'performance', 'optimization'],
  },
  {
    id: '2',
    title: 'Database Normalization Rules',
    coursePath: 'Database Design > Normalization',
    contentSnippet: '1NF, 2NF, 3NF rules and practical examples...',
    tags: ['normalization', 'database', 'theory'],
  },
];

const materialIcons: Record<TMaterialType, LucideIcon> = {
  PDF: FileText,
  Video: MonitorPlay,
  Presentation: Presentation,
  Audio: Headphones,
};

export function MaterialsHeader() {
  return (
    <header className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">Study Materials</h2>
          <p className="text-muted-foreground">
            Access course resources, notes, and downloads
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Desktop buttons */}
          <Button variant="outline" className="hidden sm:flex">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button variant="outline" className="hidden sm:flex">
            <Archive className="h-4 w-4" />
            Archive
          </Button>

          {/* Mobile icon buttons */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <Archive className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Archive</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        {/* Desktop View */}
        <div className="hidden flex-grow items-center gap-2 sm:flex">
          <div className="relative w-full flex-grow">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input placeholder="Search materials..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDFs</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile View */}
        <div className="flex w-full items-center gap-2 sm:hidden">
          <div className="relative flex-grow">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input placeholder="Search materials..." className="pl-9" />
          </div>

          <Select>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectTrigger className="">
                    <Filter className="h-4 w-4" />
                  </SelectTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter by Type</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDFs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}

export function MaterialCard({ material }: { material: TMaterial }) {
  const Icon = materialIcons[material.type];
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-start gap-2">
          <Icon className="text-muted-foreground mt-1 h-6 w-6 flex-shrink-0" />
          <div className="w-full">
            <h3 className="font-semibold">{material.title}</h3>
            <p className="text-muted-foreground text-sm">{material.course}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              {material.type} • {material.size} • {material.downloads} downloads
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex items-center gap-2">
        <Button variant="outline" size="icon" className="flex-grow">
          <Download className="h-4 w-4" />
          Download
        </Button>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bookmark</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}

export function NoteEditor() {
  const [editorContent, setEditorContent] = useState('');

  const handleContentChange = (newContent: string) => {
    setEditorContent(newContent);
  };
  return (
    <div className="space-y-2">
      <RichTextEditor
        initialContent="Add a new note..."
        onChange={handleContentChange}
      />

      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <Select defaultValue="react">
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React Fundamentals</SelectItem>
            <SelectItem value="db">Database Design</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Tags (comma separated)" className="flex-grow" />
        <Button className="w-full sm:w-auto">
          <Save className="h-4 w-4" />
          Save Note
        </Button>
      </div>
    </div>
  );
}

export function SavedNote({ note }: { note: TNote }) {
  return (
    <Card className="">
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold">{note.title}</h4>
            <p className="text-muted-foreground text-xs">{note.coursePath}</p>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Cog className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <p className="my-2 text-sm">{note.contentSnippet}</p>
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function MyNotesSection() {
  return (
    <Card className="">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-bold">My Study Notes</h2>
        </CardTitle>
        <CardDescription>
          <p className="text-muted-foreground -mt-2">
            Personal notes and bookmarks from your courses
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <NoteEditor />
        <div className="space-y-2">
          {notesData.map((note) => (
            <SavedNote key={note.id} note={note} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function MaterialsHeaderSkeleton() {
  return (
    <header className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Desktop buttons */}
          <Skeleton className="hidden h-9 w-20 sm:block" />
          <Skeleton className="hidden h-9 w-20 sm:block" />
          <Skeleton className="h-9 w-9 rounded-md sm:hidden" /> {/* Upload */}
          <Skeleton className="h-9 w-9 rounded-md sm:hidden" /> {/* Archive */}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        {/* Desktop */}
        <div className="hidden flex-grow items-center gap-2 sm:flex">
          <Skeleton className="h-9 flex-grow" /> {/* Search input */}
          <Skeleton className="h-9 w-[120px]" /> {/* Select */}
        </div>

        {/* Mobile */}
        <div className="flex w-full items-center gap-2 sm:hidden">
          <Skeleton className="h-9 flex-grow" /> {/* Search input */}
          <Skeleton className="h-9 w-9 rounded-md" /> {/* Filter icon */}
        </div>
      </div>
    </header>
  );
}

export function MaterialCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start gap-2">
          <Skeleton className="mt-1 h-6 w-6 rounded-full" /> {/* Icon */}
          <div className="w-full space-y-2">
            <Skeleton className="h-5 w-3/4" /> {/* Title */}
            <Skeleton className="h-4 w-1/2" /> {/* Course */}
            <Skeleton className="mt-2 h-3 w-full" /> {/* Meta */}
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex items-center gap-2">
        <Skeleton className="h-9 flex-grow rounded-md" /> {/* Download */}
        <Skeleton className="h-9 w-9 rounded-md" /> {/* Bookmark */}
      </CardFooter>
    </Card>
  );
}

export function NoteEditorSkeleton() {
  return (
    <div className="space-y-2">
      <RichTextEditorSkeleton />

      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <Skeleton className="h-10 w-full sm:w-48" /> {/* Select */}
        <Skeleton className="h-10 flex-grow" /> {/* Tags input */}
        <Skeleton className="h-10 w-full sm:w-32" /> {/* Save button */}
      </div>
    </div>
  );
}

export function SavedNoteSkeleton() {
  return (
    <Card className="">
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-48" /> {/* Title */}
            <Skeleton className="h-3 w-32" /> {/* Course */}
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8 rounded-md" /> {/* Settings */}
            <Skeleton className="h-8 w-8 rounded-md" /> {/* Bookmark */}
          </div>
        </div>
        <Skeleton className="h-4 w-full" /> {/* Content snippet */}
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-16 rounded-md" /> {/* Tag */}
          <Skeleton className="h-5 w-20 rounded-md" /> {/* Tag */}
        </div>
      </CardContent>
    </Card>
  );
}

export function MyNotesSectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" /> {/* FileText Icon */}
          <Skeleton className="h-6 w-40" /> {/* Title */}
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" /> {/* Description */}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <NoteEditorSkeleton />
        <div className="space-y-2">
          <SavedNoteSkeleton />
          <SavedNoteSkeleton />
        </div>
      </CardContent>
    </Card>
  );
}

export function MaterialsTab() {
  return (
    <div className="space-y-2">
      <MaterialsHeader />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {materialsData.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </div>
      <MyNotesSection />
    </div>
  );
}

export function MaterialsTabSkeleton() {
  return (
    <div className="space-y-2">
      <MaterialsHeaderSkeleton />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MaterialCardSkeleton key={i} />
        ))}
      </div>
      <MyNotesSectionSkeleton />
    </div>
  );
}
