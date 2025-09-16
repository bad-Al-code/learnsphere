'use client';

import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Edit3,
  Eye,
  FileText,
  Hash,
  Lightbulb,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  StickyNote,
  Target,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import {
  useAnalyzeNote,
  useCreateNote,
  useDeleteNote,
  useGetNotes,
  useUpdateNote,
} from '../hooks/useAiNotes';
import { NoteInsights, UserNote } from '../schemas/notes.schema';

type TInsightCategory = 'concepts' | 'actions' | 'gaps';
type TSortOption = 'recent' | 'title' | 'created' | 'analyzed';
type TViewMode = 'list' | 'grid' | 'compact';

interface NoteStats {
  totalNotes: number;
  analyzedNotes: number;
  totalConcepts: number;
  totalActions: number;
  completionRate: number;
}

function NoteManager({
  activeNote,
  setActiveNote,
  courseId,
  isCollapsed,
  setIsCollapsed,
}: {
  activeNote: UserNote | null;
  setActiveNote: (note: UserNote | null) => void;
  courseId: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}) {
  const { data: notes, isLoading } = useGetNotes(courseId);
  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: deleteNote } = useDeleteNote();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<TSortOption>('recent');
  const [viewMode, setViewMode] = useState<TViewMode>('list');
  const [showOnlyAnalyzed, setShowOnlyAnalyzed] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());

  const filteredNotes =
    notes
      ?.filter((note) => {
        const matchesSearch =
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = !showOnlyAnalyzed || note.insights !== null;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'created':
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case 'analyzed':
            if (a.insights && !b.insights) return -1;
            if (!a.insights && b.insights) return 1;
            return 0;
          case 'recent':
          default:
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
        }
      }) || [];

  const stats: NoteStats = {
    totalNotes: notes?.length || 0,
    analyzedNotes: notes?.filter((n) => n.insights).length || 0,
    totalConcepts:
      notes?.reduce(
        (acc, n) => acc + (n.insights?.keyConcepts?.length || 0),
        0
      ) || 0,
    totalActions:
      notes?.reduce(
        (acc, n) => acc + (n.insights?.studyActions?.length || 0),
        0
      ) || 0,
    completionRate: notes?.length
      ? (notes.filter((n) => n.insights).length / notes.length) * 100
      : 0,
  };

  const handleNewNote = () => {
    createNote(
      { courseId, title: `Note ${(notes?.length || 0) + 1}` },
      {
        onSuccess: (result) => {
          if (result.data) {
            setActiveNote(result.data);
            toast.success('New note created.');
          } else {
            toast.error(result.error);
          }
        },
      }
    );
  };

  const handleDelete = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId, {
        onSuccess: () => {
          if (activeNote?.id === noteId) {
            setActiveNote(null);
          }
          setSelectedNotes((prev) => {
            const newSet = new Set(prev);
            newSet.delete(noteId);
            return newSet;
          });
          toast.success('Note deleted.');
        },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const handleBulkDelete = () => {
    if (selectedNotes.size === 0) return;
    if (confirm(`Delete ${selectedNotes.size} selected notes?`)) {
      selectedNotes.forEach((noteId) => {
        deleteNote(noteId, {
          onSuccess: () => {
            if (activeNote?.id === noteId) {
              setActiveNote(null);
            }
          },
        });
      });
      setSelectedNotes(new Set());
      toast.success(`${selectedNotes.size} notes deleted.`);
    }
  };

  const toggleNoteSelection = (noteId: string) => {
    setSelectedNotes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card className="flex h-full flex-col border-r">
        <CardHeader className="bg-background/50 border-b">
          <div className="flex items-center justify-between">
            <div
              className={cn(
                'transition-all duration-200',
                isCollapsed && 'w-0 overflow-hidden opacity-0'
              )}
            >
              <Skeleton className="h-6 w-32" />
              <Skeleton className="mt-2 h-4 w-48" />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-muted h-8 w-8 p-0"
                >
                  {isCollapsed ? (
                    <PanelLeftOpen className="h-4 w-4" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-3">
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col border-none shadow-sm">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'opacity-100'
            )}
          >
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-secondary rounded-md p-1.5">
                <StickyNote className="text-primary h-4 w-4" />
              </div>
              My Notes
              {/* <Badge
                variant="secondary"
                className="ml-2 px-2 py-0.5 text-xs font-medium"
              >
                {stats.totalNotes}
              </Badge> */}
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              Organize your learning journey
            </CardDescription>
          </div>

          <div className="flex items-center gap-1">
            {!isCollapsed && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setShowStats(!showStats)}
                      variant="outline"
                      size="icon"
                    >
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showStats ? 'Hide statistics' : 'Show statistics'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    variant="outline"
                    size="icon"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {showStats && !isCollapsed && (
          <div className="animate-in fade-in-50 mt-4 space-y-3 duration-200">
            <div className="from-muted/50 to-muted/5 rounded-lg border bg-gradient-to-br p-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="hover:bg-background/50 flex items-center gap-2 rounded p-2 transition-colors">
                        <div className="rounded bg-blue-100 p-1 dark:bg-blue-900">
                          <FileText className="h-3 w-3 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-semibold">
                            {stats.totalNotes}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Total
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total number of notes created</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="hover:bg-background/50 flex items-center gap-2 rounded p-2 transition-colors">
                        <div className="rounded bg-green-100 p-1 dark:bg-green-900">
                          <Brain className="h-3 w-3 text-green-600 dark:text-green-300" />
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-semibold">
                            {stats.analyzedNotes}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Analyzed
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notes with AI analysis completed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="hover:bg-background/50 flex items-center gap-2 rounded p-2 transition-colors">
                        <div className="rounded bg-yellow-100 p-1 dark:bg-yellow-900">
                          <Lightbulb className="h-3 w-3 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-semibold">
                            {stats.totalConcepts}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Concepts
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Key concepts identified by AI</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="hover:bg-background/50 flex items-center gap-2 rounded p-2 transition-colors">
                        <div className="rounded bg-purple-100 p-1 dark:bg-purple-900">
                          <Target className="h-3 w-3 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-semibold">
                            {stats.totalActions}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Actions
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Suggested study actions from AI</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Analysis Progress
                  </span>
                  <span className="text-muted-foreground font-mono text-xs">
                    {Math.round(stats.completionRate)}%
                  </span>
                </div>

                <Progress
                  value={stats.completionRate}
                  className="h-2 [&_[data-state=complete]]:bg-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="">
                  <FileText className="text-muted-foreground h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Total Notes: {stats.totalNotes}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="">
                  <Brain className="text-muted-foreground h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Analyzed Notes: {stats.analyzedNotes}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {!isCollapsed && (
          <div className="mt-4 space-y-3">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-4 pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as TSortOption)}
              >
                <SelectTrigger className="">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">🕐 Recent</SelectItem>
                  <SelectItem value="title">🔤 Title A-Z</SelectItem>
                  <SelectItem value="created">📅 Created Date</SelectItem>
                  <SelectItem value="analyzed">🧠 Analyzed First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-pointer items-center space-x-2">
                    <Switch
                      id="analyzed-only"
                      checked={showOnlyAnalyzed}
                      onCheckedChange={setShowOnlyAnalyzed}
                    />
                    <Label htmlFor="analyzed-only" className="text-sm">
                      Analyzed only
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show only notes with AI analysis</p>
                </TooltipContent>
              </Tooltip>

              {selectedNotes.size > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleBulkDelete}
                        variant="destructive"
                        size="sm"
                        className="h-8 px-2"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        {selectedNotes.size}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete {selectedNotes.size} selected notes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent
        className={cn(
          'flex-1 overflow-y-auto transition-all duration-200',
          isCollapsed ? 'p-2' : 'p-3'
        )}
      >
        {isCollapsed ? (
          <div className="space-y-2">
            {filteredNotes.slice(0, 10).map((note) => (
              <TooltipProvider key={note.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        activeNote?.id === note.id ? 'secondary' : 'ghost'
                      }
                      className="relative h-10 w-full p-2"
                      onClick={() => setActiveNote(note)}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {note.insights && (
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                        )}
                      </div>
                      {activeNote?.id === note.id && (
                        <div className="bg-primary absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r" />
                      )}
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent side="right">
                    <div className="max-w-sm">
                      <p className="font-medium">{note.title}</p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {formatRelativeTime(note.updatedAt)}
                      </p>
                      {note.content && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          {note.content.substring(0, 100)}...
                        </p>
                      )}
                      {note.insights && (
                        <Badge variant="outline" className="mt-2">
                          AI Analyzed
                        </Badge>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            {filteredNotes.length > 10 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-muted-foreground flex items-center justify-center py-2 text-xs">
                      +{filteredNotes.length - 10} more
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Expand sidebar to see all notes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotes.map((note) => (
              <div key={note.id} className="group relative">
                <div
                  className={cn(
                    'hover:border-primary/20 flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-sm',
                    activeNote?.id === note.id
                      ? 'bg-primary/5 border-primary/20 shadow-sm'
                      : 'hover:bg-muted/50',
                    selectedNotes.has(note.id) && 'ring-primary/50 ring-2'
                  )}
                  onClick={() => setActiveNote(note)}
                >
                  <div
                    className="flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNoteSelection(note.id);
                    }}
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 cursor-pointer items-center justify-center rounded border-2 transition-colors',
                        selectedNotes.has(note.id)
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground/30 hover:border-primary'
                      )}
                    >
                      {selectedNotes.has(note.id) && (
                        <CheckCircle2 className="text-primary-foreground h-3 w-3" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate font-medium">{note.title}</h4>
                      <div className="flex items-center gap-1">
                        {note.insights && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="rounded-full bg-green-100 p-0.5 dark:bg-green-900">
                                  <Brain className="h-3 w-3 text-green-600 dark:text-green-400" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>AI Analysis Complete</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {note.content && note.content.length > 100 && (
                          <Badge
                            variant="outline"
                            className="h-5 px-1 py-0 text-xs"
                          >
                            {Math.ceil(note.content.length / 100)}k chars
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(note.updatedAt)}
                      </span>
                      {note.insights && (
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="h-4 px-1.5 text-xs"
                          >
                            {(note.insights.keyConcepts?.length || 0) +
                              (note.insights.studyActions?.length || 0) +
                              (note.insights.knowledgeGaps?.length || 0)}{' '}
                            insights
                          </Badge>
                        </div>
                      )}
                    </div>
                    {note.content && (
                      <p className="text-muted-foreground mt-1 truncate text-xs">
                        {note.content.substring(0, 80)}...
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>More options</p>
                        </TooltipContent>
                      </Tooltip>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setActiveNote(note)}>
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(note.content || '')
                        }
                      >
                        <Copy className="h-4 w-4" />
                        Copy Content
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(note.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {filteredNotes.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <StickyNote className="text-muted-foreground h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-medium">
                  {searchTerm || showOnlyAnalyzed
                    ? 'No matching notes found'
                    : 'No notes yet'}
                </h3>
                <p className="text-muted-foreground max-w-sm text-sm">
                  {searchTerm || showOnlyAnalyzed
                    ? 'Try adjusting your filters or search terms'
                    : 'Create your first note to get started with your learning journey'}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter
        className={cn('bg-background/50 border-t pt-3', isCollapsed && 'px-2')}
      >
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleNewNote}
                  disabled={isCreating}
                  size="sm"
                  className="h-10 w-full"
                >
                  {isCreating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Create new note</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            onClick={handleNewNote}
            disabled={isCreating}
            className="w-full"
            size="lg"
          >
            {isCreating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            New Note
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function NoteEditor({
  activeNote,
  setActiveNote,
}: {
  activeNote: UserNote | null;
  setActiveNote: (note: UserNote) => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [debouncedContent] = useDebounce(content, autoSave ? 1000 : 0);
  const [debouncedTitle] = useDebounce(title, autoSave ? 1000 : 0);
  const { mutate: updateNote, isPending: isSaving } = useUpdateNote();
  const { mutate: analyzeNote, isPending: isAnalyzing } = useAnalyzeNote();

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content || '');
      setWordCount(
        activeNote.content ? activeNote.content.split(/\s+/).length : 0
      );
      setHasUnsavedChanges(false);
    }
  }, [activeNote]);

  useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).length;
      setWordCount(content.trim() === '' ? 0 : words);
    }
  }, [content]);

  useEffect(() => {
    if (activeNote && autoSave) {
      if (debouncedContent !== activeNote.content && debouncedContent !== '') {
        updateNote(
          {
            noteId: activeNote.id,
            content: debouncedContent,
          },
          {
            onSuccess: () => {
              setLastSaved(new Date());
              setHasUnsavedChanges(false);
            },
          }
        );
      }
      if (debouncedTitle !== activeNote.title && debouncedTitle.trim() !== '') {
        updateNote(
          {
            noteId: activeNote.id,
            title: debouncedTitle,
          },
          {
            onSuccess: () => {
              setLastSaved(new Date());
              setHasUnsavedChanges(false);
            },
          }
        );
      }
    }
  }, [debouncedContent, debouncedTitle, activeNote, updateNote, autoSave]);

  const handleManualSave = () => {
    if (!activeNote || !hasUnsavedChanges) return;
    updateNote(
      {
        noteId: activeNote.id,
        title,
        content,
      },
      {
        onSuccess: () => {
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
          toast.success('Note saved!');
        },
      }
    );
  };

  const handleAnalyze = () => {
    if (!activeNote) return;
    analyzeNote(activeNote.id, {
      onSuccess: (result) => {
        if (result.data) {
          setActiveNote(result.data);
          toast.success('Note analysis complete!');
        }
      },
    });
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    if (autoSave) {
      setHasUnsavedChanges(true);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (autoSave) {
      setHasUnsavedChanges(true);
    }
  };

  if (!activeNote) {
    return (
      <Card className="m-1 flex h-full items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <Edit3 className="text-muted-foreground h-8 w-8" />
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Ready to take notes?</h3>
            <p className="text-muted-foreground">
              Select a note to start editing or create a new one.
            </p>
          </div>

          <div className="text-muted-foreground flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              AI Analysis
            </div>
            <div className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Auto-save
            </div>
            <div className="flex items-center gap-1">
              <Hash className="h-4 w-4" />
              Word Count
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'm-1 flex h-full flex-col',
        isFullscreen && 'fixed inset-0 z-50'
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="text-primary h-5 w-5" />
            <div>
              <CardTitle className="text-lg">Note Editor</CardTitle>
              <CardDescription className="text-sm">
                {lastSaved
                  ? `Last saved: ${lastSaved.toLocaleTimeString()}`
                  : 'Not saved yet'}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
              <Label htmlFor="auto-save" className="text-sm">
                Auto-save
              </Label>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  variant="ghost"
                  size="sm"
                >
                  {isFullscreen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {wordCount} words
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {content.length} characters
            </div>
            {hasUnsavedChanges && !autoSave && (
              <Badge variant="destructive" className="text-xs">
                Unsaved
              </Badge>
            )}
            {isSaving && (
              <div className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Saving...
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={activeNote.insights ? 'default' : 'secondary'}
              className="text-xs"
            >
              {activeNote.insights ? 'Analyzed' : 'Not Analyzed'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-2 p-2">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note Title"
          className="border-none bg-transparent text-lg font-semibold shadow-none focus-visible:ring-0"
        />
        <Separator />

        <div className="relative flex-1">
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start taking notes... Use **bold**, *italic*, and - bullet points for formatting"
            className="h-full min-h-[300px] flex-1 resize-none border-none bg-transparent shadow-none focus-visible:ring-0"
          />
          {content.length === 0 && (
            <div className="text-muted-foreground absolute top-16 left-4 space-y-2 text-sm">
              <p>
                💡 <strong>Quick tips:</strong>
              </p>
              <p>• Write your thoughts and key concepts</p>
              <p>• Use the AI analysis to get insights</p>
              <p>• Notes auto-save as you type</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-between pt-2">
        <div className="flex items-center gap-2">
          {!autoSave && (
            <Button
              onClick={handleManualSave}
              disabled={!hasUnsavedChanges || isSaving}
              variant="outline"
              size="sm"
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
          )}
          <Button
            onClick={() => navigator.clipboard.writeText(content)}
            variant="outline"
            size="sm"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={
            isAnalyzing ||
            !activeNote.content ||
            activeNote.content.trim().length < 10
          }
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              AI Analysis
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function AiInsights({
  insights,
  activeNote,
}: {
  insights: NoteInsights | null;
  activeNote: UserNote | null;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['concepts', 'actions', 'gaps'])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'concepts':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'actions':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'gaps':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case 'concepts':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      case 'actions':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
      case 'gaps':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      default:
        return 'border-muted bg-muted/50';
    }
  };

  return (
    <Card className="m-1 flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="text-primary h-5 w-5" />
            <CardTitle>AI Insights</CardTitle>
          </div>
          {insights && (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Analyzed
            </Badge>
          )}
        </div>
        <CardDescription>
          {insights
            ? 'Smart analysis of your notes'
            : 'Analyze your note to get AI-powered insights'}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        {!insights ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
              <Brain className="text-muted-foreground h-8 w-8" />
            </div>
            <div>
              <h3 className="mb-2 font-medium">Ready for AI Analysis?</h3>
              <p className="text-muted-foreground mb-4 max-w-sm text-sm">
                Write some content in your note and click "AI Analysis" to get
                personalized insights, study suggestions, and identify knowledge
                gaps.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="text-muted-foreground flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span>Key concepts identification</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span>Personalized study actions</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span>Knowledge gap analysis</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-950/50 dark:to-purple-950/50">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">Analysis Summary</h4>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {insights.keyConcepts?.length || 0}
                  </div>
                  <div className="text-muted-foreground">Concepts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {insights.studyActions?.length || 0}
                  </div>
                  <div className="text-muted-foreground">Actions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {insights.knowledgeGaps?.length || 0}
                  </div>
                  <div className="text-muted-foreground">Gaps</div>
                </div>
              </div>
            </div>

            {insights.keyConcepts && insights.keyConcepts.length > 0 && (
              <div
                className={cn(
                  'rounded-lg border p-4',
                  getSectionColor('concepts')
                )}
              >
                <button
                  onClick={() => toggleSection('concepts')}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    {getSectionIcon('concepts')}
                    <h4 className="font-medium">Key Concepts Identified</h4>
                    <Badge variant="secondary" className="text-xs">
                      {insights.keyConcepts.length}
                    </Badge>
                  </div>
                  <ArrowRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      expandedSections.has('concepts') ? 'rotate-90' : ''
                    )}
                  />
                </button>

                {expandedSections.has('concepts') && (
                  <div className="mt-3 space-y-2">
                    {insights.keyConcepts.map((concept, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-500" />
                        <p className="text-sm">{concept}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {insights.studyActions && insights.studyActions.length > 0 && (
              <div
                className={cn(
                  'rounded-lg border p-4',
                  getSectionColor('actions')
                )}
              >
                <button
                  onClick={() => toggleSection('actions')}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    {getSectionIcon('actions')}
                    <h4 className="font-medium">Suggested Study Actions</h4>
                    <Badge variant="secondary" className="text-xs">
                      {insights.studyActions.length}
                    </Badge>
                  </div>
                  <ArrowRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      expandedSections.has('actions') ? 'rotate-90' : ''
                    )}
                  />
                </button>

                {expandedSections.has('actions') && (
                  <div className="mt-3 space-y-2">
                    {insights.studyActions.map((action, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                          {index + 1}
                        </div>
                        <p className="text-sm">{action}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {insights.knowledgeGaps && insights.knowledgeGaps.length > 0 && (
              <div
                className={cn('rounded-lg border p-4', getSectionColor('gaps'))}
              >
                <button
                  onClick={() => toggleSection('gaps')}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    {getSectionIcon('gaps')}
                    <h4 className="font-medium">Knowledge Gaps to Address</h4>
                    <Badge variant="secondary" className="text-xs">
                      {insights.knowledgeGaps.length}
                    </Badge>
                  </div>
                  <ArrowRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      expandedSections.has('gaps') ? 'rotate-90' : ''
                    )}
                  />
                </button>

                {expandedSections.has('gaps') && (
                  <div className="mt-3 space-y-2">
                    {insights.knowledgeGaps.map((gap, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                        <p className="text-sm">{gap}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium">
                <Zap className="h-4 w-4 text-purple-500" />
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const insightsText = `
                      # AI Analysis Results

                      ## Key Concepts (${insights.keyConcepts?.length || 0})
                      ${insights.keyConcepts?.map((c) => `• ${c}`).join('\n') || 'None identified'}

                      ## Study Actions (${insights.studyActions?.length || 0})
                      ${insights.studyActions?.map((a, i) => `${i + 1}. ${a}`).join('\n') || 'None suggested'}

                      ## Knowledge Gaps (${insights.knowledgeGaps?.length || 0})
                      ${insights.knowledgeGaps?.map((g) => `• ${g}`).join('\n') || 'None identified'}
                    `;
                    navigator.clipboard.writeText(insightsText);
                    toast.success('Insights copied!');
                  }}
                >
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob(
                      [
                        `AI Analysis for: ${activeNote?.title}\n\n${JSON.stringify(insights, null, 2)}`,
                      ],
                      { type: 'text/plain' }
                    );

                    element.href = URL.createObjectURL(file);
                    element.download = `analysis-${activeNote?.title?.replace(/\s+/g, '-') || 'note'}.txt`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    toast.success('Analysis exported!');
                  }}
                >
                  <Download className="mr-1 h-3 w-3" />
                  Export
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Study Progress</span>
                <span className="text-muted-foreground text-sm">
                  Track your learning journey
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Concepts Learned</span>
                  <span>{insights.keyConcepts?.length || 0}/10</span>
                </div>

                <Progress
                  value={Math.min(
                    (insights.keyConcepts?.length || 0) * 10,
                    100
                  )}
                  className="h-1"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SmartNotesTab({ courseId }: { courseId?: string }) {
  const [activeNote, setActiveNote] = useState<UserNote | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!courseId) {
    return (
      <div className="flex h-full min-h-[600px] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <BookOpen className="text-muted-foreground h-8 w-8" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium">No Course Selected</h3>
            <p className="text-muted-foreground">
              Please select a course to start taking smart notes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full min-h-[600px] rounded-lg border"
      >
        <ResizablePanel
          defaultSize={isCollapsed ? 5 : 30}
          minSize={isCollapsed ? 5 : 20}
          maxSize={isCollapsed ? 5 : 40}
          className={cn(
            'transition-all duration-300 ease-in-out',
            isCollapsed && 'max-w-[60px] min-w-[60px]'
          )}
        >
          <NoteManager
            activeNote={activeNote}
            setActiveNote={setActiveNote}
            courseId={courseId}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={40}>
          <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-2">
            <NoteEditor activeNote={activeNote} setActiveNote={setActiveNote} />
            <AiInsights
              insights={activeNote?.insights || null}
              activeNote={activeNote}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

export function SmartNotesTabSkeleton() {
  const [isCollapsed] = useState(false);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full min-h-[600px] rounded-lg border"
    >
      <ResizablePanel
        defaultSize={isCollapsed ? 5 : 25}
        minSize={isCollapsed ? 5 : 20}
        maxSize={isCollapsed ? 5 : 40}
        className={cn(
          'transition-all duration-300 ease-in-out',
          isCollapsed && 'max-w-[60px] min-w-[60px]'
        )}
      >
        <NoteManagerSkeleton isCollapsed={isCollapsed} />
      </ResizablePanel>
      <ResizablePanel defaultSize={75} minSize={40}>
        <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-2">
          <NoteEditorSkeleton />
          <AiInsightsSkeleton />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function NoteManagerSkeleton({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <Card className="flex h-full flex-col border-none">
      <CardHeader className="bg-background/50 border-b">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'transition-all duration-200',
              isCollapsed && 'w-0 overflow-hidden opacity-0'
            )}
          >
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>

        {!isCollapsed && (
          <>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
              <Skeleton className="h-2 w-full" />
            </div>

            <div className="mt-4 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </>
        )}

        {isCollapsed && (
          <div className="mt-4 space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
      </CardHeader>

      <CardContent className={cn('flex-1', isCollapsed ? 'p-2' : 'p-3')}>
        {isCollapsed ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter
        className={cn('bg-background/50 border-t', isCollapsed && 'px-2')}
      >
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

function NoteEditorSkeleton() {
  return (
    <Card className="m-1 flex h-full flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="mt-1 h-4 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-2 p-2">
        <Skeleton className="h-10 w-full" />
        <div className="bg-border h-px w-full" />
        <Skeleton className="min-h-[300px] w-full flex-1" />
      </CardContent>

      <CardFooter className="justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
        </div>
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );
}

function AiInsightsSkeleton() {
  return (
    <div className="m-1">
      <Card className="flex h-full flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-48" />
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <div className="rounded-lg border p-4">
            <Skeleton className="mb-2 h-5 w-32" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1 text-center">
                  <Skeleton className="mx-auto h-8 w-8" />
                  <Skeleton className="mx-auto h-4 w-16" />
                </div>
              ))}
            </div>
          </div>

          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex gap-2">
                    <Skeleton className="mt-0.5 h-4 w-4" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-3 border-t pt-4">
            <Skeleton className="h-5 w-24" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
