'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CourseSelectionScreen,
  ErrorState,
} from '@/features/ai-tools/_components/common/CourseSelectionScrren';
import { useGetEnrolledCourses } from '@/features/ai-tools/hooks/useAiConversations';
import { format } from 'date-fns';
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  FileSpreadsheet,
  FileText,
  Lightbulb,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  useAIFeedback,
  useGrades,
  useRequestReGrade,
  useSubmissionDetails,
} from '../hooks';
import { useGradesStore } from '../store';
import { AiInsightsTab, AiInsightsTabSkeleton } from './ai-insights-tab';
import { ComparisonTab, ComparisonTabSkeleton } from './comparison-tab';

const gradeFilters = [
  { label: 'All Grades', value: 'all' },
  { label: 'A (90-100)', value: '90-100' },
  { label: 'B (80-89)', value: '80-89' },
  { label: 'C (70-79)', value: '70-79' },
  { label: 'Pending', value: 'Pending' },
];

function GradesHeader() {
  const { data: enrollments, isLoading: isLoadingCourses } =
    useGetEnrolledCourses();
  const {
    courseId,
    grade,
    status,
    setCourseId,
    setGrade,
    setStatus,
    setQuery,
  } = useGradesStore();
  const [localQuery, setLocalQuery] = useState('');
  const [debouncedQuery] = useDebounce(localQuery, 500);

  useEffect(() => {
    setQuery(debouncedQuery);
  }, [debouncedQuery, setQuery]);

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <Input
        placeholder="Search assignments..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="flex-1"
      />
      <div className="flex gap-2">
        <Select
          value={courseId || 'all'}
          onValueChange={setCourseId}
          disabled={isLoadingCourses}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {enrollments?.map((e) => (
              <SelectItem key={e.course.id} value={e.course.id}>
                {e.course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={grade || 'all'}
          onValueChange={(value) => {
            if (value === 'Pending') {
              setStatus('Pending');
              setGrade('all');
            } else {
              setStatus(undefined);
              setGrade(value);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Grades" />
          </SelectTrigger>
          <SelectContent>
            {gradeFilters.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* </div> */}
        {/* <div className="ml-auto flex items-center gap-2"> */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <FileSpreadsheet className="h-4 w-4" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TooltipTrigger>
          <TooltipContent className="sm:hidden">Export </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function DataTablePagination() {
  const { page, limit, setPage, setLimit } = useGradesStore();
  const { data } = useGrades();

  const totalPages = data?.pagination?.totalPages ?? 0;
  const totalResults = data?.pagination?.totalResults ?? 0;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-muted-foreground hidden flex-1 text-sm sm:inline">
        {totalResults} total submission(s)
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              setLimit(Number(value));
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page} of {totalPages}
        </div>

        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setPage(1)}
                disabled={page <= 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>First Page</TooltipContent>
          </Tooltip>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Last Page</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function SubmissionDetailsDialog({
  submissionId,
  isOpen,
  onOpenChange,
}: {
  submissionId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, isLoading, isError, error, refetch } =
    useSubmissionDetails(submissionId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>
            Review the content you submitted for this assignment.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4 py-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        )}

        {isError && (
          <div className="py-8">
            <ErrorState message={error.message} onRetry={refetch} />
          </div>
        )}

        {data && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Your Submission</h3>
              <Badge>{data.grade}%</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Submitted on:{' '}
              {data.gradedAt
                ? format(new Date(data.gradedAt), 'PPpp')
                : 'Not submitted'}
            </p>

            <Card className="max-h-[50vh] overflow-y-auto">
              <CardContent className="p-4">
                {data.content ? (
                  <p className="text-sm whitespace-pre-wrap">{data.content}</p>
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    No content was recorded for this submission.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AIFeedbackDialog({
  submissionId,
  open,
  onOpenChange,
}: {
  submissionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    data: feedback,
    isLoading,
    isError,
    error,
    refetch,
  } = useAIFeedback(submissionId!, open);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-4 h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }

    if (isError) {
      return <ErrorState message={error.message} onRetry={refetch} />;
    }

    if (!feedback) {
      return (
        <div className="text-muted-foreground py-8 text-center">
          <Bot className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p className="font-semibold">No AI Feedback Available</p>
          <p className="text-sm">
            AI feedback has not been generated for this submission yet.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-muted flex items-center justify-between rounded-lg p-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Overall Score</p>
            <p className="text-2xl font-bold">{feedback.score}/100</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-muted-foreground text-sm">Status</p>
            <Badge
              variant={feedback.status === 'reviewed' ? 'default' : 'secondary'}
              className="capitalize"
            >
              {feedback.status}
            </Badge>
          </div>
        </div>
        <div>
          <h4 className="mb-2 flex items-center gap-2 font-semibold">
            <Lightbulb className="h-4 w-4" />
            Summary
          </h4>
          <p className="text-muted-foreground text-sm">{feedback.summary}</p>
        </div>
        <div>
          <h4 className="mb-2 flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4" />
            Suggestions for Improvement
          </h4>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Feedback Report</DialogTitle>
          <DialogDescription>
            Here's the automated feedback for your submission.
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GradesTable() {
  const { data, isLoading, isError, refetch } = useGrades();
  const { mutate: requestReGrade } = useRequestReGrade();

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewSubmission = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
    setIsDialogOpen(true);
  };

  const handleViewFeedback = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
    setIsFeedbackDialogOpen(true);
  };

  const handleRequestReGrade = (submissionId: string) => {
    requestReGrade(submissionId);
  };

  if (isLoading) {
    return <GradesTableSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState message="Failed to load your grades." onRetry={refetch} />
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Grade Details</CardTitle>
          <CardDescription>
            Detailed breakdown of all your assignments and grades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.results && data.results.length > 0 ? (
                  data.results.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.course}
                      </TableCell>
                      <TableCell>{item.assignment}</TableCell>
                      <TableCell>{item.module}</TableCell>
                      <TableCell>
                        {item.grade ? (
                          <Badge>{item.grade}%</Badge>
                        ) : (
                          <Badge variant="secondary">N/A</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === 'Graded' ? 'default' : 'secondary'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.submitted
                          ? format(new Date(item.submitted), 'PPpp')
                          : 'Not submitted'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewSubmission(item.id)}
                            >
                              View Submission
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleViewFeedback(item.id)}
                            >
                              View AI Feedback
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                >
                                  Request Re-grade
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Request a Re-grade?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will ask the AI to re-evaluate your
                                    submission. Are you sure you want to
                                    proceed?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleRequestReGrade(item.id)
                                    }
                                  >
                                    Yes, Request Re-grade
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No results found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {data && data.pagination.totalPages > 0 && <DataTablePagination />}
        </CardContent>
      </Card>

      <SubmissionDetailsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        submissionId={selectedSubmissionId}
      />

      <AIFeedbackDialog
        submissionId={selectedSubmissionId}
        open={isFeedbackDialogOpen}
        onOpenChange={setIsFeedbackDialogOpen}
      />
    </>
  );
}

export function GradesTab({ courseId }: { courseId?: string }) {
  const { isLoading } = useGrades();
  if (isLoading) return <GradesTabSkeleton />;

  if (!courseId) {
    return (
      <div className="h-[calc(100vh-12.5rem)]">
        <CourseSelectionScreen />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <GradesHeader />
      <GradesTable />
      <ComparisonTab courseId={courseId} />
      <AiInsightsTab />
    </div>
  );
}

export function GradesTabSkeleton() {
  return (
    <div className="space-y-2">
      <GradesHeaderSkeleton />
      <GradesTableSkeleton />
      <ComparisonTabSkeleton />
      <AiInsightsTabSkeleton />
    </div>
  );
}

function GradesHeaderSkeleton() {
  return (
    <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
      <Skeleton className="h-10 w-full md:flex-1" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-40 md:w-32" />
        <Skeleton className="h-10 w-40 md:w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24 sm:w-24" />
        </div>
      </div>
    </div>
  );
}

function GradesTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-5 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
