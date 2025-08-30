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
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Eye, Pencil, Play, Users } from 'lucide-react';

type TReviewStatus = 'pending' | 'completed' | 'not-started';

type TPeerReview = {
  id: string;
  title: string;
  status: TReviewStatus;
  author: string;
  course: string;
  submittedDate: string;
  reviewDueDate: string;
  criteria: string[];
  score?: number;
};

const peerReviewData: TPeerReview[] = [
  {
    id: '1',
    title: 'CSS Grid Layout Project',
    status: 'pending',
    author: 'Emma Wilson',
    course: 'Web Development',
    submittedDate: '2024-01-12',
    reviewDueDate: '2024-01-14',
    criteria: [
      'Design Quality',
      'Code Structure',
      'Responsiveness',
      'Accessibility',
    ],
  },
  {
    id: '2',
    title: 'JavaScript Algorithm Challenge',
    status: 'completed',
    author: 'Mike Johnson',
    course: 'Web Development',
    submittedDate: '2024-01-11',
    reviewDueDate: '2024-01-15',
    criteria: [
      'Algorithm Efficiency',
      'Code Readability',
      'Documentation',
      'Testing',
    ],
    score: 87,
  },
  {
    id: '3',
    title: 'User Research Report',
    status: 'not-started',
    author: 'Sarah Chen',
    course: 'UI/UX Principles',
    submittedDate: '2024-01-13',
    reviewDueDate: '2024-01-16',
    criteria: [
      'Research Methodology',
      'Data Analysis',
      'Insights Quality',
      'Presentation',
    ],
  },
];

function PeerReviewItem({ assignment }: { assignment: TPeerReview }) {
  const getStatusAction = () => {
    switch (assignment.status) {
      case 'pending':
        return { text: 'Continue Review', Icon: Pencil };
      case 'completed':
        return { text: 'View Review', Icon: Eye };
      case 'not-started':
        return { text: 'Start Review', Icon: Play };
      default:
        return { text: 'Review', Icon: Pencil };
    }
  };
  const { text: actionText, Icon: ActionIcon } = getStatusAction();

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{assignment.title}</h3>
              <Badge variant="secondary" className="capitalize">
                {assignment.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              by {assignment.author} • {assignment.course}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Submitted: {assignment.submittedDate} • Review due:{' '}
              {assignment.reviewDueDate}
            </p>
          </div>

          {assignment.status === 'completed' && (
            <div className="w-full flex-shrink-0 text-center sm:w-auto sm:self-start sm:text-right">
              <p className="text-2xl font-bold">{assignment.score}/100</p>
              <p className="text-muted-foreground text-xs">Your Score</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold">Review Criteria:</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {assignment.criteria.map((c) => (
              <Badge key={c} variant="outline">
                {c}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button className="flex-grow" variant="outline">
            <Eye className="h-4 w-4" />
            {actionText}
          </Button>

          <Button className="flex-grow" variant="outline">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PeerReviewItemSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-3 w-64" />
          </div>

          <div className="w-full space-y-1 text-center sm:w-auto sm:text-right">
            <Skeleton className="mx-auto h-8 w-24 sm:mx-0" />
            <Skeleton className="mx-auto h-3 w-16 sm:mx-0" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-10 w-36 flex-grow" />
          <Skeleton className="h-10 w-32 flex-grow" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PeerReviewTab() {
  return (
    <div className="">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Peer Review Assignments</CardTitle>
          </div>
          <CardDescription>
            Review your classmates' work and provide constructive feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {peerReviewData.map((item) => (
            <PeerReviewItem key={item.id} assignment={item} />
          ))}
        </CardContent>
      </Card>
      <div className="mt-5"></div>
    </div>
  );
}

export function PeerReviewTabSkeleton() {
  return (
    <div className="">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-64" />
          <Skeleton className="mt-2 h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-4">
          <PeerReviewItemSkeleton />
          <PeerReviewItemSkeleton />
          <PeerReviewItemSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
