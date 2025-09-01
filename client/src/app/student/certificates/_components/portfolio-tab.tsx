'use client';

import { faker } from '@faker-js/faker';
import { Copy, ExternalLink, Eye, Plus, Share2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TProject = {
  id: string;
  title: string;
  tags: string[];
  isFeatured: boolean;
};

const createProject = (isFeatured: boolean): TProject => ({
  id: faker.string.uuid(),
  title: faker.lorem
    .words({ min: 2, max: 4 })
    .replace(/\b\w/g, (l) => l.toUpperCase()),
  tags: faker.helpers.arrayElements(
    [
      'React',
      'Node.js',
      'MongoDB',
      'Vue.js',
      'Express',
      'PostgreSQL',
      'JavaScript',
      'CSS',
    ],
    { min: 2, max: 3 }
  ),
  isFeatured,
});

const projectsData: TProject[] = [
  createProject(true),
  createProject(false),
  createProject(true),
];

function PublicPortfolioToggle() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold">Public Portfolio</h3>
        <p className="text-muted-foreground text-sm">
          Make your portfolio visible to recruiters
        </p>
      </div>
      <Switch />
    </div>
  );
}

function ProjectItem({ project }: { project: TProject }) {
  return (
    <Card>
      <CardContent className="">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold">{project.title}</h4>
          {project.isFeatured && <Badge variant="outline">Featured</Badge>}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" /> Live Demo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FeaturedProjects() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Featured Projects</h3>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" /> Add Project
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {projectsData.map((p) => (
          <ProjectItem key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}

function PortfolioUrl() {
  return (
    <div>
      <h3 className="font-semibold">Portfolio URL</h3>
      <div className="relative mt-2">
        <Input
          readOnly
          defaultValue="https://portfolio.LearnSphere.com/your-username"
          className="pr-20"
        />
        <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy URL</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export function PortfolioTabSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
        <Separator />
        <div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
        <Separator />
        <div>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-2 h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PortfolioTab() {
  return (
    <TooltipProvider delayDuration={0}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            <CardTitle>Portfolio Showcase</CardTitle>
          </div>
          <CardDescription>
            Curate and share your best work with potential employers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <PublicPortfolioToggle />
          <Separator />
          <FeaturedProjects />
          <Separator />
          <PortfolioUrl />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
