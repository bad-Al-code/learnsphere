'use client';

import {
  Activity,
  AlertCircle,
  Bot,
  CheckCircle,
  Clock,
  Hash,
  Heart,
  HelpCircle,
  Info,
  Loader,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Users,
  Wifi,
  WifiOff,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CourseSelectionScreen } from '@/features/ai-tools/_components/common/CourseSelectionScrren';
import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { useCommunityInsights } from '../hooks';
import {
  useDiscussions,
  useDownvoteDiscussion,
  useReactToDiscussion,
  useUpvoteDiscussion,
} from '../hooks/use-discussions';
import { Discussion, ReactionType } from '../schema';

function DiscussionsHeader() {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input placeholder="Search discussions..." className="pl-9" />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="shrink-0">
            <Hash className="h-4 w-4" />
            <span className="hidden md:inline">Filter by Tag</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="md:hidden">
          <p>Filter by Tag</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="shrink-0">
            <Bot className="h-4 w-4" />
            <span className="hidden md:inline">AI Suggested Topics</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="md:hidden">
          <p>AI Suggested Topics</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">New Discussion</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="md:hidden">
          <p>New Discussion</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function InsightsErrorBoundary({
  error,
  onRetry,
  isRetrying,
  failureCount,
}: {
  error: Error;
  onRetry: () => void;
  isRetrying: boolean;
  failureCount: number;
}) {
  const isNetworkError =
    error.message.toLowerCase().includes('network') ||
    error.message.toLowerCase().includes('fetch') ||
    !navigator.onLine;

  const isServerError =
    error.message.toLowerCase().includes('server') ||
    error.message.toLowerCase().includes('500') ||
    error.message.toLowerCase().includes('502') ||
    error.message.toLowerCase().includes('503');

  const isClientError =
    error.message.includes('400') ||
    error.message.includes('401') ||
    error.message.includes('403');

  return (
    <Card className="from-muted/50 to-muted/0 border-destructive/20 bg-gradient-to-r">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2 text-base">
          {isNetworkError ? (
            <WifiOff className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          AI Community Insights
          {failureCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {failureCount} failed attempts
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <div>
              {isNetworkError
                ? 'Network connection issue. Please check your internet connection.'
                : isServerError
                  ? 'Server temporarily unavailable. Our team has been notified.'
                  : isClientError
                    ? 'Authentication or permission error. Please refresh the page.'
                    : error.message ||
                      'Something went wrong while loading insights.'}
            </div>

            {failureCount > 2 && (
              <div className="text-muted-foreground text-xs">
                Multiple attempts failed. The service may be experiencing
                issues.
              </div>
            )}
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Last attempt: {new Date().toLocaleTimeString()}</span>
          </div>

          {!isClientError && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              disabled={isRetrying}
              className="flex items-center gap-2"
            >
              {isRetrying ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          {navigator.onLine ? (
            <div className="flex items-center gap-2 text-green-600">
              <Wifi className="h-4 w-4" />
              <span>Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <WifiOff className="h-4 w-4" />
              <span>Offline</span>
            </div>
          )}
        </div>

        {!isClientError && (
          <div className="text-muted-foreground space-y-2 text-sm">
            <p className="font-medium">Troubleshooting tips:</p>
            <ul className="list-inside list-disc space-y-1 text-xs">
              {isNetworkError && (
                <>
                  <li>Check your internet connection</li>
                  <li>Try refreshing the page</li>
                  <li>Disable VPN if you're using one</li>
                </>
              )}
              {isServerError && (
                <>
                  <li>Try again in a few minutes</li>
                  <li>The issue should resolve automatically</li>
                  <li>Check our status page for updates</li>
                </>
              )}
              <li>Contact support if the problem persists</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ConnectionStatus({
  isOnline,
  lastUpdate,
}: {
  isOnline: boolean;
  lastUpdate?: Date;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
      />
      <span className="text-muted-foreground">
        {isOnline ? 'Live' : 'Offline'}
        {lastUpdate && ` • Updated ${lastUpdate.toLocaleTimeString()}`}
      </span>
    </div>
  );
}

function DataFreshnessIndicator({
  dataUpdatedAt,
  isStale,
}: {
  dataUpdatedAt: number;
  isStale: boolean;
}) {
  const lastUpdate = new Date(dataUpdatedAt);
  const now = new Date();
  const diffMinutes = Math.floor(
    (now.getTime() - lastUpdate.getTime()) / (1000 * 60)
  );

  const getFreshnessColor = () => {
    if (diffMinutes < 5) return 'text-green-600';
    if (diffMinutes < 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFreshnessText = () => {
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const hours = Math.floor(diffMinutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="flex items-center gap-1 text-xs">
      <Clock className={`h-3 w-3 ${getFreshnessColor()}`} />
      <span className={getFreshnessColor()}>{getFreshnessText()}</span>
      {isStale && (
        <Badge variant="outline" className="text-xs">
          Updating...
        </Badge>
      )}
    </div>
  );
}

function AiCommunityInsights() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const queryClient = useQueryClient();

  const {
    data: insights,
    isLoading,
    isError,
    error,
    isFetching,
    isRefetching,
    refetch,
    dataUpdatedAt,
    failureCount,
    failureReason,
    isStale,
    isSuccess,
    isPending,
    isRefetchError,
    isLoadingError,
  } = useCommunityInsights();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['community-insights'] });
  };

  const handleBackgroundRefresh = () => {
    refetch();
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    if (!autoRefresh) {
      queryClient.invalidateQueries({ queryKey: ['community-insights'] });
    }
  };

  if (isLoading || isPending) {
    return <AiCommunityInsightsSkeleton />;
  }

  if (!isError && error) {
    return (
      <InsightsErrorBoundary
        error={error as Error}
        onRetry={handleRefresh}
        isRetrying={isFetching}
        failureCount={failureCount}
      />
    );
  }

  if (!insights) {
    return (
      <Card className="from-muted/50 to-muted/0 bg-gradient-to-r">
        <CardContent className="flex items-center justify-center py-8">
          <div className="space-y-2 text-center">
            <Bot className="text-muted-foreground mx-auto h-8 w-8" />
            <p className="text-muted-foreground text-sm">
              No insights available
            </p>

            <Button size="sm" variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
              Load Data
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="from-muted/50 to-muted/0 relative overflow-hidden bg-gradient-to-r">
      {(isFetching || isRefetching) && (
        <div className="bg-primary/20 absolute top-0 right-0 left-0 h-1">
          <div className="bg-primary h-full animate-pulse" />
        </div>
      )}

      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot
              className={`h-5 w-5 ${isFetching ? 'text-primary animate-pulse' : ''}`}
            />
            AI Community Insights
            {isSuccess && (
              <Badge variant="default" className="text-xs">
                <CheckCircle className="h-3 w-3" />
                Active
              </Badge>
            )}
            {isRefetchError && (
              <Badge variant="destructive" className="text-xs">
                <XCircle className="mr-1 h-3 w-3" />
                Stale
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center gap-2">
            {failureCount > 0 && (
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous attempts failed ({failureCount})</p>
                  {failureReason && (
                    <p className="text-xs">{failureReason.message}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleAutoRefresh}
                  className={`h-8 w-8 p-0 ${autoRefresh ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {autoRefresh ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Activity className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Auto-refresh: {autoRefresh ? 'On' : 'Off'}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleBackgroundRefresh}
                  disabled={isFetching}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFetching ? 'Refreshing...' : 'Refresh data'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <ConnectionStatus isOnline={navigator.onLine} />
          {dataUpdatedAt && (
            <DataFreshnessIndicator
              dataUpdatedAt={dataUpdatedAt}
              isStale={isStale}
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-2 text-center sm:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <HelpCircle className="text-muted-foreground h-4 w-4" />
              <p className="text-2xl font-bold">{insights.questionsAnswered}</p>
            </div>
            <p className="text-muted-foreground text-xs">Questions Answered</p>
            {isStale && (
              <div className="flex items-center justify-center gap-1 text-xs text-yellow-600">
                <Clock className="h-3 w-3" />
                Updating...
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="text-muted-foreground h-4 w-4" />
              <p className="text-2xl font-bold">
                {insights.activeDiscussions.toLocaleString()}
              </p>
            </div>
            <p className="text-muted-foreground text-xs">Active Discussions</p>
            {insights.activeDiscussions > 1000 && (
              <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                High Activity
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Users className="text-muted-foreground h-4 w-4" />
              <p className="text-2xl font-bold">
                {insights.communityMembers.toLocaleString()}
              </p>
            </div>
            <p className="text-muted-foreground text-xs">Community Members</p>
            {insights.communityMembers > 5000 && (
              <Badge variant="secondary" className="text-xs">
                Large Community
              </Badge>
            )}
          </div>
        </div>

        <div className="border-border/50 flex items-center justify-between border-t pt-2">
          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <span>
              Query Status:{' '}
              {isSuccess ? 'Success' : isError ? 'Error' : 'Loading'}
            </span>
            {isFetching && <span>• Syncing...</span>}
            {isRefetching && <span>• Refreshing...</span>}
          </div>

          <div className="text-muted-foreground text-xs">
            Fetched:{' '}
            {dataUpdatedAt
              ? new Date(dataUpdatedAt).toLocaleTimeString()
              : 'Never'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DiscussionCardError({ error }: { error: Error }) {
  return (
    <Card className="border-destructive">
      <CardContent className="pt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load discussion: {error.message}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

interface VoteButtonsProps {
  messageId: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'upvote' | 'downvote' | null;
}

function VoteButtons({
  messageId,
  upvotes,
  downvotes,
  userVote,
}: VoteButtonsProps) {
  const {
    mutate: upvote,
    isPending: isUpvoting,
    isError: isUpvoteError,
  } = useUpvoteDiscussion();
  const {
    mutate: downvote,
    isPending: isDownvoting,
    isError: isDownvoteError,
  } = useDownvoteDiscussion();

  const handleUpvote = () => {
    upvote(messageId);
  };

  const handleDownvote = () => {
    downvote(messageId);
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={userVote === 'upvote' ? 'default' : 'ghost'}
            size="sm"
            className="flex items-center gap-1 px-2"
            onClick={handleUpvote}
            disabled={isUpvoting || isDownvoting}
          >
            {isUpvoting ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <ThumbsUp
                className={`h-4 w-4 ${userVote === 'upvote' ? 'fill-current' : ''}`}
              />
            )}
            <span className={isUpvoteError ? 'text-destructive' : ''}>
              {upvotes}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Upvote this discussion</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={userVote === 'downvote' ? 'default' : 'ghost'}
            size="sm"
            className="flex items-center gap-1 px-2"
            onClick={handleDownvote}
            disabled={isUpvoting || isDownvoting}
          >
            {isDownvoting ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <ThumbsDown
                className={`h-4 w-4 ${userVote === 'downvote' ? 'fill-current' : ''}`}
              />
            )}
            <span className={isDownvoteError ? 'text-destructive' : ''}>
              {downvotes}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Downvote this discussion</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

const reactionIcons: { [key: string]: React.ElementType } = {
  Star,
  Heart,
  Sparkles,
};

const EMOJI_REACTIONS: { emoji: ReactionType; icon: React.ElementType }[] = [
  { emoji: 'star', icon: Star },
  { emoji: 'heart', icon: Heart },
  { emoji: 'sparkles', icon: Sparkles },
];

interface EmojiReactionsProps {
  messageId: string;
  reactions: { emoji: string; count: number; color: string }[];
  userReaction?: string | null;
}

function EmojiReactions({
  messageId,
  reactions,
  userReaction,
}: EmojiReactionsProps) {
  const { mutate: react, isPending, variables } = useReactToDiscussion();
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const handleReaction = (emoji: ReactionType) => {
    react(
      { messageId, reaction: emoji },
      {
        onSuccess: () => setShowReactionPicker(false),
      }
    );
  };

  const getReactionCount = (emoji: string) => {
    const reaction = reactions.find((r) => r.emoji === emoji);
    return reaction?.count || 0;
  };

  return (
    <div className="flex items-center gap-2">
      {reactions.map((r) => {
        const Icon = reactionIcons[r.emoji];
        if (!Icon) return null;

        const isUserReaction = userReaction === r.emoji.toLowerCase();
        const isPendingThis =
          isPending && variables?.reaction === r.emoji.toLowerCase();

        return (
          <Tooltip key={r.emoji}>
            <TooltipTrigger asChild>
              <Button
                variant={isUserReaction ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center gap-1 px-2"
                onClick={() =>
                  handleReaction(r.emoji.toLowerCase() as ReactionType)
                }
                disabled={isPending}
              >
                {isPendingThis ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon
                    className={`h-4 w-4 ${isUserReaction ? 'fill-current' : r.color}`}
                  />
                )}
                <span>{r.count}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>React with {r.emoji}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}

      {reactions.length < 3 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                disabled={isPending}
              >
                <span className="text-lg">+</span>
              </Button>
              {showReactionPicker && (
                <div className="bg-background absolute bottom-full left-0 mb-2 flex gap-1 rounded-md border p-2 shadow-lg">
                  {EMOJI_REACTIONS.map(({ emoji, icon: Icon }) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleReaction(emoji)}
                      disabled={isPending}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add reaction</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

interface AISummaryButtonProps {
  discussionId: string;
}

function AISummaryButton({ discussionId }: AISummaryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetSummary = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSummary(
        'This discussion explores the key concepts of React hooks and their practical applications in modern web development.'
      );
    } catch (err) {
      setError('Failed to generate AI summary');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={handleGetSummary}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Info className="h-4 w-4" />
            )}
            <span className="ml-1">AI Summary</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Get AI-generated summary of this discussion</p>
        </TooltipContent>
      </Tooltip>

      {summary && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>{summary}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

interface ViewDiscussionButtonProps {
  discussionId: string;
  onViewDiscussion?: (discussionId: string) => void;
}

function ViewDiscussionButton({
  discussionId,
  onViewDiscussion,
}: ViewDiscussionButtonProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleViewDiscussion = async () => {
    setIsNavigating(true);

    try {
      if (onViewDiscussion) {
        onViewDiscussion(discussionId);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Navigate to discussion:', discussionId);
      }
    } catch (err) {
      console.error('Navigation failed:', err);
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none"
          onClick={handleViewDiscussion}
          disabled={isNavigating}
        >
          {isNavigating ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <MessageSquare className="h-4 w-4" />
          )}
          <span className="ml-1">View Discussion</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>View full discussion thread</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface ReplyButtonProps {
  discussionId: string;
  onReply?: (discussionId: string) => void;
}

function ReplyButton({ discussionId, onReply }: ReplyButtonProps) {
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = () => {
    setIsReplying(true);
    if (onReply) {
      onReply(discussionId);
    } else {
      console.log('Open reply form for:', discussionId);
    }
    setIsReplying(false);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReply}
          disabled={isReplying}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="ml-1">Reply</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Reply to this discussion</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface DiscussionContentProps {
  content: string;
  tags?: string[] | null;
}

function DiscussionContent({ content, tags }: DiscussionContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsExpansion = content.length > 300;

  return (
    <div className="space-y-3">
      <p
        className={`text-muted-foreground text-sm sm:text-base ${
          !isExpanded && needsExpansion ? 'line-clamp-3' : ''
        }`}
      >
        {content}
      </p>

      {needsExpansion && (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

interface DiscussionHeaderProps {
  discussion: Discussion;
}

function DiscussionHeader({ discussion }: DiscussionHeaderProps) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold sm:text-base">
        {discussion.isStarred && (
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        )}
        {discussion.title}
      </h3>

      <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {discussion.authorInitials}
          </AvatarFallback>
        </Avatar>
        <p className="text-primary font-medium">{discussion.author}</p>
        <Badge variant="secondary" className="text-xs">
          {discussion.role}
        </Badge>
        <span>•</span>
        <p>
          {formatDistanceToNow(new Date(discussion.timestamp), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
}

interface DiscussionCardProps {
  discussion: Discussion;
  onViewDiscussion?: (discussionId: string) => void;
  onReply?: (discussionId: string) => void;
}

export default function DiscussionCard({
  discussion,
  onViewDiscussion,
  onReply,
}: DiscussionCardProps) {
  if (!discussion) {
    return <DiscussionCardError error={new Error('Discussion not found')} />;
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="w-full space-y-3">
            <DiscussionHeader discussion={discussion} />
            <DiscussionContent
              content={discussion.content}
              tags={discussion.tags}
            />

            <div className="text-muted-foreground flex flex-wrap items-center gap-4 border-t pt-3 text-sm">
              <VoteButtons
                messageId={discussion.id}
                upvotes={discussion.upvotes}
                downvotes={discussion.downvotes}
              />

              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{discussion.replies} replies</span>
              </div>

              <EmojiReactions
                messageId={discussion.id}
                reactions={discussion.reactions}
              />

              <div className="ml-auto flex flex-wrap gap-2">
                <AISummaryButton discussionId={discussion.id} />
                <ViewDiscussionButton
                  discussionId={discussion.id}
                  onViewDiscussion={onViewDiscussion}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DiscussionsTab({ courseId }: { courseId?: string }) {
  if (!courseId) {
    return (
      <div className="h-[calc(100vh-12.5rem)]">
        <CourseSelectionScreen />
      </div>
    );
  }

  const {
    data: discussionsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useDiscussions(courseId);

  if (isLoading) {
    return <DiscussionsTabSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Failed to load discussions: {error?.message || 'Unknown error'}
            </span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!discussionsData || discussionsData.length === 0) {
    return (
      <div className="space-y-2">
        <Separator className="border-dashed" />
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No discussions yet</h3>
          <p className="text-muted-foreground text-sm">
            Be the first to start a discussion in this course!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <DiscussionsHeader />
      <AiCommunityInsights />
      <Separator className="border-dashed" />
      <div className="space-y-2">
        {discussionsData?.map((d) => (
          <DiscussionCard key={d.id} discussion={d} />
        ))}
      </div>
    </div>
  );
}

export function DiscussionsTabSkeleton() {
  return (
    <div className="space-y-2">
      <DiscussionsHeaderSkeleton />
      <AiCommunityInsightsSkeleton />
      <Separator className="border-dashed" />
      <div className="space-y-2">
        <DiscussionCardSkeleton />
        <DiscussionCardSkeleton />
        <DiscussionCardSkeleton />
      </div>
    </div>
  );
}

function DiscussionsHeaderSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-10 md:w-32" />
      <Skeleton className="h-10 w-10 md:w-44" />
      <Skeleton className="h-10 w-10 md:w-36" />
    </div>
  );
}

function AiCommunityInsightsSkeleton() {
  return (
    <Card className="from-muted/50 to-muted/0 bg-gradient-to-r">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-5 w-5 animate-pulse" />
            <Skeleton className="h-5 w-48" />
          </CardTitle>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32" />
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-2 text-center sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="mx-auto h-4 w-24" />
              <Skeleton className="mx-auto h-3 w-20" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DiscussionCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="w-full flex-1 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-16 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
