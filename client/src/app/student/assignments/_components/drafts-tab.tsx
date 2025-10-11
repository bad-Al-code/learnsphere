'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  BookOpen,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Eye,
  FileText,
  Lightbulb,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Share2,
  Star,
  Target,
  Trash2,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  useBookmarkDiscussion,
  useCreateDiscussion,
  useDiscussions,
  usePostReply,
  useResolveDiscussion,
} from '../hooks/use-discussion';
import {
  useAddCollaborator,
  useCreateDraft,
  useDeleteDraft,
  useDrafts,
  useGenerateAISuggestions,
  useGenerateShareLink,
} from '../hooks/use-draft';
import {
  AddCollaboratorInput,
  addCollaboratorInputSchema,
  AISuggestion,
  CreateDiscussionInput,
  createDiscussionInputSchema,
  CreateDraftInput,
  createDraftInputSchema,
  Discussion,
  Draft,
  PostReplyInput,
  postReplyInputSchema,
} from '../schemas/draft.schema';
import { CourseSelectionScreen } from './common/CourseSelectionScrren';

const getPriorityColor = (priority: string) => {
  const colors = {
    high: 'border-destructive text-destructive',
    medium: 'border-yellow-500 text-yellow-500',
    low: 'border-green-500 text-green-500',
  };
  return (
    colors[priority as keyof typeof colors] ||
    'border-muted-foreground text-muted-foreground'
  );
};

const getStatusColor = (status: string) => {
  const colors = {
    completed: 'border-green-500 text-green-500',
    reviewing: 'border-blue-500 text-blue-500',
    draft: 'border-muted-foreground text-muted-foreground',
  };
  return (
    colors[status as keyof typeof colors] ||
    'border-muted-foreground text-muted-foreground'
  );
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
};

function EmptyDrafts() {
  return (
    <div className="text-muted-foreground py-12 text-center">
      <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
      <p className="text-lg font-medium">No drafts yet</p>
      <p className="text-sm">Create your first draft to get started!</p>
    </div>
  );
}

function EmptyDiscussions() {
  return (
    <div className="text-muted-foreground py-12 text-center">
      <MessageSquare className="mx-auto mb-4 h-12 w-12 opacity-50" />
      <p className="text-lg font-medium">No discussions yet</p>
      <p className="text-sm">Start the first discussion!</p>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Alert
      variant="destructive"
      className="flex items-center justify-between space-x-3"
    >
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </div>

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          <span>Retry</span>
        </Button>
      )}
    </Alert>
  );
}

