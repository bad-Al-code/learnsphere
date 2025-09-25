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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useForm } from 'react-hook-form';
import { useDiscussions } from '../hooks/use-discussion';
import { useCreateDraft, useDrafts } from '../hooks/use-draft';
import {
  CreateDraftInput,
  createDraftInputSchema,
} from '../schemas/draft.schema';
import { useAssignmentStore } from '../stores/assignment.store';
import { CourseSelectionScreen } from './common/CourseSelectionScrren';

type TDraft = {
  id: string;
  title: string;
  course: string;
  progress: number;
  lastSaved: string;
  wordCount: number;
  status: 'draft' | 'reviewing' | 'completed';
  aiSuggestions?: number;
  collaborators?: string[];
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
};

type TDiscussion = {
  id: string;
  title: string;
  course: string;
  author: string;
  replies: number;
  lastReply: string;
  isResolved: boolean;
  isBookmarked?: boolean;
  views?: number;
  tags?: string[];
};

type TAIAssistance = {
  type: 'grammar' | 'content' | 'structure' | 'research';
  suggestion: string;
  confidence: number;
};

const initialDraftsData: TDraft[] = [
  {
    id: '1',
    title: 'Database Schema Design',
    course: 'Database Design',
    progress: 65,
    lastSaved: '2024-01-11 3:45 PM',
    wordCount: 1250,
    status: 'draft',
    aiSuggestions: 3,
    collaborators: ['Alice Chen', 'Bob Smith'],
    dueDate: '2024-01-20',
    priority: 'high',
    category: 'Technical Report',
  },
  {
    id: '2',
    title: 'User Research Report',
    course: 'UI/UX Principles',
    progress: 30,
    lastSaved: '2024-01-09 2:20 PM',
    wordCount: 680,
    status: 'draft',
    aiSuggestions: 5,
    collaborators: ['Emma Wilson'],
    dueDate: '2024-01-25',
    priority: 'medium',
    category: 'Research Paper',
  },
  {
    id: '3',
    title: 'Mobile App Prototype Analysis',
    course: 'Mobile Development',
    progress: 85,
    lastSaved: '2024-01-12 1:30 PM',
    wordCount: 2100,
    status: 'reviewing',
    aiSuggestions: 1,
    collaborators: ['David Lee', 'Sarah Kim', 'Mike Johnson'],
    dueDate: '2024-01-15',
    priority: 'high',
    category: 'Analysis Report',
  },
];

const initialDiscussionsData: TDiscussion[] = [
  {
    id: '1',
    title: 'Database normalization best practices',
    course: 'Database Schema Design',
    author: 'Alex Smith',
    replies: 8,
    lastReply: '2h ago',
    isResolved: false,
    isBookmarked: true,
    views: 45,
    tags: ['database', 'normalization', 'best-practices'],
  },
  {
    id: '2',
    title: 'React component testing strategies',
    course: 'React Component Library',
    author: 'Emma Wilson',
    replies: 12,
    lastReply: '4h ago',
    isResolved: true,
    isBookmarked: false,
    views: 67,
    tags: ['react', 'testing', 'components'],
  },
  {
    id: '3',
    title: 'User interview question suggestions',
    course: 'User Research Report',
    author: 'Mike Johnson',
    replies: 6,
    lastReply: '1d ago',
    isResolved: false,
    isBookmarked: false,
    views: 23,
    tags: ['ux', 'research', 'interviews'],
  },
];

const aiSuggestions: TAIAssistance[] = [
  {
    type: 'grammar',
    suggestion:
      'Consider revising sentence structure in paragraph 3 for better clarity.',
    confidence: 92,
  },
  {
    type: 'content',
    suggestion:
      'Add more examples to support your main argument about database relationships.',
    confidence: 87,
  },
  {
    type: 'structure',
    suggestion:
      'The conclusion section could be expanded with future implications.',
    confidence: 79,
  },
  {
    type: 'research',
    suggestion:
      'Consider citing recent studies on NoSQL vs SQL performance comparisons.',
    confidence: 84,
  },
];

