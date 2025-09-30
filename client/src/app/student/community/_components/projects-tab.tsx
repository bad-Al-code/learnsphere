'use client';

import { faker } from '@faker-js/faker';
import {
  Calendar,
  Filter,
  FolderKanban,
  MessageSquare,
  Plus,
  Search,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TTeamMember = { id: string; name: string; role: string; initials: string };
type TProject = {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  lastUpdated: string;
  team: TTeamMember[];
  tags: string[];
};

const createTeam = (count: number): TTeamMember[] =>
  Array.from({ length: count }, () => {
    const name = faker.person.fullName();
    return {
      id: faker.string.uuid(),
      name,
      role: faker.person.jobTitle(),
      initials: name
        .split(' ')
        .map((n) => n[0])
        .join(''),
    };
  });

const projectsData: TProject[] = [
  {
    title: 'E-commerce Platform',
    description:
      'Building a full-stack e-commerce application with React and Node.js',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
  },
  {
    title: 'Machine Learning Classifier',
    description: 'Developing an image classification model using TensorFlow',
    tags: ['Python', 'TensorFlow', 'Jupyter', 'OpenCV'],
  },
].map((p) => ({
  ...p,
  id: faker.string.uuid(),
  progress: faker.number.int({ min: 40, max: 90 }),
  dueDate: faker.date.future({ years: 0.2 }).toISOString().split('T')[0],
  lastUpdated: `Updated ${faker.helpers.arrayElement(['2 hours', '1 day', '3 hours'])} ago`,
  team: createTeam(faker.number.int({ min: 4, max: 5 })),
}));

function ProjectsHeader() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input placeholder="Search projects..." className="pl-9" />
      </div>

      <Select>
        <Tooltip>
          <TooltipTrigger asChild>
            <SelectTrigger className="">
              <div className="md:hidden">
                <Filter className="h-4 w-4" />
              </div>
              <div className="hidden md:flex">
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filter by status</p>
          </TooltipContent>
        </Tooltip>

        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="recruiting">Recruiting</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Create Project</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="md:hidden">
          <p>Create Project</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function ProjectCard({ project }: { project: TProject }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>{project.title}</CardTitle>
          <Badge
            variant="outline"
            className="border-emerald-500 text-emerald-500"
          >
            active
          </Badge>
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-medium">Progress</p>
            <p className="text-muted-foreground text-sm">{project.progress}%</p>
          </div>
          <Progress value={project.progress} />
        </div>
        <div>
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <p className="text-primary flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Due: {project.dueDate}
            </p>
            <p>{project.lastUpdated}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Team Members</p>
          <div className="flex items-center gap-2">
            {project.team.map((member) => (
              <Tooltip key={member.id}>
                <TooltipTrigger>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-muted-foreground">{member.role}</p>
                </TooltipContent>
              </Tooltip>
            ))}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="secondary" className="flex-1">
          <FolderKanban className="h-4 w-4" />
          View Project
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="sm:hidden">Chat</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}

function ProjectsHeaderSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-10 md:w-40" />
      <Skeleton className="h-10 w-10 md:w-36" />
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10 md:w-20" />
      </CardFooter>
    </Card>
  );
}

export function ProjectsTab() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="space-y-2">
        <ProjectsHeader />
        <Separator />
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

export function ProjectsTabSkeleton() {
  return (
    <div className="space-y-2">
      <ProjectsHeaderSkeleton />
      <Separator />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </div>
  );
}
