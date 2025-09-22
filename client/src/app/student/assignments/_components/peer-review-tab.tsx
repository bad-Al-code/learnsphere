'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertCircle,
  Download,
  Eye,
  FileText,
  Pencil,
  Play,
  Send,
  Star,
  Users,
} from 'lucide-react';
import { useState } from 'react';

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
  feedback?: string;
  reviewProgress?: number;
  assignmentContent?: string;
  isOverdue?: boolean;
};

type TReviewForm = {
  scores: { [key: string]: number };
  feedback: string;
  overallScore: number;
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
    reviewProgress: 65,
    assignmentContent:
      'This is a comprehensive CSS Grid layout project that demonstrates modern web layout techniques...',
    isOverdue: false,
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
    feedback:
      'Excellent implementation with clear documentation. The algorithm is efficient and well-tested.',
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
    assignmentContent:
      'A comprehensive user research report analyzing user behavior patterns...',
    isOverdue: true,
  },
];

function PeerReviewItem({
  assignment,
  onReviewUpdate,
}: {
  assignment: TPeerReview;
  onReviewUpdate: (id: string, updates: Partial<TPeerReview>) => void;
}) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState<TReviewForm>({
    scores: {},
    feedback: assignment.feedback || '',
    overallScore: assignment.score || 0,
  });

  const getStatusAction = () => {
    switch (assignment.status) {
      case 'pending':
        return {
          text: 'Continue Review',
          Icon: Pencil,
          variant: 'default' as const,
        };
      case 'completed':
        return { text: 'View Review', Icon: Eye, variant: 'outline' as const };
      case 'not-started':
        return {
          text: 'Start Review',
          Icon: Play,
          variant: 'default' as const,
        };
      default:
        return { text: 'Review', Icon: Pencil, variant: 'outline' as const };
    }
  };

  const { text: actionText, Icon: ActionIcon, variant } = getStatusAction();

  const handleStartReview = () => {
    if (assignment.status === 'not-started') {
      onReviewUpdate(assignment.id, {
        status: 'pending',
        reviewProgress: 0,
      });
    }
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    const avgScore =
      Object.values(reviewForm.scores).reduce((a, b) => a + b, 0) /
        Object.keys(reviewForm.scores).length || 0;
    onReviewUpdate(assignment.id, {
      status: 'completed',
      score: Math.round(avgScore),
      feedback: reviewForm.feedback,
      reviewProgress: 100,
    });
    setIsReviewDialogOpen(false);
  };

  const handleScoreChange = (criterion: string, score: number) => {
    setReviewForm((prev) => ({
      ...prev,
      scores: { ...prev.scores, [criterion]: score },
    }));
  };

  const getStatusColor = (status: TReviewStatus) => {
    switch (status) {
      case 'completed':
        return '';
      case 'pending':
        return '';
      case 'not-started':
        return assignment.isOverdue
          ? 'bg-red-100 text-red-800'
          : 'bg-gray-100 text-gray-800';
      default:
        return '';
    }
  };

  return (
    <Card
      className={`transition-all hover:shadow-md ${assignment.isOverdue && assignment.status === 'not-started' ? 'border-red-500/50' : ''}`}
    >
      <CardContent className="">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{assignment.title}</h3>
              <Badge
                variant="secondary"
                className={`capitalize ${getStatusColor(assignment.status)}`}
              >
                {assignment.status.replace('-', ' ')}
              </Badge>

              {assignment.isOverdue && assignment.status === 'not-started' && (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="h-3 w-3" />
                  Overdue
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground text-sm">
              by {assignment.author} • {assignment.course}
            </p>

            <p className="text-muted-foreground mt-1 text-xs">
              Submitted: {assignment.submittedDate} • Review due:{' '}
              {assignment.reviewDueDate}
            </p>

            {assignment.status === 'pending' && assignment.reviewProgress && (
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Review Progress</span>
                  <span>{assignment.reviewProgress}%</span>
                </div>

                <Progress value={assignment.reviewProgress} className="h-2" />
              </div>
            )}
          </div>

          {assignment.status === 'completed' && (
            <div className="flex-shrink-0 text-center sm:text-right">
              <div className="mb-1 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor((assignment.score || 0) / 20) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>

              <p className="text-2xl font-bold">{assignment.score}/100</p>
              <p className="text-muted-foreground text-xs">Your Score</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h4 className="mb-2 text-sm font-semibold">Review Criteria:</h4>
          <div className="flex flex-wrap gap-2">
            {assignment.criteria.map((c) => (
              <Badge key={c} variant="outline" className="text-xs">
                {c}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Dialog
            open={isReviewDialogOpen}
            onOpenChange={setIsReviewDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                className="min-w-[120px] flex-1"
                variant={variant}
                onClick={handleStartReview}
              >
                <ActionIcon className="h-4 w-4" />
                {actionText}
              </Button>
            </DialogTrigger>

            <DialogContent className="overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Review: {assignment.title}</DialogTitle>
                <DialogDescription>
                  Provide detailed feedback for {assignment.author}'s submission
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {assignment.assignmentContent && (
                  <div>
                    <Label className="text-sm font-semibold">
                      Assignment Content
                    </Label>
                    <div className="mt-2 max-h-32 overflow-y-auto rounded-lg border p-4">
                      <p className="text-sm">{assignment.assignmentContent}</p>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-semibold">Scoring</Label>
                  <div className="mt-3 space-y-4">
                    {assignment.criteria.map((criterion) => (
                      <div key={criterion} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{criterion}</Label>

                          <span className="text-sm font-medium">
                            {reviewForm.scores[criterion] || 0}/100
                          </span>
                        </div>

                        <Input
                          type="range"
                          min="0"
                          max="100"
                          value={reviewForm.scores[criterion] || 0}
                          onChange={(e) =>
                            handleScoreChange(
                              criterion,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="feedback" className="text-sm font-semibold">
                    Detailed Feedback
                  </Label>

                  <ScrollArea className="mt-2 h-48 w-full rounded-md border">
                    <Textarea
                      id="feedback"
                      placeholder="Provide constructive feedback..."
                      value={reviewForm.feedback}
                      onChange={(e) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          feedback: e.target.value,
                        }))
                      }
                      className="h-full min-h-[120px] resize-none border-0 p-3 focus-visible:ring-0"
                    />
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsReviewDialogOpen(false)}
                  >
                    Save Draft
                  </Button>

                  <Button onClick={handleSubmitReview}>
                    <Send className="h-4 w-4" />
                    Submit Review
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="min-w-[120px] flex-1">
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </DialogTrigger>

            <DialogContent className="">
              <DialogHeader>
                <DialogTitle>{assignment.title}</DialogTitle>
                <DialogDescription>
                  Assignment details and submission information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="font-semibold">Author</Label>
                    <p>{assignment.author}</p>
                  </div>

                  <div>
                    <Label className="font-semibold">Course</Label>
                    <p>{assignment.course}</p>
                  </div>

                  <div>
                    <Label className="font-semibold">Submitted</Label>
                    <p>{assignment.submittedDate}</p>
                  </div>

                  <div>
                    <Label className="font-semibold">Review Due</Label>
                    <p>{assignment.reviewDueDate}</p>
                  </div>
                </div>

                {assignment.assignmentContent && (
                  <div>
                    <Label className="font-semibold">Content Preview</Label>
                    <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border p-4">
                      <p className="text-sm">{assignment.assignmentContent}</p>
                    </div>
                  </div>
                )}

                {assignment.feedback && (
                  <div>
                    <Label className="font-semibold">Your Feedback</Label>
                    <div className="mt-2 rounded-lg bg-blue-50 p-4">
                      <p className="text-sm">{assignment.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob(
                    [
                      `Assignment: ${assignment.title}\nAuthor: ${assignment.author}\nContent: ${assignment.assignmentContent || 'Content not available'}`,
                    ],
                    { type: 'text/plain' }
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${assignment.title.replace(/\s+/g, '_')}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}

export function PeerReviewTab() {
  const [reviews, setReviews] = useState<TPeerReview[]>(peerReviewData);
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'completed' | 'not-started'
  >('all');

  const handleReviewUpdate = (id: string, updates: Partial<TPeerReview>) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, ...updates } : review
      )
    );
  };

  const filteredReviews = reviews.filter(
    (review) => filter === 'all' || review.status === filter
  );

  const stats = {
    total: reviews.length,
    completed: reviews.filter((r) => r.status === 'completed').length,
    pending: reviews.filter((r) => r.status === 'pending').length,
    notStarted: reviews.filter((r) => r.status === 'not-started').length,
    overdue: reviews.filter((r) => r.isOverdue).length,
  };

  return (
    <div className="space-y-2">
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-muted-foreground text-sm">Total</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-muted-foreground text-sm">Completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-muted-foreground text-sm">In Progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold">{stats.notStarted}</div>
                <p className="text-muted-foreground text-sm">Not Started</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="text-destructive text-2xl font-bold">
                  {stats.overdue}
                </div>
                <p className="text-muted-foreground text-sm">Overdue</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['all', 'not-started', 'pending', 'completed'] as const).map(
              (status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="transition-none"
                >
                  {status === 'all'
                    ? 'All Reviews'
                    : status === 'not-started'
                      ? 'Not Started'
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              )
            )}
          </div>

          {stats.overdue > 0 && (
            <Alert className="" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="">Overdue Reviews</AlertTitle>

              <AlertDescription className="">
                You have {stats.overdue} overdue review
                {stats.overdue > 1 ? 's' : ''} that need immediate attention.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            {filteredReviews.map((item) => (
              <PeerReviewItem
                key={item.id}
                assignment={item}
                onReviewUpdate={handleReviewUpdate}
              />
            ))}

            {filteredReviews.length === 0 && (
              <div className="text-muted-foreground py-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>No reviews found for the selected filter.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PeerReviewTabSkeleton() {
  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-64" />
          <Skeleton className="mt-2 h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 text-center">
                  <Skeleton className="mx-auto mb-2 h-8 w-10" />
                  <Skeleton className="mx-auto h-4 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>

          <div className="space-y-2">
            <PeerReviewItemSkeleton />
            <PeerReviewItemSkeleton />
            <PeerReviewItemSkeleton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PeerReviewItemSkeleton() {
  return (
    <Card>
      <CardContent className="">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-3 w-64" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </div>

          <div className="space-y-1 text-center sm:text-right">
            <div className="flex justify-center gap-1 sm:justify-end">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4 rounded-full" />
              ))}
            </div>
            <Skeleton className="mx-auto h-8 w-16 sm:mx-0" />
            <Skeleton className="mx-auto h-3 w-16 sm:mx-0" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-26" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Skeleton className="h-10 min-w-[120px] flex-1" />
          <Skeleton className="h-10 min-w-[120px] flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}