export function DraftsTab({ courseId }: { courseId?: string }) {
  const { actions, ...store } = useAssignmentStore();

  if (!courseId) {
    return (
      <div className="h-[calc(100vh-12.5rem)]">
        <CourseSelectionScreen />
      </div>
    );
  }

  const [drafts, setDrafts] = useState<TDraft[]>(initialDraftsData);
  const [discussions, setDiscussions] = useState<TDiscussion[]>(
    initialDiscussionsData
  );
  const [selectedDraft, setSelectedDraft] = useState<TDraft | null>(null);
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<TDiscussion | null>(null);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isNewDraftDialogOpen, setIsNewDraftDialogOpen] = useState(false);
  const [isNewDiscussionDialogOpen, setIsNewDiscussionDialogOpen] =
    useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [newDraftForm, setNewDraftForm] = useState({
    title: '',
    course: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
  });
  const [newDiscussionForm, setNewDiscussionForm] = useState({
    title: '',
    course: '',
    content: '',
    tags: '',
  });
  const [replyContent, setReplyContent] = useState('');

  const handleDeleteDraft = (draftId: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== draftId));
  };

  const handleShareDraft = (draft: TDraft) => {
    setSelectedDraft(draft);
    const link = `https://app.example.com/draft/${draft.id}`;
    setShareLink(link);
    setIsShareDialogOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const handleAIAssistance = (draft: TDraft) => {
    setSelectedDraft(draft);
    setIsAiDialogOpen(true);
  };

  const handleGenerateAISuggestions = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      setIsGeneratingAI(false);
      if (selectedDraft) {
        setDrafts((prev) =>
          prev.map((d) =>
            d.id === selectedDraft.id
              ? { ...d, aiSuggestions: (d.aiSuggestions || 0) + 2 }
              : d
          )
        );
      }
    }, 2000);
  };

  const handleCreateNewDraft = () => {
    if (newDraftForm.title && newDraftForm.course) {
      const newDraft: TDraft = {
        id: Date.now().toString(),
        title: newDraftForm.title,
        course: newDraftForm.course,
        progress: 0,
        lastSaved: new Date().toLocaleString(),
        wordCount: 0,
        status: 'draft',
        aiSuggestions: 0,
        collaborators: [],
        dueDate: newDraftForm.dueDate,
        priority: newDraftForm.priority,
        category: newDraftForm.category,
      };
      setDrafts((prev) => [newDraft, ...prev]);
      setNewDraftForm({
        title: '',
        course: '',
        category: '',
        priority: 'medium',
        dueDate: '',
      });
      setIsNewDraftDialogOpen(false);
    }
  };

  const handleCreateNewDiscussion = () => {
    if (newDiscussionForm.title && newDiscussionForm.course) {
      const newDiscussion: TDiscussion = {
        id: Date.now().toString(),
        title: newDiscussionForm.title,
        course: newDiscussionForm.course,
        author: 'You',
        replies: 0,
        lastReply: 'now',
        isResolved: false,
        isBookmarked: false,
        views: 1,
        tags: newDiscussionForm.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      setDiscussions((prev) => [newDiscussion, ...prev]);
      setNewDiscussionForm({ title: '', course: '', content: '', tags: '' });
      setIsNewDiscussionDialogOpen(false);
    }
  };

  const handleBookmarkDiscussion = (discussionId: string) => {
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discussionId ? { ...d, isBookmarked: !d.isBookmarked } : d
      )
    );
  };

  const handleResolveDiscussion = (discussionId: string) => {
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discussionId ? { ...d, isResolved: !d.isResolved } : d
      )
    );
  };

  const handleReplyToDiscussion = (discussion: TDiscussion) => {
    if (replyContent.trim()) {
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === discussion.id
            ? { ...d, replies: d.replies + 1, lastReply: 'now' }
            : d
        )
      );
      setReplyContent('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 text-red-500';
      case 'medium':
        return 'border-yellow-500 text-yellow-500';
      case 'low':
        return 'border-green-500 text-green-500';
      default:
        return 'border-gray-500 text-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 text-green-500';
      case 'reviewing':
        return 'border-blue-500 text-blue-500';
      case 'draft':
        return 'border-gray-500 text-gray-500';
      default:
        return 'border-gray-500 text-gray-500';
    }
  };

  function DraftAssignmentItem({ draft }: { draft: TDraft }) {
    return (
      <div className="hover:bg-muted/20 rounded-lg border p-4 shadow-md transition-all hover:shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{draft.title}</h3>

              <Badge
                variant="outline"
                className={getPriorityColor(draft.priority)}
              >
                {draft.priority} priority
              </Badge>

              <Badge variant="outline" className={getStatusColor(draft.status)}>
                {draft.status}
              </Badge>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{draft.progress}% complete</Badge>
              <Badge variant="secondary">
                <Zap className="h-3 w-3" />
                Auto-save
              </Badge>

              {draft.aiSuggestions && draft.aiSuggestions > 0 && (
                <Badge
                  variant="outline"
                  className="cursor-pointer border-purple-500 text-purple-500 hover:bg-purple-50"
                  onClick={() => handleAIAssistance(draft)}
                >
                  <Bot className="h-3 w-3" />
                  {draft.aiSuggestions} AI suggestions
                </Badge>
              )}

              {draft.collaborators && draft.collaborators.length > 0 && (
                <Badge variant="outline">
                  <Users className="h-3 w-3" />
                  {draft.collaborators.length} collaborators
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mb-2 text-sm">
              {draft.course} • {draft.category}
            </p>

            <div className="text-muted-foreground mb-2 flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last saved: {draft.lastSaved}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {draft.wordCount} words
              </span>
              {draft.dueDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Due: {new Date(draft.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>

            <Progress value={draft.progress} className="mt-2 h-2" />
          </div>

          <div className="flex flex-col gap-2">
            <TooltipProvider delayDuration={0}>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDraft(draft);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="ml-1 hidden lg:inline">
                        Resume Editing
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="lg:hidden">
                    <p>Resume Editing</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAIAssistance(draft)}
                    >
                      <Bot className="h-4 w-4" />
                      <span className="hidden lg:inline">AI Help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="lg:hidden">
                    <p>AI Help</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareDraft(draft)}
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="hidden lg:inline">Share</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="lg:hidden">
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>

                <AlertDialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden lg:inline">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="lg:hidden">
                      <p>Delete</p>
                    </TooltipContent>
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
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    );
  }

  function DiscussionItem({ discussion }: { discussion: TDiscussion }) {
    return (
      <div className="hover:bg-muted/20 flex flex-col gap-3 rounded-lg border p-4 shadow-md transition-all hover:shadow-lg">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h4 className="font-semibold">{discussion.title}</h4>

              {discussion.isResolved && (
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-500"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Resolved
                </Badge>
              )}

              {discussion.isBookmarked && (
                <Badge
                  variant="outline"
                  className="border-yellow-500 text-yellow-500"
                >
                  <Star className="h-3 w-3" />
                  Bookmarked
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mb-2 text-sm">
              {discussion.course} • by {discussion.author}
            </p>

            <div className="text-muted-foreground mb-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {discussion.replies} replies
              </span>

              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {discussion.views} views
              </span>

              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {discussion.lastReply}
              </span>
            </div>

            {discussion.tags && discussion.tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDiscussion(discussion);
                }}
              >
                <MessageSquare className="h-4 w-4" />
                Reply
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBookmarkDiscussion(discussion.id)}
              >
                <Star
                  className={`h-4 w-4 ${discussion.isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''}`}
                />
              </Button>
            </div>

            {!discussion.isResolved && discussion.author === 'You' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResolveDiscussion(discussion.id)}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Resolved
              </Button>
            )}
          </div>
        </div>

        {selectedDiscussion?.id === discussion.id && (
          <div className="mt-2 border-t pt-3">
            <div className="space-y-2">
              <Label htmlFor={`reply-${discussion.id}`}>Write a reply</Label>
              <Textarea
                id={`reply-${discussion.id}`}
                placeholder="Share your thoughts or ask a question..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={3}
              />

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleReplyToDiscussion(discussion)}
                  disabled={!replyContent.trim()}
                >
                  <Send className="h-4 w-4" />
                  Post Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDiscussion(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function DraftAssignmentsSection() {
    const { data: drafts, isLoading } = useDrafts();
    const { mutate: createDraft, isPending: isCreating } = useCreateDraft();
    const [isNewDraftDialogOpen, setIsNewDraftDialogOpen] = useState(false);

    const form = useForm<CreateDraftInput>({
      resolver: zodResolver(createDraftInputSchema),
      defaultValues: { title: '', category: '', priority: 'medium' },
    });

    const onSubmit = (values: CreateDraftInput) => {
      // A real implementation would get assignmentId from a selector within the form
      createDraft(
        { ...values, assignmentId: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1' },
        {
          onSuccess: () => {
            setIsNewDraftDialogOpen(false);
            form.reset();
          },
        }
      );
    };

    if (isLoading) return <DraftAssignmentsSectionSkeleton />;
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Draft Assignments
                <Badge variant="secondary">{drafts.length}</Badge>
              </CardTitle>
              <CardDescription>
                Continue working on your saved drafts
              </CardDescription>
            </div>

            <Dialog
              open={isNewDraftDialogOpen}
              onOpenChange={setIsNewDraftDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4" />
                  New Draft
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Draft</DialogTitle>
                  <DialogDescription>
                    Start a new assignment draft with AI assistance
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="draft-title">Title</Label>
                    <Input
                      id="draft-title"
                      value={newDraftForm.title}
                      onChange={(e) =>
                        setNewDraftForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter assignment title..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="draft-course">Course</Label>
                    <Input
                      id="draft-course"
                      value={newDraftForm.course}
                      onChange={(e) =>
                        setNewDraftForm((prev) => ({
                          ...prev,
                          course: e.target.value,
                        }))
                      }
                      placeholder="Enter course name..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="draft-category">Category</Label>
                    <Select
                      value={newDraftForm.category}
                      onValueChange={(value) =>
                        setNewDraftForm((prev) => ({
                          ...prev,
                          category: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical Report">
                          Technical Report
                        </SelectItem>
                        <SelectItem value="Research Paper">
                          Research Paper
                        </SelectItem>
                        <SelectItem value="Analysis Report">
                          Analysis Report
                        </SelectItem>
                        <SelectItem value="Essay">Essay</SelectItem>
                        <SelectItem value="Case Study">Case Study</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="draft-priority">Priority</Label>
                      <Select
                        value={newDraftForm.priority}
                        onValueChange={(value: 'low' | 'medium' | 'high') =>
                          setNewDraftForm((prev) => ({
                            ...prev,
                            priority: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="draft-due">Due Date</Label>
                      <Input
                        id="draft-due"
                        type="date"
                        value={newDraftForm.dueDate}
                        onChange={(e) =>
                          setNewDraftForm((prev) => ({
                            ...prev,
                            dueDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsNewDraftDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateNewDraft}
                    disabled={!newDraftForm.title || !newDraftForm.course}
                  >
                    Create Draft
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {drafts.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No drafts yet. Create your first draft to get started!</p>
            </div>
          ) : (
            drafts.map((draft) => (
              <DraftAssignmentItem key={draft.id} draft={draft} />
            ))
          )}
        </CardContent>
      </Card>
    );
  }

  function AssignmentDiscussionsSection() {
    const { data: discussions, isLoading } = useDiscussions(courseId!);

    if (isLoading) return <AssignmentDiscussionsSectionSkeleton />;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Assignment Discussions
                <Badge variant="secondary">{discussions.length}</Badge>
              </CardTitle>
              <CardDescription>
                Get help and discuss assignments with classmates
              </CardDescription>
            </div>

            <Dialog
              open={isNewDiscussionDialogOpen}
              onOpenChange={setIsNewDiscussionDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4" />
                  Start New Discussion
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start New Discussion</DialogTitle>
                  <DialogDescription>
                    Ask a question or start a discussion about your assignment
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="discussion-title">Title</Label>
                    <Input
                      id="discussion-title"
                      value={newDiscussionForm.title}
                      onChange={(e) =>
                        setNewDiscussionForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="What's your question or topic?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discussion-course">Course</Label>
                    <Input
                      id="discussion-course"
                      value={newDiscussionForm.course}
                      onChange={(e) =>
                        setNewDiscussionForm((prev) => ({
                          ...prev,
                          course: e.target.value,
                        }))
                      }
                      placeholder="Which course is this about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discussion-content">Content</Label>
                    <Textarea
                      id="discussion-content"
                      value={newDiscussionForm.content}
                      onChange={(e) =>
                        setNewDiscussionForm((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      placeholder="Provide more details about your question..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discussion-tags">
                      Tags (comma separated)
                    </Label>
                    <Input
                      id="discussion-tags"
                      value={newDiscussionForm.tags}
                      onChange={(e) =>
                        setNewDiscussionForm((prev) => ({
                          ...prev,
                          tags: e.target.value,
                        }))
                      }
                      placeholder="e.g., database, react, testing"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsNewDiscussionDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateNewDiscussion}
                    disabled={
                      !newDiscussionForm.title || !newDiscussionForm.course
                    }
                  >
                    Start Discussion
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {discussions.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No discussions yet. Start the first discussion!</p>
            </div>
          ) : (
            discussions.map((d) => <DiscussionItem key={d.id} discussion={d} />)
          )}
        </CardContent>
      </Card>
    );
  }

  const AIAssistanceDialog = () => (
    <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-500" />
            AI Writing Assistant
            {selectedDraft && (
              <Badge variant="outline">{selectedDraft.title}</Badge>
            )}
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
              onClick={handleGenerateAISuggestions}
              disabled={isGeneratingAI}
            >
              {isGeneratingAI ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="h-4 w-4" />
              )}
              Generate New Suggestions
            </Button>
          </div>

          <ScrollArea className="h-72">
            <div className="space-y-3 p-4">
              {isGeneratingAI
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="mb-1 h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))
                : aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="hover:bg-muted/50 rounded-lg border p-3"
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
                  ))}
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
                  <BookOpen className="h-4 w-4" />
                  Grammar Check
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Lightbulb className="h-4 w-4" />
                  Content Suggestions
                </Button>
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
                  <span className="text-red-600">Needs Work</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsAiDialogOpen(false)}>
            Close
          </Button>
          <Button>Apply All Suggestions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const ShareDialog = () => (
    <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
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
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
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

          <div>
            <Label htmlFor="collaborator-email">Add Collaborators</Label>
            <div className="mt-1 flex items-center gap-2">
              <Input
                id="collaborator-email"
                placeholder="Enter email address..."
                className="flex-1"
              />
              <Button size="sm">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          {selectedDraft?.collaborators &&
            selectedDraft.collaborators.length > 0 && (
              <div>
                <Label>Current Collaborators</Label>
                <div className="mt-2 space-y-2">
                  {selectedDraft.collaborators.map((collaborator, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
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
                        className="text-red-500"
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
          <Button variant="ghost" onClick={() => setIsShareDialogOpen(false)}>
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

  const EditDialog = () => (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-h-[90vh] w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            {selectedDraft?.title}
            <Badge
              variant="outline"
              className={getStatusColor(selectedDraft?.status || '')}
            >
              {selectedDraft?.status}
            </Badge>
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
                  defaultValue="# Database Schema Design

                  ## Introduction

                  Database schema design is a critical aspect of database management that involves organizing data to minimize redundancy and improve data integrity. This report explores the fundamental principles and best practices for designing effective database schemas.

                  ## Key Principles

                  ### 1. Normalization
                  Database normalization is the process of structuring a database to reduce redundancy and improve data integrity. The main goals include:
                  - Eliminating duplicate data
                  - Ensuring data dependencies make sense
                  - Reducing storage space

                  ### 2. Entity-Relationship Modeling
                  Entity-relationship (ER) modeling helps visualize the logical structure of databases. Key components include:
                  - Entities: Objects or concepts
                  - Attributes: Properties of entities
                  - Relationships: Connections between entities

                  ## Conclusion

                  Effective database schema design requires careful consideration of data relationships, performance requirements, and future scalability needs."
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
                    <span>{selectedDraft?.wordCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span>{selectedDraft?.progress || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="capitalize">{selectedDraft?.status}</span>
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
                    onClick={() => setIsAiDialogOpen(true)}
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
                    onClick={() => handleShareDraft(selectedDraft!)}
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
          <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
            Close
          </Button>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4">
      <DraftAssignmentsSection />
      <AssignmentDiscussionsSection />

      <AIAssistanceDialog />
      <ShareDialog />
      <EditDialog />
    </div>
  );
}

export function DraftsTabSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-8" />
              </div>
              <Skeleton className="mt-2 h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <DraftAssignmentItemSkeleton />
          <DraftAssignmentItemSkeleton />
          <DraftAssignmentItemSkeleton />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-8" />
              </div>
              <Skeleton className="mt-2 h-4 w-72" />
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
    </div>
  );
}
function DraftAssignmentItemSkeleton() {
  return (
    <div className="rounded-lg border p-4 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="mb-3 flex items-center gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="mb-2 h-4 w-64" />
          <div className="mb-2 flex items-center gap-4">
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
    <div className="rounded-lg border p-4 shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="mb-2 h-4 w-48" />
          <div className="mb-2 flex items-center gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-18" />
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

export function DraftAssignmentsSectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-5 w-10 rounded" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-48 rounded" />
            </CardDescription>
          </div>
          <Skeleton className="h-8 w-24 rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <Skeleton className="h-6 w-1/2 rounded" />
            <Skeleton className="h-6 w-20 rounded" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AssignmentDiscussionsSectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-5 w-10 rounded" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-48 rounded" />
            </CardDescription>
          </div>
          <Skeleton className="h-8 w-36 rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
