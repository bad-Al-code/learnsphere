'use client';

import { Check, Plus, Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import {
  useCreateAssignment,
  useGetFeedback,
  useGetWritingAssignments,
  useUpdateAssignment,
} from '../hooks/useAiWriting';
import { WritingAssignment } from '../schemas/writing.schema';
import { CourseSelectionScreen } from './common/CourseSelectionScrren';

function AssignmentManager({
  activeAssignment,
  setActiveAssignment,
  courseId,
}: {
  activeAssignment: WritingAssignment | null;
  setActiveAssignment: (assignment: WritingAssignment | null) => void;
  courseId: string;
}) {
  const { data: assignments, isLoading } = useGetWritingAssignments(courseId);
  const { mutate: createAssignment, isPending: isCreating } =
    useCreateAssignment();

  const handleNewAssignment = () => {
    createAssignment(
      { courseId, title: 'Untitled Document' },
      {
        onSuccess: (res) => {
          if (res.data) setActiveAssignment(res.data);
          else toast.error(res.error);
        },
      }
    );
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>My Documents</CardTitle>
        <CardDescription>
          Your writing assignments for this course.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 overflow-y-auto">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          assignments?.map((doc) => (
            <Button
              key={doc.id}
              variant={activeAssignment?.id === doc.id ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveAssignment(doc)}
            >
              {doc.title}
            </Button>
          ))
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleNewAssignment}
          disabled={isCreating}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> New Document
        </Button>
      </CardFooter>
    </Card>
  );
}

function EditorPanel({
  activeAssignment,
}: {
  activeAssignment: WritingAssignment | null;
}) {
  const [content, setContent] = useState('');
  const [debouncedContent] = useDebounce(content, 1000);
  const { mutate: updateAssignment } = useUpdateAssignment();

  useEffect(() => {
    setContent(activeAssignment?.content || '');
  }, [activeAssignment]);

  useEffect(() => {
    if (activeAssignment && debouncedContent !== activeAssignment.content) {
      updateAssignment({
        assignmentId: activeAssignment.id,
        content: debouncedContent,
      });
    }
  }, [debouncedContent, activeAssignment, updateAssignment]);

  if (!activeAssignment) {
    return (
      <Card className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            Select a document or create a new one.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="h-full p-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your assignment..."
          className="h-full resize-none border-none shadow-none focus-visible:ring-0"
        />
      </CardContent>
    </Card>
  );
}

function FeedbackPanel({
  activeAssignment,
}: {
  activeAssignment: WritingAssignment | null;
}) {
  const { mutate: getFeedback, isPending } = useGetFeedback();
  const [feedback, setFeedback] = useState<any[]>([]);

  const handleFeedback = (
    feedbackType: 'Grammar' | 'Style' | 'Clarity' | 'Argument'
  ) => {
    if (!activeAssignment) return;
    getFeedback(
      { assignmentId: activeAssignment.id, feedbackType },
      {
        onSuccess: (res) => {
          if (res.data) setFeedback(res.data);
          else toast.error(res.error);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Feedback</CardTitle>
        <CardDescription>
          Get suggestions to improve your writing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={() => handleFeedback('Grammar')}
          disabled={isPending || !activeAssignment}
          className="w-full justify-start gap-2"
        >
          <Check className="h-4 w-4" /> Grammar & Spelling
        </Button>
        <Button
          onClick={() => handleFeedback('Style')}
          disabled={isPending || !activeAssignment}
          className="w-full justify-start gap-2"
        >
          <Wand2 className="h-4 w-4" /> Style & Tone
        </Button>
        <div className="pt-2">
          {isPending && <p>Getting feedback...</p>}
          {feedback.map((item, i) => (
            <div key={i} className="my-2 border-l-2 pl-2 text-sm">
              <p className="text-destructive font-semibold line-through">
                {JSON.parse(item.feedbackText).originalText}
              </p>
              <p className="font-semibold text-green-600">
                {JSON.parse(item.feedbackText).suggestion}
              </p>
              <p className="text-muted-foreground text-xs">
                {JSON.parse(item.feedbackText).explanation}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function WritingAssistantTab({ courseId }: { courseId?: string }) {
  const [activeAssignment, setActiveAssignment] =
    useState<WritingAssignment | null>(null);

  if (!courseId) {
    return (
      <div className="h-[calc(100vh-12.5rem)]">
        <CourseSelectionScreen />
      </div>
    );
  }

  return (
    <div className="grid h-[calc(100vh-12.5rem)] grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <AssignmentManager
          activeAssignment={activeAssignment}
          setActiveAssignment={setActiveAssignment}
          courseId={courseId}
        />
      </div>
      <div className="lg:col-span-2">
        <EditorPanel activeAssignment={activeAssignment} />
      </div>
      <div className="lg:col-span-1">
        <FeedbackPanel activeAssignment={activeAssignment} />
      </div>
    </div>
  );
}

export function WritingAssistantTabSkeleton() {
  return (
    <div className="h-[calc(100vh-12.5rem)]] grid grid-cols-1 gap-4 lg:grid-cols-4">
      <Skeleton className="h-full lg:col-span-1" />
      <Skeleton className="h-full lg:col-span-2" />
      <Skeleton className="h-full lg:col-span-1" />
    </div>
  );
}
