'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bot,
  Eye,
  FileCheck,
  MessageSquare,
  RefreshCw,
  Shield,
  Users,
} from 'lucide-react';

type TFeedbackStatus = 'reviewed' | 'pending';
type TAssignmentStatus = 'Graded' | 'Pending Review';

type TAIFeedback = {
  id: string;
  title: string;
  reviewedDate: string;
  score: number;
  status: TFeedbackStatus;
  summary: string;
  suggestions: string[];
};
type TSubmittedAssignment = {
  id: string;
  title: string;
  course: string;
  submittedDate: string;
  status: TAssignmentStatus;
  similarity?: number;
  peerReviews: number;
  peerAvg: number;
  score: number;
  points: string;
};

const feedbackData: TAIFeedback[] = [
  {
    id: '1',
    title: 'Database Schema Design',
    reviewedDate: '2024-01-11',
    score: 85,
    status: 'reviewed',
    summary:
      'Your schema shows good normalization principles. Consider adding indexes for frequently queried fields.',
    suggestions: [
      'Add composite indexes',
      'Consider partitioning for large tables',
    ],
  },
  {
    id: '2',
    title: 'React Component Library',
    reviewedDate: '2024-01-10',
    score: 92,
    status: 'reviewed',
    summary:
      'Components are well-structured. Add PropTypes or TypeScript interfaces for better type safety.',
    suggestions: ['Add TypeScript definitions', 'Include unit tests'],
  },
  {
    id: '3',
    title: 'User Research Report',
    reviewedDate: '2024-01-09',
    score: 78,
    status: 'pending',
    summary:
      'Good methodology. Include more quantitative data to support qualitative findings.',
    suggestions: ['Add survey data', 'Include statistical analysis'],
  },
];
const submittedData: TSubmittedAssignment[] = [
  {
    id: '1',
    title: 'CSS Grid Layout Project',
    course: 'Web Development',
    submittedDate: '2024-01-08',
    status: 'Graded',
    similarity: 2,
    peerReviews: 3,
    peerAvg: 89,
    score: 92,
    points: '100/100 pts',
  },
  {
    id: '2',
    title: 'JavaScript Algorithm Challenge',
    course: 'Web Development',
    submittedDate: '2024-01-05',
    status: 'Graded',
    peerReviews: 2,
    peerAvg: 85,
    score: 88,
    points: '88/100 pts',
  },
  {
    id: '3',
    title: 'HTML Semantic Structure',
    course: 'Web Development',
    submittedDate: '2024-01-10',
    status: 'Pending Review',
    similarity: 1,
    peerReviews: 0,
    peerAvg: 0,
    score: 0,
    points: '75 pts',
  },
];

function AIFeedbackItem({ feedback }: { feedback: TAIFeedback }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
          <div>
            <h3 className="font-semibold">{feedback.title}</h3>
            <p className="text-muted-foreground text-sm">
              Reviewed on {feedback.reviewedDate}
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xl font-bold">{feedback.score}/100</p>
            <Badge
              variant={feedback.status === 'reviewed' ? 'default' : 'secondary'}
              className="capitalize"
            >
              {feedback.status}
            </Badge>
          </div>
        </div>

        <p className="mt-2 text-sm">{feedback.summary}</p>

        <div className="mt-2 text-sm">
          <h4 className="font-semibold">AI Suggestions:</h4>
          <ul className="text-muted-foreground list-inside list-disc">
            {feedback.suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-grow">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-grow">
            <RefreshCw className="h-4 w-4" />
            Request Recheck
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AIFeedbackLog() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <CardTitle>AI Feedback Log</CardTitle>
        </div>
        <CardDescription>
          All AI reviews and feedback for your submitted work
        </CardDescription>
      </CardHeader>
      <CardContent className="divide-border space-y-2">
        {feedbackData.map((item) => (
          <AIFeedbackItem key={item.id} feedback={item} />
        ))}
      </CardContent>
    </Card>
  );
}

function SubmittedAssignmentItem({
  assignment,
}: {
  assignment: TSubmittedAssignment;
}) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="">{assignment.title}</CardTitle>
        <CardDescription>{assignment.course}</CardDescription>
        <CardAction className="flex space-x-2">
          <Badge
            variant={assignment.status === 'Graded' ? 'default' : 'secondary'}
          >
            {assignment.status}
          </Badge>
          {assignment.similarity && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {assignment.similarity}% similarity
            </Badge>
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="">
        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span>Submitted on {assignment.submittedDate}</span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {assignment.peerReviews} peer reviews
          </span>
          <span>Peer avg: {assignment.peerAvg}%</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="flex-grow">
          {assignment.status === 'Graded' ? (
            <>
              <p className="text-2xl font-bold">{assignment.score}%</p>
              <p className="text-muted-foreground text-xs">
                {assignment.points}
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold">Grade pending</p>
              <p className="text-muted-foreground text-xs">
                {assignment.points}
              </p>
            </>
          )}
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Button variant="outline" size="sm" className="flex-grow sm:w-auto">
            <Eye className="h-4 w-4" />
            View
          </Button>
          {assignment.status === 'Graded' && (
            <Button
              variant="secondary"
              size="sm"
              className="flex-grow sm:w-auto"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

function SubmittedAssignmentsSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          <CardTitle>Submitted Assignments</CardTitle>
        </div>
        <CardDescription>View your submitted work and grades</CardDescription>
      </CardHeader>
      <CardContent className="divide-border space-y-2">
        {submittedData.map((item) => (
          <SubmittedAssignmentItem key={item.id} assignment={item} />
        ))}
      </CardContent>
    </Card>
  );
}

function AIFeedbackItemSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
          <div>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-1 h-4 w-28" />
          </div>
          <div className="flex-shrink-0 space-y-1 text-right">
            <Skeleton className="ml-auto h-6 w-14" />
            <Skeleton className="ml-auto h-5 w-20" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-24 flex-grow rounded-md" />
          <Skeleton className="h-8 w-28 flex-grow rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

function SubmittedAssignmentItemSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 sm:flex-row">
        <div className="flex-grow">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="mt-2 h-4 w-12" />
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-24" />
          <Skeleton className="h-10 w-full sm:w-24" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function SubmittedTab() {
  return (
    <div className="space-y-2">
      <AIFeedbackLog />
      <SubmittedAssignmentsSection />
    </div>
  );
}

export function SubmittedTabSkeleton() {
  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
        </CardHeader>
        <CardContent className="divide-border space-y-2">
          <AIFeedbackItemSkeleton />
          <AIFeedbackItemSkeleton />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
          <Skeleton className="mt-2 h-4 w-64" />
        </CardHeader>
        <CardContent className="divide-border space-y-2">
          <SubmittedAssignmentItemSkeleton />
          <SubmittedAssignmentItemSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
