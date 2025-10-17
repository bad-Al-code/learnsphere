'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AssignmentsTab, AssignmentsTabSkeleton } from './assignments-tab';
import { MaterialsTab, MaterialsTabSkeleton } from './materials-tab';

type TModule = {
  id: string;
  title: string;
  progress: number;
  skills: string[];
};

const modulesData: TModule[] = [
  {
    id: '1',
    title: 'Introduction to React',
    progress: 100,
    skills: ['React Basics', 'JSX', 'Components'],
  },
  {
    id: '2',
    title: 'State Management',
    progress: 85,
    skills: ['useState', 'useEffect', 'Context'],
  },
  {
    id: '3',
    title: 'Component Lifecycle',
    progress: 70,
    skills: ['Mounting', 'Updating', 'Unmounting'],
  },
  {
    id: '4',
    title: 'Advanced Hooks',
    progress: 45,
    skills: ['useCallback', 'useMemo', 'Custom Hooks'],
  },
];

export function ModuleCard({ module }: { module: TModule }) {
  return (
    <Card className="">
      <CardHeader className="">
        <CardTitle className="text-lg">{module.title}</CardTitle>
        <CardAction>
          <Badge variant={module.progress === 100 ? 'default' : 'secondary'}>
            {module.progress}% Complete
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-2">
        <Progress value={module.progress} className="h-2" />

        <h4 className="text-sm font-semibold">Skills Covered:</h4>
        <div className="flex flex-wrap gap-1">
          {module.skills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant={module.progress === 100 ? 'outline' : 'default'}
          className="mt-6 w-full"
        >
          {module.progress === 100 ? 'Review Module' : 'Continue Learning'}
        </Button>
      </CardFooter>
    </Card>
  );
}

function ModulesSection() {
  return (
    <section>
      <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Course Modules</h2>
          <p className="text-muted-foreground">
            Track your progress through each module
          </p>
        </div>
        <Select defaultValue="react-fundamentals">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react-fundamentals">
              React Fundamentals
            </SelectItem>
            <SelectItem value="database-design">Database Design</SelectItem>
            <SelectItem value="python-programming">
              Python Programming
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {modulesData.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    </section>
  );
}

export function ModuleCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col justify-between">
        <div>
          <Skeleton className="mb-4 h-2 w-full" />
          <Skeleton className="mb-2 h-4 w-28" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <Skeleton className="mt-6 h-10 w-full" />
      </CardContent>
    </Card>
  );
}

function ModulesSectionSkeleton() {
  return (
    <section>
      <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-full sm:w-[180px]" />
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <ModuleCardSkeleton />
        <ModuleCardSkeleton />
        <ModuleCardSkeleton />
        <ModuleCardSkeleton />
      </div>
    </section>
  );
}

export function ModulesTab() {
  return (
    <div className="space-y-2">
      <ModulesSection />
      <AssignmentsTab />
      <MaterialsTab />
    </div>
  );
}

export function ModulesTabSkeleton() {
  return (
    <div className="">
      <ModulesSectionSkeleton />
      <AssignmentsTabSkeleton />
      <MaterialsTabSkeleton />
    </div>
  );
}
