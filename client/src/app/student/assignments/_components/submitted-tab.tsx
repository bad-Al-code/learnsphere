'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertCircle,
  Bot,
  CheckCircle,
  Eye,
  FileCheck,
  MessageSquare,
  RefreshCw,
  Shield,
  Users,
} from 'lucide-react';
import { useState } from 'react';

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
  detailedFeedback?: string;
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
  feedback?: string;
  rubric?: Array<{
    criteria: string;
    score: number;
    maxScore: number;
    comment: string;
  }>;
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
    detailedFeedback:
      'Your database schema demonstrates a solid understanding of normalization principles. The primary and foreign key relationships are well-defined. However, performance could be improved by adding strategic indexes on frequently queried columns.',
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
    detailedFeedback:
      'Excellent component architecture with clean separation of concerns. Your use of React hooks is appropriate and the component reusability is well-thought-out.',
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
    detailedFeedback:
      'Your qualitative research methodology is sound and the insights are valuable. To strengthen your findings, incorporate quantitative data through surveys or analytics.',
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
    feedback:
      'Excellent use of CSS Grid! Your layout is responsive and follows modern best practices.',
    rubric: [
      {
        criteria: 'Layout Design',
        score: 25,
        maxScore: 25,
        comment: 'Perfect grid implementation',
      },
      {
        criteria: 'Responsiveness',
        score: 23,
        maxScore: 25,
        comment: 'Works well on all devices',
      },
      {
        criteria: 'Code Quality',
        score: 24,
        maxScore: 25,
        comment: 'Clean and organized CSS',
      },
      {
        criteria: 'Accessibility',
        score: 20,
        maxScore: 25,
        comment: 'Good use of semantic HTML',
      },
    ],
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
    feedback:
      'Good algorithm implementation. Consider optimizing time complexity for larger datasets.',
    rubric: [
      {
        criteria: 'Correctness',
        score: 23,
        maxScore: 25,
        comment: 'Algorithm works correctly',
      },
      {
        criteria: 'Efficiency',
        score: 20,
        maxScore: 25,
        comment: 'Could be more optimized',
      },
      {
        criteria: 'Code Style',
        score: 22,
        maxScore: 25,
        comment: 'Clean and readable',
      },
      {
        criteria: 'Documentation',
        score: 23,
        maxScore: 25,
        comment: 'Well commented',
      },
    ],
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

export function FeedbackDetailsModal({ feedback }: { feedback: TAIFeedback }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-grow">
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {feedback.title} - AI Feedback
          </DialogTitle>
          <DialogDescription>
            Detailed feedback reviewed on {feedback.reviewedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-primary text-3xl font-bold">
              {feedback.score}/100
            </div>
            <Badge
              variant={feedback.status === 'reviewed' ? 'default' : 'secondary'}
            >
              {feedback.status}
            </Badge>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {feedback.detailedFeedback || feedback.summary}
            </AlertDescription>
          </Alert>

          <div>
            <h4 className="mb-2 font-semibold">
              AI Suggestions for Improvement:
            </h4>
            <ul className="space-y-1">
              {feedback.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RecheckRequestModal({ feedback }: { feedback: TAIFeedback }) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const handleRecheck = () => {
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setIsRequested(true);
    }, 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-grow">
          <RefreshCw className="h-4 w-4" />
          Request Recheck
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request AI Recheck</DialogTitle>
          <DialogDescription>
            Request a new AI review for "{feedback.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isRequested ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Recheck request submitted successfully! You'll receive an
                updated review within 24 hours.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <p className="text-muted-foreground text-sm">
                This will submit your work for a new AI review. The AI will
                reassess your submission and provide updated feedback.
              </p>
              <Button
                onClick={handleRecheck}
                disabled={isRequesting}
                className="w-full"
              >
                {isRequesting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  'Submit Recheck Request'
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AssignmentDetailsModal({
  assignment,
}: {
  assignment: TSubmittedAssignment;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-grow sm:w-auto">
          <Eye className="h-4 w-4" />
          View
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{assignment.title}</DialogTitle>
          <DialogDescription>{assignment.course}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="text-primary text-2xl font-bold">
                {assignment.score}%
              </div>
              <div className="text-muted-foreground text-sm">Final Score</div>
            </div>
            <div>
              <div className="text-xl font-semibold">{assignment.peerAvg}%</div>
              <div className="text-muted-foreground text-sm">Peer Average</div>
            </div>
            <div>
              <div className="text-xl font-semibold">
                {assignment.peerReviews}
              </div>
              <div className="text-muted-foreground text-sm">Peer Reviews</div>
            </div>
            {assignment.similarity && (
              <div>
                <div className="text-destructive text-xl font-semibold">
                  {assignment.similarity}%
                </div>
                <div className="text-muted-foreground text-sm">Similarity</div>
              </div>
            )}
          </div>

          {assignment.rubric && (
            <div>
              <h4 className="mb-3 font-semibold">Grading Rubric</h4>
              <div className="space-y-3">
                {assignment.rubric.map((item, index) => (
                  <div key={index} className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{item.criteria}</span>
                      <Badge variant="outline">
                        {item.score}/{item.maxScore}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {item.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FeedbackModal({ assignment }: { assignment: TSubmittedAssignment }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="flex-grow sm:w-auto">
          <MessageSquare className="h-4 w-4" />
          Feedback
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Instructor Feedback</DialogTitle>
          <DialogDescription>{assignment.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>
              {assignment.feedback || 'No detailed feedback provided.'}
            </AlertDescription>
          </Alert>

          <div className="text-center">
            <div className="text-primary text-3xl font-bold">
              {assignment.score}%
            </div>
            <div className="text-muted-foreground text-sm">
              {assignment.points}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AIFeedbackItem({ feedback }: { feedback: TAIFeedback }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
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
          <FeedbackDetailsModal feedback={feedback} />
          <RecheckRequestModal feedback={feedback} />
        </div>
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
    <Card>
      <CardHeader>
        <CardTitle>{assignment.title}</CardTitle>
        <CardDescription>{assignment.course}</CardDescription>
        <div className="flex space-x-2">
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
        </div>
      </CardHeader>

      <CardContent>
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
          <AssignmentDetailsModal assignment={assignment} />
          {assignment.status === 'Graded' && (
            <FeedbackModal assignment={assignment} />
          )}
        </div>
      </CardFooter>
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
      <CardContent className="space-y-2">
        {feedbackData.map((item) => (
          <AIFeedbackItem key={item.id} feedback={item} />
        ))}
      </CardContent>
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
      <CardContent className="space-y-2">
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
          <Skeleton className="h-8 flex-grow" />
          <Skeleton className="h-8 flex-grow" />
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
        <div className="mt-2 flex space-x-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 sm:flex-row">
        <div className="flex-grow">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="mt-2 h-4 w-12" />
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Skeleton className="h-8 flex-grow sm:w-20" />
          <Skeleton className="h-8 flex-grow sm:w-20" />
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
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="mt-2 h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-2">
          <AIFeedbackItemSkeleton />
          <AIFeedbackItemSkeleton />
          <AIFeedbackItemSkeleton />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="mt-2 h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-2">
          <SubmittedAssignmentItemSkeleton />
          <SubmittedAssignmentItemSkeleton />
          <SubmittedAssignmentItemSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
