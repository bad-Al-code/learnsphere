'use client';

import { faker } from '@faker-js/faker';
import { CheckCircle, Trophy } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

type TRequirement = {
  id: string;
  label: string;
  completed: boolean;
};

type TLearningPath = {
  id: string;
  title: string;
  completionDate: string;
  progress: number;
  requirements: TRequirement[];
};

const createRequirements = (
  count: number,
  completedCount: number
): TRequirement[] =>
  Array.from({ length: count }, (_, i) => ({
    id: faker.string.uuid(),
    label: faker.lorem
      .words({ min: 2, max: 4 })
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    completed: i < completedCount,
  }));

const learningPathsData: TLearningPath[] = [
  {
    id: '1',
    title: 'Advanced React Development',
    completionDate: '4/15/2024',
    progress: 75,
    requirements: createRequirements(4, 2),
  },
  {
    id: '2',
    title: 'Node.js Backend Development',
    completionDate: '5/20/2024',
    progress: 45,
    requirements: createRequirements(4, 1),
  },
];

function LearningPathCard({ path }: { path: TLearningPath }) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          {path.title}
        </CardTitle>
        <CardDescription>
          Estimated completion: {path.completionDate}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-medium">Overall Progress</p>
            <p className="text-sm font-semibold">{path.progress}%</p>
          </div>
          <Progress value={path.progress} />
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold">Requirements:</h4>
          <div className="space-y-2">
            {path.requirements.map((req) => (
              <div key={req.id} className="flex items-center gap-2 text-sm">
                {req.completed ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <div className="flex h-4 w-4 items-center justify-center">
                    <div className="bg-muted-foreground h-2 w-2 rounded-full" />
                  </div>
                )}
                <p
                  className={
                    req.completed ? 'text-muted-foreground line-through' : ''
                  }
                >
                  {req.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LearningPathCardSkeleton() {
  return (
    <Card className="">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="mb-2 h-4 w-1/3" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function InProgressTab() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      {learningPathsData.map((path) => (
        <LearningPathCard key={path.id} path={path} />
      ))}
    </div>
  );
}

export function InProgressTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <LearningPathCardSkeleton />
      <LearningPathCardSkeleton />
    </div>
  );
}
