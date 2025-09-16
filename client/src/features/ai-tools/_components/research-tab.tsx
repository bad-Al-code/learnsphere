'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  Brain,
  Calendar,
  Clock,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Globe,
  Hash,
  Plus,
  Save,
  Search,
  Share2,
  SortAsc,
  Sparkles,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  useDeleteFinding,
  useGetResearchBoard,
  usePerformResearch,
  useSaveFinding,
  useSummarizeFinding,
  useUpdateFindingNotes,
} from '../hooks/useAiResearch';
import {
  PerformResearchInput,
  performResearchInputSchema,
  ResearchFinding,
  TempFinding,
} from '../schemas/research.schema';

function ResearchQueryPanel({
  setSearchResults,
  courseId,
}: {
  setSearchResults: (results: TempFinding[]) => void;
  courseId: string;
}) {
  const { mutate: performResearch, isPending } = usePerformResearch();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions] = useState([
    'Database indexing strategies',
    'PostgreSQL performance tuning',
    'SQL query optimization',
    'Database normalization principles',
    'NoSQL vs SQL databases',
    'Data modeling best practices',
  ]);

  const form = useForm<PerformResearchInput>({
    resolver: zodResolver(performResearchInputSchema),
    defaultValues: { courseId, query: '' },
  });

  const onSubmit = (values: PerformResearchInput) => {
    toast.info('🔍 AI is conducting comprehensive research...');

    if (!searchHistory.includes(values.query)) {
      setSearchHistory((prev) => [values.query, ...prev.slice(0, 4)]);
    }

    performResearch(values, {
      onSuccess: (result) => {
        if (result.data) {
          setSearchResults(result.data);
          toast.success(`✨ Found ${result.data.length} relevant sources!`);
        } else {
          toast.error(result.error || 'Research failed');
        }
      },
      onError: (err) => toast.error(`Research error: ${err.message}`),
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
            <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Research Assistant</CardTitle>
            <CardDescription className="text-sm">
              Intelligent research with source verification and AI summarization
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 border">
                    Research Topic
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Brain className="text-muted-foreground h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Enter your research topic. Our AI will find the most
                            relevant and credible sources.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="e.g., Database Indexing Strategies, Machine Learning Algorithms..."
                        className="pr-10"
                        {...field}
                      />
                      <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {suggestions.length > 0 && (
              <div className="space-y-2">
                <label className="text-muted-foreground text-sm font-medium">
                  Quick Suggestions:
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => form.setValue('query', suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {searchHistory.length > 0 && (
              <div className="space-y-2">
                <label className="text-muted-foreground text-sm font-medium">
                  Recent Searches:
                </label>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((query, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => form.setValue('query', query)}
                      className="text-xs"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="mt-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !form.watch('query')?.trim()}
            >
              {isPending ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Start AI Research
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function SearchResultsPanel({
  results,
  courseId,
}: {
  results: TempFinding[];
  courseId: string;
}) {
  const { mutate: saveFinding, isPending } = useSaveFinding();
  const [sortBy, setSortBy] = useState<'relevance' | 'title'>('relevance');
  const [filterTag, setFilterTag] = useState<string>('all');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    results.forEach((result) => {
      result.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [results]);

  const filteredAndSortedResults = useMemo(() => {
    let filtered = results;

    if (filterTag !== 'all') {
      filtered = results.filter((result) => result.tags?.includes(filterTag));
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'relevance') {
        return (b.relevance || 0) - (a.relevance || 0);
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  }, [results, sortBy, filterTag]);

  const handleSave = (finding: TempFinding) => {
    saveFinding(
      { courseId, finding },
      {
        onSuccess: () =>
          toast.success('📚 Finding saved to your research board!'),
        onError: (err) => toast.error(`Failed to save: ${err.message}`),
      }
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (results.length === 0) return null;

  return (
    <Card className="">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Search Results ({filteredAndSortedResults.length})
            </CardTitle>
            <CardDescription>
              AI-curated sources ranked by relevance and credibility
            </CardDescription>
          </div>

          <div className="flex gap-2">
            {allTags.length > 0 && (
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select
              value={sortBy}
              onValueChange={(value: 'relevance' | 'title') => setSortBy(value)}
            >
              <SelectTrigger className="">
                {sortBy === 'relevance' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <SortAsc className="h-4 w-4" />
                )}
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredAndSortedResults.map((result, i) => (
          <Card key={i} className="group transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0 flex-1 overflow-hidden">
                  <CardTitle className="group-hover:text-primary truncate text-base transition-colors">
                    {result.title}
                  </CardTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      <Globe className="mr-1 h-3 w-3" />
                      {result.source}
                    </Badge>

                    {result.relevance && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="text-xs">
                              <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {result.relevance}%
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>AI Relevance Score</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>

                {result.url && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="shrink-0"
                        >
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open source</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-muted-foreground line-clamp-3 text-sm">
                {result.description}
              </p>

              {result.tags && result.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {result.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      <Hash className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => handleSave(result)}
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                Save to Board
              </Button>

              <div className="flex w-full gap-2 sm:w-auto">
                {result.url && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(result.url!)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy URL</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            `${result.title}\n${result.description}\n${result.url || ''}`
                          )
                        }
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share finding</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function FindingCard({ finding }: { finding: ResearchFinding }) {
  const { mutate: deleteFinding } = useDeleteFinding();
  const { mutate: summarizeFinding, isPending: isSummarizing } =
    useSummarizeFinding();
  const { mutate: updateNotes, isPending: isUpdatingNotes } =
    useUpdateFindingNotes();

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteText, setNoteText] = useState(finding.userNotes || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSaveNotes = () => {
    updateNotes(
      { findingId: finding.id, userNotes: noteText },
      {
        onSuccess: () => {
          setIsEditingNotes(false);
          toast.success('Notes updated successfully!');
        },
        onError: (err) => toast.error(`Failed to update notes: ${err.message}`),
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this finding?')) {
      deleteFinding(finding.id, {
        onSuccess: () => toast.success('Finding deleted successfully!'),
        onError: (err) => toast.error(`Failed to delete: ${err.message}`),
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <Card className="group transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="group-hover:text-primary line-clamp-2 text-base transition-colors">
              {finding.title}
            </CardTitle>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {finding.source && (
                <Badge variant="secondary" className="text-xs">
                  <Globe className="mr-1 h-3 w-3" />
                  {finding.source}
                </Badge>
              )}

              {finding.relevance && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {finding.relevance}% match
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI Relevance Score</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(new Date(finding.createdAt), 'MMM d')}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Added on {format(new Date(finding.createdAt), 'PPP')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex gap-1">
            {finding.url && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={finding.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open source</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <span className="sr-only">More options</span>⋮
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => copyToClipboard(finding.url || '')}
                >
                  <Copy className="h-4 w-4" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    copyToClipboard(
                      `${finding.title}\n${finding.description}\n${finding.url || ''}`
                    )
                  }
                >
                  <Share2 className="h-4 w-4" />
                  Share Finding
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p
            className={`text-muted-foreground text-sm ${!isExpanded && 'line-clamp-3'}`}
          >
            {finding.description}
          </p>
          {finding.description && finding.description.length > 150 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-auto p-0 text-xs"
            >
              {isExpanded ? (
                <>
                  <EyeOff className="mr-1 h-3 w-3" />
                  Show less
                </>
              ) : (
                <>
                  <Eye className="mr-1 h-3 w-3" />
                  Read more
                </>
              )}
            </Button>
          )}
        </div>

        {finding.aiSummary && (
          <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3 dark:bg-blue-950">
            <div className="mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                AI Summary
              </span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {finding.aiSummary}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              My Notes
            </label>
            {!isEditingNotes && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditingNotes(true);
                  setNoteText(finding.userNotes || '');
                }}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isEditingNotes ? (
            <div className="space-y-2">
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add your notes about this finding..."
                className="min-h-20"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={isUpdatingNotes}
                >
                  <Save className="h-4 w-4" />
                  {isUpdatingNotes ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditingNotes(false);
                    setNoteText(finding.userNotes || '');
                  }}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-muted/30 min-h-12 rounded-md p-3">
              {finding.userNotes ? (
                <p className="text-sm whitespace-pre-wrap">
                  {finding.userNotes}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  Click the edit button to add your notes...
                </p>
              )}
            </div>
          )}
        </div>

        {finding.tags && finding.tags.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Tag className="h-4 w-4" />
              Tags
            </label>
            <div className="flex flex-wrap gap-1">
              {finding.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Hash className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 sm:flex-row">
        <Button
          onClick={() => summarizeFinding(finding.id)}
          disabled={isSummarizing || !finding.url}
          variant={finding.aiSummary ? 'outline' : 'default'}
          className="w-full sm:w-auto"
        >
          <Sparkles className="h-4 w-4" />
          {isSummarizing
            ? 'Generating...'
            : finding.aiSummary
              ? 'Re-summarize'
              : 'AI Summary'}
        </Button>
      </CardFooter>
    </Card>
  );
}

function ResearchBoardPanel({ courseId }: { courseId: string }) {
  const { data: board, isLoading } = useGetResearchBoard(courseId);
  const { mutate: deleteFinding } = useDeleteFinding();
  const { mutate: summarizeFinding, isPending: isSummarizing } =
    useSummarizeFinding();

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>My Research Board</CardTitle>
        <CardDescription>Your saved findings for this course.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {board?.findings.map((finding) => (
          <Card key={finding.id}>
            <CardHeader>
              <CardTitle className="text-base">{finding.title}</CardTitle>
              <a
                href={finding.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-xs hover:underline"
              >
                {finding.source}
              </a>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground text-sm">
                {finding.description}
              </p>
              {finding.aiSummary && (
                <p className="border-primary border-l-2 pl-2 text-sm italic">
                  {finding.aiSummary}
                </p>
              )}
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => summarizeFinding(finding.id)}
                disabled={isSummarizing || !finding.url}
              >
                <Sparkles className="h-4 w-4" />{' '}
                {isSummarizing ? 'Summarizing...' : 'AI Summary'}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteFinding(finding.id)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
        {board?.findings.length === 0 && (
          <p className="text-muted-foreground text-center text-sm">
            Save findings from your research to see them here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function ResearchTab({ courseId }: { courseId?: string }) {
  const [searchResults, setSearchResults] = useState<TempFinding[]>([]);

  if (!courseId) {
    return <p>Please select a course to begin your research.</p>;
  }

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-1">
        <ResearchQueryPanel
          setSearchResults={setSearchResults}
          courseId={courseId}
        />
        <SearchResultsPanel results={searchResults} courseId={courseId} />
      </div>
      <div className="lg:col-span-2">
        <ResearchBoardPanel courseId={courseId} />
      </div>
    </div>
  );
}

export function ResearchTabSkeleton() {
  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-1">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <div className="lg:col-span-2">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