function DraftItem({
  draft,
  onEdit,
  onDelete,
  onAIHelp,
  onShare,
}: {
  draft: Draft;
  onEdit: (draft: Draft) => void;
  onDelete: (id: string) => void;
  onAIHelp: (draft: Draft) => void;
  onShare: (draft: Draft) => void;
}) {
  return (
    <div className="hover:bg-muted/50 rounded-lg border p-4 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold">{draft.title}</h3>
            <Badge
              variant="outline"
              className={getPriorityColor(draft.priority)}
            >
              {draft.priority}
            </Badge>
            <Badge variant="outline" className={getStatusColor(draft.status)}>
              {draft.status}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{draft.progress}% complete</Badge>
            <Badge variant="secondary">
              <Zap className="mr-1 h-3 w-3" />
              Auto-save
            </Badge>
            {draft.aiSuggestions && draft.aiSuggestions > 0 && (
              <Badge
                variant="outline"
                className="cursor-pointer border-purple-500 text-purple-500 hover:bg-purple-50"
                onClick={() => onAIHelp(draft)}
              >
                <Bot className="mr-1 h-3 w-3" />
                {draft.aiSuggestions} AI suggestions
              </Badge>
            )}
            {draft.collaborators && draft.collaborators.length > 0 && (
              <Badge variant="outline">
                <Users className="mr-1 h-3 w-3" />
                {draft.collaborators.length} collaborators
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground text-sm">
            {draft.course} {draft.category && `• ${draft.category}`}
          </p>

          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {draft.lastSaved}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {draft.wordCount} words
            </span>
            {draft.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Due: {formatDate(draft.dueDate)}
              </span>
            )}
          </div>

          <Progress value={draft.progress} className="h-2" />
        </div>

        <TooltipProvider delayDuration={0}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(draft)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="ml-1 hidden lg:inline">Resume</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="lg:hidden">
                  Resume Editing
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAIHelp(draft)}
                  >
                    <Bot className="h-4 w-4" />
                    <span className="ml-1 hidden lg:inline">AI</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="lg:hidden">AI Help</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShare(draft)}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="ml-1 hidden lg:inline">Share</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="lg:hidden">Share</TooltipContent>
              </Tooltip>

              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="ml-1 hidden lg:inline">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent className="lg:hidden">Delete</TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{draft.title}"? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(draft.id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}

function DiscussionItem({
  discussion,
  onReply,
  onBookmark,
  onResolve,
  isReplyOpen,
  onToggleReply,
}: {
  discussion: Discussion;
  onReply: (content: string) => void;
  onBookmark: () => void;
  onResolve: () => void;
  isReplyOpen: boolean;
  onToggleReply: () => void;
}) {
  const form = useForm<PostReplyInput>({
    resolver: zodResolver(postReplyInputSchema),
    defaultValues: { content: '' },
  });

  const handleSubmit = (values: PostReplyInput) => {
    onReply(values.content);
    form.reset();
  };

  return (
    <div className="hover:bg-muted/50 flex flex-col gap-3 rounded-lg border p-4 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold">{discussion.title}</h4>
            {discussion.isResolved && (
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Resolved
              </Badge>
            )}
            {discussion.isBookmarked && (
              <Badge
                variant="outline"
                className="border-yellow-500 text-yellow-500"
              >
                <Star className="mr-1 h-3 w-3" />
                Bookmarked
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground text-sm">
            {discussion.course} • by {discussion.author}
          </p>

          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {discussion.replies} replies
            </span>
            {discussion.views !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {discussion.views} views
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {discussion.lastReply}
            </span>
          </div>

          {discussion.tags && discussion.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {discussion.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={onToggleReply}>
              <MessageSquare className="mr-1 h-4 w-4" />
              Reply
            </Button>
            <Button variant="ghost" size="sm" onClick={onBookmark}>
              <Star
                className={`h-4 w-4 ${
                  discussion.isBookmarked
                    ? 'fill-yellow-400 text-yellow-400'
                    : ''
                }`}
              />
            </Button>
          </div>

          {!discussion.isResolved && discussion.author === 'You' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResolve}
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Resolve
            </Button>
          )}
        </div>
      </div>

      {isReplyOpen && (
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-2 space-y-2 border-t pt-3"
        >
          <Label htmlFor={`reply-${discussion.id}`}>Write a reply</Label>
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Textarea
                  {...field}
                  id={`reply-${discussion.id}`}
                  placeholder="Share your thoughts or ask a question..."
                  rows={3}
                  className={fieldState.error ? 'border-destructive' : ''}
                />
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" disabled={!form.formState.isValid}>
              <Send className="mr-1 h-4 w-4" />
              Post Reply
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onToggleReply}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function CreateDraftDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateDraftInput) => void;
  isPending: boolean;
}) {
  const form = useForm<CreateDraftInput>({
    resolver: zodResolver(createDraftInputSchema),
    defaultValues: {
      title: '',
      assignmentId: '',
    },
  });

  const handleSubmit = (values: CreateDraftInput) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Draft</DialogTitle>
          <DialogDescription>
            Start a new assignment draft with AI assistance
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="draft-title">Title</Label>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="draft-title"
                    placeholder="Enter assignment title..."
                    className={fieldState.error ? 'border-destructive' : ''}
                  />
                  {fieldState.error && (
                    <p className="text-destructive text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignment-id">Assignment ID</Label>
            <Controller
              name="assignmentId"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="assignment-id"
                    placeholder="Enter the parent Assignment ID..."
                    className={fieldState.error ? 'border-destructive' : ''}
                  />
                  {fieldState.error && (
                    <p className="text-destructive text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Draft'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CreateDiscussionDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  courseId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateDiscussionInput) => void;
  isPending: boolean;
  courseId: string;
}) {
  const form = useForm<CreateDiscussionInput>({
    resolver: zodResolver(createDiscussionInputSchema),
    defaultValues: {
      title: '',
      courseId,
      content: '',
      tags: '',
    },
  });

  const handleSubmit = (values: CreateDiscussionInput) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Discussion</DialogTitle>
          <DialogDescription>
            Ask a question or start a discussion about your assignment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="discussion-title">Title</Label>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="discussion-title"
                    placeholder="What's your question or topic?"
                    className={fieldState.error ? 'border-destructive' : ''}
                  />
                  {fieldState.error && (
                    <p className="text-destructive text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discussion-content">Content</Label>
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    {...field}
                    id="discussion-content"
                    placeholder="Provide more details about your question..."
                    rows={4}
                    className={fieldState.error ? 'border-destructive' : ''}
                  />
                  {fieldState.error && (
                    <p className="text-destructive text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discussion-tags">Tags (comma separated)</Label>
            <Controller
              name="tags"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="discussion-tags"
                  placeholder="e.g., database, react, testing"
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Start Discussion'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AIAssistanceDialog({
  open,
  onOpenChange,
  draft,
  suggestions,
  isGenerating,
  onGenerate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: Draft | null;
  suggestions: AISuggestion[];
  isGenerating: boolean;
  onGenerate: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-500" />
            AI Writing Assistant
            {draft && <Badge variant="outline">{draft.title}</Badge>}
          </DialogTitle>
          <DialogDescription>
            Get intelligent suggestions to improve your assignment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Current Suggestions</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="h-4 w-4" />
              )}
              Generate New
            </Button>
          </div>

          <ScrollArea className="h-72">
            <div className="space-y-3 p-4">
              {isGenerating ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2 rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))
              ) : suggestions.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  <Lightbulb className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>
                    No suggestions yet. Click "Generate New" to get AI
                    suggestions.
                  </p>
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="hover:bg-muted/50 rounded-lg border p-3 transition-colors"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {suggestion.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-muted-foreground text-xs">
                            {suggestion.confidence}% confidence
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm">{suggestion.suggestion}</p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold">Quick Actions</span>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4" />
                  Structure Analysis
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-semibold">Progress Insights</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Readability</span>
                  <span className="text-green-600">Good</span>
                </div>
                <div className="flex justify-between">
                  <span>Structure</span>
                  <span className="text-yellow-600">Fair</span>
                </div>
                <div className="flex justify-between">
                  <span>Citations</span>
                  <span className="text-destructive">Needs Work</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Apply All Suggestions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ShareDialog({
  open,
  onOpenChange,
  draft,
  shareLink,
  onCopyLink,
  onAddCollaborator,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: Draft | null;
  shareLink: string;
  onCopyLink: () => void;
  onAddCollaborator: (email: string) => void;
  isPending: boolean;
}) {
  const form = useForm<AddCollaboratorInput>({
    resolver: zodResolver(addCollaboratorInputSchema),
    defaultValues: { email: '' },
  });

  const handleSubmit = (values: AddCollaboratorInput) => {
    onAddCollaborator(values.email);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Draft
          </DialogTitle>
          <DialogDescription>
            Share your draft with collaborators or for feedback
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="share-link">Shareable Link</Label>
            <div className="mt-1 flex items-center gap-2">
              <Input
                id="share-link"
                value={shareLink}
                readOnly
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={onCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>Share Options</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <Eye className="h-4 w-4" />
                View Only
              </Button>
              <Button variant="outline" className="justify-start">
                <Pencil className="h-4 w-4" />
                Can Edit
              </Button>
              <Button variant="outline" className="justify-start">
                <MessageSquare className="h-4 w-4" />
                Can Comment
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <Label htmlFor="collaborator-email">Add Collaborators</Label>
            <div className="flex items-center gap-2">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex-1">
                    <Input
                      {...field}
                      id="collaborator-email"
                      type="email"
                      placeholder="Enter email address..."
                      className={fieldState.error ? 'border-destructive' : ''}
                    />
                    {fieldState.error && (
                      <p className="text-destructive mt-1 text-sm">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Button
                type="submit"
                size="sm"
                disabled={isPending || !form.formState.isValid}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </div>
          </form>

          {draft?.collaborators && draft.collaborators.length > 0 && (
            <div>
              <Label>Current Collaborators</Label>
              <div className="mt-2 space-y-2">
                {draft.collaborators.map((collaborator, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded border p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs">
                        {collaborator
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span className="text-sm">{collaborator}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            <Send className="h-4 w-4" />
            Send Invitations
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditDraftDialog({
  open,
  onOpenChange,
  draft,
  onAIHelp,
  onShare,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: Draft | null;
  onAIHelp: () => void;
  onShare: () => void;
}) {
  const [content, setContent] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            {draft?.title}
            {draft && (
              <Badge variant="outline" className={getStatusColor(draft.status)}>
                {draft.status}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Continue working on your assignment with AI assistance
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1">
          <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="space-y-4 lg:col-span-3">
              <div>
                <Label htmlFor="draft-content">Content</Label>
                <Textarea
                  id="draft-content"
                  placeholder="Start writing your assignment here..."
                  className="min-h-[400px] resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Card className="p-3">
                <h4 className="mb-2 flex items-center gap-1 text-sm font-semibold">
                  <Settings className="h-4 w-4" />
                  Document Info
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Words:</span>
                    <span>{draft?.wordCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span>{draft?.progress || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="capitalize">{draft?.status}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <h4 className="mb-2 flex items-center gap-1 text-sm font-semibold">
                  <Bot className="h-4 w-4 text-purple-500" />
                  AI Suggestions
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={onAIHelp}
                  >
                    <Lightbulb className="h-3 w-3" />
                    Get Writing Help
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Grammar Check
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                  >
                    <BookOpen className="h-3 w-3" />
                    Citations
                  </Button>
                </div>
              </Card>

              <Card className="p-3">
                <h4 className="mb-2 flex items-center gap-1 text-sm font-semibold">
                  <Users className="h-4 w-4" />
                  Collaboration
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={onShare}
                  >
                    <Share2 className="h-3 w-3" />
                    Share Draft
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                  >
                    <MessageSquare className="h-3 w-3" />
                    Comments (0)
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="mr-auto flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Auto-saved just now
            </Badge>
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DraftsSection({ courseId }: { courseId: string }) {
  const { data: drafts, isLoading, error, refetch } = useDrafts(courseId);
  const { mutate: createDraft, isPending: isCreating } = useCreateDraft();
  const { mutate: deleteDraft } = useDeleteDraft();
  const {
    mutate: generateAI,
    data: aiSuggestions,
    isPending: isGeneratingAI,
  } = useGenerateAISuggestions();
  const {
    mutate: generateShareLink,
    data: shareLinkData,
    isPending: isGeneratingLink,
  } = useGenerateShareLink();
  const { mutate: addCollaborator, isPending: isAddingCollaborator } =
    useAddCollaborator();

  const [isNewDraftOpen, setIsNewDraftOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleCreateDraft = (data: CreateDraftInput) => {
    createDraft(data, {
      onSuccess: () => {
        setIsNewDraftOpen(false);
      },
    });
  };

  const handleDeleteDraft = (draftId: string) => {
    deleteDraft(draftId);
  };

  const handleAIHelp = (draft: Draft) => {
    setSelectedDraft(draft);
    generateAI(draft.id);
    setIsAIDialogOpen(true);
  };

  const handleShare = (draft: Draft) => {
    setSelectedDraft(draft);
    generateShareLink(draft.id);
    setIsShareDialogOpen(true);
  };

  const handleEdit = (draft: Draft) => {
    setSelectedDraft(draft);
    setIsEditDialogOpen(true);
  };

  const handleCopyLink = () => {
    if (shareLinkData?.shareToken) {
      navigator.clipboard.writeText(
        `https://app.example.com/draft/${shareLinkData.shareToken}`
      );
    }
  };

  const handleAddCollaborator = (email: string) => {
    if (selectedDraft) {
      addCollaborator({ draftId: selectedDraft.id, data: { email } });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-8" />
              </div>
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <DraftItemSkeleton />
          <DraftItemSkeleton />
          <DraftItemSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Draft Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message="Failed to load drafts" onRetry={refetch} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Draft Assignments
                <Badge variant="secondary">{drafts?.length || 0}</Badge>
              </CardTitle>
              <CardDescription>
                Continue working on your saved drafts
              </CardDescription>
            </div>

            <Button variant="outline" onClick={() => setIsNewDraftOpen(true)}>
              <Plus className="h-4 w-4" />
              New Draft
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!drafts || drafts.length === 0 ? (
            <EmptyDrafts />
          ) : (
            drafts.map((draft) => (
              <DraftItem
                key={draft.id}
                draft={draft}
                onEdit={handleEdit}
                onDelete={handleDeleteDraft}
                onAIHelp={handleAIHelp}
                onShare={handleShare}
              />
            ))
          )}
        </CardContent>
      </Card>

      <CreateDraftDialog
        open={isNewDraftOpen}
        onOpenChange={setIsNewDraftOpen}
        onSubmit={handleCreateDraft}
        isPending={isCreating}
      />

      <AIAssistanceDialog
        open={isAIDialogOpen}
        onOpenChange={setIsAIDialogOpen}
        draft={selectedDraft}
        suggestions={aiSuggestions?.suggestions || []}
        isGenerating={isGeneratingAI}
        onGenerate={() => selectedDraft && generateAI(selectedDraft.id)}
      />

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        draft={selectedDraft}
        shareLink={
          shareLinkData?.shareToken
            ? `https://app.example.com/draft/${shareLinkData.shareToken}`
            : ''
        }
        onCopyLink={handleCopyLink}
        onAddCollaborator={handleAddCollaborator}
        isPending={isAddingCollaborator}
      />

      <EditDraftDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        draft={selectedDraft}
        onAIHelp={() => {
          setIsEditDialogOpen(false);
          if (selectedDraft) handleAIHelp(selectedDraft);
        }}
        onShare={() => {
          setIsEditDialogOpen(false);
          if (selectedDraft) handleShare(selectedDraft);
        }}
      />
    </>
  );
}

function DiscussionsSection({ courseId }: { courseId: string }) {
  const {
    data: discussions,
    isLoading,
    error,
    refetch,
  } = useDiscussions(courseId);
  const { mutate: createDiscussion, isPending: isCreating } =
    useCreateDiscussion();
  const { mutate: postReply } = usePostReply();
  const { mutate: bookmarkDiscussion } = useBookmarkDiscussion();
  const { mutate: resolveDiscussion } = useResolveDiscussion();

  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [replyOpenId, setReplyOpenId] = useState<string | null>(null);

  const handleCreateDiscussion = (data: CreateDiscussionInput) => {
    createDiscussion(data, {
      onSuccess: () => {
        setIsNewDiscussionOpen(false);
      },
    });
  };

  const handleReply = (discussionId: string, content: string) => {
    postReply(
      { discussionId, data: { content } },
      {
        onSuccess: () => {
          setReplyOpenId(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-8" />
              </div>
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-10 w-44" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <DiscussionItemSkeleton />
          <DiscussionItemSkeleton />
          <DiscussionItemSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Assignment Discussions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message="Failed to load discussions" onRetry={refetch} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Assignment Discussions
                <Badge variant="secondary">{discussions?.length || 0}</Badge>
              </CardTitle>
              <CardDescription>
                Get help and discuss assignments with classmates
              </CardDescription>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsNewDiscussionOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Start Discussion
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!discussions || discussions.length === 0 ? (
            <EmptyDiscussions />
          ) : (
            discussions.map((discussion) => (
              <DiscussionItem
                key={discussion.id}
                discussion={discussion}
                onReply={(content) => handleReply(discussion.id, content)}
                onBookmark={() => bookmarkDiscussion(discussion.id)}
                onResolve={() => resolveDiscussion(discussion.id)}
                isReplyOpen={replyOpenId === discussion.id}
                onToggleReply={() =>
                  setReplyOpenId(
                    replyOpenId === discussion.id ? null : discussion.id
                  )
                }
              />
            ))
          )}
        </CardContent>
      </Card>

      <CreateDiscussionDialog
        open={isNewDiscussionOpen}
        onOpenChange={setIsNewDiscussionOpen}
        onSubmit={handleCreateDiscussion}
        isPending={isCreating}
        courseId={courseId}
      />
    </>
  );
}

export function DraftsTab({ courseId }: { courseId?: string }) {
  if (!courseId) {
    return (
      <div className="h-[calc(100vh-12.5rem)]">
        <CourseSelectionScreen />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DraftsSection courseId={courseId} />
      <DiscussionsSection courseId={courseId} />
    </div>
  );
}

export function DraftsTabSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-40 rounded" />
                <Skeleton className="h-5 w-8 rounded" />
              </div>
              <Skeleton className="h-4 w-64 rounded" />
            </div>
            <Skeleton className="h-10 w-32 rounded" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <DraftItemSkeleton />
          <DraftItemSkeleton />
          <DraftItemSkeleton />
        </CardContent>
      </Card>

      {/* Discussions Section Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-48 rounded" />
                <Skeleton className="h-5 w-8 rounded" />
              </div>
              <Skeleton className="h-4 w-72 rounded" />
            </div>
            <Skeleton className="h-10 w-44 rounded" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <DiscussionItemSkeleton />
          <DiscussionItemSkeleton />
          <DiscussionItemSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}

function DraftItemSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-4 w-64" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscussionItemSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}
