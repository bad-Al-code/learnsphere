import { RichTextEditor } from '@/components/text-editor';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Upload,
} from 'lucide-react';
import { useState } from 'react';
import {
  useAssignmentForLesson,
  useSubmitAssignment,
} from '../hooks/use-course-detail';
import { AssignmentSkeleton } from './course-details-skeleton';

interface AssignmentLessonProps {
  lessonId: string;
}

export function AssignmentLesson({ lessonId }: AssignmentLessonProps) {
  const {
    data: assignment,
    isLoading,
    error,
    refetch,
  } = useAssignmentForLesson(lessonId);
  const submitAssignment = useSubmitAssignment(lessonId);

  const [submissionContent, setSubmissionContent] = useState('');
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  if (isLoading) return <AssignmentSkeleton />;
  if (error)
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  if (!assignment)
    return <EmptyState title="Assignment Not Found" icon="file" />;

  const latestSubmission =
    assignment.submissions[assignment.submissions.length - 1];
  const hasSubmitted = assignment.submissions.length > 0;
  const isGraded = latestSubmission?.status === 'graded';
  const isPending = latestSubmission?.status === 'pending';
  const needsResubmit = latestSubmission?.status === 'resubmit-required';

  const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date();
  const canSubmit =
    !isPending && (!isOverdue || assignment.allowLateSubmission);

  const handleSubmit = async () => {
    if (!submissionContent.trim()) {
      alert('Please provide your submission content.');
      return;
    }

    try {
      await submitAssignment.mutateAsync({ content: submissionContent });
      setSubmissionContent('');
      setIsSubmitDialogOpen(false);
    } catch (error) {
      console.error('Failed to submit assignment:', error);
    }
  };

  const getStatusBadge = () => {
    if (!hasSubmitted) return null;

    if (isGraded) {
      return (
        <Badge variant="default" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Graded
        </Badge>
      );
    }

    if (isPending) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending Review
        </Badge>
      );
    }

    if (needsResubmit) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Resubmission Required
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-2 text-2xl font-bold">{assignment.title}</h3>
              <p className="text-muted-foreground">{assignment.description}</p>
            </div>
            {getStatusBadge()}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            {dueDate && (
              <div
                className={`flex items-center gap-2 ${isOverdue ? 'text-red-500' : ''}`}
              >
                <Calendar className="h-4 w-4" />
                <span>
                  Due: {dueDate.toLocaleDateString()} at{' '}
                  {dueDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {isOverdue && ' (Overdue)'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FileText className="text-muted-foreground h-4 w-4" />
              <span>Max Score: {assignment.maxScore} points</span>
            </div>
          </div>

          {isOverdue && !assignment.allowLateSubmission && !hasSubmitted && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This assignment is overdue and no longer accepting submissions.
              </AlertDescription>
            </Alert>
          )}

          {needsResubmit && latestSubmission.feedback && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Resubmission Required:</strong>{' '}
                {latestSubmission.feedback}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {isGraded && latestSubmission && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Your Grade</h4>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  {latestSubmission.score}/{latestSubmission.maxScore}
                </p>
                <p className="text-muted-foreground text-sm">
                  {Math.round(
                    (latestSubmission.score! / latestSubmission.maxScore) * 100
                  )}
                  %
                </p>
              </div>
            </div>

            {latestSubmission.feedback && (
              <div className="space-y-2">
                <h5 className="font-medium">Instructor Feedback</h5>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm">{latestSubmission.feedback}</p>
                </div>
              </div>
            )}

            {latestSubmission.gradedAt && (
              <p className="text-muted-foreground text-xs">
                Graded on {new Date(latestSubmission.gradedAt).toLocaleString()}
              </p>
            )}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h4 className="mb-4 text-lg font-semibold">Instructions</h4>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <RichTextEditor
            initialContent={assignment.instructions}
            onChange={() => {}}
            editable={false}
          />
        </div>
      </Card>

      {assignment.rubric && assignment.rubric.length > 0 && (
        <Card className="p-6">
          <h4 className="mb-4 text-lg font-semibold">Grading Rubric</h4>
          <div className="space-y-3">
            {assignment.rubric.map((item, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-2 flex items-start justify-between">
                  <h5 className="font-medium">{item.criteria}</h5>
                  <Badge variant="outline">{item.maxPoints} pts</Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {assignment.attachments && assignment.attachments.length > 0 && (
        <Card className="p-6">
          <h4 className="mb-4 text-lg font-semibold">Resources</h4>
          <div className="space-y-2">
            {assignment.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-accent flex items-center gap-2 rounded-lg border p-3 transition-colors"
              >
                <FileText className="text-muted-foreground h-4 w-4" />
                <span className="flex-1 text-sm">{attachment.name}</span>
                <Upload className="text-muted-foreground h-4 w-4" />
              </a>
            ))}
          </div>
        </Card>
      )}

      {hasSubmitted && (
        <Card className="p-6">
          <h4 className="mb-4 text-lg font-semibold">Submission History</h4>
          <div className="space-y-3">
            {assignment.submissions.map((submission, index) => (
              <div key={submission.id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="font-medium">Submission #{index + 1}</p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  {submission.status === 'graded' && (
                    <Badge variant="default">
                      {submission.score}/{submission.maxScore}
                    </Badge>
                  )}
                  {submission.status === 'pending' && (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                  {submission.status === 'resubmit-required' && (
                    <Badge variant="destructive">Resubmit</Badge>
                  )}
                </div>
                <div className="prose prose-sm dark:prose-invert mt-2 max-w-none text-sm">
                  <RichTextEditor
                    initialContent={submission.content}
                    onChange={() => {}}
                    editable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {canSubmit && (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-semibold">
              {hasSubmitted ? 'Submit Again' : 'Your Submission'}
            </h4>
            {isPending && <Badge variant="secondary">Already Submitted</Badge>}
          </div>

          <Dialog
            open={isSubmitDialogOpen}
            onOpenChange={setIsSubmitDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="lg" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                {hasSubmitted ? 'Submit New Version' : 'Submit Assignment'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit Assignment</DialogTitle>
                <DialogDescription>
                  Complete your assignment submission below. Make sure to review
                  your work before submitting.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <RichTextEditor
                  initialContent={submissionContent}
                  onChange={setSubmissionContent}
                  editable={true}
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitDialogOpen(false)}
                  disabled={submitAssignment.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    submitAssignment.isPending || !submissionContent.trim()
                  }
                >
                  {submitAssignment.isPending
                    ? 'Submitting...'
                    : 'Submit Assignment'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
      )}
    </div>
  );
}
