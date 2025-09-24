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
import { format } from 'date-fns';
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
import {
  useAIFeedback,
  useRequestRecheck,
  useSubmittedAssignments,
} from '../hooks/use-submissions';
import {
  EnrichedAIFeedback,
  SubmittedAssignment,
} from '../schemas/submission.schema';

function FeedbackDetailsModal({ feedback }: { feedback: EnrichedAIFeedback }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-grow">
          <Eye className="h-4 w-4" /> View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {feedback.title} - AI Feedback
          </DialogTitle>

          <DialogDescription>
            Detailed feedback reviewed on{' '}
            {/* {new Date(feedback.reviewedAt).toLocaleDateString()} */}
            {format(new Date(feedback.reviewedAt), "PPP 'at' p")}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-4">
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

function RecheckRequestModal({ feedback }: { feedback: EnrichedAIFeedback }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: recheck, isPending } = useRequestRecheck();
  const handleRecheck = () =>
    recheck(feedback.submissionId, { onSuccess: () => setIsOpen(false) });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

        <p className="text-muted-foreground text-sm">
          This will submit your work for a new AI review. You will be notified
          when it's complete.
        </p>

        <Button onClick={handleRecheck} disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" /> Requesting...
            </>
          ) : (
            'Confirm Recheck Request'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function AssignmentDetailsModal({
  assignment,
}: {
  assignment: SubmittedAssignment;
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

function FeedbackModal({ assignment }: { assignment: SubmittedAssignment }) {
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

function AIFeedbackItem({ feedback }: { feedback: EnrichedAIFeedback }) {
  return (
    <Card className="">
      <CardContent className="">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
          <div>
            <h3 className="font-semibold">{feedback.title}</h3>
            <p className="text-muted-foreground text-sm">
              Reviewed on {format(new Date(feedback.reviewedAt), "PPP 'at' p")}
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
  assignment: SubmittedAssignment;
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

        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span>
            Submitted on{' '}
            {format(new Date(assignment.submittedDate), "PPP 'at' p")}
          </span>

          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {assignment.peerReviews} peer reviews
          </span>
          <span>Peer avg: {assignment.peerAvg}%</span>
        </div>
      </CardHeader>
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
  const { data: feedbackData, isLoading } = useAIFeedback();
  if (isLoading) return <AIFeedbackLogSkeleton />;

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
  const { data: submittedData, isLoading } = useSubmittedAssignments();
  if (isLoading) return <SubmittedAssignmentsSectionSkeleton />;

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
        {submittedData?.map((item) => (
          <SubmittedAssignmentItem key={item.id} assignment={item} />
        ))}
      </CardContent>
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

function AIFeedbackLogSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-2">
        <AIFeedbackItemSkeleton />
        <AIFeedbackItemSkeleton />
      </CardContent>
    </Card>
  );
}
function SubmittedAssignmentsSectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-56" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-2">
        <SubmittedAssignmentItemSkeleton />
        <SubmittedAssignmentItemSkeleton />
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
