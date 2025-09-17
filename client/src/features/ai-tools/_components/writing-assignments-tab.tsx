'use client';

import {
  BookOpen,
  Check,
  Copy,
  Download,
  Edit3,
  FileText,
  MoreVertical,
  Plus,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import {
  useCreateAssignment,
  useDeleteAssignment,
  useGenerateDraft,
  useGetFeedback,
  useGetWritingAssignments,
  useUpdateAssignment,
} from '../hooks/useAiWriting';
import { WritingAssignment, WritingFeedback } from '../schemas/writing.schema';
import { CourseSelectionScreen } from './common/CourseSelectionScrren';

interface AssignmentManagerProps {
  activeAssignment: WritingAssignment | null;
  setActiveAssignment: (assignment: WritingAssignment | null) => void;
  courseId: string;
}

function AssignmentManager({
  activeAssignment,
  setActiveAssignment,
  courseId,
}: AssignmentManagerProps) {
  const { data: assignments, isLoading } = useGetWritingAssignments(courseId);
  const { mutate: createAssignment, isPending: isCreating } =
    useCreateAssignment();
  const { mutate: deleteAssignment } = useDeleteAssignment();
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] =
    useState<WritingAssignment | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const handleNewAssignment = () => {
    if (!newTitle.trim()) return;

    createAssignment(
      { courseId, title: newTitle.trim() },
      {
        onSuccess: (res) => {
          if (res.data) {
            setActiveAssignment(res.data);

            toast.success('Document created successfully');
          } else {
            toast.error(res.error);
          }

          setShowNewDialog(false);
          setNewTitle('');
        },
      }
    );
  };

  const handleDeleteAssignment = () => {
    if (!assignmentToDelete) return;

    deleteAssignment(assignmentToDelete.id, {
      onSuccess: (res) => {
        if (res.data) {
          if (activeAssignment?.id === assignmentToDelete.id) {
            setActiveAssignment(null);
          }
          toast.success('Document deleted successfully');
        } else {
          toast.error(res.error);
        }

        setShowDeleteDialog(false);
        setAssignmentToDelete(null);
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWordCount = (content: string | null) => {
    if (!content) return 0;

    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  return (
    <>
      <Card className="flex h-full flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">My Documents</CardTitle>
          <CardDescription>
            {assignments?.length || 0} writing assignments
          </CardDescription>
          <CardAction>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={() => setShowNewDialog(true)}
                  disabled={isCreating}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Document</TooltipContent>
            </Tooltip>
          </CardAction>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full px-6">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : assignments?.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="space-y-2">
                  <FileText className="text-muted-foreground mx-auto h-8 w-8" />
                  <p className="text-muted-foreground text-sm">
                    No documents yet
                  </p>

                  <p className="text-muted-foreground text-xs">
                    Create your first writing assignment
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 pb-4">
                {assignments?.map((doc) => (
                  <Card
                    key={doc.id}
                    className={`hover:bg-muted/50 cursor-pointer transition-colors ${
                      activeAssignment?.id === doc.id
                        ? 'border-primary/30 bg-muted/50'
                        : ''
                    } ${doc.prompt ? 'from-muted/30 to-background bg-gradient-to-r' : ''}`}
                    onClick={() => setActiveAssignment(doc)}
                  >
                    <CardContent className="">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-medium">
                            {doc.title}
                          </h3>

                          <div className="mt-1 flex items-center gap-2">
                            <p className="text-muted-foreground text-xs">
                              {formatDate(doc.updatedAt)}
                            </p>

                            {doc.content && (
                              <Badge variant="outline" className="text-xs">
                                {getWordCount(doc.content)} words
                              </Badge>
                            )}
                          </div>

                          {doc.prompt && (
                            <div className="mt-1 flex items-center gap-1">
                              <Sparkles className="text-primary h-3 w-3" />
                              <p className="text-primary text-xs">
                                AI Generated
                              </p>
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                            </TooltipTrigger>{' '}
                            <TooltipContent>More Options</TooltipContent>
                          </Tooltip>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setAssignmentToDelete(doc);
                                setShowDeleteDialog(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
            <DialogDescription>
              Start a new writing assignment for this course.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="Enter document title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleNewAssignment();
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleNewAssignment}
              disabled={!newTitle.trim() || isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Document'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{assignmentToDelete?.title}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAssignment}>
              Delete Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface EditorPanelProps {
  activeAssignment: WritingAssignment | null;
}

function EditorPanel({ activeAssignment }: EditorPanelProps) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [debouncedContent] = useDebounce(content, 1000);
  const [debouncedTitle] = useDebounce(title, 1000);
  const { mutate: updateAssignment, isPending: isSaving } =
    useUpdateAssignment();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [editorState, setEditorState] = useState({ title: '', content: '' });
  const [debouncedState] = useDebounce(editorState, 1000);

  const { mutate: generateDraft, isPending: isGenerating } = useGenerateDraft();

  useEffect(() => {
    if (activeAssignment) {
      setEditorState({
        title: activeAssignment.title,
        content: activeAssignment.content || '',
      });
    } else {
      setEditorState({ title: '', content: '' });
    }
  }, [activeAssignment]);

  useEffect(() => {
    if (
      activeAssignment &&
      (debouncedState.title !== activeAssignment.title ||
        debouncedState.content !== activeAssignment.content)
    ) {
      updateAssignment({
        assignmentId: activeAssignment.id,
        title: debouncedState.title,
        content: debouncedState.content,
      });
    }
  }, [debouncedState, activeAssignment, updateAssignment]);

  // useEffect(() => {
  //   if (activeAssignment && debouncedTitle !== activeAssignment.title) {
  //     updateAssignment({
  //       assignmentId: activeAssignment.id,
  //       title: debouncedTitle,
  //     });

  //     setHasUnsavedChanges(false);
  //   }
  // }, [debouncedTitle, activeAssignment, updateAssignment]);

  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const getCharCount = (text: string) => {
    return text.length;
  };

  const handleGenerateDraft = () => {
    if (!activeAssignment || !prompt.trim()) return;

    generateDraft(
      {
        courseId: activeAssignment.courseId,
        title: title,
        prompt: prompt.trim(),
      },
      {
        onSuccess: (res) => {
          if (res.data) {
            setContent(res.data.content || '');
            toast.success('AI draft generated successfully');
          } else {
            toast.error(res.error);
          }
          setShowDraftDialog(false);
          setPrompt('');
        },
      }
    );
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(content);

      toast.success('Content copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy content');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Document downloaded');
  };

  if (!activeAssignment) {
    return (
      <Card className="flex h-full items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <Edit3 className="text-primary h-6 w-6" />
          </div>

          <div>
            <h3 className="font-medium">No document selected</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Select a document from the sidebar or create a new one to start
              writing.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="flex h-full flex-col pb-0">
        <CardHeader className="pb-3">
          <div className="space-y-2">
            <Input
              value={editorState.title}
              onChange={(e) => {
                setEditorState((prev) => ({ ...prev, title: e.target.value }));
              }}
              className="border-none p-0 text-lg font-semibold shadow-none focus-visible:ring-0"
              placeholder="Document title..."
            />
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span>{getWordCount(content)} words</span>
                <span>{getCharCount(content)} characters</span>

                {hasUnsavedChanges && (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    <span>Unsaved changes</span>
                  </div>
                )}

                {isSaving && (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                    <span>Saving...</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDraftDialog(true)}
                      className="h-8 px-2"
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Generate AI Draft</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyContent}
                      disabled={!content}
                      className="h-8 px-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy Content</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDownload}
                      disabled={!content}
                      className="h-8 px-2"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-1">
          <Textarea
            value={editorState.content}
            onChange={(e) => {
              setEditorState((prev) => ({ ...prev, content: e.target.value }));
            }}
            placeholder="Start writing your assignment here..."
            className="h-full resize-none border-none text-base leading-relaxed shadow-none focus-visible:ring-0"
          />
        </CardContent>
      </Card>

      <Dialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate AI Draft</DialogTitle>
            <DialogDescription>
              Describe what you want to write about and AI will generate a draft
              for you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Writing Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="e.g., Write an essay about the impact of artificial intelligence on modern education..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
            </div>

            {content && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-950">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-orange-500"></div>
                  <p className="text-sm font-medium">Warning</p>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  Generating a new draft will replace your current content.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDraftDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateDraft}
              disabled={!prompt.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Draft
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface FeedbackPanelProps {
  activeAssignment: WritingAssignment | null;
}

function FeedbackPanel({ activeAssignment }: FeedbackPanelProps) {
  const { mutate: getFeedback, isPending } = useGetFeedback();
  const [feedback, setFeedback] = useState<WritingFeedback[]>([]);
  const [activeFeedbackType, setActiveFeedbackType] = useState<string | null>(
    null
  );

  const handleFeedback = (
    feedbackType: 'Grammar' | 'Style' | 'Clarity' | 'Argument'
  ) => {
    if (!activeAssignment || !activeAssignment.content) {
      toast.error('Please write some content before getting feedback');
      return;
    }

    setActiveFeedbackType(feedbackType);
    getFeedback(
      { assignmentId: activeAssignment.id, feedbackType },
      {
        onSuccess: (res) => {
          if (res.data) {
            setFeedback(res.data);
            toast.success(`${feedbackType} feedback generated`);
          } else {
            toast.error(res.error);
          }
          setActiveFeedbackType(null);
        },
        onError: () => {
          setActiveFeedbackType(null);
        },
      }
    );
  };

  const feedbackTypes = [
    {
      type: 'Grammar' as const,
      label: 'Grammar & Spelling',
      icon: Check,
      description: 'Check for grammatical errors and spelling mistakes',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      type: 'Style' as const,
      label: 'Style & Tone',
      icon: Wand2,
      description: 'Improve writing style and tone consistency',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      type: 'Clarity' as const,
      label: 'Clarity & Flow',
      icon: BookOpen,
      description: 'Enhance readability and logical flow',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      type: 'Argument' as const,
      label: 'Argument Structure',
      icon: FileText,
      description: 'Strengthen arguments and evidence',
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>AI Feedback</CardTitle>
        <CardDescription>
          Get AI-powered suggestions to improve your writing.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-4">
        <div className="space-y-2">
          {feedbackTypes.map(
            ({ type, label, icon: Icon, description, color }) => (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleFeedback(type)}
                    disabled={isPending || !activeAssignment?.content}
                    variant="outline"
                    className="h-auto w-full justify-start gap-3 p-3"
                  >
                    <Icon className={`h-4 w-4 ${color}`} />
                    <div className="text-left">
                      <div className="font-medium">{label}</div>
                      {activeFeedbackType === type && (
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-current"></div>
                          Analyzing...
                        </div>
                      )}
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{description}</p>
                </TooltipContent>
              </Tooltip>
            )
          )}
        </div>

        {feedback.length > 0 && (
          <>
            <Separator />
            <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium">Suggestions ({feedback.length})</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFeedback([])}
                  className="h-6 px-2"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <ScrollArea className="h-full">
                <div className="space-y-3 pr-3">
                  {feedback.map((item, i) => {
                    try {
                      const parsedFeedback = JSON.parse(item.feedbackText);
                      return (
                        <Card key={i} className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <Badge variant="outline" className="text-xs">
                                {item.feedbackType}
                              </Badge>
                            </div>

                            {parsedFeedback.originalText !==
                              parsedFeedback.suggestion && (
                              <div className="space-y-1">
                                <p className="text-destructive text-sm line-through">
                                  {parsedFeedback.originalText}
                                </p>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                  {parsedFeedback.suggestion}
                                </p>
                              </div>
                            )}

                            <p className="text-muted-foreground text-xs">
                              {parsedFeedback.explanation}
                            </p>
                          </div>
                        </Card>
                      );
                    } catch (error) {
                      return (
                        <Card key={i} className="p-3">
                          <p className="text-muted-foreground text-xs">
                            {item.feedbackText}
                          </p>
                        </Card>
                      );
                    }
                  })}
                </div>
              </ScrollArea>
            </div>
          </>
        )}

        {!activeAssignment && (
          <div className="flex flex-1 items-center justify-center text-center">
            <div className="space-y-2">
              <Wand2 className="text-muted-foreground mx-auto h-8 w-8" />

              <p className="text-muted-foreground text-sm">
                Select a document to get AI feedback
              </p>
            </div>
          </div>
        )}

        {activeAssignment && !activeAssignment.content && (
          <div className="flex flex-1 items-center justify-center text-center">
            <div className="space-y-2">
              <Edit3 className="text-muted-foreground mx-auto h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                Start writing to get AI feedback
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface WritingAssistantTabProps {
  courseId?: string;
}

export function WritingAssistantTab({ courseId }: WritingAssistantTabProps) {
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
    <div className="grid h-[calc(100vh-12.5rem)] grid-cols-1 gap-2 lg:grid-cols-4">
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
    <div className="grid h-[calc(100vh-12.5rem)] grid-cols-1 gap-2 lg:grid-cols-4">
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />

        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>

      <div className="lg:col-span-2">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />

        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
